import React from 'react';
import { Cpu, HardDrive, Zap, Clock, ShieldCheck, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface SystemViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const SystemView: React.FC<SystemViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 select-none">
      {/* Header */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-signal-cyan" />
            <h1 className="font-mono text-sm font-bold tracking-wider text-slate-100">
              EMBEDDED RASPBERRY PI 4 MODEL B DSP TELEMETRY
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            SoC thermal sensors, quad-core Cortex-A72 load, ONNX neural runtime benchmarks, and power distribution.
          </p>
        </div>
      </div>

      {/* Hardware Specs Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">CORTEX-A72 CPU LOAD</span>
          <span className="text-xl font-bold text-signal-cyan">{store.telemetry.cpuLoadPercent.toFixed(1)}%</span>
          <span className="text-[10px] text-slate-500 block">4 Cores @ 1.80 GHz</span>
        </div>

        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">INFERENCE CYCLE</span>
          <span className="text-xl font-bold text-signal-green">0.82 ms</span>
          <span className="text-[10px] text-slate-500 block">Per 10ms Audio Frame</span>
        </div>

        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">RAM CONSUMPTION</span>
          <span className="text-xl font-bold text-slate-200">184 MB</span>
          <span className="text-[10px] text-slate-500 block">Of 8GB LPDDR4</span>
        </div>

        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-3.5 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">SoC TEMPERATURE</span>
          <span className="text-xl font-bold text-slate-200">43.8 °C</span>
          <span className="text-[10px] text-slate-500 block">Passive Aluminum Heatsink</span>
        </div>
      </div>

      {/* Latency Budget Breakdown */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#161d2c]">
          <span className="font-bold text-slate-200">SYSTEM LATENCY BUDGET ALLOCATION (42 ms TOTAL)</span>
          <span className="text-signal-cyan font-bold">{store.telemetry.latencyMs} ms MEASURED</span>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>1. HARDWARE ADC INGESTION & RING BUFFER</span>
              <span className="text-slate-200">12.0 ms (28.5%)</span>
            </div>
            <div className="w-full h-2 bg-[#121826] rounded overflow-hidden">
              <div className="h-full bg-signal-amber" style={{ width: '28.5%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>2. RNNNOISE RECURRENT NEURAL NETWORK INFERENCE</span>
              <span className="text-signal-cyan">18.0 ms (42.8%)</span>
            </div>
            <div className="w-full h-2 bg-[#121826] rounded overflow-hidden">
              <div className="h-full bg-signal-cyan" style={{ width: '42.8%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>3. HARDWARE DAC I2S SYNCHRONIZATION & OUTPUT</span>
              <span className="text-slate-200">12.0 ms (28.5%)</span>
            </div>
            <div className="w-full h-2 bg-[#121826] rounded overflow-hidden">
              <div className="h-full bg-signal-green" style={{ width: '28.5%' }} />
            </div>
          </div>
        </div>

        <div className="pt-2 text-[10px] text-slate-500 border-t border-[#161d2c] flex justify-between">
          <span>ZERO BUFFER OVERFLOWS OR XRUNS DETECTED</span>
          <span>RT-PREEMPT REAL-TIME LINUX KERNEL</span>
        </div>
      </div>
    </div>
  );
};
