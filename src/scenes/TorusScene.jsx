import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export default function TorusScene({ visible = true, isPaused = false }) {
  const groupRef = useRef(null);
  const spheresRef = useRef(null);
  const positions = useMemo(() => {
    const points = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const majorRadius = 1.5;
    const minorRadius = 0.4;

    for (let index = 0; index < 50; index += 1) {
      const theta = goldenAngle * index;
      const vertical = 1 - (index / 49) * 2;
      const phi = Math.asin(vertical);
      const ringRadius = majorRadius + minorRadius * Math.cos(phi);
      points.push(new THREE.Vector3(
        Math.cos(theta) * ringRadius,
        minorRadius * Math.sin(phi),
        Math.sin(theta) * ringRadius,
      ));
    }
    return points;
  }, []);

  useFrame((_, delta) => {
    if (!visible || isPaused) return;
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.18;
    if (spheresRef.current) spheresRef.current.rotation.y += delta * 0.28;
  });

  useEffect(() => {
    if (!spheresRef.current) return;
    const dummy = new THREE.Object3D();
    positions.forEach((position, index) => {
      dummy.position.copy(position);
      dummy.updateMatrix();
      spheresRef.current.setMatrixAt(index, dummy.matrix);
    });
    spheresRef.current.instanceMatrix.needsUpdate = true;
  }, [positions]);

  return (
    <group ref={groupRef} visible={visible}>
      <mesh>
        <torusGeometry args={[1.5, 0.4, 32, 64]} />
        <MeshTransmissionMaterial thickness={0.5} roughness={0.1} transmission={0.9} color="#a6a1d6" />
      </mesh>
      <instancedMesh ref={spheresRef} args={[null, null, 50]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshStandardMaterial color="#a6a1d6" />
      </instancedMesh>
    </group>
  );
}
