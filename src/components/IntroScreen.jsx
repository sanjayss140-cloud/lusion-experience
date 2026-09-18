import React, { useState, useEffect } from 'react';
import { sound } from './SoundController';
import { Sparkles, Zap, Shield, Activity, ArrowRight, Radio } from 'lucide-react';

export default function IntroScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('CALIBRATING NEURAL CORES...');
  const [isReady, setIsReady] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    // Progressive boot telemetry sequence
    const statuses = [
      { at: 15, text: 'ALLOCATING 25,000 GPU PARTICLES...' },
      { at: 40, text: 'SYNTHESIZING PROCEDURAL GLSL SHADERS...' },
      { at: 68, text: 'CALIBRATING 4D GYROSCOPIC TENSOR FIELDS...' },
      { at: 88, text: 'INITIALIZING ACOUSTIC HARMONICS...' },
      { at: 100, text: 'SANJAY STUDIOS SYSTEM PRIMED.' },
    ];

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(current);

      const found = statuses.find((s) => s.at === current);
      if (found) {
        setStatusText(found.text);
        sound.playHover();
      }

      if (current >= 100) {
        clearInterval(interval);
        setIsReady(true);
      }
    }, 28);

    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    sound.init();
    sound.playShockwave();
    setIsEntering(true);

    // Wait for cinematic warp shutter animation, then unmount
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 900);
  };

  return (
    <div
      className={`fixed inset-0 z-[999999] bg-[#020204] flex flex-col items-center justify-between p-8 sm:p-14 select-none transition-all duration-700 ${
        isEntering ? 'opacity-0 scale-110 pointer-events-none filter blur-xl' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Animated Cyber Matrix Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-gradient from-[#00ff88]/10 via-transparent to-black pointer-events-none" />

      {/* Floating Center Singularity Light Beacon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full bg-[#00ff88]/10 filter blur-3xl animate-pulse" />
        <div className="absolute w-48 h-48 rounded-full border border-[#00ff88]/20 animate-[spin_20s_linear_infinite]" />
        <div className="absolute w-72 h-72 rounded-full border border-dashed border-[#00e5ff]/20 animate-[spin_30s_linear_infinite_reverse]" />
      </div>

      {/* Top Header Telemetry */}
      <div className="relative z-10 w-full max-w-7xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88] animate-ping" />
          <span className="font-mono text-xs text-zinc-300 tracking-[0.25em] uppercase">
            SANJAY STUDIOS // BOOT SEQUENCE
          </span>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs text-zinc-500">
          <Activity className="w-3.5 h-3.5 text-[#00ff88]" />
          <span>V8.4 HYPER-ENGINE</span>
        </div>
      </div>

      {/* Center Hero Typography */}
      <div className="relative z-10 text-center my-auto max-w-4xl space-y-6">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10 text-xs font-mono text-[#00ff88] tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>REAL-TIME 3D EXPERIENTIAL LAB</span>
        </div>

        <h1 className="font-display font-black text-6xl sm:text-8xl lg:text-9xl tracking-tighter text-white leading-none">
          SANJAY <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00e5ff] to-white drop-shadow-[0_0_40px_rgba(0,255,136,0.6)]">
            STUDIOS.
          </span>
        </h1>

        <p className="text-sm sm:text-base font-mono text-zinc-400 max-w-lg mx-auto tracking-wider">
          WHERE COMPUTATIONAL FLUIDS, SHADERS, AND AURA CONVERGE.
        </p>

        {/* Enter CTA or Progress Bar */}
        <div className="pt-8 flex flex-col items-center justify-center">
          {isReady ? (
            <button
              onClick={handleEnter}
              onMouseEnter={() => sound.playHover()}
              className="group relative inline-flex items-center space-x-4 bg-white text-black font-sans font-black text-sm sm:text-base px-10 py-5 rounded-full hover:bg-[#00ff88] hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(0,255,136,0.5)] cursor-pointer"
            >
              <span className="tracking-widest">ENTER THE EXPERIENCE</span>
              <div className="w-8 h-8 rounded-full bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ) : (
            <div className="w-72 sm:w-96 flex flex-col items-center space-y-3">
              {/* Progress Bar Container */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-[#00ff88] to-[#00e5ff] transition-all duration-75 ease-out rounded-full shadow-[0_0_15px_#00ff88]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Numeric readout */}
              <div className="w-full flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500 truncate">{statusText}</span>
                <span className="text-[#00ff88] font-bold ml-4">{progress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] font-mono text-zinc-500">
        <div className="flex items-center space-x-4">
          <span>DIRECTOR: SANJAY</span>
          <span>•</span>
          <span>AUDIO SYNTHESIS ON STANDBY</span>
        </div>
        <div className="text-zinc-400">
          HEADPHONES RECOMMENDED // HARDWARE ACCELERATED
        </div>
      </div>
    </div>
  );
}
