'use client';

import { Mic, MicOff } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import AsciiWaveInteractive, {
  pushAsciiWaveRipple,
  type AsciiWaveAudioConfig,
  type AsciiWaveAudioState,
  type AsciiWaveInteractionConfig,
  type AsciiWaveInteractionState,
} from './AsciiWaveInteractive';
import { Art4FftDebugHud } from './Art4FftDebugHud';
import {
  ART4_MUSIC_EQ_BANDS,
  ART4_MUSIC_EQ_BAND_COUNT,
  ART4_MUSIC_EQ_LAYER_CENTERS,
} from './art4MusicEq';
import {
  useMicrophoneAnalyser,
  type MicrophoneSpectrumProfile,
} from './useMicrophoneAnalyser';
import { artTheme } from '@/lib/artTheme';
import { cn } from '@/lib/utils';

type Art4FullscreenArtProps = {
  className?: string;
  headerStart?: ReactNode;
};

export type Art4AudioMode = MicrophoneSpectrumProfile;
export type Art4Profile = 'voice' | 'music';
export type Art4Version = 1 | 2;

const ART4_FRAMES = 3000;

const ART4_BLUES = {
  deep: artTheme.secondary,
  light: artTheme.secondarySoft,
} as const;

const ART4_RIPPLE_PINK = artTheme.tertiary;
const ART4_CHAR_SET = '●◉◎◯◦○◌◍•∙· ';

const ART4_INTERACTION: AsciiWaveInteractionConfig = {
  rippleVelocity: 0.35,
  rippleMaxRadius: 0.82,
  rippleRingWidth: 0.095,
  rippleIntensity: 1.28,
  rippleWavelength: 20,
  rippleTrail: 0.82,
  hoverRadius: 0.12,
  hoverIntensity: 1.05,
  pressSwellRadius: 0,
  pressSwellIntensity: 0,
};

const ART4_AUDIO_DEPTH: AsciiWaveAudioConfig = {
  depthIntensity: 1.32,
  resonanceWidth: 0.95,
  bandFloor: 0.12,
};

const ART4_MUSIC_DEPTH: AsciiWaveAudioConfig = {
  depthIntensity: 1.38,
  resonanceWidth: 1.05,
  bandFloor: 0.03,
  bandLayerCenters: [...ART4_MUSIC_EQ_LAYER_CENTERS],
};

const ART4_VOICE_ENVELOPE = {
  attack: 30,
  release: 12,
  inputAttack: 16,
  inputRelease: 9,
  depthBiasScale: 2.2,
  gateThreshold: 0.12,
} as const;

const ART4_MUSIC_RIPPLES = {
  bandFloor: 0.045,
  baseCooldownMs: 170,
  cooldownScale: 0.8,
  strengthMin: 0.85,
  strengthMax: 1.65,
  centerSpread: 0.045,
  bassBandBoost: 1.5,
  bandLevelBoost: 1.18,
  bassFluxSensitivity: 0.035,
  bassFluxCooldownMs: 140,
  centerRippleWavelength: 9,
  centerRippleRingWidth: 0.115,
} as const;

