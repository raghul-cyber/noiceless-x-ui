import React from 'react';
import * as THREE from 'three';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createBrushedSteel, createDarkCoatedMetal } from '../../materials/hardwareMaterials';

export const Headband: React.FC = () => {
  const { currentMode, explodedProgress, selectedComponentId, hoveredComponentId } = useViewerStore();
  const isSelected = selectedComponentId === 'headband';
  const isHovered = hoveredComponentId === 'headband';
  const isXRay = currentMode === 'X-RAY';

  // Smooth exploded offset along +Y axis
  const offsetY = explodedProgress * 1.6;

  return (
    <group
      name="HeadbandAssembly"
      position={[0, 0.38 + offsetY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'headband');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('headband');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* Padded Top Ballistic Sleeve - Resting flush over helmet */}
      <mesh castShadow={!isXRay} receiveShadow={!isXRay}>
        <torusGeometry args={[0.84, 0.085, 16, 48, Math.PI * 0.86]} />
        <meshStandardMaterial
          color={
            isSelected
              ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
              : isHovered
              ? new THREE.Color('#3b4b60')
              : isXRay
              ? new THREE.Color('#021a30')
              : new THREE.Color(TACTICAL_COLORS.tacticalBlack)
          }
          emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 0.3 : 0}
          roughness={isXRay ? 0.1 : 0.78}
          metalness={isXRay ? 0.8 : 0.1}
          transparent={isXRay}
          opacity={isXRay ? 0.14 : 1.0}
          depthWrite={!isXRay}
        />
      </mesh>

      {/* Decorative Leatherette Stitching Seams */}
      {!isXRay &&
        [-0.45, -0.22, 0, 0.22, 0.45].map((xOffset, idx) => (
          <mesh key={idx} position={[xOffset, 0.82 - Math.abs(xOffset) * 0.26, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
            <meshStandardMaterial color={new THREE.Color('#222834')} roughness={0.9} />
          </mesh>
        ))}

      {/* Twin Stainless Steel Spring-Wire Frame (Left and Right arches - Glows in X-Ray!) */}
      <mesh position={[0, 0, 0.06]} castShadow={!isXRay}>
        <torusGeometry args={[0.86, 0.018, 12, 48, Math.PI * 0.94]} />
        <primitive object={createBrushedSteel(isXRay)} attach="material" />
      </mesh>
      <mesh position={[0, 0, -0.06]} castShadow={!isXRay}>
        <torusGeometry args={[0.86, 0.018, 12, 48, Math.PI * 0.94]} />
        <primitive object={createBrushedSteel(isXRay)} attach="material" />
      </mesh>

      {/* Left Wire Guide / Slider Adjustment Bracket */}
      <group position={[-0.78, 0.10, 0]}>
        <mesh castShadow={!isXRay}>
          <boxGeometry args={[0.09, 0.22, 0.16]} />
          <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
        </mesh>
        {/* Tension Thumbscrew */}
        <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
          <meshStandardMaterial
            color={new THREE.Color(TACTICAL_COLORS.steelMetal)}
            emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.8 : 0}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Right Wire Guide / Slider Adjustment Bracket */}
      <group position={[0.78, 0.10, 0]}>
        <mesh castShadow={!isXRay}>
          <boxGeometry args={[0.09, 0.22, 0.16]} />
          <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
        </mesh>
        {/* Tension Thumbscrew */}
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
          <meshStandardMaterial
            color={new THREE.Color(TACTICAL_COLORS.steelMetal)}
            emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.8 : 0}
            metalness={0.9}
          />
        </mesh>
      </group>
    </group>
  );
};
