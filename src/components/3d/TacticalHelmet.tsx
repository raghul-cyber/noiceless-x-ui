import React from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useViewerStore } from '../../store/useViewerStore';
import { createTacticalPolymer, createDarkCoatedMetal, createBrushedSteel } from '../../materials/hardwareMaterials';

interface TacticalHelmetProps {
  explodeDistance?: number;
}

/**
 * Modern High-Cut FAST / MICH Ballistic Tactical Helmet
 * With authentic military MultiCam / OCP fabric camouflage helmet cover,
 * contoured over the human cranium with high-cut ear reliefs
 * allowing the NOISELESS-X headset to contact the ears with zero gap.
 */
export const TacticalHelmet: React.FC<TacticalHelmetProps> = ({ explodeDistance = 0 }) => {
  const { currentMode } = useViewerStore();
  const isXRay = currentMode === 'X-RAY';

  const helmetCamo = useTexture('/helmet_camo.jpg');

  const offsetY = explodeDistance * 0.4;

  return (
    <group name="TacticalHelmetAssembly" position={[0, offsetY, 0]}>
      {/* 1. Main Ballistic Shell (High-cut contour over skull with MultiCam Cover) */}
      <group position={[0, 0.09, -0.01]}>
        {/* Upper Cranium Dome with MultiCam Camouflage Fabric Cover */}
        <mesh position={[0, 0.015, 0]} castShadow={!isXRay} receiveShadow={!isXRay}>
          <sphereGeometry args={[0.102, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
          <meshStandardMaterial
            map={isXRay ? undefined : helmetCamo}
            color={isXRay ? new THREE.Color('#031d36') : new THREE.Color('#d4d4d8')}
            emissive={isXRay ? new THREE.Color('#00558f') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.5 : 0}
            roughness={0.88}
            metalness={0.05}
            transparent={isXRay}
            opacity={isXRay ? 0.35 : 1.0}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Front Brow Visor Lip */}
        <mesh position={[0, -0.012, 0.088]} rotation={[0.35, 0, 0]} castShadow={!isXRay}>
          <boxGeometry args={[0.13, 0.018, 0.03]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031d36') : new THREE.Color('#1f2320')}
            roughness={0.85}
            transparent={isXRay}
            opacity={isXRay ? 0.35 : 1.0}
          />
        </mesh>

        {/* Rear Occipital Nape Flange */}
        <mesh position={[0, -0.025, -0.09]} rotation={[-0.35, 0, 0]} castShadow={!isXRay}>
          <boxGeometry args={[0.135, 0.03, 0.022]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031d36') : new THREE.Color('#1f2320')}
            roughness={0.85}
            transparent={isXRay}
            opacity={isXRay ? 0.35 : 1.0}
          />
        </mesh>
      </group>

      {/* 2. Front Wilcox NVG Shroud (Machined Skeletonized Aluminum Mount on Forehead) */}
      <group position={[0, 0.12, 0.092]} rotation={[0.25, 0, 0]}>
        {/* Shroud Base Plate */}
        <mesh castShadow={!isXRay}>
          <boxGeometry args={[0.044, 0.046, 0.008]} />
          <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
        </mesh>
        {/* Center Receiver Socket for NVG Arm */}
        <mesh position={[0, 0, 0.006]} castShadow={!isXRay}>
          <boxGeometry args={[0.024, 0.026, 0.006]} />
          <primitive object={createBrushedSteel(isXRay)} attach="material" />
        </mesh>
        {/* 3 Mounting Hex Screws */}
        {[-0.015, 0, 0.015].map((x, idx) => (
          <mesh key={idx} position={[x, idx === 1 ? -0.015 : 0.015, 0.005]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.002, 0.002, 0.004, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* 3. Left & Right ARC Accessory Rails (High-Cut Above Ear Openings) */}
      {[-1, 1].map((dir, idx) => (
        <group key={idx} position={[dir * 0.096, 0.095, -0.01]} rotation={[0, 0, dir * -0.15]}>
          {/* Main Curved Rail Body */}
          <mesh castShadow={!isXRay}>
            <boxGeometry args={[0.014, 0.022, 0.11]} />
            <primitive object={createTacticalPolymer(isXRay)} attach="material" />
          </mesh>
          {/* Picatinny Slots */}
          {[-0.035, -0.015, 0.005, 0.025].map((z, sIdx) => (
            <mesh key={sIdx} position={[dir * 0.006, 0, z]}>
              <boxGeometry args={[0.004, 0.014, 0.006]} />
              <meshStandardMaterial color="#0b0e14" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 4. Velcro Loop Pile Panels (Top Crown & Rear) */}
      <group position={[0, 0.19, -0.01]}>
        {/* Top Strip */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.045, 0.10]} />
          <meshStandardMaterial
            color="#2a3028"
            roughness={0.98}
            side={THREE.DoubleSide}
            transparent={isXRay}
            opacity={isXRay ? 0.3 : 1.0}
          />
        </mesh>
        {/* Rear IR Beacon Patch Panel */}
        <mesh position={[0, -0.07, -0.088]} rotation={[-0.45, 0, 0]}>
          <planeGeometry args={[0.065, 0.045]} />
          <meshStandardMaterial
            color="#2a3028"
            roughness={0.98}
            side={THREE.DoubleSide}
            transparent={isXRay}
            opacity={isXRay ? 0.3 : 1.0}
          />
        </mesh>
      </group>

      {/* 5. 4-Point Tactical Chinstrap Harness & Buckle (Snug against jaw and under chin) */}
      <group name="ChinstrapHarness">
        {/* Left Front Strap (From temple down along jawline to chin cup) */}
        <mesh position={[-0.052, 0.025, 0.055]} rotation={[0.75, 0.25, -0.32]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.003, 0.003, 0.11, 8]} />
          <meshStandardMaterial color="#1a201c" roughness={0.95} />
        </mesh>
        {/* Right Front Strap */}
        <mesh position={[0.052, 0.025, 0.055]} rotation={[0.75, -0.25, 0.32]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.003, 0.003, 0.11, 8]} />
          <meshStandardMaterial color="#1a201c" roughness={0.95} />
        </mesh>
        {/* Left Rear Strap (From nape forward along jaw) */}
        <mesh position={[-0.065, 0.045, -0.03]} rotation={[-0.45, 0.25, -0.25]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.003, 0.003, 0.10, 8]} />
          <meshStandardMaterial color="#1a201c" roughness={0.95} />
        </mesh>
        {/* Right Rear Strap */}
        <mesh position={[0.065, 0.045, -0.03]} rotation={[-0.45, -0.25, 0.25]} castShadow={!isXRay}>
          <cylinderGeometry args={[0.003, 0.003, 0.10, 8]} />
          <meshStandardMaterial color="#1a201c" roughness={0.95} />
        </mesh>

        {/* Ergonomic Molded Chin Cup (Snugly positioned under soldier's chin at Y = -0.026, Z = 0.084) */}
        <mesh position={[0, -0.026, 0.084]} rotation={[0.25, 0, 0]} castShadow={!isXRay}>
          <boxGeometry args={[0.048, 0.016, 0.022]} />
          <meshStandardMaterial
            color="#141815"
            roughness={0.9}
            transparent={isXRay}
            opacity={isXRay ? 0.35 : 1.0}
          />
        </mesh>

        {/* Quick-Release ITW Side Buckle (Left Jawline) */}
        <mesh position={[-0.055, 0.005, 0.05]} rotation={[0.2, 0.3, 0]}>
          <boxGeometry args={[0.012, 0.016, 0.008]} />
          <meshStandardMaterial color="#0f1210" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
};

useTexture.preload('/helmet_camo.jpg');
