import { NoiseScenarioId } from '../types/simulation';

// Realistic Web Audio synthesizer for ambient battlefield environments and tactical voice
class TacticalAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private ancFilter: BiquadFilterNode | null = null;
  private activeNoiseSource: AudioBufferSourceNode | null = null;
  private isInitialized = false;

  public init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ancFilter = this.ctx.createBiquadFilter();
      this.ancFilter.type = 'lowpass';
      this.ancFilter.frequency.setValueAtTime(450, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      this.voiceGain = this.ctx.createGain();
      this.voiceGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      this.noiseGain.connect(this.ancFilter);
      this.ancFilter.connect(this.masterGain);
      this.voiceGain.connect(this.masterGain);

      this.isInitialized = true;
    } catch {
      console.warn('Web Audio not supported in this environment');
    }
  }

  public updateScenario(scenario: NoiseScenarioId, isMuted: boolean, volume: number, ancActive: boolean) {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended' && !isMuted) {
      this.ctx.resume();
    }

    if (this.masterGain) {
      const targetGain = isMuted ? 0.0 : volume * 0.4;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }

    if (this.ancFilter && this.noiseGain) {
      if (ancActive) {
        // High attenuation of environmental noise
        this.ancFilter.frequency.setTargetAtTime(180, this.ctx.currentTime, 0.1);
        this.noiseGain.gain.setTargetAtTime(0.08, this.ctx.currentTime, 0.1);
      } else {
        // Raw loud unfiltered noise
        this.ancFilter.frequency.setTargetAtTime(6000, this.ctx.currentTime, 0.1);
        this.noiseGain.gain.setTargetAtTime(0.55, this.ctx.currentTime, 0.1);
      }
    }

    if (!isMuted) {
      this.generateNoiseForScenario(scenario);
    }
  }

  private generateNoiseForScenario(scenario: NoiseScenarioId) {
    if (!this.ctx || !this.noiseGain) return;

    if (this.activeNoiseSource) {
      try {
        this.activeNoiseSource.stop();
        this.activeNoiseSource.disconnect();
      } catch {
        // Source might already be stopped
      }
    }

    const duration = 2.0;
    const sampleRate = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (scenario) {
        case 'helicopter':
          // Low rotor blade thrum (24 Hz) + turbine drone
          sample = Math.sin(2 * Math.PI * 24 * t) * Math.sin(2 * Math.PI * 4 * t) * 0.6 +
                   (Math.random() * 2 - 1) * 0.15;
          break;
        case 'gunshots':
          // Periodic sharp impulse blast
          const impulse = (t % 0.5 < 0.05) ? (Math.random() * 2 - 1) * Math.exp(-(t % 0.5) * 50) : (Math.random() * 2 - 1) * 0.02;
          sample = impulse;
          break;
        case 'vehicle':
          // Heavy diesel engine harmonic rumble
          sample = Math.sin(2 * Math.PI * 65 * t) * 0.4 +
                   Math.sin(2 * Math.PI * 130 * t) * 0.2 +
                   (Math.random() * 2 - 1) * 0.2;
          break;
        case 'wind':
          // Broadband pink noise gusts
          sample = (Math.random() * 2 - 1) * (0.3 + 0.2 * Math.sin(2 * Math.PI * 0.5 * t));
          break;
        default:
          sample = (Math.random() * 2 - 1) * 0.2;
      }
      data[i] = sample;
    }

    this.activeNoiseSource = this.ctx.createBufferSource();
    this.activeNoiseSource.buffer = buffer;
    this.activeNoiseSource.loop = true;
    this.activeNoiseSource.connect(this.noiseGain);
    this.activeNoiseSource.start();
  }

  public playTacticalChime() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

export const audioSynthesizer = new TacticalAudioSynthesizer();
