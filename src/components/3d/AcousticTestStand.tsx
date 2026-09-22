import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useViewerStore } from '../../store/useViewerStore';

/**
 * High-Precision Acoustic Engineering Test Stand & Floating Tactical Mounting Fixture
 * Replaces the soldier 3D mannequin model with an ultra-clean, state-of-the-art
 * laboratory test rig (ISO 4869-1 / ANSI S12.6 compliant) engineered specifically
 * for acoustic simulation and hardware visualization.
 */
export const AcousticTestStand: React.FC = () => {
  const { currentMode, showManikin } = useViewerStore();
  const isXRay = currentMode === 'X-RAY';

  // Stand base and vertical structural riser materials
  const titaniumMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isXRay ? new THREE.Color('#021a30') : new THREE.Color('#141824'),
      roughness: 0.35,
      metalness: 0.85,
      emissive: isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#000000'),
      emissiveIntensity: isXRay ? 0.25 : 0,
      transparent: isXRay,
      opacity: isXRay ? 0.3 : 1.0,
    });
  }, [isXRay]);

  const matteCompositeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isXRay ? new THREE.Color('#011222') : new THREE.Color('#0b0e14'),
      roughness: 0.75,
      metalness: 0.2,
      transparent: isXRay,
      opacity: isXRay ? 0.25 : 1.0,
    });
  }, [isXRay]);

  const cyanLaserGlow = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color('#00e5ff'),
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
          <cylinderGeometry args={[0.55, 0.58, 0.04, 48]} />
        </mesh>

        {/* Circular Telemetry Ring Inlay */}
        <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.44, 48]} />
          <primitive object={cyanLaserGlow} attach="material" />
        </mesh>

        {/* Anti-vibration Neoprene Isolation Feet (4 points) */}
        {[
          [0.38, 0.38],
          [-0.38, 0.38],
          [0.38, -0.38],
          [-0.38, -0.38],
        ].map(([x, z], idx) => (
          <mesh key={idx} position={[x, -0.025, z]} material={matteCompositeMaterial}>
            <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
          </mesh>
        ))}
      </group>

      {/* 2. Vertical Aerodynamic Structural Riser Mast (Connecting Base to Headset Binaural Mount) */}
      <group position={[0, -0.52, -0.06]}>
        {/* Rear Column */}
        <mesh castShadow receiveShadow material={titaniumMaterial}>
          <cylinderGeometry args={[0.028, 0.038, 0.74, 24]} />
        </mesh>
        {/* Structural Rib Stiffeners */}
        <mesh position={[0, -0.05, 0.02]} material={matteCompositeMaterial}>
          <boxGeometry args={[0.015, 0.55, 0.04]} />
        </mesh>
      </group>

      {/* 3. Waist Pouch Tactical Equipment Mounting Cradle (At Y = -0.68, Left Hip) */}
      <group position={[-0.20, -0.68, 0.04]}>
        {/* Cradle Horizontal Support Arm extending from center riser */}
        <mesh position={[0.10, 0, -0.04]} rotation={[0, 0, Math.PI / 2]} material={titaniumMaterial}>
          <cylinderGeometry args={[0.012, 0.012, 0.20, 16]} />
        </mesh>
        {/* Pouch Retaining Backplate */}
        <mesh position={[0, 0, -0.02]} material={matteCompositeMaterial}>
          <boxGeometry args={[0.16, 0.18, 0.015]} />
        </mesh>
        {/* Equipment Label Tag */}
        <mesh position={[0, 0.08, -0.01]}>
          <planeGeometry args={[0.12, 0.02]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.4} />
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
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.7} />
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
              color="#00e5ff"
              emissive="#00558f"
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
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.35} side={THREE.DoubleSide} />
            </mesh>
          ))}

          {/* Holographic Vocal Speech Origin Marker at Mouth Zone */}
          <group position={[0, -0.065, 0.095]}>
            <mesh>
              <sphereGeometry args={[0.012, 16, 16]} />
              <meshBasicMaterial color="#00e676" transparent opacity={0.65} />
            </mesh>
          </group>
        </group>
      )}
    </group>
  );
};
