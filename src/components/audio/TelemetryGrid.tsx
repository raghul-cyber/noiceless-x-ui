import React from 'react';
import { Volume2, Volume1, ArrowDownRight, Clock, ShieldCheck, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface TelemetryGridProps {
  store: ReturnType<typeof useAppStore>;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({ store }) => {
  const cards = [
    {
      id: 'input_level',
      tag: '[01]',
      label: 'RAW ACOUSTIC INGEST',
      sublabel: 'FIELD BOOM TRANSDUCER',
      value: `${store.telemetry.inputDb.toFixed(1)} dB`,
      color: 'text-[#f59e0b]',
      icon: Volume2,
      secondary: 'RMS @ 48kHz LPCM 24-BIT',
      barPercent: Math.min(100, Math.max(10, (store.telemetry.inputDb + 60) * 1.6)),
      barColor: 'bg-[#f59e0b]',
    },
    {
      id: 'output_level',
      tag: '[02]',
      label: 'FILTERED COMMS RESIDUAL',
      sublabel: 'TACTICAL OPERATOR EARPIECE',
      value: `${store.telemetry.outputDb.toFixed(1)} dB`,
      color: store.isProcessingActive ? 'text-[#22e565]' : 'text-[#f59e0b]',
      icon: Volume1,
      secondary: store.isProcessingActive ? 'CLEAN VOICE STREAM' : 'DIRECT BYPASS',
      barPercent: Math.min(100, Math.max(10, (store.telemetry.outputDb + 60) * 1.6)),
      barColor: store.isProcessingActive ? 'bg-[#22e565]' : 'bg-[#f59e0b]',
    },
    {
      id: 'noise_reduction',
      tag: '[03]',
      label: 'BATTLEFIELD ATTENUATION',
      sublabel: 'DEEPFILTERNET3 NEURAL SUPPRESSION',
      value: `${store.telemetry.noiseReductionDb.toFixed(1)} dB`,
      color: 'text-[#22e565]',
      icon: ArrowDownRight,
      secondary: `SNR +${(store.telemetry.snrOutput - store.telemetry.snrInput).toFixed(1)} dB NET GAIN`,
      barPercent: Math.min(100, (store.telemetry.noiseReductionDb / 30) * 100),
      barColor: 'bg-[#22e565]',
    },
    {
      id: 'latency',
      tag: '[04]',
      label: 'MOUTH-TO-EAR LATENCY',
      sublabel: 'HARDWARE ROUND-TRIP TIME',
      value: `${store.telemetry.latencyMs.toFixed(0)} ms`,
      color: 'text-[#e8f2e6]',
      icon: Clock,
      secondary: '12ms ADC / 18ms NN / 12ms DAC',
      barPercent: (store.telemetry.latencyMs / 60) * 100,
      barColor: 'bg-[#22e565]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3 flex flex-col justify-between select-none shadow-md hover:border-[#2e4632] transition-all mil-corner-bracket"
          >
            <div className="flex items-center justify-between text-[#7ea385] mb-1">
              <div className="flex items-center space-x-1.5">
                <span className="font-mono text-[9px] font-bold text-[#3d5c43]">{c.tag}</span>
                <span className="font-mono text-[9px] font-bold tracking-widest text-[#b2ccb7] uppercase">
                  {c.label}
                </span>
              </div>
              <Icon className="w-3.5 h-3.5 text-[#557b5c]" />
            </div>

            <div className="my-1 flex items-baseline justify-between">
              <span className={`font-mono text-2xl font-extrabold tracking-tight ${c.color}`}>
                {c.value}
              </span>
              <span className="text-[8px] font-mono text-[#557b5c] uppercase bg-[#060a07] px-1 py-0.2 rounded border border-[#223425]">
                MIL-STD
              </span>
            </div>

            {/* Segmented LED micro progress bar */}
            <div className="w-full h-1.5 bg-[#060a07] rounded-[1px] overflow-hidden my-1 border border-[#223425]">
              <div 
                className={`h-full ${c.barColor} transition-all duration-300`} 
                style={{ width: `${c.barPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono border-t border-[#223425] pt-1.5 mt-0.5 text-[#557b5c]">
              <span className="text-[#7ea385]">{c.sublabel}</span>
              <span className="text-[#557b5c] font-semibold">{c.secondary}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
