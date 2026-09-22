import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations, useTexture } from '@react-three/drei';
import { useViewerStore } from '../../store/useViewerStore';

/**
 * Adult Human Soldier Body
 * Authentic US Army MultiCam / OCP patterned combat uniform with woven ripstop fabric,
 * tactical body armor, duty belt, and high-definition normal mapping.
 * Excises robotic helmet and visor to house the photorealistic human operator head.
 */
export const SoldierModel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { currentMode } = useViewerStore();
  const isXRay = currentMode === 'X-RAY';

  // Load authentic military camouflage pattern uniform textures
  const [camoMap, normalMap] = useTexture([
    '/soldier_camo_uniform.jpg',
    '/soldier_normal.jpg',
  ]);

  useEffect(() => {
    if (camoMap) {
      camoMap.flipY = false;
      camoMap.colorSpace = THREE.SRGBColorSpace;
      camoMap.needsUpdate = true;
    }
    if (normalMap) {
      normalMap.flipY = false;
      normalMap.needsUpdate = true;
    }
  }, [camoMap, normalMap]);

  // Load rigged human soldier model
  const { scene, animations } = useGLTF('/Soldier.glb');
  const { actions } = useAnimations(animations, groupRef);

  useEffect(() => {
    // Play realistic subtle tactical breathing idle animation
    if (actions['Idle']) {
      actions['Idle'].reset().fadeIn(0.5).play();
      actions['Idle'].timeScale = 0.45; // Slow, calm operational breathing
    }
    return () => {
      if (actions['Idle']) {
        actions['Idle'].fadeOut(0.3);
      }
    };
  }, [actions]);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = !isXRay;
        mesh.receiveShadow = !isXRay;

        // 1. Hide futuristic visor entirely
        if (mesh.name === 'vanguard_visor') {
          mesh.visible = false;
          return;
        }

        // 2. Remove robot helmet triangles from vanguard_Mesh
        if (mesh.name === 'vanguard_Mesh') {
          const geo = mesh.geometry;
          if (!geo.userData.headExcised) {
            const index = geo.index;
            const skinIndex = geo.attributes.skinIndex;
            const skinWeight = geo.attributes.skinWeight;

            if (index && skinIndex && skinWeight) {
              const isHeadVert = new Uint8Array(geo.attributes.position.count);
              for (let i = 0; i < geo.attributes.position.count; i++) {
                let headWeight = 0;
                for (let c = 0; c < 4; c++) {
                  if (skinIndex.getComponent(i, c) === 5) {
                    headWeight += skinWeight.getComponent(i, c);
                  }
                }
                if (headWeight > 0.3) {
                  isHeadVert[i] = 1;
                }
              }

              const newIndices: number[] = [];
              for (let t = 0; t < index.count; t += 3) {
                const a = index.getX(t);
                const b = index.getX(t + 1);
                const c = index.getX(t + 2);
                if (!isHeadVert[a] && !isHeadVert[b] && !isHeadVert[c]) {
                  newIndices.push(a, b, c);
                }
              }
              geo.setIndex(newIndices);
              geo.userData.headExcised = true;
            }
          }

          // Apply authentic patterned military combat uniform material
          if (isXRay) {
            mesh.material = new THREE.MeshStandardMaterial({
              color: new THREE.Color('#031526'),
              emissive: new THREE.Color('#00558f'),
              emissiveIntensity: 0.6,
              roughness: 0.2,
              metalness: 0.8,
              transparent: true,
              opacity: 0.18,
              depthWrite: false,
            });
          } else {
            mesh.material = new THREE.MeshStandardMaterial({
              map: camoMap,
              normalMap: normalMap,
              normalScale: new THREE.Vector2(0.85, 0.85),
              roughness: 0.82,
              metalness: 0.08,
            });
          }
        }
      }
    });
  }, [scene, isXRay, camoMap, normalMap]);

  // Position soldier so boots are on floor at Y = -1.68, rotated 180 deg to face camera (+Z)
  return (
    <group ref={groupRef} name="SOLDIER_HUMAN_BODY" position={[0, -1.68, -0.04]} rotation={[0, Math.PI, 0]}>
      <primitive object={scene} />

      {/* Holographic Wireframe Grid Overlay in X-Ray Vision Mode */}
      {isXRay && (
        <group name="XRayHologramOverlay">
          {[-0.6, -0.2, 0.2, 0.6, 1.0, 1.4].map((yOff, idx) => (
            <mesh key={idx} position={[0, yOff, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.32, 0.33, 32]} />
              <meshBasicMaterial color="#00e5ff" transparent opacity={0.25} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};

useGLTF.preload('/Soldier.glb');
useTexture.preload('/soldier_camo_uniform.jpg');
useTexture.preload('/soldier_normal.jpg');
