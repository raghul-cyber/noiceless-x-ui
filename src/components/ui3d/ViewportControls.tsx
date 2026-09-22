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
    <div className="absolute top-16 right-4 z-20 flex flex-col items-end gap-2 select-none">
      {/* 360 Rotation Angle Indicator */}
      <div className="bg-[#0b0e16]/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1e2638] text-[11px] font-mono text-slate-300 flex items-center gap-2 shadow-lg">
        <Compass className="w-3.5 h-3.5 text-signal-cyan animate-spin-slow" />
        <span>VIEWPORT AZIMUTH: <strong className="text-white">{rotationAngle}°</strong></span>
      </div>

      {/* Camera Angle Presets Grid */}
      <div className="bg-[#0b0e16]/85 backdrop-blur-md p-2 rounded-lg border border-[#1e2638] shadow-lg flex flex-col items-end gap-1 font-mono text-[10px]">
        <div className="text-slate-500 text-[9px] uppercase tracking-wider mb-1 flex items-center gap-1">
          <Camera className="w-3 h-3 text-signal-cyan" />
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
                    ? 'bg-signal-cyan/20 border-signal-cyan/50 text-signal-cyan font-bold shadow-sm'
                    : 'bg-[#101420] border-[#1a2234] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[8px] text-slate-500 ml-1">({p.angle})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Simulation Quick Toggles (ANC / Voice / Run) */}
      <div className="flex items-center gap-1.5 bg-[#0b0e16]/85 backdrop-blur-md p-1 rounded-lg border border-[#1e2638] shadow-lg">
        {/* ANC Toggle */}
        <button
          onClick={() => viewerStore.toggleANC()}
          className={`flex items-center gap-1 px-2 py-1 rounded font-mono text-[10px] transition-all ${
            ancActive
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}
          title="Toggle Active Noise Cancellation"
        >
          {ancActive ? <Shield className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
          <span>{ancActive ? 'ANC ON' : 'ANC OFF'}</span>
        </button>

        {/* Voice Toggle */}
        <button
          onClick={() => viewerStore.toggleVoice()}
          className={`flex items-center gap-1 px-2 py-1 rounded font-mono text-[10px] transition-all ${
            voiceActive
              ? 'bg-signal-cyan/20 text-signal-cyan border border-signal-cyan/40'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
          title="Toggle Soldier Voice Comms"
        >
          {voiceActive ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
          <span>{voiceActive ? 'VOICE ON' : 'VOICE MUTED'}</span>
        </button>

        {/* Simulation Play/Pause */}
        <button
          onClick={() => viewerStore.toggleSimulation()}
          className={`flex items-center gap-1 px-2 py-1 rounded font-mono text-[10px] transition-all ${
            simulationRunning
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-slate-800 text-slate-400'
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
