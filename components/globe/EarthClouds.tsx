import * as THREE from "three";

/**
 * Creates the dynamic rotating cloud sphere layer.
 */
export function createEarthCloudsMesh(
  radius: number,
  cloudTexture: THREE.Texture
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius * 1.015, 64, 64);

  const material = new THREE.MeshStandardMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 0.65,
    blending: THREE.NormalBlending,
    depthWrite: false,
    roughness: 1,
    metalness: 0,
  });

  return new THREE.Mesh(geometry, material);
}
