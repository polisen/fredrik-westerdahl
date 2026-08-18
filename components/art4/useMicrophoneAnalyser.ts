import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';

export type MicrophoneAnalyserStatus =
  | 'idle'
  | 'requesting'
  | 'listening'
  | 'denied'
  | 'error';

export type MicrophoneSpectrumProfile = 'voice' | 'music';

export type MicrophoneAnalyserSnapshot = {
  bass: number;
  /** Mid-band energy tuned for speech (fundamental + formants). */
  voice: number;
  energy: number;
  /** Positive spectral change — voice flux or bass flux depending on profile. */
  flux: number;
  /** Spectrum split into bandCount buckets (0–1 each). Range depends on profile. */
  bands: number[];
  isActive: boolean;
};

export type MusicEqBand = {
  label: string;
  binStart: number;
  binEnd: number;
};

export type UseMicrophoneAnalyserOptions = {
  fftSize?: number;
  smoothingTimeConstant?: number;
  /** Per-profile analyser smoothing (updates live when profileRef changes). */
  smoothingByProfile?: Partial<Record<MicrophoneSpectrumProfile, number>>;
  /** Inclusive upper bin index for bass average. */
  bassBinEnd?: number;
  /** Inclusive voice band bin range (speech-focused). */
  voiceBinStart?: number;
  voiceBinEnd?: number;
  /** Voice profile: bands aligned to charset depth layers. */
  voiceBandCount?: number;
  /** Music profile: fixed EQ zones (typically 3–5 bands). */
  musicEqBands?: readonly MusicEqBand[];
  /** @deprecated Use voiceBandCount */
  bandCount?: number;
  /** Read each sample — switch voice vs music spectrum without restarting mic. */
  profileRef?: MutableRefObject<MicrophoneSpectrumProfile>;
};

export type UseMicrophoneAnalyserReturn = {
  snapshotRef: MutableRefObject<MicrophoneAnalyserSnapshot>;
  status: MicrophoneAnalyserStatus;
  error: string | null;
  isSupported: boolean;
  start: () => Promise<void>;
  stop: () => void;
};

function createEmptyBands(count: number) {
  return Array.from({ length: count }, () => 0);
}

function createDefaultSnapshot(bandCount: number): MicrophoneAnalyserSnapshot {
  return {
    bass: 0,
    voice: 0,
    energy: 0,
    flux: 0,
    bands: createEmptyBands(bandCount),
    isActive: false,
  };
}

function normalizeByte(value: number) {
  return value / 255;
}

function averageBins(buffer: Uint8Array, start: number, end: number) {
  const lo = Math.max(0, start);
  const hi = Math.min(end, buffer.length - 1);
  if (hi < lo) return 0;

  let sum = 0;
  for (let i = lo; i <= hi; i++) {
    sum += buffer[i] ?? 0;
  }
  return normalizeByte(sum / (hi - lo + 1));
}

function computeVoiceBands(
  buffer: Uint8Array,
  voiceBinStart: number,
  voiceBinEnd: number,
  bandCount: number,
  out: number[]
) {
  const start = Math.max(0, voiceBinStart);
  const end = Math.min(voiceBinEnd, buffer.length - 1);
  if (end <= start || bandCount <= 0) {
    out.fill(0);
    return;
  }

  const span = end - start + 1;
  for (let band = 0; band < bandCount; band++) {
    const lo = start + Math.floor((band * span) / bandCount);
    const hi = start + Math.floor(((band + 1) * span) / bandCount) - 1;
    out[band] = averageBins(buffer, lo, Math.max(lo, hi));
  }
}

function computeMusicEqBands(
  buffer: Uint8Array,
  eqBands: readonly MusicEqBand[],
  out: number[]
) {
  for (let i = 0; i < eqBands.length; i++) {
    const band = eqBands[i];
    out[i] = averageBins(
      buffer,
      band.binStart,
      Math.min(band.binEnd, buffer.length - 1)
    );
  }
  for (let i = eqBands.length; i < out.length; i++) {
    out[i] = 0;
  }
}

function ensureBandsBuffer(ref: MutableRefObject<number[]>, size: number) {
  if (ref.current.length === size) return;
  ref.current = createEmptyBands(size);
}

