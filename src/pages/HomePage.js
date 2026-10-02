import React,{useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import MembershipPoster from '../assets/Membership.png';
import { Link } from 'react-router-dom';
import TechBackground from '../components/TechBackground';
import HoloHighlight from '../components/HoloHighlight';
import BentoHighlights from '../components/BentoHighlights';
import ContactTechGrid from '../components/ContactTechGrid';
import CodeSprintGame from '../components/CodeSprintGame';
import MembershipSection from '../components/MembershipSection';
import PressSection from '../components/PressSection';
// Background video replaced by an animated gradient + blobs for a trendy UI
import { EventCard } from '../components';
import { SponsorCard } from '../components/Sponsors';

export const HomePage = () => {
  const { eventYear, eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [eventsData, setEventsData] = useState({ events: {}, committee: {} });
  const [sponsors, setSponsors] = useState([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return document.documentElement.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    } catch (e) { return true; }
  });

  // Scroll progress tracking with requestAnimationFrame for better performance
  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollableHeight = documentHeight - windowHeight;
      const progress = (scrollTop / scrollableHeight) * 100;
      setScrollProgress(progress);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // keep in sync with prefers-color-scheme and any `dark` class toggles on <html>
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const onMq = (e) => setIsDarkMode(e.matches);
    if (mq && mq.addEventListener) mq.addEventListener('change', onMq);
    else if (mq && mq.addListener) mq.addListener(onMq);

    // observe html class changes (for tailwind 'dark' toggles)
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onMq);
      else if (mq && mq.removeListener) mq.removeListener(onMq);
      observer.disconnect();
    };
  }, []);
  

  useEffect(() => {
    fetch('/data/db.json')
      .then(response => response.json())
      .then(data => {
        setEventsData(data.data);
        if (data?.data?.events?.[eventYear]) {
          const yearData = data.data.events[eventYear];
          const foundEvent = yearData.find(event => event.id === eventId);
          setEvent(foundEvent || null);
        }
        if (data?.data?.sponsors) {
          setSponsors(data.data.sponsors); // Add sponsors to state
        }
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [eventYear, eventId]);

  const yearKeys = Object.keys(eventsData.events);
  // const key = yearKeys[1];
  const key = '2026-27'
  const eventsForCurrentYear = eventsData.events[key] || [];
  const yearHighlightKeys = Object.keys(eventsData.committee);
  const keyHighlight = eventsData.committee[key] ? key : (yearHighlightKeys[0] || ""); 
  const higlightForCurrentYear = eventsData.committee[keyHighlight] || []; 

  // Home-specific highlight (separate from committee)
  const homeHighlight = (eventsData.home && eventsData.home.highlight) ? eventsData.home.highlight : null;
  const pressArticle = (eventsData.home && eventsData.home.pressArticle) ? eventsData.home.pressArticle : null;
  const sponsorFallback = [
    { _id: 'alpha', name: 'AlphaTech Labs', logoUrl: '/event-images/placeholder.svg', tier: 'Diamond' },
    { _id: 'beta', name: 'Beta Systems', logoUrl: '/event-images/placeholder.svg', tier: 'Gold' },
    { _id: 'gamma', name: 'Gamma Cloud', logoUrl: '/event-images/placeholder.svg', tier: 'Gold' },
    { _id: 'delta', name: 'Delta Security', logoUrl: '/event-images/placeholder.svg', tier: 'Partner' },
    { _id: 'epsilon', name: 'Epsilon Robotics', logoUrl: '/event-images/placeholder.svg', tier: 'Partner' },
    { _id: 'zeta', name: 'Zeta Analytics', logoUrl: '/event-images/placeholder.svg', tier: 'Partner' },
    { _id: 'eta', name: 'Eta Quantum', logoUrl: '/event-images/placeholder.svg', tier: 'Partner' },
    { _id: 'theta', name: 'Theta CloudEdge', logoUrl: '/event-images/placeholder.svg', tier: 'Partner' }
  ];
  const sponsorsSafe = Array.isArray(sponsors) && sponsors.length ? sponsors : sponsorFallback;
  const featuredSponsors = sponsorsSafe.slice(0, 3);
  const marqueeSponsors = sponsorsSafe;
  

  const maxLength = 100; 
  const truncateDescription = (description) => {
    if (!description) return '';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const handleSpotlight = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });
  };

  const sectionHeadingClass = 'text-4xl md:text-5xl font-extrabold tracking-tight mb-4';
  const sectionSubtitleClass = 'mt-2 text-slate-600 dark:text-slate-300 text-base md:text-lg';
  const spotlightGradientClass = 'bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400';
  
  return (
    <div className="bg-transparent relative z-10 overflow-x-hidden">
      {/* Smooth Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 z-[9999] pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, #3b82f6, #60a5fa, #06b6d4)',
          transform: `scaleX(${scrollProgress / 100})`,
          transformOrigin: 'left',
          willChange: 'transform',
          boxShadow: scrollProgress > 0 ? '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3)' : 'none'
        }}
      />
      
      <TechBackground isDarkMode={isDarkMode} />
      {/* Full-page animated background (gradient + subtle floating particles) */}
      <style>{`
        .page-bg{ position:absolute; inset:0; z-index:-40; pointer-events:none; background-image: radial-gradient(circle at 10% 20%, rgba(14,165,233,0.06), transparent 10%), radial-gradient(circle at 80% 80%, rgba(99,102,241,0.05), transparent 12%), linear-gradient(120deg, rgba(14,165,233,0.02), rgba(99,102,241,0.02)); background-size: 200% 200%; animation: pageGradient 22s ease-in-out infinite; }
        @keyframes pageGradient{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

        .page-particles{ position:absolute; inset:0; z-index:-35; pointer-events:none; }
        .page-particles .particle{ position:absolute; width:8px; height:8px; border-radius:9999px; background: rgba(99,102,241,0.10); box-shadow: 0 6px 20px rgba(99,102,241,0.06); opacity:0.9; transform: translate3d(0,0,0); animation: particleFloat 9s ease-in-out infinite; }
        .page-particles .p1{ left:6%; top:18%; animation-delay:0s; transform-origin:center; }
        .page-particles .p2{ left:22%; top:72%; animation-delay:1.6s; width:6px; height:6px; background: rgba(14,165,233,0.08); }
        .page-particles .p3{ left:50%; top:8%; animation-delay:2.8s; transform:scale(1.2); }
        .page-particles .p4{ left:78%; top:32%; animation-delay:4.2s; }
        .page-particles .p5{ left:88%; top:80%; animation-delay:5.6s; width:5px; height:5px; background: rgba(96,165,250,0.06); }

        @keyframes particleFloat{ 0%{ transform: translateY(0) scale(1); opacity:0.85 } 50%{ transform: translateY(-20px) scale(1.08); opacity:1 } 100%{ transform: translateY(0) scale(1); opacity:0.85 } }
      `}</style>

      <div className="page-bg" />
      <div className="page-particles">
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
        <span className="particle p5" />
      </div>
      <div className="relative w-full h-[75vh] overflow-hidden">
        {/* Inject component-scoped styles for the animated background and blobs */}
        <style>{`
          .animated-gradient { background: linear-gradient(120deg,#0ea5e9,#7c3aed,#06b6d4,#fb7185); background-size: 400% 400%; animation: gradientBG 12s ease infinite; }
          @keyframes gradientBG { 0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%} }
          .float-blob { animation: floatY 6s ease-in-out infinite; transform-origin: center; }
          @keyframes floatY { 0%{ transform: translateY(0) } 50%{ transform: translateY(-18px) } 100%{ transform: translateY(0) } }
          .pulse-dot { animation: pulseDot 2.8s ease-in-out infinite; }
          @keyframes pulseDot{0%{opacity:0.45; transform:scale(0.88)}50%{opacity:1; transform:scale(1.18)}100%{opacity:0.45; transform:scale(0.88)}}
        `}</style>

        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0 animated-gradient filter brightness-90" />

        {/* Floating blurred SVG blobs for 'wow' effect */}
        <svg className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="fblur"><feGaussianBlur stdDeviation="40" result="b"/></filter>
          </defs>
          <g filter="url(#fblur)">
            <circle className="float-blob" cx="120" cy="140" r="120" fill="#7c3aed" fillOpacity="0.28" />
            <circle className="float-blob" style={{animationDelay: '1.2s'}} cx="640" cy="90" r="100" fill="#06b6d4" fillOpacity="0.22" />
            <circle className="float-blob" style={{animationDelay: '0.6s'}} cx="420" cy="260" r="140" fill="#fb7185" fillOpacity="0.12" />
          </g>
        </svg>

        {/* Subtle overlay to keep text readable */}
        <div className="absolute inset-0 bg-black/25 mix-blend-multiply z-10" />

        <div className="relative z-20 container mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl px-6">
            <div className="inline-block bg-white/8 text-gray-100 px-5 py-3 rounded-full font-medium tracking-tight mb-6 shadow-sm">
              One of the
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-2" data-aos="fade" data-aos-duration="900">
              Leading Platform for <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Student</span>
            </h1>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-6" data-aos="fade" data-aos-duration="900" data-aos-delay="200">
              Innovation & Activities
            </h2>

            <p className="mx-auto text-sm sm:text-base md:text-lg text-gray-200/90 leading-relaxed max-w-2xl mb-8" data-aos="fade" data-aos-duration="900" data-aos-delay="400">
              Our mission is to foster academic growth, skill development, and career advancement for all students across various disciplines.
            </p>

            <Link to="/events" className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-2xl transform transition duration-300 hover:-translate-y-1">
              Explore Events
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </div>
      </div>
        
        <div className="relative z-10 -mt-28" data-aos="fade-up" data-aos-duration="800" data-aos-delay="1000">
          <div className="py-6 md:py-10">
            <MembershipSection isDarkMode={isDarkMode} />
          </div>
        </div>

      <div className="pt-2 px-4  mb-8  md:pt-4 md:pb-2  bg-opacity-50 relative">
        {/* Decorative left-edge SVG (Recent Events) */}
      
      {/* Recent Events animations + card styles (UI-only) */}
      <style>{`
        /* Reveal animation for grid items */
        .reveal-up{opacity:0; transform:translateY(18px) scale(.995); animation:revealUp .64s cubic-bezier(.2,.9,.2,1) both;}
        @keyframes revealUp{to{opacity:1; transform:translateY(0) scale(1)}}

        /* Event card styling and hover effects */
        .event-card{ border-radius:12px; overflow:hidden; background:linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.82)); box-shadow:0 6px 18px rgba(2,6,23,0.06); transition:transform .32s ease, box-shadow .32s ease, filter .32s ease; }
        .dark .event-card{ background:linear-gradient(180deg, rgba(7,11,26,0.48), rgba(7,11,26,0.36)); box-shadow:0 10px 30px rgba(2,6,23,0.35); }
        .event-card:hover{ transform:translateY(-12px) scale(1.02); box-shadow:0 30px 60px rgba(2,6,23,0.35); filter:grayscale(0); }
        .event-card .card-inner{ padding:20px; display:flex; gap:16px; align-items:center; }
        .event-card .meta{ color:#64748b; font-size:0.95rem }
        .event-title{ color:#0ea5e9; font-weight:700; }

        /* small glowing accent under the section title in light mode */
        .recent-underline{ width:56px; height:4px; border-radius:6px; background:linear-gradient(90deg,#60a5fa,#3b82f6); box-shadow:0 6px 18px rgba(59,130,246,0.12); margin:10px auto 0 }

        /* CTA style */
        .events-cta{ position:relative; z-index:50; display:inline-flex; align-items:center; gap:12px; padding:12px 22px; min-width:220px; justify-content:center; border-radius:999px; background:linear-gradient(90deg,#2563eb,#60a5fa); color:white; font-weight:700; letter-spacing:0.12px; box-shadow:0 14px 40px rgba(59,130,246,0.18); transition:transform .28s ease, box-shadow .28s ease, opacity .18s ease; backdrop-filter: none; }
        .events-cta svg{ opacity:0.95 }
        .events-cta:hover{ transform:translateY(-6px) scale(1.02); box-shadow:0 36px 80px rgba(37,99,235,0.26); }
        .events-cta:active{ transform:translateY(-2px) scale(0.995) }
      `}</style>

      <div className="flex items-center justify-center">
        
        <h2 className={`${sectionHeadingClass} mx-4 text-center`}>
          <span className="text-gray-900 dark:text-white">Recent </span>
          <span className={spotlightGradientClass}>Events</span>
        </h2>
        
      </div>
      <div className="text-center px-4">
        <p className={`${sectionSubtitleClass} mx-auto max-w-4xl`}>
          We have proudly hosted numerous events. Here are some recent events organized by CSI!
        </p>
      </div>
      <div className="pt-10 md:pt-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {eventsForCurrentYear.slice(0, 4).map((event, index) => (
            <div key={index} className="reveal-up" style={{ animationDelay: `${index * 120}ms` }}>
              <div className="event-card">
                <div className="card-inner">
                  {/* Keep EventCard as content inside; it provides image/title/desc */}
                  <EventCard
                    title={event.title}
                    description={truncateDescription(event.description)}
                    date={event.date}
                    imageUrl={event.image}
                  />
                </div>
              </div>
            </div>
          ))}

        </div>
        {eventsForCurrentYear.length > 4 && ( 
        <div className="flex justify-center mt-8">
          <Link to="/events" className="events-cta">
            View All Events
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M13 5l7 7-7 7" stroke="rgba(255,255,255,0.95)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
        )}
      </div>
      {eventsForCurrentYear.length > 4 && (
          <div className="absolute bottom-0 left-0 right-0 h-2/6 bg-gradient-to-b from-transparent to-gray-200/25 pointer-events-none" />
        )}
    </div>

      {/* Press/News Article Section */}
      {pressArticle && pressArticle.image && (
        <PressSection pressArticle={pressArticle} isDarkMode={isDarkMode} />
      )}

      {/* Sponsors section temporarily disabled
      <style>{`
        @keyframes marqueeX { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      <section className="relative w-full py-12 sm:py-16" data-aos="fade-up" data-aos-duration="900">
        <div className="absolute inset-0 -z-10 opacity-[0.35] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,.08),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(99,102,241,.08),transparent_40%)]" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-2">Partners & Supporters</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Our Sponsors</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Powered by partners who believe in student innovation.</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white dark:from-slate-900 dark:to-slate-900 pointer-events-none" style={{ maskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 12%, black 88%, transparent 100%)' }} />
            <div className="flex gap-6 py-4 animate-[marqueeX_18s_linear_infinite]" aria-label="sponsor-marquee">
              {[...marqueeSponsors, ...marqueeSponsors].map((s, i) => (
                <div key={`${s._id || s.name || i}-${i}`} className="shrink-0 px-5 py-3 rounded-xl border border-slate-200/70 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img
                        src={s.logoUrl}
                        alt={s.name}
                        className="w-10 h-10 object-contain"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.src = '/event-images/placeholder.svg'; }}
                      />
                    </div>
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6"
            onMouseMove={handleSpotlight}
            style={{
              background: `radial-gradient(180px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(56,189,248,0.12), transparent 55%)`,
              transition: 'background 0.2s ease'
            }}
          >
            {featuredSponsors.map((s, idx) => {
              const span = idx === 0 ? 'md:col-span-3 md:row-span-2' : 'md:col-span-2';
              const tier = s.tier || (idx === 0 ? 'Diamond' : 'Gold');
              return (
                <div
                  key={s._id || s.name || idx}
                  className={`relative rounded-2xl p-5 bg-white/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-white/10 shadow-lg overflow-hidden group ${span}`}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-cyan-500/10 via-blue-500/8 to-purple-600/10" />
                  <div className="relative flex flex-col h-full gap-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/15 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-200">{tier}</span>
                      <span className="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Featured</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-dashed border-slate-200 dark:border-slate-700 overflow-hidden">
                      <img
                        src={s.logoUrl}
                        alt={s.name}
                        className="max-h-28 md:max-h-36 object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.src = '/event-images/placeholder.svg'; }}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{s.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">Innovation partner committed to supporting student-led tech.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="relative inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:border-cyan-500 hover:text-cyan-600 dark:hover:border-cyan-400 dark:hover:text-cyan-200 transition-all">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" /> Visit Website
                      </button>
                      <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
                      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Trusted Partner</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      */}

    
  {/* <div className="mt-12 mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden p-8">
    <div className="flex items-center justify-center">
      <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.226497 6L6 11.7735L11.7735 6L6 0.226497L0.226497 6ZM91 5H6V7H91V5Z" fill="#FFA2A2" />
      </svg>
      <p className="text-dt-blue dark:text-white text-3xl font-semibold capitalize tracking-wide mx-4 text-center">
        Our Sponsors
      </p>
      <svg width="91" height="12" viewBox="0 0 91 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M90.7735 6L85 0.226497L79.2265 6L85 11.7735L90.7735 6ZM0 7L85 7V5L0 5V7Z" fill="#FFA2A2" />
      </svg>
    </div> */}
    {/* Centered Sponsor Cards */}
    {/* <div className="mt-8 flex flex-wrap justify-center gap-8">
      {sponsors.map((sponsor) => (
        <SponsorCard key={sponsor.name} name={sponsor.name} logoUrl={sponsor.logoUrl} />
      ))}
    </div>
  </div> */}


    <div className="w-full -mt-4 "></div>
      <div className="py-4 px-4 sm:px-6 md:px-10 md:pt-8 mt-2 ">
        <div className="flex items-center justify-center" >
          
          <h2 className={`animate-fadeInFromTop ${sectionHeadingClass} mx-4`}>
            <span className="text-gray-900 dark:text-white">In the </span>
            <span className={spotlightGradientClass}>Highlights</span>
          </h2>
          
        </div>
        <div className="text-center px-4">
          <p className="mt-2 text-dt-blue dark:text-white text-lg font-semibold capitalize tracking-wide mx-auto max-w-4xl">
           
          </p>
        </div>
        <div className="md:pt-8 md:pb-20 flex items-center justify-center" data-aos="fade-up" data-aos-duration="1000">
          {homeHighlight ? (
            <BentoHighlights
              groupPhoto={homeHighlight.groupPhoto || homeHighlight.highlight}
              groupPhotos={homeHighlight.groupPhotos}
              attendees={homeHighlight.attendees}
              events={homeHighlight.events}
              nextEvent={homeHighlight.nextEvent}
              nextEventDate={homeHighlight.nextEventDate}
              quote={homeHighlight.quote}
              logoSrc={homeHighlight.logoSrc}
              isDarkMode={isDarkMode}
              nextEventLogo={homeHighlight.nextEventLogo}
            />
          ) : (
            higlightForCurrentYear.length > 0 && higlightForCurrentYear[0].highlight && (
              <BentoHighlights
                groupPhoto={higlightForCurrentYear[0].highlight}
                attendees={higlightForCurrentYear[0].attendees}
                events={higlightForCurrentYear[0].events}
                nextEvent={higlightForCurrentYear[0].nextEvent}
                nextEventDate={higlightForCurrentYear[0].nextEventDate}
                quote={higlightForCurrentYear[0].quote}
                logoSrc={higlightForCurrentYear[0].logoSrc}
                isDarkMode={isDarkMode}
                nextEventLogo={higlightForCurrentYear[0].nextEventLogo}
              />
            )
          )}
        </div>
      </div>
{/* //what is csi? old section */}
      {/* <div className="p-10 border-dashed border-2 border-dt-blue text-center dark:border-dashed dark:border-2 dark:border-lt-blue" >
        <p className="text-4xl italic font-bold text-opacity-80 dark:text-white">What is <span className="text-lt-blue dark:text-lt-blue">CSI?</span></p>
        <div className="flex flex-col gap-8 italic text-dt-blue dark:text-white" >
          <p className="pt-10">Formed in 1965, the CSI has been instrumental in guiding the Indian IT industry down the right path since its formative years. Today, CSI has 70 chapters all over India, 358 student branches, and more than 90,000 members, including India‚s most famous IT industry leaders, brilliant scientists and dedicated academicians. Now, you have the opportunity to be a part of this distinguished fraternity too. The mission of the CSI is to facilitate research, knowledge sharing, learning and career enhancement for all categories of IT professionals, while simultaneously inspiring and nurturing new entrants into the industry and helping them to integrate into the IT community. The CSI is also working closely with other industry associations, government bodies and academia to ensure that the benefits of IT advancement ultimately percolate down to every single citizen of India.</p>
        </div>
      </div> */}
{/* //what is csi? new updated section */}
      <div className="relative w-full max-w-6xl mx-auto my-12 px-4">
        
        {/* Section title */}
        <div className="relative z-20 text-center mb-6">
          
          <h2 className={sectionHeadingClass}>
          
            <span className="text-gray-900 dark:text-white">About </span>
            <span className={spotlightGradientClass}>CSI-WIET</span>
          </h2>
          

          <div className="mx-auto mt-3 w-24 h-1 bg-sky-600 dark:bg-sky-400 rounded" />
        </div>

        {/* Decorative subtle network background to match the screenshot (now animated) */}
        <style>{`
          .network-animate .node { animation: nodeFloat 6s ease-in-out infinite; transform-origin: center; }
          .network-animate .node.n1 { animation-delay: 0s; }
          .network-animate .node.n2 { animation-delay: 1.2s; }
          .network-animate .node.n3 { animation-delay: 0.6s; }
          @keyframes nodeFloat { 0%{ transform: translateY(0) } 50%{ transform: translateY(-8px) } 100%{ transform: translateY(0) } }

          .network-animate .path { stroke-dasharray: 200; stroke-dashoffset: 200; animation: dash 6s linear infinite; opacity:0.9; }
          .network-animate .path.p1 { animation-delay: 0s; }
          .network-animate .path.p2 { animation-delay: 0.9s; }
          .network-animate .path.p3 { animation-delay: 1.8s; }
          @keyframes dash { 0% { stroke-dashoffset: 200; opacity:0.45 } 50% { stroke-dashoffset: 0; opacity:1 } 100% { stroke-dashoffset: -200; opacity:0.45 } }

          .network-rotate { animation: rotateNet 40s linear infinite; transform-origin: 50% 50%; }
          @keyframes rotateNet { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
        `}</style>

        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none -z-10 network-animate network-rotate" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <g stroke="url(#g1)" strokeWidth="1" strokeOpacity="0.9" fill="none">
            <path className="path p1" d="M120 80 L240 40 L360 120" />
            <path className="path p2" d="M300 220 L420 160 L540 240" />
            <path className="path p3" d="M700 60 L820 140 L940 60" />
            <circle className="node n1" cx="240" cy="40" r="2" />
            <circle className="node n2" cx="420" cy="160" r="2" />
            <circle className="node n3" cx="820" cy="140" r="2" />
          </g>
        </svg>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top three feature cards with blue accents + gradient glow */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-sky-200 via-indigo-200 to-sky-200 opacity-30 blur-3xl hidden dark:block" />
            <div className="relative col-span-1 bg-white/80 dark:bg-black/60 border border-gray-100/6 dark:border-white/6 rounded-xl p-6 shadow-sm backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-rose-400" xmlns="http://www.w3.org/2000/svg"><path d="M16 11C17.6569 11 19 9.65685 19 8C19 6.34315 17.6569 5 16 5C14.3431 5 13 6.34315 13 8C13 9.65685 14.3431 11 16 11Z" stroke="currentColor" strokeWidth="1.2"/><path d="M8 11C9.65685 11 11 9.65685 11 8C11 6.34315 9.65685 5 8 5C6.34315 5 5 6.34315 5 8C5 9.65685 6.34315 11 8 11Z" stroke="currentColor" strokeWidth="1.2"/><path d="M2 19C2 15.6863 4.68629 13 8 13H14C17.3137 13 20 15.6863 20 19" stroke="currentColor" strokeWidth="1.2"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sky-600 dark:text-sky-400 text-gray-900 dark:text-white">Student Community</h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">A vibrant community of tech enthusiasts fostering growth and innovation.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-sky-200 via-indigo-200 to-sky-200 opacity-30 blur-3xl hidden dark:block" />
            <div className="relative col-span-1 bg-white/80 dark:bg-black/60 border border-gray-100/6 dark:border-white/6 rounded-xl p-6 shadow-sm backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-sky-300" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L19 8L12 14L5 8L12 2Z" stroke="currentColor" strokeWidth="1.2"/><path d="M12 14V22" stroke="currentColor" strokeWidth="1.2"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sky-600 dark:text-sky-400 text-gray-900 dark:text-white">Learning Beyond Curriculum</h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Workshops, seminars, and hands-on sessions that go beyond traditional education.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-sky-200 via-indigo-200 to-sky-200 opacity-30 blur-3xl hidden dark:block" />
            <div className="relative col-span-1 bg-white/80 dark:bg-black/60 border border-gray-100/6 dark:border-white/6 rounded-xl p-6 shadow-sm backdrop-blur-sm hover:-translate-y-1 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white/6">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-yellow-300" xmlns="http://www.w3.org/2000/svg"><path d="M2 12L10 20L22 6" stroke="currentColor" strokeWidth="1.2"/></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-sky-600 dark:text-sky-400 text-gray-900 dark:text-white">Industry Connect</h3>
                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Regular interactions with industry professionals and real-world exposure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="relative lg:col-span-2">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-sky-100 to-indigo-100 opacity-40 blur-3xl -z-10 hidden dark:block" />
            <div className="relative bg-white/80 dark:bg-black/60 border border-gray-100/6 dark:border-white/6 rounded-xl p-8 shadow-sm backdrop-blur-sm hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <span className="inline-block w-10 h-1 bg-sky-600 dark:bg-sky-400 rounded" />
                <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Mission</h4>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">To create a platform where students can explore, learn, and grow beyond their academic curriculum. We organize workshops, events, and seminars that bridge the gap between theoretical knowledge and practical application.</p>
            </div>
          </div>

          <div className="relative lg:col-span-1">
            <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-sky-100 to-indigo-100 opacity-40 blur-3xl -z-10 hidden dark:block" />
            <div className="relative bg-white/80 dark:bg-black/60 border border-gray-100/6 dark:border-white/6 rounded-xl p-6 shadow-sm backdrop-blur-sm flex flex-col justify-center hover:shadow-2xl transition-shadow">
              <div className="flex items-start gap-4">
                <div className="border-l-4 border-sky-600 dark:border-sky-400 pl-4">
                  <p className="italic text-gray-900 dark:text-gray-200">“We encourage our members to take initiative, organize events, and develop crucial management and leadership skills that will serve them throughout their careers.”</p>
                  <p className="mt-4 text-sm text-gray-700 dark:text-gray-400">— CSI-WIET</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


{/* // old Map section*/}
      {/* <div className="mt-12 mb-12 flex flex-col lg:flex-row bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden p-4">
        <div className="lg:w-2/3" >
          <iframe width="100%" height="100%" title="map" src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=(Watumull%20Institute%20Of%20Electronic%20Engineering%20And%20Computer%20Technology)&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed" style={{ filter: "grayscale(0.1) contrast(1.2)"}}></iframe>
        </div>
        <hr className="my-4 border-gray-300" />
        <div className="lg:w-1/3 p-4 flex flex-col justify-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reach Out to Us</h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">We would love to hear from you!</p>
          <ul className="flex space-x-4 mb-4">
            <li className="flex items-center">
              <Link to="https://www.instagram.com/csi_wiet/?igsh=MWlocGdtZXozcmMyNg%3D%3D" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#E1306C]">
                <svg className="w-6 h-6 text-gray-800 dark:text-white hover:text-current hover:dark:text-current" width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 8.83447C10.7062 8.83447 8.83437 10.7063 8.83437 13.0001C8.83437 15.2938 10.7062 17.1657 13 17.1657C15.2937 17.1657 17.1656 15.2938 17.1656 13.0001C17.1656 10.7063 15.2937 8.83447 13 8.83447ZM25.4937 13.0001C25.4937 11.2751 25.5094 9.56572 25.4125 7.84385C25.3156 5.84385 24.8594 4.06885 23.3969 2.60635C21.9312 1.14072 20.1594 0.687599 18.1594 0.590724C16.4344 0.493849 14.725 0.509474 13.0031 0.509474C11.2781 0.509474 9.56875 0.493849 7.84687 0.590724C5.84687 0.687599 4.07187 1.14385 2.60937 2.60635C1.14375 4.07197 0.690621 5.84385 0.593746 7.84385C0.496871 9.56885 0.512496 11.2782 0.512496 13.0001C0.512496 14.722 0.496871 16.4345 0.593746 18.1563C0.690621 20.1563 1.14687 21.9313 2.60937 23.3938C4.075 24.8595 5.84687 25.3126 7.84687 25.4095C9.57187 25.5063 11.2812 25.4907 13.0031 25.4907C14.7281 25.4907 16.4375 25.5063 18.1594 25.4095C20.1594 25.3126 21.9344 24.8563 23.3969 23.3938C24.8625 21.9282 25.3156 20.1563 25.4125 18.1563C25.5125 16.4345 25.4937 14.7251 25.4937 13.0001ZM13 19.4095C9.45312 19.4095 6.59062 16.547 6.59062 13.0001C6.59062 9.45322 9.45312 6.59072 13 6.59072C16.5469 6.59072 19.4094 9.45322 19.4094 13.0001C19.4094 16.547 16.5469 19.4095 13 19.4095ZM19.6719 7.8251C18.8437 7.8251 18.175 7.15635 18.175 6.32822C18.175 5.5001 18.8437 4.83135 19.6719 4.83135C20.5 4.83135 21.1687 5.5001 21.1687 6.32822C21.169 6.52487 21.1304 6.71962 21.0553 6.90135C20.9802 7.08307 20.8699 7.24818 20.7309 7.38723C20.5918 7.52627 20.4267 7.63652 20.245 7.71166C20.0633 7.7868 19.8685 7.82535 19.6719 7.8251Z" fill="currentColor"/>
                </svg>
              </Link>
            </li>
            <li className="flex items-center">
              <Link to="/" className="hover:text-[#1877F2]">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="w-6 h-6 text-gray-800 dark:text-white hover:text-current hover:dark:text-current" width="24" height="24" viewBox="0 0 50 50">
                  <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M37,19h-2c-2.14,0-3,0.5-3,2 v3h5l-1,5h-4v15h-5V29h-4v-5h4v-3c0-4,2-7,6-7c2.9,0,4,1,4,1V19z" fill="currentColor"></path>
                </svg>
              </Link>
            </li>
            <li className="flex items-center">
              <Link to="/" className="hover:text-[#1DA1F2]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-800 dark:text-white hover:text-current hover:dark:text-current" width="24" height="24" fillRule="evenodd" clipRule="evenodd" viewBox="0 0 640 640">
                  <path d="M579.999 0H60C27 0 0 27 0 60v520c0 33 27 60 60 60h519.999c33 0 60-27 60-60V60c0-33-27-60-60-60zm-59.942 195.935a161.34 161.34 0 0 1-47.079 12.85c16.914-10.086 29.894-26.22 36.095-45.413-15.862 9.39-33.473 16.287-52.087 19.96-15.048-15.92-36.343-25.83-59.942-25.83-45.331 0-82.04 36.685-82.04 82.016 0 6.355.685 12.626 2.09 18.674-68.186-3.484-128.647-36.13-169.148-85.785a82.08 82.08 0 0 0-11.126 41.245c0 28.465 14.457 53.623 36.485 68.257-13.465-.39-26.068-4.11-37.206-10.205v1.04c0 39.756 28.3 72.969 65.86 80.48a82.817 82.817 0 0 1-21.627 2.883c-5.291 0-10.405-.52-15.472-1.477 10.453 32.587 40.713 56.351 76.642 57-28.134 22.04-63.473 35.163-101.954 35.163-6.65 0-13.134-.39-19.606-1.146 36.39 23.362 79.524 36.85 125.872 36.85 150.935 0 233.507-125.056 233.507-233.494 0-3.603-.06-7.122-.236-10.654 16.027-11.457 29.965-25.937 40.925-42.378l.048-.036z" fill="currentColor"/>
                </svg>
              </Link>
            </li>
            <li className="flex items-center">
              <Link to="/" className="hover:text-[#FF0000]">
                <svg className="w-6 h-6 text-gray-800 dark:text-white hover:text-current hover:dark:text-current" width="24" height="24" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.3253 0.333252C15.0373 0.337252 16.8187 0.354585 18.712 0.430585L19.384 0.459918C21.2893 0.549252 23.1933 0.703919 24.1387 0.966585C25.3987 1.32125 26.388 2.35325 26.7227 3.66259C27.256 5.74259 27.3227 9.79859 27.3307 10.7813L27.332 10.9839V11.2159C27.3227 12.1986 27.256 16.2559 26.7227 18.3346C26.384 19.6479 25.3933 20.6813 24.1387 21.0306C23.1933 21.2933 21.2893 21.4479 19.384 21.5373L18.712 21.5679C16.8187 21.6426 15.0373 21.6613 14.3253 21.6639L14.012 21.6653H13.672C12.1653 21.6559 5.86399 21.5879 3.85866 21.0306C2.59999 20.6759 1.60932 19.6439 1.27466 18.3346C0.741323 16.2546 0.674656 12.1986 0.666656 11.2159V10.7813C0.674656 9.79859 0.741323 5.74125 1.27466 3.66259C1.61332 2.34925 2.60399 1.31592 3.85999 0.967918C5.86399 0.409252 12.1667 0.341252 13.6733 0.333252H14.3253ZM11.332 6.33325V15.6666L19.332 10.9999L11.332 6.33325Z" fill="currentColor"/>
                </svg>
              </Link>
            </li>
          </ul>
          <svg width="419" height="2" viewBox="0 0 419 2" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 1H418.5" stroke="black" strokeOpacity="0.15"/>
          </svg>
          <ul className="space-y-2 mt-4">
            <li className="flex items-center">
              <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" width="24" height="24" viewBox="0 0 30 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M25 1H5.00001C3.15906 1 1.66667 2.49238 1.66667 4.33333V17.6667C1.66667 19.5076 3.15906 21 5.00001 21H25C26.841 21 28.3333 19.5076 28.3333 17.6667V4.33333C28.3333 2.49238 26.841 1 25 1Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M1.66667 6L13.51 11.9217C13.9727 12.1529 14.4828 12.2732 15 12.2732C15.5172 12.2732 16.0273 12.1529 16.49 11.9217L28.3333 6" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <a href="mailto:principal@watumull.edu" className="text-gray-700 dark:text-gray-300">principal@watumull.edu</a>
            </li>
            <li className="flex items-center">
              <svg className="w-6 h-6 text-gray-800 dark:text-white mr-2" width="24" height="24" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.23634 1.30311C6.10848 -0.558263 9.19129 -0.227522 10.7589 1.86768L12.7002 4.45823C13.977 6.16269 13.8632 8.54403 12.3479 10.0501L11.9818 10.4162C11.9405 10.5699 11.9363 10.7312 11.9695 10.8869C12.0664 11.5145 12.591 12.8437 14.7877 15.0281C16.9845 17.2125 18.3228 17.7355 18.9597 17.834C19.12 17.8681 19.2861 17.8633 19.4443 17.8201L20.0719 17.1956C21.4195 15.8572 23.487 15.6065 25.1545 16.5126L28.0927 18.1124C30.611 19.4785 31.2463 22.8997 29.185 24.9503L26.999 27.1224C26.3098 27.807 25.3837 28.3777 24.2546 28.4838C21.4702 28.7438 14.9831 28.4115 8.16369 21.6321C1.79963 15.3034 0.578192 9.78392 0.422821 7.06416C0.345904 5.68889 0.995079 4.52591 1.8227 3.70445L4.23634 1.30311ZM8.91286 3.25064C8.13292 2.20919 6.68074 2.12612 5.86235 2.9399L3.44717 5.33969C2.93953 5.84426 2.69647 6.40114 2.72724 6.9334C2.8503 9.09475 3.83483 14.0743 9.79124 19.9969C16.0399 26.2087 21.8102 26.3948 24.0408 26.1856C24.4961 26.144 24.9484 25.9071 25.3714 25.4872L27.5559 23.3135C28.445 22.4305 28.2496 20.8214 26.9913 20.1384L24.0531 18.5401C23.2408 18.1001 22.2902 18.2447 21.6994 18.8324L20.9995 19.5292L20.1842 18.:100 19.7219 20.0195C20.9995 20.8365 20.998 20.838 20.9964 20.838L20.9949 20.8408L20.9903 20.8445L20.9795 20.8527L20.9564 20.8722C20.891 20.9314 20.8211 20.984 20.7472 21.0305C20.6242 21.1096 20.4611 21.196 20.2565 21.268C19.8411 21.4185 19.2904 21.4942 18.6105 21.3833C17.2767 21.1717 15.5092 20.2494 13.1602 17.9013C10.8127 15.5533 9.89585 13.7881 9.68971 12.4603C9.58357 11.7742 9.66818 11.2207 9.82509 10.8005C9.9121 10.5617 10.0357 10.3386 10.1912 10.1399L10.2404 10.0863L10.262 10.0628L10.2712 10.0536L10.2758 10.0485L10.2789 10.0452L10.7219 9.61025C11.3803 8.96395 11.4726 7.88718 10.8527 7.06509L8.91286 4.54829Z" fill="currentColor"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">02512567670</span>
            </li>
            <li className="flex items-center">
              <svg className="text-gray-800 dark:text-white mr-2" width="35" height="45" viewBox="0 0 26 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 1.75C6.78906 1.75 1.75 6.54609 1.75 12.4531C1.75 19.25 9.25 30.0211 12.0039 33.7414C12.1182 33.8985 12.268 34.0262 12.4412 34.1144C12.6143 34.2025 12.8058 34.2484 13 34.2484C13.1942 34.2484 13.3857 34.2025 13.5588 34.1144C13.732 34.0262 13.8818 33.8985 13.9961 33.7414C16.75 30.0227 24.25 19.2555 24.25 12.4531C24.25 6.54609 19.2109 1.75 13 1.75Z" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 16.75C15.0711 16.75 16.75 15.0711 16.75 13C16.75 10.9289 15.0711 9.25 13 9.25C10.9289 9.25 9.25 10.9289 9.25 13C9.25 15.0711 10.9289 16.75 13 16.75Z" stroke="currentColor" strokeWidth="1.875" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                Plot No.157, C.H.M Campus, Opp. Ulhasnagar Railway Station, Ulhasnagar-421003.
              </span>
            </li>
          </ul>
        </div>
      </div> */}

{/* //new map updated section */}
      <div className="relative w-full max-w-6xl mx-auto my-12 lg:my-24 font-sans antialiased px-4">
        {/* Background Map - full width and stylized */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
          <iframe
            width="100%"
            height="100%"
            title="map"
            src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=(Watumull%20Institute%20Of%20Electronic%20Engineering%20And%20Computer%20Technology)&amp;ie=UTF8&amp;t=&amp;z=15&amp;iwloc=B&amp;output=embed"
            className="w-full h-full border-0 filter contrast-125 brightness-110"
            loading="lazy"
          />
        </div>

        {/* Old floating glass contact block removed — using ContactTechGrid below */}
    </div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
      {/* Fun Zone / Break Room */}
      <div className="mb-8">
        <CodeSprintGame />
      </div>

      <ContactTechGrid isDarkMode={isDarkMode} />
    </div>

    </div>
  )
}



// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';

// // Assets
// import MembershipPoster from '../assets/Membership.png';
// import bgVideo from '../assets/background.mp4';

// // Components
// import { EventCard } from '../components';
// import { SponsorCard } from '../components/Sponsors';

// // --- Helper Component for Social Icons (for cleaner code) ---
// const SocialLink = ({ to, hoverColor, children }) => (
//   <Link
//     to={to}
//     target="_blank"
//     rel="noopener noreferrer"
//     className={`text-gray-400 transition-colors duration-300 ${hoverColor}`}
//   >
//     {children}
//   </Link>
// );


// export const HomePage = () => {
//   const { eventYear, eventId } = useParams();
//   const [event, setEvent] = useState(null);
//   const [eventsData, setEventsData] = useState({ events: {}, committee: {} });
//   const [sponsors, setSponsors] = useState([]);

//   // --- LOGIC (UNCHANGED) ---
//   useEffect(() => {
//     fetch('/data/db.json')
//       .then(response => response.json())
//       .then(data => {
//         setEventsData(data.data);
//         if (data?.data?.events?.[eventYear]) {
//           const yearData = data.data.events[eventYear];
//           const foundEvent = yearData.find(event => event.id === eventId);
//           setEvent(foundEvent || null);
//         }
//         if (data?.data?.sponsors) {
//           setSponsors(data.data.sponsors);
//         }
//       })
//       .catch(error => console.error("Error fetching data:", error));
//   }, [eventYear, eventId]);

