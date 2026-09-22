import React from 'react';
import { ArrowRight, Cpu, Activity, Radio, Volume2, Shield, RefreshCw } from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';

interface PipelineOverlayProps {
  standalone?: boolean;
}

export const PipelineOverlay: React.FC<PipelineOverlayProps> = ({ standalone = false }) => {
  const { ancActive, voiceActive } = useViewerStore();

  const containerClass = standalone
    ? 'absolute top-20 left-6 z-20 tactical-glass p-3.5 rounded-xl border border-[#00e5ff]/25 shadow-2xl max-w-2xl animate-fade-in'
    : 'p-3 rounded-xl bg-[#090e17]/80 border border-[#1e293b] w-full';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-[#1c293d]">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#00e5ff]" />
          <h3 className="font-tech text-xs tracking-wider text-white font-bold uppercase">
            DUAL-PATH SIGNAL ARCHITECTURE
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-[#00e5ff] bg-[#00e5ff]/10 px-2 py-0.5 rounded border border-[#00e5ff]/30">
            YAMNet AI + FxLMS
          </span>
          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
            DeepFilterNet2
          </span>
        </div>
      </div>

      {/* PATH A: REAL-TIME LOW-LATENCY DETERMINISTIC ANC FEEDBACK LOOP */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3 text-[#00e5ff]" />
            PATH A: DETERMINISTIC ANC ADAPTIVE FEEDBACK LOOP (FxLMS &lt; 0.8ms)
          </span>
          <span className="text-[8px] font-mono text-slate-400">HARD REAL-TIME DSP</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Step 1: External Ref Mic */}
          <div
            onClick={() => viewerStore.selectComponent('externalRefMic')}
            className="flex-1 p-2 rounded-lg bg-[#070b12] border border-cyan-500/40 text-[9px] font-mono cursor-pointer hover:border-cyan-400 transition-all"
          >
            <div className="text-[#00e5ff] font-bold truncate">EXT REF MIC</div>
            <div className="text-slate-400 text-[8px] truncate">Captures x(n) Ambient</div>
          </div>

          <ArrowRight className="w-3 h-3 text-cyan-500 flex-shrink-0" />

          {/* Step 2: DSP Controller */}
          <div
            onClick={() => viewerStore.selectComponent('dspModule')}
            className="flex-1 p-2 rounded-lg bg-[#070b12] border border-cyan-500/40 text-[9px] font-mono cursor-pointer hover:border-cyan-400 transition-all"
          >
            <div className="text-amber-400 font-bold truncate">DSP CONTROLLER</div>
            <div className="text-slate-400 text-[8px] truncate">FxLMS Filter Engine</div>
          </div>

          <ArrowRight className="w-3 h-3 text-cyan-500 flex-shrink-0" />

          {/* Step 3: Speaker Driver */}
          <div
            onClick={() => viewerStore.selectComponent('speakerDriver')}
            className="flex-1 p-2 rounded-lg bg-[#070b12] border border-cyan-500/40 text-[9px] font-mono cursor-pointer hover:border-cyan-400 transition-all"
          >
            <div className="text-cyan-400 font-bold truncate">SPEAKER DRIVER</div>
            <div className="text-slate-400 text-[8px] truncate">Anti-Noise Wave (-x̂)</div>
          </div>

          <ArrowRight className="w-3 h-3 text-cyan-500 flex-shrink-0" />

          {/* Step 4: Internal Error Mic */}
          <div
            onClick={() => viewerStore.selectComponent('internalErrorMic')}
            className="flex-1 p-2 rounded-lg bg-[#070b12] border border-fuchsia-500/50 text-[9px] font-mono cursor-pointer hover:border-fuchsia-400 transition-all"
          >
            <div className="text-fuchsia-400 font-bold truncate flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>ERROR MIC</span>
            </div>
            <div className="text-slate-400 text-[8px] truncate">Residual Error e(n)</div>
          </div>
        </div>
      </div>

      {/* PATH B: SPEECH ENHANCEMENT & TACTICAL COMMS */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-emerald-400" />
            PATH B: SPEECH ENHANCEMENT & TACTICAL COMMS (DEEPFILTERNET2 / DCCRN)
          </span>
          <span className="text-[8px] font-mono text-slate-400">EMBEDDED RASPBERRY PI</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Step 1: Boom Mic */}
          <div
            onClick={() => viewerStore.selectComponent('boomMic')}
            className="flex-1 p-2 rounded-lg bg-[#070b12] border border-emerald-500/40 text-[9px] font-mono cursor-pointer hover:border-emerald-400 transition-all"
          >
            <div className="text-emerald-400 font-bold truncate">BOOM MIC</div>
            <div className="text-slate-400 text-[8px] truncate">Near-Mouth Voice s(n)</div>
          </div>

          <ArrowRight className="w-3 h-3 text-emerald-500 flex-shrink-0" />

          {/* Step 2: Raspberry Pi Compute */}
          <div
            onClick={() => viewerStore.selectComponent('raspberryPi')}
            className="flex-1 p-2 rounded-lg bg-[#070b12] border border-amber-500/40 text-[9px] font-mono cursor-pointer hover:border-amber-400 transition-all"
          >
            <div className="text-amber-300 font-bold truncate flex items-center gap-1">
              <Cpu className="w-2.5 h-2.5" />
              <span>RASPBERRY PI</span>
            </div>
            <div className="text-slate-400 text-[8px] truncate">DeepFilterNet2 AI</div>
          </div>

          <ArrowRight className="w-3 h-3 text-emerald-500 flex-shrink-0" />

          {/* Step 3: Tactical Radio Comms Out */}
          <div className="flex-1 p-2 rounded-lg bg-[#070b12] border border-emerald-500/40 text-[9px] font-mono">
            <div className="text-emerald-400 font-bold truncate flex items-center gap-1">
              <Radio className="w-2.5 h-2.5" />
              <span>CLEAR COMMS</span>
            </div>
            <div className="text-slate-400 text-[8px] truncate">98.4% Intelligibility</div>
          </div>
        </div>
      </div>
    </div>
  );
};
