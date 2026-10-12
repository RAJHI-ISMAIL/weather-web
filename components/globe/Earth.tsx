import * as THREE from "three";

export interface EarthTextures {
  dayMap: THREE.Texture;
  normalMap: THREE.Texture;
  specularMap: THREE.Texture;
  lightsMap: THREE.Texture;
}

/**
 * Creates the high-fidelity Earth sphere with realistic topography,
 * specular oceans, and night lights.
 */
export function createEarthMesh(
  radius: number,
  textures: EarthTextures
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius, 64, 64);

  // Set anisotropic filtering for sharpness
  [textures.dayMap, textures.normalMap, textures.specularMap, textures.lightsMap].forEach(
    (tex) => {
      tex.anisotropy = 8;
    }
  );

  const material = new THREE.MeshStandardMaterial({
    map: textures.dayMap,
    normalMap: textures.normalMap,
    normalScale: new THREE.Vector2(0.85, 0.85),
    roughnessMap: textures.specularMap,
    roughness: 0.7,
    metalness: 0.1,
    emissiveMap: textures.lightsMap,
    emissive: new THREE.Color("#FFE4A0"),
    emissiveIntensity: 0.85,
  });

  const earth = new THREE.Mesh(geometry, material);
  earth.castShadow = true;
  earth.receiveShadow = true;

  return earth;
}
