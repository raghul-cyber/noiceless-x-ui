import React from 'react';
import { Disc, Play, Download, Shield, Lock, FileAudio, Radio } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface RecordingsViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const RecordingsView: React.FC<RecordingsViewProps> = ({ store }) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none bg-[#060a07] font-mono text-xs">
      {/* Header */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#22e565]/10 border border-[#22e565]/40 flex items-center justify-center text-[#22e565]">
              <Disc className="w-3.5 h-3.5" />
            </div>
            <h1 className="font-stencil text-xs font-bold tracking-widest text-[#f0fdf4] uppercase">
              TACTICAL MISSION AUDIO INTELLIGENCE &amp; RECORDINGS VAULT
            </h1>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-950/60 border border-red-500/50 text-red-400 font-bold">
              TOP SECRET // NOFORN
            </span>
          </div>
          <p className="text-[#8ba695] text-[11px] mt-1 font-mono">
            Uncompressed 24-bit 48kHz LPCM mission debrief audio intercepts with synchronized neural speech enhancement telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={store.startRecording}
            disabled={store.isRecording}
            className={`px-3 py-1.5 rounded border flex items-center space-x-2 font-bold cursor-pointer transition-all ${
              store.isRecording
                ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                : 'bg-red-950/30 border-red-500/40 text-red-400 hover:bg-red-900/40 hover:border-red-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span className="font-stencil tracking-wider">
              {store.isRecording ? 'COMBAT AUDIO CAPTURE ENGAGED' : 'ARM CAPTURE (REC)'}
            </span>
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded overflow-hidden shadow-md">
        <div className="h-9 px-4 bg-[#070e09] border-b border-[#223425] flex items-center justify-between text-[10px] text-[#8ba695] uppercase tracking-wider font-bold">
          <div className="flex items-center space-x-2">
            <Radio className="w-3 h-3 text-[#22e565]" />
            <span>MISSION CALLSIGN &amp; ACOUSTIC PROFILE</span>
          </div>
          <div className="flex items-center space-x-8">
            <span className="w-24 text-right">DURATION</span>
            <span className="w-28 text-right">REDUCTION</span>
            <span className="w-20 text-right">SIZE</span>
            <span className="w-28 text-center">CRYPTO EXPORT</span>
          </div>
        </div>

        <div className="divide-y divide-[#223425]">
          {store.recordings.map((rec) => (
            <div
              key={rec.id}
              className="p-3 flex flex-col md:flex-row items-center justify-between hover:bg-[#0e1910] transition-colors gap-3"
            >
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  onClick={store.togglePlayback}
                  className="p-2 rounded bg-[#070e09] border border-[#223425] text-[#22e565] hover:bg-[#22e565]/20 hover:border-[#22e565] transition-all cursor-pointer shadow-[0_0_8px_rgba(34,229,101,0.2)]"
                  title="Audition Mission Intercept"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-stencil text-xs font-bold text-[#f0fdf4]">
                      {rec.name}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#070e09] border border-[#223425] text-[#22e565]">
                      AES-256
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8ba695] mt-0.5">
                    {rec.noiseType} // Captured {rec.timestamp} // Hash: 9e4a8b...2f
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-8 w-full md:w-auto text-xs">
                <span className="w-24 text-right text-[#8ba695] tabular-nums">
                  {formatTime(rec.durationSeconds)}
                </span>
                <span className="w-28 text-right text-[#22e565] font-bold tabular-nums">
                  -{rec.noiseReductionAvgDb} dB
                </span>
                <span className="w-20 text-right text-[#8ba695] tabular-nums">
                  {(rec.fileSizeKb / 1024).toFixed(2)} MB
                </span>
                <div className="w-28 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => alert(`Exporting ${rec.name} as MIL-STD-24bit WAV container with AES-256 metadata manifest.`)}
                    className="p-1.5 rounded bg-[#070e09] border border-[#223425] text-[#8ba695] hover:text-[#22e565] hover:border-[#22e565] transition-all cursor-pointer flex items-center space-x-1"
                    title="Export WAV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-bold">WAV</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Audit Stamp */}
        <div className="p-2.5 bg-[#070e09] border-t border-[#223425] flex items-center justify-between text-[10px] text-[#8ba695]">
          <div className="flex items-center space-x-2">
            <Lock className="w-3 h-3 text-[#22e565]" />
            <span>NVG SECURE FLASH STORAGE: 64 GB ENCRYPTED NVMe // 58.2 GB AVAILABLE</span>
          </div>
          <span className="text-[#22e565] font-bold">STANAG 4586 MISSION AUDIT READY</span>
        </div>
      </div>
    </div>
  );
};
