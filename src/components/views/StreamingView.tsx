import React from 'react';
import { Network, Radio, Wifi, Server, Lock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface StreamingViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const StreamingView: React.FC<StreamingViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none bg-[#040a07]">
      {/* Header */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-4 h-4 text-[#00e599]" />
            <h1 className="font-mono text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
              LOW-LATENCY TACTICAL NETWORK STREAMING CONSOLE
            </h1>
          </div>
          <p className="text-[#8ba695] text-xs mt-1 font-sans">
            Opus audio encoding stream routed over encrypted military ad-hoc tactical mesh (MANET) protocol.
          </p>
        </div>

        <button
          onClick={store.toggleStreaming}
          className={`px-3.5 py-1.5 rounded-[3px] border font-mono text-xs font-bold tracking-wider transition-all cursor-pointer ${
            store.isStreamingActive
              ? 'bg-[#ff3b5c]/15 border-[#ff3b5c]/40 text-[#ff3b5c] hover:bg-[#ff3b5c]/25'
              : 'bg-[#00e599]/15 border-[#00e599]/40 text-[#00e599] hover:bg-[#00e599]/25 shadow-[0_0_8px_rgba(0,229,153,0.15)]'
          }`}
        >
          {store.isStreamingActive ? '[ TERMINATE STREAM ]' : '[ CONNECT TACTICAL LINK ]'}
        </button>
      </div>

      {/* Grid of Streaming Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {/* Stream Status */}
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 space-y-2.5 shadow-md">
          <div className="flex justify-between items-center text-[#8ba695] pb-2 border-b border-[#143526]">
            <span className="text-[10px] uppercase">LINK STATE</span>
            <Wifi className="w-3.5 h-3.5 text-[#00e599]" />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${store.isStreamingActive ? 'bg-[#00e599] animate-pulse shadow-[0_0_6px_#00e599]' : 'bg-[#ff3b5c]'}`} />
            <span className="text-base font-extrabold text-[#f0fdf4]">
              {store.isStreamingActive ? 'OPERATIONAL LINK' : 'OFFLINE'}
            </span>
          </div>
          <div className="text-[10px] text-[#4e6a5b]">
            PROTOCOL: RTP / UDP TACTICAL ENCRYPTED
          </div>
        </div>

        {/* Codec & Bitrate */}
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 space-y-2.5 shadow-md">
          <div className="flex justify-between items-center text-[#8ba695] pb-2 border-b border-[#143526]">
            <span className="text-[10px] uppercase">CODEC PROFILE</span>
            <Radio className="w-3.5 h-3.5 text-[#00e599]" />
          </div>
          <div className="text-base font-extrabold text-[#00e599]">
            OPUS CBR 64 KBPS
          </div>
          <div className="text-[10px] text-[#4e6a5b]">
            48.0 kHz / FULLBAND VOIP COMPLEXITY 8
          </div>
        </div>

        {/* Network Jitter & Latency */}
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 space-y-2.5 shadow-md">
          <div className="flex justify-between items-center text-[#8ba695] pb-2 border-b border-[#143526]">
            <span className="text-[10px] uppercase">END-TO-END DELAY</span>
            <Server className="w-3.5 h-3.5 text-[#00e599]" />
          </div>
          <div className="text-base font-extrabold text-[#f0fdf4]">
            {store.telemetry.latencyMs} ms
          </div>
          <div className="text-[10px] text-[#4e6a5b]">
            JITTER: {store.telemetry.networkJitterMs} ms // LOSS: 0.0%
          </div>
        </div>
      </div>

      {/* Remote Node Route Matrix */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 space-y-3 font-mono text-xs shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#143526]">
          <span className="font-bold text-[#f0fdf4] uppercase tracking-wider text-xs">TACTICAL MESH ROUTING TABLE</span>
          <span className="text-[9px] text-[#00e599] bg-[#00e599]/10 px-2 py-0.5 rounded border border-[#00e599]/30">
            4 PEERS ACTIVE
          </span>
        </div>

        <div className="divide-y divide-[#143526] text-[11px]">
          {[
            { callsign: 'VIPER-LEAD', role: 'Platoon Command', ip: '10.240.12.1:5004', ping: '12ms', status: 'ACTIVE' },
            { callsign: 'VIPER-02', role: 'Forward Observer', ip: '10.240.12.2:5004', ping: '18ms', status: 'ACTIVE' },
            { callsign: 'IRON-HORSE', role: 'Armored Extraction', ip: '10.240.12.9:5004', ping: '24ms', status: 'ACTIVE' },
            { callsign: 'AIR-BASE-ALPHA', role: 'Tactical TOC Relay', ip: '10.240.12.100:5004', ping: '42ms', status: 'ACTIVE' },
          ].map((peer, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-[#00e599] font-bold w-32">{peer.callsign}</span>
                <span className="text-[#8ba695]">{peer.role}</span>
              </div>
              <div className="flex items-center space-x-6 text-[#4e6a5b]">
                <span className="text-[#8ba695]">{peer.ip}</span>
                <span className="text-[#f0fdf4] tabular-nums">{peer.ping}</span>
                <span className="text-[#10b981] font-semibold">{peer.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
