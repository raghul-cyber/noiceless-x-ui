import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore } from '../../store/useViewerStore';
import { getNoiseScenario } from '../../data/scenariosData';

/**
 * Multi-Domain Real-Time Acoustic Simulation:
 * 1. Ambient Noise Wavefronts (Red/Scenario Color): Pressure waves converging onto External Ref Mic.
 * 2. Anti-Noise Sound Waves (Sky Blue): Inverted acoustic arcs radiating from 40mm speaker driver.
 * 3. Human Speech Acoustic Waves (Neon Green): Vocal formants propagating from lips into Boom Mic.
 */
export const AcousticWavefronts: React.FC = () => {
  const { simulationRunning, noiseScenario, noiseIntensity, currentMode, voiceActive, ancActive, workflowStep, customDataset } = useViewerStore();
  
  const wavefrontGroupRef = useRef<THREE.Group>(null);
  const captureGlowRef = useRef<THREE.Mesh>(null);
  const speakerWaveGroupRef = useRef<THREE.Group>(null);
  const vocalWaveGroupRef = useRef<THREE.Group>(null);

  const scenarioConfig = useMemo(() => {
    return getNoiseScenario(noiseScenario, customDataset);
  }, [noiseScenario, customDataset]);

  // World position of Left Earcup External Reference Microphone capsule tip
  const refMicPos = useMemo(() => new THREE.Vector3(-0.12, -0.141, 0.015), []);
  // World position of Left Earcup 40mm Speaker Driver
  const speakerPos = useMemo(() => new THREE.Vector3(-0.065, -0.141, 0.001), []);
  // World position of Soldier mouth/lips speech emission origin
  const mouthPos = useMemo(() => new THREE.Vector3(-0.012, -0.155, 0.085), []);
  // World position of Boom Microphone capsule tip
  const boomMicPos = useMemo(() => new THREE.Vector3(-0.025, -0.165, 0.11), []);

  useFrame((state) => {
    if (!simulationRunning || (currentMode !== 'SIMULATION' && currentMode !== 'WORKFLOW')) return;
    const t = state.clock.getElapsedTime();

    // 1. Animate Inward Collapsing Ambient Acoustic Wavefront Arcs
    if (wavefrontGroupRef.current) {
      wavefrontGroupRef.current.children.forEach((child, idx) => {
        const arc = child as THREE.Mesh;
        const cycle = ((t * 1.6 + idx * 0.28) % 1.2);
        const radius = Math.max(0.04, 0.48 - (cycle / 1.2) * 0.43);
        arc.scale.set(radius, radius, radius);

        const mat = arc.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin((cycle / 1.2) * Math.PI) * 0.75;
      });
    }

    // 2. Reference Mic Capture Point Gentle Glow
    if (captureGlowRef.current) {
      const pulse = 1 + Math.sin(t * 4) * 0.15;
      captureGlowRef.current.scale.set(pulse, pulse, pulse);
      (captureGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(t * 4) * 0.2;
    }

    // 4. Animate Outward Expanding Anti-Noise Wavefront Arcs from Speaker Driver
    if (speakerWaveGroupRef.current && (ancActive || (currentMode === 'WORKFLOW' && (workflowStep === 4 || workflowStep === 5)))) {
      speakerWaveGroupRef.current.children.forEach((child, idx) => {
        const arc = child as THREE.Mesh;
        const cycle = ((t * 1.8 + idx * 0.30) % 1.0);
        // Expands from speaker cone into ear cavity (from 0.01m to 0.07m)
        const radius = 0.015 + cycle * 0.065;
        arc.scale.set(radius, radius, radius);

        const mat = arc.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin(cycle * Math.PI) * 0.70;
      });
    }

    // 5. Animate Vocal Speech Waves from Mouth toward Boom Mic
    if (vocalWaveGroupRef.current && voiceActive) {
      vocalWaveGroupRef.current.children.forEach((child, idx) => {
        const arc = child as THREE.Mesh;
        const cycle = ((t * 2.2 + idx * 0.25) % 0.9);
        const radius = 0.01 + cycle * 0.05;
        arc.scale.set(radius, radius, radius);

        const mat = arc.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin(cycle * Math.PI) * 0.85;
      });
    }
  });

  const isActive = simulationRunning && (currentMode === 'SIMULATION' || currentMode === 'WORKFLOW');
  if (!isActive) return null;

  return (
    <group name="AcousticSimulationWavefronts">
      {/* 1. Inward Converging Ambient Noise Wavefront Arcs Absorbing into External Reference Mic */}
      <group ref={wavefrontGroupRef} position={refMicPos}>
        {[0, 1, 2, 3].map((idx) => (
          <mesh key={idx} rotation={[0, Math.PI / 2, idx * 0.35]}>
            <torusGeometry args={[1, 0.016, 12, 32, Math.PI * 1.1]} />
            <meshBasicMaterial
              color={new THREE.Color(scenarioConfig.color)}
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 3. External Ref Mic High-Energy Absorption Core Glow at Capsule Tip */}
      <mesh ref={captureGlowRef} position={refMicPos}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial
          color={new THREE.Color(scenarioConfig.color)}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Speaker Driver Anti-Noise Outward Expanding Arcs (Sky Blue 180° Inverted) */}
      <group ref={speakerWaveGroupRef} position={speakerPos}>
        {[0, 1, 2].map((idx) => (
          <mesh key={idx} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1, 0.012, 12, 28, Math.PI * 1.2]} />
            <meshBasicMaterial
              color="#38bdf8"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 5. Vocal Cord Speech Soundwaves Emanating from Mouth into Boom Microphone (Neon Green) */}
      <group ref={vocalWaveGroupRef} position={mouthPos}>
        {[0, 1, 2].map((idx) => (
          <mesh key={idx} rotation={[0.4, 0.6, 0]}>
            <torusGeometry args={[1, 0.014, 12, 24, Math.PI * 0.9]} />
            <meshBasicMaterial
              color="#00e676"
              transparent
              opacity={0.75}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* 6. Boom Mic Capsule Acceptance Cone Glow */}
      <mesh position={boomMicPos}>
        <sphereGeometry args={[0.014, 14, 14]} />
        <meshBasicMaterial
          color="#00e676"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
