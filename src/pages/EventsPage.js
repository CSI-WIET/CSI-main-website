import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three'
import { useSearchParams } from 'react-router-dom';
import { useHtmlDark } from '../hooks/useHtmlDark'
import { EventPoster } from '../components';

const VALID_EVENT_YEARS = ['2023-24', '2024-25', '2025-26', '2026-27'];

export const EventsPage = () => {
  const [searchParams] = useSearchParams();
  const yearFromUrl = searchParams.get('year');
  const initialYear = VALID_EVENT_YEARS.includes(yearFromUrl) ? yearFromUrl : '2026-27';
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [eventsData, setEventsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useHtmlDark()

  // Fetch data from db.json
  useEffect(() => {
    setIsLoading(true);
    fetch('/data/db.json')
      .then((response) => response.json())
      .then((data) => {
          setEventsData(data?.data || {});
          console.log('Fetched events data:', data);
          setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);

  // --- Starfield background (UI-only) ---
  const starRef = useRef(null)
  useEffect(() => {
    const mount = starRef.current
    if (!mount) return

    // Use visualViewport for accurate mobile sizing when available
    const vv = window.visualViewport
    const width = Math.max(mount.clientWidth, vv ? Math.floor(vv.width) : window.innerWidth)
    const height = Math.max(mount.clientHeight, vv ? Math.floor(vv.height) : window.innerHeight)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    // Clamp DPR on mobile to avoid excessive fill-rate
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2))
    // render to a full-screen canvas; transparent background so blending works
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    // set consistent fullscreen canvas styling and append to the page-mounted ref
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    // Use viewport units to correctly handle mobile browser UI
    renderer.domElement.style.width = '100vw'
    renderer.domElement.style.height = '100dvh'
    renderer.domElement.style.pointerEvents = 'none'
    // ensure the canvas sits behind the page content (page content uses z-10)
    renderer.domElement.style.zIndex = '0'
    // Avoid using CSS blending values or appending to document.body (these caused issues
    // in some environments). Always attach to the component mount so React owns the node.
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(65, width / height, 1, 3000)
    // Slightly adjust camera distance on small screens to keep composition centered
    camera.position.z = width < 480 ? 950 : 800

    const group = new THREE.Group()
    scene.add(group)

    const createLayer = (count, size, colorHex, opacity, spread, blending) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread
        positions[i * 3 + 1] = (Math.random() - 0.5) * spread
        positions[i * 3 + 2] = -Math.random() * (spread * 0.9)
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const material = new THREE.PointsMaterial({ color: colorHex, size, transparent: true, opacity, depthWrite: false, blending: blending })
      const points = new THREE.Points(geometry, material)
      return { points, geometry, material }
    }

    // Electric-blue palette for light mode to increase visibility on white backgrounds
    const smallColor = isDark ? 0x7ef6ff : 0x00e5ff // bright electric cyan
    const bigColor = isDark ? 0x2fe8ff : 0x00b4ff // deeper electric blue

    // Use additive blending for stars (safe across three.js versions)
    const blendingMode = THREE.AdditiveBlending
    // Increase sizes/opacities for light mode so stars remain visible over white backgrounds
    // Slightly stronger glow/opacity for light mode so stars remain visible on white
    const densityScale = width < 480 ? 0.7 : width < 768 ? 0.85 : 1
    const spreadScale = width < 480 ? 0.85 : width < 768 ? 0.92 : 1
    const small = createLayer(Math.floor((isDark ? 1400 : 1300) * densityScale), isDark ? 0.9 : 1.8, smallColor, isDark ? 0.95 : 0.98, Math.floor(2200 * spreadScale), blendingMode)
    const medium = createLayer(Math.floor((isDark ? 500 : 480) * densityScale), isDark ? 1.6 : 3.0, bigColor, isDark ? 0.9 : 0.98, Math.floor(1600 * spreadScale), blendingMode)
    // Slightly stronger, cool glow in light mode for holographic effect
    const glow = createLayer(Math.floor((isDark ? 120 : 140) * densityScale), isDark ? 3.2 : 6.0, isDark ? 0x8ffbff : 0x00f0ff, isDark ? 0.08 : 0.55, Math.floor(1200 * spreadScale), blendingMode)

    group.add(small.points)
    group.add(medium.points)
    group.add(glow.points)

    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const onPointer = (e) => {
      const rect = mount.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointer)

    let raf = null
    const animate = () => {
      targetX += (mouseX - targetX) * 0.05
      targetY += (mouseY - targetY) * 0.05
      group.rotation.y = targetX * 0.12
      group.rotation.x = targetY * 0.08
      small.points.rotation.y += 0.0004
      medium.points.rotation.y += 0.0006
      glow.points.rotation.y += 0.0002
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      const vv2 = window.visualViewport
      const w = Math.max(mount.clientWidth || (vv2 ? Math.floor(vv2.width) : window.innerWidth), window.innerWidth)
      const h = Math.max(mount.clientHeight || (vv2 ? Math.floor(vv2.height) : window.innerHeight), window.innerHeight)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      // Keep CSS size in sync for mobile dynamic viewport
      renderer.domElement.style.width = '100vw'
      renderer.domElement.style.height = '100dvh'
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      window.removeEventListener('pointermove', onPointer)
      ;[small, medium, glow].forEach((layer) => {
        layer.geometry.dispose()
        layer.material.dispose()
        if (layer.points && layer.points.parent) layer.points.parent.remove(layer.points)
      })
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }, [isDark])

  const handleYearClick = (year) => {
    setSelectedYear(year);
  };

  // Extracting events and workshops for the selected year
  const eventsForYear = eventsData?.events?.[selectedYear] || [];
  const workshopsForYear = eventsData?.workshops?.[selectedYear] || [];

  // Filter events based on eventType for 2024-25 and 2025-26
  const interCollegeEvents = eventsForYear.filter(
    (event) => event.eventType === 'inter-college'
  );
  const intraCollegeEvents = eventsForYear.filter(
    (event) => event.eventType === 'intra-college'
  );
  const funEvents = eventsForYear.filter(
    event => event.eventType === 'fun-event'
  );



  return (
    <div className="relative">
      <div ref={starRef} className="absolute inset-0 pointer-events-none" />
      <div className="relative z-10 container py-[24px] lg:py-[32px] bg-transparent">
        {/* Header Section */}
        <div className="py-10 md:pt-8">
          <div className="w-full flex flex-col items-center text-center mb-8">
            <div className="relative">
              <svg aria-hidden className="absolute -z-10 opacity-10 w-[420px] h-[120px] hidden md:block" viewBox="0 0 420 120" fill="none">
                <defs>
                  <pattern id="events-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill={isDark ? '#94a3b8' : '#cbd5e1'} />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#events-dots)" />
              </svg>

              <div className="flex items-center justify-center gap-4">
                <span className={`text-cyan-400 font-mono text-xl tracking-wide select-none ${isDark ? 'opacity-90' : 'opacity-95'}`}>//</span>
                <h1
                  className={`text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent`}
                  style={{
                    backgroundImage: isDark
                      ? 'linear-gradient(90deg,#ffffff, #94a3b8)'
                      : 'linear-gradient(90deg,#0f1724, #475569)'
                  }}
                >
                  Events
                </h1>
              </div>

              <p className={`mt-3 text-sm ${isDark ? 'text-slate-300/90' : 'text-slate-600'}`}>We have proudly hosted numerous events. Looking back, here are some highlights.</p>
            </div>

            {/* Year toggle pill matching Committee/Developers style */}
            <div className="mt-6 w-full flex justify-center">
              <div
                role="tablist"
                aria-label="Academic year toggle"
                className={`relative rounded-full px-1 py-1 flex items-center ${isDark ? 'bg-slate-900/60 border border-white/10' : 'bg-slate-200/60'} max-w-[640px] w-full`}
              >
                <div
                  aria-hidden
                  className={`absolute top-1 bottom-1 left-1 w-1/4 rounded-full transition-transform duration-300 ease-out ${isDark ? 'bg-slate-700 shadow-sm' : 'bg-white shadow-sm'}`}
                  style={{ transform: selectedYear === '2026-27' ? 'translateX(300%)' : selectedYear === '2025-26' ? 'translateX(200%)' : selectedYear === '2024-25' ? 'translateX(100%)' : 'translateX(0%)' }}
                />

                <button role="tab" aria-selected={selectedYear === '2023-24'} onClick={() => handleYearClick('2023-24')} className={`relative z-10 flex-1 text-center py-2 px-4 rounded-full text-sm font-medium ${selectedYear === '2023-24' ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-slate-300' : 'text-gray-500')}`}>2023-24</button>
                <button role="tab" aria-selected={selectedYear === '2024-25'} onClick={() => handleYearClick('2024-25')} className={`relative z-10 flex-1 text-center py-2 px-4 rounded-full text-sm font-medium ${selectedYear === '2024-25' ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-slate-300' : 'text-gray-500')}`}>2024-25</button>
                <button role="tab" aria-selected={selectedYear === '2025-26'} onClick={() => handleYearClick('2025-26')} className={`relative z-10 flex-1 text-center py-2 px-4 rounded-full text-sm font-medium ${selectedYear === '2025-26' ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-slate-300' : 'text-gray-500')}`}>2025-26</button>
                <button role="tab" aria-selected={selectedYear === '2026-27'} onClick={() => handleYearClick('2026-27')} className={`relative z-10 flex-1 text-center py-2 px-4 rounded-full text-sm font-medium ${selectedYear === '2026-27' ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-slate-300' : 'text-gray-500')}`}>2026-27</button>
              </div>
            </div>
            <div className="h-6" />
          </div>
        </div>

        {/* Events Display */}
        <div className="min-h-screen">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : selectedYear === '2023-24' ? (
            <div className="w-full px-4 transition-all duration-500 ease-in-out">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {eventsForYear.length > 0 ? (
                  eventsForYear.map((event, index) => (
                    <div key={index}>
                      <EventPoster image={event.image} title={event.title} eventYear={selectedYear} eventId={event.id} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-dt-blue dark:text-white text-lg">No events found for {selectedYear}</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Check back later for updates or explore other years.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Inter-college Events */}
              <section className="my-16">
                <h2 className="text-3xl md:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 dark:from-cyan-300 dark:to-blue-400 font-bold mb-10">
                  Inter College Events
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 mt-4 mx-auto max-w-7xl px-4">
                  {interCollegeEvents.length > 0 ? interCollegeEvents.map((event, i) => (
                    <div key={i}>
                      <EventPoster image={event.image} title={event.title} eventYear={selectedYear} eventId={event.id} />
                    </div>
                  )) : (
                    <div className="col-span-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 shadow-lg text-center border border-slate-200/40 dark:border-slate-600/40">
                      <p className="text-dt-blue dark:text-white text-lg font-medium">No inter-college events found for {selectedYear}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Intra-college Events */}
              <section className="my-16">
                <h2 className="text-3xl md:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 dark:from-purple-300 dark:to-pink-400 font-bold mb-10">
                  Intra-College Events
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4 mx-auto max-w-7xl px-4">
                  {intraCollegeEvents.length > 0 ? intraCollegeEvents.map((event, i) => (
                    <div key={i}>
                      <EventPoster image={event.image} title={event.title} eventYear={selectedYear} eventId={event.id} />
                    </div>
                  )) : (
                    <div className="col-span-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 shadow-lg text-center border border-slate-200/40 dark:border-slate-600/40">
                      <p className="text-dt-blue dark:text-white text-lg font-medium">No intra-college events found for {selectedYear}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Fun Events */}
              <section className="my-16">
                <h2 className="text-3xl md:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-500 dark:from-orange-300 dark:to-red-400 font-bold mb-10">
                  Fun Events
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4 mx-auto max-w-7xl px-4">
                  {funEvents.length > 0 ? funEvents.map((event, i) => (
                    <div key={i}>
                      <EventPoster image={event.image} title={event.title} eventYear={selectedYear} eventId={event.id} />
                    </div>
                  )) : (
                    <div className="col-span-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-8 shadow-lg text-center border border-slate-200/40 dark:border-slate-600/40">
                      <p className="text-dt-blue dark:text-white text-lg font-medium">No fun events found for {selectedYear}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Workshops */}
              {workshopsForYear.length > 0 && (
                <section className="my-16">
                  <h2 className="text-3xl md:text-4xl text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-500 dark:from-teal-300 dark:to-cyan-400 font-bold mb-10">
                    Workshops
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4 mx-auto max-w-7xl px-4">
                    {workshopsForYear.map((event, i) => (
                      <div key={i}>
                        <EventPoster image={event.image} title={event.title} eventYear={selectedYear} eventId={event.id} />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Back to top button */}
          <div className="fixed bottom-8 right-8 z-50">
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 focus:outline-none" aria-label="Back to top">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
