import React from 'react'
import { Link } from 'react-router-dom'
import { Linkedin, Github } from 'lucide-react'

// Reusable MemberCard UI component (UI-only, no logic changes).
// Props:
// - member: { name, position, image, linkedin, github, socials? }
// - isDarkMode: boolean
// - yearLabel: optional string displayed in the image overlay on hover
export default function MemberCard({ member = {}, isDarkMode = false, yearLabel = '' }) {
  const theme = isDarkMode
    ? 'bg-slate-900/60 border border-white/10 backdrop-blur-xl text-white'
    : 'bg-white/80 border border-slate-200 backdrop-blur-md text-slate-900'

  return (
    <article className={`rounded-3xl overflow-hidden transform transition-all duration-500 ${theme} shadow-sm hover:shadow-2xl hover:-translate-y-2`}>
      <div className="relative h-72 overflow-hidden group">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex items-end justify-center p-4">
          <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {yearLabel ? <p className="text-sm font-light">{yearLabel} Committee Member</p> : null}
          </div>
        </div>

        {/* Social drawer - hidden by default (opacity 0 + no pointer events), fades/slides up on hover */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex gap-3 z-10 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300">
          {member?.linkedin && (
            <Link
              to={member?.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`LinkedIn profile of ${member.name}`}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-200 hover:ring-4 hover:ring-cyan-300/40"
            >
              <Linkedin size={18} />
            </Link>
          )}

          {member?.github && (
            <Link
              to={member?.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub profile of ${member.name}`}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-200 hover:ring-4 hover:ring-emerald-300/40"
            >
              <Github size={18} />
            </Link>
          )}
        </div>
      </div>

      {/* Add extra top padding so the text doesn't collide with social icons visually */}
      <div className="pt-10 p-6 text-center">
        <div className="mx-auto h-0.5 w-8 bg-blue-600 rounded transition-all duration-500 group-hover:w-16 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.18)]" />
        <h2 className="mt-4 text-2xl font-bold transition-colors duration-300 group-hover:text-blue-600">{member.name}</h2>
        <h3 className="mt-2 text-sm font-mono uppercase tracking-widest text-blue-600">{member.position}</h3>
      </div>
    </article>
  )
}
