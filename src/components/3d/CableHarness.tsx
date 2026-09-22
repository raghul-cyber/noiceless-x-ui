import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createDarkCoatedMetal, createCableRubber } from '../../materials/hardwareMaterials';

export const CableHarness: React.FC = () => {
  const { selectedComponentId, hoveredComponentId, simulationRunning, explodedProgress, currentMode } = useViewerStore();
  const pulseRef = useRef<THREE.Mesh>(null);
  const isXRay = currentMode === 'X-RAY';

  const isSelected = selectedComponentId === 'cableHarness';
  const isHovered = hoveredComponentId === 'cableHarness';

  // 3D Spline physically connecting Left Earcup down soldier's neck/torso to Waist Pouch at hip
  const { curve, geometry } = useMemo(() => {
    // Earcup strain relief exit: adapts when headset is exploded
    const startX = -0.08 - explodedProgress * 0.15;
    const startY = -0.183;
    const startZ = 0.001;

    // Waist pouch top gland is at [-0.25, -0.58, 0.06]
    const endX = -0.25;
    const endY = -0.58;
    const endZ = 0.06;

    const points = [
      new THREE.Vector3(startX, startY, startZ),     // Earcup strain relief exit
      new THREE.Vector3(-0.11, -0.28, 0.03),         // Neck / collar drape
      new THREE.Vector3(-0.15, -0.38, 0.06),         // Shoulder loop
      new THREE.Vector3(-0.19, -0.48, 0.07),         // Torso flank route
      new THREE.Vector3(endX, endY, endZ),           // Enters top gland of Waist Pouch
    ];

    const c = new THREE.CatmullRomCurve3(points);
    const g = new THREE.TubeGeometry(c, 48, 0.010, 14, false);
    return { curve: c, geometry: g };
  }, [explodedProgress]);

  useFrame((state) => {
    if (pulseRef.current && simulationRunning && currentMode === 'SIMULATION') {
      const t = (state.clock.getElapsedTime() * 1.4) % 1;
      const pt = curve.getPointAt(t);
      pulseRef.current.position.copy(pt);
    }
  });

  return (
    <group
      name="CableHarnessAssembly"
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'cableHarness');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('cableHarness');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* Heavy-Duty Rugged Braided Comms Cable Conduit (Thick 17mm equivalent scale) */}
      <mesh geometry={geometry} castShadow={!isXRay}>
        <primitive object={createCableRubber(isXRay)} attach="material" />
      </mesh>

      {/* Top Gold/Brass MIL-SPEC Quick-Disconnect Connector Collar at Left Earcup */}
      <mesh
        position={[-0.08 - explodedProgress * 0.15, -0.176, 0.001]}
        rotation={[0.3, 0, 0]}
        castShadow={!isXRay}
      >
        <cylinderGeometry args={[0.012, 0.012, 0.014, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Top Strain Relief Boot Molded at Left Earcup */}
      <mesh
        position={[-0.08 - explodedProgress * 0.15, -0.188, 0.001]}
        rotation={[0.3, 0, 0]}
        castShadow={!isXRay}
      >
        <cylinderGeometry args={[0.011, 0.009, 0.024, 12]} />
        <primitive object={createCableRubber(isXRay)} attach="material" />
      </mesh>

      {/* Bottom Gold/Brass Entry Coupling at Waist Pouch Entry */}
      <mesh position={[-0.25, -0.575, 0.06]} castShadow={!isXRay}>
        <cylinderGeometry args={[0.012, 0.012, 0.016, 16]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Military MOLLE Webbing Retaining Clips Securing Cable Along Uniform */}
      {[
        [-0.11, -0.28, 0.03],
        [-0.15, -0.38, 0.06],
        [-0.19, -0.48, 0.07],
      ].map(([x, y, z], idx) => (
        <group key={idx} position={[x, y, z]}>
          <mesh castShadow={!isXRay}>
            <boxGeometry args={[0.012, 0.018, 0.008]} />
            <primitive object={createDarkCoatedMetal(isXRay)} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Animated Live Signal Pulse Flow Along Cable EXCLUSIVELY in Simulation Mode */}
      {currentMode === 'SIMULATION' && simulationRunning && (
        <mesh ref={pulseRef}>
          <sphereGeometry args={[0.012, 12, 12]} />
          <meshBasicMaterial
            color={isXRay ? '#00e599' : TACTICAL_COLORS.cleanGreen}
            transparent
            opacity={0.9}
          />
        </mesh>
      )}
    </group>
  );
};
