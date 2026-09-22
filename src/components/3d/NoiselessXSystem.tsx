import React from 'react';
import { useViewerStore } from '../../store/useViewerStore';
import { AcousticTestStand } from './AcousticTestStand';
import { TacticalHeadset } from './TacticalHeadset';
import { CableHarness } from './CableHarness';
import { WaistPouch } from './WaistPouch';
import { CancellationZone3D } from '../simulation/CancellationZone3D';

/**
 * NOISELESS-X HARDWARE TWIN & ACOUSTIC SIMULATION SYSTEM
 * Soldier 3D mannequin model replaced with high-precision Acoustic Engineering Test Rig:
 * - Stand holds Headset at calibrated 15.5 cm binaural head ear level
 * - Clamps Left & Right Acoustic Earcups, Headband, and Boom Microphone
 * - Directs continuous Cable Harness down to Waist Equipment Mount
 * - Waist Cradle securely houses Tactical Pouch with Raspberry Pi 4, DAC, DSP & Battery
 * - Active 3D Ear Cavity Destructive Cancellation Node operates inside Left Earcup
 * - Pure product hardware and acoustic simulations with zero visual occlusion
 */
export const NoiselessXSystem: React.FC = () => {
  const { headFlipped } = useViewerStore();

  return (
    <group name="NOISELESS_X_HARDWARE_SYSTEM">
      {/* 1. Precision Acoustic Engineering Test Stand & Mounting Rig (Replaces Soldier Model) */}
      <AcousticTestStand />

      {/* 2. NOISELESS-X Tactical Headset Assembly */}
      <group
        name="HEADSET_SYSTEM"
        position={[0, -0.201, 0.008]}
        rotation={[0, headFlipped ? Math.PI : 0, 0]}
      >
        <group name="HEADSET_MOUNT" position={[0, 0.060, -0.007]} scale={[0.124, 0.124, 0.124]}>
          <TacticalHeadset />
        </group>
      </group>

      {/* 3. Shielded Military Comms Cable Harness Linking Earcup to Waist Module */}
      <group name="HEADSET_CABLE">
        <CableHarness />
      </group>

      {/* 4. Waist Tactical Equipment Pouch Housing Raspberry Pi 4 Model B, DSP & Battery */}
      <group name="WAIST" position={[-0.20, -0.68, 0.07]} scale={[0.25, 0.25, 0.25]}>
        <group name="TACTICAL_POUCH">
          <WaistPouch />
        </group>
      </group>

      {/* 5. In-Ear Destructive Interference Acoustic Cancellation Node */}
      <CancellationZone3D />
    </group>
  );
};
