import * as THREE from "three";

/**
 * Creates a photorealistic atmospheric glow mesh around the Earth
 * using a custom Fresnel shader.
 */
export function createAtmosphereMesh(radius: number): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius * 1.15, 64, 64);

  const vertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 glowColor;
    void main() {
      vec3 viewDir = normalize(-vPosition);
      // Fresnel effect: rim lighting based on dot product between view and normal
      float intensity = pow(0.72 - dot(vNormal, viewDir), 2.8);
      gl_FragColor = vec4(glowColor, intensity * 0.9);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      glowColor: { value: new THREE.Color("#43D9F5") },
    },
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });

  return new THREE.Mesh(geometry, material);
}
