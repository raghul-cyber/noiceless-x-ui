import React from 'react';
import { ArrowRight, Cpu, Activity, Radio, Volume2, Shield, RefreshCw, Crosshair } from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';

interface PipelineOverlayProps {
  standalone?: boolean;
}

export const PipelineOverlay: React.FC<PipelineOverlayProps> = ({ standalone = false }) => {
  const { ancActive, voiceActive } = useViewerStore();

  const containerClass = standalone
    ? 'mil-corner-bracket absolute top-20 left-6 z-20 bg-[#0b120c]/95 border border-[#223425] p-3.5 rounded shadow-2xl max-w-2xl animate-fade-in font-mono select-none backdrop-blur-md'
    : 'mil-corner-bracket p-3 rounded bg-[#0b120c] border border-[#223425] w-full font-mono select-none';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#223425]">
        <div className="flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-[#22e565]" />
          <h3 className="text-xs tracking-wider text-[#f0fdf4] font-stencil font-bold uppercase">
            C4ISR DUAL-PATH AUDIO ARCHITECTURE
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-stencil text-[#22e565] bg-[#22e565]/10 px-2 py-0.5 rounded border border-[#22e565]/30">
            FxLMS 180° NULL
          </span>
          <span className="text-[9px] font-stencil text-[#22e565] bg-[#22e565]/10 px-2 py-0.5 rounded border border-[#22e565]/30">
            DEEPFILTERNET3
          </span>
        </div>
      </div>

      {/* PATH A: REAL-TIME LOW-LATENCY DETERMINISTIC ANC FEEDBACK LOOP */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-stencil font-bold text-[#22e565] uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#22e565]" />
            PATH A: DETERMINISTIC HARD REAL-TIME ANC LOOP (FxLMS &lt; 0.8ms)
          </span>
          <span className="text-[8px] text-[#4e6a5b]">FPGA / HARD RT</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Step 1: External Ref Mic */}
          <div
            onClick={() => viewerStore.selectComponent('externalRefMic')}
            className="flex-1 p-2 rounded bg-[#070e09] border border-[#223425] hover:border-[#22e565]/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-[#22e565] font-stencil font-bold truncate">EXT REF MIC</div>
            <div className="text-[#8ba695] text-[8px] truncate">x(n) Threat Ambient</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#22e565]/70 flex-shrink-0" />

          {/* Step 2: DSP Controller */}
          <div
            onClick={() => viewerStore.selectComponent('dspModule')}
            className="flex-1 p-2 rounded bg-[#070e09] border border-[#223425] hover:border-[#f59e0b]/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-[#f59e0b] font-stencil font-bold truncate">DSP CONTROLLER</div>
            <div className="text-[#8ba695] text-[8px] truncate">Adaptive FxLMS Core</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#22e565]/70 flex-shrink-0" />

          {/* Step 3: Speaker Driver */}
          <div
            onClick={() => viewerStore.selectComponent('speakerDriver')}
            className="flex-1 p-2 rounded bg-[#070e09] border border-[#223425] hover:border-emerald-400/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-emerald-400 font-stencil font-bold truncate">SPEAKER DRIVER</div>
            <div className="text-[#8ba695] text-[8px] truncate">-x̂(n) Anti-Noise Wave</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#22e565]/70 flex-shrink-0" />

          {/* Step 4: Internal Error Mic */}
          <div
            onClick={() => viewerStore.selectComponent('internalErrorMic')}
            className="flex-1 p-2 rounded bg-[#070e09] border border-[#223425] hover:border-purple-400/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-purple-400 font-stencil font-bold truncate flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>ERROR MIC</span>
            </div>
            <div className="text-[#8ba695] text-[8px] truncate">e(n) Residual Null</div>
          </div>
        </div>
      </div>

      {/* PATH B: SPEECH ENHANCEMENT & TACTICAL COMMS */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-stencil font-bold text-[#22e565] uppercase tracking-wider flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-[#22e565]" />
            PATH B: NEURAL SPEECH ENHANCEMENT &amp; TACTICAL RADIO LINK (ONNX)
          </span>
          <span className="text-[8px] text-[#4e6a5b]">ARM NEON CORTEX-A72</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Step 1: Boom Mic */}
          <div
            onClick={() => viewerStore.selectComponent('boomMic')}
            className="flex-1 p-2 rounded bg-[#070e09] border border-[#223425] hover:border-[#22e565]/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-[#22e565] font-stencil font-bold truncate">BOOM TRANSDUCER</div>
            <div className="text-[#8ba695] text-[8px] truncate">Hypercardioid Voice s(n)</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#22e565]/70 flex-shrink-0" />

          {/* Step 2: Raspberry Pi Compute */}
          <div
            onClick={() => viewerStore.selectComponent('raspberryPi')}
            className="flex-1 p-2 rounded bg-[#070e09] border border-[#223425] hover:border-[#f59e0b]/50 text-[9px] cursor-pointer transition-all"
          >
            <div className="text-[#f59e0b] font-stencil font-bold truncate flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5" />
              <span>HARDENED PI</span>
            </div>
            <div className="text-[#8ba695] text-[8px] truncate">DeepFilterNet3 AI</div>
          </div>

          <ArrowRight className="w-3 h-3 text-[#22e565]/70 flex-shrink-0" />

          {/* Step 3: Tactical Radio Comms Out */}
          <div className="flex-1 p-2 rounded bg-[#070e09] border border-[#223425] text-[9px]">
            <div className="text-[#22e565] font-stencil font-bold truncate flex items-center gap-1">
              <Radio className="w-2.5 h-2.5" />
              <span>RADIO OUT</span>
            </div>
            <div className="text-[#8ba695] text-[8px] truncate">99.1% Intelligibility</div>
          </div>
        </div>
      </div>
    </div>
  );
};
