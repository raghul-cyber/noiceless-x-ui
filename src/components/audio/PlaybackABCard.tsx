import React from 'react';
import { Play, Pause, RotateCcw, Volume2, SplitSquareVertical } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface PlaybackABCardProps {
  store: ReturnType<typeof useAppStore>;
}

export const PlaybackABCard: React.FC<PlaybackABCardProps> = ({ store }) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-[#161d2c] mb-3">
        <div className="flex items-center space-x-2">
          <SplitSquareVertical className="w-4 h-4 text-signal-cyan" />
          <span className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
            PLAYBACK / A-B
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          INSTANTANEOUS DSP AUDITION
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* A / B Selector Pills */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={() => store.setPlaybackActiveStream('A')}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded border font-mono text-xs font-bold tracking-wider flex items-center space-x-2 transition-all ${
              store.playbackActiveStream === 'A'
                ? 'bg-signal-amber/20 border-signal-amber/50 text-signal-amber shadow-sm'
                : 'bg-[#101420] border-[#1a2234] text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${store.playbackActiveStream === 'A' ? 'bg-signal-amber' : 'bg-slate-600'}`} />
            <span>A ORIGINAL</span>
          </button>

          <button
            onClick={() => store.setPlaybackActiveStream('B')}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded border font-mono text-xs font-bold tracking-wider flex items-center space-x-2 transition-all ${
              store.playbackActiveStream === 'B'
                ? 'bg-signal-cyan/20 border-signal-cyan/50 text-signal-cyan shadow-sm'
                : 'bg-[#101420] border-[#1a2234] text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${store.playbackActiveStream === 'B' ? 'bg-signal-cyan animate-pulse' : 'bg-slate-600'}`} />
            <span>● B ENHANCED</span>
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 w-full flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={store.togglePlayback}
            className="p-2 rounded bg-[#121826] border border-[#1e273a] text-signal-cyan hover:bg-[#182032] hover:text-white transition-colors"
            title="Toggle Playback"
          >
            {store.isPlaybackPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <span className="text-slate-400 text-xs w-10">
            {formatTime(store.playbackProgress)}
          </span>

          {/* Timeline Bar */}
          <div className="flex-1 relative h-6 bg-[#080b12] rounded border border-[#161d2c] flex items-center px-1">
            <input
              type="range"
              min="0"
              max="48"
              value={store.playbackProgress}
              onChange={(e) => store.setPlaybackProgress(Number(e.target.value))}
              className="w-full h-1.5 cursor-pointer accent-signal-cyan"
            />
          </div>

          <span className="text-slate-500 text-xs w-10">
            00:48
          </span>
        </div>
      </div>
    </div>
  );
};
