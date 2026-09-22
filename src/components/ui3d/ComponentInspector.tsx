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
    <div className="absolute top-20 right-6 z-20 bg-[#08140e]/95 border border-[#143526] p-4 rounded-xl shadow-2xl backdrop-blur-xl w-80 animate-fade-in font-mono select-none">
      {/* Header with Close */}
      <div className="flex items-start justify-between pb-2.5 border-b border-[#143526]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#00e599]/15 border border-[#00e599]/30 flex items-center justify-center text-[#00e599]">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-[#00e599] tracking-widest uppercase font-bold">
              {comp.category}
            </span>
            <h4 className="text-xs font-bold text-[#f0fdf4] tracking-wide">{comp.name}</h4>
          </div>
        </div>
        <button
          onClick={() => viewerStore.selectComponent(null)}
          className="text-[#8ba695] hover:text-[#f0fdf4] p-1 rounded hover:bg-[#0c1f15] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Role / Description */}
      <div className="my-2.5">
        <span className="text-[9px] text-[#4e6a5b] uppercase tracking-wider block mb-0.5 font-bold">
          FUNCTIONAL ROLE:
        </span>
        <p className="text-[11px] text-[#8ba695] leading-relaxed">{comp.role}</p>
      </div>

      {/* Acoustic / Electrical I/O */}
      <div className="space-y-1.5 my-2.5 p-2.5 rounded-lg bg-[#030906] border border-[#143526] text-[10px]">
        <div>
          <span className="text-[#8ba695]">SIGNAL INPUT: </span>
          <span className="text-amber-400 font-semibold">{comp.input}</span>
        </div>
        <div>
          <span className="text-[#8ba695]">SIGNAL OUTPUT: </span>
          <span className="text-[#10b981] font-semibold">{comp.output}</span>
        </div>
        <div>
          <span className="text-[#8ba695]">PHYSICAL BUS: </span>
          <span className="text-[#00e599] font-semibold">{comp.connection}</span>
        </div>
      </div>

      {/* Military Technical Specifications */}
      <div>
        <span className="text-[9px] text-[#4e6a5b] uppercase tracking-wider block mb-1 font-bold">
          ENGINEERING SPECIFICATIONS:
        </span>
        <ul className="space-y-1 text-[10px] text-[#8ba695]">
          {comp.technicalSpecs.map((spec, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-[#00e599] font-bold">›</span>
              <span>{spec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
