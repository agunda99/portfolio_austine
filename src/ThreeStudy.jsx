import { useEffect, useRef } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 1500;

function seeded(index, salt = 0) {
  const value = Math.sin((index + 1) * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function addLine(lines, x1, y1, x2, y2) {
  lines.push([x1, y1, x2, y2]);
}

function addRect(lines, x1, y1, x2, y2) {
  addLine(lines, x1, y1, x2, y1);
  addLine(lines, x2, y1, x2, y2);
  addLine(lines, x2, y2, x1, y2);
  addLine(lines, x1, y2, x1, y1);
}

function sampleLines(lines, index, count) {
  const lengths = lines.map(([x1, y1, x2, y2]) => Math.hypot(x2 - x1, y2 - y1));
  const total = lengths.reduce((sum, length) => sum + length, 0);
  let distance = (index / count) * total;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const [x1, y1, x2, y2] = lines[lineIndex];
    const length = lengths[lineIndex];
    if (distance <= length || lineIndex === lines.length - 1) {
      const progress = length ? distance / length : 0;
      return [
        x1 + (x2 - x1) * progress,
        y1 + (y2 - y1) * progress,
        0,
      ];
    }
    distance -= length;
  }
  return [0, 0, 0];
}

function makeDashboardTargets() {
  const lines = [];
  addRect(lines, -2.5, -1.45, 2.5, 1.45);
  addLine(lines, -2.5, 0.98, 2.5, 0.98);
  addLine(lines, -2.18, 1.18, -1.16, 1.18);
  addLine(lines, -0.96, 1.18, -0.38, 1.18);
  addRect(lines, -2.16, 0.12, -0.18, 0.78);
  addRect(lines, 0.08, 0.12, 2.16, 0.78);
  addRect(lines, -2.16, -1.18, -0.72, -0.08);
  addRect(lines, -0.46, -1.18, 0.98, -0.08);
  addRect(lines, 1.24, -1.18, 2.16, -0.08);

  for (let i = 0; i < 9; i += 1) {
    const x = -2.02 + i * 0.2;
    const y = 0.22 + Math.sin(i * 0.65) * 0.19 + i * 0.025;
    addLine(lines, x, 0.2, x, y);
  }
  for (let i = 0; i < 15; i += 1) {
    const x = 0.2 + i * 0.13;
    const y = 0.22 + Math.sin(i * 0.75) * 0.15 + i * 0.018;
    addLine(lines, x, y, x + 0.08, y + 0.045);
  }
  for (let i = 0; i < 4; i += 1) {
    const x = -2.02 + i * 0.34;
    const height = 0.35 + seeded(i, 2) * 0.42;
    addLine(lines, x, -1.05, x, -1.05 + height);
  }
  for (let i = 0; i < 4; i += 1) {
    const x = -0.3 + i * 0.28;
    addLine(lines, x, -1.04, x + 0.17, -0.95 - seeded(i, 4) * 0.24);
  }

  return Float32Array.from(
    Array.from({ length: PARTICLE_COUNT }, (_, index) => sampleLines(lines, index, PARTICLE_COUNT)).flat(),
  );
}

function makeWordTargets() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 300;
  const context = canvas.getContext("2d");
  if (!context) return new Float32Array(PARTICLE_COUNT * 3);

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#fff";
  context.font = "700 196px Georgia, serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText("AUSTINE", canvas.width / 2, canvas.height / 2);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const points = [];
  for (let y = 12; y < canvas.height; y += 4) {
    for (let x = 12; x < canvas.width; x += 4) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 128) points.push([x, y]);
    }
  }

  return Float32Array.from(
    Array.from({ length: PARTICLE_COUNT }, (_, index) => {
      const [x, y] = points[index % points.length] || [canvas.width / 2, canvas.height / 2];
      return [
        ((x / canvas.width) - 0.5) * 4.5,
        (0.5 - y / canvas.height) * 1.3,
        (seeded(index, 9) - 0.5) * 0.12,
      ];
    }).flat(),
  );
}

