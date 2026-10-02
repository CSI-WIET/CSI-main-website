import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import * as THREE from 'three';
import gsapPackage, { gsap as gsapNamed } from 'gsap';
import {
  Menu, X, Terminal, Cpu, Shield, Globe, Zap, Code,
  ChevronRight, Layers, Wifi, Server, Activity, MapPin,
  ArrowRight, ImageIcon, Github, Instagram, Sparkles, Flame, MousePointer2, Clock,
  GitBranch, Star, Linkedin, Phone, Mail, Award, Search, ChevronDown, HelpCircle
} from 'lucide-react';

const TerminalIcon = Terminal || Code || (() => null);
const gsap =
  gsapNamed ||
  gsapPackage?.gsap ||
  gsapPackage || {
    to: () => null,
    set: () => null,
    killTweensOf: () => null,
    context: (cb) => {
      if (typeof cb === 'function') cb();
      return { revert: () => null };
    },
  };
const BranchIcon = GitBranch || Code || (() => null);
const StarIcon = Star || Sparkles || (() => null);
const SparklesIcon = Sparkles || Star || Code || (() => null);
const GithubIcon = Github || Code || (() => null);
const InstagramIcon = Instagram || Code || (() => null);
const LinkedinIcon = Linkedin || Code || (() => null);
const UnstopIcon = Award || Sparkles || (() => null);
const ArrowRightIcon = ArrowRight || Code || (() => null);
const ChevronRightIcon = ChevronRight || ArrowRight || Code || (() => null);
const GlobeIcon = Globe || Wifi || Code || (() => null);
const MenuIcon = Menu || Code || (() => null);
const CloseIcon = X || Code || (() => null);

/**
 * ------------------------------------------------------------------
 * CUSTOM TRAILING CURSOR
 * ------------------------------------------------------------------
 */

const HackverseCursor = memo(({ enabled = true, minWidth = 900 }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const cursorRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) {
      setIsEnabled(false);
      return undefined;
    }

    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const noHover = window.matchMedia && window.matchMedia('(hover: none)').matches;
    const smallScreen = window.matchMedia && window.matchMedia('(max-width: 767px)').matches;
    const belowDesktop = window.matchMedia && window.matchMedia(`(max-width: ${minWidth - 1}px)`).matches;
    if ((coarse && noHover) || smallScreen || belowDesktop) {
      setIsEnabled(false);
      return undefined;
    }

    let ticking = false;
    const onMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          posRef.current = { x: e.clientX, y: e.clientY };
          if (cursorRef.current) {
            cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
            cursorRef.current.style.opacity = '1';
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const onMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    const onMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1';
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('mouseenter', onMouseEnter, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (!isEnabled) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed w-6 h-6 border-2 border-cyan-300 rounded-full opacity-0 transition-opacity duration-300 pointer-events-none z-[9999]"
      style={{
        left: 0,
        top: 0,
        transform: 'translate3d(0, 0, 0) translate(-50%, -50%)',
        willChange: 'transform',
        backgroundColor: 'rgba(129, 140, 248, 0.12)',
        boxShadow: '0 0 18px rgba(124, 246, 255, 0.8), inset 0 0 10px rgba(255, 123, 242, 0.4)',
      }}
    />
  );
});

HackverseCursor.displayName = 'HackverseCursor';

const WORD_LIST = [
  'npm', 'api', 'printf', 'git push', 'csi:omni', 'sudo', 'binary_shift', 'stack',
  'kernel', 'async', 'mutex', 'ssh', 'commit', 'patch', 'token', 'endpoint',
  'payload', 'shader', 'vector', 'cipher', 'stream', 'socket', 'node', 'cache',
  'fetch', 'rebase', 'merge', 'auth', 'router', 'db', 'cli', 'commit:hash',
  'fork', 'pull', 'ci', 'cdn', 'ssh-key', 'http/2', 'tls', 'promise',
  'event-loop', 'cache-hit', 'stacktrace', 'daemon', 'runtime', 'patchset',
];

const PLEXUS_NODES = Array.from({ length: 16 }, (_, idx) => idx);

/**
 * ------------------------------------------------------------------
 * LOADING ANIMATION COMPONENT
 * ------------------------------------------------------------------
 */

