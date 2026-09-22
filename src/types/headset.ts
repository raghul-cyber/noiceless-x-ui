export type ViewMode = 
  | 'WORKFLOW'
  | 'SIMULATION'
  | 'ASSEMBLED' 
  | 'EXPLODED' 
  | 'INTERNAL' 
  | 'CUTAWAY' 
  | 'X-RAY' 
  | '360';

export type CameraPreset = 
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

export interface ComponentItem {
  id: string;
  name: string;
  category: 'HEADSET' | 'MICROPHONES' | 'ACOUSTICS' | 'COMPUTE_POUCH' | 'HARNESS';
  role: string;
  input: string;
  output: string;
  connection: string;
  technicalSpecs: string[];
  status: 'ONLINE' | 'ACTIVE' | 'FEEDBACK' | 'STANDBY';
  position: [number, number, number];
  explodedOffset: [number, number, number];
}

export interface ExplodedState {
  progress: number; // 0 (assembled) to 1 (fully exploded)
  isAnimating: boolean;
}
