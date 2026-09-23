import React from 'react';
import { Play, Pause, RotateCcw, Volume2, SplitSquareVertical, Radio } from 'lucide-react';
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
    <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 select-none shadow-md mil-corner-bracket">
      <div className="flex items-center justify-between pb-2 border-b border-[#223425] mb-3">
        <div className="flex items-center space-x-2">
          <SplitSquareVertical className="w-3.5 h-3.5 text-[#22e565]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#e8f2e6] uppercase">
            // TACTICAL A/B AUDITION &amp; DEBRIEF COMPARATOR
          </span>
        </div>
        <span className="font-mono text-[8px] text-[#7ea385] bg-[#060a07] px-1.5 py-0.5 rounded-[1px] border border-[#223425] font-bold">
          ZERO-DELAY CROSS-FADE
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* A / B Selector Pills */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={() => store.setPlaybackActiveStream('A')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-[1px] border font-mono text-xs font-bold tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              store.playbackActiveStream === 'A'
                ? 'bg-[#2b1f09] border-[#f59e0b]/60 text-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : 'bg-[#060a07] border-[#223425] text-[#7ea385] hover:text-[#e8f2e6]'
            }`}
          >
            <span className={`w-2 h-2 rounded-[1px] ${store.playbackActiveStream === 'A' ? 'bg-[#f59e0b]' : 'bg-[#557b5c]'}`} />
            <span>[ A: RAW BATTLEFIELD ]</span>
          </button>

          <button
            onClick={() => store.setPlaybackActiveStream('B')}
            className={`flex-1 md:flex-initial px-3 py-1.5 rounded-[1px] border font-mono text-xs font-bold tracking-wider flex items-center space-x-2 transition-all cursor-pointer ${
              store.playbackActiveStream === 'B'
                ? 'bg-[#142316] border-[#22e565]/60 text-[#22e565] shadow-[0_0_8px_rgba(34,229,101,0.25)]'
                : 'bg-[#060a07] border-[#223425] text-[#7ea385] hover:text-[#e8f2e6]'
            }`}
          >
            <span className={`w-2 h-2 rounded-[1px] ${store.playbackActiveStream === 'B' ? 'bg-[#22e565] animate-pulse shadow-[0_0_6px_#22e565]' : 'bg-[#557b5c]'}`} />
            <span>[ ● B: CLEAN COMMS ]</span>
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 w-full flex items-center space-x-2.5 font-mono text-xs">
          <button
            onClick={store.togglePlayback}
            className="p-1.5 rounded-[1px] bg-[#090e09] border border-[#223425] text-[#22e565] hover:bg-[#142316] hover:border-[#22e565]/50 transition-all cursor-pointer"
            title="Toggle Playback"
          >
            {store.isPlaybackPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
            )}
          </button>

          <span className="text-[#e8f2e6] font-bold text-xs w-11 tabular-nums">
            {formatTime(store.playbackProgress)}
          </span>

          {/* Timeline Bar */}
          <div className="flex-1 relative h-5 bg-[#050906] rounded-[1px] border border-[#223425] flex items-center px-1">
            <input
              type="range"
              min="0"
              max="48"
              value={store.playbackProgress}
              onChange={(e) => store.setPlaybackProgress(Number(e.target.value))}
              className="w-full h-1 cursor-pointer"
            />
          </div>

          <span className="text-[#557b5c] text-xs w-11 tabular-nums">
            00:48
          </span>
        </div>
      </div>
    </div>
  );
};
