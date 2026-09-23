import React, { useState } from 'react';
import { SceneContainer } from '../3d/SceneContainer';
import { ModeToolbar } from '../ui3d/ModeToolbar';
import { ComponentInspector } from '../ui3d/ComponentInspector';
import { SimulationDock } from '../ui3d/SimulationDock';
import { WorkflowController } from '../ui3d/WorkflowController';
import { WorkflowStageCard } from '../ui3d/WorkflowStageCard';
import { Crosshair, Eye, Shield } from 'lucide-react';

export const Hardware3DView: React.FC = () => {
  const [isNvgMode, setIsNvgMode] = useState<boolean>(false);

  return (
    <div className={`w-full h-full relative bg-[#060a07] overflow-hidden select-none ${isNvgMode ? 'mil-scanlines' : ''}`}>
      {/* 3D Viewport: Precision Acoustic Rig, Destructive Superposition & Signal Pulses */}
      <SceneContainer />

      {/* Center Tactical Optical Reticle Overlay (Non-blocking pointer events) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
        <div className="w-48 h-48 border border-[#22e565]/40 rounded-full flex items-center justify-center relative">
          <div className="w-2 h-2 bg-[#22e565] rounded-full" />
          <div className="absolute top-0 w-px h-6 bg-[#22e565]" />
          <div className="absolute bottom-0 w-px h-6 bg-[#22e565]" />
          <div className="absolute left-0 w-6 h-px bg-[#22e565]" />
          <div className="absolute right-0 w-6 h-px bg-[#22e565]" />
        </div>
      </div>

      {/* Top Bar: Tactical Mission Phase Stepper & Playback Transport */}
      <WorkflowController />

      {/* Left Panel: Collapsible Military Stage Telemetry, Formula & Latency Card */}
      <WorkflowStageCard />

      {/* Component Inspector: Slides in when user clicks any physical part */}
      <ComponentInspector />

      {/* Right Drawer: 4-Channel DSP Oscilloscope, 180° Null Zone & FFT */}
      <SimulationDock />

      {/* Bottom Bar: Single-Row Focus Presets & View Modes */}
      <ModeToolbar />

      {/* Floating Tactical NVG / Azimuth HUD Badge */}
      <div className="absolute top-16 right-4 pointer-events-auto flex items-center space-x-2 font-mono text-[9px]">
        <button
          onClick={() => setIsNvgMode(!isNvgMode)}
          className={`px-2 py-1 rounded-[1px] border flex items-center space-x-1.5 transition-all shadow-md cursor-pointer ${
            isNvgMode
              ? 'bg-[#22e565]/20 border-[#22e565] text-[#22e565] shadow-[0_0_8px_rgba(34,229,101,0.3)]'
              : 'bg-[#0b120c]/80 border-[#223425] text-[#7ea385] hover:text-[#e8f2e6]'
          }`}
          title="Toggle Night-Vision (NVG) Tactical Overlay"
        >
          <Eye className="w-3 h-3" />
          <span>{isNvgMode ? 'NVG HUD: ENGAGED' : 'NVG HUD: OFF'}</span>
        </button>
      </div>
    </div>
  );
};
