import React, { useState, useEffect } from 'react';
import { Cpu, Activity, Globe, ShieldCheck, Zap } from 'lucide-react';

export default function StudioMetrics() {
  const [gpuInfo, setGpuInfo] = useState('Detecting GPU...');
  const [fps, setFps] = useState(60);
  const [fpsHistory, setFpsHistory] = useState([59, 60, 60, 58, 60, 60, 59, 60]);

  useEffect(() => {
    // Detect GPU renderer
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          setGpuInfo(renderer || 'Hardware Accelerated WebGL');
        } else {
          setGpuInfo('WebGL 2.0 Graphics Pipeline');
        }
      }
    } catch (e) {
      setGpuInfo('Standard GPU Pipeline');
    }

    // FPS loop
    let frameCount = 0;
    let lastTime = performance.now();
    let animId;

    const measure = () => {
      frameCount++;
      const now = performance.now();
      if (now - lastTime >= 1000) {
        const currentFps = Math.min(Math.round((frameCount * 1000) / (now - lastTime)), 120);
        setFps(currentFps);
        setFpsHistory((prev) => [...prev.slice(1), currentFps]);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section id="studio" className="relative py-20 bg-[#060608] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-[#00ff88] animate-ping" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#00ff88]">
                STUDIO TELEMETRY // REAL-TIME SYSTEM HUD
              </h3>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono text-zinc-400">
              <span className="flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>HQ: BRISTOL, UK (51.4545° N, 2.5879° W)</span>
              </span>
            </div>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {/* GPU Renderer */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>GPU ACCELERATION</span>
                <Cpu className="w-4 h-4 text-[#00ff88]" />
              </div>
              <div className="mt-4">
                <div className="font-mono text-xs text-white truncate" title={gpuInfo}>
                  {gpuInfo}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  WEBGL 2.0 • ACES FILMIC TONE
                </div>
              </div>
            </div>

            {/* Live Framerate */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>REALTIME FRAMERATE</span>
                <Activity className="w-4 h-4 text-[#00e5ff]" />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <div className="font-mono text-2xl font-bold text-[#00ff88]">
                    {fps} <span className="text-xs font-normal text-zinc-400">FPS</span>
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    VSYNC STABLE
                  </div>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end space-x-1 h-6">
                  {fpsHistory.map((val, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 bg-[#00ff88]/60 rounded-t"
                      style={{ height: `${Math.min((val / 60) * 100, 100)}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Draw Calls & Vertices */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>POLYGON BUDGET</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-4">
                <div className="font-mono text-2xl font-bold text-white">
                  65.5K <span className="text-xs font-normal text-zinc-400">VERTS</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  18 DRAW CALLS • OPTIMIZED
                </div>
              </div>
            </div>

            {/* Security & Studio Availability */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
                <span>STUDIO DISPATCH</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
                  <span className="font-mono text-sm font-bold text-white">Q3 / Q4 COMMISSIONS</span>
                </div>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  ACCEPTING SELECT PROJECTS
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
