import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createGoldContact } from '../../materials/hardwareMaterials';

interface InternalErrorMicProps {
  explodeDistance?: number;
}

export const InternalErrorMic: React.FC<InternalErrorMicProps> = ({ explodeDistance = 0 }) => {
  const { currentMode, selectedComponentId, hoveredComponentId, simulationRunning, ancActive } = useViewerStore();
  const feedbackPulseRef = useRef<THREE.Mesh>(null);

  const isSelected = selectedComponentId === 'internalErrorMic';
  const isHovered = hoveredComponentId === 'internalErrorMic';
  const isXRay = currentMode === 'X-RAY';

  // Visible when exploded, internal, cutaway, or x-ray mode
  const isVisible =
    currentMode === 'EXPLODED' ||
    currentMode === 'INTERNAL' ||
    currentMode === 'CUTAWAY' ||
    isXRay ||
    explodeDistance > 0.05;

  useFrame((state) => {
    if (feedbackPulseRef.current && simulationRunning && ancActive) {
      const t = state.clock.getElapsedTime() * 5;
      const s = 1 + Math.sin(t) * 0.3;
      feedbackPulseRef.current.scale.set(s, s, s);
      (feedbackPulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.4 + Math.sin(t) * 0.4;
    }
  });

  if (!isVisible) return null;

  return (
    <group
      name="InternalErrorMic"
      position={[-explodeDistance * 0.9, -0.15, 0.12]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'internalErrorMic');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('internalErrorMic');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* Precision MEMS Acoustic Port Cylinder (Glows bright magenta in X-Ray!) */}
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow={!isXRay}>
        <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
        <meshStandardMaterial
          color={
            isSelected
              ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
              : isHovered
              ? new THREE.Color('#e879f9')
              : new THREE.Color(TACTICAL_COLORS.errorMagenta)
          }
          emissive={isXRay ? new THREE.Color('#d500f9') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 2.5 : 0}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Internal Acoustic Sensor Diaphragm Inset */}
      <mesh position={[0.022, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.005, 16]} />
        <primitive object={createGoldContact(isXRay)} attach="material" />
      </mesh>

      {/* Mini Acoustic Tuning Snout */}
      <mesh position={[0.035, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[0.018, 0.03, 16]} />
        <meshStandardMaterial
          color={isXRay ? new THREE.Color('#ff00ff') : new THREE.Color(TACTICAL_COLORS.tacticalBlack)}
          emissive={isXRay ? new THREE.Color('#ff00ff') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 1.5 : 0}
          roughness={0.7}
        />
      </mesh>

      {/* Lead Wires routing to Headset PCB */}
      <mesh position={[-0.04, 0.08, -0.04]} rotation={[0, 0, 0.6]}>
        <cylinderGeometry args={[0.006, 0.006, 0.16, 8]} />
        <meshBasicMaterial color={new THREE.Color('#d946ef')} />
      </mesh>

      {/* Animated Residual Error Sensing Halo in Simulation Mode */}
      {simulationRunning && (
        <mesh ref={feedbackPulseRef} position={[0.05, 0, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial color={new THREE.Color(TACTICAL_COLORS.errorMagenta)} transparent opacity={0.6} wireframe />
        </mesh>
      )}
    </group>
  );
};
