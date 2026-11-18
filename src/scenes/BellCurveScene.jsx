import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function BellCurveScene({ progress = 0, visible = true }) {
  const meshRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const random01 = (seed) => {
    const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return value - Math.floor(value);
  };

  const startingPositions = useMemo(() => Array.from({ length: 1000 }, (_, index) => {
    const seed = index + 1;
    return new THREE.Vector3(
      (random01(seed) - 0.5) * 7,
      (random01(seed + 1000) - 0.5) * 5,
      (random01(seed + 2000) - 0.5) * 4,
    );
  }), []);

  const targetPositions = useMemo(() => Array.from({ length: 1000 }, (_, index) => {
    const seed = index + 1;
    const u = Math.max(0.0001, random01(seed * 2));
    const v = random01(seed * 2 + 1);
    const x = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    const density = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-(x * x) / 2);
    return new THREE.Vector3(x * 3, density * 7.5, 0);
  }), []);

  useEffect(() => {
    if (!meshRef.current) return;
    startingPositions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    });

    const tail = new THREE.Color("#FF6B6B");
    const center = new THREE.Color("#4ECDC4");
    targetPositions.forEach((position, index) => {
      const normalizedX = THREE.MathUtils.clamp((position.x / 3 + 1) / 2, 0, 1);
      meshRef.current.setColorAt(index, tail.clone().lerp(center, 1 - Math.abs(normalizedX - 0.5) * 2));
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [dummy, startingPositions, targetPositions]);

  useFrame(() => {
    if (!visible || !meshRef.current) return;
    const clampedProgress = THREE.MathUtils.clamp(progress, 0, 1);
    startingPositions.forEach((start, index) => {
      const target = targetPositions[index];
      dummy.position.set(
        clampedProgress === 1 ? target.x : THREE.MathUtils.lerp(start.x, target.x, clampedProgress),
        clampedProgress === 1 ? target.y : THREE.MathUtils.lerp(start.y, target.y, clampedProgress),
        clampedProgress === 1 ? target.z : THREE.MathUtils.lerp(start.z, target.z, clampedProgress),
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, 1000]} visible={visible}>
      <sphereGeometry args={[0.03, 6, 4]} />
      <meshStandardMaterial vertexColors />
    </instancedMesh>
  );
}
