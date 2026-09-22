import { useState, useEffect } from 'react';
import { ViewMode } from '../types/headset';
import { NoiseScenarioId, AudioProbePoint } from '../types/simulation';

export type CameraPresetType = 
  | 'SYSTEM_OVERVIEW'
  | 'HEADSET'
  | 'EAR_CANAL'
  | 'BOOM_MIC'
  | 'WAIST_DSP'
  | 'FRONT' 
  | 'LEFT' 
  | 'RIGHT' 
  | 'BACK' 
  | 'TOP' 
  | 'CLOSEUP' 
  | 'WAIST' 
  | null;

export interface ViewerState {
  currentMode: ViewMode;
  explodedProgress: number; // 0 (assembled) to 1 (fully exploded)
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  showLabels: boolean;
  showHud: boolean; // Master toggle to show/hide overlay telemetry panels
  showPipeline: boolean;
  simulationRunning: boolean;
  noiseScenario: NoiseScenarioId;
  noiseIntensity: number; // 0 to 100
  voiceActive: boolean;
  ancActive: boolean;
  cameraDistance: number;
  isMuted: boolean;
  audioVolume: number;
  rotationAngle: number;
  activePipelineStage: number; // 1 to 7
  headFlipped: boolean;
  cameraPreset: CameraPresetType;
  // Workflow Simulation Engine states
  workflowStep: number; // 1 to 7
  isWorkflowPlaying: boolean; // Auto-play workflow tour
  workflowSpeed: number; // 0.5x, 1x, 2x
  audioProbe: AudioProbePoint; // Real audible sound probe point
  showManikin: boolean; // Optional faint holographic acoustic manikin outline (default false, pure hardware)
  showWaveCollision: boolean; // 3D ear canal destructive wave collision visualizer
  customDataset: import('../types/simulation').CustomDataset | null;
  activeHudTab: 'oscilloscope' | 'scenarios' | 'dataset' | 'pipeline';
}

const initialState: ViewerState = {
  currentMode: 'WORKFLOW',
  explodedProgress: 0,
  selectedComponentId: null,
  hoveredComponentId: null,
  showLabels: false, // Clean by default; toggleable on demand
  showHud: false, // Closed by default; openable via Oscilloscope/Telemetry toggle
  showPipeline: false,
  simulationRunning: true,
  noiseScenario: 'helicopter',
  noiseIntensity: 85,
  voiceActive: true,
  ancActive: true,
  cameraDistance: 2.2,
  isMuted: true,
  audioVolume: 0.5,
  rotationAngle: 0,
  activePipelineStage: 1,
  headFlipped: false,
  cameraPreset: 'SYSTEM_OVERVIEW',
  // Workflow states
  workflowStep: 1,
  isWorkflowPlaying: true,
  workflowSpeed: 1.0,
  audioProbe: 'OFF',
  showManikin: false, // NO bulky soldier 3D model!
  showWaveCollision: true,
  customDataset: null,
  activeHudTab: 'oscilloscope',
};

