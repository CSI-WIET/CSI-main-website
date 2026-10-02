import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Mail, Linkedin } from 'lucide-react';
import { useHtmlDark } from '../hooks/useHtmlDark';

/*
  Single-file FacultyPage
  - WaveBackground: Three.js BufferGeometry particle wave with sine undulation + mouse ripple
  - FacultyCard: premium UI (grayscale -> color on hover, glassmorphism in dark)
  - FacultyPage: header + responsive grid + staggered reveal

  Colors strictly follow requirements:
  - Light: bg-white, text-slate-900, accent text-blue-600
  - Dark: bg-slate-950, text-white, accent text-cyan-400

  Uses embedded facultyData (do not change data)
*/

// --- facultyData (copied from your project's db.json - unchanged) ---
const facultyData = [
  {
    name: 'Prof. Ranjana Singh',
    position: 'Branch Councillor & President of CSI-WIET',
    image: '/event-images/mam1.jpg'
  },
  {
    name: 'Prof. Rucha Patwardhan',
    position: 'Faculty Memeber of CSI-WIET',
    image: '/event-images/faculty_rucha_patwardhan.jpg',
    email: 'ruchapp06@gmail.com'
  },
  {
    name: 'Prof. Rahila Shaikh',
    position: 'Faculty Memeber of CSI-WIET',
    image: '/event-images/mam4.jpg'
  },
  {
    name: 'Prof. Dhananjay Raut',
    position: 'Faculty Memeber of CSI-WIET',
    image: '/event-images/faculty_dhananjay_raut.jpg',
    email: 'dhananjayraut2026@gmail.com',
    linkedin: 'https://www.linkedin.com/in/dhananjay-raut-4b2b345a'
  },
  {
    name: 'Prof. Kalidas Bhavale',
    position: 'Faculty Memeber of CSI-WIET',
    image: '/event-images/faculty_kalidas_bhavale.jpg',
    email: 'kalidas.bhawale@gmail.com'
  },
  {
    name: 'Prof. Mugdha Joshi',
    position: 'Faculty Memeber of CSI-WIET',
    image: '/event-images/faculty_mugdha_joshi.png'
  },
  {
    name: 'Prof. Sneha Ingale',
    position: 'Faculty Memeber of CSI-WIET',
    image: '/event-images/faculty_sneha_ingale.jpg',
    email: 'Sneha.ingale@watumull.edu.in'
  }
];

// --- WaveBackground ---
function WaveBackground({ isDark }) {
  const mountRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    const width = mount.clientWidth || window.innerWidth;
    const height = mount.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(55, width / height, 1, 10000);
    camera.position.set(0, 120, 420);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    // initial size (will be corrected once layout settles)
    renderer.setSize(width || window.innerWidth, height || window.innerHeight);
    // make canvas fill viewport and not capture pointer events
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    // ensure canvas stacks behind content but above page background
    renderer.domElement.style.zIndex = '0';
    mount.appendChild(renderer.domElement);

    // Particles
    const COUNT = window.innerWidth < 768 ? 320 : 900; // fewer on small screens
    const positions = new Float32Array(COUNT * 3);
    const baseY = new Float32Array(COUNT);
    const baseX = new Float32Array(COUNT);
    const baseZ = new Float32Array(COUNT);

    const spreadX = 900;
    const spreadZ = 700;

    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * spreadX;
      const z = (Math.random() - 0.5) * spreadZ;
      const y = Math.sin(x * 0.01 + z * 0.01) * 8 + (Math.random() - 0.5) * 6;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      baseX[i] = x;
      baseY[i] = y;
      baseZ[i] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleColor = isDark ? 0x22d3ee : 0x2563eb;
    const material = new THREE.PointsMaterial({ color: particleColor, size: isDark ? 3.6 : 2.8, sizeAttenuation: true, transparent: true, opacity: 0.96 });
    // improve visibility over white backgrounds
    material.depthTest = false;
    material.blending = THREE.AdditiveBlending;
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Interaction
    const mouse = { x: 0, z: 0, active: false };

    function handleMove(e) {
      const rect = mount.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / rect.width;
      const my = (e.clientY - rect.top) / rect.height;
      mouse.x = (mx - 0.5) * spreadX;
      mouse.z = (my - 0.5) * spreadZ;
      mouse.active = true;
    }

    function handleLeave() {
      mouse.active = false;
    }

    mount.addEventListener('mousemove', handleMove);
    mount.addEventListener('mouseleave', handleLeave);

    function safeSetSize() {
      // For fixed fullscreen mount, prefer viewport size
      const w = Math.max(1, Math.floor(window.innerWidth));
      const h = Math.max(1, Math.floor(window.innerHeight));
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }

    function onResize() {
      safeSetSize();
    }
    window.addEventListener('resize', onResize);
    // ResizeObserver to catch container layout changes
    let ro = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => safeSetSize());
      ro.observe(mount);
    }
    // call once to ensure correct size after mount
    safeSetSize();

    const RADIUS = 22000;
    const start = performance.now();
    camera.lookAt(0, 0, 0);

    function animate() {
      const t = (performance.now() - start) * 0.001;
      const pos = geometry.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        const idx = i * 3;
        const x = baseX[i];
        const z = baseZ[i];
        const base = baseY[i];
        const wave = Math.sin((x + z) * 0.01 + t * 1.0) * 8;
        let ripple = 0;
        if (mouse.active) {
          const dx = x - mouse.x;
          const dz = z - mouse.z;
          const d2 = dx * dx + dz * dz;
          ripple = Math.exp(-d2 / RADIUS) * 24;
        }
        pos[idx + 1] = base + wave + ripple;
      }
      geometry.attributes.position.needsUpdate = true;
      points.rotation.y = Math.sin(t * 0.05) * 0.02;
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    // cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      mount.removeEventListener('mousemove', handleMove);
      mount.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
      try {
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      } catch (e) {
        // ignore
      }
      if (renderer.domElement && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isDark]);

  // mount container is fixed to viewport so the animation starts from the top
  return <div ref={mountRef} className="fixed inset-0 w-full h-screen z-0 pointer-events-none" aria-hidden />;
}

