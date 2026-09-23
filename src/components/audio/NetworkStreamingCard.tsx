import React from 'react';
import { Network, Radio, Wifi, Lock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface NetworkStreamingCardProps {
  store: ReturnType<typeof useAppStore>;
}

export const NetworkStreamingCard: React.FC<NetworkStreamingCardProps> = ({ store }) => {
  return (
    <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 select-none shadow-md mil-corner-bracket">
      <div className="flex items-center justify-between pb-2 border-b border-[#223425] mb-3">
        <div className="flex items-center space-x-2">
          <Network className="w-3.5 h-3.5 text-[#22e565]" />
          <span className="font-mono text-xs font-bold tracking-wider text-[#e8f2e6] uppercase">
            // STANAG TACTICAL DATA-LINK &amp; SATCOM AUDIO STREAM
          </span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[9px] text-[#22e565] bg-[#22e565]/10 px-2 py-0.5 rounded-[1px] border border-[#22e565]/30 font-bold">
          <Lock className="w-2.5 h-2.5 text-[#22e565]" />
          <span>AES-256-GCM MANET LINK</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
        {/* Status indicator */}
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-[1px] ${
            store.isStreamingActive ? 'bg-[#22e565] animate-pulse shadow-[0_0_6px_#22e565]' : 'bg-[#ef4444]'
          }`} />
          <span className={`font-bold tracking-wider text-[11px] ${
            store.isStreamingActive ? 'text-[#22e565]' : 'text-[#ef4444]'
          }`}>
            {store.isStreamingActive ? '● TACTICAL MESH BROADCASTING' : '○ STANDBY // DISCONNECTED'}
          </span>
        </div>

        {/* Live streaming telemetry badges */}
        <div className="flex flex-wrap items-center gap-2 text-[#7ea385]">
          <div className="bg-[#060a07] px-2 py-0.5 rounded-[1px] border border-[#223425] flex items-center space-x-1.5">
            <span className="text-[8px] text-[#557b5c]">BAND:</span>
            <span className="text-[#e8f2e6] font-semibold">UHF 382.45 MHz</span>
          </div>

          <div className="bg-[#060a07] px-2 py-0.5 rounded-[1px] border border-[#223425] flex items-center space-x-1.5">
            <span className="text-[8px] text-[#557b5c]">DELAY:</span>
            <span className="text-[#22e565] font-bold">{store.telemetry.latencyMs} ms</span>
          </div>

          <div className="bg-[#060a07] px-2 py-0.5 rounded-[1px] border border-[#223425] flex items-center space-x-1.5">
            <span className="text-[8px] text-[#557b5c]">PACKET LOSS:</span>
            <span className="text-[#22e565] font-semibold">{store.telemetry.packetLossPercent.toFixed(1)}%</span>
          </div>

          <div className="hidden lg:flex bg-[#060a07] px-2 py-0.5 rounded-[1px] border border-[#223425] items-center space-x-1.5">
            <span className="text-[8px] text-[#557b5c]">JITTER:</span>
            <span className="text-[#e8f2e6]">{store.telemetry.networkJitterMs} ms</span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={store.toggleStreaming}
          className={`w-full md:w-auto px-3.5 py-1.5 rounded-[1px] border font-mono text-xs font-bold tracking-wider transition-all cursor-pointer ${
            store.isStreamingActive
              ? 'bg-[#ef4444]/15 border-[#ef4444]/50 text-[#ef4444] hover:bg-[#ef4444]/25'
              : 'bg-[#22e565]/15 border-[#22e565]/50 text-[#22e565] hover:bg-[#22e565]/25 shadow-[0_0_8px_rgba(34,229,101,0.2)]'
          }`}
        >
          {store.isStreamingActive ? '[ DROP TACTICAL STREAM ]' : '[ CONNECT TACTICAL MESH ]'}
        </button>
      </div>
    </div>
  );
};
