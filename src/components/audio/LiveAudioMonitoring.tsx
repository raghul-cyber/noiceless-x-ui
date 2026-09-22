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
            const outColor = store.isProcessingActive ? '#00e599' : '#f59e0b';
            drawOscilloscope(
              ctx, 
              cvs.width, 
              cvs.height, 
              outputBuffer, 
              outColor, // Tactical Mint / Pure Clean or Amber if bypassed
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
    // Clear background to recessed well
    ctx.fillStyle = '#020604';
    ctx.fillRect(0, 0, width, height);

    // Draw precision oscilloscope graticule grid
    ctx.strokeStyle = 'rgba(20, 53, 38, 0.6)';
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

    // Center reference zero-crossing line with subtle phosphor glow
    const midY = height / 2;
    ctx.strokeStyle = 'rgba(0, 229, 153, 0.18)';
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Draw subtle area fill below waveform
    ctx.beginPath();
    const sliceWidth = width / buffer.length;
    let x = 0;
    for (let i = 0; i < buffer.length; i++) {
      const v = buffer[i] * 1.8;
      const y = midY + v * (height * 0.42);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.lineTo(width, midY);
    ctx.lineTo(0, midY);
    ctx.closePath();
    ctx.fillStyle = isInput 
      ? 'rgba(245, 158, 11, 0.05)' 
      : (store.isProcessingActive ? 'rgba(0, 229, 153, 0.08)' : 'rgba(245, 158, 11, 0.05)');
    ctx.fill();

    // Draw main Waveform line
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = primaryColor;
    ctx.beginPath();
    x = 0;
    for (let i = 0; i < buffer.length; i++) {
      const v = buffer[i] * 1.8;
      const y = midY + v * (height * 0.42);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();

    // Draw dBFS level meter bar on the right edge
    const meterWidth = 5;
    const meterX = width - meterWidth - 4;
    const normLevel = Math.max(0, Math.min(1, (dbLevel + 60) / 60)); // -60dB to 0dB range
    const meterHeight = height * 0.85;
    const meterY = midY - meterHeight / 2;

    ctx.fillStyle = '#06110b';
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

    const fillHeight = meterHeight * normLevel;
    const fillY = meterY + (meterHeight - fillHeight);

    const gradient = ctx.createLinearGradient(0, meterY + meterHeight, 0, meterY);
    gradient.addColorStop(0, '#059669');
    gradient.addColorStop(0.65, '#00e599');
    gradient.addColorStop(0.85, '#f59e0b');
    gradient.addColorStop(1, '#ff3b5c');

    ctx.fillStyle = gradient;
    ctx.fillRect(meterX, fillY, meterWidth, fillHeight);
  };

  return (
    <section className="bg-[#08140e] border border-[#143526] rounded-md overflow-hidden flex flex-col shadow-lg">
      {/* Panel Header */}
      <div className="h-9 px-3.5 bg-[#0a1a12] border-b border-[#143526] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <Activity className="w-3.5 h-3.5 text-[#00e599]" />
          <h2 className="text-[11px] font-mono font-bold tracking-widest text-[#f0fdf4] uppercase">
            REAL-TIME AUDIO MONITORING // DUAL OSCILLOSCOPE
          </h2>
        </div>

        <div className="flex items-center space-x-3 font-mono text-[11px]">
          <div className="flex items-center space-x-1 bg-[#06100b] px-2 py-0.5 rounded-[2px] border border-[#143526] text-[#8ba695]">
            <span className="text-[9px] text-[#4e6a5b]">SWEEP:</span>
            <button 
              onClick={() => setTimebaseMs(10)} 
              className={`px-1 rounded-[2px] ${timebaseMs === 10 ? 'text-[#00e599] font-bold bg-[#00e599]/10' : 'hover:text-[#f0fdf4]'}`}
            >
              10ms
            </button>
            <span className="text-[#143526]">/</span>
            <button 
              onClick={() => setTimebaseMs(25)} 
              className={`px-1 rounded-[2px] ${timebaseMs === 25 ? 'text-[#00e599] font-bold bg-[#00e599]/10' : 'hover:text-[#f0fdf4]'}`}
            >
              25ms
            </button>
            <span className="text-[#143526]">/</span>
            <button 
              onClick={() => setTimebaseMs(50)} 
              className={`px-1 rounded-[2px] ${timebaseMs === 50 ? 'text-[#00e599] font-bold bg-[#00e599]/10' : 'hover:text-[#f0fdf4]'}`}
            >
              50ms
            </button>
          </div>

          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className={`px-2 py-0.5 rounded-[2px] border text-[11px] flex items-center space-x-1.5 transition-all ${
              isFrozen 
                ? 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#f59e0b]' 
                : 'bg-[#06100b] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#1e4a36]'
            }`}
            title="Freeze Oscilloscope Frame"
          >
            {isFrozen ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span className="font-semibold">{isFrozen ? 'FROZEN' : 'LIVE'}</span>
          </button>
        </div>
      </div>

      {/* Main Monitoring Body: Input Waveform + Processing Pipeline Node + Output Waveform */}
      <div className="p-3.5 grid grid-cols-1 lg:grid-cols-[1fr_120px_1fr] gap-3 items-center">
        {/* INPUT: NOISY AUDIO */}
        <div className="border border-[#143526] rounded-[3px] bg-[#040a07] p-3 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
              <span className="font-mono text-xs font-bold text-[#f0fdf4] tracking-wider">
                CH-A // RAW NOISY INPUT
              </span>
            </div>
            <div className="font-mono text-[11px] text-[#8ba695] flex items-center space-x-2">
              <span className="text-[#4e6a5b]">PEAK:</span>
              <span className="text-[#f59e0b] font-semibold">{store.telemetry.inputDb.toFixed(1)} dBFS</span>
            </div>
          </div>

          {/* Oscilloscope Canvas */}
          <div className="relative w-full h-36 bg-[#020604] rounded-[2px] overflow-hidden border border-[#143526]">
            <canvas 
              ref={inputCanvasRef} 
              width={480} 
              height={144} 
              className="w-full h-full block"
            />
            {/* Overlay Grid Coordinate Labels */}
            <div className="absolute top-1.5 left-2 font-mono text-[9px] text-[#4e6a5b] pointer-events-none">
              +6 dB
            </div>
            <div className="absolute bottom-1.5 left-2 font-mono text-[9px] text-[#4e6a5b] pointer-events-none">
              -60 dBFS
            </div>
            <div className="absolute top-1.5 right-6 font-mono text-[9px] text-[#f59e0b]/80 pointer-events-none">
              NOISE FLOOR: -28 dB
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#8ba695]">
            <span>TRANSDUCER: BOOM MIC CH1</span>
            <span className="text-[#4e6a5b]">BW: 20 Hz - 20 kHz</span>
          </div>
        </div>

        {/* PROCESSING PIPELINE VISUAL BRIDGE */}
        <div className="flex flex-col items-center justify-center p-2 rounded-[3px] bg-[#07130d] border border-[#143526] h-full space-y-2.5">
          <div className="text-[9px] font-mono text-[#4e6a5b] uppercase tracking-widest text-center">
            DSP BRIDGE
          </div>

          <div className="w-full flex items-center justify-center">
            <div className={`p-2.5 rounded-[2px] border text-center transition-all w-full ${
              store.isProcessingActive 
                ? 'bg-[#0a2318] border-[#00e599]/40 text-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.15)]' 
                : 'bg-[#1a1306] border-[#f59e0b]/40 text-[#f59e0b]'
            }`}>
              <Zap className={`w-4 h-4 mx-auto mb-1 ${store.isProcessingActive ? 'animate-pulse text-[#00e599]' : 'text-[#f59e0b]'}`} />
              <div className="font-mono text-[10px] font-bold">RNNNOISE</div>
              <div className="text-[9px] font-mono opacity-80 mt-0.5">22 BANDS</div>
            </div>
          </div>

          {/* Animated Signal Direction Indicator */}
          <div className="flex items-center space-x-1 text-[#4e6a5b]">
            <ArrowRight className={`w-4 h-4 ${store.isProcessingActive ? 'text-[#00e599] animate-pulse' : 'text-[#4e6a5b]'}`} />
          </div>

          <div className="text-center font-mono">
            <span className="text-[9px] text-[#4e6a5b] block">ATTENUATION</span>
            <span className="text-xs font-bold text-[#00e599]">
              {store.isProcessingActive ? `-${store.telemetry.noiseReductionDb} dB` : '0 dB'}
            </span>
          </div>
        </div>

        {/* OUTPUT: ENHANCED AUDIO */}
        <div className="border border-[#143526] rounded-[3px] bg-[#040a07] p-3 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${store.isProcessingActive ? 'bg-[#00e599] animate-pulse shadow-[0_0_6px_#00e599]' : 'bg-[#f59e0b]'}`} />
              <span className="font-mono text-xs font-bold text-[#f0fdf4] tracking-wider">
                CH-B // ENHANCED RESIDUAL
              </span>
            </div>
            <div className="font-mono text-[11px] text-[#8ba695] flex items-center space-x-2">
              <span className="text-[#4e6a5b]">PEAK:</span>
              <span className={`font-semibold ${store.isProcessingActive ? 'text-[#00e599]' : 'text-[#f59e0b]'}`}>
                {store.telemetry.outputDb.toFixed(1)} dBFS
              </span>
            </div>
          </div>

          {/* Oscilloscope Canvas */}
          <div className="relative w-full h-36 bg-[#020604] rounded-[2px] overflow-hidden border border-[#143526]">
            <canvas 
              ref={outputCanvasRef} 
              width={480} 
              height={144} 
              className="w-full h-full block"
            />
            {/* Overlay Grid Coordinate Labels */}
            <div className="absolute top-1.5 left-2 font-mono text-[9px] text-[#4e6a5b] pointer-events-none">
              +6 dB
            </div>
            <div className="absolute bottom-1.5 left-2 font-mono text-[9px] text-[#4e6a5b] pointer-events-none">
              -60 dBFS
            </div>
            <div className="absolute top-1.5 right-6 font-mono text-[9px] text-[#00e599]/90 pointer-events-none">
              {store.isProcessingActive ? 'CLEAN VOICE RESIDUAL' : 'BYPASS ACTIVE'}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-[#8ba695]">
            <span>DEST: EARPIECE / MESH STREAM</span>
            <span className="text-[#00e599] font-semibold">SNR: +{store.telemetry.snrOutput} dB</span>
          </div>
        </div>
      </div>
    </section>
  );
};
