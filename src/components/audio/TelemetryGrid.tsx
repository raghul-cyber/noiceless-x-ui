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
      label: 'INPUT LEVEL',
      sublabel: 'BOOM MIC RAW',
      value: `${store.telemetry.inputDb.toFixed(1)} dB`,
      color: 'text-[#f59e0b]',
      icon: Volume2,
      secondary: 'RMS @ 48kHz LPCM',
      barPercent: Math.min(100, Math.max(10, (store.telemetry.inputDb + 60) * 1.6)),
      barColor: 'bg-[#f59e0b]',
    },
    {
      id: 'output_level',
      label: 'OUTPUT LEVEL',
      sublabel: 'ENHANCED AUDIO',
      value: `${store.telemetry.outputDb.toFixed(1)} dB`,
      color: store.isProcessingActive ? 'text-[#00e599]' : 'text-[#f59e0b]',
      icon: Volume1,
      secondary: store.isProcessingActive ? 'CLEAN RESIDUAL' : 'BYPASS ACTIVE',
      barPercent: Math.min(100, Math.max(10, (store.telemetry.outputDb + 60) * 1.6)),
      barColor: store.isProcessingActive ? 'bg-[#00e599]' : 'bg-[#f59e0b]',
    },
    {
      id: 'noise_reduction',
      label: 'NOISE REDUCTION',
      sublabel: 'DEEPFILTERNET3 ATTENUATION',
      value: `${store.telemetry.noiseReductionDb.toFixed(1)} dB`,
      color: 'text-[#00e599]',
      icon: ArrowDownRight,
      secondary: `SNR +${(store.telemetry.snrOutput - store.telemetry.snrInput).toFixed(1)} dB GAIN`,
      barPercent: Math.min(100, (store.telemetry.noiseReductionDb / 30) * 100),
      barColor: 'bg-[#00e599]',
    },
    {
      id: 'latency',
      label: 'TOTAL PIPELINE LATENCY',
      sublabel: 'ROUND-TRIP',
      value: `${store.telemetry.latencyMs.toFixed(0)} ms`,
      color: 'text-[#f0fdf4]',
      icon: Clock,
      secondary: '12ms IN / 18ms RNN / 12ms OUT',
      barPercent: (store.telemetry.latencyMs / 60) * 100,
      barColor: 'bg-[#10b981]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="bg-[#08140e] border border-[#143526] rounded-md p-3 flex flex-col justify-between select-none shadow-md hover:border-[#1e4a36] transition-all"
          >
            <div className="flex items-center justify-between text-[#8ba695] mb-1">
              <span className="font-mono text-[10px] font-bold tracking-widest text-[#8ba695] uppercase">
                {c.label}
              </span>
              <Icon className="w-3.5 h-3.5 text-[#4e6a5b]" />
            </div>

            <div className="my-1.5 flex items-baseline justify-between">
              <span className={`font-mono text-2xl font-extrabold tracking-tight ${c.color}`}>
                {c.value}
              </span>
              <span className="text-[9px] font-mono text-[#4e6a5b] uppercase">24-BIT</span>
            </div>

            {/* Micro progress gauge bar */}
            <div className="w-full h-1 bg-[#040a07] rounded-[1px] overflow-hidden my-1">
              <div 
                className={`h-full ${c.barColor} transition-all duration-300`} 
                style={{ width: `${c.barPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono border-t border-[#143526] pt-1.5 mt-1 text-[#4e6a5b]">
              <span className="text-[#8ba695]">{c.sublabel}</span>
              <span className="text-[#4e6a5b]">{c.secondary}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
