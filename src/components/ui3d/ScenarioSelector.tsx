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
    ? 'absolute bottom-24 left-6 z-20 bg-[#08140e]/95 border border-[#143526] p-3 rounded-xl shadow-xl max-w-2xl font-mono'
    : 'p-3 rounded-xl bg-[#08140e] border border-[#143526] w-full font-mono';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00e599] animate-pulse" />
          <h3 className="text-xs tracking-wider text-[#f0fdf4] font-bold uppercase">
            REALISTIC ENVIRONMENT SIMULATION (YAMNET AI)
          </h3>
        </div>
        <button
          onClick={() => viewerStore.setActiveHudTab('dataset')}
          className="flex items-center gap-1 text-[9px] font-mono text-[#00e599] hover:text-[#f0fdf4] bg-[#00e599]/10 border border-[#00e599]/30 px-2 py-0.5 rounded transition-all"
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
              className={`flex flex-col items-start p-2 rounded-lg border text-left transition-all duration-150 select-none ${
                isSelected
                  ? 'bg-[#00e599]/15 border-[#00e599] text-[#f0fdf4] shadow-[0_0_12px_rgba(0,229,153,0.25)]'
                  : 'bg-[#030906] border-[#143526] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#1e4d38]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold uppercase truncate">
                  {isCustom ? (customDataset ? 'CUSTOM CSV' : '+ LOAD CSV') : sc.name.split('/')[0]}
                </span>
                {isCustom && customDataset && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e599]" />
                )}
              </div>
              <span className={`text-[9px] font-semibold mt-0.5 font-mono ${isSelected ? 'text-[#00e599]' : 'text-[#8ba695]'}`}>
                {sc.splDb} dB SPL
              </span>
              <span className="text-[8px] text-[#4e6a5b] truncate w-full">
                {isCustom && !customDataset ? 'Click to import file' : sc.freqRange}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
