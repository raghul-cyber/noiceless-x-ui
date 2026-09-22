import { NoiseScenario, NoiseScenarioId, PipelineStage } from '../types/simulation';

export const NOISE_SCENARIOS: NoiseScenario[] = [
  {
    id: 'gunshots',
    name: 'GUNFIRE / BALLISTIC',
    description: 'High-energy impulsive shockwaves and supersonic muzzle blast waves (140-165 dB peak SPL).',
    splDb: 152,
    freqRange: '200 Hz – 4.5 kHz',
    primaryFrequency: 850,
    aiClassification: 'Gunshot / Small Arms Fire',
    aiConfidence: 98.4,
    deepFilterNetSnrGainDb: 34.2,
    color: '#ff334b',
    waveformPattern: 'impulsive'
  },
  {
    id: 'helicopter',
    name: 'TACTICAL ROTORCRAFT',
    description: 'Low-frequency blade-vortex blade slap harmonics and turboshaft engine whine (105 dB SPL).',
    splDb: 108,
    freqRange: '18 Hz – 450 Hz',
    primaryFrequency: 24,
    aiClassification: 'Rotorcraft / Heavy Transport',
    aiConfidence: 96.8,
    deepFilterNetSnrGainDb: 28.6,
    color: '#ff8c00',
    waveformPattern: 'cyclic-low'
  },
  {
    id: 'vehicle',
    name: 'ARMORED VEHICLE CONVOY',
    description: 'Heavy diesel engine rumble, transmission gear clatter, and rough terrain tire track vibration.',
    splDb: 96,
    freqRange: '40 Hz – 800 Hz',
    primaryFrequency: 68,
    aiClassification: 'Diesel Engine / Tracked Armored',
    aiConfidence: 94.2,
    deepFilterNetSnrGainDb: 26.4,
    color: '#eab308',
    waveformPattern: 'rumble'
  },
  {
    id: 'wind',
    name: 'HIGH-VELOCITY WIND',
    description: 'Turbulent pressure fluctuations over earcup rim and microphone mesh (45 knot gusts).',
    splDb: 88,
    freqRange: '10 Hz – 1.8 kHz',
    primaryFrequency: 45,
    aiClassification: 'Aerodynamic Turbulence / Wind Shear',
    aiConfidence: 91.5,
    deepFilterNetSnrGainDb: 24.1,
    color: '#38bdf8',
    waveformPattern: 'broadband'
  },
  {
    id: 'crowd',
    name: 'URBAN / CROWD BABBLE',
    description: 'Multi-talker acoustic babble and diffuse urban acoustic clutter.',
    splDb: 84,
    freqRange: '250 Hz – 4 kHz',
    primaryFrequency: 520,
    aiClassification: 'Multi-Talker Babble / Ambient Chatter',
    aiConfidence: 89.7,
    deepFilterNetSnrGainDb: 22.8,
    color: '#a855f7',
    waveformPattern: 'multi-tonal'
  },
  {
    id: 'machinery',
    name: 'INDUSTRIAL GENERATOR',
    description: 'Synchronous harmonic humming and cooling fan turbine blade pass frequencies.',
    splDb: 94,
    freqRange: '60 Hz – 3.2 kHz',
    primaryFrequency: 120,
    aiClassification: 'Industrial Turbine / Generator',
    aiConfidence: 95.1,
    deepFilterNetSnrGainDb: 30.5,
    color: '#ec4899',
    waveformPattern: 'mechanical'
  },
  {
    id: 'combined',
    name: 'COMBINED BATTLEFIELD',
    description: 'Complex warfare acoustic cocktail: artillery blasts, low rotor thrum, and heavy vehicle movements.',
    splDb: 128,
    freqRange: '15 Hz – 6 kHz',
    primaryFrequency: 140,
    aiClassification: 'Combat Zone / Combined Warfare',
    aiConfidence: 97.9,
    deepFilterNetSnrGainDb: 32.1,
    color: '#f43f5e',
    waveformPattern: 'chaotic-battlefield'
  },
  {
    id: 'custom_dataset',
    name: 'CUSTOM CSV DATASET',
    description: 'User-imported acoustic telemetry records parsed directly from custom CSV file.',
    splDb: 118,
    freqRange: '20 Hz – 8.5 kHz',
    primaryFrequency: 340,
    aiClassification: 'User CSV Telemetry',
    aiConfidence: 99.2,
    deepFilterNetSnrGainDb: 31.4,
    color: '#a855f7',
    waveformPattern: 'chaotic-battlefield'
  }
];

