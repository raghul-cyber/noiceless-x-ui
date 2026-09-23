import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Activity,
  Radio,
  Sliders,
  Sparkles,
  Database,
  Crosshair
} from 'lucide-react';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { PIPELINE_STAGES } from '../../data/scenariosData';
import { audioEngine } from '../../audio/audioEngine';

export const WorkflowController: React.FC = () => {
  const {
    workflowStep,
    isWorkflowPlaying,
    workflowSpeed,
    audioProbe,
    showHud,
    currentMode,
    activeHudTab,
    customDataset
  } = useViewerStore();

  const [stepProgress, setStepProgress] = useState<number>(0);

  const activeStage = PIPELINE_STAGES.find((s) => s.step === workflowStep) || PIPELINE_STAGES[0];
  const stepDurationMs = 4500 / workflowSpeed;

  // Auto-advance loop when workflow is playing
  useEffect(() => {
    if (!isWorkflowPlaying) {
      setStepProgress(0);
      return;
    }

    const intervalMs = 50;
    const increment = (intervalMs / stepDurationMs) * 100;

    const timer = setInterval(() => {
      setStepProgress((prev) => {
        if (prev >= 100) {
          viewerStore.nextWorkflowStep();
          return 0;
        }
        return prev + increment;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isWorkflowPlaying, workflowStep, stepDurationMs]);

  // Reset progress when step changes manually
  useEffect(() => {
    setStepProgress(0);
  }, [workflowStep]);

  // Handle Real Audio Probe with Web Audio API
  const handleToggleAudioProbe = async () => {
    await audioEngine.initAudio();
    if (audioProbe === 'OFF') {
      let targetProbe: 'AMBIENT' | 'IN_EAR' | 'BOOM_MIC' | 'CLEAN_OUT' = 'AMBIENT';
      if (workflowStep === 1 || workflowStep === 2) targetProbe = 'AMBIENT';
      else if (workflowStep === 3 || workflowStep === 4 || workflowStep === 5) targetProbe = 'IN_EAR';
      else if (workflowStep === 6) targetProbe = 'BOOM_MIC';
      else targetProbe = 'CLEAN_OUT';

      viewerStore.setAudioProbe(targetProbe);
      viewerStore.setState({ isMuted: false });
    } else {
      viewerStore.setAudioProbe('OFF');
      viewerStore.setState({ isMuted: true });
    }
  };

  const stageShortTitles = [
    '1. THREAT INGEST',
    '2. REF TRANSDUCER',
    '3. NEURAL DSP CORE',
    '4. ANTI-NOISE DRIVER',
    '5. 180° NULL ZONE',
    '6. BOOM TRANSDUCER',
    '7. INTEL CLEAN OUT'
  ];

  return (
    <header className="absolute top-2 left-3 right-3 z-30 pointer-events-auto select-none font-mono">
      <div className="mil-corner-bracket bg-[#0b120c]/95 border border-[#223425] px-3 py-1.5 rounded shadow-2xl backdrop-blur-md flex items-center justify-between gap-2">
        {/* Left: Tactical Mission Stage Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#22e565]/10 border border-[#22e565]/40 text-[#22e565]">
            <Crosshair className="w-3.5 h-3.5" />
            <span className="font-stencil font-bold text-[11px] tracking-wider text-[#f0fdf4]">TOC-AUDIO HUD</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-[#8ba695]">
            <span className="text-[#4e6a5b]">|</span>
            <span className="text-[#22e565] font-stencil font-bold">PHASE {workflowStep}/7:</span>
            <span className="text-[#f0fdf4] font-semibold truncate max-w-[180px] uppercase">{activeStage.title}</span>
          </div>
        </div>

        {/* Center: 7-Stage Stepper Buttons (Tactical Military Strip) */}
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {PIPELINE_STAGES.map((stage) => {
            const isCurrent = stage.step === workflowStep;
            const isCompleted = stage.step < workflowStep;

            return (
              <button
                key={stage.step}
                onClick={() => viewerStore.setWorkflowStep(stage.step)}
                className={`relative group flex items-center gap-1 px-2 py-1 rounded border text-[10px] font-stencil transition-all whitespace-nowrap overflow-hidden ${
                  isCurrent
                    ? 'bg-[#22e565]/20 border-[#22e565] text-[#f0fdf4] shadow-[0_0_10px_rgba(34,229,101,0.35)] font-bold'
                    : isCompleted
                    ? 'bg-[#070e09] border-[#223425] text-[#8ba695] hover:text-[#f0fdf4]'
                    : 'bg-[#050a07] border-[#1b2b1d] text-[#4e6a5b] hover:text-[#8ba695]'
                }`}
                title={stage.title}
              >
                {/* Progress bar fill for active stage when playing */}
                {isCurrent && isWorkflowPlaying && (
                  <div
                    className="absolute top-0 left-0 bottom-0 bg-[#22e565]/25 transition-all duration-75 pointer-events-none"
                    style={{ width: `${stepProgress}%` }}
                  />
                )}
                <span
                  className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[8px] font-bold relative z-10 font-mono ${
                    isCurrent
                      ? 'bg-[#22e565] text-black'
                      : isCompleted
                      ? 'bg-[#1b2b1d] text-[#22e565]'
                      : 'bg-[#0b120c] text-[#4e6a5b]'
                  }`}
                >
                  {stage.step}
                </span>
                <span className="relative z-10 hidden sm:inline text-[9px] tracking-wide">
                  {stageShortTitles[stage.step - 1].split('. ')[1]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Transport Controls & Telemetry Drawer Toggle */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Step Backwards */}
          <button
            onClick={() => viewerStore.prevWorkflowStep()}
            className="p-1 rounded bg-[#070e09] border border-[#223425] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#22e565]/40 transition-all"
            title="Previous Phase"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => viewerStore.toggleWorkflowPlaying()}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-stencil font-bold transition-all ${
              isWorkflowPlaying
                ? 'bg-[#22e565]/20 text-[#22e565] border border-[#22e565]'
                : 'bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 hover:bg-[#f59e0b]/30'
            }`}
            title={isWorkflowPlaying ? 'Pause Mission Phase Auto-Cycle' : 'Engage Mission Phase Auto-Cycle'}
          >
            {isWorkflowPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden md:inline">{isWorkflowPlaying ? 'AUTO' : 'MANUAL'}</span>
          </button>

          {/* Step Forward */}
          <button
            onClick={() => viewerStore.nextWorkflowStep()}
            className="p-1 rounded bg-[#070e09] border border-[#223425] text-[#8ba695] hover:text-[#f0fdf4] hover:border-[#22e565]/40 transition-all"
            title="Next Phase"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Speed Multiplier */}
          <button
            onClick={() => {
              const nextSpeed = workflowSpeed === 1 ? 2 : workflowSpeed === 2 ? 0.5 : 1;
              viewerStore.setWorkflowSpeed(nextSpeed);
            }}
            className="px-1.5 py-1 rounded bg-[#070e09] border border-[#223425] text-[9px] text-[#8ba695] hover:text-[#f0fdf4] font-stencil"
            title="Cycle Speed"
          >
            {workflowSpeed}x
          </button>

          {/* Audio Probe Toggle */}
          <button
            onClick={handleToggleAudioProbe}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-stencil font-bold border transition-all ${
              audioProbe !== 'OFF'
                ? 'bg-[#22e565]/25 text-[#22e565] border-[#22e565]'
                : 'bg-[#070e09] text-[#8ba695] border-[#223425] hover:text-[#f0fdf4]'
            }`}
            title="Listen to Real-Time Synthesizer Sound"
          >
            {audioProbe !== 'OFF' ? <Volume2 className="w-3 h-3 text-[#22e565]" /> : <VolumeX className="w-3 h-3" />}
            <span className="hidden sm:inline">{audioProbe !== 'OFF' ? audioProbe : 'PROBE'}</span>
          </button>

          {/* Custom Dataset Drawer Toggle */}
          <button
            onClick={() => {
              if (showHud && activeHudTab === 'dataset') {
                viewerStore.closeHud();
              } else {
                viewerStore.setActiveHudTab('dataset');
              }
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-stencil font-bold transition-all ${
              showHud && activeHudTab === 'dataset'
                ? 'bg-[#22e565]/25 text-[#22e565] border border-[#22e565]'
                : customDataset
                ? 'bg-[#22e565]/10 text-[#22e565] border border-[#22e565]/40 hover:border-[#22e565]'
                : 'bg-[#070e09] text-[#8ba695] border border-[#223425] hover:border-[#22e565]/50 hover:text-[#f0fdf4]'
            }`}
            title="Ingest Battlefield Threat CSV Dataset"
          >
            <Database className="w-3 h-3 text-[#22e565]" />
            <span className="hidden md:inline">{customDataset ? 'CSV ARMED' : 'DATASET'}</span>
            {customDataset && <span className="w-1.5 h-1.5 rounded-full bg-[#22e565] animate-pulse" />}
          </button>

          {/* Oscilloscope / Waveforms Drawer Toggle */}
          <button
            onClick={() => {
              if (showHud && activeHudTab === 'oscilloscope') {
                viewerStore.closeHud();
              } else {
                viewerStore.setActiveHudTab('oscilloscope');
              }
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-stencil font-bold transition-all ${
              showHud && activeHudTab === 'oscilloscope'
                ? 'bg-[#22e565]/25 text-[#22e565] border border-[#22e565]'
                : 'bg-[#070e09] text-[#8ba695] border border-[#223425] hover:border-[#2e4632] hover:text-[#f0fdf4]'
            }`}
            title="Toggle DSP Waveforms and FFT Oscilloscope"
          >
            <Sliders className="w-3 h-3" />
            <span className="hidden md:inline">SCOPE</span>
          </button>
        </div>
      </div>
    </header>
  );
};
