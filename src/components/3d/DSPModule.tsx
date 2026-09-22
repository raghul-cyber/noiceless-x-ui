import React from 'react';
import * as THREE from 'three';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createBrushedSteel, createGoldContact, createDarkCoatedMetal } from '../../materials/hardwareMaterials';

interface DSPModuleProps {
  explodeDistance?: number;
}

export const DSPModule: React.FC<DSPModuleProps> = ({ explodeDistance = 0 }) => {
  const { selectedComponentId, hoveredComponentId, currentMode } = useViewerStore();
  const isSelected = selectedComponentId === 'dspModule';
  const isHovered = hoveredComponentId === 'dspModule';
  const isXRay = currentMode === 'X-RAY';

  const offsetY = -explodeDistance * 0.8;

  return (
    <group
      name="DSPAudioModule"
      position={[0, offsetY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'dspModule');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('dspModule');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* Black / Dark Blue FR4 Audio Daughterboard */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.025, 0.54]} />
        <meshStandardMaterial
          color={
            isSelected
              ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
              : isHovered
              ? new THREE.Color('#253b5c')
              : new THREE.Color('#141d2b')
          }
          roughness={0.4}
          metalness={0.2}
          transparent={isXRay}
          opacity={isXRay ? 0.45 : 1.0}
        />
      </mesh>

      {/* Main High-Speed Floating Point DSP Processor (BGA Package with Ceramic Heat Spreader) */}
      <mesh position={[-0.08, 0.02, 0]} castShadow>
        <boxGeometry args={[0.24, 0.018, 0.24]} />
        <meshStandardMaterial color={new THREE.Color('#111827')} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Ultra-Low Latency 24-bit / 96 kHz Audio ADC/DAC Codec Chip */}
      <mesh position={[0.2, 0.018, 0.12]} castShadow>
        <boxGeometry args={[0.16, 0.016, 0.14]} />
        <meshStandardMaterial color={new THREE.Color('#1f2937')} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* High-Precision Temperature Compensated Crystal Oscillator (TCXO) */}
      <mesh position={[0.22, 0.02, -0.1]} castShadow>
        <boxGeometry args={[0.08, 0.022, 0.06]} />
        <primitive object={createBrushedSteel()} attach="material" />
      </mesh>

      {/* Low-ESR Tantalum & Electrolytic Audio Decoupling Capacitors */}
      {[-0.28, -0.22, 0.32].map((xOff, idx) => (
        <mesh key={idx} position={[xOff, 0.04, -0.16]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.06, 12]} />
          <meshStandardMaterial color={new THREE.Color(TACTICAL_COLORS.goldContact)} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Coaxial Micro Audio Terminals (Differential Reference & Error Line Inputs) */}
      <mesh position={[-0.35, 0.03, 0.18]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
        <primitive object={createGoldContact()} attach="material" />
      </mesh>
      <mesh position={[-0.35, 0.03, 0.06]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.06, 16]} />
        <primitive object={createGoldContact()} attach="material" />
      </mesh>

      {/* Interconnect Ribbon Header Pins connecting to Raspberry Pi */}
      <mesh position={[-0.1, -0.02, -0.23]}>
        <boxGeometry args={[0.48, 0.04, 0.05]} />
        <primitive object={createDarkCoatedMetal()} attach="material" />
      </mesh>
    </group>
  );
};
