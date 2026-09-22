import React from 'react';
import { BarChart3, LineChart, TrendingDown, Layers, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface AnalysisViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 select-none">
      {/* Header */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-signal-cyan" />
            <h1 className="font-mono text-sm font-bold tracking-wider text-slate-100">
              DEEP ACOUSTIC & SPECTRAL ANALYSIS
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Harmonic distortion, spectral noise floor, voice formant fidelity, and closed-loop transfer function.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-3.5">
          <span className="text-[10px] text-slate-500 block uppercase">INPUT SNR</span>
          <span className="text-xl font-bold text-signal-amber">+{store.telemetry.snrInput} dB</span>
          <span className="text-[10px] text-slate-500 block mt-1">Severe Battlefield Noise</span>
        </div>
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-3.5">
          <span className="text-[10px] text-slate-500 block uppercase">ENHANCED SNR</span>
          <span className="text-xl font-bold text-signal-green">+{store.telemetry.snrOutput} dB</span>
          <span className="text-[10px] text-slate-500 block mt-1">Clean Speech Fidelity</span>
        </div>
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-3.5">
          <span className="text-[10px] text-slate-500 block uppercase">TOTAL HARMONIC DISTORTION</span>
          <span className="text-xl font-bold text-slate-200">&lt; 0.08% THD</span>
          <span className="text-[10px] text-slate-500 block mt-1">@ 1 kHz, 94 dB SPL</span>
        </div>
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-3.5">
          <span className="text-[10px] text-slate-500 block uppercase">PESQ-WB MOS SCORE</span>
          <span className="text-xl font-bold text-signal-cyan">4.38 / 5.0</span>
          <span className="text-[10px] text-slate-500 block mt-1">ITU-T P.862 Benchmark</span>
        </div>
      </div>

      {/* Spectral Attenuation Graph */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#161d2c]">
          <span className="font-mono text-xs font-bold text-slate-200">
            OCTAVE BAND NOISE ATTENUATION CURVE
          </span>
          <span className="font-mono text-[10px] text-signal-cyan">
            CLOSED-LOOP ACOUSTIC RESPONSE
          </span>
        </div>

        <div className="h-48 flex items-end justify-between gap-2 pt-4 px-2 font-mono text-[10px]">
          {[
            { band: '63Hz', passive: 6, active: 22 },
            { band: '125Hz', passive: 11, active: 29 },
            { band: '250Hz', passive: 18, active: 34 },
            { band: '500Hz', passive: 24, active: 36 },
            { band: '1kHz', passive: 31, active: 38 },
            { band: '2kHz', passive: 36, active: 39 },
            { band: '4kHz', passive: 41, active: 42 },
            { band: '8kHz', passive: 38, active: 38 },
          ].map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div className="w-full flex items-end justify-center gap-1 h-36">
                {/* Passive attenuation bar */}
                <div 
                  style={{ height: `${(item.passive / 45) * 100}%` }} 
                  className="w-1/2 bg-slate-700/60 rounded-t"
                  title={`Passive: ${item.passive} dB`}
                />
                {/* Active RNNNoise + ANC bar */}
                <div 
                  style={{ height: `${(item.active / 45) * 100}%` }} 
                  className="w-1/2 bg-signal-cyan rounded-t"
                  title={`Total Active: ${item.active} dB`}
                />
              </div>
              <span className="text-slate-500">{item.band}</span>
              <span className="text-signal-cyan font-bold">-{item.active}dB</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-6 pt-2 font-mono text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-slate-700 rounded-sm" />
            <span>PASSIVE HEADSET SEAL (NRR 24dB)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-signal-cyan rounded-sm" />
            <span>TOTAL NOISE REDUCTION (ACTIVE RNNNOISE + SEAL)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