//   const yearKeys = Object.keys(eventsData.events);
//   const key = yearKeys[1];
//   const eventsForCurrentYear = eventsData.events[key] || [];
//   const yearHighlightKeys = Object.keys(eventsData.committee);
//   const keyHighlight = yearHighlightKeys[0] || "";
//   const higlightForCurrentYear = eventsData.committee[keyHighlight] || [];

//   const maxLength = 100;
//   const truncateDescription = (description) => {
//     if (!description) return '';
//     if (description.length <= maxLength) return description;
//     return description.substring(0, maxLength) + '...';
//   };
//   // --- END OF LOGIC ---

//   return (
//     <div className="bg-slate-900 text-white">
//       {/* ========== Hero Section ========== */}
//       <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center text-center overflow-hidden">
//         <video
//           className="absolute top-0 left-0 w-full h-full object-cover z-0"
//           autoPlay
//           loop
//           muted
//           playsInline
//         >
//           <source src={bgVideo} type="video/mp4" />
//         </video>
//         <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10"></div>
//         <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
//           <h1
//             className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white"
//             data-aos="fade-down"
//             data-aos-duration="1000"
//           >
//             A Leading Platform for <br />
//             <span className="text-indigo-400">Student Innovation</span>
//           </h1>
//           <p
//             className="mt-6 max-w-2xl text-lg sm:text-xl text-slate-300"
//             data-aos="fade-up"
//             data-aos-duration="1000"
//             data-aos-delay="500"
//           >
//             Our mission is to foster academic growth, skill development, and career advancement for all students across various disciplines.
//           </p>
//           <Link
//             to="/events"
//             className="mt-8 inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
//             data-aos="fade-up"
//             data-aos-duration="1000"
//             data-aos-delay="1000"
//           >
//             Explore Events
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
//             </svg>
//           </Link>
//         </div>
//       </section>

