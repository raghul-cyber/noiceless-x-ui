import React from 'react';
import { LiveAudioMonitoring } from '../audio/LiveAudioMonitoring';
import { TelemetryGrid } from '../audio/TelemetryGrid';
import { ControlDock } from '../audio/ControlDock';
import { PlaybackABCard } from '../audio/PlaybackABCard';
import { NetworkStreamingCard } from '../audio/NetworkStreamingCard';
import { SceneContainer } from '../3d/SceneContainer';
import { Box, Maximize2, Shield, Radio, Sparkles, Database } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CustomDatasetManager } from '../dataset/CustomDatasetManager';

interface OverviewViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 select-none">
      {/* Top Section: Real-Time Audio Monitoring (Dual Oscilloscopes & Processing Node) */}
      <LiveAudioMonitoring store={store} />

      {/* Second Section: 4-Metric Telemetry Grid (INPUT -25dB, OUTPUT -44dB, NOISE RED 19.5dB, LATENCY 42ms) */}
      <TelemetryGrid store={store} />

      {/* Third Section: Split Row -> Controls (Record + Processing) and Tactical 3D Soldier Tile */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        {/* Left 2 columns: Control Dock (Record Audio & Processing Cards) */}
        <div className="xl:col-span-2 flex flex-col justify-between space-y-4">
          <ControlDock store={store} />
          <PlaybackABCard store={store} />
        </div>

        {/* Right 1 column: Live 3D Tactical Hardware & Acoustic Rig Preview Tile */}
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg overflow-hidden flex flex-col min-h-[340px]">
          <div className="h-10 px-3 bg-[#090c13] border-b border-[#182030] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Box className="w-3.5 h-3.5 text-signal-cyan" />
              <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
                ACOUSTIC TEST RIG &amp; 3D SIMULATION
              </span>
            </div>
            <button
              onClick={() => store.setActiveView('hardware3d')}
              className="p-1 rounded bg-[#121826] border border-[#1e273a] text-slate-400 hover:text-signal-cyan hover:border-signal-cyan/40 transition-all text-[11px] font-mono flex items-center space-x-1 px-2"
              title="Expand Full 3D Simulation Viewport"
            >
              <span>FULL SIMULATION</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Interactive 3D Mini Viewport */}
          <div className="relative flex-1 bg-[#05070c] overflow-hidden">
            <SceneContainer />
            {/* Quick angle indicator overlay */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 font-mono text-[9px] text-slate-400 pointer-events-none">
              TITANIUM ACOUSTIC RIG // 15.5cm BINAURAL MOUNT
            </div>
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 border border-white/10 font-mono text-[9px] text-signal-green flex items-center space-x-1 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-signal-green" />
              <span>LAB TEST CALIBRATED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Section: Custom Acoustic CSV Dataset Ingestion Hub */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-xl p-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#182030] mb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h3 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
              CUSTOM DATASET INGESTION &amp; BATCH ACOUSTIC PROCESSING (.CSV)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            LOCAL DEVICE CSV INGESTION
          </span>
        </div>
        <CustomDatasetManager store={store} />
      </div>

      {/* Bottom Section: Network Streaming Card */}
      <NetworkStreamingCard store={store} />
    </div>
  );
};
