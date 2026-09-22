import React from 'react';
import * as THREE from 'three';
import { useViewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createTacticalPolymer, createDarkCoatedMetal, createBrushedSteel } from '../../materials/hardwareMaterials';

/**
 * Modern Tactical Plate Carrier / Body Armor System & Combat Duty Belt
 * Realistic Cordura 500D nylon fabric, MOLLE/PALS webbing, shoulder pads,
 * and waist duty belt securing the Raspberry Pi pouch.
 */
export const TacticalPlateCarrier: React.FC = () => {
  const { currentMode } = useViewerStore();
  const isXRay = currentMode === 'X-RAY';

  return (
    <group name="TacticalPlateCarrierAssembly">
      {/* 1. Front Ballistic Plate Carrier (Chest & Abdomen) */}
      <group position={[0, -0.36, 0.05]}>
        {/* Main Torso Ceramic Armor Plate Housing */}
        <mesh castShadow={!isXRay} receiveShadow={!isXRay}>
          <boxGeometry args={[0.26, 0.32, 0.08]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031d36') : new THREE.Color('#38342c')} // Tactical Coyote Tan / Multicam Base
            emissive={isXRay ? new THREE.Color('#00558f') : new THREE.Color('#000000')}
            emissiveIntensity={isXRay ? 0.4 : 0}
            roughness={0.92}
            metalness={0.04}
            transparent={isXRay}
            opacity={isXRay ? 0.3 : 1.0}
          />
        </mesh>

        {/* 4 Rows of MOLLE / PALS Webbing Across Chest */}
        {[-0.08, -0.02, 0.04, 0.10].map((yOff, rIdx) => (
          <group key={rIdx} position={[0, yOff, 0.042]}>
            {/* Horizontal Webbing Strap */}
            <mesh>
              <planeGeometry args={[0.24, 0.022]} />
              <meshStandardMaterial
                color="#26231d"
                roughness={0.95}
                transparent={isXRay}
                opacity={isXRay ? 0.4 : 1.0}
              />
            </mesh>
            {/* PALS Stitched Divider Loops */}
            {[-0.09, -0.045, 0, 0.045, 0.09].map((xOff, dIdx) => (
              <mesh key={dIdx} position={[xOff, 0, 0.002]}>
                <boxGeometry args={[0.003, 0.024, 0.002]} />
                <meshStandardMaterial color="#1a1814" roughness={0.9} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Upper Chest Admin Velcro Patch (For Call-sign / IR Beacon) */}
        <mesh position={[0, 0.13, 0.042]}>
          <planeGeometry args={[0.14, 0.035]} />
          <meshStandardMaterial
            color="#2a2720"
            roughness={0.98}
            transparent={isXRay}
            opacity={isXRay ? 0.3 : 1.0}
          />
        </mesh>

        {/* Tactical Low-Profile Mag / Utility Pouches on Lower Abdomen */}
        {[-0.07, 0, 0.07].map((xOff, pIdx) => (
          <mesh key={pIdx} position={[xOff, -0.11, 0.065]} castShadow={!isXRay}>
            <boxGeometry args={[0.055, 0.12, 0.045]} />
            <meshStandardMaterial
              color={isXRay ? new THREE.Color('#031d36') : new THREE.Color('#332f27')}
              roughness={0.92}
              transparent={isXRay}
              opacity={isXRay ? 0.35 : 1.0}
            />
          </mesh>
        ))}
      </group>

      {/* 2. Rear Back Ballistic Armor Plate */}
      <mesh position={[0, -0.36, -0.13]} castShadow={!isXRay}>
        <boxGeometry args={[0.27, 0.33, 0.07]} />
        <meshStandardMaterial
          color={isXRay ? new THREE.Color('#031d36') : new THREE.Color('#38342c')}
          roughness={0.92}
          transparent={isXRay}
          opacity={isXRay ? 0.3 : 1.0}
        />
      </mesh>

      {/* 3. Padded Combat Shoulder Straps */}
      {[-0.11, 0.11].map((xOff, idx) => (
        <group key={idx} position={[xOff, -0.19, -0.04]}>
          <mesh castShadow={!isXRay}>
            <boxGeometry args={[0.055, 0.04, 0.18]} />
            <meshStandardMaterial
              color={isXRay ? new THREE.Color('#031d36') : new THREE.Color('#2e2a22')}
              roughness={0.95}
              transparent={isXRay}
              opacity={isXRay ? 0.3 : 1.0}
            />
          </mesh>
          {/* Left Shoulder Cable Routing Guide Loop (Secures Headset Cable!) */}
          {idx === 0 && (
            <mesh position={[-0.03, 0.01, 0.04]} rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.012, 0.003, 8, 16]} />
              <meshStandardMaterial color="#1a1814" roughness={0.9} />
            </mesh>
          )}
        </group>
      ))}

      {/* 4. Side Elastic Cummerbund Webbing */}
      {[-0.14, 0.14].map((xOff, idx) => (
        <mesh key={idx} position={[xOff, -0.38, -0.04]}>
          <boxGeometry args={[0.018, 0.14, 0.16]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031d36') : new THREE.Color('#28251e')}
            roughness={0.96}
            transparent={isXRay}
            opacity={isXRay ? 0.3 : 1.0}
          />
        </mesh>
      ))}

      {/* 5. Combat Duty Battle Belt with Metal Cobra Buckle (Waist Y = -0.68) */}
      <group position={[0, -0.68, -0.02]}>
        {/* Padded Belt Loop */}
        <mesh castShadow={!isXRay}>
          <cylinderGeometry args={[0.175, 0.18, 0.055, 32, 1, true]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#031d36') : new THREE.Color('#232019')}
            roughness={0.92}
            side={THREE.DoubleSide}
            transparent={isXRay}
            opacity={isXRay ? 0.35 : 1.0}
          />
        </mesh>

        {/* Machined Metal AustriAlpin Style Cobra Buckle (Front Center) */}
        <group position={[0, 0, 0.178]}>
          <mesh castShadow={!isXRay}>
            <boxGeometry args={[0.05, 0.036, 0.014]} />
            <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
          </mesh>
          {/* Dual Brass Release Clips */}
          {[-0.022, 0.022].map((x, bIdx) => (
            <mesh key={bIdx} position={[x, 0, 0.002]}>
              <boxGeometry args={[0.006, 0.016, 0.008]} />
              <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