// --- FacultyCard ---
function FacultyCard({ member, index, isDark, mounted }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setVisible(true), index * 80 + (mounted ? 50 : 0));
    return () => clearTimeout(id);
  }, [index, mounted]);

  const cardBg = isDark
    ? 'bg-slate-900/60 backdrop-blur-xl border border-white/10 text-white'
    : 'bg-white border border-slate-100 text-slate-900 shadow-xl';

  const accent = isDark ? 'text-cyan-400' : 'text-blue-600';

  return (
    <article
      className={`transform transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 70}ms` }}
    >
      <div className={`${cardBg} rounded-2xl overflow-hidden`}>
        <div className="relative h-80 overflow-hidden group">
          <img
            src={member.image}
            alt={member.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ transformOrigin: 'center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-serif font-semibold" style={{ fontFamily: 'Georgia, serif' }}>{member.name}</h3>
          <p className={`mt-2 text-xs tracking-widest font-mono uppercase ${accent}`}>{member.position}</p>

          {/* <div className="mt-4 flex flex-wrap gap-2">
            <span className={`${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-700'} px-3 py-1 rounded-full text-xs`}>Machine Learning</span>
            <span className={`${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-700'} px-3 py-1 rounded-full text-xs`}>Computer Vision</span>
          </div> */}

          <div className="mt-5 flex items-center gap-3">
            <a
              href={member.linkedin || '#'}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-white/5 hover:-translate-y-1 transform transition shadow-sm"
              aria-label="LinkedIn"
              style={{ display: 'inline-flex' }}
            >
              <Linkedin className={`${accent}`} size={18} />
            </a>

            <a
              href={member.email ? `mailto:${member.email}` : '#'}
              className="p-2 rounded-full bg-white/5 hover:-translate-y-1 transform transition shadow-sm"
              aria-label="Email"
              style={{ display: 'inline-flex' }}
            >
              <Mail className={`${accent}`} size={18} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// --- FacultyPage (main) ---
export const FacultyPage = () => {
  // use embedded data per requirements
  const [mounted, setMounted] = useState(false);
  const isDark = useHtmlDark();

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className={`${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'} min-h-screen relative`}>
      <WaveBackground isDark={isDark} />

      <div className="relative z-10 container mx-auto px-6 py-20">
        <header className="max-w-4xl mx-auto text-center">
          <div className="relative">
            {/* decorative dot pattern behind title */}
            <svg aria-hidden className="absolute -z-10 opacity-10 w-[420px] h-[120px] hidden md:block" viewBox="0 0 420 120" fill="none">
              <defs>
                <pattern id="faculty-dots" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill={isDark ? '#94a3b8' : '#cbd5e1'} />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#faculty-dots)" />
            </svg>

            <div className="flex items-center justify-center gap-4">
              <span className={`text-cyan-400 font-mono text-xl tracking-wide select-none ${isDark ? 'opacity-90' : 'opacity-95'}`}>//</span>
              <h1
                className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter leading-tight bg-clip-text text-transparent`}
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(90deg,#ffffff, #94a3b8)'
                    : 'linear-gradient(90deg,#0f1724, #475569)'
                }}
              >
                Our Mentors
              </h1>
            </div>

            <p className={`mt-3 text-sm ${isDark ? 'text-slate-300/90' : 'text-slate-600'}`}>Distinguished faculty guiding student projects and research.</p>
          </div>
        </header>

        <main className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {facultyData.map((member, i) => (
              <FacultyCard key={i} member={member} index={i} isDark={isDark} mounted={mounted} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyPage;

