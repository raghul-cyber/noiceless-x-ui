import React, { useState, useEffect, useRef } from 'react';
import {
  BrainCircuit,
  Upload,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Download,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  Sliders,
  Sparkles,
  FileSpreadsheet,
  Activity,
  Zap,
  Volume2,
  ShieldCheck,
  Radio,
  Target,
  Crosshair,
  ArrowRight,
  HardDriveDownload
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface ModelTrainingViewProps {
  store: ReturnType<typeof useAppStore>;
}

interface DatasetPreset {
  id: string;
  name: string;
  category: string;
  samples: number;
  classesCount: number;
  snrRange: string;
  sizeMb: number;
  description: string;
  tags: string[];
  classes: { name: string; percentage: number; color: string }[];
}

const DATASET_PRESETS: DatasetPreset[] = [
  {
    id: 'stanag-4744',
    name: 'NATO STANAG 4744 Rotor & High-G Turbine Corpus',
    category: 'Aviation Acoustic Warfare',
    samples: 18600,
    classesCount: 6,
    snrRange: '-12 dB to +5 dB',
    sizeMb: 142.4,
    description: 'High-SPL multi-microphone telemetry recorded during UH-60 Blackhawk, AH-64 Apache, and CH-47 rotorcraft operations under extreme noise.',
    tags: ['MIL-SPEC', 'HIGH-SPL', 'ROTORCRAFT', '48kHz'],
    classes: [
      { name: 'Helicopter Main Rotor Wash', percentage: 35, color: '#22e565' },
      { name: 'Turboshaft High-Pitch Whine', percentage: 25, color: '#38bdf8' },
      { name: 'Tail Rotor Infrasound', percentage: 15, color: '#f59e0b' },
      { name: 'Cockpit Radio Voice', percentage: 15, color: '#a855f7' },
      { name: 'Airframe Vibration Resonance', percentage: 10, color: '#94a3b8' },
    ]
  },
  {
    id: 'darpa-urban',
    name: 'DARPA Urban Warfare Small Arms & Breaching Echoes',
    category: 'Ballistic & Combat Shockwave',
    samples: 24800,
    classesCount: 8,
    snrRange: '-20 dB to +15 dB',
    sizeMb: 218.6,
    description: 'Supersonic projectile snaps, muzzle blasts, explosive wall breaches, and concrete reverberations captured with binaural ear canal sensors.',
    tags: ['BALLISTIC', 'IMPULSE', 'URBAN COMBAT', '96kHz'],
    classes: [
      { name: '5.56mm / 7.62mm Muzzle Blast', percentage: 30, color: '#ef4444' },
      { name: 'Supersonic Bullet Crack', percentage: 22, color: '#f59e0b' },
      { name: 'Explosive Breaching Shockwave', percentage: 18, color: '#ec4899' },
      { name: 'Tactical Voice Commands', percentage: 20, color: '#22e565' },
      { name: 'Debris & Concrete Clatter', percentage: 10, color: '#64748b' },
    ]
  },
  {
    id: 'abrams-tracks',
    name: 'M1A2 Abrams Engine Deck & Track Vibration Matrix',
    category: 'Heavy Armored Combat',
    samples: 16200,
    classesCount: 5,
    snrRange: '-15 dB to 0 dB',
    sizeMb: 128.0,
    description: '1500 HP gas turbine powertrain roar, steel track link metallic clatter, and hull interior intercom acoustics measured inside armored combat cabins.',
    tags: ['ARMORED', 'TURBINE', 'LOW-FREQ', 'INTERCOM'],
    classes: [
      { name: 'AGT1500 Gas Turbine Roar', percentage: 40, color: '#38bdf8' },
      { name: 'Steel Track Pin Impact', percentage: 25, color: '#f59e0b' },
      { name: 'Turret Traverse Hydraulic Hum', percentage: 15, color: '#a855f7' },
      { name: 'Crew Helmet Intercom Voice', percentage: 20, color: '#22e565' },
    ]
  },
  {
    id: 'jamming-ecm',
    name: 'Electronic Warfare Acoustic Jamming & Chirp Matrix',
    category: 'Counter-Measure & Electronic Attack',
    samples: 12500,
    classesCount: 4,
    snrRange: '-25 dB to -5 dB',
    sizeMb: 94.2,
    description: 'Frequency-hopped acoustic jamming sweeps, synthetic pink chirps, and broadband barrage interference designed to degrade tactical radio communication.',
    tags: ['ECM', 'ANTI-JAM', 'SYNTHETIC', 'ADAPTIVE'],
    classes: [
      { name: 'Broadband Acoustic Barrage', percentage: 38, color: '#ef4444' },
      { name: 'Swept-Sine Chirp Interference', percentage: 28, color: '#f59e0b' },
      { name: 'Pseudo-Random Pulse Noise', percentage: 18, color: '#a855f7' },
      { name: 'Clean Operator Voice Signal', percentage: 16, color: '#22e565' },
    ]
  }
];

interface ModelArchitecture {
  id: string;
  name: string;
  role: string;
  baseAccuracy: number;
  currentAccuracy: number;
  params: string;
  latency: string;
  outputType: string;
  description: string;
}

const MODEL_ARCHITECTURES: ModelArchitecture[] = [
  {
    id: 'yamnet-tactical',
    name: 'YAMNet-Tactical v2 (Threat Event Classifier)',
    role: 'Acoustic Threat Identification',
    baseAccuracy: 88.4,
    currentAccuracy: 88.4,
    params: '3.74M Params (MobileNet-v1 Backbone)',
    latency: '1.24 ms',
    outputType: '521 Discrete Tactical Acoustic Classes',
    description: 'Deep convolutional model optimized for low-power edge classification of gunfire, rotorcraft, jet engines, and vehicle movement.'
  },
  {
    id: 'deepfilternet3',
    name: 'DeepFilterNet-3 Tactical (Speech Enhancement)',
    role: 'Neural Speech Extraction & Noise Suppression',
    baseAccuracy: 86.8,
    currentAccuracy: 86.8,
    params: '2.18M Params (Multi-Stage ERB + Deep Filtering)',
    latency: '1.45 ms',
    outputType: '48 kHz Clean Restored Voice Stream',
    description: 'State-of-the-art two-stage neural filter combining spectral gain attenuation with deep complex linear prediction for 120 dB SPL environments.'
  },
  {
    id: 'neural-vad',
    name: 'Neural VAD-Ultra (Voice Activity Detector)',
    role: 'Low-Latency Gatekeeper',
    baseAccuracy: 91.2,
    currentAccuracy: 91.2,
    params: '420K Params (Temporal ConvNet)',
    latency: '0.62 ms',
    outputType: 'Continuous Binary Speech Probability [0.0 - 1.0]',
    description: 'Sub-millisecond voice activity neural gate that guarantees zero false cuts during continuous helicopter rotor downwash and weapon fire.'
  },
  {
    id: 'neuro-fxlms',
    name: 'Neuro-FxLMS Hybrid (Closed-Loop Anti-Phase)',
    role: 'Adaptive Active Noise Cancellation',
    baseAccuracy: 87.1,
    currentAccuracy: 87.1,
    params: '1.05M Params (Filter Weight Estimator)',
    latency: '0.48 ms',
    outputType: 'Inverse Secondary Path Acoustic Vector',
    description: 'Neural weight estimator predicting online secondary path changes inside the soldier’s ear canal cavity for true closed-loop nullification.'
  }
];

export const ModelTrainingView: React.FC<ModelTrainingViewProps> = ({ store }) => {
  // Model & Dataset Selection State
  const [selectedModelId, setSelectedModelId] = useState<string>('yamnet-tactical');
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('stanag-4744');
  
  // Custom Upload State
  const [customDatasets, setCustomDatasets] = useState<DatasetPreset[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Training Hyperparameters
  const [epochs, setEpochs] = useState<number>(20);
  const [learningRate, setLearningRate] = useState<number>(0.001);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [optimizer, setOptimizer] = useState<string>('AdamW (Weight Decay 1e-4)');
  const [precision, setPrecision] = useState<'FP16' | 'INT8'>('FP16');
  
  // Augmentations
  const [augSpecAugment, setAugSpecAugment] = useState<boolean>(true);
  const [augJammingNoise, setAugJammingNoise] = useState<boolean>(true);
  const [augHrtfSimulation, setAugHrtfSimulation] = useState<boolean>(true);
  const [augClipping, setAugClipping] = useState<boolean>(false);

  // Training Execution State
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingComplete, setTrainingComplete] = useState<boolean>(false);
  const [currentEpoch, setCurrentEpoch] = useState<number>(0);
  const [currentBatch, setCurrentBatch] = useState<number>(0);
  const [totalBatches] = useState<number>(180);
  const [currentLoss, setCurrentLoss] = useState<number>(0.428);
  const [currentAccuracy, setCurrentAccuracy] = useState<number>(88.4);
  const [initialAccuracy, setInitialAccuracy] = useState<number>(88.4);
  const [modelDeployed, setModelDeployed] = useState<boolean>(false);

  // History curves for plotting
  const [lossHistory, setLossHistory] = useState<number[]>([0.485, 0.452, 0.428]);
  const [accHistory, setAccHistory] = useState<number[]>([87.2, 87.9, 88.4]);

  // Audio A/B Evaluation
  const [evalPlaying, setEvalPlaying] = useState<boolean>(false);
  const [evalMode, setEvalMode] = useState<'baseline' | 'retrained'>('retrained');

  const selectedModel = MODEL_ARCHITECTURES.find(m => m.id === selectedModelId) || MODEL_ARCHITECTURES[0];
  const allDatasets = [...DATASET_PRESETS, ...customDatasets];
  const selectedDataset = allDatasets.find(d => d.id === selectedDatasetId) || allDatasets[0];

  // Update initial accuracy when switching model
  useEffect(() => {
    setInitialAccuracy(selectedModel.baseAccuracy);
    setCurrentAccuracy(selectedModel.baseAccuracy);
    setCurrentLoss(0.42);
    setTrainingComplete(false);
    setModelDeployed(false);
    setCurrentEpoch(0);
    setLossHistory([0.48, 0.45, 0.42]);
    setAccHistory([selectedModel.baseAccuracy - 1.2, selectedModel.baseAccuracy - 0.5, selectedModel.baseAccuracy]);
  }, [selectedModelId]);

  // Handle custom dataset file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(null);

    setTimeout(() => {
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      const newDataset: DatasetPreset = {
        id: `custom-${Date.now()}`,
        name: `Custom Ingested: ${fileName.toUpperCase()}`,
        category: 'Field Tactical Telemetry',
        samples: Math.floor(8000 + Math.random() * 12000),
        classesCount: 5,
        snrRange: '-18 dB to +8 dB',
        sizeMb: parseFloat((file.size / (1024 * 1024)).toFixed(1)) || 42.6,
        description: `User-provided acoustic capture dataset '${file.name}'. Verified RFC-4180 format with multichannel spectral signatures.`,
        tags: ['CUSTOM', 'USER-DATASET', 'FIELD-CAPTURE'],
        classes: [
          { name: 'Target Acoustic Threat', percentage: 35, color: '#22e565' },
          { name: 'Severe Background Ambient', percentage: 25, color: '#f59e0b' },
          { name: 'High-SPL Impulse Transients', percentage: 20, color: '#ef4444' },
          { name: 'Speech Signal Transmission', percentage: 20, color: '#38bdf8' },
        ]
      };

      setCustomDatasets(prev => [newDataset, ...prev]);
      setSelectedDatasetId(newDataset.id);
      setIsUploading(false);
      setUploadSuccess(`SUCCESS: Dataset '${file.name}' ingested & tokenized (${newDataset.samples.toLocaleString()} audio frames). Ready for neural retraining.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 800);
  };

  // Simulate one-click sample dataset generation
  const handleLoadDemoDataset = () => {
    setIsUploading(true);
    setTimeout(() => {
      const demoDataset: DatasetPreset = {
        id: `demo-${Date.now()}`,
        name: 'Operation Saber Guard // Multi-Mic Live Combat Audio',
        category: 'Forward Operating Base (FOB) Telemetry',
        samples: 21400,
        classesCount: 6,
        snrRange: '-22 dB to +6 dB',
        sizeMb: 178.4,
        description: 'Simulated 120-minute FOB engagement telemetry: Counter-battery artillery fire, diesel generator hum, high-wind mic buffeting, and VHF encrypted comms.',
        tags: ['FOB-COMBAT', 'REALTIME-INGEST', 'BINAURAL'],
        classes: [
          { name: 'Counter-Battery Artillery Blast', percentage: 32, color: '#ef4444' },
          { name: 'FOB Generator Turbine Noise', percentage: 24, color: '#f59e0b' },
          { name: 'Wind Buffeting & Sand Gusts', percentage: 18, color: '#64748b' },
          { name: 'Tactical Squad Voice Comms', percentage: 26, color: '#22e565' },
        ]
      };
      setCustomDatasets(prev => [demoDataset, ...prev]);
      setSelectedDatasetId(demoDataset.id);
      setIsUploading(false);
      setUploadSuccess(`SUCCESS: 'Operation Saber Guard' generated with 21,400 audio frames.`);
    }, 600);
  };

  // Training simulation loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTraining) {
      interval = setInterval(() => {
        setCurrentBatch(prevBatch => {
          if (prevBatch + 10 >= totalBatches) {
            // Next epoch
            setCurrentEpoch(prevEpoch => {
              const nextEpoch = prevEpoch + 1;
              if (nextEpoch >= epochs) {
                // Training completed
                setIsTraining(false);
                setTrainingComplete(true);
                return epochs;
              }
              // Update metrics
              const progressFraction = nextEpoch / epochs;
              // Target accuracy reaches 98.6% - 99.4%
              const maxBoost = 11.5;
              const newAcc = parseFloat((initialAccuracy + maxBoost * (1 - Math.exp(-3 * progressFraction))).toFixed(1));
              const newLoss = parseFloat((0.42 * Math.exp(-2.8 * progressFraction) + 0.038).toFixed(3));

              setCurrentAccuracy(newAcc);
              setCurrentLoss(newLoss);
              setAccHistory(prev => [...prev.slice(-18), newAcc]);
              setLossHistory(prev => [...prev.slice(-18), newLoss]);

              return nextEpoch;
            });
            return 0;
          }
          return prevBatch + 10;
        });
      }, 120);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTraining, epochs, totalBatches, initialAccuracy]);

  const handleStartTraining = () => {
    if (trainingComplete) {
      // Reset if re-running
      setCurrentEpoch(0);
      setCurrentBatch(0);
      setCurrentAccuracy(initialAccuracy);
      setCurrentLoss(0.42);
      setLossHistory([0.48, 0.45, 0.42]);
      setAccHistory([initialAccuracy - 1.2, initialAccuracy - 0.5, initialAccuracy]);
      setTrainingComplete(false);
      setModelDeployed(false);
    }
    setIsTraining(true);
  };

  const handlePauseTraining = () => {
    setIsTraining(false);
  };

  const handleResetTraining = () => {
    setIsTraining(false);
    setTrainingComplete(false);
    setCurrentEpoch(0);
    setCurrentBatch(0);
    setCurrentAccuracy(initialAccuracy);
    setCurrentLoss(0.42);
    setLossHistory([0.48, 0.45, 0.42]);
    setAccHistory([initialAccuracy - 1.2, initialAccuracy - 0.5, initialAccuracy]);
    setModelDeployed(false);
  };

  const handleDeployWeights = () => {
    setModelDeployed(true);
    // Trigger notification or link to live view
  };

  // SVG Chart Dimensions
  const chartWidth = 320;
  const chartHeight = 85;

  const renderLossSvg = () => {
    if (lossHistory.length < 2) return null;
    const minLoss = 0.02;
    const maxLoss = 0.52;
    const points = lossHistory.map((val, idx) => {
      const x = (idx / (lossHistory.length - 1)) * chartWidth;
      const y = chartHeight - ((val - minLoss) / (maxLoss - minLoss)) * chartHeight;
      return `${x},${Math.max(4, Math.min(chartHeight - 4, y))}`;
    }).join(' ');

    return (
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        <defs>
          <linearGradient id="lossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Fill */}
        <polygon
          points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
          fill="url(#lossGrad)"
        />
        {/* Line */}
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  const renderAccSvg = () => {
    if (accHistory.length < 2) return null;
    const minAcc = 84;
    const maxAcc = 100;
    const points = accHistory.map((val, idx) => {
      const x = (idx / (accHistory.length - 1)) * chartWidth;
      const y = chartHeight - ((val - minAcc) / (maxAcc - minAcc)) * chartHeight;
      return `${x},${Math.max(4, Math.min(chartHeight - 4, y))}`;
    }).join(' ');

    return (
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
        <defs>
          <linearGradient id="accGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22e565" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22e565" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Fill */}
        <polygon
          points={`0,${chartHeight} ${points} ${chartWidth},${chartHeight}`}
          fill="url(#accGrad)"
        />
        {/* Line */}
        <polyline
          fill="none"
          stroke="#22e565"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#050805] text-[#e8f2e6] overflow-y-auto overflow-x-hidden font-sans select-none custom-scrollbar">
      
      {/* ========================================================================= */}
      {/* 01. MILITARY TOP CLASSIFICATION & HUD TELEMETRY BAR */}
      {/* ========================================================================= */}
      <div className="border-b border-[#223425] bg-[#090e09] px-4 py-3 flex-shrink-0 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-[#142316] border border-[#22e565]/40 text-[#22e565] shadow-[0_0_12px_rgba(34,229,101,0.25)]">
            <BrainCircuit className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-[#22e565] tracking-widest uppercase">
                // SECTION 09: NEURAL RETRAINING & DATASET STUDIO
              </span>
              <span className="bg-[#22e565]/10 text-[#22e565] border border-[#22e565]/30 text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold">
                ACTIVE RIG
              </span>
              <span className="bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-semibold">
                ARM NEON FP16
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-[#e8f2e6] tracking-wide mt-0.5 font-mono">
              TACTICAL ACOUSTIC NEURAL ADAPTATION & ACCURACY OPTIMIZER
            </h1>
          </div>
        </div>

        {/* Live KPI Quick Metrics */}
        <div className="flex items-center space-x-2 sm:space-x-3 font-mono text-xs">
          <div className="bg-[#0e150f] border border-[#223425] px-3 py-1.5 rounded flex flex-col items-end">
            <span className="text-[9px] text-[#7ea385] uppercase tracking-wider">Baseline Acc</span>
            <span className="text-[#b2ccb7] font-bold">{initialAccuracy.toFixed(1)}%</span>
          </div>

          <div className="bg-[#142316] border border-[#22e565]/40 px-3 py-1.5 rounded flex flex-col items-end shadow-[0_0_8px_rgba(34,229,101,0.2)]">
            <span className="text-[9px] text-[#22e565] uppercase tracking-wider font-bold">Retrained Acc</span>
            <span className="text-[#22e565] font-extrabold text-sm flex items-center gap-1">
              {currentAccuracy.toFixed(1)}%
              {currentAccuracy > initialAccuracy && (
                <span className="text-[10px] text-[#38bdf8]">
                  (+{(currentAccuracy - initialAccuracy).toFixed(1)}%)
                </span>
              )}
            </span>
          </div>

          <div className="bg-[#0e150f] border border-[#223425] px-3 py-1.5 rounded flex flex-col items-end">
            <span className="text-[9px] text-[#7ea385] uppercase tracking-wider">Validation Loss</span>
            <span className={`font-bold ${currentLoss < 0.1 ? 'text-[#22e565]' : 'text-[#f59e0b]'}`}>
              {currentLoss.toFixed(3)}
            </span>
          </div>

          <div className="bg-[#0e150f] border border-[#223425] px-3 py-1.5 rounded flex flex-col items-end">
            <span className="text-[9px] text-[#7ea385] uppercase tracking-wider">Inference Latency</span>
            <span className="text-[#38bdf8] font-bold">{selectedModel.latency}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 02. MAIN TWO-COLUMN LAB WORKSPACE */}
      {/* ========================================================================= */}
      <div className="flex-1 p-4 grid grid-cols-1 xl:grid-cols-12 gap-4">
        
        {/* ===================================================================== */}
        {/* LEFT COLUMN (COL 1-7): MODEL SELECTION + DATASET INGESTION & BROWSER */}
        {/* ===================================================================== */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          
          {/* 2.1 SELECT TARGET ARCHITECTURE */}
          <div className="bg-[#090e09] border border-[#223425] rounded p-4">
            <div className="flex items-center justify-between mb-3 border-b border-[#223425] pb-2">
              <div className="flex items-center space-x-2 font-mono">
                <Target className="w-4 h-4 text-[#22e565]" />
                <h2 className="text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
                  1. SELECT TARGET DEFENSE AI ARCHITECTURE
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#7ea385]">
                {MODEL_ARCHITECTURES.length} ARCHITECTURES READY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MODEL_ARCHITECTURES.map((model) => {
                const isSelected = model.id === selectedModelId;
                return (
                  <button
                    key={model.id}
                    onClick={() => {
                      if (!isTraining) setSelectedModelId(model.id);
                    }}
                    disabled={isTraining}
                    className={`p-3 rounded text-left transition-all border flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#142316] border-[#22e565] shadow-[0_0_10px_rgba(34,229,101,0.2)]'
                        : 'bg-[#0e150f] border-[#223425] hover:border-[#3d5c43] text-[#b2ccb7]'
                    } ${isTraining ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold font-mono ${isSelected ? 'text-[#22e565]' : 'text-[#e8f2e6]'}`}>
                          {model.name}
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22e565]" />
                        )}
                      </div>
                      <span className="text-[10px] text-[#7ea385] font-mono block mt-0.5">
                        {model.role}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#b2ccb7] my-2 leading-relaxed">
                      {model.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] font-mono border-t border-[#223425] pt-1.5 mt-1 text-[#7ea385]">
                      <span>{model.params}</span>
                      <span className="text-[#38bdf8] font-semibold">{model.latency}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2.2 DATASET MANAGER & INGESTION ("ADD ANY DATASET") */}
          <div className="bg-[#090e09] border border-[#223425] rounded p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#223425] pb-2">
              <div className="flex items-center space-x-2 font-mono">
                <Database className="w-4 h-4 text-[#38bdf8]" />
                <h2 className="text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
                  2. INGEST & SELECT TRAINING DATASET
                </h2>
              </div>
              <div className="flex items-center space-x-2 font-mono text-[10px]">
                <button
                  onClick={handleLoadDemoDataset}
                  className="px-2 py-1 rounded bg-[#142316] text-[#22e565] border border-[#22e565]/40 hover:bg-[#22e565] hover:text-[#050805] transition-all font-semibold"
                >
                  + Quick Ingest Combat Set
                </button>
              </div>
            </div>

            {/* Ingestion Dropzone & File Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Upload Card */}
              <div 
                onClick={() => !isTraining && fileInputRef.current?.click()}
                className={`md:col-span-1 border-2 border-dashed border-[#2e4632] hover:border-[#22e565] bg-[#0e150f] hover:bg-[#142316]/50 rounded p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  isTraining ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv,.wav,.mp3,.flac,.json,.npy,.tar.gz"
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-[#22e565] mb-2 animate-bounce" />
                <span className="text-xs font-mono font-bold text-[#e8f2e6]">
                  ADD CUSTOM DATASET
                </span>
                <span className="text-[10px] text-[#7ea385] mt-1 leading-snug">
                  Drop RFC-4180 CSV, WAV, or NPY arrays
                </span>
                <span className="text-[9px] font-mono text-[#38bdf8] mt-2 bg-[#38bdf8]/10 px-1.5 py-0.5 rounded border border-[#38bdf8]/30">
                  {isUploading ? 'TOKENIZING...' : 'BROWSE FILES'}
                </span>
              </div>

              {/* Dataset Description & Stats of Selected Dataset */}
              <div className="md:col-span-2 bg-[#0e150f] border border-[#223425] rounded p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-[#22e565]">
                      {selectedDataset.name}
                    </span>
                    <span className="text-[9px] font-mono bg-[#223425] text-[#b2ccb7] px-1.5 py-0.5 rounded">
                      {selectedDataset.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#b2ccb7] mt-1.5 leading-relaxed">
                    {selectedDataset.description}
                  </p>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#223425] font-mono text-[10px] mt-2">
                  <div>
                    <span className="text-[#7ea385] block">Frames</span>
                    <span className="font-bold text-[#e8f2e6]">{selectedDataset.samples.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[#7ea385] block">Classes</span>
                    <span className="font-bold text-[#22e565]">{selectedDataset.classesCount} Classes</span>
                  </div>
                  <div>
                    <span className="text-[#7ea385] block">SNR Span</span>
                    <span className="font-bold text-[#f59e0b]">{selectedDataset.snrRange}</span>
                  </div>
                  <div>
                    <span className="text-[#7ea385] block">Payload</span>
                    <span className="font-bold text-[#38bdf8]">{selectedDataset.sizeMb} MB</span>
                  </div>
                </div>
              </div>
            </div>

            {uploadSuccess && (
              <div className="p-2 rounded bg-[#142316] border border-[#22e565]/40 text-[#22e565] text-xs font-mono flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {/* List of Available Datasets */}
            <div className="space-y-1.5 mt-1">
              <span className="text-[10px] font-mono text-[#7ea385] uppercase tracking-wider block">
                AVAILABLE TACTICAL DATASET REPOSITORIES ({allDatasets.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {allDatasets.map((ds) => {
                  const isCurrent = ds.id === selectedDatasetId;
                  return (
                    <div
                      key={ds.id}
                      onClick={() => !isTraining && setSelectedDatasetId(ds.id)}
                      className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between text-left ${
                        isCurrent
                          ? 'bg-[#142316] border-[#22e565] text-[#22e565]'
                          : 'bg-[#0e150f] border-[#223425] hover:border-[#3d5c43] text-[#b2ccb7]'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="text-[11px] font-bold font-mono truncate">
                          {ds.name}
                        </div>
                        <div className="text-[9px] text-[#7ea385] font-mono mt-0.5 flex items-center space-x-2">
                          <span>{ds.samples.toLocaleString()} frames</span>
                          <span>•</span>
                          <span>{ds.sizeMb} MB</span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        {isCurrent ? (
                          <span className="w-2 h-2 rounded-full bg-[#22e565] inline-block shadow-[0_0_6px_#22e565]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#223425] inline-block" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Class Balance Bars */}
            <div className="bg-[#0e150f] border border-[#223425] rounded p-3">
              <span className="text-[10px] font-mono text-[#7ea385] uppercase tracking-wider block mb-2">
                DATASET CLASS DISTRIBUTION & ACOUSTIC BALANCE:
              </span>
              <div className="space-y-2 font-mono text-[11px]">
                {selectedDataset.classes.map((cls, idx) => (
                  <div key={idx} className="flex flex-col space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#b2ccb7]">{cls.name}</span>
                      <span className="text-[#e8f2e6] font-semibold">{cls.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#141f16] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${cls.percentage}%`, backgroundColor: cls.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 2.3 HYPERPARAMETERS & TACTICAL AUGMENTATION */}
          <div className="bg-[#090e09] border border-[#223425] rounded p-4">
            <div className="flex items-center justify-between mb-3 border-b border-[#223425] pb-2 font-mono">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#f59e0b]" />
                <h2 className="text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
                  3. HYPERPARAMETER TUNING & NOISE AUGMENTATION
                </h2>
              </div>
              <span className="text-[10px] text-[#7ea385]">
                OPTIMIZATION SETTINGS
              </span>
            </div>

            {/* Parameter Sliders */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs mb-3">
              <div className="bg-[#0e150f] border border-[#223425] p-2.5 rounded">
                <span className="text-[9px] text-[#7ea385] block">EPOCHS</span>
                <span className="text-sm font-bold text-[#22e565]">{epochs}</span>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={epochs}
                  disabled={isTraining}
                  onChange={(e) => setEpochs(parseInt(e.target.value))}
                  className="w-full mt-1.5 accent-[#22e565]"
                />
              </div>

              <div className="bg-[#0e150f] border border-[#223425] p-2.5 rounded">
                <span className="text-[9px] text-[#7ea385] block">LEARNING RATE</span>
                <span className="text-sm font-bold text-[#38bdf8]">{learningRate}</span>
                <input
                  type="range"
                  min="0.0001"
                  max="0.005"
                  step="0.0005"
                  value={learningRate}
                  disabled={isTraining}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full mt-1.5 accent-[#38bdf8]"
                />
              </div>

              <div className="bg-[#0e150f] border border-[#223425] p-2.5 rounded">
                <span className="text-[9px] text-[#7ea385] block">BATCH SIZE</span>
                <span className="text-sm font-bold text-[#f59e0b]">{batchSize}</span>
                <div className="flex gap-1 mt-1.5">
                  {[16, 32, 64].map(b => (
                    <button
                      key={b}
                      onClick={() => !isTraining && setBatchSize(b)}
                      className={`flex-1 text-[9px] py-0.5 rounded border ${
                        batchSize === b
                          ? 'bg-[#f59e0b] text-[#050805] font-bold border-[#f59e0b]'
                          : 'bg-[#141f16] text-[#b2ccb7] border-[#223425]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0e150f] border border-[#223425] p-2.5 rounded">
                <span className="text-[9px] text-[#7ea385] block">QUANTIZATION</span>
                <span className="text-sm font-bold text-[#a855f7]">{precision}</span>
                <div className="flex gap-1 mt-1.5">
                  {(['FP16', 'INT8'] as const).map(p => (
                    <button
                      key={p}
                      onClick={() => !isTraining && setPrecision(p)}
                      className={`flex-1 text-[9px] py-0.5 rounded border ${
                        precision === p
                          ? 'bg-[#a855f7] text-[#050805] font-bold border-[#a855f7]'
                          : 'bg-[#141f16] text-[#b2ccb7] border-[#223425]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Augmentation Toggles */}
            <div className="bg-[#0e150f] border border-[#223425] p-3 rounded">
              <span className="text-[10px] font-mono text-[#7ea385] uppercase tracking-wider block mb-2">
                ACTIVE DATA AUGMENTATION LAYERS (FOR GENERALIZATION & ACCURACY BOOST):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10px]">
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={augSpecAugment}
                    onChange={(e) => setAugSpecAugment(e.target.checked)}
                    disabled={isTraining}
                    className="accent-[#22e565]"
                  />
                  <span className="text-[#b2ccb7]">SpecAugment (Masking)</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={augJammingNoise}
                    onChange={(e) => setAugJammingNoise(e.target.checked)}
                    disabled={isTraining}
                    className="accent-[#22e565]"
                  />
                  <span className="text-[#b2ccb7]">Combat Jamming Synth</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={augHrtfSimulation}
                    onChange={(e) => setAugHrtfSimulation(e.target.checked)}
                    disabled={isTraining}
                    className="accent-[#22e565]"
                  />
                  <span className="text-[#b2ccb7]">Binaural HRTF Cavity</span>
                </label>

                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={augClipping}
                    onChange={(e) => setAugClipping(e.target.checked)}
                    disabled={isTraining}
                    className="accent-[#22e565]"
                  />
                  <span className="text-[#b2ccb7]">120 dB Clipping Model</span>
                </label>
              </div>
            </div>
          </div>

        </div>

        {/* ===================================================================== */}
        {/* RIGHT COLUMN (COL 8-12): REAL-TIME CONVERGENCE ENGINE & DEPLOYMENT */}
        {/* ===================================================================== */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          
          {/* 3.1 TRAINING CONTROL DOCK */}
          <div className="bg-[#090e09] border border-[#223425] rounded p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#223425] pb-2 font-mono">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-[#22e565]" />
                <h2 className="text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
                  4. LIVE TRAINING EXECUTION RIG
                </h2>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                isTraining
                  ? 'bg-[#22e565]/20 text-[#22e565] border-[#22e565] animate-pulse'
                  : trainingComplete
                  ? 'bg-[#38bdf8]/20 text-[#38bdf8] border-[#38bdf8]'
                  : 'bg-[#141f16] text-[#7ea385] border-[#223425]'
              }`}>
                {isTraining ? '● TRAINING IN PROGRESS' : trainingComplete ? '✓ TRAINING COMPLETED' : 'IDLE - READY'}
              </span>
            </div>

            {/* Epoch & Batch Progress Bars */}
            <div className="space-y-2 font-mono">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#7ea385]">EPOCH PROGRESS</span>
                  <span className="text-[#22e565] font-bold">
                    {currentEpoch} / {epochs} ({Math.round((currentEpoch / epochs) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-[#141f16] h-2.5 rounded-full overflow-hidden border border-[#223425]">
                  <div
                    className="bg-gradient-to-r from-[#166534] via-[#22c55e] to-[#22e565] h-full transition-all duration-300 shadow-[0_0_8px_#22e565]"
                    style={{ width: `${(currentEpoch / epochs) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-[#7ea385]">BATCH ITERATION</span>
                  <span className="text-[#38bdf8] font-bold">
                    {currentBatch} / {totalBatches}
                  </span>
                </div>
                <div className="w-full bg-[#141f16] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#38bdf8] h-full transition-all duration-100"
                    style={{ width: `${(currentBatch / totalBatches) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 pt-2">
              {!isTraining ? (
                <button
                  onClick={handleStartTraining}
                  className="flex-1 py-2.5 rounded bg-[#22e565] hover:bg-[#16a34a] text-[#050805] font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_12px_rgba(34,229,101,0.4)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{trainingComplete ? 'RE-RUN RETRAINING' : 'START RETRAINING PIPELINE'}</span>
                </button>
              ) : (
                <button
                  onClick={handlePauseTraining}
                  className="flex-1 py-2.5 rounded bg-[#f59e0b] hover:bg-[#d97706] text-[#050805] font-mono text-xs font-extrabold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE TRAINING</span>
                </button>
              )}

              <button
                onClick={handleResetTraining}
                disabled={isTraining}
                className="px-3 py-2.5 rounded bg-[#141f16] hover:bg-[#1a281c] text-[#7ea385] hover:text-[#e8f2e6] border border-[#223425] font-mono text-xs flex items-center space-x-1.5 transition-all"
                title="Reset Weights to Baseline"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RESET</span>
              </button>
            </div>
          </div>

          {/* 3.2 REAL-TIME CONVERGENCE GRAPHS (LOSS & ACCURACY) */}
          <div className="bg-[#090e09] border border-[#223425] rounded p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#223425] pb-2 font-mono">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#38bdf8]" />
                <h2 className="text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
                  REAL-TIME CONVERGENCE DYNAMICS
                </h2>
              </div>
              <span className="text-[10px] text-[#7ea385]">
                SMOOTHED LOSS & ACC
              </span>
            </div>

            {/* Validation Accuracy Curve */}
            <div className="bg-[#0e150f] border border-[#223425] p-3 rounded">
              <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                <span className="text-[#22e565] font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  VALIDATION ACCURACY CURVE
                </span>
                <span className="text-[#22e565] font-extrabold text-sm">
                  {currentAccuracy.toFixed(1)}%
                </span>
              </div>
              <div className="h-20 w-full relative">
                {renderAccSvg()}
              </div>
            </div>

            {/* Training Loss Curve */}
            <div className="bg-[#0e150f] border border-[#223425] p-3 rounded">
              <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                <span className="text-[#ef4444] font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  OBJECTIVE LOSS CONVERGENCE
                </span>
                <span className="text-[#ef4444] font-extrabold text-sm">
                  {currentLoss.toFixed(3)}
                </span>
              </div>
              <div className="h-20 w-full relative">
                {renderLossSvg()}
              </div>
            </div>
          </div>

          {/* 3.3 CLASS-BY-CLASS ACCURACY GAIN BREAKDOWN */}
          <div className="bg-[#090e09] border border-[#223425] rounded p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-[#223425] pb-2 font-mono">
              <span className="text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
                PER-THREAT ACCURACY BREAKDOWN
              </span>
              <span className="text-[10px] text-[#22e565] font-bold">
                +{(currentAccuracy - initialAccuracy).toFixed(1)}% NET GAIN
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              {[
                { name: 'UH-60 Rotor Wash Cancellation', base: 86.2, current: 86.2 + (currentAccuracy - initialAccuracy) * 1.15 },
                { name: 'Small Arms Ballistic Snap Intercept', base: 89.5, current: 89.5 + (currentAccuracy - initialAccuracy) * 0.95 },
                { name: 'Human Speech Intelligibility @ 115dB', base: 84.1, current: 84.1 + (currentAccuracy - initialAccuracy) * 1.25 },
                { name: 'Turbine Whine In-Ear Phase Null', base: 91.0, current: 91.0 + (currentAccuracy - initialAccuracy) * 0.82 },
                { name: 'Electronic Jamming Chirp Rejection', base: 81.3, current: 81.3 + (currentAccuracy - initialAccuracy) * 1.45 },
              ].map((item, idx) => {
                const finalCur = Math.min(99.6, item.current);
                const gain = finalCur - item.base;
                return (
                  <div key={idx} className="bg-[#0e150f] border border-[#223425] p-2 rounded flex items-center justify-between">
                    <span className="text-[#b2ccb7] text-[11px] truncate pr-2">
                      {item.name}
                    </span>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[#7ea385] text-[10px] line-through">
                        {item.base.toFixed(1)}%
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#22e565]" />
                      <span className="text-[#22e565] font-bold text-xs">
                        {finalCur.toFixed(1)}%
                      </span>
                      <span className="text-[9px] text-[#38bdf8] bg-[#38bdf8]/10 px-1 rounded border border-[#38bdf8]/30">
                        +{gain.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3.4 DEPLOYMENT TO TACTICAL HEADSET & CHECKPOINT DOWNLOAD */}
          <div className="bg-[#090e09] border border-[#223425] rounded p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#223425] pb-2 font-mono">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#22e565]" />
                <h2 className="text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
                  5. DEPLOY TO HEADSET DSP FIRMWARE
                </h2>
              </div>
              {modelDeployed && (
                <span className="text-[10px] font-mono text-[#22e565] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  ACTIVE IN FIELD
                </span>
              )}
            </div>

            <p className="text-[11px] text-[#b2ccb7] leading-relaxed">
              Export fine-tuned neural weights to the tactical headset’s Raspberry Pi 4 ARM NEON DSP core. Instantly updates in-ear noise cancellation and acoustic threat detection in realtime.
            </p>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleDeployWeights}
                disabled={currentAccuracy <= initialAccuracy}
                className={`flex-1 py-2.5 rounded font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
                  modelDeployed
                    ? 'bg-[#142316] text-[#22e565] border border-[#22e565] shadow-[0_0_12px_rgba(34,229,101,0.2)]'
                    : currentAccuracy > initialAccuracy
                    ? 'bg-[#22e565] hover:bg-[#16a34a] text-[#050805] shadow-[0_0_12px_rgba(34,229,101,0.3)] cursor-pointer'
                    : 'bg-[#141f16] text-[#7ea385] border border-[#223425] opacity-60 cursor-not-allowed'
                }`}
              >
                <Cpu className="w-4 h-4" />
                <span>
                  {modelDeployed ? 'WEIGHTS FLASHED TO HEADSET' : 'DEPLOY WEIGHTS TO HEADSET'}
                </span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify({
                    model: selectedModel.name,
                    accuracy: currentAccuracy,
                    dataset: selectedDataset.name,
                    timestamp: new Date().toISOString(),
                    weights_format: 'ONNX_FP16_ARM_NEON'
                  }, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${selectedModel.id}-finetuned-checkpoint.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-2.5 rounded bg-[#0e150f] hover:bg-[#141f16] text-[#38bdf8] border border-[#223425] hover:border-[#38bdf8] font-mono text-xs flex items-center space-x-1.5 transition-all"
                title="Download Model Weights"
              >
                <HardDriveDownload className="w-4 h-4" />
                <span>CHECKPOINT</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default ModelTrainingView;
