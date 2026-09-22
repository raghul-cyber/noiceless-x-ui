import React, { useRef, useEffect, useState } from 'react';
import { Activity, ArrowRight, Zap, Shield, Eye, Pause, Play } from 'lucide-react';
import { audioEngine } from '../../audio/audioEngine';
import { useAppStore } from '../../store/useAppStore';

interface LiveAudioMonitoringProps {
  store: ReturnType<typeof useAppStore>;
}

export const LiveAudioMonitoring: React.FC<LiveAudioMonitoringProps> = ({ store }) => {
  const inputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [timebaseMs, setTimebaseMs] = useState<number>(25);

  useEffect(() => {
    let animId: number;
    const inputBuffer = new Float32Array(512);
    const outputBuffer = new Float32Array(512);

    const render = () => {
      if (!isFrozen) {
        // Fetch audio PCM time domain buffers from real Web Audio API analysers
        audioEngine.getInputWaveform(inputBuffer);
        audioEngine.getOutputWaveform(outputBuffer);

        // Draw Input Canvas
        if (inputCanvasRef.current) {
          const cvs = inputCanvasRef.current;
          const ctx = cvs.getContext('2d');
          if (ctx) {
            drawOscilloscope(
              ctx, 
              cvs.width, 
              cvs.height, 
              inputBuffer, 
              '#f59e0b', // Studio Amber / Noisy
              '#ef4444',
              true,
              store.telemetry.inputDb
            );
          }
        }

        // Draw Output Canvas
        if (outputCanvasRef.current) {
          const cvs = outputCanvasRef.current;
          const ctx = cvs.getContext('2d');
          if (ctx) {
            const outColor = store.isProcessingActive ? '#00d4aa' : '#f59e0b';
            drawOscilloscope(
              ctx, 
              cvs.width, 
              cvs.height, 
              outputBuffer, 
              outColor, // Signal Cyan / Pure Clean or Amber if bypassed
              '#10b981',
              false,
              store.telemetry.outputDb
            );
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [isFrozen, store.isProcessingActive, store.telemetry.inputDb, store.telemetry.outputDb]);

  const drawOscilloscope = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    buffer: Float32Array,
    primaryColor: string,
    peakColor: string,
    isInput: boolean,
    dbLevel: number
  ) => {
    // Clear background
    ctx.fillStyle = '#080b11';
    ctx.fillRect(0, 0, width, height);

    // Draw precision oscilloscope graticule grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Horizontal division lines (-18dB, -12dB, -6dB, 0dB, +6dB)
    const yDivisions = 6;
    for (let i = 1; i < yDivisions; i++) {
      const y = (height / yDivisions) * i;
      ctx.beginPath();
      ctx.setLineDash(i === yDivisions / 2 ? [] : [2, 4]);
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Vertical time division lines
    const xDivisions = 8;
    for (let i = 1; i < xDivisions; i++) {
      const x = (width / xDivisions) * i;
      ctx.beginPath();
      ctx.setLineDash([2, 4]);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    ctx.setLineDash([]); // Reset line dash

    // Center reference zero-crossing line
    const midY = height / 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Draw Waveform Glow Layer (subtle, clean, not blurry neon)
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = primaryColor;
    ctx.beginPath();

    const sliceWidth = width / buffer.length;
    let x = 0;

    for (let i = 0; i < buffer.length; i++) {
      const v = buffer[i] * 1.8; // Normalized gain scaling
      const y = midY + v * (height * 0.42);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.stroke();

    // Draw dBFS level meter bar on the right edge
    const meterWidth = 6;
    const meterX = width - meterWidth - 4;
    const normLevel = Math.max(0, Math.min(1, (dbLevel + 60) / 60)); // -60dB to 0dB range
    const meterHeight = height * 0.85;
    const meterY = midY - meterHeight / 2;

    ctx.fillStyle = '#141a26';
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

    const fillHeight = meterHeight * normLevel;
    const fillY = meterY + (meterHeight - fillHeight);

    const gradient = ctx.createLinearGradient(0, meterY + meterHeight, 0, meterY);
    gradient.addColorStop(0, '#10b981');
    gradient.addColorStop(0.7, '#f59e0b');
    gradient.addColorStop(1, '#ef4444');

    ctx.fillStyle = gradient;
    ctx.fillRect(meterX, fillY, meterWidth, fillHeight);
  };

  return (
    <section className="bg-[#0b0e16] border border-[#182030] rounded-lg overflow-hidden flex flex-col">
      {/* Panel Header */}
      <div className="h-10 px-4 bg-[#090c13] border-b border-[#182030] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-4 h-4 text-signal-cyan" />
          <h2 className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            REAL-TIME AUDIO MONITORING
          </h2>
        </div>

        <div className="flex items-center space-x-3 font-mono text-[11px]">
          <div className="flex items-center space-x-1 bg-[#121824] px-2 py-0.5 rounded border border-[#1e273a] text-slate-400">
            <span>TIMEBASE:</span>
            <button 
              onClick={() => setTimebaseMs(10)} 
              className={`px-1 rounded ${timebaseMs === 10 ? 'text-signal-cyan font-bold' : 'hover:text-slate-200'}`}
            >
              10ms
            </button>
            <span>/</span>
            <button 
              onClick={() => setTimebaseMs(25)} 
              className={`px-1 rounded ${timebaseMs === 25 ? 'text-signal-cyan font-bold' : 'hover:text-slate-200'}`}
            >
              25ms
            </button>
            <span>/</span>
            <button 
              onClick={() => setTimebaseMs(50)} 
              className={`px-1 rounded ${timebaseMs === 50 ? 'text-signal-cyan font-bold' : 'hover:text-slate-200'}`}
            >
              50ms
            </button>
          </div>

          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className={`px-2 py-0.5 rounded border flex items-center space-x-1 ${
              isFrozen 
                ? 'bg-signal-amber/20 border-signal-amber/40 text-signal-amber' 
                : 'bg-[#121824] border-[#1e273a] text-slate-400 hover:text-slate-200'
            }`}
            title="Freeze Oscilloscope Frame"
          >
            {isFrozen ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span>{isFrozen ? 'FROZEN' : 'LIVE'}</span>
          </button>
        </div>
      </div>

      {/* Main Monitoring Body: Input Waveform + Processing Pipeline Node + Output Waveform */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-[1fr_120px_1fr] gap-4 items-center">
        {/* INPUT: NOISY AUDIO */}
        <div className="border border-[#182030] rounded bg-[#07090e] p-3 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-signal-amber animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
                INPUT // NOISY AUDIO
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-400 flex items-center space-x-2">
              <span className="text-slate-500">PEAK:</span>
              <span className="text-signal-amber font-semibold">{store.telemetry.inputDb.toFixed(1)} dBFS</span>
            </div>
          </div>

          {/* Oscilloscope Canvas */}
          <div className="relative w-full h-36 bg-[#080b11] rounded overflow-hidden border border-[#141a26]">
            <canvas 
              ref={inputCanvasRef} 
              width={480} 
              height={144} 
              className="w-full h-full block"
            />
            {/* Overlay Grid Coordinate Labels */}
            <div className="absolute top-1.5 left-2 font-mono text-[9px] text-slate-600 pointer-events-none">
              +6 dB
            </div>
            <div className="absolute bottom-1.5 left-2 font-mono text-[9px] text-slate-600 pointer-events-none">
              -60 dBFS
            </div>
            <div className="absolute top-1.5 right-6 font-mono text-[9px] text-amber-500/80 pointer-events-none">
              NOISE FLOOR: -28 dB
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>TRANSDUCER: BOOM MIC CH1</span>
            <span>BW: 20 Hz - 20 kHz</span>
          </div>
        </div>

        {/* PROCESSING PIPELINE VISUAL BRIDGE */}
        <div className="flex flex-col items-center justify-center p-2 rounded bg-[#090c13] border border-[#182030] h-full space-y-3">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">
            DSP PIPELINE
          </div>

          <div className="w-full flex items-center justify-center">
            <div className={`p-2.5 rounded border text-center transition-all ${
              store.isProcessingActive 
                ? 'bg-signal-cyan/10 border-signal-cyan/40 text-signal-cyan shadow-sm' 
                : 'bg-slate-800/40 border-slate-700 text-slate-400'
            }`}>
              <Zap className={`w-5 h-5 mx-auto mb-1 ${store.isProcessingActive ? 'animate-pulse text-signal-cyan' : 'text-slate-500'}`} />
              <div className="font-mono text-[11px] font-bold">RNNNOISE</div>
              <div className="text-[9px] font-mono text-slate-400 mt-0.5">22 BANDS</div>
            </div>
          </div>

          {/* Animated Signal Direction Indicator */}
          <div className="flex items-center space-x-1 text-slate-500">
            <ArrowRight className={`w-4 h-4 ${store.isProcessingActive ? 'text-signal-cyan animate-pulse' : 'text-slate-600'}`} />
          </div>

          <div className="text-center font-mono">
            <span className="text-[9px] text-slate-500 block">ATTENUATION</span>
            <span className="text-xs font-bold text-signal-cyan">
              {store.isProcessingActive ? `-${store.telemetry.noiseReductionDb} dB` : '0 dB'}
            </span>
          </div>
        </div>

        {/* OUTPUT: ENHANCED AUDIO */}
        <div className="border border-[#182030] rounded bg-[#07090e] p-3 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${store.isProcessingActive ? 'bg-signal-cyan animate-pulse' : 'bg-signal-amber'}`} />
              <span className="font-mono text-xs font-bold text-slate-200 tracking-wider">
                OUTPUT // ENHANCED AUDIO
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-400 flex items-center space-x-2">
              <span className="text-slate-500">PEAK:</span>
              <span className={`font-semibold ${store.isProcessingActive ? 'text-signal-cyan' : 'text-signal-amber'}`}>
                {store.telemetry.outputDb.toFixed(1)} dBFS
              </span>
            </div>
          </div>

          {/* Oscilloscope Canvas */}
          <div className="relative w-full h-36 bg-[#080b11] rounded overflow-hidden border border-[#141a26]">
            <canvas 
              ref={outputCanvasRef} 
              width={480} 
              height={144} 
              className="w-full h-full block"
            />
            {/* Overlay Grid Coordinate Labels */}
            <div className="absolute top-1.5 left-2 font-mono text-[9px] text-slate-600 pointer-events-none">
              +6 dB
            </div>
            <div className="absolute bottom-1.5 left-2 font-mono text-[9px] text-slate-600 pointer-events-none">
              -60 dBFS
            </div>
            <div className="absolute top-1.5 right-6 font-mono text-[9px] text-signal-cyan/80 pointer-events-none">
              {store.isProcessingActive ? 'CLEAN VOICE RESIDUAL' : 'BYPASS ACTIVE'}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>TARGET: EARPHONE / NETWORK STREAM</span>
            <span>SNR: +{store.telemetry.snrOutput} dB</span>
          </div>
        </div>
      </div>
    </section>
  );
};
