import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Grid } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { NoiselessXSystem } from './NoiselessXSystem';
import { ComponentLabels3D } from './ComponentLabels3D';
import { AcousticWavefronts } from '../simulation/AcousticWavefronts';
import { SignalPulseFlow } from '../simulation/SignalPulseFlow';
import { useViewerStore } from '../../store/useViewerStore';

export const SceneContainer: React.FC = () => {
  const { currentMode } = useViewerStore();
  const isSimActive = currentMode === 'SIMULATION' || currentMode === 'WORKFLOW';

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        camera={{ position: [0.15, -0.35, 1.95], fov: 42, near: 0.05, far: 50 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#060a07');
        }}
      >
        <Suspense fallback={null}>
          {/* Tactical Military Lighting */}
          <ambientLight intensity={1.2} />

          {/* Dedicated Headset Key Spotlight */}
          <spotLight
            position={[-1.2, 0.4, 1.5]}
            intensity={2.8}
            angle={0.65}
            penumbra={0.7}
            color="#f4fdf6"
          />

          {/* Dedicated Waist Pouch & Raspberry Pi Key Spotlight */}
          <spotLight
            position={[-1.1, -0.4, 1.5]}
            intensity={3.2}
            angle={0.6}
            penumbra={0.6}
            color="#ffffff"
          />

          {/* Key Light (Upper Right Front) */}
          <directionalLight
            position={[3.5, 4, 3.5]}
            intensity={2.6}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />

          {/* Rim Light (Upper Left Rear for equipment silhouette edge definition) */}
          <directionalLight position={[-3.5, 3.5, -2.5]} intensity={2.2} color="#7ea385" />

          {/* Frontal Soft Fill Light */}
          <directionalLight position={[0, 0.5, 3.5]} intensity={1.4} color="#e8f2e6" />

          {/* Floor Bounce Light */}
          <directionalLight position={[0, -1.5, 1.5]} intensity={0.6} color="#3d5c43" />

          {/* 3D Hardware Twin: Headset, Cable, and Waist Module mounted on Acoustic Test Rig */}
          <NoiselessXSystem />
          <ComponentLabels3D />

          {/* Real-Time Acoustic & Signal Simulations (Active in WORKFLOW & SIMULATION modes) */}
          {isSimActive && (
            <>
              <AcousticWavefronts />
              <SignalPulseFlow />
            </>
          )}

          {/* Floor Contact Shadows under Test Stand Base */}
          <ContactShadows
            position={[0, -0.92, 0]}
            opacity={0.85}
            scale={3.2}
            blur={1.8}
            far={1.5}
          />

          {/* Tactical Military Grid Floor */}
          <Grid
            position={[0, -0.92, 0]}
            args={[8, 8]}
            cellSize={0.2}
            cellThickness={0.6}
            cellColor="#142418"
            sectionSize={0.8}
            sectionThickness={1.2}
            sectionColor="#263f2b"
            fadeDistance={6}
            fadeStrength={1.5}
          />

          {/* Dynamic Smooth Camera Rig */}
          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  );
};
