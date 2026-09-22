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
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl tactical-glass border border-[#00e5ff]/25 shadow-2xl text-[11px]">
        {/* Focus Group */}
        <span className="text-[8px] text-slate-500 font-bold px-1 uppercase tracking-wider hidden sm:inline">
          FOCUS:
        </span>
        <button
          onClick={() => {
            viewerStore.selectComponent(null);
            viewerStore.setCameraPreset('SYSTEM_OVERVIEW');
          }}
          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
            !selectedComponentId
              ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
              ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/50'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
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
              ? 'bg-purple-500/25 text-purple-300 border border-purple-400'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="In-Ear Destructive Wave Null Node"
        >
          <Zap className="w-2.5 h-2.5 text-purple-400" />
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
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
          title="Waist DSP & Raspberry Pi Compute Unit"
        >
          DSP PI
        </button>

        <div className="h-4 w-px bg-slate-700/80 mx-1" />

        {/* View Mode Buttons */}
        <button
          onClick={() => viewerStore.setMode('WORKFLOW')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
            currentMode === 'WORKFLOW'
              ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Play className="w-2.5 h-2.5 text-emerald-400" />
          <span>WORKFLOW</span>
        </button>

        <button
          onClick={() => viewerStore.setMode('SIMULATION')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
            currentMode === 'SIMULATION'
              ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Activity className="w-2.5 h-2.5 text-[#00e5ff]" />
          <span>ACOUSTICS</span>
        </button>

        <button
          onClick={() => viewerStore.setMode('EXPLODED')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
            currentMode === 'EXPLODED'
              ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-2.5 h-2.5" />
          <span>EXPLODED</span>
        </button>

        {currentMode === 'EXPLODED' && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#060a12] border border-cyan-500/30">
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={explodedProgress}
              onChange={(e) => viewerStore.setExplodedProgress(parseFloat(e.target.value))}
              className="w-16 accent-[#00e5ff] cursor-pointer"
            />
            <span className="text-[9px] text-[#00e5ff]">{Math.round(explodedProgress * 100)}%</span>
          </div>
        )}

        <button
          onClick={() => viewerStore.setMode('X-RAY')}
          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
            currentMode === 'X-RAY'
              ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          X-RAY
        </button>

        <div className="h-4 w-px bg-slate-700/80 mx-1" />

        {/* Toggles: Labels, Reset, Fullscreen */}
        <button
          onClick={() => viewerStore.toggleLabels()}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all ${
            showLabels
              ? 'text-[#00e5ff] bg-[#00e5ff]/15 border border-[#00e5ff]/40'
              : 'text-slate-400 hover:text-white'
          }`}
          title="Toggle Active Component 3D Label"
        >
          <Tag className="w-3 h-3" />
          <span className="hidden sm:inline">LABELS</span>
        </button>

        <button
          onClick={() => viewerStore.resetView()}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          title="Reset Camera View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