export const getNoiseScenario = (id: NoiseScenarioId, customDataset?: import('../types/simulation').CustomDataset | null): NoiseScenario => {
  if (id === 'custom_dataset' && customDataset) {
    return {
      id: 'custom_dataset',
      name: `CSV: ${customDataset.fileName.toUpperCase()}`,
      description: `User-imported telemetry from ${customDataset.fileName} (${customDataset.rowCount} rows). Classified as ${customDataset.summary.threatClass}.`,
      splDb: Math.round(customDataset.summary.peakSpl || 118),
      freqRange: `${Math.round(customDataset.summary.dominantFreq * 0.2)} Hz – ${Math.round(customDataset.summary.dominantFreq * 4)} Hz`,
      primaryFrequency: Math.round(customDataset.summary.dominantFreq || 340),
      aiClassification: customDataset.summary.threatClass || 'User CSV Stream',
      aiConfidence: 98.6,
      deepFilterNetSnrGainDb: parseFloat((customDataset.summary.avgSnrGain || 28.5).toFixed(1)),
      color: '#a855f7',
      waveformPattern: 'chaotic-battlefield'
    };
  }
  return NOISE_SCENARIOS.find((s) => s.id === id) || NOISE_SCENARIOS[0];
};

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    step: 1,
    title: 'SURROUNDING NOISE THREAT',
    subtitle: 'Battlefield / Rotor / Wind / Gunfire Field',
    componentId: 'environment',
    color: '#f43f5e',
    signalType: 'NOISE',
    mathFormula: 'x(t) = \\sum A_k \\sin(2\\pi f_k t + \\phi_k) + \\eta(t)',
    latencyMs: 0.0,
    detailDescription: 'Hostile acoustic pressure field radiates toward the operator. Sound levels range from 105 dB (tactical rotorcraft) to 155 dB peak (supersonic ballistic shockwaves). Without active mitigation, this causes permanent hearing trauma and complete tactical voice masking.',
    metricLabel: 'PEAK FIELD SPL',
    metricValue: '152.4 dB SPL',
    cameraPreset: 'SYSTEM_OVERVIEW'
  },
  {
    step: 2,
    title: 'REFERENCE MIC TRANSDUCTION',
    subtitle: 'Wideband MEMS Reference Mic (Left Earcup)',
    componentId: 'externalRefMic',
    color: '#00e599',
    signalType: 'REFERENCE',
    mathFormula: 'x[n] = \\mathcal{Q}_{24b}\\{G_{pre} \\cdot x(n T_s)\\}',
    latencyMs: 0.12,
    detailDescription: 'The ultra-wideband external reference microphone on the outer shell of the left earcup captures incoming ambient pressure fluctuations before they penetrate the earcup seal. The analog signal is amplified and digitized at 24-bit / 96 kHz with ultra-low latency.',
    metricLabel: 'ADC LATENCY',
    metricValue: '0.12 ms (96 kHz)',
    cameraPreset: 'LEFT'
  },
  {
    step: 3,
    title: 'DSP & NEURAL CLASSIFIER',
    subtitle: 'Raspberry Pi 4 Compute Core + FxLMS Engine',
    componentId: 'raspberryPi',
    color: '#facc15',
    signalType: 'PROCESSING',
    mathFormula: 'w[n+1] = w[n] + \\mu \\cdot e[n] \\cdot x\'[n]',
    latencyMs: 0.52,
    detailDescription: 'Digital signal packets travel down the shielded cable harness into the waist unit. YAMNet AI classifies the noise signature with 97.4% confidence while a dedicated 128-tap Filtered-X LMS adaptive algorithm calculates the exact phase-inverted anti-noise cancellation weights.',
    metricLabel: 'ALGORITHMIC CYCLE',
    metricValue: '0.52 ms (<0.8ms Target)',
    cameraPreset: 'WAIST'
  },
  {
    step: 4,
    title: 'ANTI-NOISE SPEAKER TRANSDUCTION',
    subtitle: '40mm High-Excursion Neodymium Driver',
    componentId: 'speakerDriver',
    color: '#38bdf8',
    signalType: 'SPEAKER',
    mathFormula: 'y[n] = -\\sum_{k=0}^{M-1} w_k \\cdot x[n-k] \\implies P_{anti}(t) = -P_{noise}(t)',
    latencyMs: 0.18,
    detailDescription: 'Inverted anti-sound packets race back up the cable into the left earcup. The 40mm high-flux neodymium driver reproduces an acoustic wave that is exactly 180° out of phase relative to the incoming noise entering the earcup cavity.',
    metricLabel: 'DAC + DRIVER DELAY',
    metricValue: '0.18 ms (Total: 0.82 ms)',
    cameraPreset: 'CLOSEUP'
  },
  {
    step: 5,
    title: 'EAR CAVITY DESTRUCTIVE INTERFERENCE',
    subtitle: 'Acoustic Cancellation Node & Internal Error Mic',
    componentId: 'internalErrorMic',
    color: '#d946ef',
    signalType: 'ERROR',
    mathFormula: 'e(t) = P_{noise}(t) + P_{anti}(t) \\approx 0 \\; (-34.6\\text{ dB})',
    latencyMs: 0.84,
    detailDescription: 'Inside the anatomical ear cavity, the positive acoustic pressure peaks collide with the speaker anti-noise troughs, cancelling each other out by destructive superposition. The internal error mic measures the minute residual error e[n] and sends feedback to tune filter convergence.',
    metricLabel: 'BROADBAND ATTENUATION',
    metricValue: '-34.6 dB (73.4 dB in-ear)',
    cameraPreset: 'EAR_CANAL'
  },
  {
    step: 6,
    title: 'BOOM MIC VOCAL CAPTURE',
    subtitle: 'Near-Field Speech + Directional Noise Rejection',
    componentId: 'boomMic',
    color: '#22c55e',
    signalType: 'VOICE',
    mathFormula: 'y_{boom}[n] = s[n] + \\alpha \\cdot n_{local}[n]',
    latencyMs: 0.84,
    detailDescription: 'The soldier speaks into the noise-cancelling boom microphone positioned 2.5 cm from the lips. While the hyper-cardioid capsule mechanically rejects -18 dB of off-axis noise, harsh battlefield acoustic bleed still contaminates the raw voice signal.',
    metricLabel: 'RAW VOICE SNR',
    metricValue: '-4.2 dB (Severe Bleed)',
    cameraPreset: 'BOOM_MIC'
  },
  {
    step: 7,
    title: 'DeepFilterNet2 AI SPEECH & RADIO OUT',
    subtitle: 'Neural Denoising & Tactical Broadcast Stream',
    componentId: 'clearVoice',
    color: '#10b981',
    signalType: 'OUTPUT',
    mathFormula: '\\hat{S}(f, t) = \\mathcal{M}_{DFN2}(f, t) \\odot Y_{boom}(f, t)',
    latencyMs: 14.8,
    detailDescription: 'The speech stream passes through DeepFilterNet2 running on the Raspberry Pi. The neural network computes spectral gains and deep filtering coefficients, obliterating the background noise while preserving every voice formant for crystal-clear tactical radio transmission.',
    metricLabel: 'PROCESSED SNR GAIN',
    metricValue: '+34.2 dB (PESQ: 3.84 / 4.5)',
    cameraPreset: 'SYSTEM_OVERVIEW'
  }
];
