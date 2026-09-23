import React from 'react';
import { Mic, Disc, Square, Play, Sliders, HardDrive, Zap, Shield, AlertCircle } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
      {/* COMBAT RECORDING CARD */}
      <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 flex flex-col justify-between shadow-md mil-corner-bracket">
        <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
          <div className="flex items-center space-x-2">
            <Disc className={`w-3.5 h-3.5 ${store.isRecording ? 'text-[#ef4444] animate-spin' : 'text-[#7ea385]'}`} />
            <span className="text-xs font-bold tracking-wider text-[#e8f2e6] uppercase">
              // COMBAT AUDIO CAPTURE
            </span>
          </div>
          <span className="text-[8px] text-[#7ea385] bg-[#060a07] px-1.5 py-0.5 rounded-[1px] border border-[#223425] font-bold">
            24-BIT / 48kHz LPCM
          </span>
        </div>

        <div className="my-2.5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#557b5c]">INGEST TRANSDUCER:</span>
            <span className="text-[#e8f2e6] font-medium bg-[#060a07] px-2 py-0.5 rounded-[1px] border border-[#223425] text-[10px]">
              USB PnP Mil-Spec Mic (Ch 1)
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#557b5c]">MISSION ELAPSED:</span>
            <span className={`text-xl font-bold tracking-wider ${store.isRecording ? 'text-[#ef4444] animate-pulse' : 'text-[#7ea385]'}`}>
              {formatTime(store.recordingSeconds)}
            </span>
          </div>

          <div className="flex justify-between items-center text-[9px] text-[#557b5c] pt-0.5">
            <span className="flex items-center space-x-1">
              <HardDrive className="w-3 h-3 text-[#22e565]" />
              <span>CRYPTO STORAGE:</span>
            </span>
            <span className="text-[#7ea385]">412 GB FREE // SECURE LOGGED</span>
          </div>
        </div>

        {/* Record / Stop Action Buttons */}
        <div className="flex items-center space-x-2 pt-2 border-t border-[#223425]">
          {!store.isRecording ? (
            <button
              onClick={store.startRecording}
              className="flex-1 py-1.5 px-3 rounded-[1px] bg-[#ef4444]/15 border border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444]/25 text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_0_8px_rgba(239,68,68,0.2)]"
            >
              <span className="w-2 h-2 rounded-[1px] bg-[#ef4444] animate-pulse" />
              <span>[ ARM COMBAT RECORDER ]</span>
            </button>
          ) : (
            <button
              onClick={store.stopRecording}
              className="flex-1 py-1.5 px-3 rounded-[1px] bg-[#ef4444] border border-[#ef4444] text-white hover:bg-[#ef4444]/90 text-xs font-bold tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>[ STOP &amp; COMMIT LOG ]</span>
            </button>
          )}

          <button
            onClick={store.stopRecording}
            disabled={!store.isRecording}
            className={`py-1.5 px-3 rounded-[1px] border text-xs transition-all ${
              store.isRecording 
                ? 'bg-[#142316] border-[#223425] text-[#e8f2e6] hover:bg-[#1a2f1d] cursor-pointer' 
                : 'bg-[#060a07] border-[#223425] text-[#557b5c] cursor-not-allowed opacity-40'
            }`}
          >
            [ ABORT ]
          </button>
        </div>
      </div>

      {/* DSP PROCESSING CARD */}
      <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 flex flex-col justify-between shadow-md mil-corner-bracket">
        <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
          <div className="flex items-center space-x-2">
            <Sliders className="w-3.5 h-3.5 text-[#22e565]" />
            <span className="text-xs font-bold tracking-wider text-[#e8f2e6] uppercase">
              // ANTI-JAM DSP STAGING
            </span>
          </div>
          <span className="text-[8px] text-[#22e565] bg-[#22e565]/10 px-1.5 py-0.5 rounded-[1px] border border-[#22e565]/30 font-bold">
            NEURAL ATTENUATION
          </span>
        </div>

        <div className="my-2.5 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#557b5c]">NEURAL MODEL:</span>
            <span className="text-[#22e565] font-bold bg-[#060a07] px-2 py-0.5 rounded-[1px] border border-[#22e565]/30 text-[10px]">
              DeepFilterNet3 (Full-Band ERB)
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#557b5c]">COMMS FILTER STATE:</span>
            <span className={`flex items-center space-x-1.5 font-bold ${
              store.isProcessingActive ? 'text-[#22e565]' : 'text-[#f59e0b]'
            }`}>
              <span className={`w-2 h-2 rounded-[1px] ${store.isProcessingActive ? 'bg-[#22e565] animate-pulse shadow-[0_0_6px_#22e565]' : 'bg-[#f59e0b]'}`} />
              <span>{store.isProcessingActive ? 'ACTIVE NEURAL SUPPRESSION' : 'DIRECT COMM BYPASS'}</span>
            </span>
          </div>

          <div className="flex justify-between items-center text-[9px] text-[#557b5c] pt-0.5">
            <span>SUPPRESSION PROFILE:</span>
            <span className="text-[#7ea385] font-semibold">{store.suppressionDepth}% AGGRESSIVENESS</span>
          </div>
        </div>

        {/* Process / Bypass Toggle Buttons */}
        <div className="flex items-center space-x-2 pt-2 border-t border-[#223425]">
          <button
            onClick={() => {
              if (!store.isProcessingActive) store.toggleProcessing();
            }}
            className={`flex-1 py-1.5 px-3 rounded-[1px] border text-xs font-bold tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              store.isProcessingActive
                ? 'bg-[#142316] border-[#22e565]/60 text-[#22e565] shadow-[0_0_8px_rgba(34,229,101,0.25)]'
                : 'bg-[#060a07] border-[#223425] text-[#7ea385] hover:text-[#e8f2e6] hover:bg-[#0e1710]'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>[ ENGAGE FILTER ]</span>
          </button>

          <button
            onClick={store.toggleProcessing}
            className={`flex-1 py-1.5 px-3 rounded-[1px] border text-xs font-bold tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              !store.isProcessingActive
                ? 'bg-[#2b1f09] border-[#f59e0b]/60 text-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                : 'bg-[#060a07] border-[#223425] text-[#7ea385] hover:text-[#e8f2e6] hover:bg-[#0e1710]'
            }`}
          >
            <span>[ BYPASS DIRECT ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