let state: ViewerState = { ...initialState };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const viewerStore = {
  getState: () => state,
  setState: (updater: Partial<ViewerState> | ((prev: ViewerState) => Partial<ViewerState>)) => {
    const next = typeof updater === 'function' ? updater(state) : updater;
    state = { ...state, ...next };
    notify();
  },
  resetView: () => {
    state = {
      ...state,
      currentMode: 'WORKFLOW',
      explodedProgress: 0,
      selectedComponentId: null,
      cameraDistance: 2.2,
      rotationAngle: 0,
      activePipelineStage: 1,
      workflowStep: 1,
      isWorkflowPlaying: true,
      cameraPreset: 'SYSTEM_OVERVIEW',
    };
    notify();
  },
  setCameraPreset: (preset: CameraPresetType) => {
    state = {
      ...state,
      cameraPreset: preset,
      selectedComponentId: null,
    };
    notify();
  },
  setMode: (mode: ViewMode) => {
    const targetProgress = mode === 'EXPLODED' ? 1 : 0;
    state = {
      ...state,
      currentMode: mode,
      explodedProgress: targetProgress,
      selectedComponentId: mode === 'INTERNAL' ? 'leftEarcupShell' : state.selectedComponentId,
    };
    notify();
  },
  setExplodedProgress: (progress: number) => {
    state = { ...state, explodedProgress: Math.max(0, Math.min(1, progress)) };
    notify();
  },
  selectComponent: (id: string | null) => {
    state = { ...state, selectedComponentId: id };
    notify();
  },
  hoverComponent: (id: string | null) => {
    state = { ...state, hoveredComponentId: id };
    notify();
  },
  toggleLabels: () => {
    state = { ...state, showLabels: !state.showLabels };
    notify();
  },
  toggleHud: () => {
    state = { ...state, showHud: !state.showHud };
    notify();
  },
  closeHud: () => {
    state = { ...state, showHud: false };
    notify();
  },
  openHud: () => {
    state = { ...state, showHud: true };
    notify();
  },
  togglePipeline: () => {
    state = { ...state, showPipeline: !state.showPipeline };
    notify();
  },
  setScenario: (scenario: NoiseScenarioId) => {
    state = { ...state, noiseScenario: scenario };
    notify();
  },
  toggleVoice: () => {
    state = { ...state, voiceActive: !state.voiceActive };
    notify();
  },
  toggleANC: () => {
    state = { ...state, ancActive: !state.ancActive };
    notify();
  },
  toggleSimulation: () => {
    state = { ...state, simulationRunning: !state.simulationRunning };
    notify();
  },
  toggleMute: () => {
    state = { ...state, isMuted: !state.isMuted };
    notify();
  },
  setVolume: (volume: number) => {
    state = { ...state, audioVolume: Math.max(0, Math.min(1, volume)) };
    notify();
  },
  setCameraDistance: (dist: number) => {
    state = { ...state, cameraDistance: dist };
    notify();
  },
  setRotationAngle: (angle: number) => {
    state = { ...state, rotationAngle: angle % 360 };
    notify();
  },
  setActivePipelineStage: (stage: number) => {
    state = { ...state, activePipelineStage: stage, workflowStep: stage };
    notify();
  },
  setWorkflowStep: (step: number) => {
    const clamped = Math.max(1, Math.min(7, step));
    state = { ...state, workflowStep: clamped, activePipelineStage: clamped };
    notify();
  },
  nextWorkflowStep: () => {
    const next = state.workflowStep >= 7 ? 1 : state.workflowStep + 1;
    state = { ...state, workflowStep: next, activePipelineStage: next };
    notify();
  },
  prevWorkflowStep: () => {
    const prev = state.workflowStep <= 1 ? 7 : state.workflowStep - 1;
    state = { ...state, workflowStep: prev, activePipelineStage: prev };
    notify();
  },
  toggleWorkflowPlaying: () => {
    state = { ...state, isWorkflowPlaying: !state.isWorkflowPlaying };
    notify();
  },
  setWorkflowSpeed: (speed: number) => {
    state = { ...state, workflowSpeed: speed };
    notify();
  },
  setAudioProbe: (probe: AudioProbePoint) => {
    state = { ...state, audioProbe: probe };
    notify();
  },
  toggleManikin: () => {
    state = { ...state, showManikin: !state.showManikin };
    notify();
  },
  toggleWaveCollision: () => {
    state = { ...state, showWaveCollision: !state.showWaveCollision };
    notify();
  },
  toggleHeadDirection: () => {
    state = { ...state, headFlipped: !state.headFlipped };
    notify();
  },
  setActiveHudTab: (tab: 'oscilloscope' | 'scenarios' | 'dataset' | 'pipeline') => {
    state = { ...state, activeHudTab: tab, showHud: true };
    notify();
  },
  setCustomDataset: (dataset: import('../types/simulation').CustomDataset | null) => {
    state = {
      ...state,
      customDataset: dataset,
      noiseScenario: dataset ? 'custom_dataset' : state.noiseScenario,
      noiseIntensity: dataset ? Math.min(100, Math.round((dataset.summary.peakSpl / 160) * 100)) : state.noiseIntensity,
    };
    notify();
  }
};

export function useViewerStore(): ViewerState {
  const [snapshot, setSnapshot] = useState<ViewerState>(state);

  useEffect(() => {
    const handleUpdate = () => {
      setSnapshot({ ...state });
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return snapshot;
}
