import React from 'react';
import { Disc, Play, Download } from 'lucide-react';
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
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none bg-[#040a07]">
      {/* Header */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <Disc className="w-4 h-4 text-[#00e599]" />
            <h1 className="font-mono text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
              TACTICAL AUDIO CAPTURE &amp; RECORDINGS LIBRARY
            </h1>
          </div>
          <p className="text-[#8ba695] text-xs mt-1 font-sans">
            24-bit 48kHz LPCM mission audio recordings with pre- and post-neural enhancement comparative tracks.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={store.startRecording}
            disabled={store.isRecording}
            className={`px-3 py-1.5 rounded-[3px] border flex items-center space-x-2 font-bold cursor-pointer transition-all ${
              store.isRecording
                ? 'bg-[#ff3b5c]/20 border-[#ff3b5c]/50 text-[#ff3b5c] animate-pulse'
                : 'bg-[#ff3b5c]/10 border-[#ff3b5c]/30 text-[#ff3b5c] hover:bg-[#ff3b5c]/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#ff3b5c]" />
            <span>{store.isRecording ? 'RECORDING IN PROGRESS' : 'NEW RECORDING'}</span>
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md overflow-hidden shadow-md">
        <div className="h-9 px-4 bg-[#0a1a12] border-b border-[#143526] flex items-center justify-between font-mono text-[10px] text-[#8ba695] uppercase tracking-wider">
          <span>TRACK NAME &amp; MISSION PROFILE</span>
          <div className="flex items-center space-x-8">
            <span className="w-24 text-right">DURATION</span>
            <span className="w-28 text-right">AVG REDUCTION</span>
            <span className="w-20 text-right">SIZE</span>
            <span className="w-28 text-center">ACTION</span>
          </div>
        </div>

        <div className="divide-y divide-[#143526]">
          {store.recordings.map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 flex flex-col md:flex-row items-center justify-between hover:bg-[#0c2419] transition-colors gap-3"
            >
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  onClick={store.togglePlayback}
                  className="p-2 rounded-[3px] bg-[#040a07] border border-[#143526] text-[#00e599] hover:bg-[#00e599]/20 hover:border-[#00e599]/40 transition-all cursor-pointer"
                  title="Audition Recording"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </button>
                <div>
                  <div className="font-mono text-xs font-bold text-[#f0fdf4]">
                    {rec.name}
                  </div>
                  <div className="font-mono text-[10px] text-[#8ba695] mt-0.5">
                    {rec.noiseType} // Captured {rec.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-8 w-full md:w-auto font-mono text-xs">
                <span className="w-24 text-right text-[#8ba695] tabular-nums">
                  {formatTime(rec.durationSeconds)}
                </span>
                <span className="w-28 text-right text-[#00e599] font-bold tabular-nums">
                  -{rec.noiseReductionAvgDb} dB
                </span>
                <span className="w-20 text-right text-[#8ba695] tabular-nums">
                  {(rec.fileSizeKb / 1024).toFixed(2)} MB
                </span>
                <div className="w-28 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => alert(`Exporting ${rec.name} as uncompressed 24-bit 48kHz WAV container.`)}
                    className="p-1.5 rounded-[3px] bg-[#040a07] border border-[#143526] text-[#8ba695] hover:text-[#00e599] hover:border-[#00e599]/40 transition-all cursor-pointer"
                    title="Export WAV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
