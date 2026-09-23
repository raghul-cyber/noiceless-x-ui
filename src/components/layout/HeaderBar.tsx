import React, { useState, useEffect } from 'react';
import { Settings, Volume2, VolumeX, Mic, MicOff, Sliders, Shield, Cpu, Lock, Crosshair, Radio, AlertTriangle } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface HeaderBarProps {
  store: ReturnType<typeof useAppStore>;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ store }) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [zuluTime, setZuluTime] = useState<string>('');

  useEffect(() => {
    const updateZulu = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setZuluTime(`${h}:${m}:${s}Z`);
    };
    updateZulu();
    const interval = setInterval(updateZulu, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Topmost Military Classification Banner */}
      <div className="h-5 bg-[#090e09] border-b border-[#223425] px-3 flex items-center justify-between font-mono text-[9px] text-[#7ea385] tracking-widest select-none flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40 px-1 font-bold text-[8px] tracking-wider rounded-[1px]">
            RESTRICTED // NOFORN
          </span>
          <span className="text-[#b2ccb7] font-semibold hidden sm:inline">
            US ARMY C4ISR TACTICAL BASE STATION // TOC-ALPHA
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[8px]">
          <span className="text-[#7ea385] hidden md:inline">
            MGRS: <strong className="text-[#e8f2e6]">11SMU923841</strong>
          </span>
          <span className="text-[#223425]">|</span>
          <span className="text-[#f59e0b] font-bold">
            DEFCON 2 // READY
          </span>
          <span className="text-[#223425]">|</span>
          <span className="text-[#22e565] font-bold tracking-wider">
            ZULU: {zuluTime || '18:00:00Z'}
          </span>
        </div>
      </div>

      {/* Main Tactical Header */}
      <header className="h-14 border-b border-[#223425] bg-[#0c140d] px-3.5 flex items-center justify-between select-none z-30 flex-shrink-0">
        {/* Left Section: Single Official Brand Anchor with Logo in Military Reticle */}
        <div className="flex items-center space-x-3">
          <div 
            className="flex items-center space-x-2.5 cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => store.setActiveView('overview')}
            title="NOISELESS-X6 Tactical Audio Console"
          >
            {/* The Sole Logo on the Entire Site - Framed in Tactical Corner Brackets */}
            <div className="relative w-9 h-9 flex items-center justify-center p-0.5 bg-[#070c08] border border-[#2e4632] rounded-[2px] mil-corner-bracket">
              <img 
                src="/logo.png" 
                alt="NOISELESS-X6" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(34,229,101,0.35)]" 
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="font-stencil text-sm font-bold tracking-wider text-[#e8f2e6]">
                  NOISELESS<span className="text-[#22e565] font-extrabold">-X6</span>
                </span>
                <span className="text-[8px] font-mono tracking-wider text-[#22e565] uppercase bg-[#22e565]/10 px-1 py-0.5 rounded-[1px] border border-[#22e565]/30 font-bold">
                  MIL-STD-810H
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#7ea385] tracking-widest uppercase mt-1">
                COMBAT AUDIO WARFARE CONSOLE
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-[#223425]" />

          {/* Engine Processing Status Pill */}
          <button 
            onClick={store.toggleProcessing}
            className={`px-2.5 py-1 rounded-[2px] border text-[10px] font-mono flex items-center space-x-2 transition-all cursor-pointer ${
              store.isProcessingActive 
                ? 'bg-[#142316] border-[#22e565]/50 text-[#22e565] hover:bg-[#1a2f1d] shadow-[0_0_8px_rgba(34,229,101,0.2)]' 
                : 'bg-[#2b1f09] border-[#f59e0b]/50 text-[#f59e0b] hover:bg-[#38280c]'
            }`}
            title="Click to toggle DSP Processing bypass"
          >
            <span className={`w-2 h-2 rounded-[1px] ${store.isProcessingActive ? 'bg-[#22e565] animate-pulse shadow-[0_0_6px_#22e565]' : 'bg-[#f59e0b]'}`} />
            <span className="font-bold tracking-wider uppercase">
              {store.isProcessingActive ? 'ANTI-JAM DSP ENGAGED' : 'DIRECT PASS-THROUGH'}
            </span>
          </button>
        </div>

        {/* Center Section: Core Audio Pipeline Specs */}
        <div className="hidden lg:flex items-center space-x-2 font-mono text-[10px]">
          <div className="flex items-center space-x-1.5 bg-[#080d09] px-2 py-1 rounded-[2px] border border-[#223425] text-[#7ea385]">
            <Radio className="w-3 h-3 text-[#557b5c]" />
            <span className="text-[8px] uppercase tracking-wider text-[#557b5c]">UHF:</span>
            <span className="text-[#e8f2e6] font-bold">382.450 MHz</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#080d09] px-2 py-1 rounded-[2px] border border-[#223425] text-[#7ea385]">
            <span className="text-[8px] uppercase tracking-wider text-[#557b5c]">SAMPLING:</span>
            <span className="text-[#e8f2e6] font-semibold">{store.telemetry.sampleRate / 1000} kHz / 24-bit</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#080d09] px-2 py-1 rounded-[2px] border border-[#22e565]/30 text-[#22e565]">
            <span className="text-[8px] uppercase tracking-wider text-[#557b5c]">ENGINE:</span>
            <span className="font-bold">DEEPFILTERNET3 (ERB)</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#080d09] px-2 py-1 rounded-[2px] border border-[#223425] text-[#7ea385]">
            <span className="text-[8px] uppercase tracking-wider text-[#557b5c]">LATENCY:</span>
            <span className="text-[#22e565] font-bold">{store.telemetry.latencyMs} ms</span>
          </div>

          <div className="flex items-center space-x-1.5 bg-[#080d09] px-2 py-1 rounded-[2px] border border-[#223425] text-[#22e565]">
            <Lock className="w-3 h-3 text-[#22e565]" />
            <span className="text-[9px] font-bold tracking-wider">AES-256-GCM</span>
          </div>
        </div>

        {/* Right Section: Hardware Controls & Config */}
        <div className="flex items-center space-x-2">
          {/* Live Mic Arm Toggle */}
          <button
            onClick={store.toggleMicrophone}
            className={`px-2.5 py-1.5 rounded-[2px] border text-[10px] font-mono flex items-center space-x-1.5 transition-all ${
              store.isMicActive
                ? 'bg-[#ef4444]/20 border-[#ef4444]/60 text-[#ef4444] hover:bg-[#ef4444]/30 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                : 'bg-[#080d09] border-[#223425] text-[#7ea385] hover:text-[#e8f2e6] hover:border-[#2e4632]'
            }`}
            title="Toggle Live Audio Ingest from Physical Microphone"
          >
            {store.isMicActive ? <Mic className="w-3.5 h-3.5 text-[#ef4444] animate-pulse" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="font-bold tracking-wider">{store.isMicActive ? 'PTT ARMED: LIVE' : 'SIMULATION MODE'}</span>
          </button>

          {/* Master Audition Audio Mute Toggle */}
          <button
            onClick={store.toggleMasterMute}
            className={`p-1.5 rounded-[2px] border transition-all ${
              !store.isAudioMuted
                ? 'bg-[#22e565]/15 border-[#22e565]/40 text-[#22e565] hover:bg-[#22e565]/25 shadow-[0_0_6px_rgba(34,229,101,0.25)]'
                : 'bg-[#080d09] border-[#223425] text-[#7ea385] hover:text-[#e8f2e6] hover:border-[#2e4632]'
            }`}
            title={store.isAudioMuted ? "Unmute Tactical Speaker (Audition Output)" : "Mute Speaker Output"}
          >
            {!store.isAudioMuted ? <Volume2 className="w-4 h-4 text-[#22e565]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* System Settings Gear */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 rounded-[2px] border bg-[#080d09] border-[#223425] text-[#7ea385] hover:text-[#e8f2e6] hover:border-[#2e4632] transition-all"
            title="Tactical Workstation Configuration & Parameters"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Engineering Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b120c] border border-[#2e4632] rounded-[2px] w-full max-w-lg overflow-hidden shadow-2xl mil-corner-bracket">
            <div className="h-12 px-4 border-b border-[#223425] bg-[#0e1710] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-6 h-6 rounded-[2px] bg-[#22e565]/10 border border-[#22e565]/30 flex items-center justify-center text-[#22e565]">
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-stencil text-xs font-bold text-[#e8f2e6] tracking-wider uppercase">
                    US ARMY C4ISR AUDIO SYSTEM ARCHITECTURE
                  </h3>
                  <p className="text-[8px] font-mono text-[#7ea385]">
                    MIL-STD-810H Secure Tactical Terminal // TOC-ALPHA
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-[#7ea385] hover:text-[#e8f2e6] font-mono text-sm px-2 py-0.5 rounded hover:bg-[#223425]"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 font-mono text-xs text-[#7ea385]">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[#7ea385]">
                  <span>DEEPFILTERNET3 ANTI-JAM ATTENUATION DEPTH</span>
                  <span className="text-[#22e565] font-bold">{store.suppressionDepth}%</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="100" 
                  value={store.suppressionDepth} 
                  onChange={(e) => store.setSuppressionDepth(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#060a07] rounded appearance-none cursor-pointer accent-[#22e565]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[#7ea385]">
                  <span>VAD (VOICE ACTIVITY DETECTOR) THRESHOLD</span>
                  <span className="text-[#22e565] font-bold">{store.vadSensitivity}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="95" 
                  value={store.vadSensitivity} 
                  onChange={(e) => store.setVadSensitivity(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#060a07] rounded appearance-none cursor-pointer accent-[#22e565]"
                />
              </div>

              <div className="pt-2 border-t border-[#223425] grid grid-cols-2 gap-2 text-[10px]">
                <div className="p-2 rounded-[2px] bg-[#060a07] border border-[#223425]">
                  <span className="text-[#557b5c] block mb-0.5 text-[8px]">TACTICAL CODEC</span>
                  <span className="text-[#e8f2e6] font-semibold">Cirrus CS4272 Mil-Spec I2S</span>
                </div>
                <div className="p-2 rounded-[2px] bg-[#060a07] border border-[#223425]">
                  <span className="text-[#557b5c] block mb-0.5 text-[8px]">HEADSET TRANSDUCER</span>
                  <span className="text-[#e8f2e6] font-semibold">Dual Hypercardioid + Throat</span>
                </div>
                <div className="p-2 rounded-[2px] bg-[#060a07] border border-[#223425]">
                  <span className="text-[#557b5c] block mb-0.5 text-[8px]">INFERENCE LATENCY</span>
                  <span className="text-[#22e565] font-bold">0.82 ms (10ms window)</span>
                </div>
                <div className="p-2 rounded-[2px] bg-[#060a07] border border-[#223425]">
                  <span className="text-[#557b5c] block mb-0.5 text-[8px]">COMSEC PROTOCOL</span>
                  <span className="text-[#22e565] font-bold">AES-256-GCM / NSA Suite B</span>
                </div>
              </div>
            </div>

            <div className="h-11 px-4 border-t border-[#223425] bg-[#080d09] flex items-center justify-between">
              <span className="text-[9px] font-mono text-[#557b5c]">
                SECURE CONSOLE STATUS: VERIFIED
              </span>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-3.5 py-1 rounded-[1px] bg-[#22e565] text-[#060a07] font-mono text-xs font-bold hover:bg-[#22e565]/90 transition-all shadow-[0_0_8px_rgba(34,229,101,0.35)]"
              >
                APPLY &amp; RETURN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
