import React from 'react';
import { SlidersHorizontal, Mic, Headphones, Volume2, ShieldCheck, Cpu } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface DevicesViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const DevicesView: React.FC<DevicesViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 select-none">
      {/* Header */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-signal-cyan" />
            <h1 className="font-mono text-sm font-bold tracking-wider text-slate-100">
              TACTICAL HARDWARE AUDIO INTERFACE & I/O ROUTING
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Low-jitter USB PnP sound device calibration, microphone preamp gains, and hardware buffer size.
          </p>
        </div>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Device */}
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#161d2c]">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-signal-amber" />
              <span className="font-bold text-slate-200">PRIMARY INPUT TRANSDUCER</span>
            </div>
            <span className="text-signal-green text-[10px]">CONNECTED</span>
          </div>

          <div className="space-y-2">
            <div className="text-slate-400">DEVICE:</div>
            <div className="bg-[#0e131e] p-2.5 rounded border border-[#1b2336] text-slate-200 font-semibold">
              NOISELESS-X Tactical Boom Mic (Hypercardioid Electret)
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-slate-400">
              <span>PREAMP GAIN</span>
              <span className="text-signal-cyan font-bold">+18.0 dB</span>
            </div>
            <input type="range" min="0" max="40" defaultValue="18" className="w-full" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-[#161d2c]">
            <div>PHANTOM POWER: 5V BIAS (ON)</div>
            <div>POLAR PATTERN: HYPERCARDIOID</div>
          </div>
        </div>

        {/* Output Device */}
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#161d2c]">
            <div className="flex items-center space-x-2">
              <Headphones className="w-4 h-4 text-signal-cyan" />
              <span className="font-bold text-slate-200">TACTICAL EARPIECE MONITOR</span>
            </div>
            <span className="text-signal-green text-[10px]">ACTIVE</span>
          </div>

          <div className="space-y-2">
            <div className="text-slate-400">TRANSDUCER:</div>
            <div className="bg-[#0e131e] p-2.5 rounded border border-[#1b2336] text-slate-200 font-semibold">
              40mm Beryllium High-SPL Transducer (Left & Right Earcups)
            </div>
          </div>

          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-slate-400">
              <span>OUTPUT TRIM</span>
              <span className="text-signal-cyan font-bold">-6.0 dB</span>
            </div>
            <input type="range" min="-30" max="6" defaultValue="-6" className="w-full" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-2 border-t border-[#161d2c]">
            <div>IMPEDANCE: 32 OHM</div>
            <div>MAX ACOUSTIC SPL: 114 dB SPL</div>
          </div>
        </div>
      </div>

      {/* Hardware Buffer Size Selection */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#161d2c]">
          <span className="font-bold text-slate-200">DSP CORE HARDWARE BUFFER SIZE</span>
          <span className="text-slate-400">CURRENT: 128 SAMPLES (2.67 ms)</span>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-2">
          {[
            { size: 64, latency: '1.33 ms', desc: 'Ultra-Low (High CPU)' },
            { size: 128, latency: '2.67 ms', desc: 'Recommended Tactical', active: true },
            { size: 256, latency: '5.33 ms', desc: 'High Stability' },
            { size: 512, latency: '10.67 ms', desc: 'Max Buffer Headroom' },
          ].map((item) => (
            <div
              key={item.size}
              className={`p-3 rounded border text-center cursor-pointer transition-all ${
                item.active
                  ? 'bg-signal-cyan/15 border-signal-cyan/40 text-signal-cyan'
                  : 'bg-[#0f1422] border-[#1d2538] text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="text-sm font-bold">{item.size} SAMPLES</div>
              <div className="text-[11px] text-slate-300 mt-0.5">{item.latency}</div>
              <div className="text-[9px] text-slate-500 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
