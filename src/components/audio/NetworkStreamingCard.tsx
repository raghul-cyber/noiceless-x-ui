import React from 'react';
import { Network, Radio, Wifi, Lock, ArrowUpRight } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface NetworkStreamingCardProps {
  store: ReturnType<typeof useAppStore>;
}

export const NetworkStreamingCard: React.FC<NetworkStreamingCardProps> = ({ store }) => {
  return (
    <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 select-none shadow-md">
      <div className="flex items-center justify-between pb-2 border-b border-[#143526] mb-3">
        <div className="flex items-center space-x-2">
          <Network className="w-3.5 h-3.5 text-[#00e599]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
            ENCRYPTED TACTICAL NETWORK STREAMING MATRIX
          </span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[9px] text-[#00e599] bg-[#00e599]/10 px-2 py-0.5 rounded border border-[#00e599]/30">
          <Lock className="w-2.5 h-2.5 text-[#00e599]" />
          <span>AES-256 GCM SECURE LINK</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
        {/* Status indicator */}
        <div className="flex items-center space-x-2.5">
          <span className={`w-2 h-2 rounded-full ${
            store.isStreamingActive ? 'bg-[#00e599] animate-pulse shadow-[0_0_6px_#00e599]' : 'bg-[#ff3b5c]'
          }`} />
          <span className={`font-bold tracking-wider text-[11px] ${
            store.isStreamingActive ? 'text-[#00e599]' : 'text-[#ff3b5c]'
          }`}>
            {store.isStreamingActive ? '● MESH LINK ACTIVE' : '○ DISCONNECTED'}
          </span>
        </div>

        {/* Live streaming telemetry badges */}
        <div className="flex flex-wrap items-center gap-2 text-[#8ba695]">
          <div className="bg-[#040a07] px-2 py-0.5 rounded-[2px] border border-[#143526] flex items-center space-x-1.5">
            <span className="text-[9px] text-[#4e6a5b]">RATE:</span>
            <span className="text-[#f0fdf4] font-semibold">{store.telemetry.sampleRate / 1000} kHz</span>
          </div>

          <div className="bg-[#040a07] px-2 py-0.5 rounded-[2px] border border-[#143526] flex items-center space-x-1.5">
            <span className="text-[9px] text-[#4e6a5b]">DELAY:</span>
            <span className="text-[#00e599] font-bold">{store.telemetry.latencyMs} ms</span>
          </div>

          <div className="bg-[#040a07] px-2 py-0.5 rounded-[2px] border border-[#143526] flex items-center space-x-1.5">
            <span className="text-[9px] text-[#4e6a5b]">PACKET LOSS:</span>
            <span className="text-[#10b981] font-semibold">{store.telemetry.packetLossPercent.toFixed(1)}%</span>
          </div>

          <div className="hidden lg:flex bg-[#040a07] px-2 py-0.5 rounded-[2px] border border-[#143526] items-center space-x-1.5">
            <span className="text-[9px] text-[#4e6a5b]">JITTER:</span>
            <span className="text-[#f0fdf4]">{store.telemetry.networkJitterMs} ms</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={store.toggleStreaming}
          className={`w-full md:w-auto px-3.5 py-1.5 rounded-[3px] border font-mono text-xs font-bold tracking-wider transition-all cursor-pointer ${
            store.isStreamingActive
              ? 'bg-[#ff3b5c]/15 border-[#ff3b5c]/40 text-[#ff3b5c] hover:bg-[#ff3b5c]/25'
              : 'bg-[#00e599]/15 border-[#00e599]/40 text-[#00e599] hover:bg-[#00e599]/25 shadow-[0_0_8px_rgba(0,229,153,0.15)]'
          }`}
        >
          {store.isStreamingActive ? '[ TERMINATE STREAM ]' : '[ CONNECT TACTICAL LINK ]'}
        </button>
      </div>
    </div>
  );
};
