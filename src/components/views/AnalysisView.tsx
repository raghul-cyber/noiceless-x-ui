import React, { useState } from 'react';
import { BarChart3, ShieldAlert, Cpu, Activity, Zap, Radio, Target, Crosshair } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface AnalysisViewProps {
  store: ReturnType<typeof useAppStore>;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ store }) => {
  const [selectedThreatProfile, setSelectedThreatProfile] = useState<string>('APACHE');

  const threatProfiles = [
    {
      id: 'APACHE',
      name: 'AH-64E APACHE ROTOR WASH',
      spl: '112 dB SPL',
      dominantFreq: '85 Hz / 420 Hz',
      attenuation: '-39.4 dB',
      snrDelta: '+34.2 dB',
      status: 'NEURAL SUPPRESSED'
    },
    {
      id: 'HOWITZER',
      name: '155MM M777 BLAST OVERPRESSURE',
      spl: '144 dB PEAK',
      dominantFreq: '24 Hz IMPULSE',
      attenuation: '-44.8 dB',
      snrDelta: '+38.5 dB',
      status: 'PEAK CLAMPED'
    },
    {
      id: 'ABRAMS',
      name: 'M1A2 ABRAMS AGT1500 TURBINE',
      spl: '106 dB SPL',
      dominantFreq: '160 Hz - 1.2 kHz',
      attenuation: '-38.1 dB',
      snrDelta: '+32.8 dB',
      status: 'NEURAL SUPPRESSED'
    },
    {
      id: 'GUNFIRE',
      name: 'M4A1 5.56MM SUPERSONIC CRACK',
      spl: '138 dB PEAK',
      dominantFreq: '2.4 kHz TRANSIENT',
      attenuation: '-42.0 dB',
      snrDelta: '+36.1 dB',
      status: 'DSP GATED'
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-3.5 space-y-3 select-none bg-[#060a07] font-mono text-xs">
      {/* Header Bar */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-[#22e565]/10 border border-[#22e565]/40 flex items-center justify-center text-[#22e565]">
              <Crosshair className="w-3.5 h-3.5" />
            </div>
            <h1 className="font-stencil text-xs font-bold tracking-widest text-[#f0fdf4] uppercase">
              TACTICAL ACOUSTIC &amp; SPECTRAL THREAT ANALYSIS // TOC-ALPHA
            </h1>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#22e565]/15 border border-[#22e565]/40 text-[#22e565] font-bold">
              MIL-STD-810H
            </span>
          </div>
          <p className="text-[#8ba695] text-[11px] mt-1 font-mono">
            Full-band spectral attenuation, harmonic distortion, PESQ-WB MOS speech clarity, and battlefield threat signature profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-[#070e09] border border-[#223425] text-[#8ba695] text-[10px]">
            STANAG 4774: <strong className="text-[#22e565]">CLASSIFIED // NOFORN</strong>
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] block uppercase tracking-wider font-bold">BATTLEFIELD INPUT SNR</span>
            <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
          </div>
          <span className="text-xl font-extrabold text-[#f59e0b] block mt-1">+{store.telemetry.snrInput} dB</span>
          <div className="flex items-center justify-between text-[10px] text-[#8ba695] mt-1">
            <span>Severe Acoustic Noise</span>
            <span className="text-[#f59e0b]">HAZARD ZONE</span>
          </div>
        </div>

        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] block uppercase tracking-wider font-bold">TACTICAL ENHANCED SNR</span>
            <span className="w-2 h-2 rounded-full bg-[#22e565] shadow-[0_0_6px_#22e565]" />
          </div>
          <span className="text-xl font-extrabold text-[#22e565] block mt-1">+{store.telemetry.snrOutput} dB</span>
          <div className="flex items-center justify-between text-[10px] text-[#8ba695] mt-1">
            <span>Anti-Jam Neural Voice</span>
            <span className="text-[#22e565] font-bold">+{store.telemetry.snrOutput - store.telemetry.snrInput} dB GAIN</span>
          </div>
        </div>

        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] block uppercase tracking-wider font-bold">TOTAL HARMONIC DISTORTION</span>
            <Activity className="w-3.5 h-3.5 text-[#22e565]" />
          </div>
          <span className="text-xl font-extrabold text-[#f0fdf4] block mt-1">&lt; 0.04% THD</span>
          <div className="flex items-center justify-between text-[10px] text-[#8ba695] mt-1">
            <span>@ 1 kHz, 94 dB SPL</span>
            <span className="text-[#22e565]">MIL-PRF-49500</span>
          </div>
        </div>

        <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#4e6a5b] block uppercase tracking-wider font-bold">PESQ-WB MOS BENCHMARK</span>
            <ShieldAlert className="w-3.5 h-3.5 text-[#22e565]" />
          </div>
          <span className="text-xl font-extrabold text-[#22e565] block mt-1">4.42 / 5.0</span>
          <div className="flex items-center justify-between text-[10px] text-[#8ba695] mt-1">
            <span>ITU-T P.862 Standard</span>
            <span className="text-[#22e565] font-bold">COMBAT INTEL GRADE</span>
          </div>
        </div>
      </div>

      {/* Battlefield Acoustic Threat Signatures Selector */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3 space-y-2.5 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
          <div className="flex items-center space-x-2">
            <Target className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span className="font-stencil text-xs font-bold text-[#f0fdf4] uppercase tracking-wider">
              FIELD THREAT PROFILES &amp; ACTIVE CANCELLATION RESPONSE
            </span>
          </div>
          <span className="text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded border border-[#f59e0b]/30">
            ARMED &amp; ENGAGED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {threatProfiles.map((p) => {
            const isSelected = selectedThreatProfile === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedThreatProfile(p.id)}
                className={`p-2.5 rounded border text-left transition-all ${
                  isSelected
                    ? 'bg-[#22e565]/15 border-[#22e565] shadow-[0_0_12px_rgba(34,229,101,0.25)]'
                    : 'bg-[#070e09] border-[#223425] hover:border-[#2e4632] hover:bg-[#0c160e]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold font-stencil text-[#f0fdf4]">{p.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-[#22e565] animate-ping" />}
                </div>
                <div className="mt-1.5 flex justify-between text-[10px]">
                  <span className="text-[#8ba695]">PEAK SPL:</span>
                  <span className="text-[#f59e0b] font-bold">{p.spl}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-[#8ba695]">BAND:</span>
                  <span className="text-[#f0fdf4]">{p.dominantFreq}</span>
                </div>
                <div className="mt-1 pt-1 border-t border-[#223425] flex justify-between text-[10px]">
                  <span className="text-[#8ba695]">NULL ATTEN:</span>
                  <span className="text-[#22e565] font-bold">{p.attenuation}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Octave Band Noise Attenuation Curve (Military CRT Radar Style) */}
      <div className="mil-corner-bracket bg-[#0b120c] border border-[#223425] rounded p-3.5 space-y-3 shadow-md">
        <div className="flex items-center justify-between pb-2 border-b border-[#223425]">
          <div className="flex items-center space-x-2">
            <Radio className="w-3.5 h-3.5 text-[#22e565]" />
            <span className="font-stencil text-xs font-bold text-[#f0fdf4] uppercase tracking-wider">
              OCTAVE BAND FREQUENCY ATTENUATION SPECTRUM (1/3 OCTAVE)
            </span>
          </div>
          <span className="text-[10px] text-[#22e565] bg-[#22e565]/10 px-2 py-0.5 rounded border border-[#22e565]/30">
            CLOSED-LOOP MILITARY ACOUSTIC RESPONSE
          </span>
        </div>

        <div className="relative h-52 flex items-end justify-between gap-2 pt-6 px-3 text-[10px] bg-[#070e09] border border-[#223425] rounded overflow-hidden">
          {/* Background CRT Horizontal Graticule Lines */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-2 opacity-15">
            <div className="border-b border-[#22e565] w-full" />
            <div className="border-b border-[#22e565] w-full" />
            <div className="border-b border-[#22e565] w-full" />
            <div className="border-b border-[#22e565] w-full" />
            <div className="border-b border-[#22e565] w-full" />
          </div>

          {[
            { band: '63Hz', passive: 8, active: 28 },
            { band: '125Hz', passive: 14, active: 34 },
            { band: '250Hz', passive: 22, active: 39 },
            { band: '500Hz', passive: 28, active: 42 },
            { band: '1kHz', passive: 34, active: 44 },
            { band: '2kHz', passive: 38, active: 45 },
            { band: '4kHz', passive: 43, active: 46 },
            { band: '8kHz', passive: 40, active: 42 },
          ].map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end relative z-10">
              <div className="w-full flex items-end justify-center gap-1.5 h-36">
                {/* Passive Seal Bar (Drab Olive Green) */}
                <div 
                  style={{ height: `${(item.passive / 50) * 100}%` }} 
                  className="w-1/2 bg-[#1b2b1d] rounded-t-[2px] border-t border-[#2e4632]"
                  title={`Passive Ballistic Seal: ${item.passive} dB`}
                />
                {/* Active Anti-Jam Neural DSP Bar (Phosphor Green) */}
                <div 
                  style={{ height: `${(item.active / 50) * 100}%` }} 
                  className="w-1/2 bg-[#22e565] rounded-t-[2px] shadow-[0_0_10px_rgba(34,229,101,0.4)]"
                  title={`Active Neural Cancellation: ${item.active} dB`}
                />
              </div>
              <span className="text-[#8ba695] text-[9px]">{item.band}</span>
              <span className="text-[#22e565] font-bold text-[10px]">-{item.active}dB</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 pt-2 text-[10px] text-[#8ba695] border-t border-[#223425]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#1b2b1d] border border-[#2e4632] rounded-[2px]" />
            <span>PASSIVE BALLISTIC EARCUP SEAL (NRR 28 dB MIL-SPEC)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[#22e565] rounded-[2px] shadow-[0_0_6px_#22e565]" />
            <span className="text-[#22e565] font-bold">TOTAL HYBRID ATTENUATION (DEEPFILTERNET3 + FxLMS NULL)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
