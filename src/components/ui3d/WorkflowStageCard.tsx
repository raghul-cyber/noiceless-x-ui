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
        return 'bg-[#00e599]/20 text-[#00e599] border-[#00e599]/40';
      case 'PROCESSING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'SPEAKER':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ERROR':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'VOICE':
      case 'OUTPUT':
        return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/40';
      default:
        return 'bg-[#00e599]/20 text-[#00e599] border-[#00e599]/40';
    }
  };

  // Minimized state: slim single pill
  if (isCollapsed) {
    return (
      <div className="absolute top-16 left-4 z-20 pointer-events-auto font-mono select-none">
        <button
          onClick={() => setIsCollapsed(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#08140e]/95 border border-[#143526] text-xs hover:border-[#00e599] text-[#f0fdf4] transition-all shadow-lg"
        >
          <span
            className="w-4 h-4 rounded text-[9px] font-bold text-black flex items-center justify-center font-mono"
            style={{ backgroundColor: activeStage.color }}
          >
            {activeStage.step}
          </span>
          <span className="text-[10px] font-bold text-[#00e599]">STAGE {activeStage.step} TELEMETRY</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#8ba695]" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-16 left-4 z-20 w-72 md:w-80 pointer-events-auto font-mono select-none animate-fade-in">
      <div className="bg-[#08140e]/95 border border-[#143526] p-3 rounded-xl shadow-2xl backdrop-blur-xl">
        {/* Header: Stage Badge + Title + Collapse Button */}
        <div className="flex items-center justify-between pb-2 border-b border-[#143526] mb-2">
          <div className="flex items-center gap-2">
            <span
              className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold font-mono text-black"
              style={{ backgroundColor: activeStage.color }}
            >
              {activeStage.step}
            </span>
            <div>
              <div className="text-[10px] font-bold text-[#f0fdf4] tracking-wide truncate max-w-[170px]">
                {activeStage.title}
              </div>
              <div className="text-[8px] text-[#8ba695] truncate max-w-[170px]">
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
              className="p-1 rounded text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15] transition-all"
              title="Minimize Telemetry Card"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mathematical Expression Box */}
        <div className="p-1.5 rounded-lg bg-[#030906] border border-[#143526] mb-2">
          <div className="text-[7px] uppercase tracking-wider text-[#4e6a5b] mb-0.5 flex justify-between font-bold">
            <span>ACOUSTIC ALGORITHM FORMULA</span>
            <span className="text-[#00e599]">REAL-TIME</span>
          </div>
          <div className="text-[10px] font-bold text-amber-300 tracking-wider font-mono py-0.5 px-1 bg-[#06120a] rounded border border-amber-500/20 truncate">
            {activeStage.mathFormula}
          </div>
        </div>

        {/* Latency & Key Metric Telemetry Bar */}
        <div className="grid grid-cols-2 gap-1.5 mb-2 text-[8px]">
          {/* Latency Budget */}
          <div className="p-1.5 rounded bg-[#030906] border border-[#143526]">
            <span className="text-[#8ba695] block text-[7px]">STAGE LATENCY</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] font-bold text-[#00e599] font-mono">{activeStage.latencyMs} ms</span>
              <span className="text-[7px] text-[#4e6a5b]">/ &lt; 0.85 ms</span>
            </div>
            {/* Latency Gauge */}
            <div className="w-full bg-[#08140e] h-1 rounded-full mt-1 overflow-hidden border border-[#143526]">
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${Math.min(100, (activeStage.latencyMs / 0.85) * 100)}%`,
                  backgroundColor: activeStage.latencyMs > 0.80 ? '#f59e0b' : '#00e599',
                }}
              />
            </div>
          </div>

          {/* Physical Metric */}
          <div className="p-1.5 rounded bg-[#030906] border border-[#143526]">
            <span className="text-[#8ba695] block text-[7px] truncate">{activeStage.metricLabel}</span>
            <div className="text-[11px] font-bold text-[#10b981] truncate font-mono">
              {activeStage.metricValue}
            </div>
            <div className="text-[7px] text-[#4e6a5b] mt-1 truncate">Continuous Loop</div>
          </div>
        </div>

        {/* Operational Description */}
        <div className="p-1.5 rounded bg-[#030906] border border-[#143526] text-[9px] text-[#8ba695] leading-normal mb-2 max-h-20 overflow-y-auto">
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
              className="flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded bg-[#030906] border border-[#143526] text-[#00e599] hover:border-[#00e599] hover:bg-[#00e599]/10 text-[9px] font-bold transition-all"
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
                  : 'bg-[#030906] text-[#8ba695] border-[#143526]'
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
