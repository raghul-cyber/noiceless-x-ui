import React from 'react';
import * as THREE from 'three';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import {
  TACTICAL_COLORS,
  createTacticalPolymer,
  createGelCushionMaterial,
  createDarkCoatedMetal,
  createBrushedSteel,
} from '../../materials/hardwareMaterials';
import { SpeakerDriver } from './SpeakerDriver';
import { HeadsetPCB } from './HeadsetPCB';
import { ExternalReferenceMic } from './ExternalReferenceMic';
import { InternalErrorMic } from './InternalErrorMic';
import { BoomMicrophone } from './BoomMicrophone';

interface EarCupProps {
  side: 'left' | 'right';
}

export const EarCup: React.FC<EarCupProps> = ({ side }) => {
  const { currentMode, explodedProgress, selectedComponentId, hoveredComponentId } = useViewerStore();
  const isLeft = side === 'left';
  const componentKey = isLeft ? 'leftEarcupShell' : 'rightEarcupShell';

  const isSelected = selectedComponentId === componentKey;
  const isHovered = hoveredComponentId === componentKey;
  const isXRay = currentMode === 'X-RAY';
  const isInternal = currentMode === 'INTERNAL' && isLeft;
  const isCutaway = currentMode === 'CUTAWAY' && isLeft;

  const dir = isLeft ? -1 : 1;
  // Exploded spacing factors for component layers
  const baseOffset = explodedProgress * 2.2;
  const outerShellOffset = explodedProgress * 1.5;
  const pcbOffset = explodedProgress * 1.0;
  const speakerOffset = explodedProgress * 0.55;
  const cushionOffset = explodedProgress * -0.25;

  return (
    <group
      name={`EarCup_${side}`}
      position={[dir * (0.80 + baseOffset), 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : componentKey);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent(componentKey);
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* 1. GEL EAR CUSHION (Anatomical seal clamping directly against soldier's ear) */}
      <group position={[dir * cushionOffset, 0, 0]}>
        <mesh position={[dir * 0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow={!isXRay}>
          <torusGeometry args={[0.34, 0.10, 24, 32]} />
          <primitive object={createGelCushionMaterial(isXRay)} attach="material" />
        </mesh>
        {/* Inner acoustic dust-mesh cloth */}
        <mesh position={[dir * 0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.30, 24]} />
          <meshBasicMaterial
            color={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#10141a')}
            transparent={isXRay}
            opacity={isXRay ? 0.3 : 1.0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* 2. SPEAKER DRIVER ASSEMBLY (Inside earcup - glows in X-Ray!) */}
      <SpeakerDriver side={side} explodeDistance={speakerOffset} />

      {/* 3. HEADSET PREAMP & SENSOR PCB (Inside left earcup) */}
      {isLeft && <HeadsetPCB explodeDistance={pcbOffset} />}

      {/* 4. INTERNAL ERROR MICROPHONE (Inside left earcup next to speaker cone) */}
      {isLeft && <InternalErrorMic explodeDistance={pcbOffset} />}

      {/* 5. OUTER SHELL HOUSING & MECHANICAL CONTROLS */}
      {!isInternal && (
        <group position={[dir * outerShellOffset, 0, 0]}>
          {/* Main Contoured Tactical Earcup Dome */}
          <mesh castShadow={!isXRay} receiveShadow={!isXRay}>
            {isCutaway ? (
              <cylinderGeometry args={[0.42, 0.38, 0.24, 32, 1, false, 0, Math.PI * 1.5]} />
            ) : (
              <cylinderGeometry args={[0.42, 0.38, 0.24, 32]} />
            )}
            <meshStandardMaterial
              color={
                isSelected
                  ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
                  : isHovered
                  ? new THREE.Color('#2d3748')
                  : isXRay
                  ? new THREE.Color('#021a30')
                  : new THREE.Color(TACTICAL_COLORS.tacticalBlack)
              }
              emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
              emissiveIntensity={isXRay ? 0.35 : 0}
              roughness={isXRay ? 0.1 : 0.75}
              metalness={isXRay ? 0.8 : 0.15}
              transparent={isXRay}
              opacity={isXRay ? 0.14 : 1.0}
              depthWrite={!isXRay}
            />
          </mesh>

          {/* Outer Back Cover / Recessed Bevel Plate */}
          <mesh position={[dir * -0.13, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow={!isXRay}>
            <cylinderGeometry args={[0.36, 0.38, 0.04, 32]} />
            <primitive object={createTacticalPolymer(isXRay)} attach="material" />
          </mesh>

          {/* Embossed Tactical MIL-STD / NOISELESS-X Badge */}
          <mesh position={[dir * -0.155, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[0.22, 0.10, 0.015]} />
            <meshStandardMaterial
              color={isXRay ? new THREE.Color('#00e599') : new THREE.Color(TACTICAL_COLORS.darkMetal)}
              emissive={isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000')}
              emissiveIntensity={isXRay ? 1.0 : 0}
              metalness={0.9}
            />
          </mesh>

          {/* Sealed Battery Cap on Top of Left Cup */}
          <group position={[0, 0.40, 0]}>
            <mesh castShadow={!isXRay}>
              <cylinderGeometry args={[0.07, 0.07, 0.10, 16]} />
              <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
            </mesh>
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.03, 16]} />
              <primitive object={createBrushedSteel(isXRay)} attach="material" />
            </mesh>
          </group>

          {/* Volume Rocker Buttons */}
          <group position={[0, -0.12, 0.38]} rotation={[0.4, 0, 0]}>
            <mesh position={[0, 0.05, 0]} castShadow={!isXRay}>
              <boxGeometry args={[0.05, 0.06, 0.03]} />
              <meshStandardMaterial color={new THREE.Color('#2a3240')} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.05, 0]} castShadow={!isXRay}>
              <boxGeometry args={[0.05, 0.06, 0.03]} />
              <meshStandardMaterial color={new THREE.Color('#2a3240')} roughness={0.6} />
            </mesh>
          </group>

          {/* Wire Yoke Pivot Mounting Bosses (Connecting to Headband) */}
          <mesh position={[0, 0.32, 0.15]} rotation={[0, 0, Math.PI / 2]} castShadow={!isXRay}>
            <cylinderGeometry args={[0.026, 0.026, 0.05, 12]} />
            <primitive object={createBrushedSteel(isXRay)} attach="material" />
          </mesh>
          <mesh position={[0, 0.32, -0.15]} rotation={[0, 0, Math.PI / 2]} castShadow={!isXRay}>
            <cylinderGeometry args={[0.026, 0.026, 0.05, 12]} />
            <primitive object={createBrushedSteel(isXRay)} attach="material" />
          </mesh>
        </group>
      )}

      {/* 6. EXTERNAL REFERENCE MICROPHONE (Mounted OUTSIDE Left Earcup) */}
      {isLeft && (
        <group position={[-0.38, 0.10, 0.15]}>
          <ExternalReferenceMic explodeDistance={explodedProgress * 1.5} />
        </group>
      )}

      {/* 7. BOOM MICROPHONE (Anchored to Left Earcup, curves right in front of mouth!) */}
      {isLeft && (
        <group position={[-0.22, -0.15, 0.18]}>
          <BoomMicrophone explodeDistance={explodedProgress * 1.2} />
        </group>
      )}

      {/* 8. BOTTOM CABLE STRAIN RELIEF BOOT (Left Earcup comms exit) */}
      {isLeft && (
        <mesh position={[-0.18, -0.42, 0]} rotation={[0.2, 0, 0]} castShadow={!isXRay}>
          <coneGeometry args={[0.05, 0.16, 12]} />
          <meshStandardMaterial color={new THREE.Color('#10141a')} roughness={0.9} />
        </mesh>
      )}
    </group>
  );
};