function makeTargets() {
  const origin = new Float32Array(PARTICLE_COUNT * 3);
  const scatter = new Float32Array(PARTICLE_COUNT * 3);
  const distribution = new Float32Array(PARTICLE_COUNT * 3);
  const dashboard = makeDashboardTargets();
  const words = makeWordTargets();

  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const index = i * 3;
    const angle = i * 2.399963;
    const tube = 0.48 + seeded(i, 1) * 0.62;
    const ring = 1.05 + Math.cos(angle * 3) * 0.18;
    origin[index] = Math.cos(angle) * ring;
    origin[index + 1] = Math.sin(angle) * ring;
    origin[index + 2] = Math.sin(angle * 2) * tube * 0.72;

    const point = i % 200;
    const x = -2.12 + (point / 199) * 4.24;
    scatter[index] = x;
    scatter[index + 1] = x * 0.36 + (seeded(i, 3) - 0.5) * 1.3;
    scatter[index + 2] = (seeded(i, 5) - 0.5) * 0.7;

    const curveX = -2.28 + (i / (PARTICLE_COUNT - 1)) * 4.56;
    const density = Math.exp(-(curveX * curveX) / (2 * 0.82 * 0.82));
    distribution[index] = curveX;
    distribution[index + 1] = density * (0.38 + seeded(i, 7) * 1.2) - 0.58;
    distribution[index + 2] = (seeded(i, 8) - 0.5) * 0.45;
  }

  return [origin, scatter, distribution, dashboard, words];
}

