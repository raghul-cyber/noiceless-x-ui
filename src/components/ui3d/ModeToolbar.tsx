import React from 'react';
import {
  Maximize,
  RotateCcw,
  Tag,
  Layers,
  Box,
  Activity,
  Play,
  Zap,
  Radio,
  Cpu
} from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { ViewMode } from '../../types/headset';

export const ModeToolbar: React.FC = () => {
  const {
    currentMode,
    explodedProgress,
    showLabels,
    selectedComponentId
  } = useViewerStore();

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none font-mono">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#08140e]/95 border border-[#143526] shadow-2xl backdrop-blur-md text-[11px]">
        {/* Focus Group */}
        <span className="text-[8px] text-[#4e6a5b] font-bold px-1 uppercase tracking-wider hidden sm:inline">
          FOCUS:
        </span>
        <button
          onClick={() => {
            viewerStore.selectComponent(null);
            viewerStore.setCameraPreset('SYSTEM_OVERVIEW');
          }}
          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
            !selectedComponentId
              ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/50'
              : 'text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15]'
          }`}
          title="Full System Test Rig View"
        >
          RIG
        </button>
        <button
          onClick={() => {
            viewerStore.selectComponent('boomMic');
            viewerStore.setCameraPreset('BOOM_MIC');
          }}
          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
            selectedComponentId === 'boomMic'
              ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/50'
              : 'text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15]'
          }`}
          title="Headset & Microphone"
        >
          HEADSET
        </button>
        <button
          onClick={() => {
            viewerStore.selectComponent('speakerDriver');
            viewerStore.setCameraPreset('EAR_CANAL');
          }}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold transition-all ${
            selectedComponentId === 'speakerDriver'
              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400'
              : 'text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15]'
          }`}
          title="In-Ear Destructive Wave Null Node"
        >
          <Zap className="w-2.5 h-2.5 text-emerald-400" />
          <span>EAR CANAL</span>
        </button>
        <button
          onClick={() => {
            viewerStore.selectComponent('raspberryPi');
            viewerStore.setCameraPreset('WAIST');
          }}
          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
            selectedComponentId === 'raspberryPi'
              ? 'bg-amber-500/25 text-amber-300 border border-amber-400'
              : 'text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15]'
          }`}
          title="Waist DSP & Raspberry Pi Compute Unit"
        >
          DSP PI
        </button>

        <div className="h-4 w-px bg-[#143526] mx-1" />

        {/* View Mode Buttons */}
        <button
          onClick={() => viewerStore.setMode('WORKFLOW')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
            currentMode === 'WORKFLOW'
              ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/60'
              : 'text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15]'
          }`}
        >
          <Play className="w-2.5 h-2.5 text-[#00e599]" />
          <span>WORKFLOW</span>
        </button>

        <button
          onClick={() => viewerStore.setMode('SIMULATION')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
            currentMode === 'SIMULATION'
              ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/60'
              : 'text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15]'
          }`}
        >
          <Activity className="w-2.5 h-2.5 text-[#00e599]" />
          <span>ACOUSTICS</span>
        </button>

        <button
          onClick={() => viewerStore.setMode('EXPLODED')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
            currentMode === 'EXPLODED'
              ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/60'
              : 'text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15]'
          }`}
        >
          <Layers className="w-2.5 h-2.5" />
          <span>EXPLODED</span>
        </button>

        {currentMode === 'EXPLODED' && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#030906] border border-[#143526]">
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={explodedProgress}
              onChange={(e) => viewerStore.setExplodedProgress(parseFloat(e.target.value))}
              className="w-16 accent-[#00e599] cursor-pointer"
            />
            <span className="text-[9px] text-[#00e599] font-mono">{Math.round(explodedProgress * 100)}%</span>
          </div>
        )}

        <button
          onClick={() => viewerStore.setMode('X-RAY')}
          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
            currentMode === 'X-RAY'
              ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/60'
              : 'text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15]'
          }`}
        >
          X-RAY
        </button>

        <div className="h-4 w-px bg-[#143526] mx-1" />

        {/* Toggles: Labels, Reset, Fullscreen */}
        <button
          onClick={() => viewerStore.toggleLabels()}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all ${
            showLabels
              ? 'text-[#00e599] bg-[#00e599]/15 border border-[#00e599]/40'
              : 'text-[#8ba695] hover:text-[#f0fdf4]'
          }`}
          title="Toggle Active Component 3D Label"
        >
          <Tag className="w-3 h-3" />
          <span className="hidden sm:inline">LABELS</span>
        </button>

        <button
          onClick={() => viewerStore.resetView()}
          className="p-1 rounded text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15] transition-all"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1 rounded text-[#8ba695] hover:text-[#f0fdf4] hover:bg-[#0c1f15] transition-all"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
