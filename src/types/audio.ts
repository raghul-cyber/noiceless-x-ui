export type ActiveView = 
  | 'overview' 
  | 'live' 
  | 'recordings' 
  | 'analysis' 
  | 'streaming' 
  | 'devices' 
  | 'system'
  | 'hardware3d'
  | 'training';

export type ProcessingMode = 'deepfilternet3' | 'spectral' | 'hybrid' | 'bypass';

export type NoiseEnvironment = 'battlefield' | 'helicopter' | 'armored_vehicle' | 'urban_combat' | 'wind_storm' | 'clean_mic';

export interface AudioTelemetry {
  inputDb: number;
  outputDb: number;
  noiseReductionDb: number;
  latencyMs: number;
  sampleRate: number;
  bitDepth: number;
  bufferSize: number;
  snrInput: number;
  snrOutput: number;
  vadActive: boolean;
  cpuLoadPercent: number;
  packetLossPercent: number;
  networkJitterMs: number;
}

export interface AudioRecording {
  id: string;
  timestamp: string;
  name: string;
  durationSeconds: number;
  fileSizeKb: number;
  noiseType: string;
  noiseReductionAvgDb: number;
  url?: string;
  blob?: Blob;
}

export type ViewportMode = 'assembled' | 'exploded' | 'internal' | 'cutaway' | 'x-ray';

export type CameraPreset = 'default' | 'front' | 'left' | 'right' | 'back' | 'top' | 'close_headset' | 'close_mouth' | 'waist_pouch';
