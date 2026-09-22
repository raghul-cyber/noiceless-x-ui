import React from 'react';
import { SceneContainer } from '../3d/SceneContainer';
import { ModeToolbar } from '../ui3d/ModeToolbar';
import { ComponentInspector } from '../ui3d/ComponentInspector';
import { SimulationDock } from '../ui3d/SimulationDock';
import { WorkflowController } from '../ui3d/WorkflowController';
import { WorkflowStageCard } from '../ui3d/WorkflowStageCard';

export const Hardware3DView: React.FC = () => {
  return (
    <div className="w-full h-full relative bg-[#05070c] overflow-hidden select-none">
      {/* 3D Viewport: Precision Acoustic Rig, Destructive Superposition & Signal Pulses */}
      <SceneContainer />

      {/* Top Bar: Slim Unified Workflow Stepper, Playback Transport & Audio Probe */}
      <WorkflowController />

      {/* Left Panel: Sleek Collapsible Stage Telemetry, Formula & Latency Card */}
      <WorkflowStageCard />

      {/* Component Inspector: Slides in only when user clicks any physical part */}
      <ComponentInspector />

      {/* Right Drawer: 4-Channel DSP Oscilloscope, 180° Null Zone & FFT (Closed by default) */}
      <SimulationDock />

      {/* Bottom Bar: Single-Row Focus Presets & View Modes */}
      <ModeToolbar />
    </div>
  );
};
