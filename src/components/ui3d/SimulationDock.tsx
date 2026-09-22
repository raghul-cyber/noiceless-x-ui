import React from 'react';
import { X, Activity, Sliders, Waves, Layers, Database } from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { OscilloscopePanel } from './OscilloscopePanel';
import { ScenarioSelector } from './ScenarioSelector';
import { PipelineOverlay } from './PipelineOverlay';
import { CustomDatasetManager } from '../dataset/CustomDatasetManager';

export const SimulationDock: React.FC = () => {
  const { showHud, activeHudTab, customDataset } = useViewerStore();

  if (!showHud) return null;

  return (
    <aside className="fixed top-14 right-3 bottom-14 z-40 w-96 md:w-[480px] max-w-[94vw] tactical-glass p-3 rounded-2xl border border-[#00e5ff]/35 shadow-[0_12px_48px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col font-mono select-none animate-fade-in pointer-events-auto">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#1c293d] mb-2.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00e5ff]" />
          <h3 className="font-tech text-xs font-bold uppercase tracking-wider text-white">
            DSP TELEMETRY &amp; SIMULATION
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Tabs */}
          <div className="flex items-center bg-[#070c14] p-0.5 rounded-lg border border-[#1e293b] text-[9px]">
            <button
              onClick={() => viewerStore.setActiveHudTab('oscilloscope')}
              className={`px-2 py-1 rounded font-bold transition-all ${
                activeHudTab === 'oscilloscope'
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              WAVEFORMS
            </button>
            <button
              onClick={() => viewerStore.setActiveHudTab('scenarios')}
              className={`px-2 py-1 rounded font-bold transition-all ${
                activeHudTab === 'scenarios'
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ENV NOISE
            </button>
            <button
              onClick={() => viewerStore.setActiveHudTab('dataset')}
              className={`flex items-center gap-1 px-2 py-1 rounded font-bold transition-all ${
                activeHudTab === 'dataset'
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-2.5 h-2.5" />
              <span>CSV DATA</span>
              {customDataset && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => viewerStore.setActiveHudTab('pipeline')}
              className={`px-2 py-1 rounded font-bold transition-all ${
                activeHudTab === 'pipeline'
                  ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              FLOW
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => viewerStore.closeHud()}
            className="p-1 rounded-lg bg-[#0d1420] border border-[#1e293b] text-slate-400 hover:text-white hover:border-red-500/50 hover:bg-red-950/30 transition-all"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto pr-1">
        {activeHudTab === 'oscilloscope' && <OscilloscopePanel />}
        {activeHudTab === 'scenarios' && <ScenarioSelector />}
        {activeHudTab === 'dataset' && <CustomDatasetManager compact />}
        {activeHudTab === 'pipeline' && <PipelineOverlay />}
      </div>
    </aside>
  );
};