export function useMicrophoneAnalyser(
  options: UseMicrophoneAnalyserOptions = {}
): UseMicrophoneAnalyserReturn {
  const {
    fftSize = 2048,
    smoothingTimeConstant = 0.75,
    smoothingByProfile,
    bassBinEnd = 9,
    voiceBinStart = 3,
    voiceBinEnd = 58,
    voiceBandCount: voiceBandCountOption,
    musicEqBands = [],
    bandCount: legacyBandCount,
    profileRef,
  } = options;

  const voiceBandCount = voiceBandCountOption ?? legacyBandCount ?? 9;
  const musicBandCount = musicEqBands.length || voiceBandCount;
  const maxBandCount = Math.max(voiceBandCount, musicBandCount);

  const [status, setStatus] = useState<MicrophoneAnalyserStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const bandsBufferRef = useRef<number[]>(createEmptyBands(maxBandCount));
  const snapshotRef = useRef<MicrophoneAnalyserSnapshot>(
    createDefaultSnapshot(maxBandCount)
  );
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frequencyDataRef = useRef<Uint8Array | null>(null);
  const frameIdRef = useRef(0);
  const prevVoiceRef = useRef(0);
  const prevBassRef = useRef(0);
  const activeProfileRef = useRef<MicrophoneSpectrumProfile>('voice');

  const resolveSmoothing = useCallback(
    (profile: MicrophoneSpectrumProfile) =>
      smoothingByProfile?.[profile] ?? smoothingTimeConstant,
    [smoothingByProfile, smoothingTimeConstant]
  );

  const applyAnalyserSmoothing = useCallback(
    (profile: MicrophoneSpectrumProfile) => {
      const analyser = analyserRef.current;
      if (!analyser) return;
      analyser.smoothingTimeConstant = resolveSmoothing(profile);
      activeProfileRef.current = profile;
    },
    [resolveSmoothing]
  );

  const isSupported =
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices !== 'undefined' &&
    typeof window !== 'undefined' &&
    'AudioContext' in window;

  useEffect(() => {
    bandsBufferRef.current = createEmptyBands(maxBandCount);
    snapshotRef.current = createDefaultSnapshot(maxBandCount);
  }, [maxBandCount]);

  const cleanup = useCallback(() => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = 0;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    analyserRef.current = null;
    frequencyDataRef.current = null;

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    prevVoiceRef.current = 0;
    prevBassRef.current = 0;
    snapshotRef.current = createDefaultSnapshot(maxBandCount);
  }, [maxBandCount]);

  const stop = useCallback(() => {
    cleanup();
    setStatus('idle');
    setError(null);
  }, [cleanup]);

  const sample = useCallback(() => {
    const analyser = analyserRef.current;
    const buffer = frequencyDataRef.current;
    if (!analyser || !buffer) return;

    analyser.getByteFrequencyData(buffer as unknown as Uint8Array<ArrayBuffer>);

    const bass = averageBins(buffer, 0, Math.min(bassBinEnd, buffer.length - 1));
    const voice = averageBins(
      buffer,
      voiceBinStart,
      Math.min(voiceBinEnd, buffer.length - 1)
    );

    const profile = profileRef?.current ?? 'voice';
    if (analyser && activeProfileRef.current !== profile) {
      applyAnalyserSmoothing(profile);
    }
    const activeBandCount =
      profile === 'music' ? musicBandCount : voiceBandCount;
    ensureBandsBuffer(bandsBufferRef, activeBandCount);
    const bandsOut = bandsBufferRef.current;

    if (profile === 'music' && musicEqBands.length > 0) {
      computeMusicEqBands(buffer, musicEqBands, bandsOut);
    } else {
      computeVoiceBands(
        buffer,
        voiceBinStart,
        voiceBinEnd,
        voiceBandCount,
        bandsOut
      );
    }

    let energySum = 0;
    for (let i = 0; i < buffer.length; i++) {
      energySum += buffer[i] ?? 0;
    }
    const energy = energySum / buffer.length / 255;

    const flux =
      profile === 'music'
        ? Math.max(0, bass - prevBassRef.current)
        : Math.max(0, voice - prevVoiceRef.current);
    prevBassRef.current = bass;
    prevVoiceRef.current = voice;

    snapshotRef.current = {
      bass,
      voice,
      energy,
      flux,
      bands: bandsOut.slice(0, activeBandCount),
      isActive: true,
    };
  }, [
    musicBandCount,
    musicEqBands,
    bassBinEnd,
    profileRef,
    voiceBandCount,
    voiceBinStart,
    voiceBinEnd,
    applyAnalyserSmoothing,
  ]);

  const tick = useCallback(() => {
    sample();
    frameIdRef.current = requestAnimationFrame(tick);
  }, [sample]);

  const start = useCallback(async () => {
    if (!isSupported) {
      setError('Microphone analysis is not supported in this browser.');
      setStatus('error');
      return;
    }

    stop();
    setStatus('requesting');
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      await audioContext.resume();

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = fftSize;
      const initialProfile = profileRef?.current ?? 'voice';
      analyser.smoothingTimeConstant = resolveSmoothing(initialProfile);
      activeProfileRef.current = initialProfile;
      analyserRef.current = analyser;
      frequencyDataRef.current = new Uint8Array(analyser.frequencyBinCount);

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      prevVoiceRef.current = 0;
      prevBassRef.current = 0;
      bandsBufferRef.current = createEmptyBands(maxBandCount);
      snapshotRef.current = {
        ...createDefaultSnapshot(maxBandCount),
        isActive: true,
      };

      setStatus('listening');
      frameIdRef.current = requestAnimationFrame(tick);
    } catch (err) {
      cleanup();
      const denied =
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');

      if (denied) {
        setError('Microphone access was denied. Check browser settings and try again.');
        setStatus('denied');
        return;
      }

      setError(
        err instanceof Error ? err.message : 'Could not access the microphone.'
      );
      setStatus('error');
    }
  }, [cleanup, fftSize, isSupported, maxBandCount, profileRef, resolveSmoothing, stop, tick]);

  useEffect(() => () => stop(), [stop]);

  return {
    snapshotRef,
    status,
    error,
    isSupported,
    start,
    stop,
  };
}
