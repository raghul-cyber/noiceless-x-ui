import React from 'react';
import { Compass, Play, Pause, Mic, MicOff, Shield, ShieldAlert, Eye, ZoomIn, Camera } from 'lucide-react';
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
      <div className="bg-[#08140e]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#143526] text-[11px] text-[#8ba695] flex items-center gap-2 shadow-lg">
        <Compass className="w-3.5 h-3.5 text-[#00e599] animate-spin-slow" />
        <span>VIEWPORT AZIMUTH: <strong className="text-[#f0fdf4] font-mono">{rotationAngle}°</strong></span>
      </div>

      {/* Camera Angle Presets Grid */}
      <div className="bg-[#08140e]/90 backdrop-blur-md p-2 rounded-lg border border-[#143526] shadow-lg flex flex-col items-end gap-1 text-[10px]">
        <div className="text-[#4e6a5b] text-[9px] uppercase tracking-wider mb-1 flex items-center gap-1 font-bold">
          <Camera className="w-3 h-3 text-[#00e599]" />
          <span>INSPECTION PRESETS</span>
        </div>
        <div className="flex flex-wrap max-w-[280px] justify-end gap-1">
          {presets.map((p) => {
            const isActive = cameraPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => viewerStore.setCameraPreset(p.id)}
                className={`px-2 py-1 rounded border transition-all ${
                  isActive
                    ? 'bg-[#00e599]/20 border-[#00e599]/60 text-[#00e599] font-bold shadow-sm'
                    : 'bg-[#030906] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#1e4d38]'
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
      <div className="flex items-center gap-1.5 bg-[#08140e]/90 backdrop-blur-md p-1 rounded-lg border border-[#143526] shadow-lg">
        {/* ANC Toggle */}
        <button
          onClick={() => viewerStore.toggleANC()}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all font-semibold ${
            ancActive
              ? 'bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/50'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}
          title="Toggle Active Noise Cancellation"
        >
          {ancActive ? <Shield className="w-3 h-3 text-[#00e599]" /> : <ShieldAlert className="w-3 h-3" />}
          <span>{ancActive ? 'ANC ARMED' : 'ANC OFF'}</span>
        </button>

        {/* Voice Toggle */}
        <button
          onClick={() => viewerStore.toggleVoice()}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all font-semibold ${
            voiceActive
              ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
              : 'bg-[#030906] text-[#8ba695] border border-[#143526]'
          }`}
          title="Toggle Soldier Voice Comms"
        >
          {voiceActive ? <Mic className="w-3 h-3 text-[#10b981]" /> : <MicOff className="w-3 h-3" />}
          <span>{voiceActive ? 'VOICE ON' : 'VOICE MUTED'}</span>
        </button>

        {/* Simulation Play/Pause */}
        <button
          onClick={() => viewerStore.toggleSimulation()}
          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-all font-semibold ${
            simulationRunning
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-[#030906] text-[#8ba695] border border-[#143526]'
          }`}
          title="Pause/Resume Simulation Flow"
        >
          {simulationRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          <span>{simulationRunning ? 'RUNNING' : 'PAUSED'}</span>
        </button>
      </div>
    </div>
  );
};
