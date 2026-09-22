import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createDarkCoatedMetal, createBrushedSteel } from '../../materials/hardwareMaterials';

interface BoomMicrophoneProps {
  explodeDistance?: number;
}

export const BoomMicrophone: React.FC<BoomMicrophoneProps> = ({ explodeDistance = 0 }) => {
  const { selectedComponentId, hoveredComponentId, simulationRunning, voiceActive, currentMode } = useViewerStore();
  const voicePulseRef = useRef<THREE.Mesh>(null);
  const voiceWaveRef = useRef<THREE.Group>(null);
  const isXRay = currentMode === 'X-RAY';

  const isSelected = selectedComponentId === 'boomMic';
  const isHovered = hoveredComponentId === 'boomMic';

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (voicePulseRef.current && simulationRunning && voiceActive) {
      const s = 1 + Math.sin(t * 8) * 0.3;
      voicePulseRef.current.scale.set(s, s, s);
      (voicePulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 8) * 0.4;
    }
    if (voiceWaveRef.current && simulationRunning && voiceActive) {
      voiceWaveRef.current.children.forEach((child, i) => {
        const ring = child as THREE.Mesh;
        const progress = ((t * 2 + i * 0.4) % 1.2);
        ring.scale.setScalar(0.4 + progress * 1.8);
        (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - progress);
      });
    }
  });

  const offsetX = -explodeDistance * 0.8;
  const offsetY = -explodeDistance * 0.4;
  const offsetZ = explodeDistance * 1.2;

  return (
    <group
      name="BoomMicrophoneAssembly"
      position={[offsetX, offsetY, offsetZ]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'boomMic');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('boomMic');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* 1. Heavy-Duty Earcup Swivel Anchor Socket */}
      <group position={[0, 0, 0]}>
        <mesh castShadow={!isXRay}>
          <cylinderGeometry args={[0.07, 0.07, 0.10, 16]} />
          <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
        </mesh>
        {/* Swivel Pivot Friction Bolt */}
        <mesh position={[-0.04, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
          <primitive object={createBrushedSteel(isXRay)} attach="material" />
        </mesh>
      </group>

      {/* 2. Flexible Stainless Gooseneck Arm (Curving naturally along cheek to the mouth) */}
      <group>
        {/* Segment 1: Exit bend forward along jawline */}
        <mesh position={[0.16, -0.08, 0.28]} rotation={[0.3, 0.55, -0.05]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.024, 0.024, 0.44, 12]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color(TACTICAL_COLORS.tacticalBlack)}
            emissive={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.8 : 0}
            roughness={0.6}
          />
        </mesh>

        {/* Segment 2: Cheek contour forward toward corner of mouth */}
        <mesh position={[0.48, -0.20, 0.68]} rotation={[0.22, 0.75, -0.12]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.022, 0.022, 0.52, 12]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color(TACTICAL_COLORS.tacticalBlack)}
            emissive={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.8 : 0}
            roughness={0.6}
          />
        </mesh>

        {/* Segment 3: Inward curve directly in front of soldier's lips */}
        <mesh position={[0.76, -0.32, 1.05]} rotation={[0.12, 1.15, -0.15]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 12]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color(TACTICAL_COLORS.tacticalBlack)}
            emissive={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.8 : 0}
            roughness={0.6}
          />
        </mesh>
      </group>

      {/* 3. Tactical Microphone Capsule & Foam Windscreen right at the lips! */}
      <group position={[0.84, -0.38, 1.25]}>
        {/* Metal Capsule Body & Preamp Housing */}
        <mesh rotation={[0, 1.15, 0]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.045, 0.045, 0.14, 16]} />
          <meshStandardMaterial
            color={
              isSelected
                ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
                : isHovered
                ? new THREE.Color('#4ade80')
                : isXRay
                ? new THREE.Color('#00ff66')
                : new THREE.Color(TACTICAL_COLORS.darkMetal)
            }
            emissive={isXRay ? new THREE.Color('#00ff66') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 2.0 : 0}
            metalness={0.8}
          />
        </mesh>

        {/* Thick Hydrophobic Open-Cell Acoustic Foam Windscreen (Directly facing mouth!) */}
        <mesh rotation={[0, 1.15, 0]} castShadow={!isXRay}>
          <capsuleGeometry args={[0.075, 0.14, 16, 16]} />
          <meshStandardMaterial
            color={
              isSelected
                ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
                : isHovered
                ? new THREE.Color('#38bdf8')
                : isXRay
                ? new THREE.Color('#00e5ff')
                : new THREE.Color('#14171d')
            }
            emissive={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.6 : 0}
            roughness={0.95}
            transparent={isXRay}
            opacity={isXRay ? 0.3 : 1.0}
          />
        </mesh>

        {/* Acoustic Sound Pickup Grille Ports (Facing Soldier's Mouth) */}
        <mesh position={[-0.04, 0, 0.04]} rotation={[0, 1.15, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
          <meshBasicMaterial color="#00e676" transparent opacity={0.8} />
        </mesh>

        {/* Active Speech Sensing Pulse in Simulation Mode */}
        {simulationRunning && voiceActive && (
          <mesh ref={voicePulseRef} position={[-0.04, 0, 0.04]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshBasicMaterial color="#00e676" transparent opacity={0.6} wireframe />
          </mesh>
        )}

        {/* Animated Expanding Voice Acoustic Wave Rings Radiating from Mouth to Mic */}
        {simulationRunning && voiceActive && (
          <group ref={voiceWaveRef} position={[-0.06, 0, 0.06]} rotation={[0, 1.15, 0]}>
            {[0, 1, 2].map((idx) => (
              <mesh key={idx}>
                <ringGeometry args={[0.04, 0.05, 16]} />
                <meshBasicMaterial color="#00e676" transparent opacity={0.5} side={THREE.DoubleSide} />
              </mesh>
            ))}
          </group>
        )}
      </group>
    </group>
  );
};