function ease_quad_in_out(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function buildCharColors(charSet: string, start: string, end: string) {
  const len = charSet.length;
  if (len <= 1) return [start];

  return Array.from({ length: len }, (_, i) => {
    const t = i / (len - 1);
    return `color-mix(in srgb, ${start} ${Math.round((1 - t) * 100)}%, ${end})`;
  });
}

function emptyBands(count: number) {
  return Array.from({ length: count }, () => 0);
}

function lerp(min: number, max: number, t: number) {
  return min + (max - min) * t;
}

function centerSpawn(spread: number) {
  return {
    nx: 0.5 + (Math.random() - 0.5) * spread,
    ny: 0.5 + (Math.random() - 0.5) * spread,
  };
}

function gateVoiceLevel(value: number, threshold: number) {
  if (value <= threshold * 0.75) return 0;
  if (value >= threshold * 1.25) return value;

  const t = (value - threshold * 0.75) / (threshold * 0.5);
  const knee = t * t * (3 - 2 * t);
  return value * knee;
}

function expSmoothStep(
  current: number,
  target: number,
  rate: number,
  dt: number
) {
  const blend = 1 - Math.exp(-rate * dt);
  return current + (target - current) * blend;
}

/** Art 4 — music FFT ripples (debug heatmap default) + cursor interaction. */
export function Art4FullscreenArt({
  className,
  headerStart,
}: Art4FullscreenArtProps) {
  const voiceBandCount = ART4_CHAR_SET.length;
  const musicBandCount = ART4_MUSIC_EQ_BAND_COUNT;
  const [profile, setProfile] = useState<Art4Profile>('music');
  const [version, setVersion] = useState<Art4Version>(2);
  const mode = profile;
  const debugView = version === 2;
  const profileRef = useRef<Art4AudioMode>(profile);

  useEffect(() => {
    profileRef.current = mode;
  }, [mode]);

  const interactionRef = useRef<AsciiWaveInteractionState>({
    ripples: [],
    pointer: null,
    pressed: false,
  });

  const audioRef = useRef<AsciiWaveAudioState>({
    bands: emptyBands(voiceBandCount),
    isActive: false,
  });

  const voiceBandsRef = useRef(emptyBands(voiceBandCount));
  const voiceInputBandsRef = useRef(emptyBands(voiceBandCount));
  const voiceSmoothedLevelRef = useRef(0);
  const voiceDepthBiasRef = useRef(0);
  const musicDepthBandsRef = useRef(emptyBands(musicBandCount));
  const lastVoiceSyncAtRef = useRef(0);
  const lastMusicBandSpawnRef = useRef(emptyBands(musicBandCount));
  const lastBassFluxSpawnRef = useRef(0);

  const { snapshotRef, status, error, isSupported, start, stop } =
    useMicrophoneAnalyser({
      voiceBandCount,
      musicEqBands: ART4_MUSIC_EQ_BANDS,
      profileRef,
      smoothingByProfile: { voice: 0.38, music: 0.65 },
      voiceBinStart: 2,
      voiceBinEnd: 72,
    });

  const charColors = useMemo(
    () => buildCharColors(ART4_CHAR_SET, ART4_BLUES.deep, ART4_BLUES.light),
    []
  );

  const debugBandLabels = useMemo(
    () =>
      mode === 'music'
        ? ART4_MUSIC_EQ_BANDS.map((band) => band.label)
        : ART4_CHAR_SET.split(''),
    [mode]
  );

  useEffect(() => {
    voiceBandsRef.current = emptyBands(voiceBandCount);
    voiceInputBandsRef.current = emptyBands(voiceBandCount);
    voiceSmoothedLevelRef.current = 0;
    voiceDepthBiasRef.current = 0;
    musicDepthBandsRef.current = emptyBands(musicBandCount);
    lastMusicBandSpawnRef.current = emptyBands(musicBandCount);
    lastVoiceSyncAtRef.current = 0;
    lastBassFluxSpawnRef.current = 0;
    interactionRef.current.ripples = [];
    audioRef.current = {
      bands: emptyBands(mode === 'music' ? musicBandCount : voiceBandCount),
      isActive: false,
    };
  }, [mode, musicBandCount, voiceBandCount]);

  useEffect(() => {
    if (status !== 'listening') {
      voiceBandsRef.current = emptyBands(voiceBandCount);
      voiceInputBandsRef.current = emptyBands(voiceBandCount);
      voiceSmoothedLevelRef.current = 0;
      voiceDepthBiasRef.current = 0;
      lastVoiceSyncAtRef.current = 0;
      audioRef.current = {
        bands: emptyBands(mode === 'music' ? musicBandCount : voiceBandCount),
        depthBias: 0,
        isActive: false,
      };
      return;
    }

    let frameId = 0;

    const sync = (now: number) => {
      const snapshot = snapshotRef.current;
      if (!snapshot?.isActive) {
        frameId = requestAnimationFrame(sync);
        return;
      }

      if (mode === 'voice') {
        const dt =
          lastVoiceSyncAtRef.current > 0
            ? Math.min(0.05, (now - lastVoiceSyncAtRef.current) / 1000)
            : 1 / 60;
        lastVoiceSyncAtRef.current = now;

        const targets = snapshot.bands;
        const positions = voiceBandsRef.current;
        const inputBands = voiceInputBandsRef.current;
        const {
          attack,
          release,
          inputAttack,
          inputRelease,
          depthBiasScale,
          gateThreshold,
        } = ART4_VOICE_ENVELOPE;

        const rawVoice = snapshot.voice;
        voiceSmoothedLevelRef.current = expSmoothStep(
          voiceSmoothedLevelRef.current,
          rawVoice,
          rawVoice > voiceSmoothedLevelRef.current ? inputAttack : inputRelease,
          dt
        );
        const gatedVoice = gateVoiceLevel(
          voiceSmoothedLevelRef.current,
          gateThreshold
        );

        let bandEnergy = 0;
        for (let i = 0; i < voiceBandCount; i++) {
          const raw = targets[i] ?? 0;
          const smoothed = inputBands[i];
          inputBands[i] = expSmoothStep(
            smoothed,
            raw,
            raw > smoothed ? inputAttack : inputRelease,
            dt
          );
          const target = gateVoiceLevel(inputBands[i], gateThreshold);
          bandEnergy += target;
          const current = positions[i];
          const rate = target > current ? attack : release;
          positions[i] = expSmoothStep(current, target, rate, dt);
          if (positions[i] < 0) positions[i] = 0;
        }

        const voiceDrive =
          gatedVoice * 0.5 + (bandEnergy / Math.max(1, voiceBandCount)) * 0.5;
        const biasTarget = voiceDrive * depthBiasScale;
        const biasCurrent = voiceDepthBiasRef.current;
        const biasRate = biasTarget > biasCurrent ? attack : release;
        voiceDepthBiasRef.current = expSmoothStep(
          biasCurrent,
          biasTarget,
          biasRate,
          dt
        );
        if (voiceDepthBiasRef.current < 0) voiceDepthBiasRef.current = 0;

        audioRef.current = {
          bands: positions,
          depthBias: voiceDepthBiasRef.current,
          isActive: true,
        };
      } else {
        const { bandLevelBoost } = ART4_MUSIC_RIPPLES;
        const depthBands = musicDepthBandsRef.current;
        for (let i = 0; i < musicBandCount; i++) {
          depthBands[i] = Math.min(1, (snapshot.bands[i] ?? 0) * bandLevelBoost);
        }
        audioRef.current = {
          bands: depthBands,
          isActive: true,
        };

        const {
          bandFloor,
          baseCooldownMs,
          cooldownScale,
          strengthMin,
          strengthMax,
          centerSpread,
          bassBandBoost,
          bassFluxSensitivity,
          bassFluxCooldownMs,
          centerRippleWavelength,
          centerRippleRingWidth,
        } = ART4_MUSIC_RIPPLES;

        const centerRippleOptions = {
          wavelength: centerRippleWavelength,
          ringWidth: centerRippleRingWidth,
        };

        if (
          snapshot.flux > bassFluxSensitivity &&
          snapshot.bass > bandFloor &&
          now - lastBassFluxSpawnRef.current > bassFluxCooldownMs
        ) {
          lastBassFluxSpawnRef.current = now;
          const { nx, ny } = centerSpawn(centerSpread * 0.6);
          pushAsciiWaveRipple(
            interactionRef,
            nx,
            ny,
            lerp(strengthMin, strengthMax, Math.min(1, snapshot.bass * 1.5)) *
              bassBandBoost,
            centerRippleOptions
          );
        }

        for (let i = 0; i < musicBandCount; i++) {
          const level = snapshot.bands[i] ?? 0;
          if (level < bandFloor) continue;

          const cooldown = baseCooldownMs * Math.pow(cooldownScale, i);
          if (now - (lastMusicBandSpawnRef.current[i] ?? 0) < cooldown) continue;
          lastMusicBandSpawnRef.current[i] = now;

          const isLow = i <= 1;
          const boost = isLow
            ? bassBandBoost
            : 1 + (musicBandCount - 1 - i) * 0.06;
          const strength =
            lerp(strengthMin, strengthMax, Math.min(1, level * 1.28)) * boost;
          const { nx, ny } = centerSpawn(centerSpread);
          pushAsciiWaveRipple(
            interactionRef,
            nx,
            ny,
            strength,
            centerRippleOptions
          );
        }
      }

      frameId = requestAnimationFrame(sync);
    };

    frameId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(frameId);
  }, [mode, musicBandCount, snapshotRef, status, voiceBandCount]);

  const toggleMic = useCallback(async () => {
    if (status === 'listening') {
      stop();
      return;
    }
    await start();
  }, [start, status, stop]);

  const autoStartedRef = useRef(false);
  useEffect(() => {
    if (autoStartedRef.current || !isSupported) return;
    autoStartedRef.current = true;
    void start();
  }, [isSupported, start]);

  const isListening = status === 'listening';
  const isRequesting = status === 'requesting';

  const micTitle =
    error ??
    (isRequesting
      ? 'Requesting microphone…'
      : isListening
        ? 'Stop microphone'
        : 'Listen to microphone');

  return (
    <div className={cn('relative size-full overflow-hidden bg-black', className)}>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center gap-2 p-2">
        {headerStart ? (
          <div className="pointer-events-auto shrink-0">{headerStart}</div>
        ) : null}
        <div
          className="pointer-events-auto flex rounded-full border border-white/25 bg-zinc-900/90 p-0.5 backdrop-blur-sm"
          role="group"
          aria-label="Art 4 profile"
        >
          {(['voice', 'music'] as const).map((p) => {
            const selected = profile === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setProfile(p)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                  selected
                    ? 'bg-[#0046e0]/25 text-white'
                    : 'text-white/45 hover:text-white'
                )}
                aria-pressed={selected}
              >
                {p}
              </button>
            );
          })}
        </div>
        <div
          className="pointer-events-auto flex rounded-full border border-white/25 bg-zinc-900/90 p-0.5 backdrop-blur-sm"
          role="group"
          aria-label="Art 4 version"
        >
          {([1, 2] as const).map((v) => {
            const selected = version === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVersion(v)}
                className={cn(
                  'min-w-[2rem] rounded-full px-2.5 py-1.5 text-sm font-medium tabular-nums transition-colors',
                  selected
                    ? v === 2
                      ? 'bg-amber-200/20 text-white'
                      : 'bg-[#0046e0]/25 text-white'
                    : 'text-white/45 hover:text-white'
                )}
                aria-pressed={selected}
                aria-label={v === 2 ? 'Debug view' : 'ASCII view'}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      <AsciiWaveInteractive
        fill
        FRAMES={ART4_FRAMES}
        BLUR_STEPS={18}
        from={0}
        ease={ease_quad_in_out}
        charSet={ART4_CHAR_SET}
        charColors={charColors}
        interactionTintColor={ART4_RIPPLE_PINK}
        interactionTintStrength={0.88}
        interactionRef={interactionRef}
        interactionConfig={ART4_INTERACTION}
        audioRef={audioRef}
        audioConfig={mode === 'voice' ? ART4_AUDIO_DEPTH : ART4_MUSIC_DEPTH}
        visualMode={debugView ? 'debug' : 'ascii'}
        debugInvertDepth={debugView}
        className="opacity-90"
      />

      {debugView ? (
        <Art4FftDebugHud
          mode={mode}
          bandLabels={debugBandLabels}
          isListening={isListening}
          snapshotRef={snapshotRef}
          audioRef={audioRef}
        />
      ) : null}

      <button
        type="button"
        onClick={toggleMic}
        disabled={!isSupported || isRequesting}
        title={micTitle}
        className={cn(
          'absolute bottom-4 left-4 z-30 flex size-10 items-center justify-center rounded-full border backdrop-blur-sm transition-colors',
          isListening
            ? 'border-white/45 bg-white/15 text-white'
            : 'border-white/25 bg-zinc-900/90 text-white/45 hover:border-white/40 hover:text-white',
          error && 'border-red-400/50',
          (!isSupported || isRequesting) && 'opacity-50'
        )}
        aria-pressed={isListening}
        aria-label={isListening ? 'Stop microphone' : 'Listen to microphone'}
      >
        {isListening ? (
          <Mic className="h-5 w-5" />
        ) : (
          <MicOff className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
