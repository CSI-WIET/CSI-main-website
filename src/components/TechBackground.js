/*
  Dev note: TechBackground uses Three.js to render a decorative background.
  - Theme-specific colors and blending are implemented near the material definitions.
  - Renderer DOM element z-index is intentionally set to `-1` and pointer events disabled.
  - Avoid altering animation loop timing unless you want to modify global background motion.
*/
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// TechBackground: a theme-aware Three.js background using InstancedMesh
// Requirements implemented:
// - Light-mode nodes: dark slate grey (0x334455) with NormalBlending
// - Dark-mode nodes: electric blue (0x00aaff) with AdditiveBlending
// - renderer.domElement.style.zIndex is set to '-1' permanently
// - Wrapper div receives explicit background color via style prop

const TechBackground = ({ isDarkMode = true }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    let cleanup = null;

    function initThree() {
      const container = containerRef.current;
      if (!container) return;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      // Clamp DPR to reduce fill-rate on mobile devices
      const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
      const vv = window.visualViewport
      const initW = vv ? Math.floor(vv.width) : window.innerWidth
      const initH = vv ? Math.floor(vv.height) : window.innerHeight
      renderer.setSize(initW, initH);
      renderer.domElement.style.position = 'fixed';
      renderer.domElement.style.top = '0';
      renderer.domElement.style.left = '0';
      // Use viewport units for accurate mobile sizing
      renderer.domElement.style.width = '100vw';
      renderer.domElement.style.height = '100dvh';
      // Permanent z-index '-1' as requested
      renderer.domElement.style.zIndex = '-1';
      // Use a reasonable mix-blend-mode: keep screen for dark glow, normal for light
      renderer.domElement.style.mixBlendMode = isDarkMode ? 'screen' : 'normal';
      renderer.domElement.style.pointerEvents = 'none';
      container.appendChild(renderer.domElement);

      // Scene + camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, initW / initH, 1, 4000);
      // Pull back slightly on small screens so the lattice remains fully visible
      camera.position.set(0, 0, initW < 480 ? 1050 : 900);

      const lattice = new THREE.Group();
      scene.add(lattice);

      // Lattice parameters
      const sx = 12;
      const sy = 6;
      const sz = 4;
      // Scale spacing a bit on small screens to avoid clipping at edges
      const spacing = initW < 480 ? 54 : initW < 768 ? 58 : 62;
      const count = sx * sy * sz;

      const nodeGeo = new THREE.SphereGeometry(2.6, 10, 10);

      // Node materials per theme
      const darkNodeMat = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
      });
      darkNodeMat.depthWrite = false;

      // Light-mode: use electric-blue palette so nodes pop on white backgrounds
      const lightNodeMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff, // bright electric cyan
        transparent: true,
        opacity: 0.95,
        blending: THREE.NormalBlending,
      });
      lightNodeMat.depthWrite = true;

      const nodeMat = isDarkMode ? darkNodeMat : lightNodeMat;

      const instanced = new THREE.InstancedMesh(nodeGeo, nodeMat, count);
      instanced.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

      const dummy = new THREE.Object3D();
      let idx = 0;
      const positions = [];
      for (let z = 0; z < sz; z++) {
        for (let y = 0; y < sy; y++) {
          for (let x = 0; x < sx; x++) {
            const px = (x - (sx - 1) / 2) * spacing + (Math.random() - 0.5) * 6;
            const py = (y - (sy - 1) / 2) * spacing + (Math.random() - 0.5) * 6;
            const pz = (z - (sz - 1) / 2) * spacing + (Math.random() - 0.5) * 8;
            positions.push(px, py, pz);
            dummy.position.set(px, py, pz);
            dummy.updateMatrix();
            instanced.setMatrixAt(idx++, dummy.matrix);
          }
        }
      }
      lattice.add(instanced);

      // Lines
      const linePositions = [];
      function idxAt(x, y, z) {
        return z * (sx * sy) + y * sx + x;
      }
      for (let z = 0; z < sz; z++) {
        for (let y = 0; y < sy; y++) {
          for (let x = 0; x < sx; x++) {
            const i = idxAt(x, y, z);
            const baseX = positions[i * 3];
            const baseY = positions[i * 3 + 1];
            const baseZ = positions[i * 3 + 2];
            if (x < sx - 1) {
              const j = idxAt(x + 1, y, z);
              linePositions.push(baseX, baseY, baseZ, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
            }
            if (y < sy - 1) {
              const j = idxAt(x, y + 1, z);
              linePositions.push(baseX, baseY, baseZ, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
            }
            if (z < sz - 1) {
              const j = idxAt(x, y, z + 1);
              linePositions.push(baseX, baseY, baseZ, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
            }
          }
        }
      }

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

      const darkLineMat = new THREE.LineBasicMaterial({ color: 0x7fbfe6, transparent: true, opacity: 0.12 });
      // Light-mode lines: cooler electric blue to match node color
      const lightLineMat = new THREE.LineBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.10 });
      const lineMat = isDarkMode ? darkLineMat : lightLineMat;
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      lattice.add(lines);

      // Lighting in light mode so materials read naturally
      let hemi = null;
      let dir = null;
      if (!isDarkMode) {
        hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.55);
        scene.add(hemi);
        dir = new THREE.DirectionalLight(0xffffff, 0.3);
        dir.position.set(0.5, 0.8, 0.6);
        scene.add(dir);
      }

      // Also set renderer clear color (kept) but wrapper div will have explicit background
      const bgColor = isDarkMode ? 0x0a0a0a : 0xffffff;
      renderer.setClearColor(bgColor, 1);

      // Animation
      let rafId = null;
      let rot = 0;
      function animate() {
        rot += 0.0009;
        lattice.rotation.y = rot;
        lattice.rotation.x = Math.sin(rot * 0.3) * 0.02;
        if (isDarkMode) {
          instanced.material.opacity = 0.7 + Math.abs(Math.sin(rot * 0.7)) * 0.25;
        }
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(animate);
      }
      animate();

      function handleResize() {
        const vv2 = window.visualViewport
        const w = vv2 ? Math.floor(vv2.width) : window.innerWidth
        const h = vv2 ? Math.floor(vv2.height) : window.innerHeight
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.domElement.style.width = '100vw';
        renderer.domElement.style.height = '100dvh';
      }
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);

      cleanup = () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
        try { instanced.geometry.dispose(); } catch (e) {}
        try { lineGeo.dispose(); } catch (e) {}
        try { darkNodeMat.dispose(); } catch (e) {}
        try { lightNodeMat.dispose(); } catch (e) {}
        try { darkLineMat.dispose(); } catch (e) {}
        try { lightLineMat.dispose(); } catch (e) {}
        try { renderer.dispose(); } catch (e) {}
        if (renderer.domElement && renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
        if (hemi) scene.remove(hemi);
        if (dir) scene.remove(dir);
      };
    }

    initThree();

    return () => {
      if (cleanup) cleanup();
    };
  }, [isDarkMode]);

  // Wrapper div receives explicit background color so page background remains stable
  const wrapperBg = isDarkMode ? '#0a0a0a' : '#ffffff';
  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none', background: wrapperBg }}
    />
  );
};

export default TechBackground;
