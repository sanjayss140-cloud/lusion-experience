import React, { useState } from 'react';
import IntroScreen from './components/IntroScreen';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import HeroCanvas from './components/HeroCanvas';
import ProjectShowcase from './components/ProjectShowcase';
import InteractivePlayground from './components/InteractivePlayground';
import FluidVortex from './components/FluidVortex';
import AudioSculptor from './components/AudioSculptor';
import QuantumSpatialCore from './components/QuantumSpatialCore';
import Capabilities from './components/Capabilities';
import StudioMetrics from './components/StudioMetrics';
import ContactFooter from './components/ContactFooter';

export default function App() {
  const [isInquireOpen, setIsInquireOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#080808] text-[#f0f0f0] selection:bg-[#00ff88] selection:text-black overflow-x-hidden font-sans">
      {/* Cinematic Super Aura Boot Sequence Intro */}
      {!introDone && <IntroScreen onComplete={() => setIntroDone(true)} />}

      {/* Custom Fluid Inertial Cursor */}
      <Cursor />

      {/* Navigation Header */}
      <Navbar onOpenInquire={() => setIsInquireOpen(true)} />

      {/* Main Experience Flow: 5 GOATED Interactive 3D Components */}
      <main className="relative">
        {/* 01: Hero 3D WebGL Organic Entity (The Sovereign Entity) */}
        <HeroCanvas />

        {/* 02: Selected Case Studies / Interactive 3D Tilt Projects */}
        <ProjectShowcase />

        {/* Below-the-fold 3D components mount smoothly after intro finishes */}
        {introDone && (
          <>
            {/* 03: Lusion Labs 3D Hyper-Faceted Crystal & Geometry Sculptor */}
            <InteractivePlayground />

            {/* 04: 25,000 GPU Particle Neural Fluid Tornado Simulation */}
            <FluidVortex />

            {/* 05: Acoustic Matter - Synthesizer 3D Waveform Sculptor */}
            <AudioSculptor />

            {/* 06: Quantum Spatial Core - 4D Triple-Axis Gyroscope Engine */}
            <QuantumSpatialCore />
          </>
        )}

        {/* 07: Studio Capabilities & Kinetic Ticker */}
        <Capabilities />

        {/* 08: Real-Time Studio Telemetry HUD */}
        <StudioMetrics />
      </main>

      {/* 09: Magnetic Footer & Inquiry Drawer */}
      <ContactFooter
        isInquireOpen={isInquireOpen}
        setIsInquireOpen={setIsInquireOpen}
      />
    </div>
  );
}

