import React, { useState, useEffect, useRef } from 'react';
import { sound } from './SoundController';
import { Lock, Unlock } from 'lucide-react';

export default function IntroScreen({ onComplete }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);

  // Direct DOM refs to eliminate React re-render overhead while numbers load
  const progressTextRef = useRef(null);
  const circleProgressRef = useRef(null);
  const statusTextRef = useRef(null);
  const bottomStatusRef = useRef(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    // Ultra-smooth RAF loop using performance.now()
    // Zero React re-renders = 100% immune to lag or stutter!
    let start = null;
    const duration = 2300; // 2.3 seconds smooth cinematic load
    let rafId = null;

    const tick = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const raw = Math.min(elapsed / duration, 1);

      // Smooth cubic-out easing for natural cinematic deceleration
      const progress = 1 - Math.pow(1 - raw, 2.2);
      const pct = Math.floor(progress * 100);

      // 1. Direct text update (Zero React lag)
      if (progressTextRef.current) {
        progressTextRef.current.innerText = `${pct}%`;
      }

      // 2. Direct SVG dashoffset update
      if (circleProgressRef.current) {
        const offset = 276.46 - (276.46 * progress);
        circleProgressRef.current.style.strokeDashoffset = `${offset}`;
      }

      // 3. Status text update at key milestones
      if (statusTextRef.current) {
        if (pct < 25) {
          statusTextRef.current.innerText = 'INITIALIZING BLAST VAULT...';
        } else if (pct < 55) {
          statusTextRef.current.innerText = 'CHARGING CHEVRON CONDUITS...';
        } else if (pct < 85) {
          statusTextRef.current.innerText = 'SYNCHRONIZING SOVEREIGN CORE...';
        } else if (pct < 100) {
          statusTextRef.current.innerText = 'MAXIMUM AURA PRESSURE...';
        } else {
          statusTextRef.current.innerText = 'AURA FLUX REACHED';
        }
      }

      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // 100% REACHED!
        setIsUnlocked(true);
        if (bottomStatusRef.current) {
          bottomStatusRef.current.innerText = 'DISENGAGING BLAST SEALS...';
        }

        // Hollywood cinematic auto-open after 350ms pause of anticipation
        setTimeout(() => {
          triggerHollywoodGateOpen();
        }, 350);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const triggerHollywoodGateOpen = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // 1. Notify Sovereign 3D Entity in HeroCanvas to start forward camera glide & shockwave!
    window.dispatchEvent(new CustomEvent('gate:opening'));

    // 2. Play 3.8s Hollywood cinematic seismic rumble + brass swell
    sound.init();
    sound.playGateOpen();
    setGateOpen(true);

    // 3. Keep gate moving slowly and aura forming over 4.2s, then complete
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 4200);
  };

  const handleScreenClick = () => {
    if (!hasTriggeredRef.current) {
      if (progressTextRef.current) progressTextRef.current.innerText = '100%';
      if (circleProgressRef.current) circleProgressRef.current.style.strokeDashoffset = '0';
      setIsUnlocked(true);
      triggerHollywoodGateOpen();
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className={`fixed inset-0 z-[999999] overflow-hidden select-none cursor-pointer transition-opacity duration-1000 ${
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
          Semi-transparent dark smoked titanium glass revealing 3D entity behind!
          ======================================================== */}
      <div
        className="absolute top-0 left-0 bottom-0 w-1/2 bg-[#06070a]/92 backdrop-blur-md shadow-[40px_0_100px_rgba(0,0,0,0.95)] z-20 overflow-hidden"
        style={{
          transform: gateOpen ? 'translateX(-104%) rotateY(-6deg)' : 'translateX(0%) rotateY(0deg)',
          transformOrigin: 'left center',
          transition: 'transform 3800ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Diamond Carbon Plating Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0d14_25%,transparent_25%),linear-gradient(225deg,#0a0d14_25%,transparent_25%),linear-gradient(45deg,#0a0d14_25%,transparent_25%),linear-gradient(315deg,#0a0d14_25%,#050608_25%)] bg-[size:48px_48px] opacity-45 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#06070a]/60 to-[#020204] pointer-events-none" />
      </div>

      {/* ========================================================
          RIGHT BLAST GATE (SLIDES OPEN SLOWLY TO THE RIGHT)
          Semi-transparent dark smoked titanium glass revealing 3D entity behind!
          ======================================================== */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-[#06070a]/92 backdrop-blur-md shadow-[-40px_0_100px_rgba(0,0,0,0.95)] z-20 overflow-hidden"
        style={{
          transform: gateOpen ? 'translateX(104%) rotateY(6deg)' : 'translateX(0%) rotateY(0deg)',
          transformOrigin: 'right center',
          transition: 'transform 3800ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Diamond Carbon Plating Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0d14_25%,transparent_25%),linear-gradient(225deg,#0a0d14_25%,transparent_25%),linear-gradient(45deg,#0a0d14_25%,transparent_25%),linear-gradient(315deg,#0a0d14_25%,#050608_25%)] bg-[size:48px_48px] opacity-45 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#06070a]/60 to-[#020204] pointer-events-none" />
      </div>

      {/* ========================================================
          VERTICAL CHEVRON ENERGY COLUMN (EXACT AS SCREENSHOT)
          Directly conduits energy from Sovereign 3D Core!
          ======================================================== */}
      <div
        className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-25 flex flex-col items-center justify-between pointer-events-none py-2 transition-all duration-[3000ms] ${
          gateOpen ? 'opacity-0 scale-y-125' : 'opacity-100'
        }`}
        style={{ width: '36px' }}
      >
        {/* Glowing vertical line track */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-[#00e5ff] via-[#00ff88] to-[#00e5ff] opacity-85 shadow-[0_0_15px_#00ff88]" />

        {/* Cascading Chevrons */}
        <div className="flex flex-col items-center justify-around h-full w-full opacity-90">
          {[...Array(26)].map((_, i) => (
            <svg
              key={i}
              className="w-5 h-3.5 sm:w-7 sm:h-5 animate-pulse"
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
        <div className="relative w-36 sm:w-48 h-full flex justify-between px-4 sm:px-8">
          <div className="w-4 sm:w-5 h-full bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-900 rounded-full border border-zinc-700 shadow-[0_0_25px_rgba(0,0,0,0.8)] opacity-75" />
          <div className="w-4 sm:w-5 h-full bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-900 rounded-full border border-zinc-700 shadow-[0_0_25px_rgba(0,0,0,0.8)] opacity-75" />
        </div>
      </div>

      {/* ========================================================
          CENTER CIRCULAR VAULT CORE (EXACT AS SCREENSHOT)
          ======================================================== */}
      <div
        className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none px-4"
        style={{
          opacity: gateOpen ? 0 : 1,
          transform: gateOpen ? 'scale(1.2)' : 'scale(1)',
          transition: 'all 2800ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Fine Cyan Dashed Orbital Rings */}
          <div className="w-64 h-64 sm:w-88 sm:h-88 rounded-full border border-dashed border-[#00e5ff]/40 animate-[spin_32s_linear_infinite]" />
          <div className="absolute w-56 h-56 sm:w-80 sm:h-80 rounded-full border border-dashed border-[#00ff88]/30 animate-[spin_24s_linear_infinite_reverse]" />

          {/* Glowing Aura Bloom */}
          <div
            className={`absolute w-48 h-48 sm:w-72 sm:h-72 rounded-full filter blur-3xl transition-colors duration-700 ${
              isUnlocked ? 'bg-[#00ff88]/35 animate-pulse' : 'bg-[#00e5ff]/20'
            }`}
          />

          {/* Heavy Dark Vault Shell with Direct DOM Refs */}
          <div className="absolute w-48 h-48 sm:w-68 sm:h-68 rounded-full bg-[#0d0f17]/95 border-4 sm:border-[6px] border-[#1a1d29] shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col items-center justify-center p-4 sm:p-6 text-center">
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
                ref={circleProgressRef}
                cx="50"
                cy="50"
                r="44"
                stroke={isUnlocked ? '#00ff88' : '#00e5ff'}
                strokeWidth="3.5"
                strokeDasharray={276.46}
                strokeDashoffset={276.46}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  filter: isUnlocked
                    ? 'drop-shadow(0 0 12px #00ff88)'
                    : 'drop-shadow(0 0 8px #00e5ff)',
                  transition: 'stroke 300ms ease',
                }}
              />
            </svg>

            {/* Core Center Readout (Lock + 0% -> 100% + Status) */}
            <div className="relative z-10 flex flex-col items-center space-y-1">
              <div className="flex items-center space-x-1.5">
                {isUnlocked ? (
                  <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00ff88] animate-bounce" />
                ) : (
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00e5ff] animate-pulse" />
                )}
                <span className="font-mono text-[9px] sm:text-[11px] text-zinc-400 tracking-widest uppercase">
                  {isUnlocked ? 'AURA UNLOCKED' : 'HYDRAULIC LOCK'}
                </span>
              </div>

              {/* Giant Bold Percentage - Direct DOM node for 100% zero-lag performance */}
              <div
                ref={progressTextRef}
                className={`font-display font-black text-4xl sm:text-6xl tracking-tighter leading-none ${
                  isUnlocked
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-white to-[#00ff88] drop-shadow-[0_0_25px_#00ff88]'
                    : 'text-white'
                }`}
              >
                0%
              </div>

              {/* Status Indicator */}
              <div
                ref={statusTextRef}
                className="text-[9px] sm:text-[11px] font-mono text-[#00ff88] max-w-[150px] sm:max-w-[180px] truncate tracking-wider"
              >
                INITIALIZING BLAST VAULT...
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Text: Exact match to user screenshot */}
        <div className="mt-8 sm:mt-12 flex items-center space-x-2 text-[10px] sm:text-[11px] font-mono text-zinc-500 tracking-widest uppercase">
          <div className="w-2 h-2 rounded-sm border border-[#00e5ff] bg-[#00e5ff]/30 animate-spin" />
          <span ref={bottomStatusRef}>
            ENGAGING HYDRAULIC PRESSURE CHAMBERS...
          </span>
        </div>
      </div>
    </div>
  );
}
