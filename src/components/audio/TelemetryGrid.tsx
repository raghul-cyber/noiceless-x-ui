import React from 'react';
import { Volume2, Volume1, ArrowDownRight, Clock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface TelemetryGridProps {
  store: ReturnType<typeof useAppStore>;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({ store }) => {
  const cards = [
    {
      id: 'input_level',
      label: 'INPUT',
      sublabel: 'BOOM MIC RAW',
      value: `${store.telemetry.inputDb.toFixed(1)} dB`,
      color: 'text-signal-amber',
      border: 'border-[#222a3d]',
      icon: Volume2,
      secondary: 'RMS @ 48kHz',
    },
    {
      id: 'output_level',
      label: 'OUTPUT',
      sublabel: 'ENHANCED AUDIO',
      value: `${store.telemetry.outputDb.toFixed(1)} dB`,
      color: store.isProcessingActive ? 'text-signal-cyan' : 'text-signal-amber',
      border: 'border-[#222a3d]',
      icon: Volume1,
      secondary: store.isProcessingActive ? 'CLEAN RESIDUAL' : 'BYPASS ACTIVE',
    },
    {
      id: 'noise_reduction',
      label: 'NOISE RED',
      sublabel: 'RNNNOISE ATTENUATION',
      value: `${store.telemetry.noiseReductionDb.toFixed(1)} dB`,
      color: 'text-signal-green',
      border: 'border-[#222a3d]',
      icon: ArrowDownRight,
      secondary: `SNR +${(store.telemetry.snrOutput - store.telemetry.snrInput).toFixed(1)} dB GAIN`,
    },
    {
      id: 'latency',
      label: 'LATENCY',
      sublabel: 'TOTAL PIPELINE',
      value: `${store.telemetry.latencyMs.toFixed(0)} ms`,
      color: 'text-slate-100',
      border: 'border-[#222a3d]',
      icon: Clock,
      secondary: '12ms IN / 18ms RNN / 12ms OUT',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className={`bg-[#0b0e16] border ${c.border} rounded-lg p-3.5 flex flex-col justify-between select-none shadow-sm hover:border-slate-600 transition-colors`}
          >
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="font-mono text-[11px] font-bold tracking-widest text-slate-400">
                {c.label}
              </span>
              <Icon className="w-3.5 h-3.5 text-slate-500" />
            </div>

            <div className="my-1">
              <span className={`font-mono text-2xl font-bold tracking-tight ${c.color}`}>
                {c.value}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-[#161d2b] pt-2 mt-1">
              <span className="text-slate-500">{c.sublabel}</span>
              <span className="text-slate-400">{c.secondary}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
