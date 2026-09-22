import React from 'react';
import { Network, Radio, Wifi, ShieldCheck, Server, ArrowUpRight, Cpu } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface StreamingViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const StreamingView: React.FC<StreamingViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 select-none">
      {/* Header */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Network className="w-5 h-5 text-signal-cyan" />
            <h1 className="font-mono text-sm font-bold tracking-wider text-slate-100">
              LOW-LATENCY TACTICAL NETWORK STREAMING CONSOLE
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Opus audio encoding stream routed over encrypted military ad-hoc tactical mesh (MANET) protocol.
          </p>
        </div>

        <button
          onClick={store.toggleStreaming}
          className={`px-4 py-2 rounded border font-mono text-xs font-bold tracking-wider transition-all ${
            store.isStreamingActive
              ? 'bg-signal-red/15 border-signal-red/30 text-red-400 hover:bg-signal-red/25'
              : 'bg-signal-green/15 border-signal-green/30 text-signal-green hover:bg-signal-green/25'
          }`}
        >
          {store.isStreamingActive ? '[ TERMINATE STREAM ]' : '[ CONNECT STREAM ]'}
        </button>
      </div>

      {/* Grid of Streaming Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        {/* Stream Status */}
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-[#161d2c]">
            <span>LINK STATE</span>
            <Wifi className="w-4 h-4 text-signal-cyan" />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${store.isStreamingActive ? 'bg-signal-green animate-pulse' : 'bg-signal-red'}`} />
            <span className="text-base font-bold text-slate-100">
              {store.isStreamingActive ? 'OPERATIONAL LINK' : 'OFFLINE'}
            </span>
          </div>
          <div className="text-[11px] text-slate-500">
            PROTOCOL: RTP / UDP TACTICAL ENCRYPTED
          </div>
        </div>

        {/* Codec & Bitrate */}
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-[#161d2c]">
            <span>CODEC PROFILE</span>
            <Radio className="w-4 h-4 text-signal-cyan" />
          </div>
          <div className="text-base font-bold text-signal-cyan">
            OPUS CBR 64 KBPS
          </div>
          <div className="text-[11px] text-slate-500">
            48.0 kHz / FULLBAND VOIP COMPLEXITY 8
          </div>
        </div>

        {/* Network Jitter & Latency */}
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-[#161d2c]">
            <span>END-TO-END DELAY</span>
            <Server className="w-4 h-4 text-signal-cyan" />
          </div>
          <div className="text-base font-bold text-slate-100">
            {store.telemetry.latencyMs} ms
          </div>
          <div className="text-[11px] text-slate-500">
            JITTER: {store.telemetry.networkJitterMs} ms // LOSS: 0.0%
          </div>
        </div>
      </div>

      {/* Remote Node Route Matrix */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#161d2c]">
          <span className="font-bold text-slate-200">TACTICAL MESH ROUTING TABLE</span>
          <span className="text-[10px] text-signal-green">NODE ONLINE (4 PEERS)</span>
        </div>

        <div className="divide-y divide-[#141a28] text-[11px]">
          {[
            { callsign: 'VIPER-LEAD', role: 'Platoon Command', ip: '10.240.12.1:5004', ping: '12ms', status: 'ACTIVE' },
            { callsign: 'VIPER-02', role: 'Forward Observer', ip: '10.240.12.2:5004', ping: '18ms', status: 'ACTIVE' },
            { callsign: 'IRON-HORSE', role: 'Armored Extraction', ip: '10.240.12.9:5004', ping: '24ms', status: 'ACTIVE' },
            { callsign: 'AIR-BASE-ALPHA', role: 'Tactical TOC Relay', ip: '10.240.12.100:5004', ping: '42ms', status: 'ACTIVE' },
          ].map((peer, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-signal-cyan font-bold w-32">{peer.callsign}</span>
                <span className="text-slate-400">{peer.role}</span>
              </div>
              <div className="flex items-center space-x-6 text-slate-500">
                <span>{peer.ip}</span>
                <span className="text-slate-300">{peer.ping}</span>
                <span className="text-signal-green font-semibold">{peer.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
