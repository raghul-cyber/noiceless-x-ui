import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  Disc, 
  BarChart3, 
  Network, 
  SlidersHorizontal, 
  Cpu, 
  Box
} from 'lucide-react';
import { ActiveView } from '../../types/audio';
import { useAppStore } from '../../store/useAppStore';

interface SidebarNavProps {
  store: ReturnType<typeof useAppStore>;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ store }) => {
  const navItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'overview', label: 'OVERVIEW', icon: LayoutDashboard },
    { id: 'live', label: 'LIVE SPECTRAL', icon: Radio, badge: 'REALTIME' },
    { id: 'hardware3d', label: 'WORKFLOW & 3D SIM', icon: Box, badge: 'SIMULATION' },
    { id: 'recordings', label: 'RECORDINGS', icon: Disc, badge: `${store.recordings.length}` },
    { id: 'analysis', label: 'ANALYSIS', icon: BarChart3 },
    { id: 'streaming', label: 'STREAMING', icon: Network, badge: store.isStreamingActive ? 'ON' : 'OFF' },
    { id: 'devices', label: 'DEVICES', icon: SlidersHorizontal },
    { id: 'system', label: 'SYSTEM', icon: Cpu },
  ];

  return (
    <aside className="w-56 border-r border-[#143526] bg-[#06100b] flex flex-col justify-between select-none z-20 flex-shrink-0">
      {/* Primary Navigation List */}
      <div className="py-3.5">
        <div className="px-3.5 mb-2.5 text-[9px] font-mono tracking-widest text-[#4e6a5b] uppercase flex items-center justify-between">
          <span>OPERATIONAL SUITE</span>
          <span className="text-[8px] text-[#8ba695] font-semibold">REV 4.2</span>
        </div>

        <nav className="space-y-1 px-2 font-mono">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = store.activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => store.setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs tracking-wider transition-all text-left ${
                  isActive
                    ? 'bg-[#00e599]/15 text-[#00e599] font-bold border-l-2 border-[#00e599] pl-2.5 shadow-[inset_0_0_12px_rgba(0,229,153,0.08)]'
                    : 'text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0a1c13]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00e599]' : 'text-[#4e6a5b]'}`} />
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isActive 
                      ? 'bg-[#00e599]/25 text-[#00e599] border border-[#00e599]/40' 
                      : item.badge === 'ON' || item.badge === 'REALTIME'
                      ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/25'
                      : 'bg-[#030906] text-[#4e6a5b] border border-[#143526]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom System Telemetry Summary */}
      <div className="p-3.5 border-t border-[#143526] bg-[#040a07] space-y-2 font-mono text-[11px]">
        <div className="flex justify-between items-center text-[#8ba695]">
          <span className="text-[9px] text-[#4e6a5b] uppercase tracking-wider">HARDWARE I/O</span>
          <span className="text-[#00e599] flex items-center space-x-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse shadow-[0_0_6px_#00e599]" />
            <span>USB PnP ACTIVE</span>
          </span>
        </div>
        <div className="flex justify-between items-center text-[#8ba695]">
          <span className="text-[9px] text-[#4e6a5b] uppercase tracking-wider">DSP LOAD</span>
          <span className="text-[#f0fdf4] font-semibold tabular-nums">{store.telemetry.cpuLoadPercent.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center text-[#8ba695]">
          <span className="text-[9px] text-[#4e6a5b] uppercase tracking-wider">NOISE RED</span>
          <span className="text-[#00e599] font-bold tabular-nums">-{store.telemetry.noiseReductionDb} dB</span>
        </div>
      </div>
    </aside>
  );
};
