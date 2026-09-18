import React, { useEffect, useRef, useState } from 'react';

export default function Cursor() {
  const ringRef = useRef(null);
  const [sparks, setSparks] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only on fine pointers (mouse)
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target;
      const interactive = target && target.closest('a, button, input, textarea, [role="button"], [data-cursor="hover"]');
      setIsHovered(!!interactive);
    };

    const onClick = (e) => {
      // Spawn burst of 8 glowing spark particles at click coordinates
      const newSparks = Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const speed = 25 + Math.random() * 35;
        return {
          id: Date.now() + '-' + i,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        };
      });

      setSparks((prev) => [...prev.slice(-16), ...newSparks]);

      // Remove after 600ms
      setTimeout(() => {
        setSparks((prev) => prev.filter((s) => !newSparks.includes(s)));
      }, 600);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    const animate = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden">
      {/* Trailing luminous aura ring that tracks cursor without blocking anything */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border transition-all duration-150 ease-out pointer-events-none ${
          isHovered
            ? 'w-12 h-12 border-[#00ff88] bg-[#00ff88]/15 shadow-[0_0_25px_rgba(0,255,136,0.6)] scale-110'
            : 'w-7 h-7 border-white/40 bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.2)]'
        }`}
        style={{ willChange: 'transform' }}
      />

      {/* Click Spark Bursts */}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#00ff88] shadow-[0_0_8px_#00ff88] pointer-events-none animate-ping"
          style={{
            transform: `translate3d(${spark.x + spark.vx}px, ${spark.y + spark.vy}px, 0)`,
            transition: 'all 0.5s cubic-bezier(0.1, 0.9, 0.2, 1)',
          }}
        />
      ))}
    </div>
  );
}
