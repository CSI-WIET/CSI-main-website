import React from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * CommitteeHero
 * Props:
 * - imageSrc: string (url) - main group photo
 * - alt: string
 * - className: string (optional)
 */
export default function CommitteeHero({ imageSrc = '', alt = 'Committee Group Photo', className = '' }) {
  return (
    <section className={`w-full ${className}`}>
      <div className="relative w-full h-[420px] sm:h-[520px] md:h-[640px] lg:h-[720px] rounded-3xl overflow-hidden mx-auto group">
        {/* soft colored glow behind the container */}
        <div className="absolute -inset-6 rounded-3xl blur-3xl opacity-40 pointer-events-none" style={{ boxShadow: '0 40px 80px rgba(56,189,248,0.12)' }} />

        {/* Image */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <img
            src={imageSrc}
            alt={alt}
            className="w-full h-full object-contain md:object-cover object-center bg-neutral-900/5 transform transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Tech overlay (scanlines / grid) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none transition-opacity duration-600 ease-out group-hover:opacity-0 opacity-30 z-10"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), repeating-linear-gradient(0deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 1px, transparent 1px, transparent 18px)",
            backgroundSize: '18px 18px'
          }}
        />

        {/* Floating badge */}
        {/* Left badge - hidden on small screens to avoid overlapping the centered mobile badge */}
        <div className="hidden md:block absolute left-6 bottom-6 md:left-10 md:bottom-8 z-20">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 text-white rounded-full px-4 py-2 flex items-center gap-3 max-w-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex-shrink-0">
                <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-block h-4 w-4 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs uppercase tracking-wider">Status: <span className="font-semibold ml-1">Active</span></span>
            </div>
            <div className="h-5 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">CSI WIET</span>
              <span className="text-[10px] text-white/80">COMMITTEE 2025-26</span>
            </div>
          </div>
        </div>

        {/* bottom-center badge (duplicate alternative for center placement on small screens) */}
          {/* Bottom-center badge for small screens (fits within viewport) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden w-[min(90vw,600px)] px-2 z-20">
            <div className="backdrop-blur-md bg-black/40 border border-white/10 text-white rounded-full px-3 py-2 flex items-center gap-3 justify-center max-w-full truncate">
            <span className="relative flex-shrink-0">
              <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-block h-4 w-4 rounded-full bg-emerald-400" />
            </span>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold">CSI WIET</span>
              <span className="text-[10px] text-white/80">COMMITTEE 2025-26</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
