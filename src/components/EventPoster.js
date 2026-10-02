import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const EventPoster = ({ image, title, eventYear, eventId }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-full aspect-auto rounded-lg overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main card container with subtle shadow - different for light/dark */}
      <div className="relative w-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-slate-300/50 dark:border-slate-700/30">
        
        {/* Image container - full visibility */}
        <div className="relative w-full overflow-hidden bg-slate-50 dark:bg-transparent">
          <img
            src={image}
            alt={title}
            className="w-full h-auto object-contain"
            style={{ display: 'block' }}
            loading="lazy"
            decoding="async"
            onError={(e) => { e.currentTarget.src = '/event-images/placeholder.svg'; }}
          />
          
          {/* Tech grid overlay - static hover opacity */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6, 182, 212, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />

          {/* Scanning line animation */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 dark:via-cyan-400 to-transparent shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                initial={{ top: '0%', opacity: 0 }}
                animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </AnimatePresence>

          {/* Corner bracket animations */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-cyan-500/0 dark:border-cyan-400/0"
              initial={false}
              animate={isHovered ? { width: '32px', height: '32px', borderColor: 'rgba(6,182,212,0.9)' } : { width: '20px', height: '20px', borderColor: 'rgba(6,182,212,0)' }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-cyan-500/0 dark:border-cyan-400/0"
              initial={false}
              animate={isHovered ? { width: '32px', height: '32px', borderColor: 'rgba(6,182,212,0.9)' } : { width: '20px', height: '20px', borderColor: 'rgba(6,182,212,0)' }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-cyan-500/0 dark:border-cyan-400/0"
              initial={false}
              animate={isHovered ? { width: '32px', height: '32px', borderColor: 'rgba(6,182,212,0.9)' } : { width: '20px', height: '20px', borderColor: 'rgba(6,182,212,0)' }}
              transition={{ duration: 0.25 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-cyan-500/0 dark:border-cyan-400/0"
              initial={false}
              animate={isHovered ? { width: '32px', height: '32px', borderColor: 'rgba(6,182,212,0.9)' } : { width: '20px', height: '20px', borderColor: 'rgba(6,182,212,0)' }}
              transition={{ duration: 0.25 }}
            />
          </div>
        </div>

        {/* Info panel at bottom - styled for light/dark mode */}
        <div className="relative px-4 py-3 bg-gradient-to-r from-slate-100/95 via-slate-200/95 to-slate-100/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 backdrop-blur-md border-t border-cyan-500/30 dark:border-cyan-500/20">
          {/* Title - better contrast for light mode */}
          <h3 className="text-slate-900 dark:text-white font-semibold text-sm md:text-base mb-2 line-clamp-2 leading-tight">
            {title}
          </h3>

          {/* Action button - styled for both modes */}
          <Link
            to={`/events/${eventYear}/${eventId}`}
            className="inline-block"
          >
            <motion.div
              className="relative px-4 py-2 bg-slate-200/80 dark:bg-slate-800/50 border border-cyan-600/40 dark:border-cyan-500/30 rounded text-cyan-600 dark:text-cyan-400 text-xs font-mono overflow-hidden"
              whileHover={{ borderColor: 'rgba(6,182,212,0.8)', backgroundColor: 'rgba(6,182,212,0.12)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/18 to-cyan-500/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: 'linear' }}
              />
              <span className="relative flex items-center gap-2">
                <motion.span 
                  className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                VIEW DETAILS
                <motion.svg 
                  className="w-3 h-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </motion.svg>
              </span>
            </motion.div>
          </Link>

          {/* Tech indicators - full event ID visible */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity duration-200">
              <span className="w-1 h-1 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono uppercase">Active</span>
            </div>
            
            <span className="text-slate-400 dark:text-slate-600">|</span>
            
            <div className="flex items-center gap-1.5 flex-1 min-w-0 text-slate-600 dark:text-slate-500">
              <svg className="w-3 h-3 flex-shrink-0 text-slate-500 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span className="text-[10px] text-slate-600 dark:text-slate-500 font-mono truncate" title={eventId}>
                {eventId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPoster;
