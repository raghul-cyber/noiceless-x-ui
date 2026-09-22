import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Activity, CheckCircle2, Zap, Volume2, Shield, Radio } from 'lucide-react';
import { useViewerStore } from '../../store/useViewerStore';
import { getNoiseScenario } from '../../data/scenariosData';

interface OscilloscopePanelProps {
  standalone?: boolean;
}

export const OscilloscopePanel: React.FC<OscilloscopePanelProps> = ({ standalone = false }) => {
  const {
    noiseScenario,
    noiseIntensity,
    ancActive,
    voiceActive,
    simulationRunning,
    workflowStep,
    customDataset
  } = useViewerStore();

  const [activeScopeView, setActiveScopeView] = useState<'multi' | 'nullZone' | 'fft'>('multi');

  const cvsMultiRef = useRef<HTMLCanvasElement>(null);
  const cvsNullRef = useRef<HTMLCanvasElement>(null);
  const cvsFftRef = useRef<HTMLCanvasElement>(null);

  const scenarioConfig = getNoiseScenario(noiseScenario, customDataset);

  useEffect(() => {
    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.09;

      // 1. Multi-Trace 4-Channel Live Oscilloscope
      if (cvsMultiRef.current && activeScopeView === 'multi') {
        const cvs = cvsMultiRef.current;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, cvs.width, cvs.height);

          // Grid lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 1;
          for (let y = 20; y < cvs.height; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(cvs.width, y);
            ctx.stroke();
          }

          const amp = (noiseIntensity / 100) * 16;

          // Trace A: Raw Ambient Noise (Red/Rose)
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x < cvs.width; x++) {
            const freq = x * 0.09 + t;
            const y = 30 + Math.sin(freq * 1.6) * amp + Math.cos(freq * 3.4) * (amp * 0.4) + (Math.random() - 0.5) * 4;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Trace B: 180° Inverted Anti-Noise (Sky Blue)
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x < cvs.width; x++) {
            const freq = x * 0.09 + t;
            const y = 75 + (ancActive ? Math.sin(freq * 1.6 + Math.PI) * amp * 0.96 + Math.cos(freq * 3.4 + Math.PI) * (amp * 0.4) : 0);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Trace C: Ear Cavity Superposition Result (Emerald if ANC on, Rose if off)
          ctx.strokeStyle = ancActive ? '#10b981' : '#f43f5e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let x = 0; x < cvs.width; x++) {
            const freq = x * 0.09 + t;
            const raw = Math.sin(freq * 1.6) * amp + Math.cos(freq * 3.4) * (amp * 0.4);
            const anti = ancActive ? Math.sin(freq * 1.6 + Math.PI) * amp * 0.96 + Math.cos(freq * 3.4 + Math.PI) * (amp * 0.4) : 0;
            const y = 120 + (raw + anti) + (Math.random() - 0.5) * (ancActive ? 1.5 : 5);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Trace D: DeepFilterNet2 Processed Radio Output (Neon Green Speech)
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let x = 0; x < cvs.width; x++) {
            let y = 165;
            if (voiceActive) {
              y += Math.sin(x * 0.08 + t * 0.9) * 14 + Math.sin(x * 0.16 + t * 0.4) * 5;
            } else {
              y += (Math.random() - 0.5) * 1.2;
            }
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // 2. Destructive Superposition Collision Detail View
      if (cvsNullRef.current && activeScopeView === 'nullZone') {
        const cvs = cvsNullRef.current;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, cvs.width, cvs.height);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, cvs.height / 2);
          ctx.lineTo(cvs.width, cvs.height / 2);
          ctx.stroke();

          const amp = (noiseIntensity / 100) * 32;

          // Incoming Noise (Dotted Red)
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let x = 0; x < cvs.width; x++) {
            const y = cvs.height / 2 + Math.sin(x * 0.06 + t) * amp;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // 180° Anti-Noise (Dotted Blue)
          ctx.strokeStyle = '#00e5ff';
          ctx.beginPath();
          for (let x = 0; x < cvs.width; x++) {
            const y = cvs.height / 2 + (ancActive ? Math.sin(x * 0.06 + t + Math.PI) * amp * 0.97 : 0);
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Destructive Superposition Result (Solid Bold Green)
          ctx.setLineDash([]);
          ctx.strokeStyle = ancActive ? '#10b981' : '#f43f5e';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          for (let x = 0; x < cvs.width; x++) {
            const inY = Math.sin(x * 0.06 + t) * amp;
            const antiY = ancActive ? Math.sin(x * 0.06 + t + Math.PI) * amp * 0.97 : 0;
            const resY = inY + antiY + (Math.random() - 0.5) * (ancActive ? 1.5 : 8);
            const y = cvs.height / 2 + resY;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      // 3. Real-Time FFT Spectral Power Density Bars
      if (cvsFftRef.current && activeScopeView === 'fft') {
        const cvs = cvsFftRef.current;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, cvs.width, cvs.height);

          const barCount = 32;
          const barWidth = (cvs.width / barCount) - 2;

          for (let i = 0; i < barCount; i++) {
            const freqNorm = i / barCount;
            // Simulated FFT peaks
            const baseNoise = Math.sin(freqNorm * 8 + t * 2) * 15 + 30;
            const attenuation = ancActive ? Math.max(0.1, 1 - Math.exp(-freqNorm * 4)) : 1.0;
            const h = Math.min(cvs.height - 10, baseNoise * attenuation * (noiseIntensity / 80));

            const x = i * (barWidth + 2);
            const y = cvs.height - h;

            // Gradient fill
            const grad = ctx.createLinearGradient(0, cvs.height, 0, y);
            grad.addColorStop(0, '#00e5ff');
            grad.addColorStop(1, ancActive ? '#10b981' : '#f43f5e');

            ctx.fillStyle = grad;
            ctx.fillRect(x, y, barWidth, h);
          }
        }
      }

      if (simulationRunning) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeScopeView, noiseScenario, noiseIntensity, ancActive, voiceActive, simulationRunning]);

  const containerClass = standalone
    ? 'absolute bottom-24 right-6 z-20 tactical-glass p-3.5 rounded-xl border border-[#00e5ff]/25 shadow-xl max-w-md pointer-events-auto'
    : 'p-3 rounded-xl bg-[#090e17]/80 border border-[#1e293b] w-full';

  return (
    <div className={containerClass}>
      {/* Header with Sub-views */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00e5ff]" />
          <h3 className="font-tech text-xs tracking-wider text-slate-200 font-bold uppercase">
            REAL-TIME DSP OSCILLOSCOPE
          </h3>
        </div>

        {/* View Switcher: Multi-Trace | Null Zone | FFT */}
        <div className="flex items-center bg-[#070c14] p-0.5 rounded-lg border border-[#1e293b] text-[9px] font-mono">
          <button
            onClick={() => setActiveScopeView('multi')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeScopeView === 'multi'
                ? 'bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            4-CHANNEL
          </button>
          <button
            onClick={() => setActiveScopeView('nullZone')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeScopeView === 'nullZone'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            180° NULL ZONE
          </button>
          <button
            onClick={() => setActiveScopeView('fft')}
            className={`px-2 py-0.5 rounded font-bold transition-all ${
              activeScopeView === 'fft'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            FFT SPECTRUM
          </button>
        </div>
      </div>

      {/* Scope Canvas Area */}
      <div className="w-full bg-[#04060a] rounded-lg border border-[#19273c] p-2 relative overflow-hidden">
        {activeScopeView === 'multi' && (
          <div>
            <canvas ref={cvsMultiRef} width={380} height={190} className="w-full h-44" />
            {/* Channel Legend Tags */}
            <div className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-[#121c2c] text-[8px] font-mono">
              <div className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>CH1: AMBIENT REF MIC x[n] ({scenarioConfig.splDb} dB)</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>CH2: SPEAKER ANTI-NOISE -x̂[n] (180° Phase)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>CH3: EAR CANAL RESIDUAL e[n] (-34.6 dB Null)</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>CH4: AI SPEECH RADIO OUT s[n] (Clear Voice)</span>
              </div>
            </div>
          </div>
        )}

        {activeScopeView === 'nullZone' && (
          <div>
            <canvas ref={cvsNullRef} width={380} height={150} className="w-full h-36" />
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#121c2c] text-[8px] font-mono">
              <div className="flex items-center gap-2">
                <span className="text-rose-400">--- NOISE</span>
                <span className="text-cyan-400">--- 180° ANTI-NOISE</span>
                <span className="text-emerald-400 font-bold">― SUPERPOSITION NULL</span>
              </div>
              <div className="text-emerald-400 font-bold">
                ATTENUATION: {ancActive ? (customDataset ? `-${customDataset.summary.avgAttenuationDb.toFixed(1)} dB` : '-34.6 dB') : '0.0 dB'}
              </div>
            </div>
          </div>
        )}

        {activeScopeView === 'fft' && (
          <div>
            <canvas ref={cvsFftRef} width={380} height={150} className="w-full h-36" />
            <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#121c2c] text-[8px] font-mono">
              <span className="text-slate-400">20 Hz</span>
              <span className="text-slate-400">250 Hz (FxLMS Notch)</span>
              <span className="text-slate-400">1 kHz</span>
              <span className="text-slate-400">4 kHz</span>
              <span className="text-slate-400">8 kHz</span>
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer Badge */}
      <div className="flex items-center justify-between mt-2 text-[9px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-[#00e5ff]" />
          <span>HARMONIC THD: &lt; 0.12%</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-bold">
          <CheckCircle2 className="w-3 h-3" />
          <span>REAL-TIME LATENCY: 0.82 ms</span>
        </div>
      </div>
    </div>
  );
};
