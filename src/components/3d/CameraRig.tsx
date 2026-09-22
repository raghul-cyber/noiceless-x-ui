import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useViewerStore, viewerStore } from '../../store/useViewerStore';

export const CameraRig: React.FC = () => {
  const { currentMode, selectedComponentId, cameraPreset, workflowStep } = useViewerStore();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Re-centered hardware midpoint: Y = -0.40 (Headset at -0.14, Waist pouch at -0.68, Stand base at -0.90)
  const targetCamPos = useRef(new THREE.Vector3(0.2, -0.35, 1.95));
  const targetLookAt = useRef(new THREE.Vector3(0, -0.40, 0));
  const isTransitioning = useRef<boolean>(true);

  useEffect(() => {
    isTransitioning.current = true;

    // 1. Workflow Stage Camera Framing (Active in WORKFLOW mode when no specific component is manually clicked)
    if (currentMode === 'WORKFLOW' && !selectedComponentId) {
      switch (workflowStep) {
        case 1: // Stage 1: Ambient Surrounding Noise Threat Field
          targetCamPos.current.set(0.65, -0.30, 2.1);
          targetLookAt.current.set(-0.05, -0.38, 0);
          return;
        case 2: // Stage 2: External Reference Microphone
          targetCamPos.current.set(-0.28, -0.12, 0.24);
          targetLookAt.current.set(-0.12, -0.141, 0.015);
          return;
        case 3: // Stage 3: Raspberry Pi 4 & DSP Compute Core (Waist)
          targetCamPos.current.set(-0.30, -0.60, 0.42);
          targetLookAt.current.set(-0.20, -0.68, 0.07);
          return;
        case 4: // Stage 4: 40mm Speaker Anti-Noise Driver
          targetCamPos.current.set(-0.22, -0.12, 0.22);
          targetLookAt.current.set(-0.065, -0.141, 0.001);
          return;
        case 5: // Stage 5: In-Ear Destructive Wave Cancellation Node
          targetCamPos.current.set(-0.20, -0.13, 0.18);
          targetLookAt.current.set(-0.076, -0.141, 0.001);
          return;
        case 6: // Stage 6: Boom Microphone & Speech Path
          targetCamPos.current.set(-0.08, -0.14, 0.32);
          targetLookAt.current.set(-0.025, -0.165, 0.11);
          return;
        case 7: // Stage 7: Clear Voice Tactical Radio Broadcast
          targetCamPos.current.set(0.35, -0.40, 1.85);
          targetLookAt.current.set(-0.10, -0.45, 0.04);
          return;
      }
    }

    // 2. Component-specific focus framing
    if (selectedComponentId === 'raspberryPi' || selectedComponentId === 'waistPouch' || selectedComponentId === 'audioInterface' || selectedComponentId === 'dspModule') {
      targetCamPos.current.set(-0.28, -0.60, 0.42);
      targetLookAt.current.set(-0.20, -0.68, 0.07);
      return;
    }

    if (selectedComponentId === 'boomMic') {
      targetCamPos.current.set(-0.08, -0.14, 0.32);
      targetLookAt.current.set(-0.025, -0.165, 0.11);
      return;
    }

    if (selectedComponentId === 'externalRefMic') {
      targetCamPos.current.set(-0.28, -0.12, 0.24);
      targetLookAt.current.set(-0.12, -0.141, 0.015);
      return;
    }

    if (selectedComponentId === 'speakerDriver' || selectedComponentId === 'internalErrorMic' || selectedComponentId === 'headsetPCB') {
      targetCamPos.current.set(-0.22, -0.12, 0.20);
      targetLookAt.current.set(-0.076, -0.141, 0.001);
      return;
    }

    if (selectedComponentId === 'headband') {
      targetCamPos.current.set(0.0, -0.02, 0.42);
      targetLookAt.current.set(0.0, -0.065, 0.001);
      return;
    }

    if (selectedComponentId === 'cableHarness') {
      targetCamPos.current.set(-0.24, -0.38, 0.52);
      targetLookAt.current.set(-0.15, -0.38, 0.06);
      return;
    }

    // 3. Explicit Camera Presets
    if (cameraPreset === 'SYSTEM_OVERVIEW') {
      targetCamPos.current.set(0.2, -0.35, 1.95);
      targetLookAt.current.set(0, -0.40, 0);
      return;
    }
    if (cameraPreset === 'HEADSET') {
      targetCamPos.current.set(-0.10, -0.14, 0.48);
      targetLookAt.current.set(-0.04, -0.14, 0.01);
      return;
    }
    if (cameraPreset === 'EAR_CANAL') {
      targetCamPos.current.set(-0.20, -0.13, 0.18);
      targetLookAt.current.set(-0.076, -0.141, 0.001);
      return;
    }
    if (cameraPreset === 'BOOM_MIC') {
      targetCamPos.current.set(-0.08, -0.14, 0.32);
      targetLookAt.current.set(-0.025, -0.165, 0.11);
      return;
    }
    if (cameraPreset === 'WAIST_DSP' || cameraPreset === 'WAIST') {
      targetCamPos.current.set(-0.30, -0.60, 0.42);
      targetLookAt.current.set(-0.20, -0.68, 0.07);
      return;
    }
    if (cameraPreset === 'LEFT') {
      targetCamPos.current.set(-1.8, -0.30, 0.3);
      targetLookAt.current.set(0, -0.40, 0);
      return;
    }
    if (cameraPreset === 'RIGHT') {
      targetCamPos.current.set(1.8, -0.30, 0.3);
      targetLookAt.current.set(0, -0.40, 0);
      return;
    }
    if (cameraPreset === 'BACK') {
      targetCamPos.current.set(0, -0.35, -2.0);
      targetLookAt.current.set(0, -0.40, 0);
      return;
    }
    if (cameraPreset === 'TOP') {
      targetCamPos.current.set(0, 1.6, 0.3);
      targetLookAt.current.set(0, -0.2, 0);
      return;
    }
    if (cameraPreset === 'CLOSEUP') {
      targetCamPos.current.set(-0.12, -0.12, 0.46);
      targetLookAt.current.set(-0.04, -0.14, 0.05);
      return;
    }

    // 4. Default View Modes
    switch (currentMode) {
      case 'WORKFLOW':
      case 'SIMULATION':
        targetCamPos.current.set(0.35, -0.35, 1.85);
        targetLookAt.current.set(-0.05, -0.40, 0);
        break;
      case 'ASSEMBLED':
        targetCamPos.current.set(0.2, -0.35, 1.95);
        targetLookAt.current.set(0, -0.40, 0);
        break;
      case 'EXPLODED':
        targetCamPos.current.set(0.55, -0.35, 1.9);
        targetLookAt.current.set(-0.08, -0.40, 0);
        break;
      case 'INTERNAL':
      case 'CUTAWAY':
        targetCamPos.current.set(-0.24, -0.06, 0.22);
        targetLookAt.current.set(-0.076, -0.141, 0.001);
        break;
      case 'X-RAY':
        targetCamPos.current.set(0.25, -0.35, 1.9);
        targetLookAt.current.set(0, -0.40, 0);
        break;
      case '360':
        targetLookAt.current.set(0, -0.40, 0);
        break;
    }
  }, [currentMode, selectedComponentId, cameraPreset, workflowStep]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onStart = () => {
      // Manual user drag interrupts automatic lerping
      isTransitioning.current = false;
    };

    controls.addEventListener('start', onStart);
    return () => {
      controls.removeEventListener('start', onStart);
    };
  }, []);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    if (currentMode === '360') {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 2.0;
    } else {
      controlsRef.current.autoRotate = false;

      if (isTransitioning.current) {
        camera.position.lerp(targetCamPos.current, delta * 3.8);
        controlsRef.current.target.lerp(targetLookAt.current, delta * 3.8);

        const posDist = camera.position.distanceTo(targetCamPos.current);
        const targetDist = controlsRef.current.target.distanceTo(targetLookAt.current);
        if (posDist < 0.015 && targetDist < 0.015) {
          isTransitioning.current = false;
        }
      }
    }

    const dist = camera.position.distanceTo(controlsRef.current.target);
    viewerStore.setCameraDistance(dist);

    const angle = Math.round((controlsRef.current.getAzimuthalAngle() * 180) / Math.PI);
    const normalizedAngle = (angle + 360) % 360;
    viewerStore.setRotationAngle(normalizedAngle);

    controlsRef.current.update();
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={0.10} // Macro zoom
      maxDistance={4.5}  // Overview zoom
      minPolarAngle={0.05}
      maxPolarAngle={Math.PI * 0.95}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
    />
  );
};
