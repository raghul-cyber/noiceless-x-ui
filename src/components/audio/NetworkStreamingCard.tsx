import React from 'react';
import { Network, Radio, Wifi, ShieldAlert, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface NetworkStreamingCardProps {
  store: ReturnType<typeof useAppStore>;
}

export const NetworkStreamingCard: React.FC<NetworkStreamingCardProps> = ({ store }) => {
  return (
    <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-[#161d2c] mb-3">
        <div className="flex items-center space-x-2">
          <Network className="w-4 h-4 text-signal-cyan" />
          <span className="font-mono text-xs font-bold tracking-wider text-slate-200 uppercase">
            NETWORK STREAMING
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">
          AES-256 ENCRYPTED TACTICAL MESH
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <span className={`w-2.5 h-2.5 rounded-full ${
            store.isStreamingActive ? 'bg-signal-green animate-pulse' : 'bg-signal-red'
          }`} />
          <span className={`font-bold tracking-wider ${
            store.isStreamingActive ? 'text-signal-green' : 'text-signal-red'
          }`}>
            {store.isStreamingActive ? '● CONNECTED' : '○ DISCONNECTED'}
          </span>
        </div>

        {/* Live streaming telemetry badges */}
        <div className="flex flex-wrap items-center gap-3 text-slate-400">
          <div className="bg-[#0e131d] px-2.5 py-1 rounded border border-[#1b2336] flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-500">RATE:</span>
            <span className="text-slate-200 font-bold">{store.telemetry.sampleRate / 1000} kHz</span>
          </div>

          <div className="bg-[#0e131d] px-2.5 py-1 rounded border border-[#1b2336] flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-500">LATENCY:</span>
            <span className="text-signal-cyan font-bold">{store.telemetry.latencyMs} ms</span>
          </div>

          <div className="bg-[#0e131d] px-2.5 py-1 rounded border border-[#1b2336] flex items-center space-x-1.5">
            <span className="text-[10px] text-slate-500">PACKET LOSS:</span>
            <span className="text-signal-green font-bold">{store.telemetry.packetLossPercent.toFixed(1)}%</span>
          </div>

          <div className="hidden lg:flex bg-[#0e131d] px-2.5 py-1 rounded border border-[#1b2336] items-center space-x-1.5">
            <span className="text-[10px] text-slate-500">JITTER:</span>
            <span className="text-slate-200">{store.telemetry.networkJitterMs} ms</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={store.toggleStreaming}
          className={`w-full md:w-auto px-4 py-1.5 rounded border font-mono text-xs font-bold tracking-wider transition-all ${
            store.isStreamingActive
              ? 'bg-signal-red/10 border-signal-red/30 text-red-400 hover:bg-signal-red/20'
              : 'bg-signal-green/10 border-signal-green/30 text-signal-green hover:bg-signal-green/20'
          }`}
        >
          {store.isStreamingActive ? '[ STOP STREAM ]' : '[ START STREAM ]'}
        </button>
      </div>
    </div>
  );
};