//       {/* ========== Membership Drive Section ========== */}
//       <section className="py-20 sm:py-24 bg-slate-800">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
//             <div data-aos="fade-right">
//               <h2 className="text-base font-semibold tracking-wider text-indigo-400 uppercase">
//                 Membership Drive
//               </h2>
//               <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
//                 Unlock Your Potential
//               </p>
//               <p className="mt-4 text-lg text-slate-300">
//                 CSI-WIET opens doors to a world of learning and connections. Dive into exclusive webinars, workshops, and industrial visits. Hone your coding skills with Coders Club and connect with fellow tech enthusiasts.
//               </p>
//               <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start">
//                   <div className="bg-slate-700/50 rounded-lg p-4">
//                       <p className="text-slate-200">Date: Till 30th of April, 2024</p>
//                   </div>
//                   <Link
//                       to="https://tally.so/r/3qPdP8"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300"
//                   >
//                       Register Now 📌
//                   </Link>
//               </div>
//             </div>
//             <div className="relative flex justify-center" data-aos="fade-left" data-aos-delay="200">
//               <div className="relative w-full max-w-sm">
//                 <div className="absolute -top-4 -left-4 w-full h-full bg-indigo-500 rounded-lg transform rotate-[-3deg]"></div>
//                 <img
//                   src={MembershipPoster}
//                   className="relative w-full rounded-lg shadow-xl"
//                   alt="Membership Drive Poster"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ========== Recent Events Section ========== */}
//       <section className="py-20 sm:py-24">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-base font-semibold tracking-wider text-indigo-400 uppercase">Our Activities</h2>
//             <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Recent Events</p>
//             <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
//               We have proudly hosted numerous events. Here are some recently organized by CSI!
//             </p>
//           </div>
//           <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
//             {eventsForCurrentYear.slice(0, 4).map((event, index) => (
//               <EventCard
//                 key={index}
//                 title={event.title}
//                 description={truncateDescription(event.description)}
//                 date={event.date}
//                 imageUrl={event.image}
//               />
//             ))}
//           </div>
//           {eventsForCurrentYear.length > 4 && (
//             <div className="mt-16 text-center">
//               <Link
//                 to="/events"
//                 className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-300 bg-indigo-900/50 hover:bg-indigo-800/50 transition-colors duration-300"
//               >
//                 View More Events
//               </Link>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* ========== Our Sponsors Section ========== */}
//       <section className="py-20 sm:py-24 bg-slate-950">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="text-center">
//                   <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Our Valued Sponsors</h2>
//                   <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
//                       We are grateful for the support from our partners who help make our events possible.
//                   </p>
//               </div>
//               <div className="mt-16 flex flex-wrap justify-center items-center gap-x-8 gap-y-12">
//                   {sponsors.map((sponsor) => (
//                       <div key={sponsor.name} className="grayscale hover:grayscale-0 transition-all duration-300" data-aos="fade-up">
//                           <SponsorCard name={sponsor.name} logoUrl={sponsor.logoUrl} />
//                       </div>
//                   ))}
//               </div>
//           </div>
//       </section>
      
