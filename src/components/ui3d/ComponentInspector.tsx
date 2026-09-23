import React from 'react';
import { X, Cpu, Radio, Shield, Zap, ArrowDownRight, Layers, Crosshair } from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { HARDWARE_COMPONENTS } from '../../data/componentsData';

export const ComponentInspector: React.FC = () => {
  const { selectedComponentId, hoveredComponentId } = useViewerStore();

  const activeId = selectedComponentId || hoveredComponentId;
  if (!activeId) return null;

  const comp = HARDWARE_COMPONENTS[activeId];
  if (!comp) return null;

  return (
    <div className="mil-corner-bracket absolute top-20 right-6 z-20 bg-[#0b120c]/95 border border-[#223425] p-3.5 rounded shadow-2xl backdrop-blur-md w-80 animate-fade-in font-mono select-none">
      {/* Header with Close */}
      <div className="flex items-start justify-between pb-2 border-b border-[#223425]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#22e565]/15 border border-[#22e565]/40 flex items-center justify-center text-[#22e565]">
            <Crosshair className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[9px] text-[#22e565] tracking-widest uppercase font-stencil font-bold">
              [ {comp.category} ]
            </span>
            <h4 className="text-xs font-stencil font-bold text-[#f0fdf4] tracking-wide">{comp.name}</h4>
          </div>
        </div>
        <button
          onClick={() => viewerStore.selectComponent(null)}
          className="text-[#8ba695] hover:text-[#f0fdf4] p-1 rounded hover:bg-[#142418] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Role / Description */}
      <div className="my-2">
        <span className="text-[9px] text-[#4e6a5b] uppercase tracking-wider block mb-0.5 font-stencil font-bold">
          MISSION ROLE:
        </span>
        <p className="text-[11px] text-[#8ba695] leading-relaxed font-mono">{comp.role}</p>
      </div>

      {/* Acoustic / Electrical I/O */}
      <div className="space-y-1 my-2 p-2 rounded bg-[#070e09] border border-[#223425] text-[10px]">
        <div>
          <span className="text-[#8ba695]">SIGNAL INPUT: </span>
          <span className="text-[#f59e0b] font-semibold">{comp.input}</span>
        </div>
        <div>
          <span className="text-[#8ba695]">SIGNAL OUTPUT: </span>
          <span className="text-[#22e565] font-semibold">{comp.output}</span>
        </div>
        <div>
          <span className="text-[#8ba695]">TACTICAL BUS: </span>
          <span className="text-[#22e565] font-semibold">{comp.connection}</span>
        </div>
      </div>

      {/* Military Technical Specifications */}
      <div>
        <span className="text-[9px] text-[#4e6a5b] uppercase tracking-wider block mb-1 font-stencil font-bold">
          MIL-SPEC PARAMETERS:
        </span>
        <ul className="space-y-1 text-[10px] text-[#8ba695]">
          {comp.technicalSpecs.map((spec, idx) => (
            <li key={idx} className="flex items-start gap-1.5">
              <span className="text-[#22e565] font-bold">›</span>
              <span>{spec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
