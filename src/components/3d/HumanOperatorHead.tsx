import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF, useTexture } from '@react-three/drei';
import { useViewerStore } from '../../store/useViewerStore';
import { TacticalHelmet } from './TacticalHelmet';

interface HumanOperatorHeadProps {
  explodeDistance?: number;
}

/**
 * Photorealistic Anatomically Accurate Human Operator Head
 * Laser-scanned 3D human head geometry with real human facial features:
 * - Natural nose, lips, jawline, cheeks, ears, and neck
 * - High-resolution skin pores, wrinkles, and natural tone
 * - High-cut tactical FAST ballistic helmet with chin strap
 * - Ballistic tactical eye protection resting on nose bridge
 */
export const HumanOperatorHead: React.FC<HumanOperatorHeadProps> = ({ explodeDistance = 0 }) => {
  const { currentMode } = useViewerStore();
  const isXRay = currentMode === 'X-RAY';

  // Load laser-scanned human head 3D mesh
  const { scene: headScene } = useGLTF('/LeePerrySmith.glb');

  // Load high-resolution skin diffuse, normal (pores/wrinkles), and specular roughness maps
  const [colorMap, normalMap, specMap] = useTexture([
    '/Map-COL.jpg',
    '/Map-NORM.jpg',
    '/Map-SPEC.jpg',
  ]);

  // Configure texture parameters
  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.flipY = true;
    normalMap.flipY = true;
    specMap.flipY = true;
  }, [colorMap, normalMap, specMap]);

  // Extract and prepare human head mesh with photorealistic skin shader
  const headMesh = useMemo(() => {
    const rawMesh = headScene.getObjectByName('LeePerrySmith') as THREE.Mesh;
    if (!rawMesh) return null;

    const clonedGeo = rawMesh.geometry.clone();

    // Physically Based Realistic Skin Shader
    const skinMaterial = new THREE.MeshStandardMaterial({
      map: colorMap,
      normalMap: normalMap,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: specMap,
      roughness: 0.62,
      metalness: 0.02,
      envMapIntensity: 0.65,
    });

    const mesh = new THREE.Mesh(clonedGeo, skinMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }, [headScene, colorMap, normalMap, specMap]);

  // X-Ray material when in holographic inspection mode
  const xRayMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#031526'),
      emissive: new THREE.Color('#00558f'),
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
    });
  }, []);

  if (!headMesh) return null;

  return (
    <group name="HUMAN_OPERATOR_HEAD_ASSEMBLY" position={[0, 0, 0]}>
      {/* 1. Laser-Scanned Photorealistic Human Head Mesh (Scaled to adult human proportions) */}
      <primitive
        object={headMesh}
        scale={[0.044, 0.044, 0.044]}
        material={isXRay ? xRayMaterial : headMesh.material}
      />

      {/* 2. Modern FAST Ballistic Tactical Helmet (High-cut ear relief for NOISELESS-X headset) */}
      <group position={[0, 0, 0]}>
        <TacticalHelmet explodeDistance={explodeDistance} />
      </group>

      {/* 3. Ballistic Combat Eyewear (Oakley SI M-Frame style resting on nose bridge at Y = 0.068, Z = 0.088) */}
      <group position={[0, 0.068, 0.088]} name="BallisticEyewear">
        {/* Aerodynamic Frame Brow Bar */}
        <mesh castShadow={!isXRay}>
          <boxGeometry args={[0.105, 0.006, 0.02]} />
          <meshStandardMaterial
            color={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#14171d')}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
        {/* Nose Pad Bridge */}
        <mesh position={[0, -0.008, 0.006]} castShadow={!isXRay}>
          <boxGeometry args={[0.016, 0.012, 0.008]} />
          <meshStandardMaterial color="#0b0e14" roughness={0.8} />
        </mesh>
        {/* Ballistic Polycarbonate Shield Lens (Smoke tint, high impact, subtle reflection) */}
        <mesh position={[0, -0.014, 0.006]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.098, 0.028, 0.002]} />
          <meshPhysicalMaterial
            color={isXRay ? new THREE.Color('#00e5ff') : new THREE.Color('#1e293b')}
            roughness={0.1}
            metalness={0.1}
            transmission={isXRay ? 0.7 : 0.85}
            transparent
            opacity={isXRay ? 0.4 : 0.7}
            reflectivity={0.6}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </group>
    </group>
  );
};

useGLTF.preload('/LeePerrySmith.glb');
