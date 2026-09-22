import React from 'react';
import { LiveAudioMonitoring } from '../audio/LiveAudioMonitoring';
import { TelemetryGrid } from '../audio/TelemetryGrid';
import { ControlDock } from '../audio/ControlDock';
import { PlaybackABCard } from '../audio/PlaybackABCard';
import { NetworkStreamingCard } from '../audio/NetworkStreamingCard';
import { SceneContainer } from '../3d/SceneContainer';
import { Box, Maximize2, Database } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CustomDatasetManager } from '../dataset/CustomDatasetManager';

interface OverviewViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none bg-[#040a07]">
      {/* Top Section: Real-Time Audio Monitoring (Dual Oscilloscopes & Processing Node) */}
      <LiveAudioMonitoring store={store} />

      {/* Second Section: 4-Metric Telemetry Grid (INPUT, OUTPUT, NOISE RED, LATENCY) */}
      <TelemetryGrid store={store} />

      {/* Third Section: Split Row -> Controls (Record + Processing) and Tactical 3D Soldier Tile */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 items-stretch">
        {/* Left 2 columns: Control Dock (Record Audio & Processing Cards) */}
        <div className="xl:col-span-2 flex flex-col justify-between space-y-3">
          <ControlDock store={store} />
          <PlaybackABCard store={store} />
        </div>

        {/* Right 1 column: Live 3D Tactical Hardware & Acoustic Rig Preview Tile */}
        <div className="bg-[#08140e] border border-[#143526] rounded-md overflow-hidden flex flex-col min-h-[340px] shadow-md">
          <div className="h-9 px-3 bg-[#0a1a12] border-b border-[#143526] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Box className="w-3.5 h-3.5 text-[#00e599]" />
              <span className="font-mono text-xs font-bold text-[#f0fdf4] tracking-wider uppercase">
                ACOUSTIC TEST RIG // 3D SIM
              </span>
            </div>
            <button
              onClick={() => store.setActiveView('hardware3d')}
              className="p-1 rounded-[2px] bg-[#040a07] border border-[#143526] text-[#8ba695] hover:text-[#00e599] hover:border-[#00e599]/40 transition-all text-[10px] font-mono flex items-center space-x-1.5 px-2 cursor-pointer"
              title="Expand Full 3D Simulation Viewport"
            >
              <span>FULL SIMULATION</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Interactive 3D Mini Viewport */}
          <div className="relative flex-1 bg-[#020604] overflow-hidden">
            <SceneContainer />
            {/* Quick angle indicator overlay */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[2px] bg-black/80 border border-[#143526] font-mono text-[9px] text-[#8ba695] pointer-events-none">
              TITANIUM RIG // 15.5cm BINAURAL MOUNT
            </div>
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-[2px] bg-black/80 border border-[#143526] font-mono text-[9px] text-[#00e599] flex items-center space-x-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] animate-pulse shadow-[0_0_6px_#00e599]" />
              <span className="font-semibold">CALIBRATED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Section: Custom Acoustic CSV Dataset Ingestion Hub */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 shadow-md">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#143526] mb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-[#00e599]" />
            <h3 className="font-mono text-xs font-bold text-[#f0fdf4] uppercase tracking-wider">
              CUSTOM DATASET INGESTION &amp; BATCH ACOUSTIC PROCESSING (.CSV)
            </h3>
          </div>
          <span className="text-[9px] font-mono text-[#00e599] bg-[#00e599]/10 px-2 py-0.5 rounded border border-[#00e599]/30">
            LOCAL DEVICE INGESTION
          </span>
        </div>
        <CustomDatasetManager store={store} />
      </div>

      {/* Bottom Section: Network Streaming Card */}
      <NetworkStreamingCard store={store} />
    </div>
  );
};
