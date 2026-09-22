import React from 'react';
import * as THREE from 'three';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import {
  TACTICAL_COLORS,
  createTacticalFabric,
  createDarkCoatedMetal,
  createBrushedSteel,
  createGoldContact
} from '../../materials/hardwareMaterials';
import { RaspberryPi } from './RaspberryPi';
import { AudioInterface } from './AudioInterface';
import { DSPModule } from './DSPModule';

/**
 * Tactical Waist Pouch & High-Visibility Raspberry Pi 4 Compute Enclosure
 * Open-inspection tactical chassis mounted to the soldier's combat duty belt,
 * prominently displaying the Raspberry Pi 4 PCB, Broadcom SoC, USB ports, and status LEDs.
 */
export const WaistPouch: React.FC = () => {
  const { currentMode, explodedProgress, selectedComponentId, hoveredComponentId } = useViewerStore();
  const isSelected = selectedComponentId === 'waistPouch';
  const isHovered = hoveredComponentId === 'waistPouch';
  const isXRay = currentMode === 'X-RAY';

  // Dramatic exploded separation along multiple axes so Raspberry Pi is completely visible
  const shellOffsetZ = explodedProgress * 1.5;
  const shellOffsetY = -explodedProgress * 0.95;
  const chassisTopOffset = explodedProgress * 2.8;
  const piOffsetY = explodedProgress * 2.4;
  const piOffsetZ = explodedProgress * 0.95;
  const audioIfOffset = explodedProgress * 1.3;
  const dspOffset = explodedProgress * 0.45;
  const batteryOffset = -explodedProgress * 1.1;

  return (
    <group
      name="WaistPouchAssembly"
      position={[0, 0, 0]}
      rotation={[0, 0.25, 0]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'waistPouch');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('waistPouch');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* --- 1. TACTICAL CORDURA POUCH CARRIER (Rear Wall, Bottom, & Side Guards) --- */}
      <group position={[0, shellOffsetY, shellOffsetZ]} rotation={[explodedProgress * 0.6, 0, 0]}>
        {/* Back Wall & Belt Mount Plate */}
        <mesh position={[0, 0, -0.32]} castShadow={!isXRay} receiveShadow={!isXRay}>
          <boxGeometry args={[1.15, 0.95, 0.08]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031a2e') : new THREE.Color(TACTICAL_COLORS.oliveDrab)}
            roughness={0.92}
            transparent={isXRay}
            opacity={isXRay ? 0.15 : 1.0}
          />
        </mesh>

        {/* Bottom Support Tray */}
        <mesh position={[0, -0.44, 0.02]} castShadow={!isXRay}>
          <boxGeometry args={[1.15, 0.08, 0.68]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031a2e') : new THREE.Color(TACTICAL_COLORS.oliveDrab)}
            roughness={0.92}
            transparent={isXRay}
            opacity={isXRay ? 0.15 : 1.0}
          />
        </mesh>

        {/* Left Protective Flank Wall */}
        <mesh position={[-0.54, 0, 0.02]} castShadow={!isXRay}>
          <boxGeometry args={[0.08, 0.88, 0.68]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031a2e') : new THREE.Color(TACTICAL_COLORS.oliveDrab)}
            roughness={0.92}
            transparent={isXRay}
            opacity={isXRay ? 0.15 : 1.0}
          />
        </mesh>

        {/* Right Protective Flank Wall */}
        <mesh position={[0.54, 0, 0.02]} castShadow={!isXRay}>
          <boxGeometry args={[0.08, 0.88, 0.68]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031a2e') : new THREE.Color(TACTICAL_COLORS.oliveDrab)}
            roughness={0.92}
            transparent={isXRay}
            opacity={isXRay ? 0.15 : 1.0}
          />
        </mesh>

        {/* Lower Support Shelf / Base Bracket with MOLLE Strap */}
        <group position={[0, -0.38, 0.26]}>
          <mesh castShadow={!isXRay}>
            <boxGeometry args={[1.12, 0.14, 0.16]} />
            <meshStandardMaterial
              color={isSelected ? '#00e599' : isHovered ? '#4d5e4a' : TACTICAL_COLORS.oliveDrab}
              roughness={0.9}
            />
          </mesh>
          {/* Horizontal Coyote MOLLE Strap */}
          <mesh position={[0, 0, 0.085]}>
            <boxGeometry args={[1.02, 0.08, 0.02]} />
            <primitive object={createTacticalFabric(TACTICAL_COLORS.militaryCoyote, isXRay)} attach="material" />
          </mesh>
        </group>

        {/* Tactical Skeleton Protective Roll Bars (Sides & Corners - Open Front for Direct Inspection) */}
        <mesh position={[-0.52, 0.15, 0.26]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.025, 0.025, 0.58, 12]} />
          <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
        </mesh>
        <mesh position={[0.52, 0.15, 0.26]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.025, 0.025, 0.58, 12]} />
          <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
        </mesh>
        <mesh position={[0, 0.44, 0.26]} rotation={[0, 0, Math.PI / 2]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.025, 0.025, 1.04, 12]} />
          <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
        </mesh>
      </group>

      {/* Top Rubber Cable Entry Gland (Receives Continuous Headset Cable) */}
      <mesh position={[-0.24, 0.46, 0]} castShadow={!isXRay}>
        <cylinderGeometry args={[0.08, 0.09, 0.1, 16]} />
        <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
      </mesh>

      {/* --- 2. HIGH-VISIBILITY RASPBERRY PI 4 COMPUTE STACK --- */}
      {/* Positioned front-and-center, elevated forward for 100% crystal-clear visibility on soldier! */}
      <group
        name="RaspberryPiMount"
        position={[0, 0.14 + piOffsetY, 0.22 + piOffsetZ]}
        rotation={[-0.14 - explodedProgress * 0.15, 0, 0]}
      >
        <RaspberryPi explodeDistance={0} />

        {/* Dedicated Bright White Tactical Inspection Spotlight directly illuminating Raspberry Pi */}
        <pointLight position={[0, 0.35, 0.25]} intensity={3.5} distance={1.8} color="#ffffff" />
        <pointLight position={[0, -0.15, 0.30]} intensity={1.5} distance={1.2} color="#38bdf8" />
      </group>

      {/* --- 3. AUDIO INTERFACE / ADC-DAC SECTION --- */}
      <group position={[0, 0.02 + audioIfOffset, piOffsetZ * 0.5]}>
        <AudioInterface explodeDistance={0} />
      </group>

      {/* --- 4. DSP / ANC PROCESSOR MODULE --- */}
      <group position={[0, -0.08 + dspOffset, 0]}>
        <DSPModule explodeDistance={0} />
      </group>

      {/* --- 5. TACTICAL POWER & BATTERY MODULE --- */}
      <group
        name="PowerModule"
        position={[0, -0.22 + batteryOffset, 0]}
        onClick={(e) => {
          e.stopPropagation();
          viewerStore.selectComponent(selectedComponentId === 'powerModule' ? null : 'powerModule');
        }}
      >
        <mesh castShadow={!isXRay}>
          <boxGeometry args={[0.92, 0.14, 0.55]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031a2e') : new THREE.Color('#1a1f2c')}
            emissive={isXRay ? new THREE.Color('#0055ff') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.5 : 0}
            roughness={0.6}
            metalness={0.4}
            transparent={isXRay}
            opacity={isXRay ? 0.3 : 1.0}
          />
        </mesh>
        {/* Dual 21700 High-Capacity Li-Ion Battery Cells */}
        <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.46, 20]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#2563eb') : new THREE.Color('#1e40af')}
            emissive={isXRay ? new THREE.Color('#2563eb') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 2.5 : 0}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.11, 0.11, 0.46, 20]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#2563eb') : new THREE.Color('#1e40af')}
            emissive={isXRay ? new THREE.Color('#2563eb') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 2.5 : 0}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>
    </group>
  );
};
