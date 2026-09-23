import React from 'react';
import { X, Activity, Sliders, Waves, Layers, Database, Crosshair } from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { OscilloscopePanel } from './OscilloscopePanel';
import { ScenarioSelector } from './ScenarioSelector';
import { PipelineOverlay } from './PipelineOverlay';
import { CustomDatasetManager } from '../dataset/CustomDatasetManager';

export const SimulationDock: React.FC = () => {
  const { showHud, activeHudTab, customDataset } = useViewerStore();

  if (!showHud) return null;

  return (
    <aside className="mil-corner-bracket fixed top-14 right-3 bottom-14 z-40 w-96 md:w-[480px] max-w-[94vw] bg-[#0b120c]/95 border border-[#223425] p-3.5 rounded shadow-[0_12px_48px_rgba(0,0,0,0.9)] backdrop-blur-md flex flex-col font-mono select-none animate-fade-in pointer-events-auto">
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#223425] mb-2.5 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#22e565]/10 border border-[#22e565]/40 flex items-center justify-center text-[#22e565]">
            <Crosshair className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold uppercase font-stencil tracking-widest text-[#f0fdf4]">
            TOC DSP TELEMETRY &amp; SCOPES
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Tabs */}
          <div className="flex items-center bg-[#070e09] p-0.5 rounded border border-[#223425] text-[9px] font-stencil">
            <button
              onClick={() => viewerStore.setActiveHudTab('oscilloscope')}
              className={`px-2 py-1 rounded font-bold transition-all ${
                activeHudTab === 'oscilloscope'
                  ? 'bg-[#22e565]/20 text-[#22e565] border border-[#22e565]/40'
                  : 'text-[#8ba695] hover:text-[#f0fdf4]'
              }`}
            >
              WAVEFORMS
            </button>
            <button
              onClick={() => viewerStore.setActiveHudTab('scenarios')}
              className={`px-2 py-1 rounded font-bold transition-all ${
                activeHudTab === 'scenarios'
                  ? 'bg-[#22e565]/20 text-[#22e565] border border-[#22e565]/40'
                  : 'text-[#8ba695] hover:text-[#f0fdf4]'
              }`}
            >
              THREATS
            </button>
            <button
              onClick={() => viewerStore.setActiveHudTab('dataset')}
              className={`flex items-center gap-1 px-2 py-1 rounded font-bold transition-all ${
                activeHudTab === 'dataset'
                  ? 'bg-[#22e565]/20 text-[#22e565] border border-[#22e565]/40'
                  : 'text-[#8ba695] hover:text-[#f0fdf4]'
              }`}
            >
              <Database className="w-2.5 h-2.5" />
              <span>CSV DATA</span>
              {customDataset && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#22e565] animate-pulse" />
              )}
            </button>
            <button
              onClick={() => viewerStore.setActiveHudTab('pipeline')}
              className={`px-2 py-1 rounded font-bold transition-all ${
                activeHudTab === 'pipeline'
                  ? 'bg-[#22e565]/20 text-[#22e565] border border-[#22e565]/40'
                  : 'text-[#8ba695] hover:text-[#f0fdf4]'
              }`}
            >
              FLOW
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => viewerStore.closeHud()}
            className="p-1 rounded bg-[#070e09] border border-[#223425] text-[#8ba695] hover:text-[#f0fdf4] hover:border-red-500/50 hover:bg-red-950/30 transition-all"
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
