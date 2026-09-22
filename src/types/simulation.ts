export type NoiseScenarioId = 
  | 'gunshots' 
  | 'helicopter' 
  | 'vehicle' 
  | 'wind' 
  | 'crowd' 
  | 'machinery' 
  | 'combined'
  | 'custom_dataset';

export interface CustomDatasetRecord {
  id?: number | string;
  timestamp?: number | string;
  frequency_hz?: number;
  ambient_spl_db?: number;
  anti_noise_spl_db?: number;
  residual_error_db?: number;
  threat_class?: string;
  intelligibility_pct?: number;
  snr_db?: number;
  [key: string]: any;
}

export interface CustomDataset {
  fileName: string;
  fileSize: number;
  uploadTime: string;
  rowCount: number;
  headers: string[];
  records: CustomDatasetRecord[];
  summary: {
    avgAmbientSpl: number;
    peakSpl: number;
    avgAttenuationDb: number;
    dominantFreq: number;
    threatClass: string;
    avgSnrGain: number;
  };
}

export interface NoiseScenario {
  id: NoiseScenarioId;
  name: string;
  description: string;
  splDb: number;
  freqRange: string;
  primaryFrequency: number;
  aiClassification: string;
  aiConfidence: number;
  deepFilterNetSnrGainDb: number;
  color: string;
  waveformPattern: 'impulsive' | 'cyclic-low' | 'rumble' | 'broadband' | 'multi-tonal' | 'mechanical' | 'chaotic-battlefield';
}

export type AudioProbePoint = 'OFF' | 'AMBIENT' | 'IN_EAR' | 'BOOM_MIC' | 'CLEAN_OUT';

export interface PipelineStage {
  step: number;
  title: string;
  subtitle: string;
  componentId: string;
  color: string;
  signalType: 'NOISE' | 'REFERENCE' | 'PROCESSING' | 'SPEAKER' | 'ERROR' | 'VOICE' | 'OUTPUT';
  mathFormula: string;
  latencyMs: number;
  detailDescription: string;
  metricLabel: string;
  metricValue: string;
  cameraPreset: 'FRONT' | 'LEFT' | 'RIGHT' | 'BACK' | 'TOP' | 'CLOSEUP' | 'WAIST' | 'EAR_CANAL' | 'BOOM_MIC' | 'SYSTEM_OVERVIEW';
}
