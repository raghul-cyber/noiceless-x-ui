import React, { useRef, useEffect } from 'react';
import { Radio, Sliders, Activity, Disc, Volume2, Zap, Crosshair, Shield } from 'lucide-react';
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
          ctx.fillStyle = '#050906';
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          // Draw military CRT frequency division grid
          ctx.strokeStyle = 'rgba(34, 52, 37, 0.6)';
          ctx.lineWidth = 1;
          for (let i = 1; i < 6; i++) {
            const y = (cvs.height / 6) * i;
            ctx.beginPath();
            ctx.setLineDash([2, 4]);
            ctx.moveTo(0, y);
            ctx.lineTo(cvs.width, y);
            ctx.stroke();
          }
          ctx.setLineDash([]);

          const barCount = 48;
          const barWidth = (cvs.width / barCount) - 2;

          for (let i = 0; i < barCount; i++) {
            const inVal = inputFft[i] / 255;
            const outVal = outputFft[i] / 255;
            const x = i * (barWidth + 2);

            // Draw Raw Input FFT (Radar Amber)
            const inHeight = inVal * (cvs.height * 0.88);
            ctx.fillStyle = 'rgba(245, 158, 11, 0.35)';
            ctx.fillRect(x, cvs.height - inHeight, barWidth, inHeight);

            // Draw Processed Output FFT (Military Phosphor Green)
            const outHeight = outVal * (cvs.height * 0.88);
            ctx.fillStyle = store.isProcessingActive ? '#22e565' : '#f59e0b';
            ctx.fillRect(x, cvs.height - outHeight, barWidth, outHeight);

            // Peak cap line
            ctx.fillStyle = store.isProcessingActive ? '#a7f3d0' : '#fde047';
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
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none bg-[#060a07] font-mono">
      {/* Workstation Header */}
      <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md mil-corner-bracket">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#22e565]" />
            <h1 className="text-xs font-bold tracking-wider text-[#e8f2e6] uppercase">
              // TACTICAL COMBAT SPECTRAL ANALYZER &amp; RF INTERCEPT
            </h1>
          </div>
          <p className="text-[#7ea385] text-xs mt-1">
            Simultaneous 48-band FFT spectrum analyzer, anti-jam neural suppression, and acoustic warfare telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={store.toggleProcessing}
            className={`px-3 py-1.5 rounded-[1px] border flex items-center space-x-2 font-bold cursor-pointer transition-all ${
              store.isProcessingActive
                ? 'bg-[#142316] border-[#22e565]/60 text-[#22e565] shadow-[0_0_8px_rgba(34,229,101,0.25)]'
                : 'bg-[#2b1f09] border-[#f59e0b]/60 text-[#f59e0b]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{store.isProcessingActive ? 'DEEPFILTERNET3: ENGAGED' : 'BYPASS MODE ACTIVE'}</span>
          </button>
        </div>
      </div>

      {/* Real-Time FFT Spectral Analyzer (20 Hz - 20 kHz) */}
      <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 flex flex-col space-y-3 shadow-md mil-corner-bracket">
        <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-[#22e565]" />
            <span className="text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
              48-BAND DUAL FFT BATTLEFIELD SPECTRUM ANALYZER
            </span>
          </div>
          <div className="flex items-center space-x-4 text-[10px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-[1px] bg-amber-500/40 border border-amber-500/80" />
              <span className="text-[#7ea385]">HOSTILE NOISE INGEST</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-[1px] bg-[#22e565] shadow-[0_0_4px_#22e565]" />
              <span className="text-[#22e565] font-bold">TACTICAL VOICE RESIDUAL</span>
            </div>
          </div>
        </div>

        {/* FFT Canvas */}
        <div className="relative w-full h-56 bg-[#050906] rounded-[1px] overflow-hidden border border-[#223425]">
          <canvas
            ref={fftCanvasRef}
            width={840}
            height={224}
            className="w-full h-full block"
          />
          {/* Frequency Axis Markings */}
          <div className="absolute bottom-1.5 left-4 right-4 flex justify-between font-mono text-[9px] text-[#557b5c] pointer-events-none">
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

        <div className="flex items-center justify-between text-[10px] text-[#7ea385] pt-0.5 border-t border-[#223425]">
          <span>HANNING WINDOW (1024 SMP)</span>
          <span>RESOLUTION: 46.8 Hz/BIN</span>
          <span className="text-[#22e565] font-bold">DYNAMIC RANGE: 96 dBFS</span>
        </div>
      </div>

      {/* Hardware Staging Knobs and Faders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Attenuation Strength Slider */}
        <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 space-y-2.5 shadow-md mil-corner-bracket">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#7ea385]">ANTI-JAM SUPPRESSION DEPTH</span>
            <span className="text-[#22e565] font-bold">{store.suppressionDepth}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={store.suppressionDepth}
            onChange={(e) => store.setSuppressionDepth(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[#557b5c]">
            <span>TACTICAL LOW (-12dB)</span>
            <span>BATTLEFIELD (-24dB)</span>
            <span>EXTREME (-38dB)</span>
          </div>
        </div>

        {/* VAD Sensitivity Slider */}
        <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 space-y-2.5 shadow-md mil-corner-bracket">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#7ea385]">VAD (VOICE ACTIVITY) THRESHOLD</span>
            <span className="text-[#22e565] font-bold">{store.vadSensitivity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            value={store.vadSensitivity}
            onChange={(e) => store.setVadSensitivity(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[#557b5c]">
            <span>HIGH THRESHOLD</span>
            <span>PATROL NOMINAL</span>
            <span>WHISPER CAPTURE</span>
          </div>
        </div>

        {/* Input/Output VU Headroom Telemetry */}
        <div className="bg-[#0b120c] border border-[#223425] rounded-[2px] p-3.5 space-y-2 text-xs shadow-md mil-corner-bracket">
          <span className="text-[#557b5c] block text-[9px] uppercase tracking-wider font-bold">MIL-SPEC HEADROOM</span>
          <div className="flex justify-between items-center text-[#7ea385]">
            <span>NOMINAL HEADROOM:</span>
            <span className="text-[#22e565] font-bold">18.4 dBFS</span>
          </div>
          <div className="flex justify-between items-center text-[#7ea385]">
            <span>INTERMODULATION THD:</span>
            <span className="text-[#e8f2e6] font-semibold">&lt; 0.008%</span>
          </div>
          <div className="flex justify-between items-center text-[#7ea385]">
            <span>PASSIVE EAR SEAL:</span>
            <span className="text-[#22e565] font-bold">-31.2 dB (NRR 28)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
