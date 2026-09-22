import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Mic, MicOff, Activity, Cpu, Sliders, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface HeaderBarProps {
  store: ReturnType<typeof useAppStore>;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ store }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <header className="h-14 border-b border-[#182030] bg-[#07090e] px-5 flex items-center justify-between select-none z-30 flex-shrink-0">
        {/* Left Section: Brand & Product Architecture */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded border border-signal-cyan/40 bg-signal-cyan/10 flex items-center justify-center text-signal-cyan">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-base font-bold tracking-wider text-slate-100">
                NOISELESS<span className="text-signal-cyan font-normal">-X</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                TACTICAL DSP v2.4
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-[#182030]" />

          {/* Engine Processing Status Pill */}
          <div 
            onClick={store.toggleProcessing}
            className={`cursor-pointer px-2.5 py-1 rounded border text-xs font-mono flex items-center space-x-2 transition-all ${
              store.isProcessingActive 
                ? 'bg-signal-green/10 border-signal-green/30 text-signal-green hover:bg-signal-green/20' 
                : 'bg-signal-amber/10 border-signal-amber/30 text-signal-amber hover:bg-signal-amber/20'
            }`}
            title="Click to toggle DSP Processing bypass"
          >
            <span className={`w-2 h-2 rounded-full ${store.isProcessingActive ? 'bg-signal-green animate-pulse' : 'bg-signal-amber'}`} />
            <span className="font-semibold tracking-wide">
              {store.isProcessingActive ? 'PROCESSING ACTIVE' : 'BYPASS MODE'}
            </span>
          </div>
        </div>

        {/* Center Section: Core Audio Pipeline Specs */}
        <div className="hidden md:flex items-center space-x-6 font-mono text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">SAMPLE RATE</span>
            <span className="text-slate-200 bg-[#0e131d] px-2 py-0.5 rounded border border-[#1c2436]">
              {store.telemetry.sampleRate / 1000} kHz / 24-bit
            </span>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">DSP ENGINE</span>
            <span className="text-signal-cyan bg-[#0e131d] px-2 py-0.5 rounded border border-signal-cyan/20">
              RNNNOISE
            </span>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">BUFFER</span>
            <span className="text-slate-200 bg-[#0e131d] px-2 py-0.5 rounded border border-[#1c2436]">
              {store.telemetry.bufferSize} smp (2.6 ms)
            </span>
          </div>

          <div className="flex items-center space-x-2 text-slate-400">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">SYS LATENCY</span>
            <span className="text-slate-200 bg-[#0e131d] px-2 py-0.5 rounded border border-[#1c2436]">
              {store.telemetry.latencyMs} ms
            </span>
          </div>
        </div>

        {/* Right Section: Hardware Controls & Config */}
        <div className="flex items-center space-x-3">
          {/* Live Mic Toggle */}
          <button
            onClick={store.toggleMicrophone}
            className={`px-2.5 py-1.5 rounded border text-xs font-mono flex items-center space-x-1.5 transition-all ${
              store.isMicActive
                ? 'bg-signal-red/20 border-signal-red/50 text-red-400 hover:bg-signal-red/30'
                : 'bg-[#0f1420] border-[#1d2538] text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title="Toggle Live Audio Ingest from Physical Microphone"
          >
            {store.isMicActive ? <Mic className="w-3.5 h-3.5 text-red-400 animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{store.isMicActive ? 'LIVE MIC ON' : 'SIMULATION'}</span>
          </button>

          {/* Master Audition Audio Mute Toggle */}
          <button
            onClick={store.toggleMasterMute}
            className={`p-1.5 rounded border transition-all ${
              !store.isAudioMuted
                ? 'bg-signal-cyan/20 border-signal-cyan/40 text-signal-cyan hover:bg-signal-cyan/30'
                : 'bg-[#0f1420] border-[#1d2538] text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
            title={store.isAudioMuted ? "Unmute Browser Audio Speaker (Audition Output)" : "Mute Speaker Output"}
          >
            {!store.isAudioMuted ? <Volume2 className="w-4 h-4 text-signal-cyan" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* System Settings Gear */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 rounded border bg-[#0f1420] border-[#1d2538] text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
            title="Engineering Settings & DSP Parameters"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Engineering Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0e16] border border-[#222d42] rounded-lg w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="h-12 px-5 border-b border-[#1c2438] bg-[#0e1320] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-signal-cyan" />
                <span className="font-mono text-sm font-semibold text-slate-200">
                  DSP CORE & HARDWARE CONFIGURATION
                </span>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-200 font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 font-mono text-xs text-slate-300">
              <div className="space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>RNNNOISE SUPPRESSION AGGRESSIVENESS</span>
                  <span className="text-signal-cyan font-bold">{store.suppressionDepth}%</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={store.suppressionDepth} 
                  onChange={(e) => store.setSuppressionDepth(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>VAD (VOICE ACTIVITY DETECTOR) THRESHOLD</span>
                  <span className="text-signal-cyan font-bold">{store.vadSensitivity}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="95" 
                  value={store.vadSensitivity} 
                  onChange={(e) => store.setVadSensitivity(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="pt-3 border-t border-[#1c2438] grid grid-cols-2 gap-4 text-[11px]">
                <div className="p-2.5 rounded bg-[#07090e] border border-[#161e30]">
                  <span className="text-slate-500 block mb-1">HARDWARE CODEC</span>
                  <span className="text-slate-200 font-bold">Cirrus Logic CS4272 I2S</span>
                </div>
                <div className="p-2.5 rounded bg-[#07090e] border border-[#161e30]">
                  <span className="text-slate-500 block mb-1">ACOUSTIC SENSORS</span>
                  <span className="text-slate-200 font-bold">Dual Hypercardioid + MEMS</span>
                </div>
                <div className="p-2.5 rounded bg-[#07090e] border border-[#161e30]">
                  <span className="text-slate-500 block mb-1">DSP INFERENCE CYCLE</span>
                  <span className="text-slate-200 font-bold">0.82 ms (10ms window)</span>
                </div>
                <div className="p-2.5 rounded bg-[#07090e] border border-[#161e30]">
                  <span className="text-slate-500 block mb-1">SECURITY CLASSIFICATION</span>
                  <span className="text-signal-green font-bold">MIL-STD-810H Compliant</span>
                </div>
              </div>
            </div>

            <div className="h-12 px-5 border-t border-[#1c2438] bg-[#090c14] flex items-center justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-1.5 rounded bg-signal-cyan/20 border border-signal-cyan/40 text-signal-cyan font-mono text-xs hover:bg-signal-cyan/30 transition-all"
              >
                APPLY & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
