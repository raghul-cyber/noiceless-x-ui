import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useViewerStore } from '../../store/useViewerStore';

/**
 * Animated Signal Flow & Pipeline Data Packet Simulation:
 * Connects physical hardware components via real-time data packets along the cable harness:
 * 1. Reference Noise Packets (Cyan) flow DOWN from Ref Mic into Raspberry Pi DSP.
 * 2. Anti-Noise Inverted Packets (Sky Blue) flow UP from DSP into Speaker Driver.
 * 3. Near-mouth Voice Packets (Neon Green) flow from Boom Mic DOWN into DeepFilterNet2 AI.
 * 4. Tactical Radio Out Packets (Emerald) broadcast outward from the Waist Unit.
 */
export const SignalPulseFlow: React.FC = () => {
  const { simulationRunning, currentMode, voiceActive, ancActive, explodedProgress, workflowStep } = useViewerStore();

  const refGroupRef = useRef<THREE.Group>(null);
  const upGroupRef = useRef<THREE.Group>(null);
  const errorMicPulseRef = useRef<THREE.Mesh>(null);
  const speakerCancelPulseRef = useRef<THREE.Mesh>(null);
  const boomVoiceRef = useRef<THREE.Mesh>(null);
  const voiceWireRef = useRef<THREE.Mesh>(null);
  const piComputeGlowRef = useRef<THREE.Mesh>(null);
  const piComputePointRef = useRef<THREE.PointLight>(null);
  const radioBroadcastGroupRef = useRef<THREE.Group>(null);

  // Exact 3D spline connecting Left Earcup down through harness into Raspberry Pi at waist
  const cableCurve = React.useMemo(() => {
    const startX = -0.08 - explodedProgress * 0.15;
    const startY = -0.183;
    const startZ = 0.001;

    const endX = -0.25;
    const endY = -0.58;
    const endZ = 0.06;

    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(startX, startY, startZ),     // Left Earcup strain relief exit
      new THREE.Vector3(-0.11, -0.28, 0.03),         // Neck / collar drape
      new THREE.Vector3(-0.15, -0.38, 0.06),         // Upper torso retaining clip
      new THREE.Vector3(-0.19, -0.48, 0.07),         // Mid flank route
      new THREE.Vector3(endX, endY, endZ),           // Enters top gland of Waist Pouch (Raspberry Pi)
    ]);
  }, [explodedProgress]);

  useFrame((state) => {
    if (!simulationRunning || (currentMode !== 'SIMULATION' && currentMode !== 'WORKFLOW')) return;
    const t = state.clock.getElapsedTime();

    // 1. External Noise Reference Signal: Pulses traveling DOWN cable into Raspberry Pi
    if (refGroupRef.current) {
      refGroupRef.current.children.forEach((child, idx) => {
        const mesh = child as THREE.Mesh;
        const prog = ((t * 1.2 + idx * 0.32) % 1);
        const pt = cableCurve.getPointAt(prog);
        mesh.position.copy(pt);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin(prog * Math.PI) * 0.95;
      });
    }

    // 2. Anti-Noise Inverted Signal: Pulses traveling UP cable from Raspberry Pi to Speaker
    if (upGroupRef.current && ancActive) {
      upGroupRef.current.children.forEach((child, idx) => {
        const mesh = child as THREE.Mesh;
        const prog = 1 - ((t * 1.2 + idx * 0.32 + 0.5) % 1);
        const pt = cableCurve.getPointAt(prog);
        mesh.position.copy(pt);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = Math.sin(prog * Math.PI) * 0.95;
      });
    }

    // 3. Internal Error Mic Live Sampling Pulse inside Left Earcup
    if (errorMicPulseRef.current && ancActive) {
      const s = 1 + Math.sin(t * 10) * 0.35;
      errorMicPulseRef.current.scale.set(s, s, s);
      (errorMicPulseRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 10) * 0.35;
    }

    // 4. 40mm Speaker Anti-Noise Acoustic Wave Emission
    if (speakerCancelPulseRef.current && ancActive) {
      const pulse = ((t * 2.2) % 1);
      const s = 0.5 + pulse * 1.2;
      speakerCancelPulseRef.current.scale.set(s, s, s);
      (speakerCancelPulseRef.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(pulse * Math.PI) * 0.7;
    }

    // 5. Soldier Voice traveling from mouth into Boom Mic capsule
    if (boomVoiceRef.current && voiceActive) {
      const prog = (t * 2.6) % 1;
      boomVoiceRef.current.position.set(
        THREE.MathUtils.lerp(-0.012, -0.025, prog),
        THREE.MathUtils.lerp(-0.155, -0.165, prog),
        THREE.MathUtils.lerp(0.085, 0.11, prog)
      );
      (boomVoiceRef.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(prog * Math.PI);
    }

    // 6. Voice Signal traveling DOWN cable into Raspberry Pi DSP
    if (voiceWireRef.current && voiceActive) {
      const prog = (t * 0.95 + 0.15) % 1;
      const pt = cableCurve.getPointAt(prog);
      voiceWireRef.current.position.copy(pt);
      (voiceWireRef.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(prog * Math.PI) * 0.9;
    }

    // 7. Raspberry Pi DSP Active FxLMS Compute Aura at Waist
    if (piComputeGlowRef.current) {
      const isPiActive = currentMode === 'WORKFLOW' ? (workflowStep === 3 || workflowStep === 7) : true;
      const pulseSpeed = isPiActive ? 14 : 6;
      const s = 1 + Math.sin(t * pulseSpeed) * 0.35;
      piComputeGlowRef.current.scale.set(s, s, s);
      (piComputeGlowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * pulseSpeed) * 0.4;
    }
    if (piComputePointRef.current) {
      piComputePointRef.current.intensity = 1.4 + Math.sin(t * 8) * 0.9;
    }

    // 8. Tactical Radio Transmission Emission Rings (Active in Step 7)
    if (radioBroadcastGroupRef.current) {
      radioBroadcastGroupRef.current.children.forEach((child, idx) => {
        const ring = child as THREE.Mesh;
        const cycle = ((t * 1.5 + idx * 0.33) % 1.0);
        const radius = 0.05 + cycle * 0.25;
        ring.scale.set(radius, radius, radius);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - cycle) * 0.75;
      });
    }
  });

  const isActive = simulationRunning && (currentMode === 'SIMULATION' || currentMode === 'WORKFLOW');
  if (!isActive) return null;

  return (
    <group name="SignalPulseFlowSimulation">
      {/* 1. Downward Reference Noise Stream: 3 Glowing Packets (Cyan) */}
      <group ref={refGroupRef}>
        {[0, 1, 2].map((idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.015, 14, 14]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.9} />
          </mesh>
        ))}
      </group>

      {/* 2. Upward Anti-Noise Signal Stream: 3 Inverted Cancellation Packets (Sky Blue) */}
      <group ref={upGroupRef}>
        {[0, 1, 2].map((idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[0.015, 14, 14]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} />
          </mesh>
        ))}
      </group>

      {/* 3. Internal Error Mic Live Sampling Indicator (Neon Magenta) */}
      <mesh ref={errorMicPulseRef} position={[-0.075, -0.141, 0.001]}>
        <sphereGeometry args={[0.016, 14, 14]} />
        <meshBasicMaterial color="#d500f9" transparent opacity={0.8} />
      </mesh>

      {/* 4. 40mm Speaker Anti-Wave Cancellation Bubble */}
      <mesh ref={speakerCancelPulseRef} position={[-0.065, -0.141, 0.001]}>
        <ringGeometry args={[0.015, 0.035, 20]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* 5. Speech to Boom Mic Voice Pulse (Neon Green) */}
      <mesh ref={boomVoiceRef}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshBasicMaterial color="#00e676" transparent opacity={0.85} />
      </mesh>

      {/* 6. Speech Signal Down Cable to Raspberry Pi (Emerald) */}
      <mesh ref={voiceWireRef}>
        <sphereGeometry args={[0.013, 12, 12]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.9} />
      </mesh>

      {/* 7. Raspberry Pi 4 DSP Active Computation Aura at Waist (Vivid Gold) */}
      <group position={[-0.20, -0.66, 0.08]}>
        <mesh ref={piComputeGlowRef}>
          <ringGeometry args={[0.045, 0.068, 24]} />
          <meshBasicMaterial color="#ffb700" transparent opacity={0.65} side={THREE.DoubleSide} />
        </mesh>
        <pointLight ref={piComputePointRef} color="#ffb700" intensity={1.6} distance={0.6} />

        {/* 8. Tactical Radio Broadcast Transmission Antenna Rings */}
        <group ref={radioBroadcastGroupRef} position={[0, 0.08, 0]}>
          {[0, 1, 2].map((idx) => (
            <mesh key={idx} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1, 1.05, 32]} />
              <meshBasicMaterial color="#10b981" transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};
