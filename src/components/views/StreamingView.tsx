import React from 'react';
import { Network, Radio, Wifi, Server, Lock, ShieldCheck, Zap, Activity } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface StreamingViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const StreamingView: React.FC<StreamingViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none bg-[#060a07] font-mono text-xs">
      {/* Header */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#22e565]/10 border border-[#22e565]/40 flex items-center justify-center text-[#22e565]">
              <Network className="w-3.5 h-3.5" />
            </div>
            <h1 className="font-stencil text-xs font-bold tracking-widest text-[#f0fdf4] uppercase">
              TACTICAL C4ISR DATA-LINK &amp; MANET AUDIO STREAM CONSOLE
            </h1>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22e565]/15 border border-[#22e565]/40 text-[#22e565] font-bold">
              STANAG 4677
            </span>
          </div>
          <p className="text-[#8ba695] text-[11px] mt-1 font-mono">
            Encrypted low-latency Opus audio stream over Mobile Ad-hoc Tactical Mesh (MANET) with Frequency Hopping Spread Spectrum (FHSS).
          </p>
        </div>

        <button
          onClick={store.toggleStreaming}
          className={`px-3.5 py-1.5 rounded border font-stencil text-xs font-bold tracking-wider transition-all cursor-pointer ${
            store.isStreamingActive
              ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-900/30'
              : 'bg-[#22e565]/15 border-[#22e565] text-[#22e565] hover:bg-[#22e565]/25 shadow-[0_0_10px_rgba(34,229,101,0.25)]'
          }`}
        >
          {store.isStreamingActive ? '[ SEVER TACTICAL LINK ]' : '[ CONNECT TACTICAL MESH ]'}
        </button>
      </div>

      {/* Grid of Streaming Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {/* Stream Status */}
        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 space-y-2 shadow-md">
          <div className="flex justify-between items-center text-[#8ba695] pb-1.5 border-b border-[#223425]">
            <span className="text-[10px] uppercase font-bold">TACTICAL LINK STATE</span>
            <Wifi className="w-3.5 h-3.5 text-[#22e565]" />
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${store.isStreamingActive ? 'bg-[#22e565] animate-pulse shadow-[0_0_8px_#22e565]' : 'bg-red-500'}`} />
            <span className="text-base font-extrabold text-[#f0fdf4] font-stencil">
              {store.isStreamingActive ? 'MANET ACTIVE // ENCRYPTED' : 'RADIO SILENCE // MUTE'}
            </span>
          </div>
          <div className="text-[10px] text-[#4e6a5b]">
            FHSS HOP RATE: 1,200 HOPS/SEC // AES-256-GCM
          </div>
        </div>

        {/* Codec & Bitrate */}
        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 space-y-2 shadow-md">
          <div className="flex justify-between items-center text-[#8ba695] pb-1.5 border-b border-[#223425]">
            <span className="text-[10px] uppercase font-bold">VOIP CODEC &amp; FEC</span>
            <Radio className="w-3.5 h-3.5 text-[#22e565]" />
          </div>
          <div className="text-base font-extrabold text-[#22e565] font-stencil">
            OPUS CBR 64 KBPS
          </div>
          <div className="text-[10px] text-[#4e6a5b]">
            IN-BAND FEC 20% // REDUNDANCY ARMED
          </div>
        </div>

        {/* Network Jitter & Latency */}
        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 space-y-2 shadow-md">
          <div className="flex justify-between items-center text-[#8ba695] pb-1.5 border-b border-[#223425]">
            <span className="text-[10px] uppercase font-bold">TACTICAL RF LATENCY</span>
            <Server className="w-3.5 h-3.5 text-[#22e565]" />
          </div>
          <div className="text-base font-extrabold text-[#f0fdf4] font-stencil">
            {store.telemetry.latencyMs} ms
          </div>
          <div className="text-[10px] text-[#4e6a5b]">
            JITTER: {store.telemetry.networkJitterMs} ms // PACKET LOSS: 0.00%
          </div>
        </div>
      </div>

      {/* Remote Node Route Matrix */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3.5 space-y-3 font-mono text-xs shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22e565]" />
            <span className="font-stencil font-bold text-[#f0fdf4] uppercase tracking-wider text-xs">
              TACTICAL MESH ROUTING TABLE // PLATOON NET ALPHA
            </span>
          </div>
          <span className="text-[9px] text-[#22e565] bg-[#22e565]/10 px-2 py-0.5 rounded border border-[#22e565]/40 font-bold">
            4 NODES SYNCHRONIZED
          </span>
        </div>

        <div className="divide-y divide-[#223425] text-[11px]">
          {[
            { callsign: 'VIPER-LEAD', role: 'Platoon Commander', mgrs: '11SMU923841', ip: '10.240.12.1:5004', ping: '12ms', status: 'IFF MODE 5' },
            { callsign: 'VIPER-02', role: 'Forward Observer', mgrs: '11SMU925848', ip: '10.240.12.2:5004', ping: '18ms', status: 'IFF MODE 5' },
            { callsign: 'IRON-HORSE', role: 'M2A3 Bradley Escort', mgrs: '11SMU918835', ip: '10.240.12.9:5004', ping: '24ms', status: 'IFF MODE 5' },
            { callsign: 'TOC-COMMAND', role: 'Battalion TOC Relay', mgrs: '11SMU901812', ip: '10.240.12.100:5004', ping: '38ms', status: 'IFF MODE 5' },
          ].map((peer, idx) => (
            <div key={idx} className="py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div className="flex items-center space-x-3">
                <span className="text-[#22e565] font-bold font-stencil w-32">{peer.callsign}</span>
                <span className="text-[#8ba695]">{peer.role}</span>
              </div>
              <div className="flex items-center space-x-6 text-[#4e6a5b]">
                <span className="text-[#f59e0b] font-mono text-[10px]">MGRS: {peer.mgrs}</span>
                <span className="text-[#8ba695]">{peer.ip}</span>
                <span className="text-[#f0fdf4] tabular-nums font-bold">{peer.ping}</span>
                <span className="text-[#22e565] font-bold text-[10px] bg-[#22e565]/10 px-1.5 py-0.5 rounded border border-[#22e565]/30">
                  {peer.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Security Stamp */}
        <div className="pt-2 border-t border-[#223425] flex items-center justify-between text-[10px] text-[#8ba695]">
          <div className="flex items-center space-x-2">
            <Lock className="w-3 h-3 text-[#22e565]" />
            <span>SESSION CRYPTO: EPHEMERAL CURVE25519 KEY EXCHANGE ROTATING EVERY 300s</span>
          </div>
          <span className="text-[#22e565]">ANTI-SPOOF ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
