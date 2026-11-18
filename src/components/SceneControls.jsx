import { useEffect, useState } from "react";

export default function SceneControls({ activeSection, onManualOverride }) {
  const [progress, setProgress] = useState(0);
  const [detail, setDetail] = useState("High");

  useEffect(() => {
    setProgress(0);
    onManualOverride(null);
  }, [activeSection, onManualOverride]);

  function handleProgressChange(event) {
    const nextProgress = Number(event.currentTarget.value);
    setProgress(nextProgress);
    onManualOverride(nextProgress);
  }

  if (activeSection === 0) return null;

  const panelClass = "fixed bottom-24 left-1/2 z-10 w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#111122]/80 p-6 text-white backdrop-blur-md";

  if (activeSection === 1) {
    return (
      <section aria-label="Transformation controls" className={panelClass}>
        <div className="flex items-center justify-between">
          <label htmlFor="transformation-progress" className="text-xs uppercase tracking-widest">DATA → RELATIONSHIP</label>
          <span className="text-xs tracking-widest">R³ → R²</span>
        </div>
        <input id="transformation-progress" aria-label="Transformation progress" className="scene-range mt-4 w-full" type="range" min="0" max="1" step="0.01" value={progress} onChange={handleProgressChange} />
        <div className="mt-4 flex items-center justify-between">
          <label htmlFor="detail-level" className="text-xs uppercase tracking-widest">DETAIL</label>
          <select id="detail-level" value={detail} onChange={(event) => setDetail(event.currentTarget.value)} className="rounded-md border border-white/10 bg-[#111122] px-3 py-1.5 text-xs">
            <option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Reveal controls" className={panelClass}>
      <div className="flex items-center justify-between">
        <label htmlFor="reveal-progress" className="text-xs uppercase tracking-widest">REVEAL</label>
        <span className="text-xs tracking-widest">TAILS → CENTER</span>
      </div>
      <input id="reveal-progress" aria-label="Reveal progress" className="scene-range mt-4 w-full" type="range" min="0" max="1" step="0.01" value={progress} onChange={handleProgressChange} />
    </section>
  );
}
