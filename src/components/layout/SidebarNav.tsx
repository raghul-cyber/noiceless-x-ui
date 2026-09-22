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
    { id: 'live', label: 'LIVE', icon: Radio, badge: 'REALTIME' },
    { id: 'hardware3d', label: 'WORKFLOW & 3D SIM', icon: Box, badge: 'SIMULATION' },
    { id: 'recordings', label: 'RECORDINGS', icon: Disc, badge: `${store.recordings.length}` },
    { id: 'analysis', label: 'ANALYSIS', icon: BarChart3 },
    { id: 'streaming', label: 'STREAMING', icon: Network, badge: store.isStreamingActive ? 'ON' : 'OFF' },
    { id: 'devices', label: 'DEVICES', icon: SlidersHorizontal },
    { id: 'system', label: 'SYSTEM', icon: Cpu },
  ];

  return (
    <aside className="w-56 border-r border-[#182030] bg-[#07090e] flex flex-col justify-between select-none z-20 flex-shrink-0">
      {/* Primary Navigation List */}
      <div className="py-4">
        <div className="px-5 mb-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
          OPERATIONAL SUITE
        </div>
        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = store.activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => store.setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded text-xs font-mono tracking-wider transition-all text-left ${
                  isActive
                    ? 'bg-[#121826] text-signal-cyan font-semibold border-l-2 border-signal-cyan pl-3 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c101a]'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-signal-cyan' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive 
                      ? 'bg-signal-cyan/20 text-signal-cyan' 
                      : item.badge === 'ON'
                      ? 'bg-signal-green/20 text-signal-green'
                      : 'bg-[#151c2c] text-slate-500'
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
      <div className="p-4 border-t border-[#182030] bg-[#090c13] space-y-2 font-mono text-[11px]">
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[10px] text-slate-500 uppercase">HARDWARE I/O</span>
          <span className="text-signal-green flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-green animate-pulse" />
            <span>USB PnP</span>
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[10px] text-slate-500 uppercase">DSP LOAD</span>
          <span className="text-slate-300">{store.telemetry.cpuLoadPercent.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span className="text-[10px] text-slate-500 uppercase">NOISE RED</span>
          <span className="text-signal-cyan font-bold">-{store.telemetry.noiseReductionDb} dB</span>
        </div>
      </div>
    </aside>
  );
};
