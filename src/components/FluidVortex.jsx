import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from './SoundController';
import { Compass, Zap, Flame, Wind, Sparkles } from 'lucide-react';

export default function FluidVortex() {
  const containerRef = useRef(null);
  const [vortexMode, setVortexMode] = useState('blackhole'); // blackhole, cyber, supernova, aurora
  const [particleSpeed, setParticleSpeed] = useState(1.8);
  const [singularityGravity, setSingularityGravity] = useState(3.0);

  const speedRef = useRef(1.8);
  const gravityRef = useRef(3.0);
  const updateModeRef = useRef(null);
  const triggerNovaRef = useRef(null);

  speedRef.current = particleSpeed;
  gravityRef.current = singularityGravity;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.2, 7.0);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);

    // 25,000 High-Velocity Relativistic Fluid Particles
    const count = 25000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const originalRadii = new Float32Array(count);
    const angles = new Float32Array(count);
    const speeds = new Float32Array(count);

    // Get color palette for mode
    const getPalette = (mode) => {
      switch (mode) {
        case 'supernova':
          return {
            p1: new THREE.Color('#ff0044'), // Hot Crimson
            p2: new THREE.Color('#ff7700'), // Blazing Amber
            p3: new THREE.Color('#ffdd00'), // Golden Sun
            jet: 0xff3300,
            corona: 0xff8800,
          };
        case 'aurora':
          return {
            p1: new THREE.Color('#a855f7'), // Electric Purple
            p2: new THREE.Color('#ec4899'), // Hot Pink
            p3: new THREE.Color('#38bdf8'), // Ice Blue
            jet: 0x9333ea,
            corona: 0xec4899,
          };
        case 'cyber':
          return {
            p1: new THREE.Color('#00f0ff'), // Electric Cyan
            p2: new THREE.Color('#00ff88'), // Matrix Emerald
            p3: new THREE.Color('#ffffff'), // Pure White
            jet: 0x00e5ff,
            corona: 0x00ff88,
          };
        default: // blackhole / event horizon
          return {
            p1: new THREE.Color('#00ff88'),
            p2: new THREE.Color('#00e5ff'),
            p3: new THREE.Color('#ffffff'),
            jet: 0x00e5ff,
            corona: 0x00ff88,
          };
      }
    };

    let activePalette = getPalette('blackhole');

    for (let i = 0; i < count; i++) {
      const r = 0.5 + Math.pow(Math.random(), 2.2) * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.4 * (r * 0.6);

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      originalRadii[i] = r;
      angles[i] = theta;
      speeds[i] = (1.8 / Math.sqrt(r)) * (0.8 + Math.random() * 0.4);

      const mix = Math.min(r / 4.0, 1.0);
      const col = activePalette.p1.clone().lerp(activePalette.p2, mix);
      if (r < 1.2) col.lerp(activePalette.p3, 0.7);

      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Glow texture for particles
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
    grad.addColorStop(0.7, 'rgba(0, 255, 136, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const particleTexture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.075,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.9,
    });

    const vortexMesh = new THREE.Points(geometry, material);
    scene.add(vortexMesh);

    // Central Event Horizon Black Sphere
    const horizonGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const horizonMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const horizonMesh = new THREE.Mesh(horizonGeo, horizonMat);
    scene.add(horizonMesh);

    // Glowing Event Horizon Corona Rim
    const coronaGeo = new THREE.RingGeometry(0.5, 0.76, 64);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: activePalette.corona,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coronaMesh.rotation.x = Math.PI / 2;
    scene.add(coronaMesh);

    // Relativistic Vertical Energy Jets
    const jetGeo = new THREE.CylinderGeometry(0.04, 0.4, 5.2, 16, 1, true);
    const jetMat = new THREE.MeshBasicMaterial({
      color: activePalette.jet,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const topJet = new THREE.Mesh(jetGeo, jetMat);
    topJet.position.y = 2.6;
    scene.add(topJet);

    const bottomJet = new THREE.Mesh(jetGeo, jetMat);
    bottomJet.position.y = -2.6;
    bottomJet.rotation.z = Math.PI;
    scene.add(bottomJet);

    // DYNAMIC COLOR APPLIER WHEN MODE CHANGES!
    const applyModeColors = (modeKey) => {
      const pal = getPalette(modeKey);
      const cols = geometry.attributes.color.array;

      for (let i = 0; i < count; i++) {
        const r = originalRadii[i];
        const mix = Math.min(r / 4.0, 1.0);
        const col = pal.p1.clone().lerp(pal.p2, mix);
        if (r < 1.2) col.lerp(pal.p3, 0.7);

        cols[i * 3] = col.r;
        cols[i * 3 + 1] = col.g;
        cols[i * 3 + 2] = col.b;
      }
      geometry.attributes.color.needsUpdate = true;

      // Update Corona & Jet Colors immediately
      coronaMat.color.set(pal.corona);
      jetMat.color.set(pal.jet);
    };
    updateModeRef.current = applyModeColors;

    // Trigger Nova
    let novaIntensity = 0;
    const triggerNova = () => {
      sound.playShockwave();
      novaIntensity = 2.0;
    };
    triggerNovaRef.current = triggerNova;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetMouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('click', triggerNova);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const spd = speedRef.current;
      const grav = gravityRef.current;

      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      const pos = geometry.attributes.position.array;

      if (novaIntensity > 0.01) {
        novaIntensity *= 0.94;
      }

      for (let i = 0; i < count; i++) {
        const idx = i * 3;

        angles[i] += speeds[i] * 0.015 * spd;
        let r = originalRadii[i];

        if (novaIntensity > 0.05) {
          r *= (1.0 + Math.sin(time * 14.0 + i) * novaIntensity * 0.9);
        }

        let x = Math.cos(angles[i]) * r;
        let z = Math.sin(angles[i]) * r;
        let y = pos[idx + 1];

        // Mouse Gravitational Pull
        const dx = (mouseX * 3.5) - x;
        const dz = (mouseY * 3.5) - z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 2.5) {
          const force = (1.0 - dist / 2.5) * 0.04 * grav;
          x += dx * force;
          z += dz * force;
          y += Math.sin(time * 4.0 + i) * 0.02 * grav;
        }

        pos[idx] = x;
        pos[idx + 1] = y;
        pos[idx + 2] = z;
      }

      geometry.attributes.position.needsUpdate = true;

      // Disk rotation
      vortexMesh.rotation.y = time * 0.06 * spd;
      vortexMesh.rotation.x = 0.35 + mouseY * 0.3;
      vortexMesh.rotation.z = mouseX * 0.25;

      coronaMesh.rotation.z = -time * 0.25;
      coronaMesh.scale.set(1.0 + novaIntensity * 0.6, 1.0 + novaIntensity * 0.6, 1.0);

      // Jet pulsing
      topJet.scale.y = 1.0 + Math.sin(time * 8.0) * 0.2 + novaIntensity * 1.0;
      bottomJet.scale.y = topJet.scale.y;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', triggerNova);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      horizonGeo.dispose();
      horizonMat.dispose();
      coronaGeo.dispose();
      coronaMat.dispose();
      jetGeo.dispose();
      jetMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Handle Mode Change and Instantly Recolor Particles and Jets!
  const handleModeChange = (modeKey) => {
    sound.playSweep();
    setVortexMode(modeKey);
    if (updateModeRef.current) {
      updateModeRef.current(modeKey);
    }
    if (triggerNovaRef.current) {
      triggerNovaRef.current();
    }
  };

  const modes = [
    { id: 'blackhole', label: 'EVENT HORIZON', icon: Compass, color: '#00ff88' },
    { id: 'cyber', label: 'CYBER MATRIX', icon: Wind, color: '#00e5ff' },
    { id: 'supernova', label: 'SOLAR SUPERNOVA', icon: Flame, color: '#ff3300' },
    { id: 'aurora', label: 'QUANTUM AURORA', icon: Sparkles, color: '#a855f7' },
  ];

  return (
    <section className="relative py-32 bg-[#020204] border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#00ff88] tracking-widest mb-3 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping"></span>
              <span>25,000 RELATIVISTIC GPU PARTICLES // ACCRETION DISK</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              NEURAL FLUID TORNADO
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-zinc-300 text-sm max-w-md font-sans leading-relaxed">
            Click any mode below to instantly transform particle colors, event horizon temperatures, and relativistic plasma jets.
          </p>
        </div>

        {/* 3D Viewport with High-Aura HUD */}
        <div className="relative w-full h-[660px] rounded-3xl overflow-hidden border border-[#00ff88]/30 bg-gradient-to-b from-black via-zinc-950 to-black shadow-[0_0_50px_rgba(0,255,136,0.15)] backdrop-blur-2xl">
          {/* WebGL Canvas */}
          <div ref={containerRef} className="w-full h-full cursor-crosshair" />

          {/* Top Left: Mode Switcher */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2 bg-black/85 backdrop-blur-2xl border border-white/20 p-2 rounded-2xl shadow-2xl">
            {modes.map((m) => {
              const Icon = m.icon;
              const isSel = vortexMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => handleModeChange(m.id)}
                  onMouseEnter={() => sound.playHover()}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 ${
                    isSel
                      ? 'bg-white text-black font-extrabold shadow-[0_0_25px_rgba(255,255,255,0.7)] scale-105'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" style={{ color: isSel ? '#000' : m.color }} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          {/* Top Right: Nova Detonation */}
          <div className="absolute top-6 right-6">
            <button
              onClick={() => triggerNovaRef.current && triggerNovaRef.current()}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center space-x-2 bg-[#00ff88] text-black font-extrabold text-xs font-mono px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(0,255,136,0.7)] hover:bg-white hover:scale-105 transition-all"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>COLLAPSE SINGULARITY</span>
            </button>
          </div>

          {/* Bottom HUD: Real-time Physics Sliders */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 bg-black/90 backdrop-blur-2xl border border-white/25 p-5 rounded-2xl">
            <div className="flex flex-wrap items-center gap-8">
              {/* Velocity */}
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-zinc-400">ORBITAL VELOCITY:</span>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.2"
                  value={particleSpeed}
                  onChange={(e) => setParticleSpeed(parseFloat(e.target.value))}
                  className="w-28 accent-[#00ff88] bg-zinc-700 h-1 rounded cursor-pointer"
                />
                <span className="text-[#00ff88] font-bold w-10">{particleSpeed.toFixed(1)}c</span>
              </div>

              {/* Gravity */}
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-zinc-400">GRAVITY WELL:</span>
                <input
                  type="range"
                  min="1.0"
                  max="6.0"
                  step="0.5"
                  value={singularityGravity}
                  onChange={(e) => setSingularityGravity(parseFloat(e.target.value))}
                  className="w-28 accent-[#00ff88] bg-zinc-700 h-1 rounded cursor-pointer"
                />
                <span className="text-white font-bold w-10">{singularityGravity.toFixed(1)}G</span>
              </div>
            </div>

            <div className="text-xs font-mono text-zinc-400 flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping"></span>
              <span className="text-white font-bold">25,000 GPU PARTICLES</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#00ff88]">DYNAMIC COLOR MORPH ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