function makeGrid() {
  const vertices = [];
  for (let x = -8; x <= 8; x += 0.8) {
    vertices.push(x, -5, -1.8, x, 5, -1.8);
  }
  for (let y = -5; y <= 5; y += 0.8) {
    vertices.push(-8, y, -1.8, 8, y, -1.8);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return geometry;
}

export default function ThreeStudy() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (error) {
      console.error("Unable to initialize the portfolio 3D scene.", error);
      host.dataset.sceneError = "true";
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.4));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    const targets = makeTargets();
    const initialPositions = targets[0].slice();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const geometry = new THREE.BufferGeometry();
    const positionAttribute = new THREE.BufferAttribute(positions, 3);
    positionAttribute.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute("position", positionAttribute);
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    positions.set(initialPositions);
    geometry.computeBoundingSphere();

    const material = new THREE.PointsMaterial({
      size: 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.86,
      blending: THREE.NormalBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x7d8f87,
      transparent: true,
      opacity: 0.12,
    });
    const grid = new THREE.LineSegments(makeGrid(), gridMaterial);
    scene.add(grid);

    const knotMaterial = new THREE.MeshBasicMaterial({
      color: 0x397d70,
      transparent: true,
      opacity: 0.095,
      wireframe: true,
    });
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.25, 0.012, 220, 4, 2, 3),
      knotMaterial,
    );
    knot.position.set(2.15, 0.05, -0.35);
    scene.add(knot);

    const shell = host.closest(".portfolio-shell");
    const pointer = { x: 0, y: 0 };
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let targetProgress = 0;
    let currentProgress = 0;
    let initialized = false;
    let frame = 0;
    let visible = false;

    function refreshColors() {
      const style = getComputedStyle(host);
      const accent = new THREE.Color(style.getPropertyValue("--accent").trim() || "#d65b38");
      const secondary = new THREE.Color(style.getPropertyValue("--green").trim() || "#2e7467");
      const foreground = new THREE.Color(style.getPropertyValue("--ink").trim() || "#20231f");
      const colorAttribute = geometry.getAttribute("color");
      const color = new THREE.Color();

      for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const mix = (Math.sin(index * 12.9898) + 1) * 0.5;
        color.copy(accent).lerp(secondary, mix * 0.72).lerp(foreground, 0.13);
        colorAttribute.setXYZ(index, color.r, color.g, color.b);
      }
      colorAttribute.needsUpdate = true;
    }

    function updateStage() {
      const signals = [...document.querySelectorAll("[data-scene-stage]")]
        .map((element) => ({
          stage: Number(element.dataset.sceneStage),
          center: element.getBoundingClientRect().top + window.scrollY + element.getBoundingClientRect().height / 2,
        }))
        .filter((signal) => Number.isFinite(signal.stage))
        .sort((a, b) => a.center - b.center);

      if (!signals.length) return;
      const scrollCenter = window.scrollY + window.innerHeight * 0.52;
      let progress = signals[0].stage;
      if (scrollCenter >= signals[signals.length - 1].center) {
        progress = signals[signals.length - 1].stage;
      } else {
        for (let index = 0; index < signals.length - 1; index += 1) {
          const current = signals[index];
          const next = signals[index + 1];
          if (scrollCenter <= next.center) {
            const span = Math.max(1, next.center - current.center);
            const mix = THREE.MathUtils.clamp((scrollCenter - current.center) / span, 0, 1);
            progress = current.stage + (next.stage - current.stage) * mix;
            break;
          }
        }
      }
      targetProgress = THREE.MathUtils.clamp(progress, 0, targets.length - 1);
      if (!initialized) {
        currentProgress = targetProgress;
        initialized = true;
      }
      if (visible && motionQuery.matches) renderFrame(0);
    }

    function renderFrame(time) {
      const easing = motionQuery.matches ? 1 : 0.035;
      currentProgress += (targetProgress - currentProgress) * easing;
      const fromIndex = Math.floor(currentProgress);
      const toIndex = Math.min(fromIndex + 1, targets.length - 1);
      const mix = currentProgress - fromIndex;
      const smoothMix = mix * mix * (3 - 2 * mix);
      const from = targets[fromIndex];
      const to = targets[toIndex];

      for (let index = 0; index < positions.length; index += 3) {
        const drift = motionQuery.matches ? 0 : Math.sin(time * 0.7 + index * 0.015) * 0.012;
        positions[index] += (from[index] + (to[index] - from[index]) * smoothMix + drift - positions[index]) * 0.095;
        positions[index + 1] += (from[index + 1] + (to[index + 1] - from[index + 1]) * smoothMix + drift - positions[index + 1]) * 0.095;
        positions[index + 2] += (from[index + 2] + (to[index + 2] - from[index + 2]) * smoothMix - positions[index + 2]) * 0.095;
      }

      positionAttribute.needsUpdate = true;
      particles.rotation.y += motionQuery.matches ? 0 : 0.0007;
      particles.rotation.x += motionQuery.matches ? 0 : 0.0003;
      knot.rotation.x += motionQuery.matches ? 0 : 0.0015;
      knot.rotation.y += motionQuery.matches ? 0 : 0.001;
      knot.material.opacity = Math.max(0.025, 0.095 - currentProgress * 0.012);
      camera.position.x += (pointer.x * 0.22 - camera.position.x) * 0.025;
      camera.position.y += (pointer.y * 0.16 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    function animate(time) {
      if (motionQuery.matches) {
        renderFrame(time / 1000);
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(animate);
      renderFrame(time / 1000);
    }

    function resize() {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = width < 700 ? 13 : 7;
      material.size = width < 700 ? 0.04 : 0.026;
      camera.updateProjectionMatrix();
      particles.position.x = width < 700 ? 0.25 : 1.45;
      knot.position.x = width < 700 ? 0.55 : 2.15;
      renderer.render(scene, camera);
    }

    function movePointer(event) {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (0.5 - event.clientY / window.innerHeight) * 2;
    }

    function handleVisibility() {
      if (document.hidden && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
        return;
      }
      updateStage();
      if (visible && !frame) animate(performance.now());
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !document.hidden && !frame) animate(performance.now());
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const resizeObserver = new ResizeObserver(resize);
    const paletteObserver = new MutationObserver(refreshColors);
    observer.observe(host);
    resizeObserver.observe(host);
    if (shell) paletteObserver.observe(shell, { attributes: true, attributeFilter: ["data-theme", "data-palette"] });
    window.addEventListener("scroll", updateStage, { passive: true });
    window.addEventListener("pointermove", movePointer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    refreshColors();
    updateStage();
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resizeObserver.disconnect();
      paletteObserver.disconnect();
      window.removeEventListener("scroll", updateStage);
      window.removeEventListener("pointermove", movePointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach((entry) => entry.dispose());
          else object.material.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div className="three-study" ref={hostRef} aria-hidden="true" />;
}
