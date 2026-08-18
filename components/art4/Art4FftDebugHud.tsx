'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState, type MutableRefObject } from 'react';
import type { AsciiWaveAudioState } from './AsciiWaveInteractive';
import type {
  MicrophoneAnalyserSnapshot,
  MicrophoneSpectrumProfile,
} from './useMicrophoneAnalyser';
import { cn } from '@/lib/utils';

type Art4FftDebugHudProps = {
  mode: MicrophoneSpectrumProfile;
  bandLabels: string[];
  isListening: boolean;
  snapshotRef: MutableRefObject<MicrophoneAnalyserSnapshot>;
  audioRef: MutableRefObject<AsciiWaveAudioState>;
};

type HudFrame = {
  rawBands: number[];
  appliedBands: number[];
  depthBias: number;
  bass: number;
  voice: number;
  energy: number;
  flux: number;
};

function BandRow({
  label,
  bands,
  bandLabels,
  accentClass,
  compact,
}: {
  label: string;
  bands: number[];
  bandLabels: string[];
  accentClass: string;
  compact?: boolean;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase tracking-wide text-white/45">{label}</p>
      <div className="flex items-end gap-0.5">
        {bands.map((level, i) => (
          <div
            key={`${label}-${i}`}
            className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
          >
            <div
              className={cn(
                'relative w-full overflow-hidden rounded-sm bg-black/50',
                compact ? 'h-10' : 'h-14'
              )}
            >
              <div
                className={cn('absolute inset-x-0 bottom-0 rounded-sm', accentClass)}
                style={{ height: `${Math.min(100, level * 100)}%` }}
              />
            </div>
            {!compact ? (
              <>
                <span
                  className="truncate text-[9px] text-white/45"
                  title={bandLabels[i] ?? String(i)}
                >
                  {bandLabels[i] ?? i}
                </span>
                <span className="font-mono text-[9px] text-white/45">
                  {level.toFixed(2)}
                </span>
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Collapsible FFT tuning HUD — pairs with debug heatmap. */
export function Art4FftDebugHud({
  mode,
  bandLabels,
  isListening,
  snapshotRef,
  audioRef,
}: Art4FftDebugHudProps) {
  const [expanded, setExpanded] = useState(false);
  const [frame, setFrame] = useState<HudFrame>({
    rawBands: [],
    appliedBands: [],
    depthBias: 0,
    bass: 0,
    voice: 0,
    energy: 0,
    flux: 0,
  });

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const snapshot = snapshotRef.current;
      const audio = audioRef.current;

      setFrame({
        rawBands: snapshot?.bands?.length ? [...snapshot.bands] : [],
        appliedBands: audio?.bands?.length ? [...audio.bands] : [],
        depthBias: audio?.depthBias ?? 0,
        bass: snapshot?.bass ?? 0,
        voice: snapshot?.voice ?? 0,
        energy: snapshot?.energy ?? 0,
        flux: snapshot?.flux ?? 0,
      });

      id = requestAnimationFrame(tick);
    };

    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [audioRef, snapshotRef]);

  const rawLabels =
    frame.rawBands.length > 0
      ? bandLabels.slice(0, frame.rawBands.length)
      : bandLabels;
  const appliedLabels =
    frame.appliedBands.length > 0
      ? bandLabels.slice(0, frame.appliedBands.length)
      : bandLabels;

  return (
    <div className="pointer-events-none absolute right-2 top-14 z-20">
      {!expanded ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="pointer-events-auto flex items-center gap-1.5 rounded-lg border border-white/15 bg-zinc-900/60 px-2.5 py-1.5 text-[10px] text-white/45 backdrop-blur-sm transition-colors hover:border-white/30 hover:bg-zinc-900/80 hover:text-white"
          aria-expanded={false}
        >
          <span className="font-medium text-white/80">FFT</span>
          <span className="font-mono">{frame.voice.toFixed(3)}</span>
          <span
            className={cn(
              'rounded px-1 py-px text-[9px]',
              isListening ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/15'
            )}
          >
            {isListening ? 'live' : 'idle'}
          </span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </button>
      ) : (
        <div className="pointer-events-auto w-72 rounded-xl border border-white/20 bg-zinc-900/90 p-2.5 shadow-lg backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium text-white">FFT · {mode}</p>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'rounded-full px-1.5 py-px text-[9px]',
                  isListening
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-white/20 text-white/45'
                )}
              >
                {isListening ? 'live' : 'idle'}
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-white/45 hover:bg-white/15 hover:text-white"
                aria-label="Collapse FFT panel"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <BandRow
            label={mode === 'music' ? 'EQ (raw)' : 'Raw bands'}
            bands={frame.rawBands}
            bandLabels={rawLabels}
            accentClass="bg-[#0046e0]/80"
            compact
          />
          <div className="mt-2">
            <BandRow
              label={mode === 'voice' ? 'Applied' : 'Depth'}
              bands={frame.appliedBands}
              bandLabels={appliedLabels}
              accentClass="bg-sky-300/70"
              compact
            />
          </div>

          <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5 font-mono text-[9px] text-white/45">
            <span>bass {frame.bass.toFixed(3)}</span>
            <span>voice {frame.voice.toFixed(3)}</span>
            <span>energy {frame.energy.toFixed(3)}</span>
            <span>flux {frame.flux.toFixed(3)}</span>
            {mode === 'voice' ? (
              <span className="col-span-2">bias +{frame.depthBias.toFixed(2)}</span>
            ) : null}
          </div>

          <p className="mt-2 text-[9px] leading-relaxed text-white/35">
            Inverted heatmap — more voice = more blue.
          </p>
        </div>
      )}
    </div>
  );
}
