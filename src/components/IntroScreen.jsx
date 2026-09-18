import React, { useState, useEffect, useRef } from 'react';
import { sound } from './SoundController';
import { Lock, Unlock } from 'lucide-react';

export default function IntroScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING BLAST VAULT...');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Smooth cinematic progression 0% -> 100%
    const logs = [
      { at: 20, text: 'SYNCHRONIZING HYDRAULIC CYLINDERS...' },
      { at: 45, text: 'CHARGING CHEVRON CONDUITS...' },
      { at: 70, text: 'AURA FLUX CONVERGENCE...' },
      { at: 90, text: 'HYDRAULIC PRESSURE AT 100%...' },
      { at: 100, text: 'MAXIMUM AURA // VAULT UNLOCKED' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(current);

      const found = logs.find((l) => l.at === current);
      if (found) {
        setStatusText(found.text);
      }

      if (current >= 100) {
        clearInterval(interval);
        setIsUnlocked(true);

        // HOLLYWOOD CINEMATIC AUTO-OPEN:
        // Brief 0.4s pause of anticipation at 100%, then gates slowly part!
        setTimeout(() => {
          triggerSlowHollywoodGate();
        }, 450);
      }
    }, 28);

    return () => clearInterval(interval);
  }, []);

  const triggerSlowHollywoodGate = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    sound.init();
    sound.playGateOpen();
    setGateOpen(true);

    // Hollywood slow opening: doors take 4.0s to part and aura to fully form
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 4200);
  };

  // Allow user to click anywhere to start opening immediately
  const handleUserClick = () => {
    if (!hasTriggeredRef.current) {
      setProgress(100);
      setIsUnlocked(true);
      triggerSlowHollywoodGate();
    }
  };

  return (
    <div
      onClick={handleUserClick}
      className={`fixed inset-0 z-[999999] bg-[#050608] overflow-hidden select-none cursor-pointer transition-opacity duration-1000 ${
        gateOpen ? 'pointer-events-none' : ''
      }`}
      style={{ perspective: '1600px' }}
    >
      {/* ========================================================
          AURA LIGHT EXPANSION (FORMS AS GATES SLOWLY OPEN)
          ======================================================== */}
      <div
        className={`absolute inset-0 z-40 flex items-center justify-center pointer-events-none transition-all duration-[3800ms] ease-out ${
          gateOpen ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Hollywood Blinding God-Rays from center split */}
        <div
          className={`h-full bg-gradient-to-r from-transparent via-white to-transparent filter blur-xl transition-all duration-[3600ms] ease-out ${
            gateOpen ? 'w-[100vw] opacity-80 scale-x-150' : 'w-2 opacity-0'
          }`}
        />

        {/* Ambient Volumetric Emerald & Cyan Atmospheric Aura Bloom */}
        <div
          className={`absolute inset-0 bg-radial-gradient from-[#00ff88]/30 via-[#00e5ff]/15 to-transparent filter blur-3xl transition-all duration-[4000ms] ease-out ${
            gateOpen ? 'opacity-100 scale-125' : 'opacity-0 scale-50'
          }`}
        />

        {/* Shockwave expanding aura rings */}
        <div
          className={`absolute rounded-full border border-[#00ff88]/50 filter blur-md transition-all duration-[3800ms] ease-out ${
            gateOpen ? 'w-[160vw] h-[160vw] opacity-0 scale-150' : 'w-48 h-48 opacity-100 scale-50'
          }`}
        />
      </div>

      {/* ========================================================
          LEFT BLAST GATE (SLIDES OPEN SLOWLY TO THE LEFT)
          ======================================================== */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#06070a] shadow-[40px_0_100px_rgba(0,0,0,0.95)] z-20 overflow-hidden"
        style={{
          transform: gateOpen ? 'translateX(-102%) rotateY(-6deg)' : 'translateX(0%) rotateY(0deg)',
          transformOrigin: 'left center',
          transition: 'transform 3800ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Diamond Carbon Plating Grid Background (Exact match to screenshot) */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0d14_25%,transparent_25%),linear-gradient(225deg,#0a0d14_25%,transparent_25%),linear-gradient(45deg,#0a0d14_25%,transparent_25%),linear-gradient(315deg,#0a0d14_25%,#050608_25%)] bg-[size:48px_48px] opacity-45 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#06070a]/60 to-[#020204] pointer-events-none" />
      </div>

      {/* ========================================================
          RIGHT BLAST GATE (SLIDES OPEN SLOWLY TO THE RIGHT)
          ======================================================== */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#06070a] shadow-[-40px_0_100px_rgba(0,0,0,0.95)] z-20 overflow-hidden"
        style={{
          transform: gateOpen ? 'translateX(102%) rotateY(6deg)' : 'translateX(0%) rotateY(0deg)',
          transformOrigin: 'right center',
          transition: 'transform 3800ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Diamond Carbon Plating Grid Background (Exact match to screenshot) */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0d14_25%,transparent_25%),linear-gradient(225deg,#0a0d14_25%,transparent_25%),linear-gradient(45deg,#0a0d14_25%,transparent_25%),linear-gradient(315deg,#0a0d14_25%,#050608_25%)] bg-[size:48px_48px] opacity-45 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#06070a]/60 to-[#020204] pointer-events-none" />
      </div>

      {/* ========================================================
          VERTICAL CHEVRON ENERGY COLUMN (EXACT AS SCREENSHOT)
          ======================================================== */}
      <div
        className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center justify-between pointer-events-none py-2 transition-all duration-[3000ms] ${
          gateOpen ? 'opacity-0 scale-y-125' : 'opacity-100'
        }`}
        style={{ width: '48px' }}
      >
        {/* Glowing vertical line track */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#00e5ff] via-[#00ff88] to-[#00e5ff] opacity-80 shadow-[0_0_15px_#00ff88]" />

        {/* Cascading Chevrons: Repeating neon arrows pointing down/up */}
        <div className="flex flex-col items-center justify-around h-full w-full opacity-90">
          {[...Array(28)].map((_, i) => (
            <svg
              key={i}
              className="w-7 h-5 animate-pulse"
              viewBox="0 0 24 16"
              fill="none"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.9))',
                animationDelay: `${(i % 5) * 0.15}s`,
              }}
            >
              <path
                d="M3 3L12 12L21 3"
                stroke={i % 2 === 0 ? '#00ff88' : '#00e5ff'}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ))}
        </div>
      </div>

      {/* ========================================================
          VERTICAL HYDRAULIC PISTON RODS (BEHIND THE CORE)
          ======================================================== */}
      <div
        className={`absolute inset-0 z-28 flex items-center justify-center pointer-events-none transition-all duration-[3000ms] ${
          gateOpen ? 'opacity-0 scale-110' : 'opacity-100'
        }`}
      >
        {/* Dual Steel Hydraulic Pistons */}
        <div className="relative w-48 h-full flex justify-between px-8">
          <div className="w-5 h-full bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-900 rounded-full border border-zinc-700 shadow-[0_0_25px_rgba(0,0,0,0.8)] opacity-75" />
          <div className="w-5 h-full bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-900 rounded-full border border-zinc-700 shadow-[0_0_25px_rgba(0,0,0,0.8)] opacity-75" />
        </div>
      </div>

      {/* ========================================================
          CENTER CIRCULAR VAULT CORE (EXACT AS SCREENSHOT)
          ======================================================== */}
      <div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
        style={{
          opacity: gateOpen ? 0 : 1,
          transform: gateOpen ? 'scale(1.2)' : 'scale(1)',
          transition: 'all 2800ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Circular Outer HUD & Core Container */}
        <div className="relative flex items-center justify-center">
          {/* Fine Cyan Dashed Orbital Rings */}
          <div className="w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-dashed border-[#00e5ff]/40 animate-[spin_32s_linear_infinite]" />
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed border-[#00ff88]/30 animate-[spin_24s_linear_infinite_reverse]" />

          {/* Glowing Aura Bloom behind center core */}
          <div
            className={`absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full filter blur-3xl transition-colors duration-700 ${
              isUnlocked ? 'bg-[#00ff88]/35 animate-pulse' : 'bg-[#00e5ff]/20'
            }`}
          />

          {/* Heavy Dark Vault Reactor Shell */}
          <div className="absolute w-56 h-56 sm:w-68 sm:h-68 rounded-full bg-[#0d0f17] border-[6px] border-[#1a1d29] shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center p-6 text-center">
            {/* SVG Circular Progress Gauge */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-zinc-800/80"
                strokeWidth="3.5"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="transition-all duration-75 ease-out"
                stroke={isUnlocked ? '#00ff88' : '#00e5ff'}
                strokeWidth="3.5"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 - (276.46 * progress) / 100}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: isUnlocked
                    ? 'drop-shadow(0 0 12px #00ff88)'
                    : 'drop-shadow(0 0 8px #00e5ff)',
                }}
              />
            </svg>

            {/* Core Center Readout (Lock + 0% -> 100% + Status) */}
            <div className="relative z-10 flex flex-col items-center space-y-1.5">
              <div className="flex items-center space-x-1.5">
                {isUnlocked ? (
                  <Unlock className="w-4 h-4 text-[#00ff88] animate-bounce" />
                ) : (
                  <Lock className="w-4 h-4 text-[#00e5ff] animate-pulse" />
                )}
                <span className="font-mono text-[11px] text-zinc-400 tracking-widest uppercase">
                  {isUnlocked ? 'AURA UNLOCKED' : 'HYDRAULIC LOCK'}
                </span>
              </div>

              {/* Giant Bold Percentage */}
              <div
                className={`font-display font-black text-5xl sm:text-6xl tracking-tighter leading-none ${
                  isUnlocked
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-white to-[#00ff88] drop-shadow-[0_0_25px_#00ff88]'
                    : 'text-white'
                }`}
              >
                {progress}%
              </div>

              {/* Status Indicator */}
              <div className="text-[11px] font-mono text-[#00ff88] max-w-[180px] truncate tracking-wider">
                {statusText}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Text: Exact match to user screenshot */}
        <div className="mt-12 flex items-center space-x-2 text-[11px] font-mono text-zinc-500 tracking-widest uppercase">
          <div className="w-2 h-2 rounded-sm border border-[#00e5ff] bg-[#00e5ff]/30 animate-spin" />
          <span>
            {isUnlocked
              ? 'DISENGAGING BLAST SEALS...'
              : 'ENGAGING HYDRAULIC PRESSURE CHAMBERS...'}
          </span>
        </div>
      </div>
    </div>
  );
}
