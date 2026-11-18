import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 2200;
const BAR_HEIGHTS = [1.1, 1.8, 1.35, 2.45, 1.9, 2.8, 2.2, 3.1, 2.65];

function random01(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function createStoryPositions() {
  // Keep the same particles across every beat so scroll reveals their transformation, not a replacement.
  const chaos = new Float32Array(PARTICLE_COUNT * 3);
  const chaosCurrent = new Float32Array(PARTICLE_COUNT * 3);
  const velocity = new Float32Array(PARTICLE_COUNT * 3);
  const grid = new Float32Array(PARTICLE_COUNT * 3);
  const analysis = new Float32Array(PARTICLE_COUNT * 3);
  const charts = new Float32Array(PARTICLE_COUNT * 3);
  const interfaceView = new Float32Array(PARTICLE_COUNT * 3);
  const columns = 50;
  const interfaceHalfWidth = 4;
  const interfaceHalfHeight = 2.45;

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    const offset = index * 3;
    const seed = index + 1;
    const x = random01(seed) * 10 - 5;
    const y = random01(seed + 5000) * 6 - 3;
    const z = random01(seed + 10000) * 5 - 2.5;

    chaos.set([x, y, z], offset);
    chaosCurrent.set([x, y, z], offset);
    velocity.set([
      (random01(seed + 15000) - 0.5) * 0.95,
      (random01(seed + 20000) - 0.5) * 0.95,
      (random01(seed + 25000) - 0.5) * 0.75,
    ], offset);

    const column = index % columns;
    const row = Math.floor(index / columns);
    grid.set([(column - 24.5) * 0.13, (row - 21.5) * 0.125, (random01(seed + 30000) - 0.5) * 0.04], offset);

    const analysisX = (random01(seed + 35000) * 2 - 1) * 3.35;
    const analysisY = analysisX * 0.34 + Math.sin(analysisX * 1.4) * 0.18 + (random01(seed + 40000) - 0.5) * 1.2;
    analysis.set([analysisX, analysisY, (random01(seed + 45000) - 0.5) * 0.45], offset);

    if (index < PARTICLE_COUNT * 0.52) {
      const barIndex = Math.floor(index / (PARTICLE_COUNT * 0.52 / BAR_HEIGHTS.length));
      const withinBar = (index % Math.ceil(PARTICLE_COUNT * 0.52 / BAR_HEIGHTS.length)) / Math.ceil(PARTICLE_COUNT * 0.52 / BAR_HEIGHTS.length);
      charts.set([
        -3.55 + barIndex * 0.42,
        -1.65 + withinBar * BAR_HEIGHTS[barIndex],
        (random01(seed + 50000) - 0.5) * 0.08,
      ], offset);
    } else if (index < PARTICLE_COUNT * 0.88) {
      const t = (index - PARTICLE_COUNT * 0.52) / (PARTICLE_COUNT * 0.36);
      charts.set([
        -3.4 + t * 6.8,
        -0.75 + t * 1.1 + Math.sin(t * Math.PI * 4) * 0.55,
        0.08,
      ], offset);
    } else {
      const t = (index - PARTICLE_COUNT * 0.88) / (PARTICLE_COUNT * 0.12);
      const angle = t * Math.PI * 2;
      charts.set([2.6 + Math.cos(angle) * 0.43, 0.85 + Math.sin(angle) * 0.43, 0.12], offset);
    }

    const viewProgress = index / PARTICLE_COUNT;
    if (viewProgress < 0.16) {
      const t = viewProgress / 0.16;
      const edge = t * 4;
      const edgeProgress = edge % 1;
      const side = Math.floor(edge);
      const frameX = side === 0 ? -interfaceHalfWidth + edgeProgress * interfaceHalfWidth * 2
        : side === 2 ? interfaceHalfWidth - edgeProgress * interfaceHalfWidth * 2
          : side === 1 ? interfaceHalfWidth : -interfaceHalfWidth;
      const frameY = side === 1 ? interfaceHalfHeight - edgeProgress * interfaceHalfHeight * 2
        : side === 3 ? -interfaceHalfHeight + edgeProgress * interfaceHalfHeight * 2
          : side === 0 ? interfaceHalfHeight : -interfaceHalfHeight;
      interfaceView.set([frameX, frameY, 0.08], offset);
    } else if (viewProgress < 0.23) {
      const t = (viewProgress - 0.16) / 0.07;
      interfaceView.set(
        t < 0.76
          ? [-3.35 + (t / 0.76) * 6.7, 1.68, 0.08]
          : [-3.35, 1.5 - ((t - 0.76) / 0.24) * 3.1, 0.08],
        offset,
      );
    } else if (viewProgress < 0.47) {
      const cardProgress = (viewProgress - 0.23) / 0.24;
      const cardIndex = Math.min(2, Math.floor(cardProgress * 3));
      const edgeProgress = (cardProgress * 3) % 1;
      const edge = edgeProgress * 4;
      const side = Math.floor(edge);
      const t = edge % 1;
      const centerX = -2.1 + cardIndex * 2.1;
      const x = side === 0 ? centerX - 0.78 + t * 1.56
        : side === 2 ? centerX + 0.78 - t * 1.56
          : side === 1 ? centerX + 0.78 : centerX - 0.78;
      const y = side === 1 ? 1.33 - t * 0.56
        : side === 3 ? 0.77 + t * 0.56
          : side === 0 ? 1.33 : 0.77;
      interfaceView.set([x, y, 0.1], offset);
    } else if (viewProgress < 0.78) {
      const t = (viewProgress - 0.47) / 0.31;
      interfaceView.set([-2.8 + t * 5.6, -0.2 + t * 0.65 + Math.sin(t * Math.PI * 3) * 0.14, 0.12], offset);
    } else {
      const t = (viewProgress - 0.78) / 0.22;
      const barIndex = Math.min(7, Math.floor(t * 8));
      const barT = (t * 8) % 1;
      const barHeight = [0.55, 0.92, 0.72, 1.15, 0.88, 1.28, 1.04, 1.42][barIndex];
      interfaceView.set([-2.65 + barIndex * 0.76, -1.6 + barT * barHeight, 0.11], offset);
    }
  }

  return { chaos, chaosCurrent, velocity, grid, analysis, charts, interfaceView };
}

