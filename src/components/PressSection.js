/**
 * PressSection.js
 * Professional press/news article showcase with technical aesthetic
 * Optimized for performance - minimal animations
 */
import React, { useState } from 'react';
import { Newspaper, Award, ExternalLink } from 'lucide-react';

const PressSection = ({ pressArticle, isDarkMode }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!pressArticle || !pressArticle.image) return null;

  const {
    image,
    title = "HackVerse Featured in Media",
    source = "Press Coverage",
    date,
    description,
    link
  } = pressArticle;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Simplified animations - only on hover */}
      <style>{`
        .scanning-line-hover {
          position: absolute;
          left: 0;
          top: -10%;
          width: 100%;
          height: 80px;
          background: linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .press-card:hover .scanning-line-hover {
          opacity: 1;
          animation: scanOnce 2s ease-in-out;
        }
        @keyframes scanOnce {
          0% { top: -10%; }
          100% { top: 110%; }
        }
      `}</style>

      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 dark:border-cyan-400/30 mb-6">
          <Award className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">
            Featured Achievement
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          <span className="text-gray-900 dark:text-white">In The </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400">
            Spotlight
          </span>
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Our hackathon made headlines — recognized for innovation and impact
        </p>
      </div>

      {/* Main Press Card */}
      <div className="relative">
        {/* Subtle Background Glow */}
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-2xl opacity-60" />
        
        {/* Main Card Container */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`press-card relative group rounded-2xl overflow-hidden transition-all duration-500 ${
            isHovered ? 'scale-[1.01]' : 'scale-100'
          }`}
        >
          {/* Glass Background */}
          <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-xl" />
          
          {/* Technical Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* Scanning Line on Hover Only */}
          <div className="scanning-line-hover" />

          {/* Corner Brackets - Static */}
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ opacity: isHovered ? 1 : 0.6 }}>
            <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-cyan-500 dark:border-cyan-400 transition-all duration-300" style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }} />
            <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-blue-500 dark:border-blue-400 transition-all duration-300" style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }} />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-purple-500 dark:border-purple-400 transition-all duration-300" style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }} />
            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-pink-500 dark:border-pink-400 transition-all duration-300" style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }} />
          </div>

          {/* Content Grid */}
          <div className="relative z-20 grid md:grid-cols-2 gap-8 p-8 md:p-12">
            
            {/* Left: Article Image */}
            <div className="relative">
              {/* Image Container with Technical Frame */}
              <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/30 dark:border-cyan-400/30 shadow-2xl">
                {/* Image */}
                <img
                  src={image}
                  alt={title}
                  className="w-full h-auto object-contain bg-white dark:bg-gray-900 transition-transform duration-500"
                  style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
                />
                
                {/* Overlay Gradient on Hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent pointer-events-none transition-opacity duration-300"
                  style={{ opacity: isHovered ? 1 : 0 }}
                />
              </div>

              {/* Floating Icon Badge */}
              <div
                className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 shadow-xl flex items-center justify-center transition-transform duration-300"
                style={{ transform: isHovered ? 'translateY(-5px) rotate(5deg)' : 'translateY(0) rotate(0)' }}
              >
                <Newspaper className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Right: Article Details */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Source Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 border border-cyan-300 dark:border-cyan-700 w-fit">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                  {source}
                </span>
                {date && (
                  <>
                    <span className="text-cyan-400 dark:text-cyan-600">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{date}</span>
                  </>
                )}
              </div>

              {/* Title */}
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                {title}
              </h3>

              {/* Description */}
              {description && (
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  {description}
                </p>
              )}

              {/* Stats or Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/50 dark:to-blue-950/50 border border-cyan-200 dark:border-cyan-800">
                  <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">100+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Participants</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24h</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Innovation</div>
                </div>
              </div>

              {/* CTA Button */}
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-500 dark:to-blue-500 text-white font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  <span>Read Full Article</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              )}

              {/* Verification Badge */}
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Verified Press Coverage</span>
              </div>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent transition-all duration-300"
            style={{ width: isHovered ? '100%' : '80%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default PressSection;
