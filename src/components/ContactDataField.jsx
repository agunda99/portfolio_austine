import { useEffect, useRef } from "react";

const SYMBOLS = [
  "∑", "μ", "σ²", "β", "x̄", "R²", "p<.05", "∂", "π", "∞", "ƒ", "∫",
  "ŷ", "n=300", "∇", "A/B", "ρ", "Δ", "±", "χ²", "↗", "↘", "η", "λ",
  "ŷ=βx", "95% CI", "r=0.8",
];
const TOOLS = ["SQL", "PY", "JS", "R", "</>", "{}", "API", "⚛", "CSS", "HTML", "REACT", "GSAP", "EXCEL", "BI"];

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function makeMark(x, y, width, height, ambient = false) {
  const roll = Math.random();
  const kind = roll < 0.68 ? "glyph" : roll < 0.78 ? "tool" : roll < 0.87 ? "chart" : roll < 0.94 ? "bars" : "network";
  return {
    x,
    y,
    startX: randomBetween(-width * 0.08, width * 1.08),
    startY: randomBetween(-height * 0.08, height * 1.08),
    size: ambient ? randomBetween(8, 11) : kind === "chart" || kind === "bars" || kind === "network"
      ? randomBetween(9, 15)
      : randomBetween(8, 12),
    label: kind === "tool"
      ? TOOLS[Math.floor(Math.random() * TOOLS.length)]
      : SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    kind,
    ambient,
    phase: Math.random() * Math.PI * 2,
    drift: randomBetween(0.7, 2.2),
    speed: ambient ? randomBetween(18, 38) : 0,
    strength: ambient ? randomBetween(0.12, 0.22) : randomBetween(0.46, 0.72),
    points: Array.from({ length: 5 }, () => randomBetween(0.16, 0.88)),
    color: Math.random(),
  };
}

