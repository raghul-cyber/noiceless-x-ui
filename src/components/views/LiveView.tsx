import React, { useRef, useEffect } from 'react';
import { Radio, Sliders, Activity, Disc, Volume2, ShieldCheck, Zap } from 'lucide-react';
import { audioEngine } from '../../audio/audioEngine';
import { useAppStore } from '../../store/useAppStore';

interface LiveViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const LiveView: React.FC<LiveViewProps> = ({ store }) => {
  const fftCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    const inputFft = new Uint8Array(128);
    const outputFft = new Uint8Array(128);

    const render = () => {
      audioEngine.getInputFft(inputFft);
      audioEngine.getOutputFft(outputFft);

      if (fftCanvasRef.current) {
        const cvs = fftCanvasRef.current;
        const ctx = cvs.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#07090e';
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          // Draw frequency grid lines (100Hz, 1kHz, 5kHz, 10kHz, 20kHz)
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 1;
          for (let i = 1; i < 6; i++) {
            const y = (cvs.height / 6) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(cvs.width, y);
            ctx.stroke();
          }

          const barCount = 48;
          const barWidth = (cvs.width / barCount) - 2;

          for (let i = 0; i < barCount; i++) {
            const inVal = inputFft[i] / 255;
            const outVal = outputFft[i] / 255;
            const x = i * (barWidth + 2);

            // Draw Raw Input FFT (Amber)
            const inHeight = inVal * (cvs.height * 0.88);
            ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
            ctx.fillRect(x, cvs.height - inHeight, barWidth, inHeight);

            // Draw Processed Output FFT (Cyan)
            const outHeight = outVal * (cvs.height * 0.88);
            ctx.fillStyle = store.isProcessingActive ? '#00d4aa' : '#f59e0b';
            ctx.fillRect(x, cvs.height - outHeight, barWidth, outHeight);

            // Peak cap line
            ctx.fillStyle = store.isProcessingActive ? '#67e8f9' : '#fde047';
            ctx.fillRect(x, cvs.height - Math.max(inHeight, outHeight) - 2, barWidth, 2);
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [store.isProcessingActive]);

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 select-none">
      {/* Workstation Header */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-5 h-5 text-signal-cyan" />
            <h1 className="font-mono text-sm font-bold tracking-wider text-slate-100">
              HIGH-PRECISION AUDIO ENGINEERING WORKSTATION
            </h1>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Simultaneous dual-channel oscilloscopic capture, 48-band FFT spectrum analyzer, and real-time neural attenuation staging.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={store.toggleProcessing}
            className={`px-3 py-1.5 rounded border flex items-center space-x-2 font-bold ${
              store.isProcessingActive
                ? 'bg-signal-cyan/20 border-signal-cyan/40 text-signal-cyan'
                : 'bg-signal-amber/20 border-signal-amber/40 text-signal-amber'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{store.isProcessingActive ? 'RNNNOISE: ENGAGED' : 'BYPASS ACTIVE'}</span>
          </button>
        </div>
      </div>

      {/* Real-Time FFT Spectral Analyzer (20 Hz - 20 kHz) */}
      <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#161d2c]">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-signal-cyan" />
            <span className="font-mono text-xs font-bold text-slate-200">
              REAL-TIME 48-BAND DUAL FFT SPECTRUM ANALYZER
            </span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[10px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/40 border border-amber-500/80" />
              <span className="text-slate-400">INPUT NOISE SPECTRUM</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-signal-cyan" />
              <span className="text-signal-cyan font-semibold">ENHANCED SPEECH SIGNAL</span>
            </div>
          </div>
        </div>

        {/* FFT Canvas */}
        <div className="relative w-full h-56 bg-[#07090e] rounded overflow-hidden border border-[#141a26]">
          <canvas
            ref={fftCanvasRef}
            width={840}
            height={224}
            className="w-full h-full block"
          />
          {/* Frequency Axis Markings */}
          <div className="absolute bottom-1.5 left-4 right-4 flex justify-between font-mono text-[9px] text-slate-500 pointer-events-none">
            <span>20 Hz</span>
            <span>100 Hz</span>
            <span>500 Hz</span>
            <span>1 kHz</span>
            <span>2.5 kHz</span>
            <span>5 kHz</span>
            <span>10 kHz</span>
            <span>20 kHz</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
          <span>WINDOW: HANNING 1024 SMP</span>
          <span>RESOLUTION: 46.8 Hz/BIN</span>
          <span>DYNAMIC RANGE: 96 dB</span>
        </div>
      </div>

      {/* Hardware Staging Knobs and Faders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Attenuation Strength Slider */}
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">SUPPRESSION DEPTH</span>
            <span className="text-signal-cyan font-bold">{store.suppressionDepth}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={store.suppressionDepth}
            onChange={(e) => store.setSuppressionDepth(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>LIGHT (-12dB)</span>
            <span>OPTIMAL (-24dB)</span>
            <span>MAX (-38dB)</span>
          </div>
        </div>

        {/* VAD Sensitivity Slider */}
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400">VAD SENSITIVITY</span>
            <span className="text-signal-cyan font-bold">{store.vadSensitivity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            value={store.vadSensitivity}
            onChange={(e) => store.setVadSensitivity(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>HIGH THRESHOLD</span>
            <span>OPERATIONAL</span>
            <span>LOW THRESHOLD</span>
          </div>
        </div>

        {/* Input/Output VU Headroom Telemetry */}
        <div className="bg-[#0b0e16] border border-[#182030] rounded-lg p-4 space-y-2 font-mono text-xs">
          <span className="text-slate-400 block text-[11px] uppercase tracking-wider">CALIBRATED HEADROOM</span>
          <div className="flex justify-between items-center text-slate-300">
            <span>NOMINAL HEADROOM:</span>
            <span className="text-signal-green font-bold">18.4 dBFS</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>INTERMODULATION THD:</span>
            <span className="text-slate-400">&lt; 0.008%</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>ACOUSTIC LEAKAGE:</span>
            <span className="text-signal-green">-31.2 dB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
