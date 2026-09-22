import { useState, useEffect } from 'react';
import { ActiveView, AudioTelemetry, AudioRecording, ViewportMode, CameraPreset } from '../types/audio';
import { CustomDataset } from '../types/simulation';
import { audioEngine } from '../audio/audioEngine';
import { viewerStore } from './useViewerStore';

interface AppState {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  
  // Audio State
  isProcessingActive: boolean;
  toggleProcessing: () => void;
  isLiveMode: boolean;
  setIsLiveMode: (live: boolean) => void;
  isAudioMuted: boolean;
  toggleMasterMute: () => void;
  isMicActive: boolean;
  toggleMicrophone: () => Promise<void>;
  suppressionDepth: number;
  setSuppressionDepth: (val: number) => void;
  vadSensitivity: number;
  setVadSensitivity: (val: number) => void;
  
  // Recording State
  isRecording: boolean;
  recordingSeconds: number;
  startRecording: () => void;
  stopRecording: () => void;
  recordings: AudioRecording[];
  
  // Playback / A-B State
  playbackActiveStream: 'A' | 'B';
  setPlaybackActiveStream: (stream: 'A' | 'B') => void;
  isPlaybackPlaying: boolean;
  togglePlayback: () => void;
  playbackProgress: number;
  setPlaybackProgress: (sec: number) => void;
  
  // Streaming State
  isStreamingActive: boolean;
  toggleStreaming: () => void;
  
  // Telemetry
  telemetry: AudioTelemetry;

  // 3D Viewport State
  viewportMode: ViewportMode;
  setViewportMode: (m: ViewportMode) => void;
  cameraPreset: CameraPreset;
  setCameraPreset: (preset: CameraPreset) => void;
  selectedComponentId: string | null;
  setSelectedComponentId: (id: string | null) => void;
  autoRotate360: boolean;
  toggleAutoRotate360: () => void;
  showLabels: boolean;
  toggleLabels: () => void;
  showSignalPulse: boolean;
  toggleSignalPulse: () => void;
  customDataset: CustomDataset | null;
  setCustomDataset: (dataset: CustomDataset | null) => void;
}

const DEFAULT_RECORDINGS: AudioRecording[] = [
  {
    id: 'rec-001',
    name: 'UH-60 Blackhawk Cockpit Comm 1',
    timestamp: '14:22:04',
    durationSeconds: 48,
    fileSizeKb: 1840,
    noiseType: 'Turbine & Rotor Wash (108 dB SPL)',
    noiseReductionAvgDb: 22.4,
  },
  {
    id: 'rec-002',
    name: 'Urban Breaching Extraction Radio',
    timestamp: '15:10:19',
    durationSeconds: 32,
    fileSizeKb: 1220,
    noiseType: 'Small Arms Crackle & Debris Echo',
    noiseReductionAvgDb: 19.8,
  },
  {
    id: 'rec-003',
    name: 'M1A2 Abrams Engine Deck Voice',
    timestamp: '16:04:45',
    durationSeconds: 75,
    fileSizeKb: 2880,
    noiseType: 'Turbine Whine & Track Vibration',
    noiseReductionAvgDb: 24.1,
  }
];

const getInitialView = (): ActiveView => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validViews: ActiveView[] = ['overview', 'live', 'hardware3d', 'recordings', 'analysis', 'streaming', 'devices', 'system'];
    if (validViews.includes(hash as ActiveView)) {
      return hash as ActiveView;
    }
  }
  return 'overview';
};

