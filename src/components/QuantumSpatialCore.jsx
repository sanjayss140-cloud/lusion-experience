import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from './SoundController';
import { Compass, RotateCw, Zap, Shield, Activity, Radio, Cpu, Orbit } from 'lucide-react';

export default function QuantumSpatialCore() {
  const mountRef = useRef(null);
  const [temporalSpeed, setTemporalSpeed] = useState(2.0);
  const [isOverdrive, setIsOverdrive] = useState(false);
  const [coreMode, setCoreMode] = useState('tesseract'); // tesseract, hypercube, chronometer

  const speedRef = useRef(temporalSpeed);
  const pulseRef = useRef(0);
  const triggerPulseRef = useRef(null);
  speedRef.current = temporalSpeed;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 6.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);

    // Studio Dynamic Keylights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x00ff88, 8.0, 20);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const cyanLight = new THREE.PointLight(0x00e5ff, 5.0, 20);
    cyanLight.position.set(4.5, 4.5, 3.5);
    scene.add(cyanLight);

    const magentaLight = new THREE.PointLight(0xff0066, 4.5, 20);
    magentaLight.position.set(-4.5, -3.5, 2.5);
    scene.add(magentaLight);

    // Master Gyroscope Group
    const gyroMaster = new THREE.Group();
    scene.add(gyroMaster);

    // Titanium Beveled Material for Outer Gimbals
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x12141a,
      metalness: 0.95,
      roughness: 0.12,
      flatShading: true,
    });

    const neonCyanMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
    });

    const neonEmeraldMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      wireframe: true,
    });

    // Ring 1: Outer Heavy Titanium Gimbal (Radius 2.4)
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.09, 16, 120);
    const ring1 = new THREE.Mesh(ring1Geo, titaniumMat);
    gyroMaster.add(ring1);

    const ring1WireGeo = new THREE.TorusGeometry(2.4, 0.095, 8, 60);
    const ring1Wire = new THREE.Mesh(ring1WireGeo, neonCyanMat);
    gyroMaster.add(ring1Wire);

    // Ring 2: Middle Concentric Gimbal (Radius 1.85)
    const ring2Geo = new THREE.TorusGeometry(1.85, 0.08, 16, 100);
    const ring2 = new THREE.Mesh(ring2Geo, titaniumMat);
    ring2.rotation.x = Math.PI / 3;
    gyroMaster.add(ring2);

    const ring2WireGeo = new THREE.TorusGeometry(1.85, 0.085, 8, 50);
    const ring2Wire = new THREE.Mesh(ring2WireGeo, neonEmeraldMat);
    ring2.add(ring2Wire);

    // Ring 3: Inner High-Velocity Gimbal (Radius 1.35)
    const ring3Geo = new THREE.TorusGeometry(1.35, 0.07, 16, 80);
    const ring3 = new THREE.Mesh(ring3Geo, titaniumMat);
    ring3.rotation.y = Math.PI / 4;
    gyroMaster.add(ring3);

    // Ring 4: Holographic Telemetry Reticle Rings
    const reticleGeo = new THREE.RingGeometry(2.6, 2.64, 96);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const reticle1 = new THREE.Mesh(reticleGeo, reticleMat);
    gyroMaster.add(reticle1);

    // Center Singularity: Rotating 12-Spike Tesseract Core
    const coreGroup = new THREE.Group();
    gyroMaster.add(coreGroup);

    // Inner Glowing Polyhedral Energy Core
    const coreGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00ff88,
      emissive: 0x00ff88,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      flatShading: true,
    });
    const coreOrb = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreOrb);

    // Outer Wireframe Cage
    const cageGeo = new THREE.OctahedronGeometry(0.85, 0);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const coreCage = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(coreCage);

    // 1,800 Quantum Spark Particles Floating In Orbit
    const pCount = 1800;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);

    const cEmerald = new THREE.Color('#00ff88');
    const cCyan = new THREE.Color('#00e5ff');
    const cWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < pCount; i++) {
      const radius = 0.6 + Math.random() * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = radius * Math.cos(phi);

      const mix = Math.random();
      const col = mix < 0.5 ? cEmerald.clone().lerp(cCyan, mix * 2) : cCyan.clone().lerp(cWhite, (mix - 0.5) * 2);
      pColors[i * 3] = col.r;
      pColors[i * 3 + 1] = col.g;
      pColors[i * 3 + 2] = col.b;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const quantumParticles = new THREE.Points(pGeo, pMat);
    gyroMaster.add(quantumParticles);

    // Trigger Overdrive
    const triggerPulse = () => {
      sound.playShockwave();
      pulseRef.current = 2.2;
      setIsOverdrive(true);
      setTimeout(() => setIsOverdrive(false), 2500);
    };
    triggerPulseRef.current = triggerPulse;

    // Mouse Gyroscopic Precession Physics
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      targetTiltX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetTiltY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener('mousemove', onMouseMove, { passive: true });
    container.addEventListener('click', triggerPulse);

    // Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    let reqId;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const spd = speedRef.current;

      // Smooth mouse precession tilt
      currentTiltX += (targetTiltX - currentTiltX) * 0.06;
      currentTiltY += (targetTiltY - currentTiltY) * 0.06;

      gyroMaster.rotation.x = currentTiltY * 0.45;
      gyroMaster.rotation.y = currentTiltX * 0.45;

      // Independent 3-Axis Multi-Dimensional Gyroscopic Spin
      const boost = 1.0 + pulseRef.current * 2.5;

      ring1.rotation.x += 0.016 * spd * boost;
      ring1.rotation.y += 0.009 * spd * boost;
      ring1Wire.rotation.copy(ring1.rotation);

      ring2.rotation.y += 0.024 * spd * boost;
      ring2.rotation.z += 0.014 * spd * boost;

      ring3.rotation.z += 0.038 * spd * boost;
      ring3.rotation.x += 0.020 * spd * boost;

      // Reticle slow precession
      reticle1.rotation.z = -time * 0.15;

      // Core tesseract rotation
      coreGroup.rotation.y = time * 1.2 * boost;
      coreGroup.rotation.x = time * 0.8 * boost;

      pulseRef.current *= 0.94;
      const scaleVal = 1.0 + Math.sin(time * 8.0) * 0.08 + pulseRef.current * 0.5;
      coreOrb.scale.set(scaleVal, scaleVal, scaleVal);
      coreCage.rotation.y = -time * 1.5;

      // Quantum particles orbit
      quantumParticles.rotation.y = -time * 0.12 * spd;
      quantumParticles.rotation.z = time * 0.06 * spd;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('click', triggerPulse);
      window.removeEventListener('resize', handleResize);

      ring1Geo.dispose();
      ring2Geo.dispose();
      ring3Geo.dispose();
      reticleGeo.dispose();
      coreGeo.dispose();
      cageGeo.dispose();
      pGeo.dispose();
      titaniumMat.dispose();
      neonCyanMat.dispose();
      neonEmeraldMat.dispose();
      reticleMat.dispose();
      coreMat.dispose();
      cageMat.dispose();
      pMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative py-32 bg-[#020204] border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#00ff88] tracking-widest mb-3 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping"></span>
              <span>4D KINETIC ACCELERATOR // TRIPLE-AXIS GYROSCOPE</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              QUANTUM SPATIAL CORE
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-zinc-300 text-sm max-w-md font-sans leading-relaxed">
            3 nested concentric titanium gimbals rotating on independent axes around a pulsating quantum singularity. Drag to control gyroscopic precession in real time.
          </p>
        </div>

        {/* 3D Gyroscope Viewport with High-Aura Cyber HUD */}
        <div className="relative w-full h-[660px] rounded-3xl overflow-hidden border border-[#00e5ff]/30 bg-gradient-to-b from-black via-zinc-950 to-black shadow-[0_0_50px_rgba(0,229,255,0.15)] backdrop-blur-2xl">
          {/* Canvas */}
          <div ref={mountRef} className="w-full h-full cursor-crosshair" />

          {/* Top Left: Live HUD Readout */}
          <div className="absolute top-6 left-6 flex items-center space-x-3 bg-black/85 backdrop-blur-2xl border border-white/20 px-4 py-2.5 rounded-2xl shadow-xl">
            <Orbit className="w-4 h-4 text-[#00e5ff] animate-spin" />
            <span className="text-xs font-mono text-white font-bold tracking-wider">
              TRIPLE GIMBAL DILATION // {isOverdrive ? 'OVERDRIVE MAXIMUM' : 'SUB-LIGHT STABLE'}
            </span>
          </div>

          {/* Top Right: Overdrive Button */}
          <div className="absolute top-6 right-6">
            <button
              onClick={() => triggerPulseRef.current && triggerPulseRef.current()}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center space-x-2 bg-[#00e5ff] text-black font-extrabold text-xs font-mono px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.7)] hover:bg-white hover:scale-105 transition-all"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>DIMENSIONAL OVERDRIVE</span>
            </button>
          </div>

          {/* Bottom HUD: Precision Velocity Controls */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 bg-black/90 backdrop-blur-2xl border border-white/25 p-5 rounded-2xl">
            <div className="flex flex-wrap items-center gap-8">
              {/* Velocity */}
              <div className="flex items-center space-x-3 text-xs font-mono">
                <span className="text-zinc-400">PRECESSION SPEED:</span>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.2"
                  value={temporalSpeed}
                  onChange={(e) => setTemporalSpeed(parseFloat(e.target.value))}
                  className="w-28 accent-[#00e5ff] bg-zinc-700 h-1 rounded cursor-pointer"
                />
                <span className="text-[#00e5ff] font-bold w-10">{temporalSpeed.toFixed(1)}x</span>
              </div>
            </div>

            <div className="text-xs font-mono text-zinc-300 flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></span>
              <span className="text-white font-bold">TITANIUM BEVELED GIMBALS</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#00e5ff]">QUANTUM TESSERACT SINGULARITY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
