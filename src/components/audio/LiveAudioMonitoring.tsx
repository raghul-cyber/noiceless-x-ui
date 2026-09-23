import React, { useRef, useEffect, useState } from 'react';
import { Activity, ArrowRight, Zap, Shield, Eye, Pause, Play, Crosshair, Radio } from 'lucide-react';
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
        audioEngine.getInputWaveform(inputBuffer);
        audioEngine.getOutputWaveform(outputBuffer);

        // Draw Input Canvas (Amber / Raw Battlefield Acoustics)
        if (inputCanvasRef.current) {
          const cvs = inputCanvasRef.current;
          const ctx = cvs.getContext('2d');
          if (ctx) {
            drawOscilloscope(
              ctx, 
              cvs.width, 
              cvs.height, 
              inputBuffer, 
              '#f59e0b', // Radar Amber
              true,
              store.telemetry.inputDb
            );
          }
        }

        // Draw Output Canvas (Phosphor Green / Clean Tactical Comms)
        if (outputCanvasRef.current) {
          const cvs = outputCanvasRef.current;
          const ctx = cvs.getContext('2d');
          if (ctx) {
            const outColor = store.isProcessingActive ? '#22e565' : '#f59e0b';
            drawOscilloscope(
              ctx, 
              cvs.width, 
              cvs.height, 
              outputBuffer, 
              outColor, // Military Phosphor Green or Amber bypass
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
    isInput: boolean,
    dbLevel: number
  ) => {
    // Clear background to deepest military CRT well
    ctx.fillStyle = '#050906';
    ctx.fillRect(0, 0, width, height);

    // Draw Military Radar / CRT Graticule Grid
    ctx.strokeStyle = 'rgba(34, 52, 37, 0.7)';
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

    // Center reference zero-crossing line with military phosphor tint
    const midY = height / 2;
    ctx.strokeStyle = isInput ? 'rgba(245, 158, 11, 0.25)' : 'rgba(34, 229, 101, 0.25)';
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(width, midY);
    ctx.stroke();

    // Center Reticle Crosshair
    const midX = width / 2;
    ctx.strokeStyle = isInput ? 'rgba(245, 158, 11, 0.4)' : 'rgba(34, 229, 101, 0.4)';
    ctx.beginPath();
    ctx.moveTo(midX - 10, midY);
    ctx.lineTo(midX + 10, midY);
    ctx.moveTo(midX, midY - 10);
    ctx.lineTo(midX, midY + 10);
    ctx.stroke();

    // Draw area fill below waveform
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
      ? 'rgba(245, 158, 11, 0.06)' 
      : (store.isProcessingActive ? 'rgba(34, 229, 101, 0.08)' : 'rgba(245, 158, 11, 0.06)');
    ctx.fill();

    // Draw main phosphor CRT waveform line with subtle bloom
    ctx.shadowBlur = 6;
    ctx.shadowColor = primaryColor;
    ctx.lineWidth = 1.6;
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
    ctx.shadowBlur = 0; // Reset shadow

    // Draw military segmented vertical dBFS level meter
    const meterWidth = 5;
    const meterX = width - meterWidth - 4;
    const normLevel = Math.max(0, Math.min(1, (dbLevel + 60) / 60));
    const meterHeight = height * 0.85;
    const meterY = midY - meterHeight / 2;

    ctx.fillStyle = '#060d07';
    ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

    const fillHeight = meterHeight * normLevel;
    const fillY = meterY + (meterHeight - fillHeight);

    const gradient = ctx.createLinearGradient(0, meterY + meterHeight, 0, meterY);
    gradient.addColorStop(0, '#15803d');
    gradient.addColorStop(0.65, '#22e565');
    gradient.addColorStop(0.85, '#f59e0b');
    gradient.addColorStop(1, '#ef4444');

    ctx.fillStyle = gradient;
    ctx.fillRect(meterX, fillY, meterWidth, fillHeight);
  };

  return (
    <section className="bg-[#0b120c] border border-[#223425] rounded-[2px] overflow-hidden flex flex-col shadow-xl mil-corner-bracket">
      {/* Panel Header */}
      <div className="h-9 px-3.5 bg-[#0e1710] border-b border-[#223425] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Crosshair className="w-3.5 h-3.5 text-[#22e565]" />
          <h2 className="text-[10px] font-mono font-bold tracking-widest text-[#e8f2e6] uppercase">
            COMBAT ACOUSTIC SENSOR RADAR // DUAL-CHANNEL CRT OSCILLOSCOPE
          </h2>
          <span className="text-[8px] font-mono text-[#7ea385] hidden sm:inline">
            // MIL-STD-810H CALIBRATED
          </span>
        </div>

        <div className="flex items-center space-x-2.5 font-mono text-[10px]">
          <div className="flex items-center space-x-1 bg-[#060a07] px-2 py-0.5 rounded-[1px] border border-[#223425] text-[#7ea385]">
            <span className="text-[8px] text-[#557b5c]">SWEEP:</span>
            <button 
              onClick={() => setTimebaseMs(10)} 
              className={`px-1 rounded-[1px] ${timebaseMs === 10 ? 'text-[#22e565] font-bold bg-[#22e565]/10' : 'hover:text-[#e8f2e6]'}`}
            >
              10ms
            </button>
            <span className="text-[#223425]">/</span>
            <button 
              onClick={() => setTimebaseMs(25)} 
              className={`px-1 rounded-[1px] ${timebaseMs === 25 ? 'text-[#22e565] font-bold bg-[#22e565]/10' : 'hover:text-[#e8f2e6]'}`}
            >
              25ms
            </button>
            <span className="text-[#223425]">/</span>
            <button 
              onClick={() => setTimebaseMs(50)} 
              className={`px-1 rounded-[1px] ${timebaseMs === 50 ? 'text-[#22e565] font-bold bg-[#22e565]/10' : 'hover:text-[#e8f2e6]'}`}
            >
              50ms
            </button>
          </div>

          <button
            onClick={() => setIsFrozen(!isFrozen)}
            className={`px-2 py-0.5 rounded-[1px] border text-[10px] flex items-center space-x-1 transition-all ${
              isFrozen 
                ? 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#f59e0b]' 
                : 'bg-[#060a07] border-[#223425] text-[#7ea385] hover:text-[#e8f2e6] hover:border-[#2e4632]'
            }`}
            title="Freeze Oscilloscope Frame"
          >
            {isFrozen ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span className="font-bold">{isFrozen ? 'HOLD SWEEP' : 'LIVE SWEEP'}</span>
          </button>
        </div>
      </div>

      {/* Main Monitoring Body: Input Waveform + Processing Pipeline Node + Output Waveform */}
      <div className="p-3 grid grid-cols-1 lg:grid-cols-[1fr_125px_1fr] gap-3 items-center">
        {/* INPUT: RAW COMBAT NOISE */}
        <div className="border border-[#223425] rounded-[2px] bg-[#070c08] p-2.5 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-[1px] bg-[#f59e0b] animate-pulse" />
              <span className="font-mono text-[11px] font-bold text-[#e8f2e6] tracking-wider">
                CH-A // RAW BOOM TRANSDUCER
              </span>
            </div>
            <div className="font-mono text-[10px] text-[#7ea385] flex items-center space-x-1.5">
              <span className="text-[#557b5c]">PEAK:</span>
              <span className="text-[#f59e0b] font-bold">{store.telemetry.inputDb.toFixed(1)} dBFS</span>
            </div>
          </div>

          {/* Oscilloscope Canvas */}
          <div className="relative w-full h-36 bg-[#050906] rounded-[1px] overflow-hidden border border-[#223425]">
            <canvas 
              ref={inputCanvasRef} 
              width={480} 
              height={144} 
              className="w-full h-full block"
            />
            {/* Overlay Grid Coordinate Labels */}
            <div className="absolute top-1.5 left-2 font-mono text-[8px] text-[#557b5c] pointer-events-none">
              +6 dB
            </div>
            <div className="absolute bottom-1.5 left-2 font-mono text-[8px] text-[#557b5c] pointer-events-none">
              -60 dBFS
            </div>
            <div className="absolute top-1.5 right-6 font-mono text-[8px] text-[#f59e0b]/90 pointer-events-none">
              HOSTILE NOISE FLOOR: -28 dB
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#7ea385]">
            <span>HYPERCARDIOID BOOM TRANSDUCER</span>
            <span className="text-[#557b5c]">SQUELCH: -108 dBm</span>
          </div>
        </div>

        {/* PROCESSING PIPELINE VISUAL BRIDGE */}
        <div className="flex flex-col items-center justify-center p-2 rounded-[2px] bg-[#090e09] border border-[#223425] h-full space-y-2">
          <div className="text-[8px] font-mono text-[#557b5c] uppercase tracking-widest text-center">
            ANTI-JAM DSP
          </div>

          <div className="w-full flex items-center justify-center">
            <div className={`p-2 rounded-[2px] border text-center transition-all w-full ${
              store.isProcessingActive 
                ? 'bg-[#142316] border-[#22e565]/40 text-[#22e565] shadow-[0_0_8px_rgba(34,229,101,0.2)]' 
                : 'bg-[#2b1f09] border-[#f59e0b]/40 text-[#f59e0b]'
            }`}>
              <Zap className={`w-3.5 h-3.5 mx-auto mb-0.5 ${store.isProcessingActive ? 'animate-pulse text-[#22e565]' : 'text-[#f59e0b]'}`} />
              <div className="font-mono text-[9px] font-bold">DEEPFILTERNET3</div>
              <div className="text-[8px] font-mono opacity-80 mt-0.5">FULL-BAND ERB</div>
            </div>
          </div>

          {/* Animated Signal Direction Indicator */}
          <div className="flex items-center space-x-1 text-[#557b5c]">
            <ArrowRight className={`w-3.5 h-3.5 ${store.isProcessingActive ? 'text-[#22e565] animate-pulse' : 'text-[#557b5c]'}`} />
          </div>

          <div className="text-center font-mono">
            <span className="text-[8px] text-[#557b5c] block uppercase">ATTENUATION</span>
            <span className="text-xs font-bold text-[#22e565]">
              {store.isProcessingActive ? `-${store.telemetry.noiseReductionDb.toFixed(1)} dB` : '0 dB'}
            </span>
          </div>
        </div>

        {/* OUTPUT: ENHANCED TACTICAL AUDIO */}
        <div className="border border-[#223425] rounded-[2px] bg-[#070c08] p-2.5 flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-[1px] ${store.isProcessingActive ? 'bg-[#22e565] animate-pulse shadow-[0_0_6px_#22e565]' : 'bg-[#f59e0b]'}`} />
              <span className="font-mono text-[11px] font-bold text-[#e8f2e6] tracking-wider">
                CH-B // CLEAN TACTICAL RESIDUAL
              </span>
            </div>
            <div className="font-mono text-[10px] text-[#7ea385] flex items-center space-x-1.5">
              <span className="text-[#557b5c]">PEAK:</span>
              <span className={`font-bold ${store.isProcessingActive ? 'text-[#22e565]' : 'text-[#f59e0b]'}`}>
                {store.telemetry.outputDb.toFixed(1)} dBFS
              </span>
            </div>
          </div>

          {/* Oscilloscope Canvas */}
          <div className="relative w-full h-36 bg-[#050906] rounded-[1px] overflow-hidden border border-[#223425]">
            <canvas 
              ref={outputCanvasRef} 
              width={480} 
              height={144} 
              className="w-full h-full block"
            />
            {/* Overlay Grid Coordinate Labels */}
            <div className="absolute top-1.5 left-2 font-mono text-[8px] text-[#557b5c] pointer-events-none">
              +6 dB
            </div>
            <div className="absolute bottom-1.5 left-2 font-mono text-[8px] text-[#557b5c] pointer-events-none">
              -60 dBFS
            </div>
            <div className="absolute top-1.5 right-6 font-mono text-[8px] text-[#22e565]/90 pointer-events-none">
              {store.isProcessingActive ? 'ENHANCED VOICE SIGNAL' : 'BYPASS ACTIVE'}
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#7ea385]">
            <span>TACTICAL EARPIECE // MESH LINK</span>
            <span className="text-[#22e565] font-bold">SNR: +{store.telemetry.snrOutput} dB GAIN</span>
          </div>
        </div>
      </div>
    </section>
  );
};
