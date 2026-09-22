import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Camera,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { PIPELINE_STAGES } from '../../data/scenariosData';
import { HARDWARE_COMPONENTS } from '../../data/componentsData';

export const WorkflowStageCard: React.FC = () => {
  const {
    workflowStep,
    currentMode,
    showWaveCollision
  } = useViewerStore();

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const activeStage = PIPELINE_STAGES.find((s) => s.step === workflowStep) || PIPELINE_STAGES[0];
  const targetComponent = HARDWARE_COMPONENTS[activeStage.componentId];

  // Show in WORKFLOW and SIMULATION modes
  if (currentMode !== 'WORKFLOW' && currentMode !== 'SIMULATION') {
    return null;
  }

  const getSignalBadgeColor = (signalType: string) => {
    switch (signalType) {
      case 'NOISE':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'REFERENCE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'PROCESSING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'SPEAKER':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'ERROR':
        return 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40';
      case 'VOICE':
      case 'OUTPUT':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  // Minimized state: slim single pill
  if (isCollapsed) {
    return (
      <div className="absolute top-16 left-4 z-20 pointer-events-auto font-mono select-none">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg tactical-glass border border-[#00e5ff]/30 text-xs hover:border-[#00e5ff] text-slate-200 transition-all shadow-lg"
        >
          <span
            className="w-4 h-4 rounded text-[9px] font-bold text-black flex items-center justify-center"
            style={{ backgroundColor: activeStage.color }}
          >
            {activeStage.step}
          </span>
          <span className="text-[10px] font-bold text-[#00e5ff]">STAGE {activeStage.step} TELEMETRY</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-16 left-4 z-20 w-72 md:w-80 pointer-events-auto font-mono select-none animate-fade-in">
      <div className="tactical-glass p-3 rounded-xl border border-[#00e5ff]/30 shadow-2xl backdrop-blur-xl">
        {/* Header: Stage Badge + Title + Collapse Button */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1c293d] mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono text-black"
              style={{ backgroundColor: activeStage.color }}
            >
              {activeStage.step}
            </span>
            <div>
              <div className="text-[10px] font-bold text-white tracking-wide truncate max-w-[170px]">
                {activeStage.title}
              </div>
              <div className="text-[8px] text-slate-400 truncate max-w-[170px]">
                {activeStage.subtitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded border ${getSignalBadgeColor(activeStage.signalType)}`}>
              {activeStage.signalType}
            </span>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
              title="Minimize Telemetry Card"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mathematical Expression Box */}
        <div className="p-1.5 rounded-lg bg-[#060a12] border border-[#1b2b40] mb-2">
          <div className="text-[7px] uppercase tracking-wider text-slate-400 mb-0.5 flex justify-between">
            <span>ACOUSTIC ALGORITHM FORMULA</span>
            <span className="text-[#00e5ff]">REAL-TIME</span>
          </div>
          <div className="text-[10px] font-bold text-amber-300 tracking-wider font-mono py-0.5 px-1 bg-[#0b121e] rounded border border-amber-500/20 truncate">
            {activeStage.mathFormula}
          </div>
        </div>

        {/* Latency & Key Metric Telemetry Bar */}
        <div className="grid grid-cols-2 gap-1.5 mb-2 text-[8px]">
          {/* Latency Budget */}
          <div className="p-1.5 rounded bg-[#070d18] border border-[#162234]">
            <span className="text-slate-400 block text-[7px]">STAGE LATENCY</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] font-bold text-[#00e5ff]">{activeStage.latencyMs} ms</span>
              <span className="text-[7px] text-slate-500">/ &lt; 0.85 ms</span>
            </div>
            {/* Latency Gauge */}
            <div className="w-full bg-[#0e1726] h-1 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${Math.min(100, (activeStage.latencyMs / 0.85) * 100)}%`,
                  backgroundColor: activeStage.latencyMs > 0.80 ? '#f59e0b' : '#00e5ff',
                }}
              />
            </div>
          </div>

          {/* Physical Metric */}
          <div className="p-1.5 rounded bg-[#070d18] border border-[#162234]">
            <span className="text-slate-400 block text-[7px] truncate">{activeStage.metricLabel}</span>
            <div className="text-[11px] font-bold text-emerald-400 truncate">
              {activeStage.metricValue}
            </div>
            <div className="text-[7px] text-slate-500 mt-1 truncate">Continuous Verification</div>
          </div>
        </div>

        {/* Operational Description */}
        <div className="p-1.5 rounded bg-[#070d18]/60 border border-[#172336] text-[9px] text-slate-300 leading-normal mb-2 max-h-20 overflow-y-auto">
          {activeStage.detailDescription}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5">
          {targetComponent && (
            <button
              onClick={() => {
                viewerStore.selectComponent(activeStage.componentId);
                viewerStore.setCameraPreset(activeStage.cameraPreset);
              }}
              className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded bg-[#0c1422] border border-[#00e5ff]/40 text-[#00e5ff] hover:bg-[#00e5ff]/15 text-[9px] font-bold transition-all"
            >
              <Camera className="w-3 h-3" />
              <span>FOCUS PART</span>
            </button>
          )}

          {(activeStage.step === 4 || activeStage.step === 5) && (
            <button
              onClick={() => viewerStore.toggleWaveCollision()}
              className={`p-1 rounded border text-[9px] font-bold flex items-center gap-1 transition-all ${
                showWaveCollision
                  ? 'bg-purple-500/20 text-purple-300 border-purple-400'
                  : 'bg-[#0c1422] text-slate-400 border-[#1e293b]'
              }`}
              title="Toggle 3D Ear Canal Wave Collision"
            >
              <Zap className="w-3 h-3" />
              <span>180° NULL</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
