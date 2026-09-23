import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  Disc, 
  BarChart3, 
  Network, 
  SlidersHorizontal, 
  Cpu, 
  Box,
  BrainCircuit,
  ShieldAlert,
  Wifi
} from 'lucide-react';
import { ActiveView } from '../../types/audio';
import { useAppStore } from '../../store/useAppStore';

interface SidebarNavProps {
  store: ReturnType<typeof useAppStore>;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ store }) => {
  const navItems: { id: ActiveView; index: string; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', index: '01', label: 'TOC OVERVIEW', icon: LayoutDashboard },
    { id: 'live', index: '02', label: 'COMBAT COMMS', icon: Radio, badge: 'REALTIME' },
    { id: 'hardware3d', index: '03', label: 'SENSOR RIG 3D', icon: Box, badge: 'SIM' },
    { id: 'analysis', index: '04', label: 'THREAT INTERCEPT', icon: BarChart3 },
    { id: 'training', index: '05', label: 'AI RETRAINING', icon: BrainCircuit, badge: 'TRAIN' },
    { id: 'devices', index: '06', label: 'FIELD HARDWARE', icon: SlidersHorizontal },
    { id: 'recordings', index: '07', label: 'MISSION LOGS', icon: Disc, badge: `${store.recordings.length}` },
    { id: 'streaming', index: '08', label: 'TACTICAL MESH', icon: Network, badge: store.isStreamingActive ? 'LIVE' : 'IDLE' },
    { id: 'system', index: '09', label: 'C4ISR DIAGNOSTICS', icon: Cpu },
  ];

  return (
    <aside className="w-64 border-r border-[#223425] bg-[#070c08] flex flex-col justify-between select-none z-20 flex-shrink-0">
      {/* Primary Military Navigation List */}
      <div className="py-2.5">
        <div className="px-3 mb-2 flex items-center justify-between border-b border-[#223425] pb-2 font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#22e565] shadow-[0_0_4px_#22e565]" />
            <span className="text-[9px] tracking-widest text-[#7ea385] uppercase font-bold">
              // TACTICAL OPS SUITE
            </span>
          </div>
          <span className="text-[8px] text-[#22e565] font-bold bg-[#22e565]/10 px-1 py-0.2 rounded border border-[#22e565]/30">
            TOC-ALPHA
          </span>
        </div>

        <nav className="space-y-1 px-2 font-mono">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = store.activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => store.setActiveView(item.id)}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-[2px] text-xs tracking-wider transition-all text-left ${
                  isActive
                    ? 'bg-[#142316] text-[#22e565] font-bold border-l-2 border-[#22e565] border-y border-r border-[#2e4632] pl-2 shadow-[inset_0_0_10px_rgba(34,229,101,0.15)]'
                    : 'text-[#7ea385] hover:text-[#e8f2e6] hover:bg-[#0e1710] border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <span className={`text-[9px] font-bold flex-shrink-0 ${isActive ? 'text-[#22e565]' : 'text-[#3d5c43]'}`}>
                    [{item.index}]
                  </span>
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#22e565]' : 'text-[#557b5c]'}`} />
                  <span className="text-[10px] font-bold uppercase truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`flex-shrink-0 ml-auto text-[8px] px-1.5 py-0.5 rounded-[1px] font-mono font-bold leading-none ${
                    isActive 
                      ? 'bg-[#22e565]/20 text-[#22e565] border border-[#22e565]/40' 
                      : item.badge === 'LIVE' || item.badge === 'REALTIME'
                      ? 'bg-[#22e565]/10 text-[#22e565] border border-[#22e565]/30'
                      : 'bg-[#050805] text-[#557b5c] border border-[#223425]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Military Base Telemetry & Classification Footer */}
      <div className="p-3 border-t border-[#223425] bg-[#050805] space-y-2 font-mono text-[10px]">
        <div className="flex justify-between items-center text-[#7ea385]">
          <span className="text-[8px] text-[#557b5c] uppercase tracking-wider">IFF SQUAWK</span>
          <span className="text-[#22e565] flex items-center space-x-1.5 font-bold text-[9px]">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-[#22e565] animate-pulse shadow-[0_0_6px_#22e565]" />
            <span>MODE 5 FRIENDLY</span>
          </span>
        </div>
        <div className="flex justify-between items-center text-[#7ea385]">
          <span className="text-[8px] text-[#557b5c] uppercase tracking-wider">DSP LOAD</span>
          <span className="text-[#e8f2e6] font-semibold tabular-nums">{store.telemetry.cpuLoadPercent.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center text-[#7ea385]">
          <span className="text-[8px] text-[#557b5c] uppercase tracking-wider">THREAT ATTEN</span>
          <span className="text-[#22e565] font-bold tabular-nums">-{store.telemetry.noiseReductionDb.toFixed(1)} dB</span>
        </div>
        <div className="pt-1.5 border-t border-[#223425] flex items-center justify-between text-[8px] text-[#557b5c]">
          <span>COMSEC: AES-256</span>
          <span className="text-[#7ea385] font-semibold">TOC-ALPHA</span>
        </div>
      </div>
    </aside>
  );
};
