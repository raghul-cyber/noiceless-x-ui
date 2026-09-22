import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore } from '../../store/useViewerStore';
import { getNoiseScenario } from '../../data/scenariosData';

/**
 * 3D Ear Canal Destructive Wave Interference Simulation Node:
 * Visualizes the exact acoustic cancellation physics occurring in the left earcup ear cavity:
 * 1. Ambient Noise Wavefront (Red/Amber) enters through the earcup seal.
 * 2. Anti-Noise Acoustic Wave (Sky Blue) is generated 180° out-of-phase by the 40mm speaker.
 * 3. Destructive Interference collision nullifies the pressure wave into a flatline (Cyan/Green).
 * 4. Residual Error is sampled in real-time by the Internal Error Mic.
 */
export const CancellationZone3D: React.FC = () => {
  const { currentMode, simulationRunning, ancActive, noiseScenario, noiseIntensity, showWaveCollision, workflowStep, customDataset } = useViewerStore();
  
  const inWaveRef = useRef<THREE.Line>(null);
  const antiWaveRef = useRef<THREE.Line>(null);
  const resultWaveRef = useRef<THREE.Line>(null);
  const cancelGlowRef = useRef<THREE.Mesh>(null);
  const errorMicConeRef = useRef<THREE.Mesh>(null);

  const scenarioConfig = useMemo(() => {
    return getNoiseScenario(noiseScenario, customDataset);
  }, [noiseScenario, customDataset]);

  // Ear cavity center point
  const earCavityPos = useMemo(() => new THREE.Vector3(-0.076, -0.141, 0.001), []);

  // Geometry points for 3D sinusoidal waves
  const sampleCount = 48;
  const { inGeom, antiGeom, resGeom } = useMemo(() => {
    const inGeo = new THREE.BufferGeometry();
    const antiGeo = new THREE.BufferGeometry();
    const resGeo = new THREE.BufferGeometry();

    const inPos = new Float32Array(sampleCount * 3);
    const antiPos = new Float32Array(sampleCount * 3);
    const resPos = new Float32Array(sampleCount * 3);

    inGeo.setAttribute('position', new THREE.BufferAttribute(inPos, 3));
    antiGeo.setAttribute('position', new THREE.BufferAttribute(antiPos, 3));
    resGeo.setAttribute('position', new THREE.BufferAttribute(resPos, 3));

    return { inGeom: inGeo, antiGeom: antiGeo, resGeom: resGeo };
  }, []);

  useFrame((state) => {
    if (!simulationRunning || (!showWaveCollision && currentMode !== 'SIMULATION' && currentMode !== 'WORKFLOW')) return;
    const t = state.clock.getElapsedTime();

    const inPositions = inGeom.attributes.position.array as Float32Array;
    const antiPositions = antiGeom.attributes.position.array as Float32Array;
    const resPositions = resGeom.attributes.position.array as Float32Array;

    const freq = 14.0;
    const amp = (noiseIntensity / 100) * 0.022;
    const isStep5 = currentMode === 'WORKFLOW' && workflowStep === 5;
    const effectiveAnc = ancActive || isStep5;

    for (let i = 0; i < sampleCount; i++) {
      const z = (i / (sampleCount - 1) - 0.5) * 0.08; // Along Z axis inside cavity
      const phase = t * 8.0 + (i / sampleCount) * freq;

      // 1. Ambient incoming noise wave
      const yIn = Math.sin(phase) * amp;
      inPositions[i * 3] = 0;
      inPositions[i * 3 + 1] = yIn;
      inPositions[i * 3 + 2] = z;

      // 2. 180-degree inverted anti-noise wave (Phase + PI)
      const yAnti = effectiveAnc ? Math.sin(phase + Math.PI) * amp * 0.96 : 0;
      antiPositions[i * 3] = 0.005;
      antiPositions[i * 3 + 1] = yAnti;
      antiPositions[i * 3 + 2] = z;

      // 3. Resultant Wave: Destructive superposition (Noise + AntiNoise)
      const yRes = yIn + yAnti;
      resPositions[i * 3] = 0.010;
      resPositions[i * 3 + 1] = yRes;
      resPositions[i * 3 + 2] = z;
    }

    inGeom.attributes.position.needsUpdate = true;
    antiGeom.attributes.position.needsUpdate = true;
    resGeom.attributes.position.needsUpdate = true;

    // Destructive nullification node pulsation
    if (cancelGlowRef.current) {
      const pulse = 1.0 + Math.sin(t * 10) * 0.3;
      cancelGlowRef.current.scale.set(pulse, pulse, pulse);
      const mat = cancelGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = effectiveAnc ? 0.6 + Math.sin(t * 10) * 0.3 : 0.1;
    }

    // Internal error mic feedback sampling beam
    if (errorMicConeRef.current) {
      const mat = errorMicConeRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.3 + Math.sin(t * 12) * 0.25;
    }
  });

  const isActive = simulationRunning && (showWaveCollision || currentMode === 'SIMULATION' || currentMode === 'WORKFLOW');
  if (!isActive) return null;

  return (
    <group name="EarCanalCancellationZone" position={earCavityPos}>
      {/* 1. Incoming Ambient Noise Sine Wave (Vivid Red / Scenario Tint) */}
      <primitive
        ref={inWaveRef}
        object={new THREE.Line(inGeom, new THREE.LineBasicMaterial({
          color: new THREE.Color(scenarioConfig.color),
          linewidth: 2,
          transparent: true,
          opacity: 0.85,
        }))}
      />

      {/* 2. Speaker Anti-Noise Inverted Wave (Electric Sky Blue: 180° Inversion) */}
      {ancActive && (
        <primitive
          ref={antiWaveRef}
          object={new THREE.Line(antiGeom, new THREE.LineBasicMaterial({
            color: new THREE.Color('#38bdf8'),
            linewidth: 2,
            transparent: true,
            opacity: 0.85,
          }))}
        />
      )}

      {/* 3. Resultant Ear Canal Residual Wave (Flatline Emerald: Superposition Sum -> 0) */}
      <primitive
        ref={resultWaveRef}
        object={new THREE.Line(resGeom, new THREE.LineBasicMaterial({
          color: ancActive ? new THREE.Color('#00e676') : new THREE.Color('#f43f5e'),
          linewidth: 3,
          transparent: true,
          opacity: 0.95,
        }))}
      />

      {/* 4. Destructive Nullification Core Glow (Acoustic Pressure Cancellation Node) */}
      <mesh ref={cancelGlowRef} position={[0.005, 0, 0]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshBasicMaterial
          color={ancActive ? '#00e599' : '#f43f5e'}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Internal Error Mic Feedback Detection Cone (Sampling cavity e[n]) */}
      <mesh ref={errorMicConeRef} position={[0.005, 0, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.022, 0.04, 16, 1, true]} />
        <meshBasicMaterial
          color="#d500f9"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 6. In-Ear Cancellation Acoustic Boundary Rings */}
      {[-0.03, 0, 0.03].map((zOffset, idx) => (
        <mesh key={idx} position={[0, 0, zOffset]} rotation={[0, Math.PI / 2, 0]}>
          <ringGeometry args={[0.022, 0.024, 24]} />
          <meshBasicMaterial
            color="#00e599"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};
