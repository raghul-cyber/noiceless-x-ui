import React from 'react';
import { Volume2, AlertTriangle, ShieldCheck, Database, Upload, Crosshair } from 'lucide-react';
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
    ? 'mil-corner-bracket absolute bottom-24 left-6 z-20 bg-[#0b120c]/95 border border-[#223425] p-3 rounded shadow-xl max-w-2xl font-mono'
    : 'mil-corner-bracket p-3 rounded bg-[#0b120c] border border-[#223425] w-full font-mono';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-[#22e565]" />
          <h3 className="text-xs tracking-wider text-[#f0fdf4] font-stencil font-bold uppercase">
            BATTLEFIELD ENVIRONMENT THREAT PROFILES
          </h3>
        </div>
        <button
          onClick={() => viewerStore.setActiveHudTab('dataset')}
          className="flex items-center gap-1 text-[9px] font-stencil text-[#22e565] hover:text-[#f0fdf4] bg-[#22e565]/10 border border-[#22e565]/30 px-2 py-0.5 rounded transition-all"
        >
          <Database className="w-2.5 h-2.5" />
          <span>{customDataset ? `${customDataset.fileName}` : 'INGEST CSV'}</span>
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
              className={`flex flex-col items-start p-2 rounded border text-left transition-all duration-150 select-none ${
                isSelected
                  ? 'bg-[#22e565]/15 border-[#22e565] text-[#f0fdf4] shadow-[0_0_10px_rgba(34,229,101,0.25)]'
                  : 'bg-[#070e09] border-[#223425] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#2e4632]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold font-stencil uppercase truncate">
                  {isCustom ? (customDataset ? 'CUSTOM CSV' : '+ LOAD CSV') : sc.name.split('/')[0]}
                </span>
                {isCustom && customDataset && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22e565]" />
                )}
              </div>
              <span className={`text-[9px] font-bold mt-0.5 font-mono ${isSelected ? 'text-[#22e565]' : 'text-[#8ba695]'}`}>
                {sc.splDb} dB SPL
              </span>
              <span className="text-[8px] text-[#4e6a5b] truncate w-full">
                {isCustom && !customDataset ? 'Click to import CSV' : sc.freqRange}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
