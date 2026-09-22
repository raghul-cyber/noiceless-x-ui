import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore } from '../../store/useViewerStore';
import { NOISE_SCENARIOS } from '../../data/scenariosData';

export const NoiseParticles: React.FC = () => {
  const { simulationRunning, noiseScenario, noiseIntensity } = useViewerStore();
  const pointsRef = useRef<THREE.Points>(null);

  const scenarioConfig = useMemo(() => {
    return NOISE_SCENARIOS.find((s) => s.id === noiseScenario) || NOISE_SCENARIOS[1];
  }, [noiseScenario]);

  // Generate 250 ambient noise particles surrounding the headset & soldier
  const { positions, velocities, colors } = useMemo(() => {
    const count = 260;
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const baseColor = new THREE.Color(scenarioConfig.color);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 0.8 + Math.random() * 1.2;

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi) * 0.75;
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Inward velocity directed toward Left Earcup External Ref Mic [-0.18, 0.01, 0.02]
      vel[i * 3] = (-0.18 - pos[i * 3]) * 0.018;
      vel[i * 3 + 1] = (0.01 - pos[i * 3 + 1]) * 0.018;
      vel[i * 3 + 2] = (0.02 - pos[i * 3 + 2]) * 0.018;

      const c = baseColor.clone().offsetHSL(0, (Math.random() - 0.5) * 0.1, (Math.random() - 0.5) * 0.2);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return { positions: pos, velocities: vel, colors: col };
  }, [scenarioConfig]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !simulationRunning) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array as Float32Array;
    const speedMult = (noiseIntensity / 80) * (delta * 60);

    for (let i = 0; i < array.length / 3; i++) {
      array[i * 3] += velocities[i * 3] * speedMult;
      array[i * 3 + 1] += velocities[i * 3 + 1] * speedMult;
      array[i * 3 + 2] += velocities[i * 3 + 2] * speedMult;

      const dx = array[i * 3] - (-0.18);
      const dy = array[i * 3 + 1] - 0.01;
      const dz = array[i * 3 + 2] - 0.02;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 0.06) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const radius = 0.9 + Math.random() * 1.0;

        array[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        array[i * 3 + 1] = radius * Math.cos(phi) * 0.75;
        array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.016}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
