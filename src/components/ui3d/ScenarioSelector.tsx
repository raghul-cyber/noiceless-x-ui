import React from 'react';
import { Volume2, AlertTriangle, ShieldCheck, Database, Upload } from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { NOISE_SCENARIOS, getNoiseScenario } from '../../data/scenariosData';
import { audioSynthesizer } from '../../audio/audioSynthesizer';

interface ScenarioSelectorProps {
  standalone?: boolean;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ standalone = false }) => {
  const { noiseScenario, isMuted, audioVolume, ancActive, customDataset } = useViewerStore();

  const handleSelect = (id: typeof noiseScenario) => {
    if (id === 'custom_dataset' && !customDataset) {
      viewerStore.setActiveHudTab('dataset');
      return;
    }
    viewerStore.setScenario(id);
    audioSynthesizer.updateScenario(id, isMuted, audioVolume, ancActive);
  };

  const containerClass = standalone
    ? 'absolute bottom-24 left-6 z-20 tactical-glass p-3 rounded-xl border border-[#00e5ff]/25 shadow-xl max-w-2xl'
    : 'p-3 rounded-xl bg-[#090e17]/80 border border-[#1e293b] w-full font-mono';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <h3 className="font-tech text-xs tracking-wider text-slate-300 font-bold uppercase">
            REALISTIC ENVIRONMENT SIMULATION (YAMNET AI)
          </h3>
        </div>
        <button
          onClick={() => viewerStore.setActiveHudTab('dataset')}
          className="flex items-center gap-1 text-[9px] font-mono text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded transition-all"
        >
          <Database className="w-2.5 h-2.5" />
          <span>{customDataset ? `${customDataset.fileName}` : 'IMPORT CSV'}</span>
        </button>
      </div>

      {/* Grid of Scenarios including Custom Dataset */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {NOISE_SCENARIOS.map((rawSc) => {
          const sc = getNoiseScenario(rawSc.id, customDataset);
          const isSelected = noiseScenario === sc.id;
          const isCustom = sc.id === 'custom_dataset';

          return (
            <button
              key={sc.id}
              onClick={() => handleSelect(sc.id)}
              className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all duration-200 select-none ${
                isSelected
                  ? isCustom
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_12px_rgba(52,211,153,0.35)] scale-[1.02]'
                    : 'bg-[#00e5ff]/20 border-[#00e5ff] text-white shadow-[0_0_12px_rgba(0,229,255,0.35)] scale-[1.02]'
                  : isCustom
                  ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300 hover:border-emerald-500/60'
                  : 'bg-[#090d15]/80 border-[#1f293d] text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase truncate">
                  {isCustom ? (customDataset ? 'CUSTOM CSV' : '+ LOAD CSV') : sc.name.split('/')[0]}
                </span>
                {isCustom && customDataset && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </div>
              <span className={`text-[9px] font-semibold mt-0.5 ${isCustom ? 'text-emerald-400' : 'text-[#00e5ff]'}`}>
                {sc.splDb} dB SPL
              </span>
              <span className="text-[8px] text-slate-400 truncate w-full">
                {isCustom && !customDataset ? 'Click to import file' : sc.freqRange}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
