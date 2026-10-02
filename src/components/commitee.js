import React from 'react'
import { Linkedin, Github } from 'lucide-react'

// Small CSS injected to enable entrance, shimmer, and glow animations without changing project-wide styles
const injectedCSS = `
  .por-appear { animation: porAppear 560ms cubic-bezier(.2,.9,.3,1) forwards; }
  @keyframes porAppear { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

  .por-glow { transition: opacity .6s ease, transform .6s ease; opacity: 0; transform: scale(0.98); }
  .group:hover .por-glow { opacity: 1; transform: scale(1.03); }

  .por-shimmer { background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%); transform: translateX(-120%); }
  .group:hover .por-shimmer { transform: translateX(120%); transition: transform 900ms ease; }
`

// MemberCard: receives `member` { name, role, image, socials } and `isDarkMode` boolean
// NOTE: This component focuses only on UI — it does not change any data logic.
export const MemberCard = ({ member, isDarkMode = false }) => {
  const base = 'group rounded-3xl overflow-hidden transform transition-all duration-500 por-appear'

  const themeClasses = isDarkMode
    ? 'bg-slate-900/60 border border-white/10 backdrop-blur-xl text-white'
    : 'bg-white/80 border border-slate-200 backdrop-blur-md text-slate-900'

  return (
    <article className={`${base} ${themeClasses} shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-shadow duration-700 ease-out relative`}>
      <style>{injectedCSS}</style>

      {/* Soft glow layer (subtle neon-ish accent) */}
      <div
        aria-hidden
        className={`por-glow absolute inset-0 rounded-3xl pointer-events-none ${isDarkMode ? 'bg-cyan-600/10 blur-[18px]' : 'bg-cyan-400/6 blur-[14px]'}`}
      />

      {/* Cinematic image area */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient overlay (fade in on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Shimmer overlay that sweeps on hover */}
        <div className="absolute inset-0 por-shimmer pointer-events-none" />

        {/* Social icons drawer (slides up on hover). Uses optional chaining to avoid runtime errors if socials are missing. */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex gap-3 z-10">
          {member.socials?.linkedin && (
            <a
              href={member.socials?.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} LinkedIn`}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors shadow-sm hover:shadow-lg"
            >
              <Linkedin size={18} />
            </a>
          )}

          {member.socials?.github && (
            <a
              href={member.socials?.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`${member.name} GitHub`}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors shadow-sm hover:shadow-lg"
            >
              <Github size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Text / details section */}
      <div className="p-6 text-center relative">
        {/* Tech accent line */}
        <div className="mx-auto h-0.5 w-8 bg-cyan-500 rounded transition-all duration-500 group-hover:w-16 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)]" />

        <h3 className="mt-4 text-2xl font-bold transition-colors duration-300 group-hover:text-cyan-500">
          {member.name}
        </h3>

        <p className={`mt-2 text-sm font-mono uppercase tracking-widest ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          {member.role}
        </p>
      </div>
    </article>
  )
}

// Simple Committee wrapper showing a responsive grid of MemberCard components
export default function Committee({ members = [], isDarkMode = false }) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {members.map((m, idx) => (
          <div key={m.name} className="delay-[calc(50ms*var(--i))]" style={{ ['--i']: idx }}>
            <MemberCard member={m} isDarkMode={isDarkMode} />
          </div>
        ))}
      </div>
    </section>
  )
}