function drawMark(context, mark, x, y, colors, alpha) {
  const color = mark.color < 0.48 ? colors.green : mark.color < 0.78 ? colors.accent : colors.ink;
  context.globalAlpha = alpha;
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = Math.max(0.7, mark.size * 0.075);
  context.lineCap = "round";
  context.lineJoin = "round";

  if (mark.kind === "chart") {
    const half = mark.size * 0.62;
    context.beginPath();
    context.moveTo(x - half, y + half * 0.55);
    mark.points.forEach((value, index) => {
      const pointX = x - half + (index / (mark.points.length - 1)) * half * 2;
      const pointY = y + half * 0.7 - value * half * 1.4;
      if (index === 0) context.moveTo(pointX, pointY);
      else context.lineTo(pointX, pointY);
    });
    context.stroke();
  } else if (mark.kind === "bars") {
    const barWidth = mark.size * 0.2;
    mark.points.slice(0, 4).forEach((value, index) => {
      const barHeight = value * mark.size;
      context.globalAlpha = alpha * 0.8;
      context.fillRect(x - mark.size * 0.48 + index * mark.size * 0.29, y + mark.size * 0.48 - barHeight, barWidth, barHeight);
    });
  } else if (mark.kind === "network") {
    const nodes = [
      [x - mark.size * 0.5, y],
      [x, y - mark.size * 0.42],
      [x + mark.size * 0.48, y + mark.size * 0.3],
      [x - mark.size * 0.08, y + mark.size * 0.46],
    ];
    context.beginPath();
    context.moveTo(...nodes[0]);
    context.lineTo(...nodes[1]);
    context.lineTo(...nodes[2]);
    context.lineTo(...nodes[3]);
    context.lineTo(...nodes[0]);
    context.stroke();
    nodes.forEach(([nodeX, nodeY]) => {
      context.beginPath();
      context.arc(nodeX, nodeY, Math.max(1, mark.size * 0.09), 0, Math.PI * 2);
      context.fill();
    });
  } else {
    context.font = `${mark.kind === "tool" ? 700 : 500} ${mark.size}px ${mark.kind === "tool" ? "ui-monospace, monospace" : "Georgia, serif"}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(mark.label, x, y);
  }
}

export default function ContactDataField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext("2d");
    if (!canvas || !host || !context) {
      console.error("Unable to initialize the contact data canvas.");
      return undefined;
    }

    const shell = host.closest(".portfolio-shell");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let marks = [];
    let colors = { green: "#2e7467", accent: "#d65b38", ink: "#20231f" };
    let width = 0;
    let height = 0;
    let startTime = performance.now();
    let wordMotion = null;
    let animationFrame = 0;

    function refreshColors() {
      const style = getComputedStyle(canvas);
      colors = {
        green: style.getPropertyValue("--green").trim() || colors.green,
        accent: style.getPropertyValue("--accent").trim() || colors.accent,
        ink: style.getPropertyValue("--ink").trim() || colors.ink,
      };
      draw(performance.now());
    }

    function resize() {
      const bounds = host.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      width = bounds.width;
      height = bounds.height;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const mask = document.createElement("canvas");
      mask.width = Math.ceil(width);
      mask.height = Math.ceil(height);
      const maskContext = mask.getContext("2d");
      if (!maskContext) {
        console.error("Unable to create the contact data text mask.");
        return;
      }
        const fontSize = Math.max(48, Math.min(150, width * 0.14, height * 0.32));
      maskContext.font = `700 ${fontSize}px Georgia, "Times New Roman", serif`;
      maskContext.textAlign = "center";
      maskContext.textBaseline = "middle";
        maskContext.fillText("AUSTINE", width / 2, height * 0.5, width * 0.84);

      const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
      const candidates = [];
      for (let y = 0; y < mask.height; y += 5) {
        for (let x = 0; x < mask.width; x += 5) {
          if (pixels[(y * mask.width + x) * 4 + 3] > 128) candidates.push([x, y]);
        }
      }

      const wordBounds = candidates.reduce((bounds, [x, y]) => ({
        left: Math.min(bounds.left, x),
        right: Math.max(bounds.right, x),
        top: Math.min(bounds.top, y),
        bottom: Math.max(bounds.bottom, y),
      }), { left: width, right: 0, top: height, bottom: 0 });
      const wordWidth = wordBounds.right - wordBounds.left;
      const wordHeight = wordBounds.bottom - wordBounds.top;
      const padding = 14;
      wordMotion = {
        x: (wordBounds.left + wordBounds.right) / 2,
        y: (wordBounds.top + wordBounds.bottom) / 2,
        vx: randomBetween(-110, 110) || 70,
        vy: randomBetween(-90, 90) || -55,
        left: Math.max(padding + wordWidth / 2, 0),
        right: Math.min(width - padding - wordWidth / 2, width),
        top: Math.max(padding + wordHeight / 2, 0),
        bottom: Math.min(height - padding - wordHeight / 2, height),
        baseX: (wordBounds.left + wordBounds.right) / 2,
        baseY: (wordBounds.top + wordBounds.bottom) / 2,
        lastTime: performance.now(),
      };

      const markCount = Math.min(560, candidates.length);
      marks = [];
      for (let index = 0; index < markCount; index += 1) {
        const selected = Math.floor(Math.random() * candidates.length);
        const [x, y] = candidates.splice(selected, 1)[0];
        marks.push(makeMark(x, y, width, height));
      }
      for (let index = 0; index < 74; index += 1) {
        marks.push(makeMark(Math.random() * width, Math.random() * height, width, height, true));
      }
      startTime = performance.now();
      draw(startTime);
    }

    function draw(time) {
      if (!width || !height || !wordMotion) return;
      context.clearRect(0, 0, width, height);

      const elapsed = motionQuery.matches ? 0 : Math.max(0, time - startTime);
      const progress = motionQuery.matches ? 1 : Math.min(1, elapsed / 1550);
      const eased = 1 - (1 - progress) ** 3;
      const frameDelta = Math.min(0.05, Math.max(0, (time - wordMotion.lastTime) / 1000));
      wordMotion.lastTime = time;
      if (!motionQuery.matches) {
        wordMotion.x += wordMotion.vx * frameDelta;
        wordMotion.y += wordMotion.vy * frameDelta;
        if (wordMotion.x < wordMotion.left || wordMotion.x > wordMotion.right) {
          wordMotion.x = Math.min(wordMotion.right, Math.max(wordMotion.left, wordMotion.x));
          wordMotion.vx = wordMotion.x === wordMotion.left
            ? Math.abs(randomBetween(65, 125))
            : -Math.abs(randomBetween(65, 125));
          wordMotion.vy = randomBetween(-95, 95);
        }
        if (wordMotion.y < wordMotion.top || wordMotion.y > wordMotion.bottom) {
          wordMotion.y = Math.min(wordMotion.bottom, Math.max(wordMotion.top, wordMotion.y));
          wordMotion.vy = wordMotion.y === wordMotion.top
            ? Math.abs(randomBetween(55, 110))
            : -Math.abs(randomBetween(55, 110));
          wordMotion.vx = randomBetween(-115, 115);
        }
      }

      const wordOffsetX = (wordMotion.x - wordMotion.baseX) * eased;
      const wordOffsetY = (wordMotion.y - wordMotion.baseY) * eased;

      marks.forEach((mark) => {
        const isAmbient = mark.ambient;
        const drift = motionQuery.matches ? 0 : Math.sin(time * 0.00055 + mark.phase) * mark.drift;
        const x = isAmbient
          ? (mark.x + (elapsed / 1000) * mark.speed) % (width + mark.size * 2) - mark.size
          : mark.startX + (mark.x - mark.startX) * eased + wordOffsetX + drift * 0.55;
        const y = isAmbient
          ? mark.y + drift
          : mark.startY + (mark.y - mark.startY) * eased + wordOffsetY + drift * 0.55;
        const alpha = mark.strength * (isAmbient ? 1 : 0.24 + eased * 0.76);
        drawMark(context, mark, x, y, colors, alpha);
      });

      context.globalAlpha = 1;
    }

    function animate(time) {
      draw(time);
      if (!motionQuery.matches && !document.hidden) animationFrame = requestAnimationFrame(animate);
      else animationFrame = 0;
    }

    function startAnimation() {
      if (!motionQuery.matches && !document.hidden && !animationFrame) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        draw(performance.now());
      }
    }

    function handleMotionChange() {
      if (motionQuery.matches && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      if (motionQuery.matches && wordMotion) {
        wordMotion.x = wordMotion.baseX;
        wordMotion.y = wordMotion.baseY;
      }
      startAnimation();
    }

    function handleVisibilityChange() {
      if (document.hidden && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else {
        startAnimation();
      }
    }

    const resizeObserver = new ResizeObserver(resize);
    const paletteObserver = new MutationObserver(refreshColors);
    resizeObserver.observe(host);
    if (shell) paletteObserver.observe(shell, { attributes: true, attributeFilter: ["data-theme"] });
    motionQuery.addEventListener("change", handleMotionChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    refreshColors();
    resize();
    startAnimation();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      paletteObserver.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <canvas className="contact-data-field" ref={canvasRef} aria-hidden="true" />;
}
