import React from 'react';
import { Compass, Play, Pause, Mic, MicOff, Shield, ShieldAlert, Eye, ZoomIn, Camera, Crosshair } from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';

import { CameraPreset } from '../../types/headset';

export const ViewportControls: React.FC = () => {
  const { rotationAngle, simulationRunning, ancActive, voiceActive, cameraPreset } = useViewerStore();

  const presets: { id: CameraPreset; label: string; angle: string }[] = [
    { id: 'SYSTEM_OVERVIEW', label: 'RIG', angle: 'ALL' },
    { id: 'FRONT', label: 'FRONT', angle: '0°' },
    { id: 'LEFT', label: 'LEFT', angle: '90°' },
    { id: 'RIGHT', label: 'RIGHT', angle: '270°' },
    { id: 'EAR_CANAL', label: 'EAR CANAL', angle: 'ANC' },
    { id: 'BOOM_MIC', label: 'BOOM MIC', angle: 'VOICE' },
    { id: 'WAIST', label: 'WAIST PI', angle: 'DSP' },
  ];

  return (
    <div className="absolute top-16 right-4 z-20 flex flex-col items-end gap-2 select-none font-mono">
      {/* 360 Rotation Angle Indicator */}
      <div className="mil-corner-bracket bg-[#0b120c]/90 backdrop-blur-md px-3 py-1.5 rounded border border-[#223425] text-[11px] text-[#8ba695] flex items-center gap-2 shadow-lg">
        <Compass className="w-3.5 h-3.5 text-[#22e565] animate-spin-slow" />
        <span>OPTIC AZIMUTH: <strong className="text-[#f0fdf4] font-stencil">{rotationAngle}° MGRS</strong></span>
      </div>

      {/* Camera Angle Presets Grid */}
      <div className="mil-corner-bracket bg-[#0b120c]/90 backdrop-blur-md p-2 rounded border border-[#223425] shadow-lg flex flex-col items-end gap-1 text-[10px]">
        <div className="text-[#4e6a5b] text-[9px] uppercase tracking-wider mb-0.5 flex items-center gap-1 font-stencil font-bold">
          <Crosshair className="w-3 h-3 text-[#22e565]" />
          <span>INSPECTION OPTICS</span>
        </div>
        <div className="flex flex-wrap max-w-[280px] justify-end gap-1">
          {presets.map((p) => {
            const isActive = cameraPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => viewerStore.setCameraPreset(p.id)}
                className={`px-2 py-0.5 rounded border font-stencil transition-all ${
                  isActive
                    ? 'bg-[#22e565]/20 border-[#22e565] text-[#22e565] font-bold shadow-sm'
                    : 'bg-[#070e09] border-[#223425] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#2e4632]'
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[8px] text-[#4e6a5b] ml-1">({p.angle})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation Quick Toggles (ANC / Voice / Run) */}
      <div className="mil-corner-bracket flex items-center gap-1.5 bg-[#0b120c]/90 backdrop-blur-md p-1 rounded border border-[#223425] shadow-lg">
        {/* ANC Toggle */}
        <button
          onClick={() => viewerStore.toggleANC()}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-stencil transition-all font-bold ${
            ancActive
              ? 'bg-[#22e565]/20 text-[#22e565] border border-[#22e565]/50'
              : 'bg-red-950/40 text-red-400 border border-red-500/40'
          }`}
          title="Toggle Active Noise Cancellation"
        >
          {ancActive ? <Shield className="w-3 h-3 text-[#22e565]" /> : <ShieldAlert className="w-3 h-3" />}
          <span>{ancActive ? 'ANC ARMED' : 'ANC OFF'}</span>
        </button>

        {/* Voice Toggle */}
        <button
          onClick={() => viewerStore.toggleVoice()}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-stencil transition-all font-bold ${
            voiceActive
              ? 'bg-[#22e565]/20 text-[#22e565] border border-[#22e565]/40'
              : 'bg-[#070e09] text-[#8ba695] border border-[#223425]'
          }`}
          title="Toggle Soldier Voice Comms"
        >
          {voiceActive ? <Mic className="w-3 h-3 text-[#22e565]" /> : <MicOff className="w-3 h-3" />}
          <span>{voiceActive ? 'VOX ON' : 'VOX MUTED'}</span>
        </button>

        {/* Simulation Play/Pause */}
        <button
          onClick={() => viewerStore.toggleSimulation()}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-stencil transition-all font-bold ${
            simulationRunning
              ? 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40'
              : 'bg-[#070e09] text-[#8ba695] border border-[#223425]'
          }`}
          title="Pause/Resume Simulation Flow"
        >
          {simulationRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{simulationRunning ? 'RUN' : 'HALT'}</span>
        </button>
      </div>
    </div>
  );
};
