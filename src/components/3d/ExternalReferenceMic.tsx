import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createDarkCoatedMetal, createBrushedSteel } from '../../materials/hardwareMaterials';

interface ExternalReferenceMicProps {
  explodeDistance?: number;
}

export const ExternalReferenceMic: React.FC<ExternalReferenceMicProps> = ({ explodeDistance = 0 }) => {
  const { selectedComponentId, hoveredComponentId, simulationRunning, currentMode } = useViewerStore();
  const pulseRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const isXRay = currentMode === 'X-RAY';

  const isSelected = selectedComponentId === 'externalRefMic';
  const isHovered = hoveredComponentId === 'externalRefMic';

  // Pulsing capture glow in simulation mode
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pulseRef.current && simulationRunning) {
      const s = 1 + Math.sin(t * 6) * 0.3;
      pulseRef.current.scale.set(s, s, s);
      (pulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 6) * 0.35;
    }
    if (ringRef.current && simulationRunning) {
      ringRef.current.children.forEach((child, i) => {
        const ring = child as THREE.Mesh;
        const progress = ((t * 1.5 + i * 0.5) % 1);
        ring.scale.setScalar(0.2 + progress * 1.2);
        (ring.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 * (1 - progress));
      });
    }
  });

  // Exploded displacement
  const offsetX = -explodeDistance * 1.3;
  const offsetY = explodeDistance * 0.4;
  const offsetZ = explodeDistance * 0.4;

  return (
    <group
      name="ExternalReferenceMic"
      position={[offsetX, offsetY, offsetZ]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'externalRefMic');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('externalRefMic');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* Heavy-duty Aluminum Mounting Bracket (Mounted to left earcup exterior) */}
      <mesh position={[-0.04, 0, 0]} castShadow={!isXRay}>
        <boxGeometry args={[0.08, 0.12, 0.1]} />
        <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
      </mesh>

      {/* Swivel Pivot Joint Screw */}
      <mesh position={[-0.04, 0.07, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.1, 16]} />
        <meshStandardMaterial
          color={isXRay ? new THREE.Color('#00e599') : new THREE.Color(TACTICAL_COLORS.steelMetal)}
          emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 1.0 : 0}
          metalness={0.9}
        />
      </mesh>

      {/* Cylindrical Weatherproof Stalk Extension */}
      <mesh position={[-0.12, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={!isXRay}>
        <cylinderGeometry args={[0.04, 0.04, 0.14, 16]} />
        <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
      </mesh>

      {/* Protruding Rugged Microphone Capsule Body (Glows in X-Ray!) */}
      <mesh position={[-0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={!isXRay}>
        <cylinderGeometry args={[0.065, 0.065, 0.12, 24]} />
        <meshStandardMaterial
          color={
            isSelected
              ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
              : isHovered
              ? new THREE.Color('#38bdf8')
              : isXRay
              ? new THREE.Color('#00e599')
              : new THREE.Color(TACTICAL_COLORS.tacticalBlack)
          }
          emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 1.8 : 0}
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Sintered Stainless Steel Acoustic Protective Grille */}
      <mesh position={[-0.31, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={!isXRay}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 24]} />
        <primitive object={createBrushedSteel(isXRay)} attach="material" />
      </mesh>

      {/* Outer Protective Aluminum Cage Prongs */}
      {[0, 120, 240].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        const y = Math.sin(rad) * 0.075;
        const z = Math.cos(rad) * 0.075;
        return (
          <mesh key={idx} position={[-0.25, y, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.008, 0.008, 0.14, 8]} />
            <meshStandardMaterial
              color={isXRay ? new THREE.Color('#00e599') : new THREE.Color(TACTICAL_COLORS.darkMetal)}
              emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
              emissiveIntensity={isXRay ? 0.9 : 0}
              metalness={0.9}
            />
          </mesh>
        );
      })}

      {/* Interactive Active Ambient Sensing Wavefront Pulse */}
      {simulationRunning && (
        <mesh ref={pulseRef} position={[-0.36, 0, 0]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshBasicMaterial color={new THREE.Color(TACTICAL_COLORS.indicatorCyan)} transparent opacity={0.6} wireframe />
        </mesh>
      )}

      {/* Ambient Sampling Inflow Rings */}
      {simulationRunning && (
        <group ref={ringRef} position={[-0.34, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {[0, 1].map((idx) => (
            <mesh key={idx}>
              <ringGeometry args={[0.06, 0.08, 20]} />
              <meshBasicMaterial color="#00e599" transparent opacity={0.5} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
