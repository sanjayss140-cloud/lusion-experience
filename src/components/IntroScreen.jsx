import React, { useState, useEffect } from 'react';
import { sound } from './SoundController';
import { Shield, Zap, AlertTriangle, ChevronRight, Unlock, Lock, Sparkles, Cpu } from 'lucide-react';

export default function IntroScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING BLAST VAULT...');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    // 0% -> 100% Loading sequence
    const logs = [
      { at: 12, text: 'CALIBRATING HYDRAULIC PRESSURE PISTONS...' },
      { at: 35, text: 'CONTAINMENT SHIELD GENERATOR ONLINE...' },
      { at: 60, text: 'ALLOCATING 25,000 GPU PARTICLES & SHADERS...' },
      { at: 85, text: 'PRIMING 4D QUANTUM SINGULARITY CORE...' },
      { at: 100, text: 'MAXIMUM AURA REACHED // GATES ARMED.' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      const step = Math.floor(Math.random() * 3) + 1;
      current = Math.min(100, current + step);
      setProgress(current);

      const found = logs.find((l) => l.at <= current && l.at > current - step);
      if (found) {
        setStatusText(found.text);
        sound.playHover();
      }

      if (current >= 100) {
        clearInterval(interval);
        setIsUnlocked(true);
      }
    }, 28);

    return () => clearInterval(interval);
  }, []);

  const handleOpenGates = () => {
    if (gateOpen) return;
    sound.init();
    sound.playGateOpen();
    setGateOpen(true);

    // Wait for the heavy blast doors to slide fully off screen, then complete
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 1250);
  };

  const handleBypass = () => {
    setProgress(100);
    setIsUnlocked(true);
    handleOpenGates();
  };

  return (
    <div
      className={`fixed inset-0 z-[999999] overflow-hidden select-none pointer-events-auto transition-opacity duration-300 ${
        gateOpen ? 'pointer-events-none' : ''
      }`}
      style={{ perspective: '1200px' }}
    >
      {/* Blinding Center Aura Laser Light Beam when Gates Blast Open */}
      {gateOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="w-8 sm:w-24 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-95 animate-pulse filter blur-md shadow-[0_0_120px_40px_rgba(0,255,136,0.9)] transition-all duration-1000 scale-y-125" />
          <div className="absolute inset-0 bg-[#00ff88]/15 mix-blend-screen animate-ping" />
        </div>
      )}

      {/* TOP HUD BAR */}
      <div className="absolute top-6 left-6 right-6 z-40 flex items-center justify-between text-xs font-mono tracking-widest text-zinc-400">
        <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <div className={`w-2.5 h-2.5 rounded-full ${isUnlocked ? 'bg-[#00ff88] animate-ping' : 'bg-[#00e5ff] animate-pulse'}`} />
          <span className="text-white font-bold">SANJAY STUDIOS</span>
          <span className="text-zinc-600">//</span>
          <span className="text-zinc-400">HEAVY SECURITY GATE PROTOCOL</span>
        </div>

        <button
          onClick={handleBypass}
          className="bg-black/60 backdrop-blur-md hover:bg-white/10 hover:text-white px-4 py-2 rounded-full border border-white/10 transition-colors uppercase cursor-pointer"
        >
          BYPASS // SKIP
        </button>
      </div>

      {/* ========================================================
          LEFT BLAST GATE (SLIDES LEFT)
          ======================================================== */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#06070a] border-r-2 border-[#00e5ff]/50 shadow-[20px_0_60px_rgba(0,0,0,0.95)] z-20 flex flex-col justify-between p-8 sm:p-14 overflow-hidden"
        style={{
          transform: gateOpen ? 'translateX(-106%) rotateY(-8deg)' : 'translateX(0%) rotateY(0deg)',
          transformOrigin: 'left center',
          transition: 'transform 1150ms cubic-bezier(0.75, 0, 0.25, 1)',
        }}
      >
        {/* Armored Plating Visual Texture & Cross Braces */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0c12_25%,transparent_25%),linear-gradient(225deg,#0a0c12_25%,transparent_25%),linear-gradient(45deg,#0a0c12_25%,transparent_25%),linear-gradient(315deg,#0a0c12_25%,#050608_25%)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

        {/* Hazard Danger Stripes on Border Seam */}
        <div className="absolute top-0 bottom-0 right-0 w-4 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#00e5ff_10px,#00e5ff_20px)] opacity-60 pointer-events-none" />

        {/* Heavy Mechanical Hydraulic Piston Rod */}
        <div className="absolute top-1/4 right-8 w-4 h-48 bg-gradient-to-b from-zinc-700 via-zinc-400 to-zinc-800 rounded-full border border-zinc-600 shadow-inner pointer-events-none hidden sm:block" />
        <div className="absolute bottom-1/4 right-8 w-4 h-48 bg-gradient-to-b from-zinc-700 via-zinc-400 to-zinc-800 rounded-full border border-zinc-600 shadow-inner pointer-events-none hidden sm:block" />

        {/* Gate A Header Stencil */}
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#00e5ff]/10 border border-[#00e5ff]/30 text-[10px] sm:text-xs font-mono text-[#00e5ff] tracking-widest uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>BLAST GATE 01-A // TITANIUM REINFORCED</span>
          </div>
          <p className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            SANJAY STUDIOS
          </p>
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            QUANTUM COMPUTATIONAL LAB
          </p>
        </div>

        {/* Mid Panel Tech HUD */}
        <div className="relative z-10 space-y-4 max-w-sm hidden md:block">
          <div className="border-l-2 border-[#00e5ff] pl-3 py-1 font-mono text-xs text-zinc-400 space-y-1">
            <p className="text-white font-bold tracking-wider">STRUCTURAL INTEGRITY: 100%</p>
            <p>HYDRAULIC FORCE: 8,400 kN</p>
            <p>SINGULARITY DAMPENERS: ACTIVE</p>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 leading-relaxed">
            RESTRICTED ACCESS. HIGH AURA FIELD IN OPERATION. AUTHORIZED ENTRY ONLY.
          </div>
        </div>

        {/* Bottom Left Stencil */}
        <div className="relative z-10 font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
          SYS.LOC // SEC-01 • LAT.139.75 // APEX
        </div>
      </div>

      {/* ========================================================
          RIGHT BLAST GATE (SLIDES RIGHT)
          ======================================================== */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#06070a] border-l-2 border-[#00ff88]/50 shadow-[-20px_0_60px_rgba(0,0,0,0.95)] z-20 flex flex-col justify-between p-8 sm:p-14 overflow-hidden"
        style={{
          transform: gateOpen ? 'translateX(106%) rotateY(8deg)' : 'translateX(0%) rotateY(0deg)',
          transformOrigin: 'right center',
          transition: 'transform 1150ms cubic-bezier(0.75, 0, 0.25, 1)',
        }}
      >
        {/* Armored Plating Visual Texture & Cross Braces */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0c12_25%,transparent_25%),linear-gradient(225deg,#0a0c12_25%,transparent_25%),linear-gradient(45deg,#0a0c12_25%,transparent_25%),linear-gradient(315deg,#0a0c12_25%,#050608_25%)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

        {/* Hazard Danger Stripes on Border Seam */}
        <div className="absolute top-0 bottom-0 left-0 w-4 bg-[repeating-linear-gradient(-45deg,#000,#000_10px,#00ff88_10px,#00ff88_20px)] opacity-60 pointer-events-none" />

        {/* Heavy Mechanical Hydraulic Piston Rod */}
        <div className="absolute top-1/4 left-8 w-4 h-48 bg-gradient-to-b from-zinc-700 via-zinc-400 to-zinc-800 rounded-full border border-zinc-600 shadow-inner pointer-events-none hidden sm:block" />
        <div className="absolute bottom-1/4 left-8 w-4 h-48 bg-gradient-to-b from-zinc-700 via-zinc-400 to-zinc-800 rounded-full border border-zinc-600 shadow-inner pointer-events-none hidden sm:block" />

        {/* Gate B Header Stencil */}
        <div className="relative z-10 text-right space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#00ff88]/10 border border-[#00ff88]/30 text-[10px] sm:text-xs font-mono text-[#00ff88] tracking-widest uppercase">
            <span>BLAST GATE 01-B // HYDRAULIC LOCK</span>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
          <p className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight">
            SEC LEVEL 5
          </p>
          <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            AURA FLUX CONVERGENCE
          </p>
        </div>

        {/* Mid Panel Tech HUD */}
        <div className="relative z-10 space-y-4 max-w-sm ml-auto text-right hidden md:block">
          <div className="border-r-2 border-[#00ff88] pr-3 py-1 font-mono text-xs text-zinc-400 space-y-1">
            <p className="text-white font-bold tracking-wider">NEURAL SHADERS: ONLINE</p>
            <p>25,000 GPU PARTICLES SYNCED</p>
            <p>ATMOSPHERIC DIVERGENCE: 0.00%</p>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 leading-relaxed">
            WARNING: RELEASING LOCK INITIATES REAL-TIME THREE.JS HYPER-ACCELERATED EXPERIENCE.
          </div>
        </div>

        {/* Bottom Right Stencil */}
        <div className="relative z-10 text-right font-mono text-[10px] text-zinc-600 tracking-widest uppercase">
          DESIGNED FOR SANJAY • 2026 EDITION
        </div>
      </div>

      {/* ========================================================
          CENTER MASSIVE ROTATING VAULT LOCK REACTOR CORE
          ======================================================== */}
      <div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
        style={{
          opacity: gateOpen ? 0 : 1,
          transform: gateOpen ? 'scale(1.3)' : 'scale(1)',
          transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Center Circular Vault Clamp */}
        <div className="relative flex items-center justify-center pointer-events-auto">
          {/* Outer Rotating Gear Ring */}
          <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border-2 border-dashed border-[#00e5ff]/30 animate-[spin_24s_linear_infinite]" />
          <div className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full border border-dashed border-[#00ff88]/40 animate-[spin_18s_linear_infinite_reverse]" />

          {/* Glowing Aura Bloom behind core */}
          <div
            className={`absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full filter blur-2xl transition-colors duration-500 ${
              isUnlocked ? 'bg-[#00ff88]/30 animate-pulse' : 'bg-[#00e5ff]/20'
            }`}
          />

          {/* Central Reactor Shell */}
          <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full bg-[#0d0f17] border-4 border-[#1e2333] shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center p-6 text-center">
            {/* SVG Circular Progress Gauge */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-zinc-800"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="transition-all duration-75 ease-out"
                stroke={isUnlocked ? '#00ff88' : '#00e5ff'}
                strokeWidth="4"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 - (276.46 * progress) / 100}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: isUnlocked
                    ? 'drop-shadow(0 0 10px #00ff88)'
                    : 'drop-shadow(0 0 6px #00e5ff)',
                }}
              />
            </svg>

            {/* Core Center Telemetry Readout */}
            <div className="relative z-10 flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1">
                {isUnlocked ? (
                  <Unlock className="w-4 h-4 text-[#00ff88] animate-bounce" />
                ) : (
                  <Lock className="w-4 h-4 text-[#00e5ff] animate-pulse" />
                )}
                <span className="font-mono text-[10px] text-zinc-400 tracking-wider">
                  {isUnlocked ? 'SEALS UNLOCKED' : 'HYDRAULIC LOCK'}
                </span>
              </div>

              {/* Huge Percentage */}
              <div
                className={`font-display font-black text-4xl sm:text-5xl tracking-tighter leading-none ${
                  isUnlocked
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-white to-[#00ff88] drop-shadow-[0_0_20px_#00ff88]'
                    : 'text-white'
                }`}
              >
                {progress}%
              </div>

              {/* Status Indicator */}
              <div className="text-[10px] font-mono text-[#00ff88] max-w-[150px] truncate">
                {statusText}
              </div>
            </div>
          </div>
        </div>

        {/* CTA BUTTON UNDER CORE: APPEARS WHEN 100% REACHED */}
        <div className="mt-8 relative z-40 pointer-events-auto h-20 flex items-center justify-center">
          {isUnlocked ? (
            <button
              onClick={handleOpenGates}
              onMouseEnter={() => sound.playHover()}
              className="group relative inline-flex items-center space-x-4 bg-[#00ff88] text-black font-sans font-black text-sm sm:text-base px-8 sm:px-12 py-4 sm:py-5 rounded-full hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_60px_rgba(0,255,136,0.7)] cursor-pointer"
            >
              <Zap className="w-5 h-5 fill-current animate-pulse" />
              <span className="tracking-widest uppercase">DISENGAGE BLAST GATES // ENTER</span>
              <div className="w-7 h-7 rounded-full bg-black text-white group-hover:bg-[#00ff88] group-hover:text-black flex items-center justify-center transition-colors">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ) : (
            <div className="flex items-center space-x-2 text-xs font-mono text-zinc-500 tracking-wider">
              <Cpu className="w-4 h-4 animate-spin text-[#00e5ff]" />
              <span>ENGAGING HYDRAULIC PRESSURE CHAMBERS...</span>
            </div>
          )}
        </div>
      </div>

      {/* Center Vertical Laser Seam Line (Joins the two doors) */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 z-25 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: gateOpen ? 0 : 0.8,
          boxShadow: isUnlocked ? '0 0 20px 2px #00ff88' : '0 0 15px 1px #00e5ff',
          backgroundColor: isUnlocked ? '#00ff88' : '#00e5ff',
        }}
      />
    </div>
  );
}
