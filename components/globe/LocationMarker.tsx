import * as THREE from "three";
import { latLonToVector3 } from "@/lib/coordinates";
import { LocationData } from "@/types/location";

export interface MarkerGroup extends THREE.Group {
  updateAnimation?: (time: number) => void;
  locationData?: LocationData;
}

/**
 * Creates an interactive 3D location marker group anchored
 * to the Earth's surface at the given coordinates.
 */
export function createLocationMarker(
  location: LocationData,
  globeRadius: number
): MarkerGroup {
  const markerGroup = new THREE.Group() as MarkerGroup;
  markerGroup.locationData = location;

  const position = latLonToVector3(
    location.latitude,
    location.longitude,
    globeRadius
  );

  // Position at surface
  markerGroup.position.copy(position);

  // Orient marker so its +Y axis points outward along the sphere normal
  const normal = position.clone().normalize();
  markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

  // 1. Inner core glowing bead
  const beadGeo = new THREE.SphereGeometry(globeRadius * 0.016, 16, 16);
  const beadMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#43D9F5"),
  });
  const beadMesh = new THREE.Mesh(beadGeo, beadMat);
  beadMesh.position.set(0, globeRadius * 0.008, 0);
  markerGroup.add(beadMesh);

  // 2. Pulsing ring
  const ringGeo = new THREE.RingGeometry(
    globeRadius * 0.02,
    globeRadius * 0.038,
    32
  );
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#22D3EE"),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.position.set(0, globeRadius * 0.005, 0);
  markerGroup.add(ringMesh);

  // 3. Vertical laser light beam
  const beamHeight = globeRadius * 0.22;
  const beamGeo = new THREE.CylinderGeometry(
    globeRadius * 0.002,
    globeRadius * 0.008,
    beamHeight,
    8
  );
  beamGeo.translate(0, beamHeight / 2, 0);
  const beamMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#43D9F5"),
    transparent: true,
    opacity: 0.6,
  });
  const beamMesh = new THREE.Mesh(beamGeo, beamMat);
  markerGroup.add(beamMesh);

  // 4. Billboard Sprite Label
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = 256;
  labelCanvas.height = 64;
  const ctx = labelCanvas.getContext("2d");
  if (ctx) {
    // Glass pill background
    ctx.fillStyle = "rgba(5, 11, 20, 0.9)";
    ctx.strokeStyle = "rgba(67, 217, 245, 0.85)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(8, 6, 240, 52, 26);
    ctx.fill();
    ctx.stroke();

    // Text label
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(location.name, 128, 32);
  }

  const labelTexture = new THREE.CanvasTexture(labelCanvas);
  labelTexture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: labelTexture,
    transparent: true,
    depthTest: false,
  });
  const labelSprite = new THREE.Sprite(spriteMat);
  const spriteScale = globeRadius * 0.38;
  labelSprite.scale.set(spriteScale, spriteScale * 0.25, 1);
  labelSprite.position.set(0, beamHeight + globeRadius * 0.04, 0);
  markerGroup.add(labelSprite);

  // Animation hook: animate pulse and beam
  markerGroup.updateAnimation = (time: number) => {
    const pulse = 1 + 0.35 * Math.sin(time * 4);
    ringMesh.scale.set(pulse, 1, pulse);
    ringMat.opacity = Math.max(0.2, 0.9 - 0.4 * (pulse - 1));
  };

  return markerGroup;
}

/**
 * Creates a lightweight, interactive city pin for the global map.
 */
export function createCityPin(
  location: LocationData,
  globeRadius: number
): MarkerGroup {
  const pinGroup = new THREE.Group() as MarkerGroup;
  pinGroup.locationData = location;

  const position = latLonToVector3(
    location.latitude,
    location.longitude,
    globeRadius
  );
  pinGroup.position.copy(position);

  // Orient outward
  const normal = position.clone().normalize();
  pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

  // Pin bead
  const pinGeo = new THREE.SphereGeometry(globeRadius * 0.009, 12, 12);
  const pinMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#67E8F9"),
  });
  const pinMesh = new THREE.Mesh(pinGeo, pinMat);
  pinMesh.position.set(0, globeRadius * 0.005, 0);
  pinMesh.userData = { location };
  pinGroup.add(pinMesh);

  // Subtle halo ring
  const haloGeo = new THREE.RingGeometry(
    globeRadius * 0.012,
    globeRadius * 0.022,
    16
  );
  haloGeo.rotateX(-Math.PI / 2);
  const haloMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#22D3EE"),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.45,
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.position.set(0, globeRadius * 0.003, 0);
  pinGroup.add(haloMesh);

  // Compact city name label sprite
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 40;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "rgba(5, 11, 20, 0.75)";
    ctx.strokeStyle = "rgba(103, 232, 249, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(4, 4, 152, 32, 16);
    ctx.fill();
    ctx.stroke();

    ctx.font = "bold 15px system-ui, sans-serif";
    ctx.fillStyle = "#E2E8F0";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(location.name, 80, 20);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    })
  );
  const scale = globeRadius * 0.22;
  sprite.scale.set(scale, scale * 0.25, 1);
  sprite.position.set(0, globeRadius * 0.045, 0);
  sprite.userData = { location };
  pinGroup.add(sprite);

  return pinGroup;
}
