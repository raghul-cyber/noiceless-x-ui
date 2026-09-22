import React from 'react';
import { Mic, Disc, Square, Play, Sliders, HardDrive, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface ControlDockProps {
  store: ReturnType<typeof useAppStore>;
}

export const ControlDock: React.FC<ControlDockProps> = ({ store }) => {
  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* RECORD AUDIO CARD */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#143526]">
          <div className="flex items-center space-x-2">
            <Disc className={`w-3.5 h-3.5 ${store.isRecording ? 'text-[#ff3b5c] animate-spin' : 'text-[#8ba695]'}`} />
            <span className="font-mono text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
              RECORD AUDIO
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#8ba695] bg-[#040a07] px-1.5 py-0.5 rounded border border-[#143526]">
            LPCM 24-BIT / 48kHz
          </span>
        </div>

        <div className="my-2.5 space-y-2 font-mono">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#4e6a5b]">INPUT TRANSDUCER:</span>
            <span className="text-[#f0fdf4] font-medium bg-[#040a07] px-2 py-0.5 rounded-[2px] border border-[#143526] text-[11px]">
              USB PnP Audio Ingest (Ch 1)
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#4e6a5b]">ELAPSED DURATION:</span>
            <span className={`font-mono text-xl font-bold tracking-wider ${store.isRecording ? 'text-[#ff3b5c] animate-pulse' : 'text-[#8ba695]'}`}>
              {formatTime(store.recordingSeconds)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#4e6a5b] pt-1">
            <span className="flex items-center space-x-1">
              <HardDrive className="w-3 h-3 text-[#00e599]" />
              <span>NVMe SSD 1:</span>
            </span>
            <span className="text-[#8ba695]">412 GB FREE // ZERO DROP</span>
          </div>
        </div>

        {/* Record / Stop Action Buttons */}
        <div className="flex items-center space-x-2.5 pt-2 border-t border-[#143526]">
          {!store.isRecording ? (
            <button
              onClick={store.startRecording}
              className="flex-1 py-1.5 px-3 rounded-[3px] bg-[#ff3b5c]/15 border border-[#ff3b5c]/40 text-[#ff3b5c] hover:bg-[#ff3b5c]/25 font-mono text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_0_8px_rgba(255,59,92,0.15)]"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff3b5c] animate-pulse" />
              <span>[ ARM RECORD ]</span>
            </button>
          ) : (
            <button
              onClick={store.stopRecording}
              className="flex-1 py-1.5 px-3 rounded-[3px] bg-[#ff3b5c] border border-[#ff3b5c] text-white hover:bg-[#ff3b5c]/90 font-mono text-xs font-bold tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_12px_rgba(255,59,92,0.4)] transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>[ STOP &amp; SAVE ]</span>
            </button>
          )}

          <button
            onClick={store.stopRecording}
            disabled={!store.isRecording}
            className={`py-1.5 px-3 rounded-[3px] border font-mono text-xs transition-all ${
              store.isRecording 
                ? 'bg-[#091b12] border-[#143526] text-[#f0fdf4] hover:bg-[#0c2419] cursor-pointer' 
                : 'bg-[#040a07] border-[#143526] text-[#4e6a5b] cursor-not-allowed opacity-50'
            }`}
          >
            [ STOP ]
          </button>
        </div>
      </div>

      {/* PROCESSING CARD */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#143526]">
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-[#00e599]" />
            <span className="font-mono text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
              DSP PROCESSING STAGE
            </span>
          </div>
          <span className="font-mono text-[9px] text-[#00e599] bg-[#00e599]/10 px-1.5 py-0.5 rounded border border-[#00e599]/30 font-semibold">
            DEEP FILTER
          </span>
        </div>

        <div className="my-2.5 space-y-2 font-mono">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#4e6a5b]">NEURAL ALGORITHM:</span>
            <span className="text-[#00e599] font-bold bg-[#040a07] px-2 py-0.5 rounded-[2px] border border-[#00e599]/30 text-[11px]">
              DeepFilterNet3 (Full-Band ERB)
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#4e6a5b]">PROCESSING STATE:</span>
            <span className={`flex items-center space-x-1.5 font-bold ${
              store.isProcessingActive ? 'text-[#00e599]' : 'text-[#f59e0b]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${store.isProcessingActive ? 'bg-[#00e599] animate-pulse shadow-[0_0_6px_#00e599]' : 'bg-[#f59e0b]'}`} />
              <span>{store.isProcessingActive ? 'ACTIVE NEURAL FILTER' : 'HARDWARE BYPASS'}</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#4e6a5b] pt-1">
            <span>SUPPRESSION PROFILE:</span>
            <span className="text-[#8ba695]">{store.suppressionDepth}% AGGRESSIVENESS</span>
          </div>
        </div>

        {/* Process / Live / Bypass Toggle Buttons */}
        <div className="flex items-center space-x-2.5 pt-2 border-t border-[#143526]">
          <button
            onClick={() => {
              if (!store.isProcessingActive) store.toggleProcessing();
            }}
            className={`flex-1 py-1.5 px-3 rounded-[3px] border font-mono text-xs font-bold tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              store.isProcessingActive
                ? 'bg-[#00e599]/20 border-[#00e599]/50 text-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.2)]'
                : 'bg-[#040a07] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#091811]'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>[ PROCESS ]</span>
          </button>

          <button
            onClick={store.toggleProcessing}
            className={`flex-1 py-1.5 px-3 rounded-[3px] border font-mono text-xs font-bold tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              !store.isProcessingActive
                ? 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                : 'bg-[#040a07] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#091811]'
            }`}
          >
            <span>[ BYPASS ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
