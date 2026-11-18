import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function random01(seed) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export default function ScatterScene({ progress = 0, visible = true }) {
  const meshRef = useRef(null);
  const lineRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions3D = useMemo(() => Array.from({ length: 200 }, (_, index) => {
    const seed = index + 1;
    return new THREE.Vector3(
      (random01(seed) - 0.5) * 4,
      (random01(seed + 1000) - 0.5) * 3,
      (random01(seed + 2000) - 0.5) * 4,
    );
  }), []);

  const positions2D = useMemo(() => positions3D.map((position) => {
    const fittedZ = position.x * 0.55;
    return new THREE.Vector3(position.x, 0, fittedZ);
  }), [positions3D]);

  const linePoints = useMemo(() => {
    const points = [];
    for (let index = 0; index < 64; index += 1) {
      const x = -2 + (index / 63) * 4;
      points.push(new THREE.Vector3(x, 0, x * 0.55));
    }
    return points;
  }, []);

  useFrame(() => {
    if (!visible || !meshRef.current) return;
    positions3D.forEach((position, index) => {
      const target = positions2D[index];
      dummy.position.set(
        THREE.MathUtils.lerp(position.x, target.x, progress),
        THREE.MathUtils.lerp(position.y, target.y, progress),
        THREE.MathUtils.lerp(position.z, target.z, progress),
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;

    if (lineRef.current) {
      lineRef.current.material.opacity = progress;
      lineRef.current.scale.setScalar(THREE.MathUtils.lerp(0.01, 1, progress));
      lineRef.current.visible = progress > 0.02;
    }
  });

  return (
    <group visible={visible}>
      <instancedMesh ref={meshRef} args={[null, null, 200]}>
        <sphereGeometry args={[0.05, 8, 6]} />
        <meshStandardMaterial color="#4b4b8f" />
      </instancedMesh>
      <line ref={lineRef}>
        <bufferGeometry setFromPoints={linePoints} />
        <lineBasicMaterial color="#00E5FF" transparent opacity={0} />
      </line>
      <mesh visible={progress > 0.02}>
        <boxGeometry args={[4, 3, 4]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.06} />
      </mesh>
    </group>
  );
}
