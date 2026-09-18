import React, { useState } from 'react';
import { ArrowUpRight, Award, ExternalLink, X, CheckCircle2, Zap } from 'lucide-react';
import { sound } from './SoundController';

export default function ProjectShowcase() {
  const [filter, setFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 'oryzo',
      title: 'ORYZO AI',
      subtitle: 'AUTONOMOUS GENERATIVE 3D ENGINE',
      category: 'WEBGL',
      year: '2026',
      modeId: 2, // Neural Matrix
      awards: ['FWA OF THE MONTH', 'AWWWARDS SITE OF THE DAY'],
      color: '#00ff88',
      description:
        'A groundbreaking WebGL platform combining real-time neural rendering with custom GLSL volumetric raymarching to showcase autonomous generative creativity.',
      deliverables: ['Custom WebGL Engine', 'Volumetric Shaders', 'Dynamic Soundscape', 'Zero-Latency Streaming'],
      stats: { fps: '60 FPS LOCKED', loadTime: '0.8s', drawCalls: '14' },
    },
    {
      id: 'infinite',
      title: 'INFINITE PASSERELLA',
      subtitle: 'VIRTUAL HAUTE COUTURE RUNWAY',
      category: '3D MOTION',
      year: '2025',
      modeId: 1, // Iridescent Prism
      awards: ['AWWWARDS SITE OF THE MONTH', 'WEBBY NOMINEE'],
      color: '#00e5ff',
      description:
        'An avant-garde digital fashion showcase simulating ultra-high-resolution dynamic cloth physics and iridescent fabric shaders directly inside mobile and desktop browsers.',
      deliverables: ['Real-time Cloth Simulation', 'Iridescent Microfacet Shaders', '360° Freecam', 'Interactive Lookbook'],
      stats: { fps: '60 FPS', loadTime: '1.1s', drawCalls: '22' },
    },
    {
      id: 'oak',
      title: 'OF THE OAK',
      subtitle: 'HOUDINI PROCEDURAL NATURE COMPANION',
      category: 'PROCEDURAL',
      year: '2025',
      modeId: 3, // Bioluminescent
      awards: ['FWA OF THE DAY', 'FWA OF THE DAY #2'],
      color: '#ff3366',
      description:
        'A companion WebGL experience for a physical museum sculpture. Custom Houdini-to-WebGL export pipeline rendering 80,000 instanced organic leaves and growth vectors.',
      deliverables: ['Houdini Pipeline', 'Instanced Foliage Meshes', 'Binaural Spatial Audio', 'Growth Sim'],
      stats: { fps: '60 FPS', loadTime: '1.2s', drawCalls: '18' },
    },
    {
      id: 'chrono',
      title: 'CHRONO SCULPT',
      subtitle: 'KINETIC HOROLOGY & PRECISION METALLICS',
      category: 'WEBGL',
      year: '2024',
      modeId: 4, // Molten Gold
      awards: ['FWA OF THE DAY', 'AWWWARDS SOTD'],
      color: '#f59e0b',
      description:
        'Ultra-luxurious interactive timepiece experience utilizing physical anisotropic specular reflections, exploded movement interactions, and gyro stabilization.',
      deliverables: ['Micro-Mechanical Physics', 'Anisotropic Shaders', 'Exploded View Interactivity', 'Haptic Pings'],
      stats: { fps: '60 FPS', loadTime: '0.9s', drawCalls: '16' },
    },
    {
      id: 'zero',
      title: 'ZERO TECH NEURAL',
      subtitle: 'DECENTRALIZED METAVERSE OS',
      category: 'SPATIAL UI',
      year: '2025',
      modeId: 0, // Liquid Chrome
      awards: ['AWWWARDS DEVELOPER AWARD'],
      color: '#a855f7',
      description:
        'A spatial operating system interface merging scroll-driven 3D navigation, reactive particle gravity, and sub-pixel typography for next-generation virtual worlds.',
      deliverables: ['Spatial UI Architecture', 'Scroll-driven Physics', 'Decentralized Identity Hub', 'GPU Audio'],
      stats: { fps: '120 FPS PRO', loadTime: '0.6s', drawCalls: '9' },
    },
    {
      id: 'apex',
      title: 'APEX QUANTUM',
      subtitle: 'SUBATOMIC GPU SIMULATION PLATFORM',
      category: 'PROCEDURAL',
      year: '2024',
      modeId: 5, // Supernova
      awards: ['WEBBY WINNER: BEST VISUAL DESIGN'],
      color: '#ef4444',
      description:
        'Simulating 250,000 subatomic quantum particles in real time using WebGL 2.0 Transform Feedback and compute shaders to visualize quantum entanglement states.',
      deliverables: ['GPGPU Particle Pipeline', 'Transform Feedback', 'Quantum State HUD', 'Educational Walkthrough'],
      stats: { fps: '60 FPS', loadTime: '0.7s', drawCalls: '8' },
    },
  ];

  const categories = ['ALL', 'WEBGL', '3D MOTION', 'SPATIAL UI', 'PROCEDURAL'];

  const filteredProjects =
    filter === 'ALL'
      ? projects
      : projects.filter((p) => p.category === filter);

  // Trigger real-time morphing of the big 3D entity when hovering or clicking projects!
  const trigger3DMorph = (p) => {
    sound.playHover();
    window.dispatchEvent(
      new CustomEvent('lusion:morph', {
        detail: { mode: p.modeId, turb: 0.8 },
      })
    );
  };

  const handleCardTilt = (e, card) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
  };

  const resetCardTilt = (card) => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  return (
    <section id="work" className="relative py-32 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-[#00ff88] tracking-widest mb-3 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88]"></span>
              <span>SELECTED ARCHIVES // HOVER TO MORPH 3D SCENE</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-white tracking-tight">
              FEATURED WORKS
            </h2>
          </div>

          {/* Filter Categories */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sound.playClick();
                  setFilter(cat);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-300 ${
                  filter === cat
                    ? 'bg-white text-black font-bold scale-105'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              onMouseEnter={() => trigger3DMorph(p)}
              onMouseMove={(e) => handleCardTilt(e, e.currentTarget)}
              onMouseLeave={(e) => resetCardTilt(e.currentTarget)}
              onClick={() => {
                sound.playClick();
                setSelectedProject(p);
              }}
              className="group relative cursor-pointer rounded-3xl bg-[#101014] border border-white/10 overflow-hidden transition-all duration-500 ease-out shadow-xl hover:border-[#00ff88]/50 hover:shadow-[0_0_35px_rgba(0,255,136,0.2)] flex flex-col justify-between"
              style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
              {/* Dynamic Visual Backdrop */}
              <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-black p-6 flex flex-col justify-between">
                <div
                  className="absolute inset-0 opacity-40 group-hover:opacity-80 group-hover:scale-115 transition-all duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${p.color}44 0%, transparent 75%)`,
                  }}
                />

                {/* Animated Graphic Element */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
                  <div
                    className="w-36 h-36 rounded-full border border-dashed animate-[spin_18s_linear_infinite]"
                    style={{ borderColor: p.color }}
                  />
                  <div
                    className="absolute w-20 h-20 rounded-full border border-dotted animate-[spin_8s_linear_infinite_reverse]"
                    style={{ borderColor: p.color }}
                  />
                </div>

                {/* Top Badge: Category & Year */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-zinc-200">
                    {p.category}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{p.year}</span>
                </div>

                {/* Awards Pill */}
                <div className="relative z-10 flex items-center space-x-1.5 text-[10px] font-mono text-[#00ff88]">
                  <Award className="w-3.5 h-3.5" />
                  <span>{p.awards[0]}</span>
                </div>
              </div>

              {/* Bottom Card Content */}
              <div className="p-6 bg-[#121216] border-t border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-xl text-white group-hover:text-[#00ff88] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1">{p.subtitle}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:bg-[#00ff88] group-hover:text-black group-hover:border-[#00ff88] transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#0e0e14] border border-white/25 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => {
                sound.playClick();
                setSelectedProject(null);
              }}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:bg-[#00ff88] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-[#00ff88] mb-3">
              <span className="w-2 h-2 rounded-full bg-[#00ff88]"></span>
              <span>{selectedProject.category} // CASE STUDY</span>
            </div>

            <h2 className="font-display font-extrabold text-4xl text-white">
              {selectedProject.title}
            </h2>
            <p className="text-sm font-mono text-zinc-400 mt-1">{selectedProject.subtitle}</p>

            {/* Awards Bar */}
            <div className="flex flex-wrap gap-2 my-6">
              {selectedProject.awards.map((award, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-1.5 bg-[#00ff88]/15 border border-[#00ff88]/40 px-3 py-1 rounded-full text-xs font-mono text-[#00ff88]"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{award}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-zinc-200 text-base leading-relaxed font-sans font-light">
              {selectedProject.description}
            </p>

            {/* Deliverables List */}
            <div className="my-8">
              <h4 className="text-xs font-mono text-zinc-400 tracking-widest uppercase mb-4">
                ENGINEERED DELIVERABLES:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProject.deliverables.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-2.5 bg-white/[0.04] border border-white/10 px-4 py-2.5 rounded-xl text-xs font-mono text-zinc-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#00ff88]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Performance Readout */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                <div className="text-xs font-mono text-zinc-400">FRAMERATE</div>
                <div className="font-mono text-lg font-bold text-[#00ff88] mt-1">
                  {selectedProject.stats.fps}
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                <div className="text-xs font-mono text-zinc-400">LOAD TIME</div>
                <div className="font-mono text-lg font-bold text-white mt-1">
                  {selectedProject.stats.loadTime}
                </div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03]">
                <div className="text-xs font-mono text-zinc-400">DRAW CALLS</div>
                <div className="font-mono text-lg font-bold text-[#00e5ff] mt-1">
                  {selectedProject.stats.drawCalls}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedProject(null);
                }}
                className="bg-white text-black font-bold text-xs font-mono px-6 py-3 rounded-full hover:bg-[#00ff88] transition-colors"
              >
                CLOSE PREVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
