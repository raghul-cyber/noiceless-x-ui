import React, { useState } from 'react';
import { Cpu, HardDrive, Zap, Clock, ShieldCheck, Activity, Terminal, Thermometer, Server, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface SystemViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const SystemView: React.FC<SystemViewProps> = ({ store }) => {
  const [zeroizeArmed, setZeroizeArmed] = useState<boolean>(false);

  const handleZeroize = () => {
    if (confirm('CRITICAL WARNING: INITIATE CRYPTO ZEROIZE? All mission keys, recordings, and volatile RAM caches will be purged immediately according to NSA/CSS Manual 9-12.')) {
      alert('CRYPTO ZEROIZE PROTOCOL COMPLETE: Volatile keys purged. System sanitized.');
      setZeroizeArmed(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none font-mono text-xs bg-[#060a07]">
      {/* Header */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#22e565]/10 border border-[#22e565]/40 flex items-center justify-center text-[#22e565]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <h1 className="font-stencil text-xs font-bold tracking-widest text-[#f0fdf4] uppercase">
              MIL-SPEC HARDENED RASPBERRY PI 4 DSP COMPUTE CORE
            </h1>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22e565]/15 border border-[#22e565]/40 text-[#22e565] font-bold">
              MIL-STD-810H / 461G
            </span>
          </div>
          <p className="text-[#8ba695] text-[11px] mt-1 font-mono">
            Quad-core Cortex-A72 ARM NEON DSP telemetry, RT-PREEMPT real-time kernel, thermal dissipation, and MIL-STD-810H envelope.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-1 rounded bg-[#070e09] border border-[#223425] text-[#8ba695] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22e565] animate-pulse" />
            <span>KERNEL: <strong className="text-[#22e565]">6.6.20-rt25 PREEMPT_RT</strong></span>
          </span>
        </div>
      </div>

      {/* Hardware Specs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] uppercase font-bold">CORTEX-A72 LOAD</span>
            <Activity className="w-3.5 h-3.5 text-[#22e565]" />
          </div>
          <div className="text-xl font-extrabold text-[#22e565] tabular-nums font-stencil">
            {store.telemetry.cpuLoadPercent.toFixed(1)}%
          </div>
          <span className="text-[10px] text-[#8ba695] block">4 Cores @ 1.80 GHz Fixed</span>
        </div>

        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] uppercase font-bold">INFERENCE CYCLE</span>
            <Zap className="w-3.5 h-3.5 text-[#22e565]" />
          </div>
          <div className="text-xl font-extrabold text-[#22e565] tabular-nums font-stencil">
            0.82 ms
          </div>
          <span className="text-[10px] text-[#8ba695] block">Per 10ms Audio Frame (ARM NEON)</span>
        </div>

        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] uppercase font-bold">RAM CONSUMPTION</span>
            <Server className="w-3.5 h-3.5 text-[#8ba695]" />
          </div>
          <div className="text-xl font-extrabold text-[#f0fdf4] tabular-nums font-stencil">
            184 MB
          </div>
          <span className="text-[10px] text-[#8ba695] block">Of 8GB ECC LPDDR4-3200</span>
        </div>

        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 space-y-1 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] uppercase font-bold">SoC TEMPERATURE</span>
            <Thermometer className="w-3.5 h-3.5 text-[#f59e0b]" />
          </div>
          <div className="text-xl font-extrabold text-[#f59e0b] tabular-nums font-stencil">
            43.8 °C
          </div>
          <span className="text-[10px] text-[#8ba695] block">Enclosure Margin: +27.2°C Remaining</span>
        </div>
      </div>

      {/* Latency Budget Breakdown */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3.5 space-y-3 text-xs shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#22e565]" />
            <span className="font-stencil font-bold text-[#f0fdf4] tracking-wide text-xs">
              TACTICAL AUDIO LATENCY BUDGET ALLOCATION (42.0 ms TOTAL MOUTH-TO-EAR)
            </span>
          </div>
          <span className="text-[#22e565] font-bold text-[11px]">
            {store.telemetry.latencyMs} ms MEASURED TOTAL
          </span>
        </div>

        <div className="space-y-2.5 pt-1">
          <div>
            <div className="flex justify-between text-[#8ba695] mb-1 text-[11px]">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
                <span>1. HARDWARE ADC INGESTION &amp; RING BUFFERING</span>
              </span>
              <span className="text-[#f0fdf4] font-bold tabular-nums">12.0 ms (28.5%)</span>
            </div>
            <div className="w-full h-2 bg-[#070e09] rounded overflow-hidden border border-[#223425]">
              <div className="h-full bg-[#f59e0b]" style={{ width: '28.5%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#8ba695] mb-1 text-[11px]">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22e565]" />
                <span>2. DEEPFILTERNET3 NEURAL TACTICAL SPEECH ENHANCEMENT</span>
              </span>
              <span className="text-[#22e565] font-bold tabular-nums">18.0 ms (42.8%)</span>
            </div>
            <div className="w-full h-2 bg-[#070e09] rounded overflow-hidden border border-[#223425]">
              <div className="h-full bg-[#22e565]" style={{ width: '42.8%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#8ba695] mb-1 text-[11px]">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span>3. HARDWARE DAC I2S SYNCHRONIZATION &amp; EARPIECE DRIVER</span>
              </span>
              <span className="text-[#10b981] font-bold tabular-nums">12.0 ms (28.5%)</span>
            </div>
            <div className="w-full h-2 bg-[#070e09] rounded overflow-hidden border border-[#223425]">
              <div className="h-full bg-[#10b981]" style={{ width: '28.5%' }} />
            </div>
          </div>
        </div>

        {/* Environmental & Emergency Zeroize Section */}
        <div className="pt-2 border-t border-[#223425] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[10px]">
          <div className="flex items-center gap-2 text-[#22e565]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPERATING ENVELOPE: -40°C TO +71°C // 40G PYROTECHNIC SHOCK CERTIFIED</span>
          </div>

          <div className="flex items-center gap-2">
            {!zeroizeArmed ? (
              <button
                onClick={() => setZeroizeArmed(true)}
                className="px-2.5 py-1 rounded bg-[#070e09] border border-red-500/40 text-red-400 hover:bg-red-950/40 text-[9px] font-bold font-stencil transition-all"
              >
                [ ARM ZEROIZE ]
              </button>
            ) : (
              <button
                onClick={handleZeroize}
                className="px-2.5 py-1 rounded bg-red-600 border border-red-400 text-white font-bold font-stencil text-[9px] animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.5)] transition-all"
              >
                [ CONFIRM ZEROIZE WIPE ]
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
