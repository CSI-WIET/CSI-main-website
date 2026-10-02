import React, { useEffect, useRef } from "react";

const CursorGlow = () => {
  const cursorRef = useRef(null);
  const arrowRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use refs for mutable state to avoid re-renders
    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    let rafId = null;
    let lastX = pos.x;
    let lastY = pos.y;
    let angle = 0;

    const onMouseMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    // Lerp helper
    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const loop = () => {
      // Smooth position
      pos.x = lerp(pos.x, target.x, 0.16);
      pos.y = lerp(pos.y, target.y, 0.16);

      // Compute direction for rotation (based on target movement)
      const dx = target.x - lastX;
      const dy = target.y - lastY;
      const targetAngle = Math.atan2(dy, dx) * (180 / Math.PI);
      angle = lerp(angle, targetAngle || angle, 0.12);

      // Apply transform using translate3d for better performance
      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;

      // Rotate inner arrow smoothly while keeping it centered
      if (arrowRef.current) {
        arrowRef.current.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      }

      lastX = lerp(lastX, target.x, 0.22);
      lastY = lerp(lastY, target.y, 0.22);

      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const gradient =
    "radial-gradient(circle, rgba(0,150,255,0.9) 0%, rgba(0,150,255,0.15) 60%, rgba(0,150,255,0) 100%)";

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[20000] left-0 top-0"
      style={{ transform: `translate3d(${window.innerWidth / 2}px, ${window.innerHeight / 2}px, 0)`, willChange: 'transform' }}
    >
      {/* Glow layer (blurred) */}
      <div
        className="absolute left-1/2 top-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-screen filter blur-2xl"
        style={{ background: gradient }}
      />

      {/* Crisp arrow above the glow */}
      <div ref={arrowRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center"
           style={{ width: 28, height: 28, transform: 'translate(-50%, -50%)', transition: 'transform 120ms linear' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', filter: 'drop-shadow(0 0 8px rgba(0,150,255,0.9))' }}>
          <polygon points="6,4 18,12 6,20" fill="rgba(255,255,255,0.95)" />
        </svg>
      </div>
    </div>
  );
};

export default CursorGlow;
