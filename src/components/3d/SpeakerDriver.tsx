import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createBrushedSteel, createGoldContact } from '../../materials/hardwareMaterials';

interface SpeakerDriverProps {
  side?: 'left' | 'right';
  explodeDistance?: number;
}

export const SpeakerDriver: React.FC<SpeakerDriverProps> = ({ side = 'left', explodeDistance = 0 }) => {
  const { currentMode, selectedComponentId, hoveredComponentId, simulationRunning, ancActive } = useViewerStore();
  const diaphragmRef = useRef<THREE.Mesh>(null);
  const ringWaveRef = useRef<THREE.Mesh>(null);

  const isSelected = selectedComponentId === 'speakerDriver';
  const isHovered = hoveredComponentId === 'speakerDriver';
  const isLeft = side === 'left';
  const isXRay = currentMode === 'X-RAY';

  // Real-time acoustic diaphragm vibration animation during simulation
  useFrame((state) => {
    if (diaphragmRef.current && simulationRunning && ancActive) {
      const t = state.clock.getElapsedTime() * 40;
      diaphragmRef.current.position.x = Math.sin(t) * 0.015;
    }
    if (ringWaveRef.current && simulationRunning && ancActive) {
      const s = (state.clock.getElapsedTime() * 2.5) % 1;
      ringWaveRef.current.scale.set(1 + s * 0.8, 1 + s * 0.8, 1);
      (ringWaveRef.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.7 * (1 - s));
    }
  });

  const dir = isLeft ? -1 : 1;
  const offsetX = dir * explodeDistance;

  return (
    <group
      name={`SpeakerDriver_${side}`}
      position={[offsetX, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'speakerDriver');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('speakerDriver');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* Heavy-duty Neodymium Magnet Pot (Back Plate - Glows bright cyan in X-Ray!) */}
      <mesh position={[dir * 0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow={!isXRay}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
        <meshStandardMaterial
          color={isXRay ? new THREE.Color('#00e599') : new THREE.Color(TACTICAL_COLORS.steelMetal)}
          emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 1.8 : 0}
          roughness={isXRay ? 0.2 : 0.35}
          metalness={0.9}
        />
      </mesh>

      {/* Copper Voice Coil Collar (Glows bright metallic amber in X-Ray!) */}
      <mesh position={[dir * 0.03, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 24]} />
        <meshStandardMaterial
          color={new THREE.Color(TACTICAL_COLORS.copperTrace)}
          emissive={isXRay ? new THREE.Color('#ff9100') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 2.2 : 0}
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>

      {/* Speaker Acoustic Baffle Plate Ring */}
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow={!isXRay}>
        <cylinderGeometry args={[0.40, 0.40, 0.03, 32]} />
        <meshStandardMaterial
          color={
            isSelected
              ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
              : isHovered
              ? new THREE.Color('#384b66')
              : isXRay
              ? new THREE.Color('#00264d')
              : new THREE.Color(TACTICAL_COLORS.darkMetal)
          }
          emissive={isXRay ? new THREE.Color('#0077ff') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 0.6 : 0}
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Gold-Plated Terminal Lugs */}
      <mesh position={[0, -0.26, 0.08]} castShadow={!isXRay}>
        <boxGeometry args={[0.04, 0.07, 0.05]} />
        <primitive object={createGoldContact(isXRay)} attach="material" />
      </mesh>

      {/* Titanium-Mylar Speaker Diaphragm Dome */}
      <mesh ref={diaphragmRef} position={[dir * -0.02, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow={!isXRay}>
        <sphereGeometry args={[0.26, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
        <meshStandardMaterial
          color={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#3b4554')}
          emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 1.0 : 0}
          metalness={0.8}
          roughness={0.25}
          transparent={isXRay}
          opacity={isXRay ? 0.7 : 1.0}
        />
      </mesh>

      {/* Concentric Diaphragm Compliance Suspension Ribs */}
      {[0.22, 0.30, 0.36].map((radius, idx) => (
        <mesh key={idx} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[radius, 0.007, 8, 32]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#1f2633')}
            emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.8 : 0}
            roughness={0.8}
          />
        </mesh>
      ))}

      {/* Simulated Acoustic Anti-Noise Wavefront Mesh in Simulation Mode */}
      {isLeft && simulationRunning && (
        <mesh ref={ringWaveRef} position={[0.08, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.26, 0.42, 32]} />
          <meshBasicMaterial
            color={new THREE.Color(TACTICAL_COLORS.indicatorCyan)}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};