const BootLoader = memo(() => {
  const [isVisible, setIsVisible] = useState(true);
  const [bootText, setBootText] = useState('');
  const [now, setNow] = useState(() => new Date());
  const wordMountRef = useRef(null);
  const wordSceneRef = useRef(null);
  const boomRef = useRef(false);
  const bootSequence = [
    'INITIALIZING HACKVERSE...',
    'LOADING SYSTEM...',
    'SYNCING TIMER...',
    'SYSTEM READY',
  ];

  const totalChars = useMemo(() => {
    return bootSequence.reduce((acc, line, idx) => {
      const newline = idx < bootSequence.length - 1 ? 1 : 0;
      return acc + line.length + newline;
    }, 0);
  }, [bootSequence]);

  const progress = Math.min(100, Math.round((bootText.length / totalChars) * 100));
  const isPanic = progress >= 85 && progress < 100;
  const isComplete = progress >= 100;
  const isIntro = progress < 10;
  const phaseLabel = progress < 85 ? 'CONVERGENCE' : progress < 100 ? 'KERNEL PANIC' : 'BREACH';
  const phaseNote = progress < 85 ? 'ASSEMBLING CORE' : progress < 100 ? 'CONTAINMENT FAILING' : 'ACCESS GRANTED';

  useEffect(() => {
    let index = 0;
    let charIndex = 0;
    let typingTimer;

    const typeText = () => {
      if (index < bootSequence.length) {
        const currentText = bootSequence[index];
        if (charIndex < currentText.length) {
          setBootText((prev) => prev + currentText[charIndex]);
          charIndex++;
          typingTimer = setTimeout(typeText, 28);
        } else {
          index++;
          charIndex = 0;
          setBootText((prev) => prev + '\n');
          typingTimer = setTimeout(typeText, 200);
        }
      } else {
        setTimeout(() => setIsVisible(false), 800);
      }
    };

    typeText();
    return () => clearTimeout(typingTimer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 33);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const mount = wordMountRef.current;
    if (!mount) return undefined;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if (prefersReduced) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.3);
    renderer.setPixelRatio(pixelRatio);

    const initW = mount.clientWidth || window.innerWidth;
    const initH = mount.clientHeight || window.innerHeight;
    renderer.setSize(initW, initH);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.mixBlendMode = 'screen';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, initW / initH, 1, 4000);
    camera.position.z = 520;

    const group = new THREE.Group();
    scene.add(group);

    const baseGeometry = new THREE.PlaneGeometry(1, 1);
    const meshes = [];

    const createWordTexture = (word, color) => {
      const paddingX = 28;
      const paddingY = 16;
      const fontSize = smallScreen ? 26 : 34;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.font = `600 ${fontSize}px "Geist Mono", "JetBrains Mono", monospace`;
      const metrics = ctx.measureText(word);
      const width = Math.ceil(metrics.width + paddingX * 2);
      const height = Math.ceil(fontSize + paddingY * 2);

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      ctx.font = `600 ${fontSize}px "Geist Mono", "JetBrains Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.fillText(word, width / 2, height / 2 + 1);
      ctx.shadowBlur = 0;

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return { texture, width, height };
    };

    const colors = ['rgba(124, 246, 255, 0.9)', 'rgba(255, 123, 242, 0.9)', 'rgba(109, 93, 252, 0.9)'];

    const words = smallScreen ? WORD_LIST.slice(0, 10) : WORD_LIST;
    words.forEach((word, index) => {
      const color = colors[index % colors.length];
      const textureData = createWordTexture(word, color);
      if (!textureData) return;

      const material = new THREE.MeshBasicMaterial({
        map: textureData.texture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(baseGeometry, material);
      const aspect = textureData.width / textureData.height;
      const size = 36 + (index % 5) * 4;
      mesh.scale.set(aspect * size, size, 1);

      const chaosRadius = 900 + Math.random() * 700;
      const chaosTheta = Math.random() * Math.PI * 2;
      const chaosPhi = Math.acos(2 * Math.random() - 1);
      const chaosPos = new THREE.Vector3(
        chaosRadius * Math.sin(chaosPhi) * Math.cos(chaosTheta),
        chaosRadius * Math.sin(chaosPhi) * Math.sin(chaosTheta),
        chaosRadius * Math.cos(chaosPhi)
      );

      const targetRadius = 180 + Math.random() * 80;
      const targetTheta = Math.random() * Math.PI * 2;
      const targetPhi = Math.acos(2 * Math.random() - 1);
      const target = new THREE.Vector3(
        targetRadius * Math.sin(targetPhi) * Math.cos(targetTheta),
        targetRadius * Math.sin(targetPhi) * Math.sin(targetTheta),
        targetRadius * Math.cos(targetPhi)
      );

      mesh.position.copy(chaosPos);
      mesh.rotation.z = (Math.random() - 0.5) * 0.5;

      group.add(mesh);
      meshes.push({ mesh, material, texture: textureData.texture, target });

      gsap.to(mesh.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 3.2,
        delay: index * 0.018,
        ease: 'power3.out',
      });

      gsap.to(material, {
        opacity: 1,
        duration: 1.6,
        delay: index * 0.008,
        ease: 'power2.out',
      });
    });

    const clock = new THREE.Clock();
    let raf = null;
    let frameCount = 0;

    const animate = () => {
      frameCount++;
      const t = clock.getElapsedTime();
      
      // Smooth rotation with easing
      const rotSpeed = 0.12;
      group.rotation.y += (Math.sin(t * 0.5) * rotSpeed - group.rotation.y) * 0.05;
      group.rotation.x += (Math.sin(t * 0.4) * 0.16 - group.rotation.x) * 0.05;
      group.rotation.z += (Math.cos(t * 0.3) * 0.04 - group.rotation.z) * 0.05;

      meshes.forEach(({ mesh }) => {
        mesh.lookAt(camera.position);
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = mount.clientWidth || window.innerWidth;
      const h = mount.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    wordSceneRef.current = { renderer, scene, camera, group, meshes, baseGeometry, handleResize };

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      meshes.forEach(({ material, texture }) => {
        material.dispose();
        if (texture) texture.dispose();
      });
      baseGeometry.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      wordSceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isComplete) return;
    if (boomRef.current) return;
    const sceneRef = wordSceneRef.current;
    if (!sceneRef) return;

    boomRef.current = true;

    const { camera, group, meshes } = sceneRef;
    gsap.to(camera.position, {
      z: 160,
      duration: 0.32,
      ease: 'power3.in',
    });
    gsap.to(group.rotation, {
      x: group.rotation.x + 0.5,
      y: group.rotation.y + 0.7,
      duration: 0.32,
      ease: 'power2.in',
    });

    meshes.forEach(({ mesh, material, target }, index) => {
      const burst = target.clone().multiplyScalar(3.8 + Math.random() * 1.0);
      burst.x += (Math.random() - 0.5) * 140;
      burst.y += (Math.random() - 0.5) * 140;
      burst.z += (Math.random() - 0.5) * 140;

      gsap.to(mesh.position, {
        x: burst.x,
        y: burst.y,
        z: burst.z,
        duration: 0.55,
        delay: index * 0.0015,
        ease: 'power4.out',
      });

      gsap.to(material, {
        opacity: 0,
        duration: 0.4,
        delay: 0.08,
        ease: 'power2.out',
      });
    });
  }, [isComplete]);

  if (!isVisible) return null;

  const timeStamp = now.toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 2,
  });

  const plexusNodes = PLEXUS_NODES;
  const bitColumns = Array.from({ length: 10 }, (_, idx) => idx);

  const coreScale = isIntro ? 1.35 - progress * 0.02 : 1;

  return (
    <div className={`hv-loader ${isPanic ? 'panic' : ''} ${isComplete ? 'complete' : ''} ${isIntro ? 'intro' : ''}`}>
      <style>{`
        .hv-loader {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: radial-gradient(circle at 20% 20%, rgba(124, 246, 255, 0.12), transparent 45%),
            radial-gradient(circle at 80% 30%, rgba(255, 123, 242, 0.14), transparent 45%),
            linear-gradient(135deg, #04010a 0%, #080b1c 50%, #050314 100%);
          color: #e2e8f0;
          font-family: 'Geist Mono', 'JetBrains Mono', system-ui, sans-serif;
          overflow: hidden;
          min-height: 100dvh;
          padding: env(safe-area-inset-top) env(safe-area-inset-right)
            env(safe-area-inset-bottom) env(safe-area-inset-left);
        }

        .hv-loader::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.08), transparent 55%);
          opacity: 0.6;
          pointer-events: none;
        }

        .hv-loader.panic {
          animation: hv-shake 0.12s linear infinite;
          filter: saturate(1.2);
        }

        .hv-loader.complete .hv-flash {
          animation: hv-flash 0.22s ease-out forwards;
        }

        .hv-loader-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .hv-bits {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          opacity: 0.55;
        }

        .hv-bit-column {
          position: absolute;
          top: -30vh;
          width: 12px;
          height: 160vh;
          color: rgba(124, 246, 255, 0.35);
          font-size: 12px;
          font-family: 'Geist Mono', 'JetBrains Mono', monospace;
          letter-spacing: 0.4em;
          text-shadow: 0 0 10px rgba(124, 246, 255, 0.4);
          animation: hv-bit-fall 6.5s linear infinite;
          writing-mode: vertical-rl;
          text-orientation: upright;
          white-space: nowrap;
        }

        .hv-bit-column:nth-child(even) {
          color: rgba(255, 123, 242, 0.35);
          text-shadow: 0 0 10px rgba(255, 123, 242, 0.35);
          animation-duration: 7.5s;
        }

        .hv-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(124, 246, 255, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 123, 242, 0.06) 1px, transparent 1px);
          background-size: 70px 70px;
          opacity: 0.35;
          transform: perspective(800px) rotateX(55deg) translateY(90px);
        }

        .hv-plexus {
          position: absolute;
          inset: 0;
          opacity: 0.55;
        }

        .hv-node {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(124, 246, 255, 0.9);
          box-shadow: 0 0 12px rgba(124, 246, 255, 0.8);
          animation: hv-float 8s ease-in-out infinite;
        }

        .hv-node:nth-child(even) {
          background: rgba(255, 123, 242, 0.9);
          box-shadow: 0 0 12px rgba(255, 123, 242, 0.8);
          animation-duration: 10s;
        }

        .hv-node-0 { top: 14%; left: 18%; animation-delay: -2s; }
        .hv-node-1 { top: 22%; left: 65%; animation-delay: -4s; }
        .hv-node-2 { top: 35%; left: 30%; animation-delay: -6s; }
        .hv-node-3 { top: 48%; left: 72%; animation-delay: -1s; }
        .hv-node-4 { top: 62%; left: 40%; animation-delay: -3s; }
        .hv-node-5 { top: 70%; left: 20%; animation-delay: -5s; }
        .hv-node-6 { top: 28%; left: 52%; animation-delay: -7s; }
        .hv-node-7 { top: 78%; left: 62%; animation-delay: -9s; }
        .hv-node-8 { top: 40%; left: 18%; animation-delay: -11s; }
        .hv-node-9 { top: 16%; left: 80%; animation-delay: -8s; }
        .hv-node-10 { top: 55%; left: 85%; animation-delay: -6s; }
        .hv-node-11 { top: 32%; left: 8%; animation-delay: -12s; }
        .hv-node-12 { top: 64%; left: 58%; animation-delay: -10s; }
        .hv-node-13 { top: 12%; left: 42%; animation-delay: -14s; }
        .hv-node-14 { top: 82%; left: 36%; animation-delay: -16s; }
        .hv-node-15 { top: 46%; left: 50%; animation-delay: -18s; }

        .hv-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
          background-size: 140px 140px;
          mix-blend-mode: soft-light;
          opacity: 0.15;
        }

        .hv-loader.panic .hv-noise {
          opacity: 0.35;
          mix-blend-mode: screen;
        }

        .hv-hud {
          position: absolute;
          top: 28px;
          left: 34px;
          right: 34px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          font-family: 'Space Grotesk', 'Inter', 'Segoe UI', system-ui, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.28em;
          font-size: 10px;
          color: rgba(226, 232, 240, 0.65);
        }

        .hv-brand {
          font-size: 12px;
          font-weight: 700;
          color: #7cf6ff;
        }

        .hv-subtitle {
          margin-top: 6px;
          font-size: 11px;
          letter-spacing: 0.34em;
          color: rgba(255, 123, 242, 0.9);
        }

        .hv-clock {
          font-family: 'Geist Mono', 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #e2e8f0;
          letter-spacing: 0.2em;
        }

        .hv-micro {
          margin-top: 6px;
          font-size: 9px;
          color: rgba(226, 232, 240, 0.45);
        }

        .hv-radar {
          position: absolute;
          right: 40px;
          bottom: 40px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 1px solid rgba(124, 246, 255, 0.3);
          box-shadow: 0 0 24px rgba(124, 246, 255, 0.25);
          overflow: hidden;
        }

        .hv-radar::before {
          content: "";
          position: absolute;
          inset: 18px;
          border-radius: 50%;
          border: 1px solid rgba(124, 246, 255, 0.2);
        }

        .hv-radar::after {
          content: "";
          position: absolute;
          inset: 0;
          background: conic-gradient(from 0deg, rgba(124, 246, 255, 0.4), transparent 45%);
          animation: hv-radar-sweep 2.8s linear infinite;
        }

        .hv-word-stage {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }

        .hv-core {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          z-index: 3;
          padding: 0 16px;
        }

        .hv-center-title {
          margin-top: 10px;
          font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
          font-size: clamp(16px, 3.6vw, 28px);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: transparent;
          background: linear-gradient(120deg, #7cf6ff, #ff7bf2 55%, #6d5dfc);
          -webkit-background-clip: text;
          background-clip: text;
          text-shadow: 0 0 22px rgba(124, 246, 255, 0.35);
          text-align: center;
        }

        .hv-center-subtitle {
          font-size: 11px;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.65);
        }

        .hv-core-ring {
          width: clamp(150px, 36vw, 220px);
          height: clamp(150px, 36vw, 220px);
          border-radius: 999px;
          border: 1px solid rgba(124, 246, 255, 0.25);
          box-shadow: 0 0 30px rgba(124, 246, 255, 0.2);
          animation: hv-core-spin 7.5s linear infinite;
        }

        .hv-core-ring.inner {
          position: absolute;
          width: clamp(90px, 22vw, 140px);
          height: clamp(90px, 22vw, 140px);
          border-color: rgba(255, 123, 242, 0.35);
          animation-direction: reverse;
        }

        .hv-core-dot {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #7cf6ff;
          box-shadow: 0 0 20px rgba(124, 246, 255, 0.9), 0 0 40px rgba(255, 123, 242, 0.6);
          animation: hv-core-pulse 2s ease-in-out infinite;
        }

        .hv-core-label {
          margin-top: 22vh;
          font-size: clamp(9px, 2.2vw, 11px);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.6);
        }

        .hv-terminal {
          position: absolute;
          left: 50%;
          bottom: 90px;
          transform: translateX(-50%);
          width: min(620px, 92vw);
          background: rgba(4, 8, 18, 0.78);
          border: 1px solid rgba(124, 246, 255, 0.18);
          box-shadow: 0 0 40px rgba(10, 15, 30, 0.7);
          border-radius: 16px;
          backdrop-filter: blur(10px);
          z-index: 4;
        }

        .hv-terminal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px 8px;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.55);
        }

        .hv-progress-value {
          font-family: 'Geist Mono', 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #7cf6ff;
        }

        .hv-progress-value.panic {
          color: #ff3b3b;
          animation: hv-jitter 0.14s linear infinite;
        }

        .hv-terminal-body {
          padding: 0 18px 18px;
          min-height: 120px;
          font-size: 13px;
          color: rgba(226, 232, 240, 0.75);
          white-space: pre-wrap;
          line-height: 1.6;
        }

        .hv-caret {
          display: inline-block;
          margin-left: 4px;
          width: 10px;
          height: 16px;
          background: #7cf6ff;
          animation: hv-caret 0.9s step-end infinite;
          vertical-align: middle;
        }

        .hv-footer {
          position: absolute;
          left: 50%;
          bottom: 40px;
          transform: translateX(-50%);
          width: min(620px, 92vw);
          display: grid;
          gap: 10px;
          z-index: 4;
        }

        .hv-progress-bar {
          height: 4px;
          background: rgba(226, 232, 240, 0.1);
          border-radius: 999px;
          overflow: hidden;
        }

        .hv-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #7cf6ff, #ff7bf2, #6d5dfc);
          box-shadow: 0 0 14px rgba(124, 246, 255, 0.6);
          transition: width 0.2s ease-out;
        }

        .hv-progress-meta {
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.45);
        }

        .hv-flash {
          position: absolute;
          inset: 0;
          background: #f8fafc;
          opacity: 0;
          pointer-events: none;
        }

        @keyframes hv-shake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-4px, 2px); }
          50% { transform: translate(3px, -3px); }
          75% { transform: translate(-2px, -2px); }
          100% { transform: translate(2px, 3px); }
        }

        @keyframes hv-float {
          0%, 100% { transform: translate3d(0, 0, 0); opacity: 0.7; }
          50% { transform: translate3d(12px, -10px, 0); opacity: 1; }
        }

        @keyframes hv-radar-sweep {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes hv-core-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes hv-core-pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; }
        }


        @keyframes hv-bit-fall {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.7; }
          100% { transform: translateY(120vh); opacity: 0.1; }
        }

        @keyframes hv-caret {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes hv-jitter {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
          100% { transform: translateX(1px); }
        }

        @keyframes hv-flash {
          0% { opacity: 0; }
          10% { opacity: 1; }
          100% { opacity: 0; }
        }

        @media (max-width: 768px) {
          .hv-hud {
            left: 18px;
            right: 18px;
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
            letter-spacing: 0.2em;
          }
          .hv-brand {
            font-size: 10px;
          }
          .hv-subtitle {
            font-size: 9px;
            letter-spacing: 0.26em;
          }
          .hv-radar {
            display: none;
          }
          .hv-bit-column {
            font-size: 10px;
            letter-spacing: 0.25em;
            opacity: 0.35;
          }
          .hv-plexus {
            opacity: 0.35;
          }
          .hv-core-ring {
            width: 170px;
            height: 170px;
          }
          .hv-core-ring.inner {
            width: 102px;
            height: 102px;
          }
          .hv-core-label {
            margin-top: 175px;
            font-size: 9px;
            letter-spacing: 0.35em;
          }
          .hv-terminal {
            position: relative;
            left: auto;
            right: auto;
            bottom: auto;
            transform: none;
            width: min(560px, 92vw);
            margin: 18px auto 0;
            background: rgba(2, 6, 12, 0.92);
            border-color: rgba(124, 246, 255, 0.28);
          }
          .hv-center-title {
            font-size: 18px;
            letter-spacing: 0.22em;
            text-align: center;
          }
          .hv-center-subtitle {
            font-size: 9px;
            letter-spacing: 0.3em;
          }
          .hv-terminal-header {
            padding: 12px 14px 6px;
            font-size: 9px;
            letter-spacing: 0.2em;
          }
          .hv-terminal-body {
            min-height: 96px;
            font-size: 12px;
            line-height: 1.5;
            color: rgba(226, 232, 240, 0.92);
            text-shadow: 0 0 8px rgba(124, 246, 255, 0.25);
            word-break: break-word;
          }
          .hv-progress-value {
            font-size: 10px;
          }
          .hv-footer {
            position: relative;
            left: auto;
            right: auto;
            bottom: auto;
            transform: none;
            width: min(560px, 92vw);
            margin: 12px auto 0;
          }
          .hv-progress-meta {
            font-size: 9px;
            letter-spacing: 0.2em;
          }
          .hv-core {
            position: relative;
            inset: auto;
            margin-top: 64px;
          }
        }

        @media (max-width: 480px) {
          .hv-hud {
            top: 20px;
            left: 14px;
            right: 14px;
          }
          .hv-center-title {
            font-size: 15px;
            letter-spacing: 0.18em;
          }
          .hv-core-ring {
            width: 150px;
            height: 150px;
          }
          .hv-core-ring.inner {
            width: 90px;
            height: 90px;
          }
          .hv-core-label {
            margin-top: 158px;
          }
          .hv-terminal {
            width: min(520px, 92vw);
          }
          .hv-terminal-body {
            font-size: 11px;
            min-height: 88px;
          }
          .hv-footer {
            width: min(520px, 92vw);
          }
        }
      `}</style>

      <div className="hv-loader-bg">
        <div className="hv-bits">
          {bitColumns.map((col) => (
            <span
              key={`bit-${col}`}
              className="hv-bit-column"
              style={{
                left: `${8 + col * 9}%`,
                animationDelay: `${-col * 0.7}s`,
              }}
            >
              1010101010
            </span>
          ))}
        </div>
        <div className="hv-plexus">
          {plexusNodes.map((node) => (
            <span key={node} className={`hv-node hv-node-${node}`} />
          ))}
        </div>
        <div className="hv-grid" />
        <div className="hv-noise" />
      </div>

      <div className="hv-hud">
        <div>
          <div className="hv-brand">HACKVERSE 2.0</div>
          <div className="hv-subtitle">SYSTEM BREACH</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="hv-clock">{timeStamp}</div>
          <div className="hv-micro">LOCAL SYNC</div>
        </div>
      </div>

      <div className="hv-radar" />

      <div className="hv-word-stage" ref={wordMountRef} />

      <div className="hv-core" style={{ transform: `scale(${coreScale})` }}>
        <div className="hv-core-ring" />
        <div className="hv-core-ring inner" />
        <div className="hv-core-dot" />
        <div className="hv-center-title">HACKVERSE 2.0</div>
        <div className="hv-center-subtitle">SYSTEM BREACH</div>
        <div className="hv-core-label">KERNEL CORE</div>
      </div>

      <div className="hv-terminal">
        <div className="hv-terminal-header">
          <span>KERNEL LOG</span>
          <span className={`hv-progress-value ${isPanic ? 'panic' : ''}`}>{progress}%</span>
        </div>
        <div className="hv-terminal-body">
          {bootText}
          {isVisible && <span className="hv-caret" />}
        </div>
      </div>

      <div className="hv-footer">
        <div className="hv-progress-bar">
          <div className="hv-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="hv-progress-meta">
          <span>{phaseLabel}</span>
          <span>{phaseNote}</span>
        </div>
      </div>

      <div className="hv-flash" />
    </div>
  );
});

BootLoader.displayName = 'BootLoader';

/**
 * ------------------------------------------------------------------
 * OPTIMIZED HOOKS & UTILITIES
 * ------------------------------------------------------------------
 */

const useLowPowerMode = () => {
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    const getLowPower = () => {
      if (typeof window === 'undefined') return false;
      const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const saveData = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData;
      const lowMemory = typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4;
      const lowCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
      return Boolean(prefersReduced || saveData || lowMemory || lowCores);
    };

    setIsLowPower(getLowPower());

    const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setIsLowPower(getLowPower());
    if (mq && mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq && mq.addListener) mq.addListener(onChange);

    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener('change', onChange);
      else if (mq && mq.removeListener) mq.removeListener(onChange);
    };
  }, []);

  return isLowPower;
};

const Reveal = memo(({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const shell = typeof document !== 'undefined' ? document.querySelector('.hackverse-shell') : null;
    const lowPowerMode = shell && shell.classList.contains('low-power');
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = typeof navigator !== 'undefined' && navigator.connection && navigator.connection.saveData;
    const lowMemory = typeof navigator !== 'undefined' && navigator.deviceMemory && navigator.deviceMemory <= 4;
    const lowCores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    if (lowPowerMode || prefersReduced || saveData || lowMemory || lowCores) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return undefined;
    }

    if (typeof IntersectionObserver === 'undefined') {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return undefined;
    }

    const useClip = el.classList.contains('clip-reveal');
    const useCard = el.classList.contains('reveal-card');
    if (useClip) {
      gsap.set(el, { autoAlpha: 1, y: 0, clipPath: 'inset(0 0 100% 0)' });
    } else if (useCard) {
      gsap.set(el, { autoAlpha: 0, y: 36, scale: 0.94, filter: 'blur(10px)', transformOrigin: '50% 50%' });
    } else {
      gsap.set(el, { autoAlpha: 0, y: 24 });
    }

    const fallbackTimer = window.setTimeout(() => {
      if (useClip) {
        gsap.to(el, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.48,
          ease: 'power2.out',
          onStart: () => el.classList.add('animating'),
          onComplete: () => el.classList.remove('animating'),
        });
      } else if (useCard) {
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.75,
          ease: 'power2.out',
          onStart: () => el.classList.add('animating'),
          onComplete: () => {
            el.classList.remove('animating');
            gsap.set(el, { clearProps: 'filter' });
          },
        });
      } else {
        gsap.to(el, {
          autoAlpha: 1,
          y: 0,
          duration: 0.48,
          ease: 'power2.out',
          onStart: () => el.classList.add('animating'),
          onComplete: () => el.classList.remove('animating'),
        });
      }
    }, 900);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.clearTimeout(fallbackTimer);
          if (useClip) {
            gsap.to(el, {
              clipPath: 'inset(0 0 0% 0)',
              duration: 0.85,
              ease: 'power3.out',
              delay: delay / 1000,
              onStart: () => el.classList.add('animating'),
              onComplete: () => el.classList.remove('animating'),
            });
          } else if (useCard) {
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              duration: 0.85,
              ease: 'power3.out',
              delay: delay / 1000,
              onStart: () => el.classList.add('animating'),
              onComplete: () => {
                el.classList.remove('animating');
                gsap.set(el, { clearProps: 'filter' });
              },
            });
          } else {
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.85,
              ease: 'power3.out',
              delay: delay / 1000,
              onStart: () => el.classList.add('animating'),
              onComplete: () => el.classList.remove('animating'),
            });
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(el);
    return () => {
      window.clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [delay]);

  return (
    <div ref={ref} className={`gsap-reveal ${className}`}>
      {children}
    </div>
  );
});

Reveal.displayName = 'Reveal';


const LazyRender = memo(({ children, placeholderHeight = "200px" }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px', threshold: 0 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: shouldRender ? 'auto' : placeholderHeight }}>
      {shouldRender ? children : null}
    </div>
  );
});

LazyRender.displayName = 'LazyRender';

const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const lastProgressRef = useRef(0);
  const targetRef = useRef(0);

  useEffect(() => {
    let scrollTicking = false;
    
    const updateTarget = () => {
      if (!scrollTicking) {
        requestAnimationFrame(() => {
          const scrollTop = document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          targetRef.current = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    const tick = () => {
      const diff = targetRef.current - lastProgressRef.current;
      if (Math.abs(diff) > 0.0005) {
        lastProgressRef.current += diff * 0.18;
        setProgress(lastProgressRef.current);
      } else if (lastProgressRef.current !== targetRef.current) {
        lastProgressRef.current = targetRef.current;
        setProgress(targetRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    updateTarget();
    tick();
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return progress;
};

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const dist = targetDate - now;

      if (dist < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(dist / (1000 * 60 * 60 * 24)),
          hours: Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((dist % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

const useScramble = (text, speed = 40) => {
  const [displayedText, setDisplayedText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!isHovering) {
      setDisplayedText(text);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(prev =>
        text
          .split('')
          .map((l, idx) => {
            if (idx < i) return text[idx];
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'[
              Math.floor(Math.random() * 36)
            ];
          })
          .join('')
      );

      if (i >= text.length) clearInterval(interval);
      i += 1 / 3;
    }, speed);

    return () => clearInterval(interval);
  }, [isHovering, text, speed]);

  return { displayedText, setIsHovering };
};


/**
 * ------------------------------------------------------------------
 * UI COMPONENTS
 * ------------------------------------------------------------------
 */

const createBinaryTexture = (char, color) => {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.font = '700 76px "Geist Mono", "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(char, size / 2, size / 2 + 6);
  ctx.shadowBlur = 0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
};

const BinaryStreamBg = memo(({ scrollProgress = 0, enabled = true }) => {
  const mountRef = useRef(null);
  const scrollRef = useRef(0);
  const lastDepthRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const skipRef = useRef(false);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    if (!enabled) return undefined;

    const mount = mountRef.current;
    if (!mount) return undefined;

    const lowPower = typeof navigator !== 'undefined' && (
      (navigator.connection && navigator.connection.saveData) ||
      (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
    const basePixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 0.95 : (lowPower ? 1.0 : 1.1));
    renderer.setPixelRatio(basePixelRatio);

    const vv = window.visualViewport;
    const initW = vv ? Math.floor(vv.width) : window.innerWidth;
    const initH = vv ? Math.floor(vv.height) : window.innerHeight;
    renderer.setSize(initW, initH);
    renderer.setClearColor(0x010103, 1);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100dvh';
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.style.zIndex = '-1';
    renderer.domElement.style.mixBlendMode = 'screen';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, initW / initH, 1, 6000);
    const baseZ = initW < 768 ? 980 : 860;
    camera.position.z = baseZ;

    const group = new THREE.Group();
    scene.add(group);

    const textureZero = createBinaryTexture('0', 'rgba(129, 140, 248, 0.9)');
    const textureOne = createBinaryTexture('1', 'rgba(168, 85, 247, 0.9)');

    const totalCount = lowPower ? (isMobile ? 360 : 800) : (isMobile ? 520 : 1400);
    const layerCount = Math.floor(totalCount / 2);

    const createLayer = (count, texture, size, opacity) => {
      const positions = new Float32Array(count * 3);
      const baseY = new Float32Array(count);
      const speeds = new Float32Array(count);
      const drift = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 2400;
        const startY = (Math.random() - 0.35) * 1800;
        positions[i * 3 + 1] = startY;
        baseY[i] = startY;
        positions[i * 3 + 2] = -Math.random() * 2800;
        speeds[i] = 0.1 + Math.random() * 0.25;
        drift[i] = Math.random() * Math.PI * 2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        size,
        map: texture,
        transparent: true,
        opacity,
        alphaTest: 0.02,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      group.add(points);
      return { geometry, material, points, positions, speeds, drift, baseY };
    };

    const layerA = createLayer(layerCount, textureZero, isMobile ? 30 : 38, 0.75);
    const layerB = createLayer(totalCount - layerCount, textureOne, isMobile ? 28 : 36, 0.62);

    const mouseVec = new THREE.Vector3(0, 0, 0.5);
    const flowTarget = new THREE.Vector3();
    const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const useFlow = !coarsePointer && !lowPower;
    let pointerTicking = false;

    const onPointer = (e) => {
      if (!pointerTicking) {
        requestAnimationFrame(() => {
          mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
          mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
          pointerTicking = false;
        });
        pointerTicking = true;
      }
    };

    if (useFlow) {
      window.addEventListener('pointermove', onPointer, { passive: true });
    }

    const clock = new THREE.Clock();
    let raf = null;

    const updateLayer = (layer, t, depth, step, chaos, scrollBoost) => {
      const pos = layer.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const xIdx = i * 3;
        const yIdx = xIdx + 1;
        const zIdx = xIdx + 2;

        pos.array[zIdx] += (layer.speeds[i] + depth * 0.15 + scrollBoost) * step;
        if (pos.array[zIdx] > 240) {
          pos.array[zIdx] = -2800;
        }

        pos.array[yIdx] = layer.baseY[i] + Math.sin(t * 0.28 + layer.drift[i]) * 7 + chaos;

        if (useFlow) {
          const dx = flowTarget.x - pos.array[xIdx];
          const dy = flowTarget.y - pos.array[yIdx];
          const dist = dx * dx + dy * dy + 600;
          const force = 0.4 / dist;
          pos.array[xIdx] += dx * force;
          pos.array[yIdx] += dy * force;
        }
      }
      pos.needsUpdate = true;
    };

    const animate = () => {
      const t = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.033);
      const step = delta * 60;
      const depth = scrollRef.current;
      const depthDelta = Math.abs(depth - lastDepthRef.current);
      lastDepthRef.current = depth;
      const chaos = Math.min(9, depthDelta * 1100);
      const scrollBoost = Math.min(2.0, depthDelta * 400);
      const heavyScroll = depthDelta > 0.008;

      if (heavyScroll) {
        if (renderer.getPixelRatio() !== 1) renderer.setPixelRatio(1);
      } else if (!isMobile && renderer.getPixelRatio() !== basePixelRatio) {
        renderer.setPixelRatio(basePixelRatio);
      }

      const shouldSkip = (heavyScroll && !lowPower) || ((isMobile || lowPower) && !heavyScroll);
      if (shouldSkip) {
        skipRef.current = !skipRef.current;
        if (skipRef.current) {
          renderer.render(scene, camera);
          raf = requestAnimationFrame(animate);
          return;
        }
      }

      if (useFlow && !heavyScroll) {
        mouseVec.set(mouseRef.current.x, mouseRef.current.y, 0.5).unproject(camera);
        flowTarget.lerp(mouseVec, 0.09);
      }

      camera.position.z = baseZ - depth * 170;

      group.rotation.y = t * (0.018 + depth * 0.05);
      group.rotation.x = Math.sin(t * 0.11) * 0.028 + depth * 0.038;
      group.position.y = -depth * 110;

      updateLayer(layerA, t, depth, step, chaos, scrollBoost);
      if (!heavyScroll || lowPower) {
        updateLayer(layerB, t + 1.5, depth, step, -chaos * 0.6, scrollBoost * 0.8);
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      let resizeTicking = false;
      if (!resizeTicking) {
        requestAnimationFrame(() => {
          const vv2 = window.visualViewport;
          const w = vv2 ? Math.floor(vv2.width) : window.innerWidth;
          const h = vv2 ? Math.floor(vv2.height) : window.innerHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          renderer.domElement.style.width = '100vw';
          renderer.domElement.style.height = '100dvh';
          resizeTicking = false;
        });
        resizeTicking = true;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (useFlow) {
        window.removeEventListener('pointermove', onPointer);
      }
      layerA.geometry.dispose();
      layerA.material.dispose();
      layerB.geometry.dispose();
      layerB.material.dispose();
      if (textureZero) textureZero.dispose();
      if (textureOne) textureOne.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden />;
});

BinaryStreamBg.displayName = 'BinaryStreamBg';

const MagneticButton = memo(({ children, className = "", onClick, href, target, rel }) => {
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const isLowPower = typeof document !== 'undefined'
    && document.querySelector('.hackverse-shell')?.classList.contains('low-power');

  const handleMove = useCallback((e) => {
    if (isLowPower) return;
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    setPos({
      x: (clientX - (left + width / 2)) * 0.4,
      y: (clientY - (top + height / 2)) * 0.4,
    });
  }, [isLowPower]);

  const handleLeave = useCallback(() => {
    setPos({ x: 0, y: 0 });
  }, []);

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={btnRef}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={isLowPower ? undefined : handleMove}
      onMouseLeave={isLowPower ? undefined : handleLeave}
      onClick={onClick}
      style={{ transform: isLowPower ? 'none' : `translate(${pos.x}px, ${pos.y}px)` }}
      className={`magnetic-glow transition-transform duration-100 ease-out ${className}`}
    >
      {children}
    </Component>
  );
});

MagneticButton.displayName = 'MagneticButton';

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(124,246,255,0.18)" }) => {
  const divRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const isLowPower = typeof document !== 'undefined'
    && document.querySelector('.hackverse-shell')?.classList.contains('low-power');

  const handleMove = useCallback((e) => {
    if (isLowPower) return;
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, [isLowPower]);

  return (
    <div
      ref={divRef}
      onMouseMove={isLowPower ? undefined : handleMove}
      onMouseEnter={isLowPower ? undefined : () => setOpacity(1)}
      onMouseLeave={isLowPower ? undefined : () => setOpacity(0)}
      className={`relative rounded-2xl border border-white/10 bg-[#0A0514]/70 backdrop-blur-[20px] overflow-hidden group transition-all duration-300 hover:border-white/20 hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)] ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition duration-300 z-10"
        style={{
          opacity: isLowPower ? 0 : opacity,
          background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="absolute inset-0 noise-overlay pointer-events-none z-[5]" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer pointer-events-none z-0" />
      <div className="relative z-20 h-full">{children}</div>
    </div>
  );
};

const Scrambler = ({ text, className }) => {
  const { displayedText, setIsHovering } = useScramble(text);

  return (
    <span
      className={`cursor-default ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {displayedText}
    </span>
  );
};


/**
 * ------------------------------------------------------------------
 * MAIN COMPONENT SECTIONS
 * ------------------------------------------------------------------
 */

const Navbar = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4">
        <div
          className={`flex items-center justify-between px-5 md:px-6 py-1.5 rounded-full backdrop-blur-xl border transition-all duration-300 ${
            isScrolled
              ? 'bg-[#0b0814]/80 shadow-[0_20px_60px_rgba(0,0,0,0.5)] w-full max-w-6xl border-white/10'
              : 'bg-black/30 w-full max-w-6xl border-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="p-[0.5px] rounded-xl">
              <div className="p-0.5 rounded-[10px] w-52 h-11 sm:w-64 sm:h-14">
                <img 
                  src="/event-images/hackverse/logo.png" 
                  alt="Hackverse Logo" 
                  className="w-full h-full object-contain scale-150 sm:scale-150 origin-center"
                />
              </div>
            </div>
            {/* <span className="font-semibold text-white hidden sm:block tracking-tight">
              <span className="hv-display">HACK</span>
              <span className="text-cyan-300 hv-display">VERSE</span>
            </span> */}
          </div>

          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10">
            {['About', 'Tracks', 'Shortlist', 'Gallery', 'Timeline', 'Sponsors', 'Reach'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-5 py-2 text-[11px] font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all uppercase tracking-[0.2em]"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 md:ml-4 lg:ml-6">
            <MagneticButton
              href="https://unstop.com/o/k1azgAX?lb=MEXq7sQL&utm_medium=Share&utm_source=pranepoo5696&utm_campaign=Online_coding_challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full hover:scale-105 shadow-[0_0_24px_rgba(124,246,255,0.35)]"
            >
              <SparklesIcon size={14} /> REGISTER
            </MagneticButton>
            <button className="md:hidden text-white p-2" onClick={() => setIsOpen(true)}>
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 bg-[#05010a] z-[60] flex flex-col items-center justify-center gap-8 transition-transform duration-500 ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <button className="absolute top-8 right-8 text-white p-2" onClick={() => setIsOpen(false)}>
          <CloseIcon size={32} />
        </button>
        {['About', 'Tracks', 'Shortlist', 'Gallery', 'Timeline', 'Sponsors', 'Reach'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            onClick={() => setIsOpen(false)}
            className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 font-mono uppercase"
          >
            {item}
          </a>
        ))}
      </div>
    </>
  );
});

Navbar.displayName = 'Navbar';

const Hero = () => {
  const timeLeft = useCountdown(new Date('2026-03-13T09:00:00').getTime());

  return (
    <section className="min-h-[100dvh] sm:min-h-[100dvh] flex flex-col items-center justify-center px-4 relative pt-24 sm:pt-24 md:pt-28 pb-8 sm:pb-12 2xl:pt-36 overflow-visible sm:overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,246,255,0.08),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,123,242,0.10),transparent_40%),radial-gradient(circle_at_50%_80%,rgba(124,90,255,0.12),transparent_45%)] pointer-events-none" />

      <Reveal>
        <div className="mb-4 sm:mb-8 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mx-auto w-fit">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-red-400"></span>
          </span>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-gray-200">Registrations Closed</span>
        </div>
      </Reveal>

      <h1 className="text-[clamp(2.5rem,6vw,5rem)] sm:text-[clamp(2.75rem,7vw,9rem)] lg:text-[clamp(5rem,8vw,10rem)] 2xl:text-[clamp(6rem,9vw,12rem)] font-black tracking-[-0.04em] text-center leading-[0.85] mb-4 sm:mb-6 relative z-10">
        <Reveal delay={100} className="clip-reveal">
          <div className="hv-display text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-400">
            HACKVERSE
          </div>
        </Reveal>
        <Reveal delay={200} className="clip-reveal">
          <div className="hv-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-indigo-400 text-[clamp(2rem,5vw,4rem)] sm:text-[clamp(2.5rem,6vw,8rem)] lg:text-[clamp(4rem,7vw,9rem)] 2xl:text-[clamp(5rem,8vw,10rem)] mt-1 sm:mt-2">
            2.0
          </div>
        </Reveal>
      </h1>

      <Reveal delay={300}>
        <p className="max-w-3xl 2xl:max-w-4xl text-center text-gray-300 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl mb-6 sm:mb-8 md:mb-10 font-light leading-relaxed mx-auto px-2">
          <span className="text-cyan-300 font-semibold tracking-wide">24 HOURS.</span> 50+ ELITE SQUADS. ONE EXPO.
          <br className="hidden sm:block" />
          Decode the future with hands-on labs, live demos, and a midnight sprint.
        </p>
      </Reveal>

      <Reveal delay={400} className="grid grid-cols-4 gap-1 sm:gap-2 md:gap-6 lg:gap-8 2xl:gap-10 mb-6 sm:mb-8 md:mb-10 px-2 sm:px-0">
        {[
          { l: 'DAYS', v: timeLeft.days },
          { l: 'HRS', v: timeLeft.hours },
          { l: 'MINS', v: timeLeft.minutes },
          { l: 'SECS', v: timeLeft.seconds },
        ].map((i, idx) => (
          <div key={idx} className="flex flex-col items-center group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/40 to-fuchsia-500/30 rounded-lg sm:rounded-xl blur-lg opacity-0 group-hover:opacity-80 transition-opacity duration-500" />
              <div className="relative text-base sm:text-lg md:text-3xl lg:text-5xl 2xl:text-6xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 tabular-nums animate-countdown-pulse px-1.5 sm:px-3 md:px-4 py-1 sm:py-2 rounded-lg sm:rounded-xl border border-white/10 group-hover:border-white/30 transition-all duration-300 bg-black/20">
                {String(i.v).padStart(2, '0')}
              </div>
            </div>
            <div className="text-[7px] sm:text-[9px] md:text-xs lg:text-sm text-gray-400 tracking-[0.15em] sm:tracking-[0.2em] mt-1 sm:mt-2 md:mt-3 uppercase font-semibold">
              {i.l}
            </div>
          </div>
        ))}
      </Reveal>

      <Reveal delay={500} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-2 sm:px-6">
        <MagneticButton
          href="https://unstop.com/o/k1azgAX?lb=MEXq7sQL&utm_medium=Share&utm_source=pranepoo5696&utm_campaign=Online_coding_challenge"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative px-4 sm:px-8 py-2.5 sm:py-4 bg-white text-black font-bold rounded-xl sm:rounded-2xl overflow-hidden w-full sm:w-auto min-w-[140px] sm:min-w-[180px] text-sm sm:text-base"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-indigo-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          <span className="relative z-10 group-hover:text-white flex items-center justify-center gap-2">
            APPLY NOW <ChevronRightIcon size={16} className="hidden sm:inline" />
          </span>
        </MagneticButton>
        <MagneticButton
          href="https://chat.whatsapp.com/Ede0dzJp9CBEOPLRSF8Nqe"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 sm:px-8 py-2.5 sm:py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl sm:rounded-2xl hover:bg-white/10 transition-colors w-full sm:w-auto min-w-[140px] sm:min-w-[180px] flex items-center justify-center gap-2 backdrop-blur-sm text-sm sm:text-base"
        >
          <GlobeIcon size={16} /> <span className="hidden xs:inline">JOIN</span> WHATSAPP<span className="hidden sm:inline"> GROUP</span>
        </MagneticButton>
      </Reveal>
    </section>
  );
};


const About = ({ intro, stats }) => {
  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <section id="about" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="metadata-tag">
          <BranchIcon size={14} /> [Branch: Main]
        </div>
        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-10 2xl:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.3em] text-gray-300">
              <SparklesIcon size={14} /> Mission Brief
            </div>
            <h2 className="mt-6 text-4xl md:text-6xl 2xl:text-7xl font-bold hv-display leading-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-purple-300 to-emerald-300">
              Build the next wave of tech with a global builder community.
            </h2>
            <p className="mt-6 text-base md:text-lg text-white-400 leading-relaxed max-w-2xl">
              {intro}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.25em] text-gray-400">
              <span className="inline-flex items-center gap-2">
                <MapPin size={14} className="text-cyan-300" /> CSI WIET, ULHASNAGAR, INDIA
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock size={14} className="text-fuchsia-300" /> March 13-14, 2026
              </span>
            </div>
          </div>
          <div className="space-y-6">
            {safeStats.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {safeStats.map((stat, idx) => (
                  <div
                    key={`${stat.label}-${idx}`}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className={`text-xs uppercase tracking-[0.25em] ${['Teams', 'Prize Pool', 'Tracks', 'Format'].includes(stat.label) ? 'text-fuchsia-300' : 'text-gray-500'}`}>
                      {stat.label}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white hv-display">
                      {stat.value}
                    </div>
                    {stat.note ? (
                      <p className="mt-2 text-xs text-gray-400">{stat.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const PrizePool = () => (
  <section id="prizes" className="py-28 relative">
    <div className="container mx-auto px-6">
      <div className="metadata-tag">
        <StarIcon size={14} /> [Prize Pool]
      </div>
      <Reveal className="clip-reveal">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold hv-display mb-4">Prize Pool</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
          </div>
          <p className="text-left md:text-right text-gray-400 text-sm mt-4 md:mt-0">Top teams unlock awards and recognition.</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <Reveal delay={100}>
          <SpotlightCard className="p-7 md:p-8 min-h-[220px] md:min-h-[240px] flex flex-col gap-6 relative h-full" spotlightColor="rgba(255,123,242,0.22)">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,123,242,0.18),transparent_55%)]" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-fuchsia-300">Prize Pool</span>
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center">
                <StarIcon size={18} className="text-fuchsia-300" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-semibold text-white hv-display">1.2L</h3>
              <p className="mt-2 text-sm text-gray-400">Awards, perks, and recognition for standout builds.</p>
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={200}>
          <SpotlightCard className="p-7 md:p-8 min-h-[220px] md:min-h-[240px] flex flex-col gap-6 relative h-full" spotlightColor="rgba(124,246,255,0.18)">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,246,255,0.16),transparent_55%)]" />
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-300">Certificates</span>
              <div className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center">
                <UnstopIcon size={18} className="text-cyan-300" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-white hv-display">All Shortlisted Teams</h3>
              <p className="mt-2 text-sm text-gray-400">Verified certificates for every team that makes the shortlist.</p>
            </div>
          </SpotlightCard>
        </Reveal>
      </div>
    </div>
  </section>
);

const ProblemStatements = () => {
  const revealTime = new Date(2026, 2, 12, 0, 0, 0, 0).getTime();
  const timeLeft = useCountdown(revealTime);
  const isLive = Date.now() >= revealTime;
  const paddedHours = String(timeLeft.hours).padStart(2, '0');
  const paddedMinutes = String(timeLeft.minutes).padStart(2, '0');
  const paddedSeconds = String(timeLeft.seconds).padStart(2, '0');

  const domainMeta = useMemo(
    () => ({
      'AI/ML': { icon: Cpu, accent: 'from-cyan-300 to-cyan-500', ring: 'ring-cyan-300/70' },
      Edutech: { icon: Code, accent: 'from-sky-300 to-blue-500', ring: 'ring-sky-300/70' },
      Healthcare: { icon: Activity, accent: 'from-fuchsia-300 to-pink-500', ring: 'ring-fuchsia-300/70' },
      Cybersecurity: { icon: Shield, accent: 'from-rose-300 to-red-500', ring: 'ring-rose-300/70' },
      Fintech: { icon: Layers, accent: 'from-amber-300 to-orange-500', ring: 'ring-amber-300/70' },
    }),
    []
  );

  const domainList = useMemo(
    () => ['AI/ML', 'Edutech', 'Healthcare', 'Cybersecurity', 'Fintech'],
    []
  );

  const problemStatements = useMemo(
    () => ({
  "AI/ML": [
    {
      id: "HVAI-01",
      title: "Safe-Sight: Automated PPE & Zone Auditor",
      description:
        "Safety in industrial environments is paramount, yet manual monitoring of safety protocols is often inconsistent. There is a critical need for an automated solution that can ensure workers are protected and restricted areas remain secure. This project focuses on the logic of detection and explainability to improve workplace safety standards.",
      solution:
        "Build a computer vision system that detects whether industrial workers are wearing mandatory safety gear (helmets, vests) and identifies unauthorized entry into restricted zones. The focus is on creating a reliable detection engine that can provide clear, visual feedback on safety compliance.",
      deliverables: [
        "Real-time Processing Engine: A system capable of processing video feeds (real-time or recorded) using OpenCV, YOLO, or similar computer vision libraries.",
        "Safety Dashboard: A functional interface showing the video feed with bounding boxes around detected personnel, safety gear, and restricted zones.",
        "Alert System: A logic-based notification module that triggers visual alerts whenever a PPE violation or a zone intrusion is detected."
      ]
    },
    {
      id: "HVAI-02",
      title: "Sign-Sync: Real-time Bi-Directional Sign Language Translator",
      description:
        "Barrier-free communication for the hearing and speech-impaired remains a significant gap in digital meetings, healthcare, and education. Existing solutions are often one-way or suffer from high latency, making natural, fluid conversation nearly impossible.",
      solution:
        "Build a high-speed, low-latency system that uses Computer Vision to translate Sign Language gestures into text or speech in real-time. Additionally, the system must implement reverse translation where spoken or typed text is converted back into an animated sign language avatar or visual sequence to enable bi-directional conversation.",
      deliverables: [
        "Recognition Engine: A robust computer vision model capable of identifying hand gestures and complex motion sequences.",
        "Bi-Directional Interface: A dashboard displaying translated text from signs and live avatar animations generated from input text.",
        "Performance-Optimized Pipeline: A pipeline designed for minimal lag to ensure the conversation feels natural and real-time."
      ]
    },
    {
      id: "HVAI-03",
      title: "Explainable-Med: Transparency & Interpretability in Medical AI Diagnostics",
      description:
        "Current AI diagnostic models often operate as black boxes providing accurate results without explaining the reasoning behind them. This lack of transparency leads to hesitation among medical professionals to trust AI-generated outcomes in clinical settings.",
      solution:
        "Develop a diagnostic tool implementing Explainable AI (XAI). The system should classify a medical image such as Skin Cancer or Pneumonia while simultaneously providing visual heatmaps and natural language explanations for its decisions.",
      deliverables: [
        "Core Engine: A pre-trained classification model integrated with interpretability techniques such as Grad-CAM or SHAP.",
        "Visual Transparency Module: Generation of saliency maps or heatmaps highlighting the parts of the image influencing the AI decision.",
        "Human-Centric Interface: A dashboard presenting AI findings in a clear format understandable to medical practitioners."
      ]
    }
  ],

  Cybersecurity: [
    {
      id: "HVCS-01",
      title: "Deepfake-Armor: Multi-Modal Forensic Audio/Video Verifier",
      description:
        "The advancement of generative AI has made it easy to create realistic deepfakes such as cloned voices and faces. These are increasingly used for identity theft, misinformation, and fraud.",
      solution:
        "Design a forensic tool that analyzes uploaded media for acoustic artifacts in audio and spectral inconsistencies in video pixels. The system should produce a confidence-based truth score.",
      deliverables: [
        "Multi-Modal Engine: Detection system capable of analyzing both MP4 video and MP3/WAV audio files.",
        "Forensic Visualization: Dashboard displaying a timeline marking suspicious segments.",
        "Confidence Breakdown: Truth-score with probability of manipulation based on different detected features."
      ]
    },
    {
      id: "HVCS-02",
      title: "Narco-Trace: Intelligence System for Encrypted Platform Monitoring",
      description:
        "Illegal trade has shifted to encrypted platforms like Telegram and Instagram, creating a blind spot for law enforcement. Traffickers use bots and coded language to automate drug sales.",
      solution:
        "Develop a monitoring system capable of detecting suspicious bots, analyzing communication patterns, and linking digital identifiers to real-world identities within legal frameworks.",
      deliverables: [
        "Multi-Platform Monitoring Engine: Detect and track suspicious channels or bots across Telegram and Instagram.",
        "Linguistic Intelligence Hub: NLP system identifying drug-related slang, emojis, and hashtags.",
        "Forensic Metadata Extractor: Capture identifiers like mobile numbers, email IDs, and IP metadata.",
        "Intelligence Dashboard: Real-time alerts and visualization of hotspots and bot networks."
      ]
    }
  ],

  Fintech: [
    {
      id: "HVFT-01",
      title: "DeFi-Safe: Consumer-Centric Smart Contract Vulnerability Scanner",
      description:
        "Retail investors in the DeFi and Web3 ecosystem often fall victim to hidden vulnerabilities or malicious smart contracts.",
      solution:
        "Create a user-friendly scanner where users input a smart contract address and receive an instant security audit with a risk rating.",
      deliverables: [
        "Contract Interceptor: Fetch smart contract source code using APIs such as Etherscan or Polygonscan.",
        "Automated Auditor: Scan code for vulnerabilities such as re-entrancy or hidden mint functions.",
        "Retail-Ready Dashboard: Provide a color-coded risk rating with simple explanations."
      ]
    },
    {
      id: "HVFT-02",
      title: "Claim-Swift: Automated Insurance Claims & Fraud Detection",
      description:
        "Traditional insurance claim processes are slow and prone to fraud. A transparent automated solution can improve efficiency.",
      solution:
        "Build a platform that automates the insurance claim lifecycle including claim submission, verification, and fraud detection.",
      deliverables: [
        "Automated Filing Interface: Portal simplifying documentation through OCR or AI prompts.",
        "Intelligent Verification Engine: Backend logic verifying claims against policy rules.",
        "Fraud Detection Module: Detect anomalies and suspicious patterns.",
        "Payout Pipeline API: Demonstrate automated payout processing."
      ]
    }
  ],

  Edutech: [
    {
      id: "HVET-01",
      title: "Smart-Quiz: Automated Video-to-Assessment Pipeline",
      description:
        "Creating assessments for educational videos is time-consuming and learners often passively watch content without testing retention.",
      solution:
        "Develop an AI pipeline that extracts transcripts from videos, identifies key concepts, and automatically generates quizzes.",
      deliverables: [
        "Transcription & Extraction Engine: Convert video audio into text transcripts and extract key concepts.",
        "Assessment Generator: Generate MCQs, short-answer questions, and summaries.",
        "Interactive Review Portal: Allow users to take quizzes and jump to the exact video timestamp."
      ]
    },
    {
      id: "HVET-02",
      title: "Alumni-Link: Centralized Data Management & Engagement Platform",
      description:
        "Most institutions lack a centralized system to manage alumni data and maintain engagement after graduation.",
      solution:
        "Design a digital platform where alumni maintain profiles and administrators manage engagement, mentorship programs, and networking opportunities.",
      deliverables: [
        "Role-Based Access Control: Separate interfaces for admins, alumni, and students.",
        "Self-Service Profile Engine: Alumni can update their education and career information.",
        "Admin Command Center: Dashboard for searching and filtering alumni database.",
        "Engagement Hub: Mentorship programs, announcements, and networking events."
      ]
    }
  ],

  Healthcare: [
    {
      id: "HVHC-01",
      title: "Vitals-Remote: Contactless Physiological Monitoring via Computer Vision",
      description:
        "Monitoring heart rate and respiration traditionally requires wearable sensors, which may be inconvenient or unavailable in many settings.",
      solution:
        "Use computer vision techniques like Eulerian Video Magnification to detect subtle skin color changes and chest movements from video to estimate vitals.",
      deliverables: [
        "Video Processing Pipeline: Detect and magnify subtle skin color and motion changes.",
        "Signal Analysis Engine: Extract clean pulse and breathing waveforms.",
        "Real-time Monitoring Dashboard: Display live vitals and waveform graphs alongside video feed."
      ]
    },
    {
      id: "HVHC-02",
      title: "Telemedicine Queue Optimization",
      description:
        "Inefficient telemedicine queues lead to long waiting times and doctor burnout.",
      solution:
        "Create a simulation system that predicts consultation duration and prioritizes patients dynamically to reduce wait times.",
      deliverables: [
        "Queue Simulation Module: Predict and manage patient flow using scheduling algorithms.",
        "Optimization Dashboard: Visual comparison of baseline vs optimized waiting times.",
        "Fairness Handling: Ensure standard patients are not indefinitely delayed."
      ]
    }
  ]
}),
    []
  );

  const [activeDomain, setActiveDomain] = useState('AI/ML');
  const [statementTabs, setStatementTabs] = useState({});

  const activeStatements = problemStatements[activeDomain] || [];

  const getActiveTab = (statementId) => statementTabs[statementId] || 'DESC';

  const updateTab = (statementId, tab) => {
    setStatementTabs((prev) => ({ ...prev, [statementId]: tab }));
  };

  return (
    <section id="problems" className="py-28 relative">
      <div className="container mx-auto px-6">
        <div className="metadata-tag">
          <TerminalIcon size={14} /> [Problem Statements]
        </div>
        <Reveal className="clip-reveal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold hv-display mb-4">Problem Statements</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
            </div>
            <p className="text-left md:text-right text-gray-400 text-sm mt-4 md:mt-0">
              The statement drop goes live on 12 March at 12:00 AM, exactly 24 hours before kickoff.
            </p>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <SpotlightCard className="p-8 md:p-10 bg-[#0b0814]/70">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.3em] text-gray-300">
                  <Sparkles size={14} /> {isLive ? 'Live Now' : 'Countdown Active'}
                </div>
                <h3 className="mt-4 text-2xl md:text-3xl font-semibold text-white hv-display">
                  {isLive ? 'Problem statements are now live.' : 'Problems will be announced at 12:00 AM on 12 March.'}
                </h3>
                <p className="mt-2 text-sm text-gray-400 max-w-2xl">
                  Expect curated tracks with real-world datasets, APIs, and sponsor challenges tailored for builders.
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center min-w-[210px]">
                <p className="text-xs uppercase tracking-[0.25em] text-gray-400">{isLive ? 'Status' : 'Countdown'}</p>
                <p className="mt-2 text-lg font-semibold text-cyan-200 hv-display">
                  {isLive
                    ? 'LIVE'
                    : (timeLeft.days > 0
                        ? `${timeLeft.days}D ${paddedHours}H`
                        : `${paddedHours}:${paddedMinutes}:${paddedSeconds}`)}
                </p>
                {!isLive && (
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-gray-500">
                    {timeLeft.days > 0 ? 'Days Remaining' : 'Hours : Minutes : Seconds'}
                  </p>
                )}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        <Reveal delay={260}>
          <div className="mt-10 relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a0f1f]/80 backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.2),transparent_38%),radial-gradient(circle_at_85%_20%,rgba(236,72,153,0.18),transparent_42%),radial-gradient(circle_at_50%_100%,rgba(99,102,241,0.2),transparent_44%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: 'radial-gradient(rgba(148,163,184,0.35) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[290px_1fr] min-h-[520px]">
              <aside className="border-b lg:border-b-0 lg:border-r border-white/10 p-5 md:p-6 bg-black/20">
                <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/80 mb-5">System Index</p>
                <div className="space-y-3">
                  {domainList.map((domain) => {
                    const isActive = activeDomain === domain;
                    const meta = domainMeta[domain] || domainMeta['AI/ML'];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => setActiveDomain(domain)}
                        className={`w-full text-left rounded-2xl px-4 py-3 border transition-all duration-300 ${
                          isActive
                            ? `border-white/30 bg-white/10 ring-1 ${meta.ring} shadow-[0_0_25px_rgba(56,189,248,0.22)]`
                            : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className={`inline-flex w-9 h-9 rounded-xl items-center justify-center bg-gradient-to-br ${meta.accent} text-slate-950 shrink-0`}>
                              <Icon size={18} />
                            </span>
                            <span className="text-sm md:text-[15px] font-semibold text-white truncate">{domain}</span>
                          </div>
                          <ChevronRightIcon size={16} className={`text-gray-400 transition-transform ${isActive ? 'translate-x-0.5 text-cyan-200' : ''}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="p-5 md:p-7">
                <div className="flex items-center justify-between mb-6 gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-100/80">Data Nodes</p>
                    <h3 className="mt-2 text-xl md:text-2xl font-semibold hv-display text-white">{activeDomain} Problem Statements</h3>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-gray-400">{String(activeStatements.length).padStart(2, '0')} Nodes</span>
                </div>

                {activeStatements.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-10 text-center">
                    <p className="text-sm text-gray-300">No problem statements added yet for this domain.</p>
                    <p className="mt-2 text-xs text-gray-500 uppercase tracking-[0.2em]">Add node to continue</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {activeStatements.map((statement) => {
                      const activeTab = getActiveTab(statement.id);
                      const tabButtons = ['DESC', 'SOLUTION', 'DELIVERABLES'];
                      return (
                        <article key={statement.id} className="rounded-2xl border border-white/15 bg-[#0b1224]/80 p-5 md:p-6 shadow-[0_12px_40px_rgba(2,6,23,0.55)]">
                          <p className="text-[11px] uppercase tracking-[0.24em] text-cyan-200 mb-2">{statement.id}</p>
                          <h4 className="text-lg md:text-xl font-semibold text-white leading-snug">{statement.title}</h4>

                          <div className="mt-5 inline-flex rounded-xl border border-white/15 bg-black/25 p-1 gap-1 w-full sm:w-auto overflow-x-auto">
                            {tabButtons.map((tab) => (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => updateTab(statement.id, tab)}
                                className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] rounded-lg transition whitespace-nowrap ${
                                  activeTab === tab
                                    ? 'bg-cyan-300/90 text-slate-900 font-semibold'
                                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                              >
                                [{` ${tab} `}]
                              </button>
                            ))}
                          </div>

                          <div className="mt-5 min-h-[170px] text-sm leading-relaxed text-gray-200">
                            {activeTab === 'DESC' && <p>{statement.description}</p>}
                            {activeTab === 'SOLUTION' && <p>{statement.solution}</p>}
                            {activeTab === 'DELIVERABLES' && (
                              <ul className="space-y-3 list-disc list-inside text-gray-200">
                                {statement.deliverables.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Tracks = ({ tracks }) => {
  const safeTracks = Array.isArray(tracks) ? tracks : [];
  const trackIcons = [<Cpu />, <GlobeIcon />, <Shield />, <Wifi />, <Layers />, <Server />];
  const sectionRef = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return undefined;

    const cards = Array.from(sectionEl.querySelectorAll('.track-card'));
    if (cards.length === 0) return undefined;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1, rotateX: 0 });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        autoAlpha: 0,
        y: 48,
        scale: 0.92,
        rotateX: 12,
        transformPerspective: 900,
        transformOrigin: '50% 0%'
      });
    }, sectionEl);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(cards, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: { each: 0.12, from: 'start' }
          });
        } else {
          gsap.set(cards, {
            autoAlpha: 0,
            y: 48,
            scale: 0.92,
            rotateX: 12
          });
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(sectionEl);
    return () => {
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <section id="tracks" ref={sectionRef} className="py-32 relative container mx-auto px-6">
      <div className="metadata-tag">
        <StarIcon size={14} /> [Status: Verified]
      </div>
      <Reveal className="clip-reveal">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold hv-display mb-4">
              Tracks built for futuristic builders
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
          </div>
          <p className="text-left md:text-right text-gray-400 text-sm mt-4 md:mt-0">Choose a track, form a squad, ship a demo.</p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {safeTracks.map((track, i) => (
          <div key={i} className="track-card">
            <SpotlightCard className="p-7 h-64 flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-500">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-cyan-300 group-hover:text-white group-hover:bg-fuchsia-500 transition-colors duration-300 transform group-hover:scale-110">
                  {React.cloneElement(trackIcons[i % trackIcons.length] || <Activity />, { size: 22 })}
                </div>
                <span className="text-xs uppercase tracking-[0.25em] text-gray-500">Track {String(i + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-cyan-200 transition-colors">
                  <Scrambler text={track.title} className="block" />
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">{track.desc}</p>
              </div>
            </SpotlightCard>
          </div>
        ))}
      </div>
    </section>
  );
};

const Shortlist = ({ data, lowPower = false }) => {
  const [query, setQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const fieldRef = useRef(null);
  const crosshairRef = useRef(null);
  const domainRefs = useRef({});
  const nodeRefs = useRef(new Map());
  const nodesRef = useRef([]);
  const boundsRef = useRef({});
  const rafRef = useRef(null);
  const pointerRef = useRef({ x: -9999, y: -9999 });

  const domainMeta = useMemo(
    () => ({
      Edutech: { icon: Code, color: '#7dd3fc', glow: 'rgba(125, 211, 252, 0.55)' },
      'Open Innovation': { icon: Sparkles, color: '#34d399', glow: 'rgba(52, 211, 153, 0.55)' },
      Healthcare: { icon: Activity, color: '#f472b6', glow: 'rgba(244, 114, 182, 0.55)' },
      'AI/ML': { icon: Cpu, color: '#7cf6ff', glow: 'rgba(124, 246, 255, 0.6)' },
      Fintech: { icon: Layers, color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.55)' },
      Cybersecurity: { icon: Shield, color: '#fb7185', glow: 'rgba(251, 113, 133, 0.55)' },
      Default: { icon: Activity, color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.45)' },
    }),
    []
  );

  const preferredDomains = useMemo(
    () => ['Edutech', 'Open Innovation', 'Healthcare', 'AI/ML', 'Fintech', 'Cybersecurity'],
    []
  );

  const normalizeDomain = (value) => {
    if (!value) return '';
    const key = String(value).toLowerCase().trim();
    if (key === 'ai/ml' || key === 'aiml' || key === 'ai ml') return 'AI/ML';
    if (key === 'open innovation' || key === 'open-innovation') return 'Open Innovation';
    if (key === 'edutech' || key === 'edu tech' || key === 'edu-tech') return 'Edutech';
    if (key === 'fintech' || key === 'fin tech' || key === 'fin-tech') return 'Fintech';
    if (key === 'healthcare' || key === 'health care') return 'Healthcare';
    if (key === 'cybersecurity' || key === 'cyber security') return 'Cybersecurity';
    return value;
  };

  const domainList = useMemo(() => preferredDomains, [preferredDomains]);

  const safeTeams = useMemo(() => {
    if (!Array.isArray(data?.teams)) return [];
    return data.teams.map((team, index) => ({
      id: team?.id || team?.uid || `${team?.name || team?.teamName || 'team'}-${index}`,
      name: team?.name || team?.teamName || 'Unnamed Team',
      project: team?.project || team?.projectTitle || team?.title || 'Untitled Project',
      teamLeader: team?.team_leader || team?.teamLeader || team?.leader || team?.captain || '',
      domain: normalizeDomain(team?.domain) || 'Open Innovation',
      members: Array.isArray(team?.members) ? team.members : [],
      stack: Array.isArray(team?.stack) ? team.stack : [],
      college: team?.college || team?.institute || '',
      uid: team?.uid || team?.code || '',
      status: team?.status || 'shortlisted',
    }));
  }, [data]);

  const isPlaceholder = safeTeams.length === 0;
  const placeholderTeams = useMemo(() => {
    if (!isPlaceholder) return [];
    return domainList.flatMap((domain, domainIndex) =>
      Array.from({ length: 2 }).map((_, idx) => ({
        id: `tba-${domainIndex}-${idx}`,
        name: 'TBA',
        project: 'Awaiting shortlist sync',
        teamLeader: '',
        domain,
        members: [],
        stack: [],
        college: '',
        uid: '',
        status: 'pending',
        isPlaceholder: true,
      }))
    );
  }, [domainList, isPlaceholder]);

  const teams = isPlaceholder ? placeholderTeams : safeTeams;
  const normalizedQuery = query.trim().toLowerCase();
  const scanMode = normalizedQuery.length > 0 || activeDomain !== 'All';

  useEffect(() => {
    if (normalizedQuery) {
      setActiveDomain('All');
    }
  }, [normalizedQuery]);

  const isTeamMatch = useCallback(
    (team) => {
      if (team.isPlaceholder) {
        return (!normalizedQuery || team.name.toLowerCase().includes(normalizedQuery))
          && (activeDomain === 'All' || team.domain === activeDomain);
      }
      const domainMatch = activeDomain === 'All' || team.domain === activeDomain;
      if (!domainMatch) return false;
      if (!normalizedQuery) return true;
      const searchSpace = `${team.name} ${team.project} ${team.teamLeader} ${team.uid} ${team.college}`.toLowerCase();
      return searchSpace.includes(normalizedQuery);
    },
    [activeDomain, normalizedQuery]
  );

  const matchingTeams = useMemo(() => teams.filter(isTeamMatch), [teams, isTeamMatch]);
  const totalCount = safeTeams.length > 0 ? safeTeams.length : null;
  const matchCount = isPlaceholder && !normalizedQuery ? 'TBA' : matchingTeams.length;
  const shortlistPdfUrl = data?.pdfUrl || '';

  const domainCounts = useMemo(() => {
    const counts = domainList.reduce((acc, domain) => {
      acc[domain] = 0;
      return acc;
    }, {});
    if (!safeTeams.length) return counts;
    safeTeams.forEach((team) => {
      if (counts[team.domain] !== undefined) counts[team.domain] += 1;
    });
    return counts;
  }, [domainList, safeTeams]);

  const staticPositions = useMemo(() => {
    const positions = new Map();
    domainList.forEach((domain) => {
      const domainTeams = teams.filter((team) => team.domain === domain);
      const columns = 3;
      domainTeams.forEach((team, idx) => {
        const col = idx % columns;
        const row = Math.floor(idx / columns);
        const x = 18 + col * 32;
        const y = 16 + row * 22;
        positions.set(team.id, { x, y });
      });
    });
    return positions;
  }, [domainList, teams]);

  useEffect(() => {
    if (!fieldRef.current) return undefined;

    let frame = 0;
    const nodeSize = 26;

    const updateBounds = () => {
      const nextBounds = {};
      domainList.forEach((domain) => {
        const el = domainRefs.current[domain];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        nextBounds[domain] = {
          w: rect.width,
          h: rect.height,
          left: rect.left,
          top: rect.top,
        };
      });
      boundsRef.current = nextBounds;
    };

    updateBounds();

    nodesRef.current = teams.map((team) => {
      const bounds = boundsRef.current[team.domain] || { w: 260, h: 360 };
      const maxX = Math.max(bounds.w - nodeSize, nodeSize);
      const maxY = Math.max(bounds.h - nodeSize, nodeSize);
      return {
        id: team.id,
        domain: team.domain,
        x: Math.random() * maxX,
        y: Math.random() * maxY,
        vx: (Math.random() * 0.35 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
        vy: (Math.random() * 0.35 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
      };
    });

    const animate = () => {
      frame += 1;
      if (frame % 24 === 0) updateBounds();

      const pointer = pointerRef.current;
      nodesRef.current.forEach((node) => {
        const bounds = boundsRef.current[node.domain];
        if (!bounds) return;

        node.x += node.vx;
        node.y += node.vy;

        if (node.x <= 0 || node.x >= bounds.w - nodeSize) node.vx *= -1;
        if (node.y <= 0 || node.y >= bounds.h - nodeSize) node.vy *= -1;

        node.x = Math.max(0, Math.min(node.x, bounds.w - nodeSize));
        node.y = Math.max(0, Math.min(node.y, bounds.h - nodeSize));

        const el = nodeRefs.current.get(node.id);
        if (!el) return;

        const centerX = bounds.left + node.x;
        const centerY = bounds.top + node.y;
        const dist = Math.hypot(centerX - pointer.x, centerY - pointer.y);
        const influence = Math.max(0, 1 - dist / 220);
        const scale = 0.85 + influence * 0.95;

        el.style.transform = `translate3d(${node.x}px, ${node.y}px, 0) scale(${scale})`;
        el.style.filter = influence > 0.15 ? 'blur(0px)' : 'blur(1.6px)';
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const handleResize = () => updateBounds();
    window.addEventListener('resize', handleResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [domainList, teams]);

  const handlePointerMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || -9999;
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || -9999;
    
    if (clientX === -9999 || clientY === -9999) return;
    
    pointerRef.current = { x: clientX, y: clientY };
    if (!fieldRef.current || !crosshairRef.current) return;
    
    const rect = fieldRef.current.getBoundingClientRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    
    crosshairRef.current.style.transform = `translate3d(${localX}px, ${localY}px, 0)`;
    crosshairRef.current.style.opacity = '1';
  };

  const handlePointerLeave = () => {
    pointerRef.current = { x: -9999, y: -9999 };
    if (crosshairRef.current) crosshairRef.current.style.opacity = '0';
  };

  return (
    <section id="shortlist" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="metadata-tag">
          <Cpu size={14} /> [Shortlist Field]
        </div>
        <Reveal className="clip-reveal">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold hv-display mb-4">Shortlisted Teams</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
              <p className="mt-5 text-gray-300 max-w-2xl text-base md:text-lg leading-relaxed">
                Track the shortlisted teams as living nodes in the Hackverse grid. Scan by domain, lock on a team,
                and review the technical dossier in real time.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-gray-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <TerminalIcon size={12} /> Status: {data?.status || 'TBA'}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Clock size={12} /> Sync: {data?.lastUpdated || 'Awaiting publish'}
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[1.4fr,0.6fr] gap-4 sm:gap-6">
          <Reveal delay={120}>
            <SpotlightCard className="p-4 sm:p-6 md:p-7" spotlightColor="rgba(124,246,255,0.2)">
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-cyan-300" size={16} />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search team, college, leader, or domain..."
                      className="w-full rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 py-2 sm:py-3 pl-8 sm:pl-10 pr-3 sm:pr-4 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-400 uppercase tracking-[0.3em]">
                    <MousePointer2 size={12} className="text-fuchsia-300" />
                    {scanMode ? 'Scan Mode' : 'Idle Mode'}
                  </div>
                </div>

                <div className="flex flex-nowrap gap-2 sm:gap-3 overflow-x-auto pb-2 -mx-2 sm:mx-0 px-2 sm:px-0 md:flex-wrap md:overflow-visible">
                  {['All', ...domainList].map((domain) => {
                    const meta = domainMeta[domain] || domainMeta.Default;
                    const Icon = meta.icon;
                    const isActive = activeDomain === domain;
                    return (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => setActiveDomain(domain)}
                        className={`flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full border px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] transition-all flex-shrink-0 ${
                          isActive
                            ? 'border-white/40 bg-white/10 text-white shadow-[0_0_18px_rgba(124,246,255,0.25)]'
                            : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/30'
                        }`}
                      >
                        <Icon size={12} style={{ color: meta.color }} /> <span>{domain}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1.5 sm:gap-2">
                    <Activity size={12} className="text-cyan-300" />
                    Nodes: {totalCount !== null ? totalCount : 'TBA'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 sm:gap-2">
                    <Server size={12} className="text-fuchsia-300" />
                    Matches: {matchCount}
                  </span>
                  {isPlaceholder ? (
                    <span className="inline-flex items-center gap-1.5 sm:gap-2 text-amber-300">
                      <Flame size={12} /> TBA
                    </span>
                  ) : null}
                </div>

                {shortlistPdfUrl ? (
                  <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-400">Official Shortlist</div>
                      <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-300 line-clamp-2 sm:line-clamp-none">
                        Verify final shortlist in PDF for confirmation.
                      </p>
                    </div>
                    <a
                      href={shortlistPdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-400 px-3 sm:px-5 py-2 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-black shadow-[0_0_22px_rgba(124,246,255,0.35)] hover:scale-105 transition whitespace-nowrap"
                    >
                      View PDF <ArrowRightIcon size={12} />
                    </a>
                  </div>
                ) : null}

                {normalizedQuery ? (
                  <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-black/40 p-3 sm:p-4">
                    <div className="flex items-center justify-between text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-gray-400">
                      <span>Search Results</span>
                      <span className="text-cyan-300">{matchCount}</span>
                    </div>
                    <div className="mt-2 sm:mt-3 space-y-2 sm:space-y-3 max-h-none overflow-visible pr-0 md:max-h-56 md:overflow-y-auto md:pr-2">
                      {matchingTeams.length > 0 ? (
                        matchingTeams.map((team) => (
                          <div
                            key={`result-${team.id}`}
                            className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-2 sm:p-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
                              <div className="text-xs sm:text-sm text-white font-semibold line-clamp-1">{team.name}</div>
                              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-emerald-300 whitespace-nowrap">
                                {team.status || 'shortlisted'}
                              </div>
                            </div>
                            {team.college ? (
                              <div className="mt-1 text-[9px] sm:text-xs text-gray-400">College: {team.college}</div>
                            ) : null}
                            <div className="text-[9px] sm:text-xs text-gray-400">Domain: {team.domain}</div>
                            <div className="mt-1.5 sm:mt-2 flex flex-wrap gap-1 text-[8px] sm:text-xs text-gray-300">
                              <span className="text-gray-500">Leader:</span>
                              {team.teamLeader
                                ? <span className="rounded-full border border-white/10 bg-white/5 px-1.5 sm:px-2 py-0.5">{team.teamLeader}</span>
                                : <span className="text-gray-500">TBA</span>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500">No teams found. Try a different query.</div>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-3 text-[9px] sm:text-[11px] text-gray-500">
                      Verify final shortlist in PDF for confirmation.
                    </div>
                  </div>
                ) : null}
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={200}>
            <SpotlightCard className="p-4 sm:p-6 md:p-7" spotlightColor="rgba(255,123,242,0.18)">
              <div className="space-y-4 sm:space-y-5">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-gray-400">Domain Pulse</div>
                <div className="space-y-2 sm:space-y-3">
                  {domainList.map((domain) => {
                    const meta = domainMeta[domain] || domainMeta.Default;
                    const count = totalCount !== null ? domainCounts[domain] || 0 : 'TBA';
                    return (
                      <div key={domain} className="flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300 min-w-0">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />
                          <span className="truncate text-[11px] sm:text-sm">{domain}</span>
                        </div>
                        <span className="font-mono text-cyan-200 text-xs ml-2">{count}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-[10px] sm:text-xs text-gray-400 leading-relaxed">
                  Click a node to view team details. Hover to zoom.
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

        <Reveal delay={240}>
          <div
            ref={fieldRef}
            onMouseMove={lowPower ? undefined : handlePointerMove}
            onMouseLeave={lowPower ? undefined : handlePointerLeave}
            onTouchMove={lowPower ? undefined : handlePointerMove}
            onTouchEnd={lowPower ? undefined : handlePointerLeave}
            className="mt-6 sm:mt-8 relative rounded-2xl sm:rounded-3xl border border-white/10 bg-[#06030c]/80 overflow-hidden neural-field min-h-[280px] xs:min-h-[320px] sm:min-h-[380px] lg:min-h-[450px]"
          >
            <div className="absolute inset-0 noise-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(124,246,255,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(255,123,242,0.1),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(124,90,255,0.08),transparent_45%)]" />
            <div className="flex items-center gap-3 px-6 pt-6 text-[10px] uppercase tracking-[0.35em] text-gray-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <Activity size={12} className="text-cyan-300" /> Neural Sync
              </span>
              <span className="hidden sm:inline">Gravity Locked · Sectorized</span>
            </div>
            <div ref={crosshairRef} className="neural-crosshair" aria-hidden />

            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 sm:gap-4 auto-rows-[180px] xs:auto-rows-[200px] sm:auto-rows-[240px] lg:auto-rows-[260px] p-2 xs:p-3 pt-3 xs:pt-4 sm:p-4 sm:pt-4 md:p-6 md:pt-4 relative z-10 overflow-y-auto touch-pan-y" style={{ WebkitOverflowScrolling: 'touch' }}>
              {domainList.map((domain) => {
                const meta = domainMeta[domain] || domainMeta.Default;
                const Icon = meta.icon;
                const isActive = activeDomain === 'All' || activeDomain === domain;
                const domainTeams = teams.filter((team) => team.domain === domain);
                return (
                  <div
                    key={domain}
                    ref={(el) => {
                      if (el) domainRefs.current[domain] = el;
                    }}
                    className={`neural-sector h-full ${isActive ? '' : 'opacity-35'} transition-opacity duration-300`}
                    style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <div className="flex items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 text-xs uppercase tracking-[0.25em] text-gray-400">
                      <div className="flex items-center gap-2 min-w-0">
                        <Icon size={14} style={{ color: meta.color }} />
                        <span className="truncate font-semibold">{domain}</span>
                      </div>
                      <span className="font-mono text-cyan-200 ml-2">
                        {totalCount !== null ? domainCounts[domain] || 0 : 'TBA'}
                      </span>
                    </div>
                    <div className="absolute inset-0">
                      {domainTeams.map((team) => {
                        const match = isTeamMatch(team);
                        const isDimmed = scanMode && !match;
                        const position = staticPositions.get(team.id) || { x: 50, y: 50 };
                        const baseStyle = lowPower
                          ? {
                              left: `${position.x}%`,
                              top: `${position.y}%`,
                              transform: 'translate(-50%, -50%)',
                            }
                          : { left: 0, top: 0 };
                        return (
                          <button
                            key={team.id}
                            type="button"
                            ref={(el) => {
                              if (el) nodeRefs.current.set(team.id, el);
                              else nodeRefs.current.delete(team.id);
                            }}
                            onClick={() => setSelectedTeam(team)}
                            className={`neural-node ${match ? 'neural-node-match' : ''} ${team.isPlaceholder ? 'is-placeholder' : ''}`}
                            style={{
                              ...baseStyle,
                              '--node-color': meta.color,
                              '--node-glow': meta.glow,
                              opacity: isDimmed ? 0.08 : 1,
                            }}
                          >
                            <span className="neural-node-core" />
                            <span className="neural-node-label">{team.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className={`shortlist-dossier ${selectedTeam ? 'is-open' : ''}`}>
          <div className="shortlist-dossier-inner">
            <button
              type="button"
              className="shortlist-dossier-close"
              onClick={() => setSelectedTeam(null)}
              aria-label="Close dossier"
            >
              <X size={18} />
            </button>
            {selectedTeam ? (
              <>
                <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Team Dossier</div>
                <h3 className="mt-3 text-2xl font-semibold hv-display text-white">
                  {selectedTeam.name}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
                    Domain: {selectedTeam.domain}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
                    Status: {selectedTeam.status}
                  </span>
                  {selectedTeam.uid ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-gray-300">
                      UID: {selectedTeam.uid}
                    </span>
                  ) : null}
                </div>
                {selectedTeam.college ? (
                  <div className="mt-4 text-xs text-gray-400 uppercase tracking-[0.25em]">
                    {selectedTeam.college}
                  </div>
                ) : null}
                <div className="mt-6">
                  <div className="text-xs uppercase tracking-[0.3em] text-gray-400">Team Leader</div>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-200">
                    {selectedTeam.teamLeader
                      ? <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{selectedTeam.teamLeader}</span>
                      : <span className="text-gray-500">TBA</span>}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">Select a node to open the dossier.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const Gallery = ({ images, disableMarquee = false }) => {
  const safeImages = Array.isArray(images) ? images : [];
  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="gallery" className="py-32 bg-black/20 relative border-y border-white/5">
        <div className="container mx-auto px-6 mb-12">
        <div className="metadata-tag">
          <TerminalIcon size={14} /> [Deployment: Edge]
        </div>
        <Reveal className="clip-reveal">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold hv-display mb-4">Legacy Archive</h2>
              <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
            </div>
            <p className="text-left md:text-right text-gray-400 text-sm mt-4 md:mt-0">Snapshots from Hackverse 1.0</p>
          </div>
        </Reveal>
      </div>

      <div className="relative w-full overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#05010a] to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#05010a] to-transparent z-20 pointer-events-none" />

        <div className={`flex gap-6 ${disableMarquee || prefersReducedMotion ? 'marquee-static' : 'animate-marquee'} group-hover:[animation-play-state:paused] w-max px-6`}>
          {[...safeImages, ...safeImages].map((img, i) => (
            <div
              key={i}
              className="relative w-[300px] md:w-[450px] 2xl:w-[520px] aspect-video rounded-2xl overflow-hidden border border-white/10 shrink-0 group/card cursor-pointer transition-all duration-300 hover:border-cyan-300/40 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-fuchsia-500/10 z-10 transition-opacity duration-300 group-hover/card:opacity-0" />
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-contain bg-black/40 transition-transform duration-700 grayscale group-hover/card:grayscale-0"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/450x254?text=Hackverse+2024';
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 z-20">
                <p className="text-xs text-cyan-300 mb-1 tracking-[0.25em] uppercase">{img.date}</p>
                <h3 className="text-xl font-semibold text-white tracking-wide">{img.title}</h3>
              </div>
              <div className="absolute top-4 right-4 text-white opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-20 drop-shadow-lg">
                <ImageIcon />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsArticle = () => (
  <section id="press" className="py-28 relative">
    <div className="container mx-auto px-6">
      <div className="metadata-tag">
        <TerminalIcon size={14} /> [Press Release]
      </div>
      <Reveal className="clip-reveal">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold hv-display mb-4">News Article</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
          </div>
          <p className="text-left md:text-right text-gray-400 text-sm mt-4 md:mt-0">Celebrating the massive success and media recognition of our flagship event.</p>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <SpotlightCard className="p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr,1.3fr] items-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <img
                src="/event-images/hackverse/hackverse_newsarticle.jpeg"
                alt="Hackverse news article"
                className="h-full w-full object-contain bg-black/40"
                loading="lazy"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.3em] text-gray-300">
                <SparklesIcon size={14} /> Media Coverage
              </div>
              <h3 className="mt-4 text-2xl md:text-3xl font-semibold text-white hv-display">
                A Milestone for Innovation: Hackverse in the News
              </h3>
              <p className="mt-3 text-sm text-gray-400">
                With 224+ teams registering for a 24-hour sprint of pure creation, Hackverse 2025 became a hub for the next generation of developers. As reported by Loksatta, the event successfully bridged the gap between academic learning and real-world problem solving.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-gray-500">
                <span>Tech News Daily</span>
                <span>April 2025</span>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-[0.25em] text-white hover:bg-white/20 transition"
                >
                  Read Article <ArrowRightIcon size={16} />
                </a>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Reveal>
    </div>
  </section>
);

const Timeline = ({ events }) => {
  const safeEvents = Array.isArray(events) ? events : [];

  return (
    <section id="timeline" className="py-20 md:py-32 relative timeline-shell overflow-hidden bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent">
      <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(124, 246, 255, 0.9), 0 0 30px 5px rgba(124, 246, 255, 0.7);
          }
          50% {
            box-shadow: 0 0 0 25px rgba(124, 246, 255, 0), 0 0 30px 5px rgba(124, 246, 255, 0.7);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(124, 246, 255, 0), 0 0 30px 5px rgba(124, 246, 255, 0.7);
          }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.2); }
          28% { transform: scale(1); }
          42% { transform: scale(1.2); }
          56% { transform: scale(1); }
        }
        
        @keyframes glow-fade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes float-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }

        @keyframes number-float {
          0%, 100% { opacity: 0.2; transform: translateY(0px); }
          50% { opacity: 0.4; transform: translateY(-10px); }
        }
        
        .pulse-circle {
          animation: pulse-ring 2.8s infinite;
        }
        
        .heartbeat-icon {
          animation: heartbeat 1.6s ease-in-out infinite;
        }
        
        .glow-line {
          animation: glow-fade 3.5s ease-in-out infinite;
          filter: drop-shadow(0 0 8px rgba(124, 246, 255, 0.8));
        }

        .timeline-container {
          perspective: 1200px;
        }

        .timeline-card {
          backdrop-filter: blur(16px);
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(5, 10, 25, 0.95) 50%, rgba(10, 15, 35, 0.85) 100%);
          position: relative;
          border: 1.5px solid rgba(124, 246, 255, 0.4);
          transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5),
                      inset 0 1px 2px rgba(124, 246, 255, 0.15),
                      0 0 40px rgba(124, 246, 255, 0.1);
          overflow: hidden;
        }

        .timeline-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 20% 20%, rgba(124, 246, 255, 0.15) 0%, transparent 40%);
          pointer-events: none;
        }

        .timeline-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(124, 246, 255, 0.05) 0%, transparent 100%);
          pointer-events: none;
        }

        .timeline-card:hover {
          border-color: rgba(124, 246, 255, 0.8);
          box-shadow: 0 0 60px rgba(124, 246, 255, 0.5), 
                      inset 0 0 40px rgba(124, 246, 255, 0.2),
                      0 10px 40px rgba(0, 0, 0, 0.5);
          transform: translateY(-16px) scale(1.03);
          background: linear-gradient(135deg, rgba(15, 23, 42, 1) 0%, rgba(5, 10, 25, 1) 50%, rgba(10, 15, 35, 0.95) 100%);
        }

        .decorative-number {
          position: absolute;
          font-size: 4rem;
          font-weight: 900;
          opacity: 0.15;
          color: rgba(124, 246, 255, 0.3);
          z-index: 0;
          animation: number-float 4s ease-in-out infinite;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .timeline-svg-line {
            display: none;
          }
          .decorative-number {
            display: none;
          }
        }
      `}</style>


      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative w-full">
        <Reveal className="clip-reveal">
          <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-cyan-400/50 bg-gradient-to-r from-cyan-400/15 to-blue-400/10 backdrop-blur-md mb-6 shadow-lg shadow-cyan-400/20">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400/60" />
              <span className="text-xs md:text-sm uppercase tracking-[0.4em] text-cyan-300 font-bold">Timeline</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black hv-display mb-4 text-white drop-shadow-2xl tracking-tight">
              Execution log
            </h2>
            <p className="text-sm md:text-base text-cyan-300/70 tracking-[0.25em] uppercase font-bold letter-spacing">
              Hackathon Journey · March 2026
            </p>
          </div>
        </Reveal>

        {/* Desktop Timeline - Vertical Centered Layout */}
        <div className="hidden lg:block">
          <Reveal delay={100}>
            <div className="timeline-container relative max-w-4xl mx-auto">
              {/* SVG Vertical Connecting Lines */}
              <svg
                className="timeline-svg-line absolute left-1/2 transform -translate-x-1/2 w-2 h-full pointer-events-none top-0"
                viewBox="0 0 10 1200"
                preserveAspectRatio="none"
                style={{ minHeight: '100%' }}
              >
                <defs>
                  <linearGradient id="verticalLineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(124, 246, 255, 0.9)" />
                    <stop offset="50%" stopColor="rgba(124, 246, 255, 0.6)" />
                    <stop offset="100%" stopColor="rgba(124, 246, 255, 0.9)" />
                  </linearGradient>
                  <filter id="verticalLineGlow">
                    <feGaussianBlur stdDeviation="1.5" />
                  </filter>
                </defs>

                {/* Main vertical line */}
                <line
                  x1="5"
                  y1="0"
                  x2="5"
                  y2="100%"
                  stroke="url(#verticalLineGradient)"
                  strokeWidth="3"
                  filter="url(#verticalLineGlow)"
                  className="glow-line"
                />
              </svg>

              {/* Timeline Items - Vertical Centered */}
              <div className="space-y-20 relative z-10">
                {/* Item 1 - Left */}
                <div className="flex items-center justify-center gap-20">
                  <Reveal delay={120}>
                    <div className="w-96 flex flex-col items-end">
                      <div className="timeline-card rounded-2xl p-8 text-right w-full min-h-[200px] flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-black text-cyan-100 mb-3 tracking-wider uppercase hv-display">
                            {safeEvents[0]?.h}
                          </h3>
                          <p className="text-xs text-cyan-400 font-bold tracking-widest mb-4 uppercase">
                            {safeEvents[0]?.t}
                          </p>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                          {safeEvents[0]?.d}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                  
                  <Reveal delay={140}>
                    <div className="relative flex-shrink-0">
                      <div className="relative flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-300 to-blue-500 rounded-full blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-500" />
                        <div className="relative w-32 h-32 rounded-full border-2.5 border-cyan-400 flex items-center justify-center pulse-circle bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-2xl shadow-cyan-400/50 group-hover:shadow-cyan-400/80 transition-all duration-500">
                          <Activity className="w-14 h-14 text-cyan-200 heartbeat-icon stroke-[1.2]" />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Item 2 - Right */}
                <div className="flex items-center justify-center gap-20">
                  <Reveal delay={160}>
                    <div className="relative flex-shrink-0">
                      <div className="relative flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-300 to-indigo-500 rounded-full blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-500" />
                        <div className="relative w-32 h-32 rounded-full border-2.5 border-purple-400 flex items-center justify-center pulse-circle bg-gradient-to-br from-purple-500/20 to-indigo-600/20 shadow-2xl shadow-purple-400/50 group-hover:shadow-purple-400/80 transition-all duration-500">
                          <Search className="w-14 h-14 text-purple-200 heartbeat-icon stroke-[1.2]" />
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={180}>
                    <div className="w-96 flex flex-col items-start">
                      <div className="timeline-card rounded-2xl p-8 text-left w-full min-h-[200px] flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-black text-purple-100 mb-3 tracking-wider uppercase hv-display">
                            {safeEvents[1]?.h}
                          </h3>
                          <p className="text-xs text-purple-400 font-bold tracking-widest mb-4 uppercase">
                            {safeEvents[1]?.t}
                          </p>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                          {safeEvents[1]?.d}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Item 3 - Left */}
                <div className="flex items-center justify-center gap-20">
                  <Reveal delay={200}>
                    <div className="w-96 flex flex-col items-end">
                      <div className="timeline-card rounded-2xl p-8 text-right w-full min-h-[200px] flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-black text-fuchsia-100 mb-3 tracking-wider uppercase hv-display">
                            {safeEvents[2]?.h}
                          </h3>
                          <p className="text-xs text-fuchsia-400 font-bold tracking-widest mb-4 uppercase">
                            {safeEvents[2]?.t}
                          </p>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                          {safeEvents[2]?.d}
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={220}>
                    <div className="relative flex-shrink-0">
                      <div className="relative flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400 via-fuchsia-300 to-pink-500 rounded-full blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-500" />
                        <div className="relative w-32 h-32 rounded-full border-2.5 border-fuchsia-400 flex items-center justify-center pulse-circle bg-gradient-to-br from-fuchsia-500/20 to-pink-600/20 shadow-2xl shadow-fuchsia-400/50 group-hover:shadow-fuchsia-400/80 transition-all duration-500">
                          <Star className="w-14 h-14 text-fuchsia-200 heartbeat-icon stroke-[1.2]" />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Item 4 - Right */}
                <div className="flex items-center justify-center gap-20">
                  <Reveal delay={240}>
                    <div className="relative flex-shrink-0">
                      <div className="relative flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-400 via-violet-300 to-purple-500 rounded-full blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-400 to-purple-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-500" />
                        <div className="relative w-32 h-32 rounded-full border-2.5 border-violet-400 flex items-center justify-center pulse-circle bg-gradient-to-br from-violet-500/20 to-purple-600/20 shadow-2xl shadow-violet-400/50 group-hover:shadow-violet-400/80 transition-all duration-500">
                          <Cpu className="w-14 h-14 text-violet-200 heartbeat-icon stroke-[1.2]" />
                        </div>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={260}>
                    <div className="w-96 flex flex-col items-start">
                      <div className="timeline-card rounded-2xl p-8 text-left w-full min-h-[200px] flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-black text-violet-100 mb-3 tracking-wider uppercase hv-display">
                            {safeEvents[3]?.h}
                          </h3>
                          <p className="text-xs text-violet-400 font-bold tracking-widest mb-4 uppercase">
                            {safeEvents[3]?.t}
                          </p>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                          {safeEvents[3]?.d}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </div>

                {/* Item 5 - Left (Final) */}
                <div className="flex items-center justify-center gap-20">
                  <Reveal delay={280}>
                    <div className="w-96 flex flex-col items-end">
                      <div className="timeline-card rounded-2xl p-8 text-right w-full min-h-[200px] flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-black text-cyan-100 mb-3 tracking-wider uppercase hv-display">
                            {safeEvents[4]?.h}
                          </h3>
                          <p className="text-xs text-cyan-400 font-bold tracking-widest mb-4 uppercase">
                            {safeEvents[4]?.t}
                          </p>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-medium">
                          {safeEvents[4]?.d}
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={300}>
                    <div className="relative flex-shrink-0">
                      <div className="relative flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-300 to-teal-500 rounded-full blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-500" />
                        <div className="relative w-32 h-32 rounded-full border-2.5 border-cyan-400 flex items-center justify-center pulse-circle bg-gradient-to-br from-cyan-500/20 to-teal-600/20 shadow-2xl shadow-cyan-400/50 group-hover:shadow-cyan-400/80 transition-all duration-500">
                          <Award className="w-14 h-14 text-cyan-200 heartbeat-icon stroke-[1.2]" />
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Tablet Timeline */}
        <div className="hidden md:block lg:hidden">
          <Reveal delay={100}>
            <div className="space-y-10 max-w-2xl mx-auto">
              {safeEvents.map((e, i) => (
                <Reveal key={i} delay={i * 100}>
                  <div className="flex gap-10 items-start">
                    {/* Circle */}
                    <div className="flex-shrink-0">
                      <div className="relative flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-300 to-blue-500 rounded-full blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-500" />
                        <div className="relative w-28 h-28 rounded-full border-2.5 border-cyan-400 flex items-center justify-center pulse-circle bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-2xl shadow-cyan-400/50 group-hover:shadow-cyan-400/80 transition-all duration-500">
                          <Activity className="w-12 h-12 text-cyan-200 heartbeat-icon stroke-[1.2]" />
                        </div>
                      </div>
                    </div>
                    {/* Card */}
                    <div className="flex-1 timeline-card rounded-xl p-7 mt-2">
                      <h3 className="text-base font-black text-cyan-100 mb-3 tracking-wider uppercase hv-display">
                        {e.h}
                      </h3>
                      <p className="text-sm text-cyan-400 font-bold tracking-widest mb-4 uppercase">
                        {e.t}
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed font-medium">
                        {e.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden max-w-sm mx-auto">
          <Reveal delay={100}>
            <div className="space-y-7">
              {safeEvents.map((e, i) => (
                <Reveal key={i} delay={i * 80}>
                  <div className="flex gap-6">
                    {/* Vertical line connector */}
                    <div className="flex flex-col items-center">
                      <div className="relative flex items-center justify-center group">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-cyan-300 to-blue-500 rounded-full blur-3xl opacity-70 group-hover:opacity-90 transition-all duration-500 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-all duration-500" />
                        <div className="relative w-20 h-20 rounded-full border-2 border-cyan-400 flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-blue-600/20 shadow-lg shadow-cyan-400/50 group-hover:shadow-cyan-400/70 transition-all duration-500">
                          <Activity className="w-8 h-8 text-cyan-200 heartbeat-icon stroke-[1.5]" />
                        </div>
                      </div>
                      {i < safeEvents.length - 1 && (
                        <div className="h-6 w-0.5 bg-gradient-to-b from-cyan-400/80 to-cyan-400/20 mt-3" />
                      )}
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 timeline-card rounded-lg p-5 my-1">
                      <h3 className="text-xs font-black text-cyan-100 mb-2 tracking-wider uppercase hv-display">
                        {e.h}
                      </h3>
                      <p className="text-[10px] text-cyan-400 font-bold tracking-widest mb-3 uppercase">
                        {e.t}
                      </p>
                      <p className="text-xs text-gray-300 leading-relaxed font-medium">
                        {e.d}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const Sponsors = ({ sponsors }) => {
  const safeSponsors = Array.isArray(sponsors) ? sponsors : [];
  const sponsorsList = safeSponsors.length
    ? safeSponsors
    : [{
        title: 'Aliff Overseas',
        description: 'Official Sponsor',
        logo: '',
      }];

  const sponsorTierLabel = (title) => {
    const normalizedTitle = String(title || '').toLowerCase();
    if (normalizedTitle.includes('gajanan chavan')) return 'Supporting Partner';
    return 'Official Sponsor';
  };

  return (
    <section id="sponsors" className="py-32 container mx-auto px-6">
      <div className="metadata-tag">
        <StarIcon size={14} /> [Build: Stable]
      </div>
      <Reveal className="text-center mb-16 clip-reveal">
        <h2 className="text-4xl font-bold hv-display mb-4">Partners</h2>
        <p className="text-gray-500 text-sm">Powering the mainframe</p>
      </Reveal>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-7 items-stretch">
        {sponsorsList.map((sponsor, index) => (
          <Reveal
            key={`${sponsor.title || 'sponsor'}-${index}`}
            delay={120 + index * 60}
            className="h-full"
          >
            <SpotlightCard
              className="bg-[#080410] p-6 md:p-8 flex h-full min-h-[430px] flex-col items-center justify-between text-center gap-5"
              spotlightColor="rgba(124,246,255,0.22)"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-cyan-200">
                <StarIcon size={14} /> {sponsorTierLabel(sponsor.title)}
              </div>
              <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-md flex h-[190px] items-center justify-center">
                {sponsor.logo ? (
                  <img
                    src={sponsor.logo}
                    alt={sponsor.title || 'Sponsor'}
                    className="max-h-[130px] w-auto max-w-[85%] object-contain transition duration-500 drop-shadow-[0_10px_30px_rgba(124,246,255,0.25)]"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-xl md:text-2xl font-semibold text-white hv-display tracking-wide">
                    {sponsor.title || 'Official Sponsor'}
                  </div>
                )}
              </div>
              <div className="space-y-2 min-h-[112px] flex flex-col items-center justify-start">
                <h3 className="text-xl md:text-2xl font-semibold text-white hv-display leading-tight min-h-[56px] flex items-center">
                  {sponsor.title || 'Official Sponsor'}
                </h3>
                <p className="text-sm text-gray-400 max-w-[34ch] mx-auto">
                  {sponsor.description || 'Official sponsor for Hackverse 2.0.'}
                </p>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const ReachOut = () => (
  <section id="reach" className="py-24 relative">
    <div className="container mx-auto px-6">
      <div className="metadata-tag">
        <TerminalIcon size={14} /> [Reach Out]
      </div>
      <Reveal className="clip-reveal">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold hv-display mb-4">Reach Out</h2>
            <div className="h-1 w-24 bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
          </div>
          <p className="text-left md:text-right text-gray-400 text-sm mt-4 md:mt-0">
            Find the venue fast and get in touch with the team.
          </p>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <SpotlightCard className="p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr,1.2fr] items-start">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[11px] uppercase tracking-[0.3em] text-gray-300">
                <MapPin size={14} /> Venue & Contact
              </div>
              <h3 className="mt-4 text-2xl md:text-3xl font-semibold text-white hv-display">
                Watumull Institute of Engineering and Technology
              </h3>
              <p className="mt-3 text-sm text-gray-400">
                CSI WIET, Ulhasnagar, Maharashtra, India.
              </p>

              <div className="mt-6 space-y-4 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-fuchsia-300 mt-0.5" />
                  <div>
                    <p>CSI WIET, Ulhasnagar, Maharashtra, India</p>
                    <a
                      href="https://maps.app.goo.gl/kVPHGcGF12z9fT4U7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-300 hover:text-white transition-colors"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-cyan-300" />
                  <span>+91-8591768659</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-cyan-300" />
                  <span>csi@watumull.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock size={16} className="text-cyan-300" />
                  <span>March 13-14, 2026</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://maps.app.goo.gl/kVPHGcGF12z9fT4U7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white hover:bg-white/20 transition"
                >
                  Get Directions
                </a>
                <a
                  href="https://chat.whatsapp.com/Ede0dzJp9CBEOPLRSF8Nqe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-white/10 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white hover:border-white/30 transition"
                >
                  Join Group
                </a>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
              <div className="px-4 py-3 text-xs uppercase tracking-[0.35em] text-gray-400">Find Us</div>
              <div className="h-64 md:h-72">
                <iframe
                  title="Watumull Institute of Engineering and Technology"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10778.099081122564!2d73.14900814965492!3d19.216778525856228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce9b0092e491%3A0x925bbfe8e99a6a63!2sWatumull%20Institute%20Of%20Engineering%20And%20Technology!5e0!3m2!1sen!2sin!4v1770727116743!5m2!1sen!2sin"
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </SpotlightCard>
      </Reveal>
    </div>
  </section>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What are the dates for Hackverse 2.0?",
      answer: "Hackverse 2.0 will be held on 13th - 14th March 2026 at Watumull Institute of Engineering and Technology (WIET), Ulhasnagar, Mumbai."
    },
    {
      question: "How many members can be in a team?",
      answer: "Teams can have 2 to 4 members. You can participate duo or form a team of up to 4 people."
    },
    {
      question: "Is there a registration fee?",
      answer: "Round 1 is completely free for all participants. Only shortlisted teams for Round 2 (the final hackathon) will need to pay a registration fee of Rs. 800 per team."
    },
    {
      question: "What are the eligibility criteria?",
      answer: "Hackverse 2.0 is open to all undergraduate students. However, team members must be from the same college (different branches are allowed)."
    },
    {
      question: "Can my team have members from different colleges?",
      answer: "No, all team members must be from the same college. However, members from different branches within the same college are allowed."
    },
    {
      question: "What are the available domains/tracks?",
      answer: "The hackathon features five domains: AI/ML, Cybersecurity, FinTech, Healthcare, EduTech and Open Innovation. Teams can choose any one domain for their project."
    },
    {
      question: "How many rounds are there?",
      answer: "There are 2 rounds. Round 1 is an online screening round, and Round 2 is the main 24-hour offline hackathon at WIET."
    },
    {
      question: "What happens in Round 1?",
      answer: "Round 1 is free and online. Team leaders must submit their team members' resumes and GitHub profiles. Selected teams may receive a phone call for a short telephonic interview based on their domain. Registrations are open from 12th February to 2nd March 2026."
    },
    {
      question: "How many teams will advance to Round 2?",
      answer: "Approximately 50-55 teams will be shortlisted from Round 1 to participate in the final hackathon (Round 2)."
    },
    {
      question: "What happens in Round 2?",
      answer: "Round 2 is the main offline hackathon at WIET. Shortlisted teams will choose from a list of problem statements and have 24 hours to develop and present innovative solutions to our panel of judges."
    },
    {
      question: "Will food and accommodation be provided?",
      answer: "Yes! Food and accommodation will be provided to all shortlisted participants on both days (13th and 14th March 2026) at the venue."
    },
    {
      question: "When do registrations open and close?",
      answer: "Registrations for Round 1 open on 12th February 2026 and close on 4th March 2026."
    },
    {
      question: "What documents do I need to submit?",
      answer: "For Round 1, team leaders need to submit resumes and GitHub profile links for all team members. These will be reviewed for domain expertise and project experience."
    },
    {
      question: "Where will the final hackathon be held?",
      answer: "The final hackathon (Round 2) will be held at Watumull Institute of Engineering and Technology (WIET), Ulhasnagar, Mumbai, Maharashtra, India."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="metadata-tag">
          <HelpCircle size={14} /> [Support: Available]
        </div>
        <Reveal className="text-center mb-16 clip-reveal">
          <h2 className="text-4xl md:text-5xl font-bold hv-display mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-sm md:text-base">Everything you need to know about Hackverse 2.0</p>
        </Reveal>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Reveal key={index} delay={index * 50}>
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#0A0514]/50 backdrop-blur-sm hover:border-white/20 transition-all duration-300">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <span className="text-base md:text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-cyan-300 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-sm md:text-base text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={800}>
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-4">Still have questions?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:csi@watumull.edu"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                <Mail size={16} /> Email Us
              </a>
              <a
                href="https://chat.whatsapp.com/Ede0dzJp9CBEOPLRSF8Nqe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 hover:bg-cyan-400/20 transition-colors text-sm font-medium"
              >
                <GlobeIcon size={16} /> Join Community
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const Footer = memo(() => (
  <footer className="relative border-t border-white/5 bg-black/60">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(124,246,255,0.14),transparent_45%),radial-gradient(circle_at_88%_18%,rgba(255,123,242,0.12),transparent_45%)]" />
    <div className="container mx-auto px-6 py-6 relative z-10">
      <div className="grid gap-6 text-center place-items-center">
        <div>
          <div className="inline-flex items-center gap-3 justify-center">
            <div className="bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-indigo-500 p-[2px] rounded-xl">
              <div className="bg-black/80 p-2.5 rounded-[10px]">
                <TerminalIcon size={18} className="text-cyan-300" />
              </div>
            </div>
            <h2 className="text-2xl font-bold hv-display">
              HACK<span className="text-cyan-300">VERSE 2.0</span>
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-2 max-w-md mx-auto">
            Hackverse 2.0 is a 24-hour build sprint where creators prototype bold ideas, ship fast, and learn together.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Watumull Institute Of Engineering And Technology
          </p>
          <p className="text-xs text-gray-500">Organized by CSI</p>
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            <a
              href="https://www.instagram.com/csi_wiet/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition inline-flex items-center gap-2 text-xs"
              aria-label="Instagram"
            >
              <InstagramIcon size={16} /> Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/108724999"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition inline-flex items-center gap-2 text-xs"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={16} /> LinkedIn
            </a>
            <a
              href="https://unstop.com/o/k1azgAX?lb=MEXq7sQL&utm_medium=Share&utm_source=pranepoo5696&utm_campaign=Online_coding_challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full border border-white/10 text-gray-300 hover:text-white hover:border-white/30 transition inline-flex items-center gap-2 text-xs"
              aria-label="Unstop"
            >
              <UnstopIcon size={16} /> Unstop
            </a>
          </div>
        </div>

      </div>

      <div className="mt-6 pt-3 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-gray-600">
        <span>(C) 2026 HACKVERSE INC. SYSTEM STATUS: NORMAL.</span>
        <span>Built for Developers.</span>
      </div>
    </div>
  </footer>
));

Footer.displayName = 'Footer';

/**
 * ------------------------------------------------------------------
 * MAIN EXPORT
 * ------------------------------------------------------------------
 */

export const HackversePage = () => {
  const scrollProgress = useScrollProgress();
  const isLowPower = useLowPowerMode();
  const [hackverseData, setHackverseData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/data/db.json')
      .then((response) => response.json())
      .then((data) => {
        if (!isMounted) return;
        setHackverseData(data?.data?.hackverse || null);
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error('Error fetching hackverse data:', error);
      });

    return () => {
      isMounted = false;
    };
  }, []);


  const fallbackGallery = [
    '/event-images/hackverse/hackverseimage.png',
    '/event-images/hackverse/hackverse_newsarticle.jpeg',
    '/event-images/hackverse/hackverse_logo.jpeg',
  ];

  const fallbackAboutIntro =
    "HackVerse 2.0is Mumbai's premier 24-hour build sprint where 220+ innovators collide to prototype the future. Dive into curated tracks, sync with expert mentors, and push through the midnight sprint to ship your vision. Fuel up and get recognized for the boldest solutions.";

  const fallbackStats = [
    { label: 'Teams', value: '180+', note: 'Across 10+ campuses' },
    { label: 'Prize Pool', value: '1.2L', note: 'Prizes, Fuel, and Recognition' },
    { label: 'Tracks', value: '06', note: 'AI/ML, Web3, Cybersecurity, and more' },
    { label: 'Format', value: '24H', note: 'Live, in-person buildathon' },
  ];

  const fallbackShortlist = {
    status: 'TBA',
    lastUpdated: 'Awaiting publish',
    domains: ['AI/ML', 'Blockchain', 'Web3', 'Cybersecurity', 'Open Innovation'],
    teams: [],
  };

  const gallerySource = Array.isArray(hackverseData?.gallery) && hackverseData.gallery.length > 0
    ? hackverseData.gallery
    : fallbackGallery;

  const galleryImages = gallerySource
    .map((item, index) => {
      if (typeof item === 'string') {
        return { url: item, title: `ARCHIVE_${index + 1}`, date: '2024.LOG' };
      }
      if (item && typeof item === 'object') {
        return {
          url: item.url || item.image || '',
          title: item.title || `ARCHIVE_${index + 1}`,
          date: item.date || '2024.LOG',
        };
      }
      return null;
    })
    .filter((img) => img && img.url);

  const sponsors = Array.isArray(hackverseData?.sponsors)
    ? hackverseData.sponsors
    : [];

  const tracks = Array.isArray(hackverseData?.tracks)
    ? hackverseData.tracks
        .map((track) => ({
          title: track?.title || 'Track',
          desc: track?.description || track?.desc || '',
        }))
        .filter((track) => track.title || track.desc)
    : [];

  const aboutIntro = hackverseData?.about?.intro || hackverseData?.about?.description || fallbackAboutIntro;

  const aboutStats = Array.isArray(hackverseData?.stats) && hackverseData.stats.length > 0
    ? hackverseData.stats
        .map((stat) => ({
          label: stat?.label || stat?.title || 'Metric',
          value: stat?.value || '--',
          note: stat?.note || stat?.desc || '',
        }))
        .filter((stat) => stat.label || stat.value || stat.note)
    : fallbackStats;

  const timelineEvents = Array.isArray(hackverseData?.timeline)
    ? hackverseData.timeline
        .map((event) => ({
          t: event?.time || '',
          h: event?.title || 'Milestone',
          d: event?.description || '',
          s: event?.status || 'pending',
        }))
        .filter((event) => event.h || event.d || event.t)
    : [];

  const shortlistData = hackverseData?.shortlist || fallbackShortlist;

  return (
    <div className={`hackverse-shell min-h-[100dvh] text-white selection:bg-cyan-300 selection:text-black overflow-x-hidden overflow-y-auto ${isLowPower ? 'low-power' : ''}`} style={{ scrollBehavior: 'smooth' }}>
      {/* Loading Animation */}
      <BootLoader />

      {/* Custom Trailing Cursor */}
      <HackverseCursor minWidth={900} />

      {/* Scroll Progress Bar - Background Glow */}
      <div 
        className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-[99] opacity-40 blur-md pointer-events-none"
        style={{ 
          transform: `translate3d(0, 0, 0) scaleX(${scrollProgress})`, 
          transformOrigin: 'left', 
          transition: 'transform 0.15s ease-out',
          willChange: scrollProgress > 0 && scrollProgress < 1 ? 'transform' : 'auto'
        }}
      />

      {/* Scroll Progress Bar - Main Bar */}
      <div 
        className="fixed top-0 left-0 w-full h-[3px] bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-indigo-400 z-[100] shadow-[0_0_15px_rgba(124,246,255,0.8),0_0_30px_rgba(255,123,242,0.6)] pointer-events-none"
        style={{ 
          transform: `translate3d(0, 0, 0) scaleX(${scrollProgress})`, 
          transformOrigin: 'left', 
          transition: 'transform 0.15s ease-out',
          willChange: scrollProgress > 0 && scrollProgress < 1 ? 'transform' : 'auto'
        }}
      />

      {/* Scroll Progress Bar - Top Shine */}
      <div 
        className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-white/30 via-white/60 to-white/30 z-[101] blur-sm pointer-events-none"
        style={{ 
          transform: `translate3d(0, 0, 0) scaleX(${scrollProgress})`, 
          transformOrigin: 'left', 
          transition: 'transform 0.15s ease-out',
          willChange: scrollProgress > 0 && scrollProgress < 1 ? 'transform' : 'auto'
        }}
      />

      {/* Navigation */}
      <Navbar />

      {/* Background Canvas */}
      <BinaryStreamBg scrollProgress={scrollProgress} enabled={!isLowPower} />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero />
        <LazyRender>
          <About intro={aboutIntro} stats={aboutStats} />
        </LazyRender>
        <LazyRender>
          <PrizePool />
        </LazyRender>
        <LazyRender>
          <ProblemStatements />
        </LazyRender>
        <LazyRender>
          <Tracks tracks={tracks} />
        </LazyRender>
        <LazyRender>
          <Shortlist data={shortlistData} lowPower={isLowPower} />
        </LazyRender>
        <LazyRender>
          <Gallery images={galleryImages} disableMarquee={false} />
        </LazyRender>
        <LazyRender>
          <NewsArticle />
        </LazyRender>
        <LazyRender>
          <Timeline events={timelineEvents} />
        </LazyRender>
        <LazyRender>
          <Sponsors sponsors={sponsors} />
        </LazyRender>
        <LazyRender>
          <ReachOut />
        </LazyRender>
        <LazyRender>
          <FAQ />
        </LazyRender>
        <Footer />
      </main>

      {/* Global Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        .hackverse-shell {
          background: transparent;
          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .hackverse-shell::before {
          content: "";
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at 20% 10%, rgba(129, 140, 248, 0.18), transparent 45%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.2), transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(129, 140, 248, 0.16), transparent 45%);
          opacity: 0.35;
          z-index: -2;
          pointer-events: none;
          will-change: auto;
        }

        .hv-display {
          font-family: 'Geist Mono', 'JetBrains Mono', system-ui, sans-serif;
          letter-spacing: 0.02em;
        }

        .metadata-tag {
          position: absolute;
          top: 8px;
          right: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.45);
          pointer-events: none;
        }

        .noise-overlay {
          opacity: 0.15;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
          background-size: 140px 140px;
          mix-blend-mode: soft-light;
        }

        .hackverse-shell ::selection {
          background: #a855f7;
          color: #f8fafc;
        }

        @media (min-width: 1800px) {
          .hackverse-shell .container {
            max-width: 1600px;
          }
        }

        .gsap-reveal {
          will-change: auto;
        }

        .gsap-reveal.animating {
          will-change: transform, opacity;
        }

        .clip-reveal {
          will-change: auto;
        }

        .clip-reveal.animating {
          will-change: clip-path;
        }

        .magnetic-glow {
          box-shadow: 0 0 0 rgba(129, 140, 248, 0.0);
          transition: box-shadow 250ms ease, filter 250ms ease;
          will-change: auto;
        }

        .magnetic-glow:hover {
          box-shadow: 0 0 26px rgba(129, 140, 248, 0.35);
          filter: saturate(1.1);
          will-change: box-shadow, filter;
        }

        @keyframes shimmer {
          0% {
            transform: translate3d(-150%, 0, 0) skewX(-20deg);
          }
          50%,
          100% {
            transform: translate3d(200%, 0, 0) skewX(-20deg);
          }
        }

        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }

        @keyframes countdown-pulse {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            text-shadow: 0 0 10px rgba(124, 246, 255, 0.35), 0 0 24px rgba(255, 123, 242, 0.25);
          }
          50% {
            transform: translate3d(0, 0, 0) scale(1.08);
            text-shadow: 0 0 18px rgba(124, 246, 255, 0.5), 0 0 28px rgba(255, 123, 242, 0.45);
          }
        }

        @keyframes glow-border {
          0%, 100% {
            box-shadow: 0 0 10px rgba(124, 246, 255, 0.25), inset 0 0 10px rgba(255, 123, 242, 0.12);
          }
          50% {
            box-shadow: 0 0 20px rgba(124, 246, 255, 0.45), inset 0 0 20px rgba(255, 123, 242, 0.25);
          }
        }

        @keyframes float-up {
          0% {
            opacity: 0;
            transform: translate3d(0, 10px, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
          will-change: auto;
        }

        .animate-marquee:hover {
          will-change: transform;
        }

        .marquee-static {
          animation: none;
          transform: translate3d(0, 0, 0);
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-countdown-pulse {
          animation: countdown-pulse 1.5s ease-in-out infinite;
        }

        .countdown-glow {
          animation: glow-border 2s ease-in-out infinite;
        }

        .timeline-shell {
          overflow: hidden;
        }

        .timeline-scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          top: 0;
          background: linear-gradient(90deg, transparent, rgba(124, 246, 255, 0.35), transparent);
          animation: scanline 6s linear infinite;
          opacity: 0.6;
          pointer-events: none;
        }

        .timeline-time {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
          color: #7cf6ff;
          transition: all 240ms ease;
          will-change: auto;
        }

        .timeline-time:hover,
        .timeline-time-active {
          will-change: box-shadow, border-color;
        }

        .timeline-time-active {
          box-shadow: 0 0 18px rgba(124, 246, 255, 0.35);
          border-color: rgba(124, 246, 255, 0.5);
        }

        .timeline-dot {
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 2px solid rgba(148, 163, 184, 0.35);
          background: rgba(5, 1, 10, 0.8);
          display: grid;
          place-items: center;
          transition: border-color 200ms ease, box-shadow 200ms ease;
        }

        .timeline-dot-core {
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: rgba(124, 246, 255, 0.7);
          box-shadow: 0 0 12px rgba(124, 246, 255, 0.6);
        }

        .timeline-dot-active {
          border-color: rgba(124, 246, 255, 0.8);
          box-shadow: 0 0 18px rgba(124, 246, 255, 0.35);
          animation: pulse-ring 2.8s ease-in-out infinite;
        }

        .timeline-item:hover .timeline-connector {
          background: linear-gradient(90deg, rgba(124, 246, 255, 0.35), transparent);
        }

        @keyframes scanline {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.0;
          }
          20% {
            opacity: 0.5;
          }
          100% {
            transform: translate3d(0, 520px, 0);
            opacity: 0;
          }
        }

        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 0 12px rgba(124, 246, 255, 0.35);
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            box-shadow: 0 0 24px rgba(124, 246, 255, 0.55);
            transform: translate3d(0, 0, 0) scale(1.08);
          }
        }

        * {
          -webkit-tap-highlight-color: transparent;
        }
        
        img, video {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }
        
        img {
          content-visibility: auto;
        }
        
        section {
          contain: layout style;
        }
        
        .container {
          contain: layout style paint;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee,
          .animate-shimmer,
          .animate-countdown-pulse {
            animation: none !important;
          }
        }

        .hackverse-shell.low-power .animate-marquee,
        .hackverse-shell.low-power .animate-shimmer,
        .hackverse-shell.low-power .animate-countdown-pulse,
        .hackverse-shell.low-power .countdown-glow {
          animation: none !important;
          will-change: auto !important;
        }

        .neural-field {
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.45), inset 0 0 40px rgba(124, 246, 255, 0.06);
        }

        .neural-sector {
          position: relative;
          border-radius: 22px;
          background: linear-gradient(180deg, rgba(9, 6, 16, 0.8), rgba(6, 4, 12, 0.9));
          overflow: hidden;
        }

        .neural-sector::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(124, 246, 255, 0.06), transparent 60%);
          opacity: 0.6;
          pointer-events: none;
        }

        .neural-node {
          position: absolute;
          width: 26px;
          height: 26px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: rgba(8, 7, 14, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 18px var(--node-glow);
          transition: opacity 200ms ease, border-color 200ms ease;
          will-change: transform;
          z-index: 2;
        }

        .neural-node.is-placeholder {
          border-style: dashed;
          opacity: 0.65;
        }

        .neural-node-core {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--node-color);
          box-shadow: 0 0 12px var(--node-glow);
        }

        .neural-node-label {
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          opacity: 0;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          white-space: nowrap;
          color: rgba(226, 232, 240, 0.9);
          transition: opacity 200ms ease, transform 200ms ease;
          pointer-events: none;
        }

        .neural-node:hover .neural-node-label,
        .neural-node.neural-node-match .neural-node-label {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .neural-crosshair {
          position: absolute;
          width: 54px;
          height: 54px;
          border-radius: 999px;
          border: 1px solid rgba(124, 246, 255, 0.3);
          pointer-events: none;
          opacity: 0;
          transform: translate3d(-100px, -100px, 0);
          animation: crosshair-pulse 2.8s ease-in-out infinite;
          z-index: 20;
        }

        .neural-crosshair::before,
        .neural-crosshair::after {
          content: "";
          position: absolute;
          background: rgba(124, 246, 255, 0.4);
        }

        .neural-crosshair::before {
          width: 1px;
          height: 100%;
          left: 50%;
          top: 0;
        }

        .neural-crosshair::after {
          height: 1px;
          width: 100%;
          left: 0;
          top: 50%;
        }

        .shortlist-dossier {
          position: fixed;
          right: 24px;
          bottom: 24px;
          width: min(360px, 90vw);
          transform: translateX(120%);
          transition: transform 300ms ease;
          z-index: 80;
        }

        .shortlist-dossier.is-open {
          transform: translateX(0);
        }

        .shortlist-dossier-inner {
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(8, 6, 14, 0.92);
          backdrop-filter: blur(16px);
          padding: 20px;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
        }

        .shortlist-dossier-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          display: grid;
          place-items: center;
          color: #e2e8f0;
        }

        @keyframes crosshair-pulse {
          0%, 100% {
            box-shadow: 0 0 12px rgba(124, 246, 255, 0.25);
          }
          50% {
            box-shadow: 0 0 20px rgba(124, 246, 255, 0.45);
          }
        }

        @media (max-width: 768px) {
          .metadata-tag {
            position: static;
            margin-bottom: 12px;
          }

          .shortlist-dossier {
            right: 12px;
            left: 12px;
            width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default HackversePage;

