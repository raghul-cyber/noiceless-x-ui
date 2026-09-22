import React from 'react';
import { Mic, Disc, Square, Play, Sliders, CheckCircle2, ShieldAlert } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* RECORD AUDIO CARD */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-[#161d2c]">
          <div className="flex items-center space-x-2">
            <Disc className={`w-4 h-4 ${store.isRecording ? 'text-signal-red animate-spin' : 'text-slate-400'}`} />
            <span className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
              RECORD AUDIO
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">
            BUFFER: 24-BIT LPCM
          </span>
        </div>

        <div className="my-3 space-y-2 font-mono">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">INPUT SOURCE:</span>
            <span className="text-slate-300 font-semibold bg-[#0e1320] px-2 py-0.5 rounded border border-[#1b2336]">
              USB PnP Sound Device (Tactical)
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">RECORDING DURATION:</span>
            <span className={`font-mono text-xl font-bold tracking-wider ${store.isRecording ? 'text-signal-red animate-pulse' : 'text-slate-400'}`}>
              {formatTime(store.recordingSeconds)}
            </span>
          </div>
        </div>

        {/* Record / Stop Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          {!store.isRecording ? (
            <button
              onClick={store.startRecording}
              className="flex-1 py-2 px-3 rounded bg-signal-red/20 border border-signal-red/40 text-red-400 hover:bg-signal-red/30 font-mono text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-signal-red animate-pulse" />
              <span>[ RECORD ]</span>
            </button>
          ) : (
            <button
              onClick={store.stopRecording}
              className="flex-1 py-2 px-3 rounded bg-red-600 border border-red-500 text-white hover:bg-red-700 font-mono text-xs font-bold tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>[ STOP & SAVE ]</span>
            </button>
          )}

          <button
            onClick={store.stopRecording}
            disabled={!store.isRecording}
            className={`py-2 px-4 rounded border font-mono text-xs transition-all ${
              store.isRecording 
                ? 'bg-[#151c2c] border-[#222d44] text-slate-300 hover:text-white' 
                : 'bg-[#0e121c] border-[#161d2a] text-slate-600 cursor-not-allowed'
            }`}
          >
            [ STOP ]
          </button>
        </div>
      </div>

      {/* PROCESSING CARD */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-2 border-b border-[#161d2c]">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-signal-cyan" />
            <span className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
              PROCESSING
            </span>
          </div>
          <span className="font-mono text-[10px] text-signal-cyan">
            NEURAL RECURRENT
          </span>
        </div>

        <div className="my-3 space-y-2 font-mono">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">ALGORITHM:</span>
            <span className="text-signal-cyan font-bold bg-[#0e1320] px-2 py-0.5 rounded border border-signal-cyan/20">
              RNNNOISE
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">STATUS:</span>
            <span className={`flex items-center space-x-1.5 font-bold ${
              store.isProcessingActive ? 'text-signal-green' : 'text-signal-amber'
            }`}>
              <span className={`w-2 h-2 rounded-full ${store.isProcessingActive ? 'bg-signal-green animate-pulse' : 'bg-signal-amber'}`} />
              <span>{store.isProcessingActive ? '● PROCESSING ACTIVE' : '○ BYPASS MODE'}</span>
            </span>
          </div>
        </div>

        {/* Process / Live / Bypass Toggle Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={() => {
              if (!store.isProcessingActive) store.toggleProcessing();
            }}
            className={`flex-1 py-2 px-3 rounded border font-mono text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all ${
              store.isProcessingActive
                ? 'bg-signal-cyan/20 border-signal-cyan/50 text-signal-cyan shadow-sm'
                : 'bg-[#121724] border-[#1d2538] text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>[ PROCESS ]</span>
          </button>

          <button
            onClick={store.toggleProcessing}
            className={`flex-1 py-2 px-3 rounded border font-mono text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-all ${
              !store.isProcessingActive
                ? 'bg-signal-amber/20 border-signal-amber/50 text-signal-amber shadow-sm'
                : 'bg-[#121724] border-[#1d2538] text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>[ LIVE ]</span>
          </button>
        </div>
      </div>
    </div>
  );
};
