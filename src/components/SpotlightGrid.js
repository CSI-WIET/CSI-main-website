import React, { useEffect, useRef } from 'react';

// SpotlightGrid
// - Renders a subtle dot grid background with a "flashlight" reveal that follows the cursor.
// - Props:
//    - isDarkMode: boolean toggles colors
//    - children: page content to render on top
// Implementation notes:
// - Uses CSS mask-image (and -webkit-mask-image) with a radial-gradient centered on the cursor.
// - Coordinates are updated via requestAnimationFrame for smooth motion without causing React re-renders.
// - The spotlight fades in/out on mouse enter/leave.

export default function SpotlightGrid({ isDarkMode = true, children }) {
  const containerRef = useRef(null);
  const revealRef = useRef(null);
  const rafRef = useRef(null);
  const posRef = useRef({ x: window?.innerWidth / 2 || 0, y: window?.innerHeight / 2 || 0 });
  const targetRef = useRef({ x: posRef.current.x, y: posRef.current.y });
  const opacityRef = useRef(0);

  useEffect(() => {
    const revealEl = revealRef.current;
    if (!revealEl) return;

    // initial CSS variables
    revealEl.style.setProperty('--mx', `${posRef.current.x}px`);
    revealEl.style.setProperty('--my', `${posRef.current.y}px`);
    revealEl.style.opacity = '0';

    const lerp = (a, b, n) => (1 - n) * a + n * b;

    const loop = () => {
      const pos = posRef.current;
      const target = targetRef.current;

      // smooth position
      pos.x = lerp(pos.x, target.x, 0.18);
      pos.y = lerp(pos.y, target.y, 0.18);

      // smooth opacity
      opacityRef.current = lerp(Number(opacityRef.current), Number(revealEl.dataset.show === '1' ? 1 : 0), 0.12);

      // apply CSS variables (no React re-render)
      revealEl.style.setProperty('--mx', `${Math.round(pos.x)}px`);
      revealEl.style.setProperty('--my', `${Math.round(pos.y)}px`);
      revealEl.style.opacity = String(opacityRef.current);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const revealEl = revealRef.current;
    if (!container || !revealEl) return;

    const onMove = (e) => {
      const x = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? posRef.current.x;
      const y = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? posRef.current.y;
      targetRef.current.x = x;
      targetRef.current.y = y;
    };

    const onEnter = (e) => {
      revealEl.dataset.show = '1';
    };
    const onLeave = (e) => {
      revealEl.dataset.show = '0';
    };

    container.addEventListener('mousemove', onMove, { passive: true });
    container.addEventListener('touchmove', onMove, { passive: true });
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    // also hide on window blur to avoid stuck spotlight when switching tabs
    const onBlur = () => (revealEl.dataset.show = '0');
    window.addEventListener('blur', onBlur);

    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('touchmove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  // Colors & dot sizes
  const baseDotColor = isDarkMode ? 'rgba(51,65,85,0.18)' : 'rgba(203,213,225,0.28)'; // #334155 / #cbd5e1
  const revealDotColor = isDarkMode ? '#22d3ee' : '#4f46e5'; // cyan / indigo
  // Use a distinct background per theme so the dot-grid shows against different tones
  const bgStyleContainer = isDarkMode
    ? { background: 'linear-gradient(180deg,#020617 0%, #071029 60%)' } // deep slate/blue gradient for dark
    : { background: '#ffffff' }; // pure white for light mode (user requested)

  // CSS for the dot pattern (uses a small radial-gradient and background-size to form a grid)
  const dotSize = 2; // px
  const cellSize = 18; // spacing

  const baseStyle = {
    backgroundImage: `radial-gradient(circle, ${baseDotColor} ${dotSize}px, transparent ${dotSize}px)`,
    backgroundSize: `${cellSize}px ${cellSize}px`,
    backgroundPosition: '0 0',
  };

  const revealStyle = {
    backgroundImage: `radial-gradient(circle, ${revealDotColor} ${dotSize}px, transparent ${dotSize}px)`,
    backgroundSize: `${cellSize}px ${cellSize}px`,
    backgroundPosition: '0 0',
    // mask uses CSS variables --mx / --my updated in RAF loop
    // Spotlight radius set to 120px (was 300px in previous design) to reduce reveal area
    maskImage: `radial-gradient(circle 120px at var(--mx) var(--my), rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
    WebkitMaskImage: `radial-gradient(circle 120px at var(--mx) var(--my), rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
    transition: 'opacity 260ms ease',
    opacity: 0,
    pointerEvents: 'none',
  };

  return (
    <div ref={containerRef} className={`relative w-full min-h-screen overflow-hidden`} style={{...bgStyleContainer}}>
      {/* base static grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ ...baseStyle }}
      />

      {/* reveal layer that is masked by a radial gradient centered on the cursor */}
      <div
        aria-hidden
        ref={revealRef}
        data-show="0"
        className="absolute inset-0 pointer-events-none"
        style={revealStyle}
      />

      {/* content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
