import * as THREE from 'three';

// Tactical military color constants
export const TACTICAL_COLORS = {
  tacticalBlack: '#262d38', // High-contrast matte tactical polymer
  tacticalCharcoal: '#353e4d',
  oliveDrab: '#333e2f',
  militaryCoyote: '#4d4334',
  gelCushion: '#0f1318',
  steelMetal: '#64748b',
  darkMetal: '#334155',
  goldContact: '#fbbf24',
  pcbGreen: '#10b981', // Authentic vibrant Raspberry Pi FR4 emerald soldermask
  copperTrace: '#d97706',
  indicatorCyan: '#00e599',
  warningAmber: '#ff9100',
  errorMagenta: '#d500f9',
  cleanGreen: '#00e599',
  soldierSkin: '#c48e71',
  soldierCamo: '#2d3826',
  helmetOlive: '#262f22',
  goggleTint: '#0d1822',
  xrayBlue: '#00e599',
  xrayGlow: '#00b377',
};

// Tactical PBR Material generator helpers
export function createTacticalPolymer(isXRay = false, opacity = 1.0): THREE.MeshStandardMaterial {
  if (isXRay) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#031a0e'),
      emissive: new THREE.Color('#00e599'),
      emissiveIntensity: 0.4,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.15,
      depthWrite: false,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(TACTICAL_COLORS.tacticalBlack),
    roughness: 0.72,
    metalness: 0.15,
    transparent: opacity < 1.0,
    opacity: opacity,
    depthWrite: true,
  });
}

export function createGelCushionMaterial(isXRay = false): THREE.MeshStandardMaterial {
  if (isXRay) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#031a0e'),
      emissive: new THREE.Color('#00e599'),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(TACTICAL_COLORS.gelCushion),
    roughness: 0.9,
    metalness: 0.05,
    transparent: false,
    opacity: 1.0,
  });
}

export function createBrushedSteel(isXRay = false): THREE.MeshStandardMaterial {
  if (isXRay) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00e599'),
      emissive: new THREE.Color('#00e599'),
      emissiveIntensity: 1.2,
      roughness: 0.2,
      metalness: 0.9,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(TACTICAL_COLORS.steelMetal),
    roughness: 0.35,
    metalness: 0.85,
  });
}

export function createDarkCoatedMetal(isXRay = false): THREE.MeshStandardMaterial {
  if (isXRay) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#031a0e'),
      emissive: new THREE.Color('#00b377'),
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(TACTICAL_COLORS.darkMetal),
    roughness: 0.45,
    metalness: 0.75,
  });
}

export function createPCBGreenMaterial(isXRay = false): THREE.MeshStandardMaterial {
  if (isXRay) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00e599'),
      emissive: new THREE.Color('#00e599'),
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.3,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(TACTICAL_COLORS.pcbGreen),
    roughness: 0.3,
    metalness: 0.25,
    transparent: false,
    opacity: 1.0,
  });
}

export function createGoldContact(isXRay = false): THREE.MeshStandardMaterial {
  if (isXRay) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#ffb700'),
      emissive: new THREE.Color('#ffb700'),
      emissiveIntensity: 2.0,
      roughness: 0.1,
      metalness: 0.95,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(TACTICAL_COLORS.goldContact),
    roughness: 0.2,
    metalness: 0.95,
  });
}

export function createCableRubber(isXRay = false): THREE.MeshStandardMaterial {
  if (isXRay) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#00e599'),
      emissive: new THREE.Color('#00e599'),
      emissiveIntensity: 1.5,
      roughness: 0.3,
      metalness: 0.5,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2e3440'), // High-visibility tactical graphite braided sheath
    roughness: 0.6,
    metalness: 0.22,
  });
}

export function createTacticalFabric(color = TACTICAL_COLORS.oliveDrab, isXRay = false): THREE.MeshStandardMaterial {
  if (isXRay) {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#031a0e'),
      emissive: new THREE.Color('#00b377'),
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
    });
  }
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.88,
    metalness: 0.02,
    transparent: false,
    opacity: 1.0,
  });
}

export function createGoggleLens(isXRay = false): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(isXRay ? '#00e599' : TACTICAL_COLORS.goggleTint),
    roughness: 0.1,
    transmission: isXRay ? 0.95 : 0.82,
    thickness: 0.5,
    ior: 1.52,
    transparent: true,
    opacity: isXRay ? 0.3 : 0.85,
    emissive: new THREE.Color(isXRay ? '#00e599' : '#000000'),
    emissiveIntensity: isXRay ? 0.5 : 0,
  });
}
