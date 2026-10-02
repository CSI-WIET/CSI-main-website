/*
  Dev note: BentoHighlights is a presentational grid for event highlights.
  - To change images/stats, update the default props near the component signature.
  - This component is UI-only; avoid changing layout logic unless you want to alter the grid structure.
*/
import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

/**
 * BentoHighlights.js
 * Single-file component implementing a clean, trendy Bento Grid for Highlights.
 * Props:
 * - groupPhoto: URL for the main feature image
 * - groupPhotos: array of image URLs for carousel (max 5)
 * - attendees: string for attendees stat (default: "500+")
 * - workshops: string for workshops stat (default: "12+")
 * - logoSrc: optional CSI logo URL
 * - nextEvent: upcoming event title
 * - nextEventDate: upcoming date
 * - registerUrl: registration link
 */
const BentoHighlights = ({
  groupPhoto = '/event-images/CSI_Team(2024-25).jpg',
  groupPhotos,
  attendees = '100+',
  events = '12+',
  quote = 'We empower students to lead, innovate, and build the future.',
  logoSrc = '/event-images/Events2025/csi_logo.png',
  nextEvent = 'HackVerse Hackathon 2025',
  nextEventDate = 'To be announced',
  registerUrl = '/hackverse',
  nextEventLogo,
}) => {
  const photos = useMemo(() => {
    const arr = Array.isArray(groupPhotos) && groupPhotos.length > 0 ? groupPhotos.slice(0, 5) : [groupPhoto];
    return arr;
  }, [groupPhotos, groupPhoto]);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (photos.length <= 1) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % photos.length);
    }, 5000);
    return () => clearInterval(id);
  }, [photos.length]);

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length);
  const next = () => setCurrent((c) => (c + 1) % photos.length);
  return (
    <section className="w-full max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 md:h-[760px] lg:md:h-[820px]">

        {/* Main Feature Image (spans 2 columns, 2 rows) */}
        <div className="relative group col-span-1 md:col-span-3 md:row-span-2 rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm p-0 transform transition hover:-translate-y-1 hover:shadow-xl min-h-[420px] md:min-h-[520px] flex items-center justify-center">
          <img
            src={photos[current]}
            alt="Group"
            className="max-w-full max-h-full object-contain object-center rounded-3xl transition-opacity duration-500"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.src = '/event-images/placeholder.svg'; }}
          />
          <div className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-t from-black/15 via-transparent to-transparent" />

          {/* Content - bottom left */}
          <div className="absolute left-6 bottom-6 z-20 text-white max-w-[70%]">
            <div className="inline-flex items-center gap-2 bg-white/8 px-3 py-1 rounded-full text-sm font-medium backdrop-blur">
              <span className="text-sm">🏆</span>
              <span>Flagship Event</span>
            </div>
            <h3 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">Technokruti 2025</h3>
            <p className="mt-2 text-sm">Celebrating innovation and creativity with 100+ participants.</p>
          </div>

          {/* Carousel controls */}
          {photos.length > 1 && (
            <>
              <button aria-label="Previous" onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/30 hover:bg-black/40 text-white w-9 h-9 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button aria-label="Next" onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 rounded-full bg-black/30 hover:bg-black/40 text-white w-9 h-9 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                {photos.map((_, i) => (
                  <span key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full cursor-pointer ${i === current ? 'bg-white' : 'bg-white/50'}`} />
                ))}
              </div>
            </>
          )}

          {/* ArrowUpRight icon - top right on hover */}
          <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Stat Card 1 (Attendees) */}
        <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 transform transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-center">
          <div className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">{attendees}</div>
          <div className="mt-2 text-sm uppercase text-gray-400">Attendees</div>
        </div>

        {/* Stat Card 2 (Workshops) */}
        <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 transform transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-center">
          <div className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">{events}</div>
          <div className="mt-2 text-sm uppercase text-gray-400">Events</div>
        </div>

        {/* Upcoming Event (far right, spans 1 column 2 rows) */}
        <div className="relative rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm p-6 md:col-start-4 md:row-span-2 transform transition hover:-translate-y-1 hover:shadow-xl flex flex-col gap-4">
          {/* Header */}
          <div>
            <div className="text-sm font-mono text-cyan-300">UPCOMING</div>
            <h4 className="mt-2 text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 font-semibold">{nextEvent}</h4>
            <p className="mt-1 text-sm text-gray-400">{nextEventDate}</p>
          </div>

          {/* Upcoming content: show logo if provided; else technical filler */}
          {nextEventLogo ? (
            <div className="relative flex-1 min-h-[140px] rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)',
                  backgroundSize: '18px 18px'
                }}
              />
              <img src={nextEventLogo} alt="HackVerse logo" className="relative z-10 max-h-24 md:max-h-28 object-contain" />
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-400/40 group-hover:border-cyan-400" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-cyan-400/40 group-hover:border-cyan-400" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-cyan-400/40 group-hover:border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-400/40 group-hover:border-cyan-400" />
              </div>
            </div>
          ) : (
            <div className="relative flex-1 min-h-[140px] rounded-2xl overflow-hidden border border-white/10">
              {/* radial glow */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(closest-side, rgba(59,130,246,0.18), rgba(59,130,246,0.08), transparent 70%)'
                }}
              />
              {/* subtle grid */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)',
                  backgroundSize: '18px 18px'
                }}
              />
              {/* pointer triangle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
                  <path d="M12 6l6 12-6-4-6 4 6-12z" fill="currentColor" />
                </svg>
              </div>
              {/* corner brackets */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-cyan-400/40 group-hover:border-cyan-400" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-cyan-400/40 group-hover:border-cyan-400" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-cyan-400/40 group-hover:border-cyan-400" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-cyan-400/40 group-hover:border-cyan-400" />
              </div>
            </div>
          )}

          {/* CTA aligned to bottom */}
          <div className="mt-auto">
            <a
              href={registerUrl}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-cyan-500 text-black font-semibold shadow-sm hover:shadow-md transition"
            >
              Register Now
            </a>
          </div>
        </div>

        {/* Mission Quote (spans 2 columns, 1 row - bottom left) */}
        <div className="relative col-span-1 md:col-span-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm p-8 transform transition hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
          <div>
            <div className="text-sm font-mono text-cyan-300">OUR MISSION</div>
            <blockquote className="mt-3 italic text-gray-400 text-base">“{quote}”</blockquote>
          </div>
          <div className="mt-6 flex items-center gap-3">
            {logoSrc ? (
              <img src={logoSrc} alt="CSI logo" className="w-16 h-auto object-contain" />
            ) : (
              <div className="w-12 h-12 rounded-md bg-white/6 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 12h18M12 3v18" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
            <div className="text-sm text-gray-400">CSI - Student Chapter</div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default BentoHighlights;
