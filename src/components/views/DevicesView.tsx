import React, { useState } from 'react';
import { SlidersHorizontal, Mic, Headphones, Volume2, ShieldCheck, Cpu, Radio, Shield, Wrench } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface DevicesViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const DevicesView: React.FC<DevicesViewProps> = ({ store }) => {
  const [preampGain, setPreampGain] = useState<number>(22);
  const [outputTrim, setOutputTrim] = useState<number>(-4);
  const [bufferSize, setBufferSize] = useState<number>(128);
  const [pttMode, setPttMode] = useState<'VOX' | 'PTT_HOT' | 'DUAL_NET'>('PTT_HOT');

  const bufferPresets = [
    { size: 64, latency: '1.33 ms', desc: 'Ultra-Low CQB Combat Mode', stable: 'Combat Prime' },
    { size: 128, latency: '2.67 ms', desc: 'Tactical Standard (TOC Default)', stable: 'Optimal' },
    { size: 256, latency: '5.33 ms', desc: 'High RF Interference Shielded', stable: 'Hardened' },
    { size: 512, latency: '10.67 ms', desc: 'Maximum Headroom / Deep Intel', stable: 'Max Margin' },
  ];

  return (
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none font-mono text-xs bg-[#060a07]">
      {/* Header */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#22e565]/10 border border-[#22e565]/40 flex items-center justify-center text-[#22e565]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>
            <h1 className="font-stencil text-xs font-bold tracking-widest text-[#f0fdf4] uppercase">
              MIL-SPEC AUDIO HARDWARE &amp; TRANSDUCER I/O ROUTING
            </h1>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22e565]/15 border border-[#22e565]/40 text-[#22e565] font-bold">
              MIL-DTL-38999
            </span>
          </div>
          <p className="text-[#8ba695] text-[11px] mt-1 font-mono">
            Transducer calibration, analog pre-amps, NATO U-283/U 6-Pin tactical radio links, and ALSA RT-PREEMPT hardware ring buffers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-1 rounded bg-[#070e09] border border-[#223425] text-[#8ba695]">
            DEVICE CLOCK: <strong className="text-[#22e565]">48.0 kHz PLL HARD-LOCKED</strong>
          </span>
        </div>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Input Transducer */}
        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3.5 space-y-3 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
            <div className="flex items-center space-x-2">
              <Mic className="w-4 h-4 text-[#f59e0b]" />
              <span className="font-stencil font-bold text-[#f0fdf4] tracking-wide text-xs">
                PRIMARY TRANSDUCER (MICROPHONE)
              </span>
            </div>
            <span className="text-[#22e565] text-[9px] font-bold px-2 py-0.5 rounded bg-[#22e565]/10 border border-[#22e565]/40">
              [CONNECTED // IP68]
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[9px] text-[#4e6a5b] uppercase tracking-wider">TACTICAL HARDWARE IDENTIFIER:</div>
            <div className="bg-[#070e09] p-2 rounded border border-[#223425] text-[#f0fdf4] font-bold text-[11px] flex items-center justify-between">
              <span>Ops-Core AMP / ComTac V Dual Electret Boom</span>
              <span className="text-[#22e565] text-[9px]">DIFFERENTIAL NOISE-CANCEL</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[#8ba695] text-[11px]">
              <span>PREAMP ANALOG GAIN</span>
              <span className="text-[#22e565] font-bold">+{preampGain.toFixed(1)} dB</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="0.5"
              value={preampGain}
              onChange={(e) => setPreampGain(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#070e09] rounded appearance-none cursor-pointer accent-[#22e565]"
            />
            <div className="flex justify-between text-[9px] text-[#4e6a5b]">
              <span>0.0 dB</span>
              <span>+20.0 dB (NOMINAL BATTLE)</span>
              <span>+40.0 dB (WHISPER)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8ba695] pt-2 border-t border-[#223425]">
            <div className="bg-[#070e09] p-2 rounded border border-[#223425]">
              <span className="text-[#4e6a5b] block text-[8px] uppercase">POLAR PATTERN:</span>
              <span className="text-[#f0fdf4] font-bold">HYPERCARDIOID DUAL</span>
            </div>
            <div className="bg-[#070e09] p-2 rounded border border-[#223425]">
              <span className="text-[#4e6a5b] block text-[8px] uppercase">PHYSICAL CONNECTOR:</span>
              <span className="text-[#22e565] font-bold">NATO U-283/U 6-PIN</span>
            </div>
          </div>
        </div>

        {/* Output Device */}
        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3.5 space-y-3 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
            <div className="flex items-center space-x-2">
              <Headphones className="w-4 h-4 text-[#22e565]" />
              <span className="font-stencil font-bold text-[#f0fdf4] tracking-wide text-xs">
                COMBAT EARPIECE &amp; HELMET TRANSDUCER
              </span>
            </div>
            <span className="text-[#22e565] text-[9px] font-bold px-2 py-0.5 rounded bg-[#22e565]/10 border border-[#22e565]/40">
              [ACTIVE // NFMI LINK]
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-[9px] text-[#4e6a5b] uppercase tracking-wider">TACTICAL DRIVER SPECIFICATION:</div>
            <div className="bg-[#070e09] p-2 rounded border border-[#223425] text-[#f0fdf4] font-bold text-[11px] flex items-center justify-between">
              <span>40mm Beryllium High-SPL Drivers + NFMI Plugs</span>
              <span className="text-[#22e565] text-[9px]">BALANCED 32-OHM</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[#8ba695] text-[11px]">
              <span>OUTPUT TRIM GAIN</span>
              <span className="text-[#22e565] font-bold">{outputTrim > 0 ? `+${outputTrim.toFixed(1)}` : outputTrim.toFixed(1)} dB</span>
            </div>
            <input
              type="range"
              min="-30"
              max="6"
              step="0.5"
              value={outputTrim}
              onChange={(e) => setOutputTrim(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#070e09] rounded appearance-none cursor-pointer accent-[#22e565]"
            />
            <div className="flex justify-between text-[9px] text-[#4e6a5b]">
              <span>-30.0 dB</span>
              <span>-4.0 dB (SAFE TOC)</span>
              <span>+6.0 dB (COMBAT BOOST)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-[#8ba695] pt-2 border-t border-[#223425]">
            <div className="bg-[#070e09] p-2 rounded border border-[#223425]">
              <span className="text-[#4e6a5b] block text-[8px] uppercase">BLAST OVERPRESSURE:</span>
              <span className="text-[#f0fdf4] font-bold">120 dB PEAK CLAMP</span>
            </div>
            <div className="bg-[#070e09] p-2 rounded border border-[#223425]">
              <span className="text-[#4e6a5b] block text-[8px] uppercase">PASSIVE ATTENUATION:</span>
              <span className="text-[#22e565] font-bold">NRR 28 dB SEAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Buffer Size Selection */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3.5 space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#22e565]" />
            <span className="font-stencil font-bold text-[#f0fdf4] tracking-wide text-xs">
              DSP CORE HARDWARE RING BUFFER PRESETS (I/O RING)
            </span>
          </div>
          <span className="text-[#22e565] font-bold text-[11px]">
            ACTIVE: {bufferSize} SAMPLES ({(bufferSize / 48).toFixed(2)} ms @ 48kHz)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {bufferPresets.map((item) => {
            const isActive = bufferSize === item.size;
            return (
              <button
                key={item.size}
                onClick={() => setBufferSize(item.size)}
                className={`p-2.5 rounded border text-left transition-all ${
                  isActive
                    ? 'bg-[#22e565]/15 border-[#22e565] text-[#22e565] shadow-[0_0_12px_rgba(34,229,101,0.2)]'
                    : 'bg-[#070e09] border-[#223425] text-[#8ba695] hover:border-[#2e4632] hover:text-[#f0fdf4]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-[#f0fdf4] font-stencil">{item.size} SAMPLES</div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#22e565] animate-pulse" />}
                </div>
                <div className={`text-[10px] font-bold mt-1 ${isActive ? 'text-[#22e565]' : 'text-[#8ba695]'}`}>
                  {item.latency} LATENCY
                </div>
                <div className="text-[9px] text-[#4e6a5b] mt-0.5 truncate">{item.desc}</div>
              </button>
            );
          })}
        </div>

        {/* PTT Mode Selector & Radio Bridge */}
        <div className="pt-2 border-t border-[#223425] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px]">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="text-[#8ba695]">TACTICAL PTT ROUTE:</span>
            <div className="flex items-center space-x-1">
              {(['VOX', 'PTT_HOT', 'DUAL_NET'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setPttMode(m)}
                  className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                    pttMode === m
                      ? 'bg-[#22e565]/20 border-[#22e565] text-[#22e565]'
                      : 'bg-[#070e09] border-[#223425] text-[#4e6a5b] hover:text-[#8ba695]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-[#8ba695]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22e565]" />
            <span>ALSA RT-PREEMPT KERNEL PRIORITY 98 // LOCKED FIFO</span>
          </div>
        </div>
      </div>
    </div>
  );
};
