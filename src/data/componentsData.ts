import { ComponentItem } from '../types/headset';

export const HARDWARE_COMPONENTS: Record<string, ComponentItem> = {
  headband: {
    id: 'headband',
    name: 'HEADBAND ASSEMBLY',
    category: 'HEADSET',
    role: 'Ergonomic structural clamping arc and wiring pass-through.',
    input: 'Mechanical spring tension (12.5 N)',
    output: 'Bilateral clamping pressure on temporal bone',
    connection: 'Stainless steel wire yoke to left & right earcups',
    technicalSpecs: [
      'Spring-tempered stainless steel wire yoke (MIL-SPEC)',
      'Breathable closed-cell padded leather sleeve with velcro seam',
      'Dual multi-conductor shielded bridge cable routing between cups',
      'Quick-release ARC rail helmet adapter compatible'
    ],
    status: 'ONLINE',
    position: [0, -0.065, 0.001],
    explodedOffset: [0, 0.12, 0]
  },
  leftEarcupShell: {
    id: 'leftEarcupShell',
    name: 'LEFT EARCUP (OUTER HOUSING)',
    category: 'HEADSET',
    role: 'Rugged ballistic enclosure housing acoustic chamber and electronics.',
    input: 'External mechanical impacts & ambient acoustic field',
    output: 'Passive acoustic isolation (-28 dB SNR)',
    connection: 'Wire yoke pivot bracket & cable harness strain relief',
    technicalSpecs: [
      'High-impact glass-filled nylon / polycarbonate blend',
      'Integrated sealed battery cap & push-button volume rocker',
      'IP68 immersion resistant silicone perimeter gasket',
      'Low radar signature matte tactical finish'
    ],
    status: 'ONLINE',
    position: [-0.08, -0.141, 0.001],
    explodedOffset: [-0.22, 0, 0]
  },
  rightEarcupShell: {
    id: 'rightEarcupShell',
    name: 'RIGHT EARCUP (OUTER HOUSING)',
    category: 'HEADSET',
    role: 'Bilateral acoustic enclosure & auxiliary electronics chamber.',
    input: 'Ambient acoustic pressure',
    output: 'Passive acoustic attenuation',
    connection: 'Headband bridge wire & ear cushion clamp',
    technicalSpecs: [
      'Identical acoustic volume (85 cc) for symmetric stereo response',
      'Secondary battery compartment for 40h continuous operation',
      'Reinforced wire yoke mounting bosses'
    ],
    status: 'ONLINE',
    position: [0.08, -0.06, -0.03],
    explodedOffset: [0.22, 0, 0]
  },
  externalRefMic: {
    id: 'externalRefMic',
    name: 'EXTERNAL REFERENCE MICROPHONE',
    category: 'MICROPHONES',
    role: 'Captures ambient environmental noise field before reaching the ear canal.',
    input: 'Ambient acoustic wavefronts (Gunfire, Rotor, Engine, Wind)',
    output: 'Differential analog reference signal (x(n)) to ADC',
    connection: 'Hard-mounted on exterior of LEFT earcup via vibration-damped bracket',
    technicalSpecs: [
      'Protruding rugged aluminum housing with sintered stainless steel mesh',
      'Electret condenser capsule with omnidirectional polar pattern',
      'Acoustic Overload Point (AOP): 136 dB SPL for gunshot blast survival',
      'Frequency Response: 20 Hz – 20 kHz (flat phase response for ANC)'
    ],
    status: 'ACTIVE',
    position: [-0.12, -0.141, 0.015],
    explodedOffset: [-0.28, 0.02, 0.04]
  },
  internalErrorMic: {
    id: 'internalErrorMic',
    name: 'INTERNAL ERROR MICROPHONE',
    category: 'MICROPHONES',
    role: 'Detects residual noise + speaker anti-sound directly inside the earcup.',
    input: 'Residual acoustic error pressure e(n) inside ear cavity',
    output: 'Feedback error signal to adaptive FxLMS filter loop',
    connection: 'Mounted on inner baffle plate directly adjacent to speaker cone',
    technicalSpecs: [
      'Ultra-miniature low-noise MEMS acoustic sensor',
      'Acoustic cavity tuning port for ear canal acoustic transfer function',
      'Sensitivity: -38 dBV/Pa, SNR: 68 dBA',
      'Zero-latency analog feedback routing directly to DSP ADC'
    ],
    status: 'FEEDBACK',
    position: [-0.075, -0.141, 0.001],
    explodedOffset: [-0.12, -0.02, 0]
  },
  boomMic: {
    id: 'boomMic',
    name: 'BOOM MICROPHONE',
    category: 'MICROPHONES',
    role: 'Captures close-proximity soldier speech with high ambient rejection.',
    input: 'Near-field vocal cord acoustic pressure (85-105 dB SPL)',
    output: 'Speech signal (s(n)) to DeepFilterNet2 AI enhancement model',
    connection: 'Flexible gooseneck arm anchored to left earcup pivot socket, resting at lips',
    technicalSpecs: [
      'Noise-cancelling bi-directional gradient electret capsule',
      'Water-repellent hydrophobic acoustic foam windscreen',
      'Flexible 360-degree stainless steel gooseneck with memory sheath',
      'Integrated mute switch and gold-plated quick-disconnect plug'
    ],
    status: 'ACTIVE',
    position: [-0.025, -0.165, 0.11],
    explodedOffset: [-0.08, -0.04, 0.12]
  },
  speakerDriver: {
    id: 'speakerDriver',
    name: 'SPEAKER DRIVER & BAFFLE',
    category: 'ACOUSTICS',
    role: 'Generates anti-phase cancellation wave + incoming tactical comms audio.',
    input: 'Class-D amplified anti-noise signal (-x̂(n)) + tactical radio voice',
    output: 'Acoustic anti-wave (-180° phase) to cancel incoming noise',
    connection: 'Internal acoustic ring baffle inside left earcup',
    technicalSpecs: [
      '40mm high-flux Neodymium (N52) dynamic transducer',
      'Composite titanium-mylar dome diaphragm for fast transient damping',
      'Frequency Bandwidth: 15 Hz – 22 kHz with zero phase smear',
      'Total Harmonic Distortion (THD): < 0.1% at 100 dB SPL'
    ],
    status: 'ACTIVE',
    position: [-0.065, -0.141, 0.001],
    explodedOffset: [-0.16, 0.02, 0]
  },
  headsetPCB: {
    id: 'headsetPCB',
    name: 'HEADSET PRE-AMP & SENSOR PCB',
    category: 'HEADSET',
    role: 'Local low-noise microphone pre-amplification and impedance buffering.',
    input: 'Raw mic capsule signals + digital audio return',
    output: 'Balanced differential analog audio lines to waist cable',
    connection: 'Secured inside left earcup behind speaker driver',
    technicalSpecs: [
      '4-layer rigid-flex FR4 board with gold immersion (ENIG) plating',
      'Ultra-low-noise differential pre-amps (0.9 nV/√Hz)',
      'TVS diode electrostatic discharge (ESD) protection on all lines',
      'EMI/RFI shielding enclosure with grounded copper pour'
    ],
    status: 'ONLINE',
    position: [-0.055, -0.141, 0.001],
    explodedOffset: [-0.18, 0, 0]
  },
  cableHarness: {
    id: 'cableHarness',
    name: 'TACTICAL INTERCONNECT CABLE',
    category: 'HARNESS',
    role: 'Carries multi-channel audio, reference mic signals, and power.',
    input: 'Headset left earcup multi-pin interface',
    output: 'Waist pouch compute enclosure circular military connector',
    connection: 'Clips to soldier shoulder strap & torso MOLLE webbing',
    technicalSpecs: [
      'Heavy-duty Kevlar-reinforced polyurethane outer jacket (6.2mm OD)',
      '10-conductor twisted pairs with individual braided foil shielding',
      'Molded right-angle strain relief boot at earcup exit',
      'Amphenol / Fischer military quick-disconnect waterproof connector'
    ],
    status: 'ONLINE',
    position: [-0.15, -0.38, 0.06],
    explodedOffset: [-0.06, 0, 0.04]
  },
  waistPouch: {
    id: 'waistPouch',
    name: 'TACTICAL WAIST POUCH',
    category: 'COMPUTE_POUCH',
    role: 'Ballistic fabric carrier holding embedded compute and battery hardware.',
    input: 'Headset cable input & external battery charging',
    output: 'Physical protection and thermal dissipation',
    connection: 'MOLLE / PALS webbing attached to soldier combat duty belt',
    technicalSpecs: [
      '1000D Cordura ballistic nylon with IRR (Infra-Red Reflective) coating',
      'Heavy-duty dual YKK weatherproof silent zippers with paracord pulls',
      'Laser-cut ventilation grommets for passive electronics cooling',
      'Internal shock-isolated aluminum equipment cage'
    ],
    status: 'ONLINE',
    position: [-0.20, -0.72, 0.06],
    explodedOffset: [-0.05, -0.18, 0.22]
  },
  raspberryPi: {
    id: 'raspberryPi',
    name: 'RASPBERRY PI EMBEDDED CONTROLLER',
    category: 'COMPUTE_POUCH',
    role: 'Central tactical compute: AI noise classification, network comms, telemetry.',
    input: 'Digitized audio streams & sensor telemetry via high-speed SPI/I2S',
    output: 'AI noise classification (YAMNet) & supervisory parameters to DSP',
    connection: 'Top board in waist pouch electronics stack',
    technicalSpecs: [
      'Quad-core 64-bit ARM Cortex-A76 processor @ 2.4 GHz',
      'Hardware-accelerated YAMNet neural network noise classification',
      'DeepFilterNet2 real-time AI speech enhancement engine',
      'Gigabit Ethernet, dual USB 3.0, 40-pin GPIO header, micro-HDMI',
      'Passive aluminum alloy heatsink chassis with thermal conductive pads'
    ],
    status: 'ACTIVE',
    position: [-0.20, -0.66, 0.08],
    explodedOffset: [-0.05, 0.38, 0.16]
  },
  audioInterface: {
    id: 'audioInterface',
    name: 'AUDIO INTERFACE / ADC-DAC SECTION',
    category: 'COMPUTE_POUCH',
    role: 'Precision multi-channel analog-to-digital and digital-to-analog conversion.',
    input: 'Differential analog mic pairs (Reference Mic, Error Mic, Boom Mic)',
    output: 'High-speed I2S / TDM digital audio streams to DSP and Raspberry Pi',
    connection: 'Directly bridges cable harness connector and DSP coprocessor',
    technicalSpecs: [
      'Multi-channel 32-bit / 192 kHz audiophile codec (120 dB Dynamic Range)',
      'Ultra-low phase jitter master clock oscillator (< 1 ps)',
      'Differential EMI-shielded analog pre-amp circuitry',
      'Hardware peak limiter and acoustic blast transient suppression'
    ],
    status: 'ONLINE',
    position: [-0.20, -0.68, 0.06],
    explodedOffset: [-0.05, 0.22, 0.12]
  },
  dspModule: {
    id: 'dspModule',
    name: 'DSP / ANC PROCESSOR MODULE',
    category: 'COMPUTE_POUCH',
    role: 'Deterministic hard real-time active noise cancellation (FxLMS/NLMS).',
    input: 'Analog reference mic x(n) and error mic e(n) via ultra-low latency ADC',
    output: 'Anti-noise cancellation signal (-x̂(n)) to Class-D amplifier',
    connection: 'Stacked below Raspberry Pi on precision standoffs',
    technicalSpecs: [
      'Dual-core 32-bit Floating-Point DSP core @ 600 MHz',
      'Dedicated Filtered-X Least Mean Squares (FxLMS) adaptive filter engine',
      'End-to-end analog-to-analog acoustic latency: < 0.8 milliseconds',
      '24-bit / 96 kHz high-dynamic-range delta-sigma ADC and DAC (114 dB SNR)'
    ],
    status: 'ACTIVE',
    position: [-0.20, -0.68, 0.06],
    explodedOffset: [-0.05, 0.05, 0.06]
  },
  powerModule: {
    id: 'powerModule',
    name: 'TACTICAL POWER & BATTERY MODULE',
    category: 'COMPUTE_POUCH',
    role: 'Regulated power distribution for Raspberry Pi, DSP, and headset amplifiers.',
    input: 'Dual 21700 Li-Ion cells (7.4V nominal, 10,000 mAh)',
    output: 'Isolated +5.1V / 5A (Pi), +3.3V (DSP), ±9V (Headset Analog)',
    connection: 'Bottom chassis section of waist pouch enclosure',
    technicalSpecs: [
      'Smart Battery Management System (BMS) with over-current/temp protection',
      'High-efficiency synchronous buck-boost DC-DC regulators (>94% efficiency)',
      '40-hour operational runtime on single hot-swappable charge pack'
    ],
    status: 'ONLINE',
    position: [-0.20, -0.68, 0.06],
    explodedOffset: [-0.05, -0.22, 0.04]
  }
};