const CHAOS_COLOR = new THREE.Color("#b5a8ff");
const SIGNAL_COLOR = new THREE.Color("#2f8d60");

export default function ScrollScene({ scrollState, isPaused = false }) {
  const particlesRef = useRef(null);
  const cylinderRef = useRef(null);
  const regressionRef = useRef(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const positions = useMemo(createStoryPositions, []);
  const { invalidate } = useThree();

  useEffect(() => {
    const invalidateOnScroll = () => invalidate();
    window.addEventListener("scroll", invalidateOnScroll, { passive: true });
    return () => window.removeEventListener("scroll", invalidateOnScroll);
  }, [invalidate]);

  useFrame((state, delta) => {
    const progress = THREE.MathUtils.clamp(scrollState.current.progress, 0, 1);
    const stage = Math.min(Math.floor(progress * 4), 3);
    const transition = THREE.MathUtils.smoothstep(progress * 4 - stage, 0, 1);
    const targets = [positions.chaos, positions.grid, positions.analysis, positions.charts, positions.interfaceView];
    const from = targets[stage];
    const to = targets[Math.min(stage + 1, 4)];
    const noiseAmount = stage === 0 && !isPaused ? 1 - transition : 0;
    const time = state.clock.elapsedTime;
    const mesh = particlesRef.current;

    if (mesh) {
      if (stage === 0 && !isPaused) {
        const bounds = [5, 3, 2.5];
        for (let index = 0; index < PARTICLE_COUNT; index += 1) {
          const offset = index * 3;
          for (let axis = 0; axis < 3; axis += 1) {
            const point = offset + axis;
            const limit = bounds[axis];
            let next = positions.chaosCurrent[point] + positions.velocity[point] * delta * 2 * noiseAmount;
            if (next > limit || next < -limit) {
              next = THREE.MathUtils.clamp(next, -limit, limit);
              positions.velocity[point] *= -1;
            }
            positions.chaosCurrent[point] = next;
          }
        }
      }

      for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const offset = index * 3;
        const source = stage === 0 ? positions.chaosCurrent : from;
        const x = source[offset];
        const y = source[offset + 1];
        const z = source[offset + 2];
        const nextX = THREE.MathUtils.lerp(x, to[offset], transition);
        const nextY = THREE.MathUtils.lerp(y, to[offset + 1], transition);
        const nextZ = THREE.MathUtils.lerp(z, to[offset + 2], transition);
        const radius = Math.max(0.01, Math.hypot(nextX, nextY, nextZ));
        const burst = stage === 2 ? Math.sin(transition * Math.PI) * 1.15 : 0;

        dummy.position.set(
          nextX + (nextX / radius) * burst,
          nextY + (nextY / radius) * burst,
          nextZ + (nextZ / radius) * burst,
        );
        const pulse = 0.8 + Math.sin(time * 2 + index) * 0.12 * noiseAmount;
        dummy.scale.setScalar(pulse);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      }

      mesh.instanceMatrix.needsUpdate = true;
      mesh.material.color.copy(CHAOS_COLOR).lerp(SIGNAL_COLOR, THREE.MathUtils.smoothstep(progress, 0.35, 0.85));
    }

    if (cylinderRef.current) {
      const reveal = THREE.MathUtils.smoothstep(progress, 0.19, 0.27)
        * (1 - THREE.MathUtils.smoothstep(progress, 0.39, 0.47));
      cylinderRef.current.visible = reveal > 0.01;
      cylinderRef.current.scale.setScalar(Math.max(0.01, reveal));
      cylinderRef.current.rotation.y += delta * (isPaused ? 0 : 0.16);
    }

    if (regressionRef.current) {
      const reveal = THREE.MathUtils.smoothstep(progress, 0.43, 0.5)
        * (1 - THREE.MathUtils.smoothstep(progress, 0.64, 0.72));
      regressionRef.current.material.opacity = reveal * 0.9;
    }
  });

  const regressionLine = useMemo(() => {
    const points = [];
    for (let index = 0; index < 80; index += 1) {
      const x = -3.4 + (index / 79) * 6.8;
      points.push(new THREE.Vector3(x, x * 0.34, 0));
    }
    return points;
  }, []);

  return (
    <>
      <ambientLight intensity={1.2} />
      <pointLight position={[0, 2, 4]} color="#9fe3bb" intensity={20} distance={12} />
      <instancedMesh ref={particlesRef} args={[null, null, PARTICLE_COUNT]}>
        <sphereGeometry args={[0.022, 6, 5]} />
        <meshBasicMaterial color="#b5a8ff" />
      </instancedMesh>
      <mesh ref={cylinderRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 1.45, 36, 1, true]} />
        <meshBasicMaterial color="#9fe3bb" wireframe transparent opacity={0.28} />
      </mesh>
      <line ref={regressionRef}>
        <bufferGeometry setFromPoints={regressionLine} />
        <lineBasicMaterial color="#d2ff88" transparent opacity={0} />
      </line>
    </>
  );
}
