import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';
import { TACTICAL_COLORS, createBrushedSteel, createGoldContact } from '../../materials/hardwareMaterials';

interface RaspberryPiProps {
  explodeDistance?: number;
}

export const RaspberryPi: React.FC<RaspberryPiProps> = ({ explodeDistance = 0 }) => {
  const { selectedComponentId, hoveredComponentId, simulationRunning, currentMode } = useViewerStore();
  const actLedRef = useRef<THREE.Mesh>(null);
  const pwrLedRef = useRef<THREE.Mesh>(null);

  const isSelected = selectedComponentId === 'raspberryPi';
  const isHovered = hoveredComponentId === 'raspberryPi';
  const isXRay = currentMode === 'X-RAY';

  // Activity LED blinking and Power LED steady glow
  useFrame((state) => {
    if (actLedRef.current && simulationRunning) {
      const t = state.clock.getElapsedTime() * 14;
      (actLedRef.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(t) > 0.1 ? 1 : 0.2;
    }
  });

  const offsetY = explodeDistance * 1.4;

  return (
    <group
      name="RaspberryPi"
      position={[0, offsetY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        viewerStore.selectComponent(isSelected ? null : 'raspberryPi');
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        viewerStore.hoverComponent('raspberryPi');
      }}
      onPointerOut={() => viewerStore.hoverComponent(null)}
    >
      {/* 1. Main Raspberry Pi FR4 Multi-Layer Board (85mm x 56mm proportional) - Glows in X-Ray! */}
      <mesh castShadow={!isXRay} receiveShadow={!isXRay}>
        <boxGeometry args={[0.92, 0.035, 0.60]} />
        <meshStandardMaterial
          color={
            isSelected
              ? new THREE.Color(TACTICAL_COLORS.indicatorCyan)
              : isHovered
              ? new THREE.Color('#228833')
              : isXRay
              ? new THREE.Color('#00e676')
              : new THREE.Color(TACTICAL_COLORS.pcbGreen)
          }
          emissive={isXRay ? new THREE.Color('#00e676') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 1.5 : 0}
          roughness={0.35}
          metalness={0.2}
          transparent={isXRay}
          opacity={isXRay ? 0.85 : 1.0}
        />
      </mesh>

      {/* Copper Ground Plane Traces Pattern */}
      <mesh position={[0, 0.019, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.88, 0.56]} />
        <meshStandardMaterial
          color={isXRay ? new THREE.Color('#ffb700') : new THREE.Color('#d97706')}
          emissive={isXRay ? new THREE.Color('#ffb700') : new THREE.Color('#d97706')}
          emissiveIntensity={isXRay ? 0.8 : 0.15}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* 2. Broadcom BCM Quad-Core 64-Bit ARM SoC with Aluminum Heat Sink */}
      <mesh position={[-0.05, 0.028, 0.02]} castShadow={!isXRay}>
        <boxGeometry args={[0.24, 0.024, 0.24]} />
        <meshStandardMaterial
          color={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color(TACTICAL_COLORS.steelMetal)}
          emissive={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 2.0 : 0}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* SoC Laser Engraved Heat Sink Cooling Fins */}
      {[-0.08, -0.04, 0, 0.04, 0.08].map((xOffset, idx) => (
        <mesh key={idx} position={[-0.05 + xOffset, 0.046, 0.02]} castShadow={!isXRay}>
          <boxGeometry args={[0.016, 0.018, 0.22]} />
          <primitive object={createBrushedSteel(isXRay)} attach="material" />
        </mesh>
      ))}

      {/* 3. LPDDR4 Synchronous SDRAM Chip */}
      <mesh position={[-0.05, 0.025, -0.16]} castShadow={!isXRay}>
        <boxGeometry args={[0.16, 0.016, 0.14]} />
        <meshStandardMaterial
          color={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#11141a')}
          emissive={isXRay ? new THREE.Color('#0077ff') : new THREE.Color('#000000')}
          emissiveIntensity={isXRay ? 1.2 : 0}
          metalness={0.8}
        />
      </mesh>

      {/* 4. Dual Stacked USB 3.0 Ports (Blue Core Inserts on Right Edge) */}
      <group position={[0.36, 0.085, 0.15]}>
        <mesh castShadow={!isXRay}>
          <boxGeometry args={[0.20, 0.15, 0.16]} />
          <primitive object={createBrushedSteel(isXRay)} attach="material" />
        </mesh>
        {/* Blue USB 3.0 Inserts */}
        <mesh position={[0.09, 0.03, 0]}>
          <boxGeometry args={[0.03, 0.02, 0.12]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
        <mesh position={[0.09, -0.04, 0]}>
          <boxGeometry args={[0.03, 0.02, 0.12]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>

      {/* 5. Dual Stacked USB 2.0 Ports (Black Inserts on Right Edge) */}
      <group position={[0.36, 0.085, -0.05]}>
        <mesh castShadow={!isXRay}>
          <boxGeometry args={[0.20, 0.15, 0.16]} />
          <primitive object={createBrushedSteel(isXRay)} attach="material" />
        </mesh>
      </group>

      {/* 6. Gigabit Ethernet RJ45 Jack with Integrated Status Magnetics */}
      <group position={[0.36, 0.095, -0.21]}>
        <mesh castShadow={!isXRay}>
          <boxGeometry args={[0.21, 0.16, 0.15]} />
          <primitive object={createBrushedSteel(isXRay)} attach="material" />
        </mesh>
        {/* RJ45 Status LEDs */}
        <mesh position={[0.10, 0.06, 0.04]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0.10, 0.06, -0.04]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      </group>

      {/* 7. 40-Pin Dual-Row Gold GPIO Header (Top Edge - Glows Gold in X-Ray!) */}
      <group position={[-0.1, 0.05, -0.25]}>
        <mesh castShadow={!isXRay}>
          <boxGeometry args={[0.54, 0.06, 0.065]} />
          <meshStandardMaterial color={new THREE.Color(TACTICAL_COLORS.tacticalBlack)} roughness={0.8} />
        </mesh>
        {/* Golden GPIO Pins */}
        {[-0.22, -0.16, -0.10, -0.04, 0.02, 0.08, 0.14, 0.20].map((xOff, idx) => (
          <mesh key={idx} position={[xOff, 0.045, 0]}>
            <cylinderGeometry args={[0.009, 0.009, 0.035, 8]} />
            <primitive object={createGoldContact(isXRay)} attach="material" />
          </mesh>
        ))}
      </group>

      {/* 8. Dual Micro-HDMI Ports (Bottom Edge) */}
      <mesh position={[-0.08, 0.03, 0.28]} castShadow={!isXRay}>
        <boxGeometry args={[0.09, 0.035, 0.06]} />
        <primitive object={createBrushedSteel(isXRay)} attach="material" />
      </mesh>
      <mesh position={[0.09, 0.03, 0.28]} castShadow={!isXRay}>
        <boxGeometry args={[0.09, 0.035, 0.06]} />
        <primitive object={createBrushedSteel(isXRay)} attach="material" />
      </mesh>

      {/* 9. USB-C Power Jack (Bottom Left Edge) */}
      <mesh position={[-0.30, 0.03, 0.28]} castShadow={!isXRay}>
        <boxGeometry args={[0.10, 0.04, 0.06]} />
        <primitive object={createBrushedSteel(isXRay)} attach="material" />
      </mesh>

      {/* 10. 4 Corner Golden Ground Mounting Holes */}
      {[
        [-0.41, -0.26],
        [-0.41, 0.26],
        [0.41, -0.26],
        [0.41, 0.26],
      ].map(([x, z], idx) => (
        <mesh key={idx} position={[x, 0.019, z]}>
          <cylinderGeometry args={[0.035, 0.035, 0.006, 12]} />
          <primitive object={createGoldContact(isXRay)} attach="material" />
        </mesh>
      ))}

      {/* 11. Dual Diagnostic LEDs: Green (Activity) & Red (Power 5V) */}
      {/* Green ACT LED */}
      <group position={[-0.38, 0.035, 0.16]}>
        <mesh ref={actLedRef}>
          <cylinderGeometry args={[0.022, 0.022, 0.016, 12]} />
          <meshBasicMaterial color={new THREE.Color('#22c55e')} />
        </mesh>
        <pointLight color="#22c55e" intensity={0.8} distance={0.3} />
      </group>
      {/* Red PWR LED */}
      <group position={[-0.38, 0.035, 0.22]}>
        <mesh ref={pwrLedRef}>
          <cylinderGeometry args={[0.022, 0.022, 0.016, 12]} />
          <meshBasicMaterial color={new THREE.Color('#ef4444')} />
        </mesh>
        <pointLight color="#ef4444" intensity={0.8} distance={0.3} />
      </group>
    </group>
  );
};
