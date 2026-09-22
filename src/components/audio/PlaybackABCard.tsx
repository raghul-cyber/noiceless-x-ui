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
    <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 select-none shadow-md">
      <div className="flex items-center justify-between pb-2 border-b border-[#143526] mb-3">
        <div className="flex items-center space-x-2">
          <SplitSquareVertical className="w-3.5 h-3.5 text-[#00e599]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
            A/B PLAYBACK AUDITION COMPARATOR
          </span>
        </div>
        <span className="font-mono text-[9px] text-[#8ba695] bg-[#040a07] px-1.5 py-0.5 rounded border border-[#143526]">
          ZERO-LATENCY CROSS-SWITCH
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* A / B Selector Pills */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={() => store.setPlaybackActiveStream('A')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-[3px] border font-mono text-xs font-bold tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              store.playbackActiveStream === 'A'
                ? 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                : 'bg-[#040a07] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${store.playbackActiveStream === 'A' ? 'bg-[#f59e0b]' : 'bg-[#4e6a5b]'}`} />
            <span>[ A: RAW INPUT ]</span>
          </button>

          <button
            onClick={() => store.setPlaybackActiveStream('B')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-[3px] border font-mono text-xs font-bold tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              store.playbackActiveStream === 'B'
                ? 'bg-[#00e599]/20 border-[#00e599]/50 text-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.25)]'
                : 'bg-[#040a07] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${store.playbackActiveStream === 'B' ? 'bg-[#00e599] animate-pulse shadow-[0_0_6px_#00e599]' : 'bg-[#4e6a5b]'}`} />
            <span>[ ● B: ENHANCED ]</span>
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 w-full flex items-center space-x-2.5 font-mono text-xs">
          <button
            onClick={store.togglePlayback}
            className="p-1.5 rounded-[3px] bg-[#07140e] border border-[#143526] text-[#00e599] hover:bg-[#0c2419] hover:border-[#00e599]/40 transition-all cursor-pointer"
            title="Toggle Playback"
          >
            {store.isPlaybackPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <span className="text-[#f0fdf4] font-semibold text-xs w-11 tabular-nums">
            {formatTime(store.playbackProgress)}
          </span>

          {/* Timeline Bar */}
          <div className="flex-1 relative h-5 bg-[#020604] rounded-[2px] border border-[#143526] flex items-center px-1">
            <input
              type="range"
              min="0"
              max="48"
              value={store.playbackProgress}
              onChange={(e) => store.setPlaybackProgress(Number(e.target.value))}
              className="w-full h-1 cursor-pointer"
            />
          </div>

          <span className="text-[#4e6a5b] text-xs w-11 tabular-nums">
            00:48
          </span>
        </div>
      </div>
    </div>
  );
};
