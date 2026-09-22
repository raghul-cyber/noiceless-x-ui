import React from 'react';
import { Cpu, HardDrive, Zap, Clock, ShieldCheck, Activity, Terminal, Thermometer, Server } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface SystemViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const SystemView: React.FC<SystemViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 select-none font-mono">
      {/* Header */}
      <div className="bg-[#08140e] border border-[#143526] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-black/40">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center text-[#00e599]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
              EMBEDDED RASPBERRY PI 4 MODEL B DSP TELEMETRY
            </h1>
          </div>
          <p className="text-[#8ba695] text-[11px] mt-1">
            SoC thermal telemetry, quad-core Cortex-A72 utilization, ONNX neural inference benchmarks, and power distribution.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2.5 py-1 rounded-md bg-[#030906] border border-[#143526] text-[#8ba695] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
            <span>KERNEL: <strong>6.6.20-rt25 PREEMPT_RT</strong></span>
          </span>
        </div>
      </div>

      {/* Hardware Specs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        <div className="bg-[#08140e] border border-[#143526] rounded-xl p-3.5 space-y-1 shadow-md shadow-black/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] uppercase font-bold">CORTEX-A72 LOAD</span>
            <Activity className="w-3.5 h-3.5 text-[#00e599]" />
          </div>
          <div className="text-2xl font-bold text-[#00e599] tabular-nums font-mono">
            {store.telemetry.cpuLoadPercent.toFixed(1)}%
          </div>
          <span className="text-[10px] text-[#8ba695] block">4 Cores @ 1.80 GHz (Fixed P-State)</span>
        </div>

        <div className="bg-[#08140e] border border-[#143526] rounded-xl p-3.5 space-y-1 shadow-md shadow-black/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] uppercase font-bold">INFERENCE CYCLE</span>
            <Zap className="w-3.5 h-3.5 text-[#10b981]" />
          </div>
          <div className="text-2xl font-bold text-[#10b981] tabular-nums font-mono">
            0.82 ms
          </div>
          <span className="text-[10px] text-[#8ba695] block">Per 10ms Audio Frame (RNNNoise)</span>
        </div>

        <div className="bg-[#08140e] border border-[#143526] rounded-xl p-3.5 space-y-1 shadow-md shadow-black/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] uppercase font-bold">RAM CONSUMPTION</span>
            <Server className="w-3.5 h-3.5 text-[#8ba695]" />
          </div>
          <div className="text-2xl font-bold text-[#f0fdf4] tabular-nums font-mono">
            184 MB
          </div>
          <span className="text-[10px] text-[#8ba695] block">Of 8GB LPDDR4-3200 Locked</span>
        </div>

        <div className="bg-[#08140e] border border-[#143526] rounded-xl p-3.5 space-y-1 shadow-md shadow-black/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] uppercase font-bold">SoC TEMPERATURE</span>
            <Thermometer className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 tabular-nums font-mono">
            43.8 °C
          </div>
          <span className="text-[10px] text-[#8ba695] block">Passive Aluminum Heatsink (-36° Margin)</span>
        </div>
      </div>

      {/* Latency Budget Breakdown */}
      <div className="bg-[#08140e] border border-[#143526] rounded-xl p-4 space-y-3.5 text-xs shadow-lg shadow-black/40">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#143526]">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#00e599]" />
            <span className="font-bold text-[#f0fdf4] tracking-wide">SYSTEM LATENCY BUDGET ALLOCATION (42.0 ms TOTAL)</span>
          </div>
          <span className="text-[#00e599] font-bold font-mono text-[11px]">
            {store.telemetry.latencyMs} ms MEASURED MOUTH-TO-EAR
          </span>
        </div>

        <div className="space-y-3 pt-1">
          <div>
            <div className="flex justify-between text-[#8ba695] mb-1.5 text-[11px]">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>1. HARDWARE ADC INGESTION &amp; CIRCULAR RING BUFFER</span>
              </span>
              <span className="text-[#f0fdf4] font-bold tabular-nums">12.0 ms (28.5%)</span>
            </div>
            <div className="w-full h-2 bg-[#030906] rounded-full overflow-hidden border border-[#143526]">
              <div className="h-full bg-amber-400" style={{ width: '28.5%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#8ba695] mb-1.5 text-[11px]">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
                <span>2. RNNNOISE RECURRENT NEURAL NETWORK INFERENCE</span>
              </span>
              <span className="text-[#00e599] font-bold tabular-nums">18.0 ms (42.8%)</span>
            </div>
            <div className="w-full h-2 bg-[#030906] rounded-full overflow-hidden border border-[#143526]">
              <div className="h-full bg-[#00e599]" style={{ width: '42.8%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[#8ba695] mb-1.5 text-[11px]">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                <span>3. HARDWARE DAC I2S SYNCHRONIZATION &amp; TRANSDUCER OUTPUT</span>
              </span>
              <span className="text-[#10b981] font-bold tabular-nums">12.0 ms (28.5%)</span>
            </div>
            <div className="w-full h-2 bg-[#030906] rounded-full overflow-hidden border border-[#143526]">
              <div className="h-full bg-[#10b981]" style={{ width: '28.5%' }} />
            </div>
          </div>
        </div>

        <div className="pt-2 text-[10px] text-[#4e6a5b] border-t border-[#143526] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#00e599]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ZERO BUFFER OVERFLOWS OR XRUNS DETECTED (UPTIME: 14h 28m)</span>
          </div>
          <span className="text-[#8ba695]">THREAD PINNING: CORES 2 &amp; 3 ISOLATED</span>
        </div>
      </div>
    </div>
  );
};