//       {/* ========== Highlights Section ========== */}
//       <section className="py-20 sm:py-24">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-base font-semibold tracking-wider text-indigo-400 uppercase">Yearly Highlight</h2>
//             <p className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">A Glimpse of Our Journey</p>
//           </div>
//           <div className="mt-16 flex items-center justify-center" data-aos="zoom-in-up" data-aos-duration="1000">
//             {higlightForCurrentYear.length > 0 && higlightForCurrentYear[0].highlight && (
//               <img src={higlightForCurrentYear[0].highlight} alt="Highlight" className="max-w-5xl w-full h-auto object-cover rounded-xl shadow-2xl" />
//             )}
//           </div>
//         </div>
//       </section>

//       {/* ========== What is CSI? Section ========== */}
//       <section className="py-20 sm:py-24 bg-slate-800">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
//             <div className="lg:col-span-1" data-aos="fade-right">
//               <h2 className="text-3xl font-bold text-white">
//                 What is <span className="text-indigo-400">CSI?</span>
//               </h2>
//             </div>
//             <div className="lg:col-span-2 text-slate-300 text-lg space-y-4" data-aos="fade-left">
//               <p>Formed in 1965, the CSI has been instrumental in guiding the Indian IT industry. Today, CSI has 70 chapters all over India, 358 student branches, and more than 90,000 members, including India’s most famous IT industry leaders, brilliant scientists and dedicated academicians.</p>
//               <p>The mission of the CSI is to facilitate research, knowledge sharing, and career enhancement for all IT professionals, while inspiring and nurturing new entrants into the industry.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ========== Contact and Map Section ========== */}
//       <section className="bg-slate-900">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
//           <div className="flex flex-col lg:flex-row bg-slate-800 rounded-lg shadow-lg overflow-hidden">
//             <div className="lg:w-3/5 h-80 lg:h-auto">
//               {/* NOTE: Using a valid Google Maps embed URL */}
//               <iframe
//                 width="100%"
//                 height="100%"
//                 title="map"
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.490740924044!2d73.15197821538355!3d19.17369325324203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7955c56784d1d%3A0x63eb674846e305f!2sCHM%20College!5e0!3m2!1sen!2sin!4v1663248358241!5m2!1sen!2sin"
//                 style={{ filter: "grayscale(1) contrast(1.2) opacity(0.8)" }}
//               ></iframe>
//             </div>
//             <div className="lg:w-2/5 p-8 sm:p-10 flex flex-col justify-center">
//               <h2 className="text-2xl font-bold text-white mb-2">Reach Out to Us</h2>
//               <p className="text-slate-400 mb-6">We would love to hear from you!</p>

