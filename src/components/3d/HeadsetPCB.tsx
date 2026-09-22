import React from 'react';
import * as THREE from 'three';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createGoldContact, createPCBGreenMaterial } from '../../materials/hardwareMaterials';

interface HeadsetPCBProps {
  explodeDistance?: number;
}

export const HeadsetPCB: React.FC<HeadsetPCBProps> = ({ explodeDistance = 0 }) => {
  const { selectedComponentId, hoveredComponentId, currentMode } = useViewerStore();
  const isSelected = selectedComponentId === 'headsetPCB';
  const isHovered = hoveredComponentId === 'headsetPCB';
  const isXRay = currentMode === 'X-RAY';

  return (
    <group
      name="HeadsetPCB"
      position={[-explodeDistance, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'headsetPCB');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('headsetPCB');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* Shaped Main FR4 Circuit Board (Glows vibrant emerald in X-Ray!) */}
      <mesh rotation={[0, Math.PI / 2, 0]} castShadow={!isXRay}>
        <cylinderGeometry args={[0.38, 0.38, 0.02, 24]} />
        <meshStandardMaterial
          color={
            isSelected
              ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
              : isHovered
              ? new THREE.Color('#226633')
              : isXRay
              ? new THREE.Color('#00e676')
              : new THREE.Color(TACTICAL_COLORS.pcbGreen)
          }
          emissive={isXRay ? new THREE.Color('#00e676') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 1.4 : 0}
          roughness={0.3}
          metalness={0.2}
          transparent={isXRay}
          opacity={isXRay ? 0.75 : 1.0}
        />
      </mesh>

      {/* Main Preamp / Audio Codec IC (QFN-32 package) */}
      <mesh position={[-0.016, 0.08, 0]} rotation={[0, Math.PI / 2, 0]} castShadow={!isXRay}>
        <boxGeometry args={[0.15, 0.15, 0.02]} />
        <meshStandardMaterial
          color={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#151820')}
          emissive={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 1.5 : 0}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Gold Pin Headers / Solder Terminals */}
      {[-0.15, -0.05, 0.05, 0.15].map((zOffset, idx) => (
        <mesh key={idx} position={[-0.015, -0.22, zOffset]}>
          <boxGeometry args={[0.015, 0.04, 0.04]} />
          <primitive object={createGoldContact(isXRay)} attach="material" />
        </mesh>
      ))}

      {/* SMD Ceramic Capacitors and Resistors */}
      {[
        [0.18, 0.12],
        [0.22, -0.08],
        [-0.05, 0.18],
        [-0.12, -0.15],
      ].map(([y, z], idx) => (
        <mesh key={idx} position={[-0.014, y, z]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.04, 0.025, 0.01]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#ffb700') : new THREE.Color('#94a3b8')}
            emissive={isXRay ? new THREE.Color('#ffb700') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 1.2 : 0}
            metalness={0.9}
          />
        </mesh>
      ))}

      {/* Gold Ground Planes & Test Vias */}
      {[0, 90, 180, 270].map((angle, idx) => {
        const rad = (angle * Math.PI) / 180;
        const y = Math.sin(rad) * 0.30;
        const z = Math.cos(rad) * 0.30;
        return (
          <mesh key={idx} position={[-0.012, y, z]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.005, 12]} />
            <primitive object={createGoldContact(isXRay)} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
};
