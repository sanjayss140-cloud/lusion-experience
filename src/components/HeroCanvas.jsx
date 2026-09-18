import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { blobVertexShader, blobFragmentShader } from '../shaders/organicBlobShader';
import { sound } from './SoundController';
import { Sparkles, Layers, Cpu, Flame, Zap, ArrowDown, Activity, Orbit } from 'lucide-react';

export default function HeroCanvas() {
  const containerRef = useRef(null);
  const [activeMode, setActiveMode] = useState(3); // Default to Bioluminescent (the user's favorite from screenshot!)
  const [turbulence, setTurbulence] = useState(0.5);
  const [distortion, setDistortion] = useState(0.42);
  const [fps, setFps] = useState(60);

  const activeModeRef = useRef(3);
  const turbulenceRef = useRef(0.5);
  const distortionRef = useRef(0.42);
  const triggerShockwaveRef = useRef(null);

  useEffect(() => {
    activeModeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    turbulenceRef.current = turbulence;
  }, [turbulence]);

  useEffect(() => {
    distortionRef.current = distortion;
  }, [distortion]);

  // Listen to global event when hovering projects to morph 3D entity
  useEffect(() => {
    const handleMorphEvent = (e) => {
      const { mode, turb } = e.detail;
      if (typeof mode === 'number') {
        setActiveMode(mode);
      }
      if (typeof turb === 'number') {
        setTurbulence(turb);
      }
      if (triggerShockwaveRef.current) {
        triggerShockwaveRef.current(0.7);
      }
    };

    window.addEventListener('lusion:morph', handleMorphEvent);
    return () => window.removeEventListener('lusion:morph', handleMorphEvent);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // High Density Organic Mesh
    const geometry = new THREE.IcosahedronGeometry(1.7, 72);

    const uniforms = {
      uTime: { value: 0 },
      uDistortion: { value: 0.42 },
      uFrequency: { value: 1.15 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseStrength: { value: 0.2 },
      uMode: { value: 3 }, // Default to Bioluminescent
      uShockwave: { value: 0.0 },
      uShockwaveTime: { value: 0.0 },
      uTurbulence: { value: 0.5 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: blobVertexShader,
      fragmentShader: blobFragmentShader,
      uniforms: uniforms,
      wireframe: false,
    });

    const blobMesh = new THREE.Mesh(geometry, material);
    scene.add(blobMesh);

    // 2,000 Floating Galaxy Dust Particles
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.2 + Math.random() * 8.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
      particleScales[i] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(0,255,136,0.7)');
    grad.addColorStop(0.7, 'rgba(0,229,255,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const pTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 0.1,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Cursor interaction physics
    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseCurrentX = 0;
    let mouseCurrentY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let rotationTargetX = 0;
    let rotationTargetY = 0;

    let shockwaveIntensity = 0;
    let shockwaveElapsed = 0;

    const triggerShockwave = (intensity = 1.0) => {
      shockwaveIntensity = intensity;
      shockwaveElapsed = 0;
      sound.playShockwave();
    };
    triggerShockwaveRef.current = triggerShockwave;

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      mouseTargetX = x;
      mouseTargetY = y;

      if (isDragging) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        rotationTargetY += deltaX * 0.007;
        rotationTargetX += deltaY * 0.007;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      }
    };

    const onPointerDown = (e) => {
      // Trigger instant click shockwave burst on the 3D entity!
      triggerShockwave(1.2);
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      uniforms.uMouseStrength.value = 0.5;
    };

    const onPointerUp = () => {
      isDragging = false;
      uniforms.uMouseStrength.value = 0.2;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // Scroll parallax reaction
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 1200;
      const progress = Math.min(scrollY / maxScroll, 1.0);
      
      // As user scrolls, the entity scales slightly, rotates, and moves
      camera.position.z = 4.8 + progress * 2.0;
      blobMesh.position.y = -progress * 1.5;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const clock = new THREE.Clock();
    let frameCount = 0;
    let lastFpsTime = performance.now();
    let reqId;

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      uniforms.uTime.value = elapsedTime;
      uniforms.uMode.value = activeModeRef.current;
      uniforms.uTurbulence.value = turbulenceRef.current;
      uniforms.uDistortion.value = distortionRef.current;

      // Update shockwave propagation
      if (shockwaveIntensity > 0.01) {
        shockwaveElapsed += delta * 2.5;
        shockwaveIntensity *= 0.94; // smooth exponential decay
        uniforms.uShockwave.value = shockwaveIntensity;
        uniforms.uShockwaveTime.value = shockwaveElapsed;
      } else {
        uniforms.uShockwave.value = 0.0;
      }

      // Smooth mouse lerp
      mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.08;
      mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.08;
      uniforms.uMouse.value.set(mouseCurrentX, mouseCurrentY);

      // Inertial Mesh Rotation
      blobMesh.rotation.y += 0.004 + (rotationTargetY - blobMesh.rotation.y) * 0.07;
      blobMesh.rotation.x += 0.003 + (rotationTargetX - blobMesh.rotation.x) * 0.07;

      // Breathing scale pulse
      const breath = 1.0 + Math.sin(elapsedTime * 1.5) * 0.03;
      blobMesh.scale.set(breath, breath, breath);

      // Galaxy particles rotation
      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.15;

      renderer.render(scene, camera);

      // FPS Calculation
      frameCount++;
      const now = performance.now();
      if (now - lastFpsTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsTime)));
        frameCount = 0;
        lastFpsTime = now;
      }

      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      pTexture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const modes = [
    { id: 3, label: 'BIOLUMINESCENT', icon: Flame, color: 'text-[#ff3366]' },
    { id: 0, label: 'LIQUID CHROME', icon: Sparkles, color: 'text-zinc-200' },
    { id: 1, label: 'IRIDESCENT SILK', icon: Layers, color: 'text-[#00e5ff]' },
    { id: 2, label: 'NEURAL MATRIX', icon: Cpu, color: 'text-[#00ff88]' },
    { id: 4, label: 'MOLTEN GOLD', icon: Zap, color: 'text-amber-400' },
    { id: 5, label: 'SUPERNOVA', icon: Activity, color: 'text-red-400' },
  ];

  const handleModeChange = (id) => {
    if (id === 5) {
      sound.playSupernova();
      setTurbulence(1.2);
      setDistortion(0.65);
    } else {
      sound.playSweep();
      setTurbulence(0.5);
      setDistortion(0.42);
    }
    setActiveMode(id);
    if (triggerShockwaveRef.current) {
      triggerShockwaveRef.current(1.4);
    }
  };

  const triggerManualShockwave = () => {
    if (triggerShockwaveRef.current) {
      triggerShockwaveRef.current(1.6);
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[720px] flex items-center justify-center overflow-hidden select-none">
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Decorative Grid & Gradients */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-25 z-[1]" />
      <div className="pointer-events-none absolute inset-0 bg-radial-gradient from-transparent via-[#080808]/30 to-[#080808] z-[1]" />

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 sm:px-10 h-full flex flex-col justify-between pt-32 pb-10 pointer-events-none">
        {/* Top Tagline / Category */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-md border border-white/15 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping"></span>
            <span className="text-[11px] font-mono tracking-widest text-zinc-300">
              REAL-TIME WEBGL // CLICK ANYWHERE TO TRIGGER SHOCKWAVE
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-[11px] font-mono text-zinc-400 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
            <Activity className="w-3.5 h-3.5 text-[#00ff88]" />
            <span>{fps} FPS LOCKED</span>
          </div>
        </div>

        {/* Big Avant-Garde Typography */}
        <div className="my-auto text-center sm:text-left max-w-4xl">
          <div className="inline-block mb-3">
            <span className="text-xs font-mono tracking-[0.3em] text-[#00ff88] uppercase">
              // Creative Production Studio
            </span>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tighter leading-[0.92] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            WE CRAFT <br />
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
              THE UNSEEN.
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-zinc-300 max-w-xl font-sans font-light leading-relaxed drop-shadow-md">
            Interactive real-time 3D simulation, procedural shaders, and fluid physics engineered to defy ordinary digital boundaries.
          </p>

          {/* Quick Action Button: Super Shockwave */}
          <div className="mt-8 flex flex-wrap gap-3 pointer-events-auto">
            <button
              onClick={triggerManualShockwave}
              className="flex items-center space-x-2 bg-[#00ff88] text-black font-bold font-sans text-xs px-5 py-3 rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_25px_rgba(0,255,136,0.4)]"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>EXPLODE SHOCKWAVE</span>
            </button>
            <button
              onClick={() => handleModeChange(5)}
              className="flex items-center space-x-2 bg-white/10 text-white font-semibold font-sans text-xs px-5 py-3 rounded-full border border-white/20 hover:bg-white/20 hover:border-white transition-all backdrop-blur-md"
            >
              <Orbit className="w-4 h-4 text-red-400" />
              <span>SUPERNOVA MODE</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Shader Preset Switcher */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pointer-events-auto border-t border-white/10 pt-5">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0a0e]/85 backdrop-blur-2xl border border-white/15 p-1.5 rounded-2xl">
            <span className="text-[10px] font-mono text-zinc-400 px-3 hidden xl:inline">
              MORPH PRESET:
            </span>
            {modes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => handleModeChange(mode.id)}
                  onMouseEnter={() => sound.playHover()}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105'
                      : 'text-zinc-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : mode.color}`} />
                  <span>{mode.label}</span>
                </button>
              );
            })}
          </div>

          {/* Kinetic Turbulence Controller */}
          <div className="flex items-center space-x-4 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl text-xs font-mono text-zinc-400">
            <span>TURBULENCE:</span>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={turbulence}
              onChange={(e) => setTurbulence(parseFloat(e.target.value))}
              className="w-20 accent-[#00ff88] bg-zinc-700 h-1 rounded cursor-pointer"
            />
            <span className="text-[#00ff88] w-8">{turbulence.toFixed(1)}x</span>
          </div>

          {/* Explore Cue */}
          <a
            href="#work"
            onClick={() => sound.playClick()}
            onMouseEnter={() => sound.playHover()}
            className="hidden sm:flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <span>SCROLL FOR ARCHIVES</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#00ff88]" />
          </a>
        </div>
      </div>
    </section>
  );
}
