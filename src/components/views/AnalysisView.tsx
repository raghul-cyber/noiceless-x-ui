import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface AnalysisViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none bg-[#040a07]">
      {/* Header */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#00e599]" />
            <h1 className="font-mono text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
              DEEP ACOUSTIC &amp; SPECTRAL ANALYSIS
            </h1>
          </div>
          <p className="text-[#8ba695] text-xs mt-1 font-sans">
            Harmonic distortion, spectral noise floor, voice formant fidelity, and closed-loop transfer function.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3 shadow-md">
          <span className="text-[10px] text-[#4e6a5b] block uppercase tracking-wider">INPUT SNR</span>
          <span className="text-xl font-extrabold text-[#f59e0b]">+{store.telemetry.snrInput} dB</span>
          <span className="text-[10px] text-[#8ba695] block mt-1">Severe Battlefield Noise</span>
        </div>
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3 shadow-md">
          <span className="text-[10px] text-[#4e6a5b] block uppercase tracking-wider">ENHANCED SNR</span>
          <span className="text-xl font-extrabold text-[#00e599]">+{store.telemetry.snrOutput} dB</span>
          <span className="text-[10px] text-[#8ba695] block mt-1">Clean Speech Fidelity</span>
        </div>
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3 shadow-md">
          <span className="text-[10px] text-[#4e6a5b] block uppercase tracking-wider">HARMONIC DISTORTION</span>
          <span className="text-xl font-extrabold text-[#f0fdf4]">&lt; 0.08% THD</span>
          <span className="text-[10px] text-[#8ba695] block mt-1">@ 1 kHz, 94 dB SPL</span>
        </div>
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3 shadow-md">
          <span className="text-[10px] text-[#4e6a5b] block uppercase tracking-wider">PESQ-WB MOS SCORE</span>
          <span className="text-xl font-extrabold text-[#00e599]">4.38 / 5.0</span>
          <span className="text-[10px] text-[#8ba695] block mt-1">ITU-T P.862 Benchmark</span>
        </div>
      </div>

      {/* Spectral Attenuation Graph */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#143526]">
          <span className="font-mono text-xs font-bold text-[#f0fdf4] uppercase tracking-wider">
            OCTAVE BAND NOISE ATTENUATION CURVE
          </span>
          <span className="font-mono text-[10px] text-[#00e599] bg-[#00e599]/10 px-2 py-0.5 rounded border border-[#00e599]/30">
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
              <div className="w-full flex items-end justify-center gap-1.5 h-36">
                {/* Passive attenuation bar */}
                <div 
                  style={{ height: `${(item.passive / 45) * 100}%` }} 
                  className="w-1/2 bg-[#143526] rounded-t-[2px] border-t border-[#1e4a36]"
                  title={`Passive Seal: ${item.passive} dB`}
                />
                {/* Active DeepFilterNet3 + ANC bar */}
                <div 
                  style={{ height: `${(item.active / 45) * 100}%` }} 
                  className="w-1/2 bg-[#00e599] rounded-t-[2px] shadow-[0_0_8px_rgba(0,229,153,0.3)]"
                  title={`Total Active: ${item.active} dB`}
                />
              </div>
              <span className="text-[#8ba695]">{item.band}</span>
              <span className="text-[#00e599] font-bold">-{item.active}dB</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-6 pt-2 font-mono text-[10px] text-[#8ba695] border-t border-[#143526]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#143526] rounded-[2px]" />
            <span>PASSIVE HEADSET SEAL (NRR 24dB)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#00e599] rounded-[2px] shadow-[0_0_4px_#00e599]" />
            <span className="text-[#00e599]">TOTAL NOISE REDUCTION (ACTIVE DEEPFILTERNET3 + SEAL)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