//               <div className="flex space-x-6 mb-6">
//                 <SocialLink to="https://www.instagram.com/csi_wiet/?igsh=MWlocGdtZXozcmMyNg%3D%3D" hoverColor="hover:text-[#E1306C]">
//                     <svg className="w-7 h-7" viewBox="0 0 26 26" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13 8.83447C10.7062 8.83447 8.83437 10.7063 8.83437 13.0001C8.83437 15.2938 10.7062 17.1657 13 17.1657C15.2937 17.1657 17.1656 15.2938 17.1656 13.0001C17.1656 10.7063 15.2937 8.83447 13 8.83447ZM25.4937 13.0001C25.4937 11.2751 25.5094 9.56572 25.4125 7.84385C25.3156 5.84385 24.8594 4.06885 23.3969 2.60635C21.9312 1.14072 20.1594 0.687599 18.1594 0.590724C16.4344 0.493849 14.725 0.509474 13.0031 0.509474C11.2781 0.509474 9.56875 0.493849 7.84687 0.590724C5.84687 0.687599 4.07187 1.14385 2.60937 2.60635C1.14375 4.07197 0.690621 5.84385 0.593746 7.84385C0.496871 9.56885 0.512496 11.2782 0.512496 13.0001C0.512496 14.722 0.496871 16.4345 0.593746 18.1563C0.690621 20.1563 1.14687 21.9313 2.60937 23.3938C4.075 24.8595 5.84687 25.3126 7.84687 25.4095C9.57187 25.5063 11.2812 25.4907 13.0031 25.4907C14.7281 25.4907 16.4375 25.5063 18.1594 25.4095C20.1594 25.3126 21.9344 24.8563 23.3969 23.3938C24.8625 21.9282 25.3156 20.1563 25.4125 18.1563C25.5125 16.4345 25.4937 14.7251 25.4937 13.0001ZM13 19.4095C9.45312 19.4095 6.59062 16.547 6.59062 13.0001C6.59062 9.45322 9.45312 6.59072 13 6.59072C16.5469 6.59072 19.4094 9.45322 19.4094 13.0001C19.4094 16.547 16.5469 19.4095 13 19.4095ZM19.6719 7.8251C18.8437 7.8251 18.175 7.15635 18.175 6.32822C18.175 5.5001 18.8437 4.83135 19.6719 4.83135C20.5 4.83135 21.1687 5.5001 21.1687 6.32822C21.169 6.52487 21.1304 6.71962 21.0553 6.90135C20.9802 7.08307 20.8699 7.24818 20.7309 7.38723C20.5918 7.52627 20.4267 7.63652 20.245 7.71166C20.0633 7.7868 19.8685 7.82535 19.6719 7.8251Z" /></svg>
//                 </SocialLink>
//                 {/* Add other social links as needed */}
//               </div>

//               <div className="border-t border-slate-700 my-2"></div>
              
//               <ul className="space-y-4 mt-6 text-slate-300">
//                 <li className="flex items-center gap-4">
//                   <svg className="w-6 h-6 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
//                   <a href="mailto:principal@watumull.edu" className="hover:text-indigo-300">principal@watumull.edu</a>
//                 </li>
//                 <li className="flex items-center gap-4">
//                   <svg className="w-6 h-6 text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
//                   <span className="hover:text-indigo-300">0251-2567670</span>
//                 </li>
//                 <li className="flex items-start gap-4">
//                   <svg className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
//                   <span>
//                     Plot No.157, C.H.M Campus, Opp. Ulhasnagar Railway Station, Ulhasnagar-421003.
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };