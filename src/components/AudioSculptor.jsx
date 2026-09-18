import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from './SoundController';
import { Music, Radio, Volume2, Sparkles, Sliders } from 'lucide-react';

export default function AudioSculptor() {
  const mountRef = useRef(null);
  const [activeNote, setActiveNote] = useState(null);
  const [waveFrequency, setWaveFrequency] = useState(2.0);
  const [waveHeight, setWaveHeight] = useState(0.8);
  const [waveMode, setWaveMode] = useState('ribbon'); // ribbon, grid, torus

  const freqRef = useRef(2.0);
  const heightRef = useRef(0.8);
  const audioPulseRef = useRef(0);

  freqRef.current = waveFrequency;
  heightRef.current = waveHeight;

  // Synthesizer notes map (Pentatonic scale for instant musical harmony)
  const synthNotes = [
    { name: 'C4', freq: 261.63, label: 'BASS' },
    { name: 'D4', freq: 293.66, label: 'SUB' },
    { name: 'E4', freq: 329.63, label: 'DRONE' },
    { name: 'G4', freq: 392.0, label: 'CHORD' },
    { name: 'A4', freq: 440.0, label: 'LEAD' },
    { name: 'C5', freq: 523.25, label: 'SPARKLE' },
    { name: 'E5', freq: 659.25, label: 'CRYSTAL' },
  ];

  const playSynthesizerNote = (note) => {
    setActiveNote(note.name);
    sound.init();
    if (sound.ctx) {
      if (sound.ctx.state === 'suspended') sound.ctx.resume();
      try {
        const osc = sound.ctx.createOscillator();
        const gain = sound.ctx.createGain();
        const filter = sound.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.freq, sound.ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, sound.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2400, sound.ctx.currentTime + 0.15);
        filter.frequency.exponentialRampToValueAtTime(400, sound.ctx.currentTime + 0.8);

        gain.gain.setValueAtTime(0.08, sound.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, sound.ctx.currentTime + 0.9);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(sound.ctx.destination);

        osc.start();
        osc.stop(sound.ctx.currentTime + 0.9);
      } catch (e) {}
    }

    // Spike audio pulse for 3D deformation
    audioPulseRef.current = 1.4;

    setTimeout(() => {
      setActiveNote(null);
    }, 400);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2.5, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Dramatic lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const pLight1 = new THREE.PointLight(0x00ff88, 4.0, 20);
    pLight1.position.set(3, 4, 3);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x00e5ff, 3.5, 20);
    pLight2.position.set(-3, -2, 2);
    scene.add(pLight2);

    // Multi-Ribbon Kinetic Wave Mesh
    const planeWidth = 6.0;
    const planeDepth = 3.5;
    const segmentsX = 80;
    const segmentsY = 40;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeDepth, segmentsX, segmentsY);
    geometry.rotateX(-Math.PI / 2.5);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x07111a,
      emissive: 0x00ff88,
      emissiveIntensity: 0.25,
      roughness: 0.1,
      metalness: 0.8,
      wireframe: true,
      clearcoat: 1.0,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

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
    const origPos = geometry.attributes.position.array.slice();

    const animate = () => {
      const time = clock.getElapsedTime();
      const pos = geometry.attributes.position.array;
      const freq = freqRef.current;
      const height = heightRef.current;

      // Smooth decay of audio pulse
      audioPulseRef.current *= 0.94;
      const totalAmplitude = height + audioPulseRef.current * 1.2;

      for (let i = 0; i < pos.length; i += 3) {
        const ox = origPos[i];
        const oy = origPos[i + 1];
        const oz = origPos[i + 2];

        // Harmonic traveling wave equation
        const wave1 = Math.sin(ox * freq + time * 3.5) * Math.cos(oz * freq * 0.8 + time * 2.0);
        const wave2 = Math.sin((ox + oz) * (freq * 1.5) - time * 4.0) * 0.4;
        const waveAudio = Math.sin(Math.sqrt(ox * ox + oz * oz) * 5.0 - time * 8.0) * audioPulseRef.current * 0.8;

        pos[i + 1] = oy + (wave1 + wave2 + waveAudio) * totalAmplitude;
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.computeVertexNormals();

      // Slow gentle rotation
      mesh.rotation.y = Math.sin(time * 0.3) * 0.2;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section className="relative py-32 bg-[#050507] border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#00ff88] tracking-widest mb-3 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>
              <span>SYNTHESIZER 3D LAB // KINETIC AUDIO SCULPTOR</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
              ACOUSTIC MATTER
            </h2>
          </div>
          <p className="mt-4 md:mt-0 text-zinc-400 text-sm max-w-md font-sans leading-relaxed">
            Hit any synthesizer key below to generate real harmonic soundwaves. Watch acoustic frequencies physically deform the 3D ribbon matrix in real time.
          </p>
        </div>

        {/* 3D Wave Viewport */}
        <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-black via-zinc-950 to-black shadow-2xl backdrop-blur-md">
          {/* Three.js Canvas */}
          <div ref={mountRef} className="w-full h-full" />

          {/* Top Info Bar */}
          <div className="absolute top-6 left-6 flex items-center space-x-3 bg-black/75 backdrop-blur-xl border border-white/15 px-4 py-2.5 rounded-2xl">
            <Radio className="w-4 h-4 text-[#00ff88] animate-pulse" />
            <span className="text-xs font-mono text-zinc-200">
              AUDIO SPECTRUM // HARMONIC WAVE DEFORMATION
            </span>
          </div>

          {/* Bottom Interactive Synthesizer Keyboard Controller */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-4 bg-black/85 backdrop-blur-2xl border border-white/20 p-5 rounded-2xl">
            {/* Synthesizer Keys */}
            <div>
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>INTERACTIVE HARMONIC KEYS (CLICK TO PLAY & DEFORM 3D MESH):</span>
                <span className="text-[#00ff88]">WEB AUDIO API // 44.1kHz</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {synthNotes.map((note) => {
                  const isPlaying = activeNote === note.name;
                  return (
                    <button
                      key={note.name}
                      onClick={() => playSynthesizerNote(note)}
                      className={`py-4 rounded-xl font-mono text-center transition-all duration-150 flex flex-col items-center justify-center border ${
                        isPlaying
                          ? 'bg-[#00ff88] text-black font-extrabold border-[#00ff88] shadow-[0_0_25px_rgba(0,255,136,0.8)] scale-105 -translate-y-1'
                          : 'bg-white/5 border-white/15 text-white hover:bg-white/15 hover:border-white/40'
                      }`}
                    >
                      <span className="text-sm font-bold">{note.name}</span>
                      <span
                        className={`text-[9px] tracking-wider mt-1 ${
                          isPlaying ? 'text-black font-bold' : 'text-zinc-500'
                        }`}
                      >
                        {note.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sliders for wave height & frequency */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-zinc-400">FREQUENCY:</span>
                  <input
                    type="range"
                    min="1.0"
                    max="4.5"
                    step="0.2"
                    value={waveFrequency}
                    onChange={(e) => setWaveFrequency(parseFloat(e.target.value))}
                    className="w-24 accent-[#00ff88] bg-zinc-700 h-1 rounded cursor-pointer"
                  />
                  <span className="text-[#00ff88] font-bold w-10">{waveFrequency.toFixed(1)}Hz</span>
                </div>

                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-zinc-400">AMPLITUDE:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="1.6"
                    step="0.1"
                    value={waveHeight}
                    onChange={(e) => setWaveHeight(parseFloat(e.target.value))}
                    className="w-24 accent-[#00ff88] bg-zinc-700 h-1 rounded cursor-pointer"
                  />
                  <span className="text-white font-bold w-8">{waveHeight.toFixed(1)}</span>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-500">
                PENTATONIC HARMONIC SCALE • REALTIME GEOMETRY DISPLACEMENT
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
