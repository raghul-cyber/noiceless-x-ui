import React from 'react';
import { ArrowRight, Cpu, Activity, Radio, Volume2, Shield, RefreshCw } from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';

interface PipelineOverlayProps {
  standalone?: boolean;
}

export const PipelineOverlay: React.FC<PipelineOverlayProps> = ({ standalone = false }) => {
  const { ancActive, voiceActive } = useViewerStore();

  const containerClass = standalone
    ? 'absolute top-20 left-6 z-20 bg-[#08140e]/95 border border-[#143526] p-3.5 rounded-xl shadow-2xl max-w-2xl animate-fade-in font-mono select-none backdrop-blur-xl'
    : 'p-3 rounded-xl bg-[#08140e] border border-[#143526] w-full font-mono select-none';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#143526]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#00e599]/10 border border-[#00e599]/30 flex items-center justify-center text-[#00e599]">
            <Activity className="w-3 h-3" />
          </div>
          <h3 className="text-xs tracking-wider text-[#f0fdf4] font-bold uppercase">
            DUAL-PATH SIGNAL ARCHITECTURE
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-[#00e599] bg-[#00e599]/10 px-2 py-0.5 rounded border border-[#00e599]/30">
            YAMNet AI + FxLMS
          </span>
          <span className="text-[9px] font-mono text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded border border-[#10b981]/30">
            DeepFilterNet3
          </span>
        </div>
      </div>

      {/* PATH A: REAL-TIME LOW-LATENCY DETERMINISTIC ANC FEEDBACK LOOP */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-bold text-[#00e599] uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#00e599]" />
            PATH A: DETERMINISTIC ANC ADAPTIVE FEEDBACK LOOP (FxLMS &lt; 0.8ms)
          </span>
          <span className="text-[8px] text-[#4e6a5b]">HARD REAL-TIME DSP</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Step 1: External Ref Mic */}
          <div
            onClick={() => viewerStore.selectComponent('externalRefMic')}
            className="flex-1 p-2 rounded-lg bg-[#030906] border border-[#143526] hover:border-[#00e599]/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-[#00e599] font-bold truncate">EXT REF MIC</div>
            <div className="text-[#8ba695] text-[8px] truncate">Captures x(n) Ambient</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#00e599]/70 flex-shrink-0" />

          {/* Step 2: DSP Controller */}
          <div
            onClick={() => viewerStore.selectComponent('dspModule')}
            className="flex-1 p-2 rounded-lg bg-[#030906] border border-[#143526] hover:border-amber-400/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-amber-400 font-bold truncate">DSP CONTROLLER</div>
            <div className="text-[#8ba695] text-[8px] truncate">FxLMS Filter Engine</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#00e599]/70 flex-shrink-0" />

          {/* Step 3: Speaker Driver */}
          <div
            onClick={() => viewerStore.selectComponent('speakerDriver')}
            className="flex-1 p-2 rounded-lg bg-[#030906] border border-[#143526] hover:border-emerald-400/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-emerald-400 font-bold truncate">SPEAKER DRIVER</div>
            <div className="text-[#8ba695] text-[8px] truncate">Anti-Noise Wave (-x̂)</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#00e599]/70 flex-shrink-0" />

          {/* Step 4: Internal Error Mic */}
          <div
            onClick={() => viewerStore.selectComponent('internalErrorMic')}
            className="flex-1 p-2 rounded-lg bg-[#030906] border border-[#143526] hover:border-purple-400/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-purple-400 font-bold truncate flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>ERROR MIC</span>
            </div>
            <div className="text-[#8ba695] text-[8px] truncate">Residual Error e(n)</div>
          </div>
        </div>
      </div>

      {/* PATH B: SPEECH ENHANCEMENT & TACTICAL COMMS */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-bold text-[#10b981] uppercase tracking-wider flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-[#10b981]" />
            PATH B: SPEECH ENHANCEMENT &amp; TACTICAL COMMS (DEEPFILTERNET3 / ONNX)
          </span>
          <span className="text-[8px] text-[#4e6a5b]">EMBEDDED RASPBERRY PI</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Step 1: Boom Mic */}
          <div
            onClick={() => viewerStore.selectComponent('boomMic')}
            className="flex-1 p-2 rounded-lg bg-[#030906] border border-[#143526] hover:border-[#00e599]/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-[#00e599] font-bold truncate">BOOM MIC</div>
            <div className="text-[#8ba695] text-[8px] truncate">Near-Mouth Voice s(n)</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#10b981]/70 flex-shrink-0" />

          {/* Step 2: Raspberry Pi Compute */}
          <div
            onClick={() => viewerStore.selectComponent('raspberryPi')}
            className="flex-1 p-2 rounded-lg bg-[#030906] border border-[#143526] hover:border-amber-400/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-amber-400 font-bold truncate flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5" />
              <span>RASPBERRY PI</span>
            </div>
            <div className="text-[#8ba695] text-[8px] truncate">DeepFilterNet3 AI</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#10b981]/70 flex-shrink-0" />

          {/* Step 3: Tactical Radio Comms Out */}
          <div className="flex-1 p-2 rounded-lg bg-[#030906] border border-[#143526] text-[9px]">
            <div className="text-[#10b981] font-bold truncate flex items-center gap-1">
              <Radio className="w-2.5 h-2.5" />
              <span>CLEAR COMMS</span>
            </div>
            <div className="text-[#8ba695] text-[8px] truncate">98.4% Intelligibility</div>
          </div>
        </div>
      </div>
    </div>
  );
};