export function useAppStore(): AppState {
  const [activeView, setActiveViewState] = useState<ActiveView>(getInitialView);

  const setActiveView = (view: ActiveView) => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      window.location.hash = view;
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validViews: ActiveView[] = ['overview', 'live', 'hardware3d', 'recordings', 'analysis', 'streaming', 'devices', 'system'];
      if (validViews.includes(hash as ActiveView)) {
        setActiveViewState(hash as ActiveView);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const [isProcessingActive, setIsProcessingActive] = useState<boolean>(true);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [suppressionDepth, setSuppressionDepthState] = useState<number>(85);
  const [vadSensitivity, setVadSensitivity] = useState<number>(70);

  // Recording
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordings, setRecordings] = useState<AudioRecording[]>(DEFAULT_RECORDINGS);

  // Playback / A-B
  const [playbackActiveStream, setPlaybackActiveStream] = useState<'A' | 'B'>('B');
  const [isPlaybackPlaying, setIsPlaybackPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(12);

  // Streaming
  const [isStreamingActive, setIsStreamingActive] = useState<boolean>(true);

  // Telemetry
  const [telemetry, setTelemetry] = useState<AudioTelemetry>({
    inputDb: -25.2,
    outputDb: -44.1,
    noiseReductionDb: 19.5,
    latencyMs: 42.0,
    sampleRate: 48000,
    bitDepth: 24,
    bufferSize: 128,
    snrInput: 8.4,
    snrOutput: 27.9,
    vadActive: true,
    cpuLoadPercent: 14.2,
    packetLossPercent: 0.0,
    networkJitterMs: 1.2,
  });

  // 3D Viewport
  const [viewportMode, setViewportMode] = useState<ViewportMode>('assembled');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('default');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [autoRotate360, setAutoRotate360] = useState<boolean>(false);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showSignalPulse, setShowSignalPulse] = useState<boolean>(true);
  const [customDataset, setCustomDatasetState] = useState<CustomDataset | null>(null);

  const setCustomDataset = (dataset: CustomDataset | null) => {
    setCustomDatasetState(dataset);
    viewerStore.setCustomDataset(dataset);
  };

  // Telemetry subscription
  useEffect(() => {
    const unsub = audioEngine.subscribeTelemetry((t) => {
      setTelemetry(t);
    });
    return unsub;
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Playback progress ticker
  useEffect(() => {
    let interval: number;
    if (isPlaybackPlaying) {
      interval = window.setInterval(() => {
        setPlaybackProgress((prev) => (prev >= 60 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaybackPlaying]);

  const toggleProcessing = () => {
    const next = !isProcessingActive;
    setIsProcessingActive(next);
    audioEngine.setProcessingActive(next);
  };

  const setSuppressionDepth = (val: number) => {
    setSuppressionDepthState(val);
    audioEngine.setNoiseSuppressionDepth(val / 100);
  };

  const toggleMasterMute = async () => {
    await audioEngine.initAudio();
    const next = !isAudioMuted;
    setIsAudioMuted(next);
    audioEngine.setMasterMute(!next);
  };

  const toggleMicrophone = async () => {
    const active = await audioEngine.toggleMicrophone();
    setIsMicActive(active);
  };

  const startRecording = async () => {
    await audioEngine.initAudio();
    audioEngine.startRecording();
    setIsRecording(true);
  };

  const stopRecording = () => {
    const res = audioEngine.stopRecording();
    setIsRecording(false);
    const newRec: AudioRecording = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      name: `Tactical Stream Capture ${recordings.length + 1}`,
      timestamp: res.timestamp,
      durationSeconds: res.duration,
      fileSizeKb: Math.round(res.duration * 38.4),
      noiseType: 'Field Audio Stream (48 kHz / 24-bit)',
      noiseReductionAvgDb: 21.2,
    };
    setRecordings([newRec, ...recordings]);
  };

  const togglePlayback = async () => {
    await audioEngine.initAudio();
    setIsPlaybackPlaying(!isPlaybackPlaying);
  };

  const toggleStreaming = () => {
    setIsStreamingActive(!isStreamingActive);
  };

  const toggleAutoRotate360 = () => setAutoRotate360(!autoRotate360);
  const toggleLabels = () => setShowLabels(!showLabels);
  const toggleSignalPulse = () => setShowSignalPulse(!showSignalPulse);

  return {
    activeView,
    setActiveView,
    isProcessingActive,
    toggleProcessing,
    isLiveMode,
    setIsLiveMode,
    isAudioMuted,
    toggleMasterMute,
    isMicActive,
    toggleMicrophone,
    suppressionDepth,
    setSuppressionDepth,
    vadSensitivity,
    setVadSensitivity,
    isRecording,
    recordingSeconds,
    startRecording,
    stopRecording,
    recordings,
    playbackActiveStream,
    setPlaybackActiveStream,
    isPlaybackPlaying,
    togglePlayback,
    playbackProgress,
    setPlaybackProgress,
    isStreamingActive,
    toggleStreaming,
    telemetry,
    viewportMode,
    setViewportMode,
    cameraPreset,
    setCameraPreset,
    selectedComponentId,
    setSelectedComponentId,
    autoRotate360,
    toggleAutoRotate360,
    showLabels,
    toggleLabels,
    showSignalPulse,
    toggleSignalPulse,
    customDataset,
    setCustomDataset,
  };
}
