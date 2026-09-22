import React from 'react';
import { Html } from '@react-three/drei';
import { useViewerStore } from '../../store/useViewerStore';
import { HARDWARE_COMPONENTS } from '../../data/componentsData';

interface LabelConfig {
  shortName: string;
  arrow: string;
  color: string;
  offsetX: number;
  offsetY: number;
}

// Arrow marks + short names in vibrant tactical neon colors
// NO BOXES, NO BORDERS, NO CONTAINERS: PURE VIBRANT GLOWING TEXT + DIRECTIONAL ARROWS!
const LABEL_CONFIGS: Record<string, LabelConfig> = {
  headband: {
    shortName: 'HEADSET SYSTEM',
    arrow: '→',
    color: '#38bdf8', // Vibrant Sky Blue
    offsetX: 0.16,
    offsetY: -0.03, // Right side of helmet at temple level, safely below top telemetry header!
  },
  externalRefMic: {
    shortName: 'EXT REF MIC',
    arrow: '←',
    color: '#00e599', // Vibrant Tactical Mint
    offsetX: -0.16,
    offsetY: 0.01,
  },
  speakerDriver: {
    shortName: '40mm SPEAKER',
    arrow: '↗',
    color: '#60a5fa', // Vibrant Royal Blue
    offsetX: 0.14,
    offsetY: 0.05,
  },
  internalErrorMic: {
    shortName: 'INT ERROR MIC',
    arrow: '↙',
    color: '#d500f9', // Vibrant Neon Magenta
    offsetX: -0.15,
    offsetY: -0.05,
  },
  boomMic: {
    shortName: 'BOOM MIC',
    arrow: '↘',
    color: '#00e676', // Vibrant Neon Green
    offsetX: 0.13,
    offsetY: -0.01,
  },
  cableHarness: {
    shortName: 'COMMS WIRE / TRAVEL PATH',
    arrow: '⚡',
    color: '#fbbf24', // Electric Gold
    offsetX: -0.18,
    offsetY: 0.02,
  },
  raspberryPi: {
    shortName: 'RASPBERRY PI 4',
    arrow: '↖',
    color: '#ffb700', // Vibrant Neon Amber Gold
    offsetX: -0.19,
    offsetY: 0.05,
  },
  waistPouch: {
    shortName: 'WAIST CARRIER',
    arrow: '↙',
    color: '#ff9100', // Vibrant Tactical Orange
    offsetX: -0.19,
    offsetY: -0.05,
  },
};

export const ComponentLabels3D: React.FC = () => {
  const {
    showLabels,
    currentMode,
    explodedProgress,
    workflowStep,
    selectedComponentId,
    hoveredComponentId
  } = useViewerStore();

  if (!showLabels || currentMode === '360') return null;

  // Active component for current workflow step
  const getWorkflowComponent = (step: number): string | null => {
    switch (step) {
      case 2: return 'externalRefMic';
      case 3: return 'raspberryPi';
      case 4: return 'speakerDriver';
      case 5: return 'internalErrorMic';
      case 6: return 'boomMic';
      case 7: return 'waistPouch';
      default: return null;
    }
  };

  // If a component is hovered or selected, prioritize showing ONLY that component
  const activeTarget = hoveredComponentId || selectedComponentId;

  let visibleKeys: string[] = [];
  if (activeTarget && LABEL_CONFIGS[activeTarget]) {
    visibleKeys = [activeTarget];
  } else if (currentMode === 'WORKFLOW') {
    const wfComp = getWorkflowComponent(workflowStep);
    visibleKeys = wfComp ? [wfComp] : [];
  } else if (currentMode === 'EXPLODED') {
    visibleKeys = ['headband', 'externalRefMic', 'speakerDriver', 'internalErrorMic', 'boomMic', 'raspberryPi'];
  } else {
    // In assembled/standard modes, show only primary anchors, cleanly spaced
    visibleKeys = ['externalRefMic', 'boomMic', 'raspberryPi'];
  }

  return (
    <group name="ComponentLabelsGroup">
      {visibleKeys.map((key) => {
        const comp = HARDWARE_COMPONENTS[key];
        const config = LABEL_CONFIGS[key];
        if (!comp || !config) return null;

        // Compute dynamic 3D position based on exploded separation
        const posX = comp.position[0] + comp.explodedOffset[0] * explodedProgress;
        const posY = comp.position[1] + comp.explodedOffset[1] * explodedProgress;
        const posZ = comp.position[2] + comp.explodedOffset[2] * explodedProgress;

        return (
          <group key={comp.id} position={[posX, posY, posZ]}>
            {/* Tiny Glowing Center Anchor Dot (3mm) */}
            <mesh>
              <sphereGeometry args={[0.0035, 8, 8]} />
              <meshBasicMaterial color={config.color} />
            </mesh>

            {/* Pure Glowing HTML Label: Directional Arrow + Vibrant Text (Zero Boxes) */}
            <Html
              position={[config.offsetX, config.offsetY, 0]}
              center
              distanceFactor={3.2}
              zIndexRange={[100, 0]}
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                padding: '0',
                margin: '0',
                outline: 'none',
              }}
            >
              <div
                className="whitespace-nowrap flex items-center gap-1 font-mono text-[9px] font-black tracking-wider transition-opacity duration-150"
                style={{
                  color: config.color,
                  textShadow: `0 0 8px ${config.color}, 0 0 16px ${config.color}80, 0 1px 3px #000`,
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  padding: '0',
                }}
              >
                <span className="text-[12px] font-black leading-none select-none">{config.arrow}</span>
                <span className="leading-none">{config.shortName}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};
