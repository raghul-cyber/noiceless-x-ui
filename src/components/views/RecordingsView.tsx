import React from 'react';
import { Disc, Play, Pause, Download, Trash2, Clock, HardDrive, ShieldAlert, SplitSquareVertical } from 'lucide-react';
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
    <div className="h-full overflow-y-auto p-4 space-y-4 select-none">
      {/* Header */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Disc className="w-5 h-5 text-signal-cyan" />
            <h1 className="font-mono text-sm font-bold tracking-wider text-slate-100">
              TACTICAL AUDIO CAPTURE & RECORDINGS LIBRARY
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            24-bit 48kHz LPCM mission audio recordings with pre- and post-neural enhancement comparative tracks.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={store.startRecording}
            disabled={store.isRecording}
            className={`px-3 py-1.5 rounded border flex items-center space-x-2 font-bold ${
              store.isRecording
                ? 'bg-signal-red/20 border-signal-red/40 text-signal-red animate-pulse'
                : 'bg-signal-red/10 border-signal-red/30 text-red-400 hover:bg-signal-red/20'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-signal-red" />
            <span>{store.isRecording ? 'RECORDING IN PROGRESS' : 'NEW RECORDING'}</span>
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg overflow-hidden">
        <div className="h-10 px-4 bg-[#090c13] border-b border-[#182030] flex items-center justify-between font-mono text-[11px] text-slate-400">
          <span>TRACK NAME & MISSION PROFILE</span>
          <div className="flex items-center space-x-8">
            <span className="w-24 text-right">DURATION</span>
            <span className="w-28 text-right">AVG REDUCTION</span>
            <span className="w-20 text-right">SIZE</span>
            <span className="w-28 text-center">ACTION</span>
          </div>
        </div>

        <div className="divide-y divide-[#141a28]">
          {store.recordings.map((rec) => (
            <div
              key={rec.id}
              className="p-4 flex flex-col md:flex-row items-center justify-between hover:bg-[#0e121d] transition-colors gap-4"
            >
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  onClick={store.togglePlayback}
                  className="p-2.5 rounded bg-[#131926] border border-[#1d2538] text-signal-cyan hover:bg-signal-cyan/20 transition-all"
                  title="Audition Recording"
                >
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
                <div>
                  <div className="font-mono text-xs font-bold text-slate-200">
                    {rec.name}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                    {rec.noiseType} // Captured {rec.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end space-x-8 w-full md:w-auto font-mono text-xs">
                <span className="w-24 text-right text-slate-300">
                  {formatTime(rec.durationSeconds)}
                </span>
                <span className="w-28 text-right text-signal-cyan font-bold">
                  -{rec.noiseReductionAvgDb} dB
                </span>
                <span className="w-20 text-right text-slate-400">
                  {(rec.fileSizeKb / 1024).toFixed(2)} MB
                </span>
                <div className="w-28 flex items-center justify-center space-x-2">
                  <button
                    onClick={() => alert(`Exporting ${rec.name} as uncompressed 24-bit 48kHz WAV container.`)}
                    className="p-1.5 rounded bg-[#131926] border border-[#1f273b] text-slate-300 hover:text-signal-cyan hover:border-signal-cyan/40 transition-all"
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
