import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useViewerStore } from '../../store/useViewerStore';

interface AcousticTestStandProps {
  showManikin?: boolean;
}

/**
 * Heavy Industrial Test Rig & Acoustic Measurement Stand
 * Provides a clean laboratory test stand holding the NOISELESS-X6 headset,
 * ear canal simulators, and waist compute unit in exact calibration position.
 */
export const AcousticTestStand: React.FC<AcousticTestStandProps> = ({ showManikin = false }) => {
  const { currentMode } = useViewerStore();
  const isXRay = currentMode === 'X-RAY';

  // Stand base and vertical structural riser materials
  const titaniumMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isXRay ? new THREE.Color('#021a0e') : new THREE.Color('#141824'),
      roughness: 0.35,
      metalness: 0.85,
      emissive: isXRay ? new THREE.Color('#00e599') : new THREE.Color('#000000'),
      emissiveIntensity: isXRay ? 0.25 : 0,
      transparent: isXRay,
      opacity: isXRay ? 0.3 : 1.0,
    });
  }, [isXRay]);

  const matteCompositeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isXRay ? new THREE.Color('#011208') : new THREE.Color('#0b0e14'),
      roughness: 0.75,
      metalness: 0.2,
      transparent: isXRay,
      opacity: isXRay ? 0.25 : 1.0,
    });
  }, [isXRay]);

  const mintLaserGlow = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00e599'),
      transparent: true,
      opacity: 0.65,
    });
  }, []);

  return (
    <group name="ACOUSTIC_ENGINEERING_TEST_STAND">
      {/* 1. Heavy Precision Laboratory Base Plate (Resting on floor at Y = -0.92) */}
      <group position={[0, -0.90, 0]}>
        {/* Main Machined Base Disk */}
        <mesh castShadow receiveShadow material={titaniumMaterial}>
          <cylinderGeometry args={[0.34, 0.36, 0.035, 48]} />
        </mesh>
        {/* Chamfered Bezel Ring */}
        <mesh position={[0, 0.018, 0]} material={matteCompositeMaterial}>
          <cylinderGeometry args={[0.31, 0.34, 0.008, 48]} />
        </mesh>
        {/* Anti-Vibration Neoprene Isolation Feet (3 Pods) */}
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((angle, idx) => (
          <mesh
            key={idx}
            position={[Math.cos(angle) * 0.28, -0.022, Math.sin(angle) * 0.28]}
            material={matteCompositeMaterial}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.015, 16]} />
          </mesh>
        ))}
      </group>

      {/* 2. Heavy Dual Anodized Aluminum Extruded Columns */}
      <group position={[0, -0.45, 0]}>
        {/* Main Vertical Spine Column */}
        <mesh position={[0, 0, -0.03]} castShadow material={titaniumMaterial}>
          <cylinderGeometry args={[0.024, 0.024, 0.88, 24]} />
        </mesh>
        {/* Calibration Scale Ticks along vertical column */}
        {[-0.3, -0.15, 0, 0.15, 0.3].map((yTick, idx) => (
          <mesh key={idx} position={[0, yTick, -0.005]}>
            <boxGeometry args={[0.045, 0.003, 0.002]} />
            <primitive object={mintLaserGlow} attach="material" />
          </mesh>
        ))}
      </group>

      {/* 3. Waist Carrier Stand Bracket (Holding Waist Unit at Y = -0.63) */}
      <group position={[0, -0.63, 0]}>
        {/* Horizontal Clamp Arm */}
        <mesh position={[0, 0, -0.02]} rotation={[0, 0, Math.PI / 2]} material={matteCompositeMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.20, 16]} />
        </mesh>
        {/* Pouch Retaining Backplate */}
        <mesh position={[0, 0, -0.02]} material={matteCompositeMaterial}>
          <boxGeometry args={[0.16, 0.18, 0.015]} />
        </mesh>
        {/* Equipment Label Tag */}
        <mesh position={[0, 0.08, -0.01]}>
          <planeGeometry args={[0.12, 0.02]} />
          <meshBasicMaterial color="#00e599" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* 4. Headset Binaural Crown Mount (Holding Headband & Earcups at Y = -0.141) */}
      <group position={[0, -0.141, 0]}>
        {/* Crown Rest Bar */}
        <mesh position={[0, 0.12, 0]} rotation={[0, 0, Math.PI / 2]} material={matteCompositeMaterial}>
          <cylinderGeometry args={[0.016, 0.016, 0.16, 16]} />
        </mesh>

        {/* Binaural Ear Spacer Fixtures (Simulating interaural acoustic head width 15.5 cm) */}
        {[-0.078, 0.078].map((xPos, idx) => (
          <group key={idx} position={[xPos, 0, 0]}>
            {/* Inner acoustic spacer disk */}
            <mesh rotation={[0, Math.PI / 2, 0]} material={matteCompositeMaterial}>
              <cylinderGeometry args={[0.045, 0.045, 0.012, 24]} />
            </mesh>
            {/* Ear Canal Resonance Cavity Opening (where sound waves enter) */}
            <mesh position={[xPos < 0 ? 0.007 : -0.007, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <ringGeometry args={[0.012, 0.022, 24]} />
              <meshBasicMaterial color="#00e599" transparent opacity={0.7} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. Optional Minimal Holographic Acoustic Manikin Outline (Toggled on demand) */}
      {showManikin && (
        <group position={[0, -0.141, 0]} name="HolographicAcousticManikin">
          {/* Translucent head contour */}
          <mesh position={[0, 0.02, 0.01]}>
            <sphereGeometry args={[0.098, 24, 24]} />
            <meshStandardMaterial
              color="#00e599"
              emissive="#004d2b"
              emissiveIntensity={0.5}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.12}
              wireframe={false}
              depthWrite={false}
            />
          </mesh>

          {/* Wireframe latitude rings */}
          {[-0.04, 0, 0.04].map((yRing, idx) => (
            <mesh key={idx} position={[0, 0.02 + yRing, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.092, 0.095, 32]} />
              <meshBasicMaterial color="#00e599" transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>
          ))}

          {/* Holographic Vocal Speech Origin Marker at Mouth Zone */}
          <group position={[0, -0.065, 0.095]}>
            <mesh>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshBasicMaterial color="#00e599" transparent opacity={0.65} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
