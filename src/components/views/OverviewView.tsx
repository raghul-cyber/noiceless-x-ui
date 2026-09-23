import React from 'react';
import { LiveAudioMonitoring } from '../audio/LiveAudioMonitoring';
import { TelemetryGrid } from '../audio/TelemetryGrid';
import { ControlDock } from '../audio/ControlDock';
import { PlaybackABCard } from '../audio/PlaybackABCard';
import { NetworkStreamingCard } from '../audio/NetworkStreamingCard';
import { SceneContainer } from '../3d/SceneContainer';
import { Box, Maximize2, Database, ShieldAlert, Radio } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CustomDatasetManager } from '../dataset/CustomDatasetManager';

interface OverviewViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ store }) => {
  return (
    <div className="h-full overflow-y-auto p-3.5 space-y-3.5 select-none bg-[#060a07]">
      {/* Primary Section: Real-Time Military Audio Radar & Dual CRT Oscilloscopes */}
      <LiveAudioMonitoring store={store} />

      {/* Secondary Section: 4-Metric Tactical Telemetry Grid */}
      <TelemetryGrid store={store} />

      {/* Tertiary Section: Combat Control Dock & 3D Operator/Sensor Rig Preview Tile */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3.5 items-stretch">
        {/* Left 2 columns: Combat Arming Dock & Audition Debrief Comparator */}
        <div className="xl:col-span-2 flex flex-col justify-between space-y-3.5">
          <ControlDock store={store} />
          <PlaybackABCard store={store} />
        </div>

        {/* Right 1 column: Live 3D Tactical Operator & Acoustic Rig Mini Viewport */}
        <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] overflow-hidden flex flex-col min-h-[340px] shadow-xl mil-corner-bracket">
          <div className="h-9 px-3 bg-[#0e1710] border-b border-[#223425] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Box className="w-3.5 h-3.5 text-[#22e565]" />
              <span className="font-mono text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
                // OPERATOR SENSOR TWIN &amp; 3D RIG
              </span>
            </div>
            <button
              onClick={() => store.setActiveView('hardware3d')}
              className="p-1 rounded-[1px] bg-[#060a07] border border-[#223425] text-[#7ea385] hover:text-[#22e565] hover:border-[#22e565]/40 transition-all text-[9px] font-mono flex items-center space-x-1.5 px-2 cursor-pointer font-bold"
              title="Expand Full 3D Simulation Viewport"
            >
              <span>EXPAND 3D</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Interactive 3D Mini Viewport with Tactical Coordinate Overlay */}
          <div className="relative flex-1 bg-[#050906] overflow-hidden">
            <SceneContainer />
            {/* Quick angle indicator overlay */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-[1px] bg-black/85 border border-[#223425] font-mono text-[8px] text-[#7ea385] pointer-events-none">
              US ARMY COMBAT UNIFORM // PELTOR HEADSET
            </div>
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-[1px] bg-black/85 border border-[#223425] font-mono text-[8px] text-[#22e565] flex items-center space-x-1.5 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22e565] animate-pulse shadow-[0_0_6px_#22e565]" />
              <span className="font-bold">NVG ARMED</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quaternary Section: Custom Battlefield Acoustic Threat (.CSV) Ingestion Hub */}
      <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 shadow-xl mil-corner-bracket">
        <div className="flex items-center justify-between pb-2 border-b border-[#223425] mb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-3.5 h-3.5 text-[#22e565]" />
            <h3 className="font-mono text-xs font-bold text-[#e8f2e6] uppercase tracking-wider">
              // BATTLEFIELD NOISE PROFILE INGESTION &amp; BATCH CSV INGEST
            </h3>
          </div>
          <span className="text-[8px] font-mono text-[#22e565] bg-[#22e565]/10 px-2 py-0.5 rounded-[1px] border border-[#223425] font-bold">
            LOCAL SECURE INGEST
          </span>
        </div>
        <CustomDatasetManager store={store} />
      </div>

      {/* Quintary Section: STANAG Tactical Network Streaming */}
      <NetworkStreamingCard store={store} />
    </div>
  );
};
