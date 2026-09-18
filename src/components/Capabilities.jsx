import React, { useState } from 'react';
import { Layers, Terminal, Sparkles, Cpu, ChevronRight, Check } from 'lucide-react';
import { sound } from './SoundController';

export default function Capabilities() {
  const [activeService, setActiveService] = useState(0);

  const marqueeItems = [
    'REAL-TIME 3D',
    'PROCEDURAL GLSL SHADERS',
    'WEBGL & WEBGPU EXCELLENCE',
    'INTERACTIVE INSTALLATIONS',
    'CREATIVE DIRECTION',
    'GENERATIVE NEURAL PIPELINES',
    'SPATIAL COMPUTING',
    'SOUND SYNTHESIS',
  ];

  const services = [
    {
      id: 0,
      title: '3D & MOTION ARCHITECTURE',
      icon: Layers,
      summary: 'Procedural asset generation, character animation, and Houdini simulation pipelines.',
      details: [
        'Houdini-to-WebGL automated asset compression and poly-reduction',
        'Complex cloth, smoke, fluid, and particle dynamic simulations',
        'Custom rigging and real-time inverse kinematics (IK)',
        'Physically-based rendering (PBR) and photoreal cinematic texturing',
      ],
    },
    {
      id: 1,
      title: 'WEBGL & SHADER DEVELOPMENT',
      icon: Terminal,
      summary: 'Handcrafted GLSL compute shaders and 60FPS fluid WebGL experiences on all devices.',
      details: [
        'Custom fragment & vertex shaders for refractive glass, iridescent sheen, and chrome',
        'GPGPU particle systems processing up to 500,000 live particles',
        'Mobile WebGL optimization guaranteeing buttery 60/120 FPS performance',
        'Smooth inertia scroll mechanics and custom physics integration',
      ],
    },
    {
      id: 2,
      title: 'INTERACTIVE EXPERIENCES & INSTALLATIONS',
      icon: Sparkles,
      summary: 'Bridging digital frontiers with physical spaces, spatial audio, and sensory UX.',
      details: [
        'Museum, festival, and corporate physical interactive installation design',
        'Touchless camera vision and gesture tracking algorithms',
        'Multi-channel generative Web Audio API soundscapes',
        'AR/VR and Apple Vision Pro spatial web applications',
      ],
    },
    {
      id: 3,
      title: 'GENERATIVE AI & CREATIVE PIPELINES',
      icon: Cpu,
      summary: 'Engineering custom AI pipelines for dynamic generative 3D storytelling.',
      details: [
        'Autonomous procedural scene generation via custom ML models',
        'Latent-space 3D mesh morphing and real-time diffusion mapping',
        'Automated multi-resolution asset delivery and real-time telemetry',
        'Novel user co-creation tools and dynamic interactive branding',
      ],
    },
  ];

  const awards = [
    { count: '18', label: 'FWA OF THE DAY' },
    { count: '12', label: 'AWWWARDS SOTD / SOTM' },
    { count: '6', label: 'WEBBY HONORS' },
    { count: '100%', label: 'ORIGINAL CODE' },
  ];

  return (
    <section id="capabilities" className="relative py-28 bg-[#07070a] border-t border-white/10 overflow-hidden">
      {/* Infinite Kinetic Marquee Ticker */}
      <div className="relative w-full border-y border-white/10 py-5 bg-white/[0.015] overflow-hidden">
        <div className="animate-marquee flex items-center space-x-8 whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-8">
              <span className="font-display font-extrabold text-2xl tracking-tight text-zinc-300">
                {item}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-28">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#00ff88] tracking-widest mb-3 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>
            <span>CORE CAPABILITIES & DISCIPLINES</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight">
            WHERE IMAGINATION MEETS COMPUTATIONAL PRECISION.
          </h2>
          <p className="text-zinc-400 text-base font-light mt-4 leading-relaxed">
            We don't settle for templates or standard frameworks. We build tailored 3D engines, custom GLSL math, and tactile interactive systems from first principles.
          </p>
        </div>

        {/* Interactive Capabilities Grid / Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Services Menu */}
          <div className="lg:col-span-5 space-y-3">
            {services.map((service, index) => {
              const Icon = service.icon;
              const isActive = activeService === index;
              return (
                <div
                  key={service.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveService(index);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                    isActive
                      ? 'bg-white/[0.06] border-[#00ff88] shadow-[0_0_25px_rgba(0,255,136,0.15)]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                        isActive
                          ? 'bg-[#00ff88] text-black border-[#00ff88]'
                          : 'bg-white/5 text-zinc-400 border-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`font-display font-bold text-sm tracking-wide ${
                          isActive ? 'text-white' : 'text-zinc-300'
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">
                        0{index + 1} // DISCIPLINE
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'text-[#00ff88] translate-x-1' : 'text-zinc-600'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Right Service Deep Dive Panel */}
          <div className="lg:col-span-7 bg-[#0f0f14] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-xl min-h-[380px] flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#00ff88] mb-4">
                <span>DETAIL VIEW</span>
                <span>//</span>
                <span>0{activeService + 1}</span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                {services[activeService].title}
              </h3>
              <p className="text-zinc-400 font-sans text-sm sm:text-base mt-3 leading-relaxed">
                {services[activeService].summary}
              </p>

              <div className="mt-8 space-y-3">
                <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest">
                  SPECIALIZED COMPETENCIES:
                </h4>
                {services[activeService].details.map((detail, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-zinc-300">
                    <div className="w-5 h-5 rounded-full bg-[#00ff88]/10 text-[#00ff88] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>STATUS: AVAILABLE FOR SELECT COMMISSIONS</span>
              <span className="text-[#00ff88] font-semibold">GLOBAL READY</span>
            </div>
          </div>
        </div>

        {/* Studio Awards Counter Bar */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-white/10 py-10">
          {awards.map((award, i) => (
            <div key={i} className="text-center sm:text-left">
              <div className="font-display font-extrabold text-4xl sm:text-5xl text-white">
                {award.count}
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-1 tracking-widest">
                {award.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
