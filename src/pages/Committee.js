import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import SpotlightGrid from '../components/SpotlightGrid';
import CommitteeHero from '../components/CommitteeHero';
import { useHtmlDark } from '../hooks/useHtmlDark';
import { Linkedin, Github } from 'lucide-react';
import MemberCard from '../components/MemberCard';

const COMMITTEE_YEARS = ['2024-25', '2025-26', '2026-27'];

export const Committee = ({ isDarkMode: propIsDarkMode }) => {
  const [selectedYear, setSelectedYear] = useState('2026-27');
  const [committeeData, setCommitteeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/db.json') 
      .then(response => response.json())
      .then(data => {
        if (data?.data?.committee) {
          setCommitteeData(data.data.committee); 
          console.log(data.data.committee); 
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  // Function to handle year button clicks
  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  // Get profiles based on selected year
  const profiles = committeeData[selectedYear] || [];
  // Hero image from db.json highlight (first entry) with fallback
  const heroHighlight = profiles[0]?.highlight;
  const heroSrc = heroHighlight || (selectedYear === '2024-25'
    ? '/event-images/CSI_Team(2024-25).jpg'
    : selectedYear === '2026-27'
    ? '/event-images/committee_2026/core_committee2026.jpg'
    : '/event-images/committee_2025/core_committee2025.jpg');

    // Call hook unconditionally to satisfy Rules of Hooks, then prefer prop when provided
    const hookIsDark = useHtmlDark();
    const isDark = typeof propIsDarkMode !== 'undefined' ? propIsDarkMode : hookIsDark;

    return (
      <SpotlightGrid isDarkMode={isDark}>
        <div className="min-h-screen">
          <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="py-10 px-4 md:px-10 md:pt-8">
            {/* Premium SaaS Header */}
            <div className="w-full flex flex-col items-center text-center mb-8">
              <div className="relative">
                {/* decorative dot pattern behind title */}
                <svg aria-hidden className="absolute -z-10 opacity-10 w-[420px] h-[120px] hidden md:block" viewBox="0 0 420 120" fill="none">
                  <defs>
                    <pattern id="csi-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill={isDark ? '#94a3b8' : '#cbd5e1'} />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#csi-dots)" />
                </svg>

                <div className="flex items-center justify-center gap-4">
                  <span className={`text-cyan-400 font-mono text-xl tracking-wide select-none ${isDark ? 'opacity-90' : 'opacity-95'}`}>//</span>
                  <h1
                    className={`text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent`}
                    style={{
                      backgroundImage: isDark
                        ? 'linear-gradient(90deg,#ffffff, #94a3b8)'
                        : 'linear-gradient(90deg,#0f1724, #475569)'
                    }}
                  >
                    Meet Our Team
                  </h1>
                </div>

                <p className={`mt-3 text-sm ${isDark ? 'text-slate-300/90' : 'text-slate-600'}`}>The council behind CSI-WIET — leading events and community efforts.</p>
              </div>

              {/* Year toggle (centered pill with sliding active background) */}
              <div className="mt-6 w-full flex justify-center">
                <div
                  role="tablist"
                  aria-label="Academic year toggle"
                  className={`relative rounded-full px-1 py-1 flex items-center ${isDark ? 'bg-slate-900/60 border border-white/10' : 'bg-slate-200/60'} max-w-[560px] w-full`}
                >
                  {/* active background - absolute and slides with translateX */}
                  <div
                    aria-hidden
                    className={`absolute top-1 bottom-1 left-1 rounded-full transition-transform duration-300 ease-out ${isDark ? 'bg-slate-700 shadow-sm' : 'bg-white shadow-sm'}`}
                    style={{
                      width: `calc(${100 / COMMITTEE_YEARS.length}% - 4px)`,
                      transform: `translateX(${COMMITTEE_YEARS.indexOf(selectedYear) * 100}%)`
                    }}
                  />

                  {COMMITTEE_YEARS.map((year) => (
                    <button
                      key={year}
                      role="tab"
                      aria-selected={selectedYear === year}
                      onClick={() => handleYearClick(year)}
                      className={`relative z-10 flex-1 text-center py-2 px-5 rounded-full text-sm font-medium ${selectedYear === year ? (isDark ? 'text-white' : 'text-black') : 'text-gray-500'}`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>
            </div>
              {/* Loading State */}
              {/* Committee Hero (main group photo) - show 2024-25 photo as deactivated when that year is selected */}
              <div className="mb-8">
                {selectedYear === '2024-25' ? (
                  <div className="relative">
                    <CommitteeHero
                      imageSrc={heroSrc}
                      alt="CSI WIET Committee 2024-25 (deactivated)"
                    />
                    {/* Deactivated overlay - subtle grayscale + disabled badge */}
                    <div className="absolute inset-0 rounded-3xl pointer-events-none"
                         style={{ background: 'rgba(15,23,42,0.45)', mixBlendMode: 'overlay' }} />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-medium backdrop-blur-md">
                      Deactivated
                    </div>
                  </div>
                ) : (
                  <CommitteeHero imageSrc={heroSrc} alt={`CSI WIET Committee ${selectedYear}`} />
                )}
              </div>
            </div>
          <div className="py-10 md:pt-8">
            {/* Team Members Header with Animation */}
            <div className="flex items-center justify-center mb-8" data-aos="fade-down" data-aos-duration="800" data-aos-delay="200">
              <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                <path d="M0.226497 6L6 11.7735L11.7735 6L6 0.226497L0.226497 6ZM91 5H6V7H91V5Z" fill="#FFA2A2" />
              </svg>
              <p className="text-dt-blue dark:text-white text-3xl md:text-4xl font-bold capitalize tracking-wide mx-4 relative group">
                Team Members
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </p>
              <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-pulse">
                <path d="M90.7735 6L85 0.226497L79.2265 6L85 11.7735L90.7735 6ZM0 7L85 7V5L0 5V7Z" fill="#FFA2A2" />
              </svg>
            </div>
            
            {/* Team Description with Animation */}
            <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
              <p className="mt-2 text-dt-blue dark:text-white text-lg md:text-xl font-medium tracking-wide max-w-3xl mx-auto px-4">
                We have proudly assigned team members. Looking back, here are team members of CSI!
              </p>
            </div>
            {/* Team Members Grid with Modern Cards */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : profiles.length === 0 || profiles.length === 1 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md max-w-lg mx-auto" data-aos="fade-up">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <h3 className="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">No Team Members Yet</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Team information for {selectedYear} will be added soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                {profiles.map((profile, index) => {
                  if (index === 0) return null
                  return (
                    <div
                      key={index}
                      className="w-full max-w-sm"
                      data-aos="fade-up"
                      data-aos-duration="800"
                      data-aos-delay={index * 100}
                    >
                      <MemberCard member={profile} isDarkMode={isDark} yearLabel={selectedYear} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          
          {/* Back to top button */}
          <div className="fixed bottom-8 right-8 z-50">
            <button 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none"
              aria-label="Back to top"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </button>
          </div>
          </div>
        </div>
      </SpotlightGrid>
    )
}
