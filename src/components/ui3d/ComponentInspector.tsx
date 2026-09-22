import React from 'react';
import { X, Cpu, Radio, Shield, Zap, ArrowDownRight, Layers } from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { HARDWARE_COMPONENTS } from '../../data/componentsData';

export const ComponentInspector: React.FC = () => {
  const { selectedComponentId, hoveredComponentId } = useViewerStore();

  const activeId = selectedComponentId || hoveredComponentId;
  if (!activeId) return null;

  const comp = HARDWARE_COMPONENTS[activeId];
  if (!comp) return null;

  return (
    <div className="absolute top-20 right-6 z-20 tactical-glass p-4 rounded-xl border border-[#00e5ff]/35 shadow-2xl w-80 animate-fade-in">
      {/* Header with Close */}
      <div className="flex items-start justify-between pb-2 border-b border-[#1f2d42]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#00e5ff]/15 flex items-center justify-center text-[#00e5ff]">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#00e5ff] tracking-widest uppercase">
              {comp.category}
            </span>
            <h4 className="text-xs font-bold font-mono text-white tracking-wide">{comp.name}</h4>
          </div>
        </div>
        <button
          onClick={() => viewerStore.selectComponent(null)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Role / Description */}
      <div className="my-2.5">
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-0.5">
          FUNCTIONAL ROLE:
        </span>
        <p className="text-[11px] text-slate-200 leading-relaxed">{comp.role}</p>
      </div>

      {/* Acoustic / Electrical I/O */}
      <div className="space-y-1.5 my-2.5 p-2 rounded-lg bg-[#070a10] border border-[#172030] text-[10px] font-mono">
        <div>
          <span className="text-slate-400">SIGNAL INPUT: </span>
          <span className="text-amber-400">{comp.input}</span>
        </div>
        <div>
          <span className="text-slate-400">SIGNAL OUTPUT: </span>
          <span className="text-emerald-400">{comp.output}</span>
        </div>
        <div>
          <span className="text-slate-400">PHYSICAL CONNECTION: </span>
          <span className="text-[#00e5ff]">{comp.connection}</span>
        </div>
      </div>

      {/* Military Technical Specifications */}
      <div>
        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
          ENGINEERING SPECIFICATIONS:
        </span>
        <ul className="space-y-1 text-[10px] font-mono text-slate-300">
          {comp.technicalSpecs.map((spec, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-[#00e5ff] font-bold">›</span>
              <span>{spec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
