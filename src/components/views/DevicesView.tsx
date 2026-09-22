import React, { useState } from 'react';
import { SlidersHorizontal, Mic, Headphones, Volume2, ShieldCheck, Cpu, CheckCircle2, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface DevicesViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const DevicesView: React.FC<DevicesViewProps> = ({ store }) => {
  const [preampGain, setPreampGain] = useState<number>(18);
  const [outputTrim, setOutputTrim] = useState<number>(-6);
  const [bufferSize, setBufferSize] = useState<number>(128);

  const bufferPresets = [
    { size: 64, latency: '1.33 ms', desc: 'Ultra-Low (High CPU Load)', stable: 'Marginal' },
    { size: 128, latency: '2.67 ms', desc: 'Tactical Standard (Balanced)', stable: 'Optimal' },
    { size: 256, latency: '5.33 ms', desc: 'High Noise Immunity', stable: 'Solid' },
    { size: 512, latency: '10.67 ms', desc: 'Maximum Headroom', stable: 'Max' },
  ];

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 select-none font-mono">
      {/* Header */}
      <div className="bg-[#08140e] border border-[#143526] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-black/40">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center text-[#00e599]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
              TACTICAL HARDWARE AUDIO INTERFACE &amp; I/O ROUTING
            </h1>
          </div>
          <p className="text-[#8ba695] text-[11px] mt-1">
            Low-jitter USB PnP sound device calibration, microphone preamp gains, and hardware buffer size.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-1 rounded bg-[#030906] border border-[#143526] text-[#8ba695]">
            DEVICE CLOCK: <strong className="text-[#00e599]">48.0 kHz PLL LOCKED</strong>
          </span>
        </div>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Device */}
        <div className="bg-[#08140e] border border-[#143526] rounded-xl p-4 space-y-3.5 text-xs shadow-lg shadow-black/40">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#143526]">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-[#f0fdf4] tracking-wide">PRIMARY INPUT TRANSDUCER</span>
            </div>
            <span className="text-[#00e599] text-[10px] font-bold px-2 py-0.5 rounded bg-[#00e599]/10 border border-[#00e599]/30">
              CONNECTED
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] text-[#8ba695] uppercase tracking-wider">HARDWARE IDENTIFIER:</div>
            <div className="bg-[#030906] p-2.5 rounded-lg border border-[#143526] text-[#f0fdf4] font-semibold text-[11px] flex items-center justify-between">
              <span>NOISELESS-X6 Tactical Boom Mic (Hypercardioid Electret)</span>
              <span className="text-[#00e599] text-[9px]">USB AUDIO CLASS 2.0</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[#8ba695] text-[11px]">
              <span>PREAMP ANALOG GAIN</span>
              <span className="text-[#00e599] font-bold font-mono">+{preampGain.toFixed(1)} dB</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="0.5"
              value={preampGain}
              onChange={(e) => setPreampGain(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#030906] rounded-lg appearance-none cursor-pointer accent-[#00e599]"
            />
            <div className="flex justify-between text-[9px] text-[#4e6a5b]">
              <span>0.0 dB</span>
              <span>+20.0 dB (NOMINAL)</span>
              <span>+40.0 dB (HIGH)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8ba695] pt-2.5 border-t border-[#143526]">
            <div className="bg-[#030906] p-2 rounded border border-[#143526]">
              <span className="text-[#4e6a5b] block text-[9px]">BIAS / PHANTOM:</span>
              <span className="text-[#f0fdf4] font-semibold">5V BIAS (ACTIVE)</span>
            </div>
            <div className="bg-[#030906] p-2 rounded border border-[#143526]">
              <span className="text-[#4e6a5b] block text-[9px]">POLAR PATTERN:</span>
              <span className="text-[#f0fdf4] font-semibold">HYPERCARDIOID</span>
            </div>
          </div>
        </div>

        {/* Output Device */}
        <div className="bg-[#08140e] border border-[#143526] rounded-xl p-4 space-y-3.5 text-xs shadow-lg shadow-black/40">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#143526]">
            <div className="flex items-center space-x-2">
              <Headphones className="w-4 h-4 text-[#00e599]" />
              <span className="font-bold text-[#f0fdf4] tracking-wide">TACTICAL EARPIECE MONITOR</span>
            </div>
            <span className="text-[#00e599] text-[10px] font-bold px-2 py-0.5 rounded bg-[#00e599]/10 border border-[#00e599]/30">
              ACTIVE
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] text-[#8ba695] uppercase tracking-wider">TRANSDUCER DRIVER:</div>
            <div className="bg-[#030906] p-2.5 rounded-lg border border-[#143526] text-[#f0fdf4] font-semibold text-[11px] flex items-center justify-between">
              <span>40mm Beryllium High-SPL Transducer (L &amp; R Earcups)</span>
              <span className="text-[#00e599] text-[9px]">I2S DIRECT BUS</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[#8ba695] text-[11px]">
              <span>OUTPUT TRIM GAIN</span>
              <span className="text-[#00e599] font-bold font-mono">{outputTrim > 0 ? `+${outputTrim.toFixed(1)}` : outputTrim.toFixed(1)} dB</span>
            </div>
            <input
              type="range"
              min="-30"
              max="6"
              step="0.5"
              value={outputTrim}
              onChange={(e) => setOutputTrim(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#030906] rounded-lg appearance-none cursor-pointer accent-[#00e599]"
            />
            <div className="flex justify-between text-[9px] text-[#4e6a5b]">
              <span>-30.0 dB</span>
              <span>-6.0 dB (SAFE)</span>
              <span>+6.0 dB (BOOST)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8ba695] pt-2.5 border-t border-[#143526]">
            <div className="bg-[#030906] p-2 rounded border border-[#143526]">
              <span className="text-[#4e6a5b] block text-[9px]">IMPEDANCE:</span>
              <span className="text-[#f0fdf4] font-semibold">32 OHM BALANCED</span>
            </div>
            <div className="bg-[#030906] p-2 rounded border border-[#143526]">
              <span className="text-[#4e6a5b] block text-[9px]">MAX ACOUSTIC SPL:</span>
              <span className="text-[#f0fdf4] font-semibold">114 dB SPL (LIMITER ARMED)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Buffer Size Selection */}
      <div className="bg-[#08140e] border border-[#143526] rounded-xl p-4 space-y-3.5 text-xs shadow-lg shadow-black/40">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#143526]">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#00e599]" />
            <span className="font-bold text-[#f0fdf4] tracking-wide">DSP CORE HARDWARE BUFFER SIZE (I/O RING)</span>
          </div>
          <span className="text-[#00e599] font-bold text-[11px]">
            ACTIVE: {bufferSize} SAMPLES ({(bufferSize / 48).toFixed(2)} ms @ 48kHz)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {bufferPresets.map((item) => {
            const isActive = bufferSize === item.size;
            return (
              <button
                key={item.size}
                onClick={() => setBufferSize(item.size)}
                className={`p-3 rounded-lg border text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-[#00e599]/15 border-[#00e599]/60 text-[#00e599] shadow-[0_0_15px_rgba(0,229,153,0.2)]'
                    : 'bg-[#030906] border-[#143526] text-[#8ba695] hover:border-[#1e4d38] hover:text-[#f0fdf4]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-[#f0fdf4] font-mono">{item.size} SAMPLES</div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse" />}
                </div>
                <div className={`text-[11px] font-bold mt-1 ${isActive ? 'text-[#00e599]' : 'text-[#8ba695]'}`}>
                  {item.latency} LATENCY
                </div>
                <div className="text-[9px] text-[#4e6a5b] mt-1 truncate">{item.desc}</div>
              </button>
            );
          })}
        </div>

        <div className="pt-2 text-[10px] text-[#8ba695] border-t border-[#143526] flex items-center justify-between">
          <span>REAL-TIME ALSA / JACK AUDIO ROUTER</span>
          <span className="text-[#00e599]">RT-PREEMPT REALTIME KERNEL PRIORITY 95</span>
        </div>
      </div>
    </div>
  );
};
