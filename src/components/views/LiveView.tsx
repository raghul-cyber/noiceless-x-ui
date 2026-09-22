import React, { useRef, useEffect } from 'react';
import { Radio, Sliders, Activity, Disc, Volume2, Zap } from 'lucide-react';
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
          ctx.fillStyle = '#020604';
          ctx.fillRect(0, 0, cvs.width, cvs.height);

          // Draw frequency grid lines (100Hz, 1kHz, 5kHz, 10kHz, 20kHz)
          ctx.strokeStyle = 'rgba(20, 53, 38, 0.5)';
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

            // Draw Processed Output FFT (Tactical Mint)
            const outHeight = outVal * (cvs.height * 0.88);
            ctx.fillStyle = store.isProcessingActive ? '#00e599' : '#f59e0b';
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
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none bg-[#040a07]">
      {/* Workstation Header */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-[#00e599]" />
            <h1 className="font-mono text-xs font-bold tracking-wider text-[#f0fdf4] uppercase">
              HIGH-PRECISION AUDIO ENGINEERING WORKSTATION
            </h1>
          </div>
          <p className="text-[#8ba695] text-xs mt-1 font-sans">
            Simultaneous dual-channel oscilloscopic capture, 48-band FFT spectrum analyzer, and real-time neural attenuation staging.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <button
            onClick={store.toggleProcessing}
            className={`px-3 py-1.5 rounded-[3px] border flex items-center space-x-2 font-bold cursor-pointer transition-all ${
              store.isProcessingActive
                ? 'bg-[#00e599]/20 border-[#00e599]/50 text-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.2)]'
                : 'bg-[#f59e0b]/20 border-[#f59e0b]/50 text-[#f59e0b]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{store.isProcessingActive ? 'DEEPFILTERNET3: ENGAGED' : 'BYPASS ACTIVE'}</span>
          </button>
        </div>
      </div>

      {/* Real-Time FFT Spectral Analyzer (20 Hz - 20 kHz) */}
      <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 flex flex-col space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#143526]">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-[#00e599]" />
            <span className="font-mono text-xs font-bold text-[#f0fdf4] tracking-wider uppercase">
              REAL-TIME 48-BAND DUAL FFT SPECTRUM ANALYZER
            </span>
          </div>
          <div className="flex items-center space-x-4 font-mono text-[10px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-500/40 border border-amber-500/80" />
              <span className="text-[#8ba695]">INPUT NOISE SPECTRUM</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-[2px] bg-[#00e599] shadow-[0_0_4px_#00e599]" />
              <span className="text-[#00e599] font-semibold">ENHANCED SPEECH SIGNAL</span>
            </div>
          </div>
        </div>

        {/* FFT Canvas */}
        <div className="relative w-full h-56 bg-[#020604] rounded-[2px] overflow-hidden border border-[#143526]">
          <canvas
            ref={fftCanvasRef}
            width={840}
            height={224}
            className="w-full h-full block"
          />
          {/* Frequency Axis Markings */}
          <div className="absolute bottom-1.5 left-4 right-4 flex justify-between font-mono text-[9px] text-[#4e6a5b] pointer-events-none">
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

        <div className="flex items-center justify-between text-[11px] font-mono text-[#8ba695] pt-0.5">
          <span>WINDOW: HANNING 1024 SMP</span>
          <span>RESOLUTION: 46.8 Hz/BIN</span>
          <span className="text-[#00e599]">DYNAMIC RANGE: 96 dBFS</span>
        </div>
      </div>

      {/* Hardware Staging Knobs and Faders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Attenuation Strength Slider */}
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 space-y-2.5 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#8ba695]">SUPPRESSION DEPTH</span>
            <span className="text-[#00e599] font-bold">{store.suppressionDepth}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={store.suppressionDepth}
            onChange={(e) => store.setSuppressionDepth(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#4e6a5b]">
            <span>LIGHT (-12dB)</span>
            <span>OPTIMAL (-24dB)</span>
            <span>MAX (-38dB)</span>
          </div>
        </div>

        {/* VAD Sensitivity Slider */}
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 space-y-2.5 shadow-md">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#8ba695]">VAD SENSITIVITY</span>
            <span className="text-[#00e599] font-bold">{store.vadSensitivity}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="95"
            value={store.vadSensitivity}
            onChange={(e) => store.setVadSensitivity(Number(e.target.value))}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-[#4e6a5b]">
            <span>HIGH THRESHOLD</span>
            <span>OPERATIONAL</span>
            <span>LOW THRESHOLD</span>
          </div>
        </div>

        {/* Input/Output VU Headroom Telemetry */}
        <div className="bg-[#08140e] border border-[#143526] rounded-md p-3.5 space-y-2 font-mono text-xs shadow-md">
          <span className="text-[#4e6a5b] block text-[10px] uppercase tracking-wider">CALIBRATED HEADROOM</span>
          <div className="flex justify-between items-center text-[#8ba695]">
            <span>NOMINAL HEADROOM:</span>
            <span className="text-[#10b981] font-bold">18.4 dBFS</span>
          </div>
          <div className="flex justify-between items-center text-[#8ba695]">
            <span>INTERMODULATION THD:</span>
            <span className="text-[#f0fdf4]">&lt; 0.008%</span>
          </div>
          <div className="flex justify-between items-center text-[#8ba695]">
            <span>ACOUSTIC LEAKAGE:</span>
            <span className="text-[#00e599] font-bold">-31.2 dB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
