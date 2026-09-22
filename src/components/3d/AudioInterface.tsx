import React from 'react';
import * as THREE from 'three';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createBrushedSteel, createGoldContact } from '../../materials/hardwareMaterials';

interface AudioInterfaceProps {
  explodeDistance?: number;
}

export const AudioInterface: React.FC<AudioInterfaceProps> = ({ explodeDistance = 0 }) => {
  const { selectedComponentId, hoveredComponentId, currentMode } = useViewerStore();
  const isSelected = selectedComponentId === 'audioInterface';
  const isHovered = hoveredComponentId === 'audioInterface';
  const isXRay = currentMode === 'X-RAY';

  const offsetY = explodeDistance * 0.4;

  return (
    <group
      name="AudioInterfaceSection"
      position={[0, offsetY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'audioInterface');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('audioInterface');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* Matte Dark Violet / Charcoal Circuit Board */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.82, 0.02, 0.54]} />
        <meshStandardMaterial
          color={
            isSelected
              ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
              : isHovered
              ? new THREE.Color('#382b4a')
              : new THREE.Color('#1a1624')
          }
          roughness={0.4}
          metalness={0.2}
          transparent={isXRay}
          opacity={isXRay ? 0.4 : 1.0}
        />
      </mesh>

      {/* Multi-Channel Precision Audio ADC/DAC IC (QFP Package) */}
      <mesh position={[0, 0.016, 0]} castShadow>
        <boxGeometry args={[0.2, 0.015, 0.2]} />
        <meshStandardMaterial color={new THREE.Color('#1f2430')} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Low-Jitter Audio Master Clock TCXO Metal Can */}
      <mesh position={[-0.24, 0.018, 0.14]} castShadow>
        <boxGeometry args={[0.09, 0.018, 0.07]} />
        <primitive object={createBrushedSteel()} attach="material" />
      </mesh>

      {/* Surface Mount Audio Coupling Inductors & EMI Chokes */}
      {[-0.22, -0.1, 0.12, 0.24].map((xOff, idx) => (
        <mesh key={idx} position={[xOff, 0.025, -0.14]} castShadow>
          <boxGeometry args={[0.05, 0.03, 0.05]} />
          <meshStandardMaterial color={new THREE.Color('#2d3748')} roughness={0.6} />
        </mesh>
      ))}

      {/* Balanced Differential Audio Line Terminals */}
      {[-0.32, -0.2, 0.2, 0.32].map((xOff, idx) => (
        <mesh key={idx} position={[xOff, 0.02, 0.22]}>
          <boxGeometry args={[0.04, 0.025, 0.03]} />
          <primitive object={createGoldContact()} attach="material" />
        </mesh>
      ))}
    </group>
  );
};
