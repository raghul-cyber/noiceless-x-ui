import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Mic, MicOff, Activity, Sliders, Shield, Cpu, Lock } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface HeaderBarProps {
  store: ReturnType<typeof useAppStore>;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ store }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <header className="h-12 border-b border-[#143526] bg-[#07130d] px-4 flex items-center justify-between select-none z-30 flex-shrink-0">
        {/* Left Section: Brand & Product Architecture */}
        <div className="flex items-center space-x-4">
          <div 
            className="flex items-center space-x-2.5 cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => store.setActiveView('overview')}
            title="Return to Overview Dashboard"
          >
            <div className="w-6 h-6 rounded-[3px] border border-[#00e599]/40 bg-[#00e599]/15 flex items-center justify-center text-[#00e599] shadow-[0_0_8px_rgba(0,229,153,0.25)]">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-sans text-sm font-extrabold tracking-widest text-[#f0fdf4]">
                NOISELESS<span className="text-[#00e599] font-normal">-X</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono tracking-widest text-[#8ba695] uppercase bg-[#091b12] px-1.5 py-0.5 rounded border border-[#143526]">
                TAC-DSP v4.2
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-[#143526]" />

          {/* Engine Processing Status Pill */}
          <button 
            onClick={store.toggleProcessing}
            className={`px-2.5 py-1 rounded-[3px] border text-[11px] font-mono flex items-center space-x-2 transition-all cursor-pointer ${
              store.isProcessingActive 
                ? 'bg-[#0a2318] border-[#00e599]/40 text-[#00e599] hover:bg-[#0e2f1e] shadow-[0_0_8px_rgba(0,229,153,0.15)]' 
                : 'bg-[#241806] border-[#f59e0b]/40 text-[#f59e0b] hover:bg-[#302008]'
            }`}
            title="Click to toggle DSP Processing bypass"
          >
            <span className={`w-2 h-2 rounded-full ${store.isProcessingActive ? 'bg-[#00e599] animate-pulse shadow-[0_0_6px_#00e599]' : 'bg-[#f59e0b]'}`} />
            <span className="font-semibold tracking-wider uppercase">
              {store.isProcessingActive ? 'PROCESSING ACTIVE' : 'BYPASS MODE'}
            </span>
          </button>
        </div>

        {/* Center Section: Core Audio Pipeline Specs */}
        <div className="hidden lg:flex items-center space-x-4 font-mono text-[11px]">
          <div className="flex items-center space-x-1.5 bg-[#091811] px-2 py-0.5 rounded border border-[#143526] text-[#8ba695]">
            <span className="text-[9px] uppercase tracking-wider text-[#4e6a5b]">CLK:</span>
            <span className="text-[#f0fdf4] font-semibold">{store.telemetry.sampleRate / 1000} kHz / 24-bit</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#091811] px-2 py-0.5 rounded border border-[#00e599]/25 text-[#00e599]">
            <span className="text-[9px] uppercase tracking-wider text-[#4e6a5b]">ENGINE:</span>
            <span className="font-bold">RNNNOISE</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#091811] px-2 py-0.5 rounded border border-[#143526] text-[#8ba695]">
            <span className="text-[9px] uppercase tracking-wider text-[#4e6a5b]">BUF:</span>
            <span className="text-[#f0fdf4]">{store.telemetry.bufferSize} smp (2.6 ms)</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#091811] px-2 py-0.5 rounded border border-[#143526] text-[#8ba695]">
            <span className="text-[9px] uppercase tracking-wider text-[#4e6a5b]">LATENCY:</span>
            <span className="text-[#00e599] font-bold">{store.telemetry.latencyMs} ms</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#091811] px-2 py-0.5 rounded border border-[#143526] text-[#8ba695]">
            <Lock className="w-3 h-3 text-[#00e599]" />
            <span className="text-[9px] text-[#00e599] font-semibold tracking-wider">AES-256</span>
          </div>
        </div>

        {/* Right Section: Hardware Controls & Config */}
        <div className="flex items-center space-x-2.5">
          {/* Live Mic Toggle */}
          <button
            onClick={store.toggleMicrophone}
            className={`px-2.5 py-1 rounded-[3px] border text-[11px] font-mono flex items-center space-x-1.5 transition-all ${
              store.isMicActive
                ? 'bg-[#ff3b5c]/20 border-[#ff3b5c]/50 text-[#ff3b5c] hover:bg-[#ff3b5c]/30 shadow-[0_0_8px_rgba(255,59,92,0.25)]'
                : 'bg-[#091811] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#1e4a36]'
            }`}
            title="Toggle Live Audio Ingest from Physical Microphone"
          >
            {store.isMicActive ? <Mic className="w-3.5 h-3.5 text-[#ff3b5c] animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="font-semibold">{store.isMicActive ? 'LIVE MIC ARMED' : 'SIMULATION'}</span>
          </button>

          {/* Master Audition Audio Mute Toggle */}
          <button
            onClick={store.toggleMasterMute}
            className={`p-1.5 rounded-[3px] border transition-all ${
              !store.isAudioMuted
                ? 'bg-[#00e599]/15 border-[#00e599]/40 text-[#00e599] hover:bg-[#00e599]/25 shadow-[0_0_6px_rgba(0,229,153,0.2)]'
                : 'bg-[#091811] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#1e4a36]'
            }`}
            title={store.isAudioMuted ? "Unmute Browser Audio Speaker (Audition Output)" : "Mute Speaker Output"}
          >
            {!store.isAudioMuted ? <Volume2 className="w-4 h-4 text-[#00e599]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* System Settings Gear */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 rounded-[3px] border bg-[#091811] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#1e4a36] transition-all"
            title="Engineering Settings & DSP Parameters"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Engineering Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#08140e] border border-[#143526] rounded-md w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="h-12 px-5 border-b border-[#143526] bg-[#0a1a12] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-[#00e599]" />
                <span className="font-mono text-xs font-bold text-[#f0fdf4] tracking-wider uppercase">
                  DSP CORE &amp; HARDWARE CONFIGURATION
                </span>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-[#8ba695] hover:text-[#f0fdf4] font-mono text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5 font-mono text-xs text-[#8ba695]">
              <div className="space-y-2">
                <div className="flex justify-between text-[#8ba695]">
                  <span>RNNNOISE SUPPRESSION AGGRESSIVENESS</span>
                  <span className="text-[#00e599] font-bold">{store.suppressionDepth}%</span>
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
                <div className="flex justify-between text-[#8ba695]">
                  <span>VAD (VOICE ACTIVITY DETECTOR) THRESHOLD</span>
                  <span className="text-[#00e599] font-bold">{store.vadSensitivity}%</span>
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

              <div className="pt-3 border-t border-[#143526] grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 rounded-[2px] bg-[#040a07] border border-[#143526]">
                  <span className="text-[#4e6a5b] block mb-1">HARDWARE CODEC</span>
                  <span className="text-[#f0fdf4] font-semibold">Cirrus Logic CS4272 I2S</span>
                </div>
                <div className="p-2.5 rounded-[2px] bg-[#040a07] border border-[#143526]">
                  <span className="text-[#4e6a5b] block mb-1">ACOUSTIC SENSORS</span>
                  <span className="text-[#f0fdf4] font-semibold">Dual Hypercardioid + MEMS</span>
                </div>
                <div className="p-2.5 rounded-[2px] bg-[#040a07] border border-[#143526]">
                  <span className="text-[#4e6a5b] block mb-1">DSP INFERENCE CYCLE</span>
                  <span className="text-[#00e599] font-bold">0.82 ms (10ms window)</span>
                </div>
                <div className="p-2.5 rounded-[2px] bg-[#040a07] border border-[#143526]">
                  <span className="text-[#4e6a5b] block mb-1">SECURITY CLASSIFICATION</span>
                  <span className="text-[#10b981] font-bold">MIL-STD-810H Compliant</span>
                </div>
              </div>
            </div>

            <div className="h-12 px-5 border-t border-[#143526] bg-[#06110b] flex items-center justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-1.5 rounded-[3px] bg-[#00e599] text-[#040a07] font-mono text-xs font-bold hover:bg-[#00e599]/90 transition-all shadow-[0_0_8px_rgba(0,229,153,0.3)]"
              >
                APPLY &amp; CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
