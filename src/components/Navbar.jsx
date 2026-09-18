import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight } from 'lucide-react';
import { sound } from './SoundController';

export default function Navbar({ onOpenInquire }) {
  const [isSoundActive, setIsSoundActive] = useState(false);
  const [ukTime, setUkTime] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format time in London/Bristol UK timezone
      const timeStr = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/London',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setUkTime(`${timeStr} GMT`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleSoundToggle = () => {
    const active = sound.toggleSound();
    setIsSoundActive(active);
  };

  const navLinks = [
    { label: 'WORK', href: '#work' },
    { label: 'LABS', href: '#labs' },
    { label: 'CAPABILITIES', href: '#capabilities' },
    { label: 'STUDIO', href: '#studio' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-[#080808]/85 backdrop-blur-md border-b border-white/10 py-3.5'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={() => sound.playClick()}
          className="group flex items-center space-x-3 text-white transition-opacity hover:opacity-80"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-white/5 group-hover:border-[#00ff88]/50 transition-colors">
            <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping opacity-75 absolute"></span>
            <span className="w-2 h-2 rounded-full bg-[#00ff88] relative"></span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
              SANJAY <span className="text-[10px] tracking-widest font-mono text-[#00ff88] font-normal">STUDIO</span>
            </span>
          </div>
        </a>

        {/* Center Nav Items (Desktop) */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="text-xs font-mono font-medium tracking-widest text-zinc-400 hover:text-white transition-colors py-1 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#00ff88] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right side: Studio Clock, Sound Toggle, CTA */}
        <div className="flex items-center space-x-4">
          {/* Bristol Local Clock */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] font-mono text-zinc-400 border border-white/10 px-3 py-1.5 rounded-full bg-white/[0.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse"></span>
            <span>BRISTOL</span>
            <span className="text-zinc-200">{ukTime}</span>
          </div>

          {/* Sound Synthesizer Equalizer Toggle */}
          <button
            onClick={handleSoundToggle}
            onMouseEnter={() => sound.playHover()}
            aria-label="Toggle ambient soundscape"
            className={`flex items-center space-x-2.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 ${
              isSoundActive
                ? 'border-[#00ff88]/50 bg-[#00ff88]/10 text-[#00ff88]'
                : 'border-white/10 bg-white/5 text-zinc-400 hover:border-white/30 hover:text-white'
            }`}
          >
            {isSoundActive ? (
              <div className="flex items-end space-x-0.5 h-3">
                <span className="w-0.5 bg-[#00ff88] animate-[bounce_0.6s_infinite] h-2"></span>
                <span className="w-0.5 bg-[#00ff88] animate-[bounce_0.9s_infinite] h-3"></span>
                <span className="w-0.5 bg-[#00ff88] animate-[bounce_0.7s_infinite] h-1.5"></span>
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline tracking-wider">
              {isSoundActive ? 'SOUND ON' : 'SOUND'}
            </span>
          </button>

          {/* Magnetic Inquire CTA */}
          <button
            onClick={() => {
              sound.playClick();
              if (onOpenInquire) onOpenInquire();
            }}
            onMouseEnter={() => sound.playHover()}
            className="hidden sm:flex items-center space-x-2 bg-white text-black hover:bg-[#00ff88] transition-colors duration-300 px-4 py-1.5 rounded-full font-sans font-semibold text-xs tracking-wider"
          >
            <span>INQUIRE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0c] border-b border-white/10 px-6 py-6 mt-3 space-y-4">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
              }}
              className="block text-sm font-mono tracking-widest text-zinc-300 hover:text-[#00ff88]"
            >
              {item.label}
            </a>
          ))}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(false);
              if (onOpenInquire) onOpenInquire();
            }}
            className="w-full mt-2 flex items-center justify-center space-x-2 bg-white text-black py-2.5 rounded-full font-sans font-bold text-xs tracking-wider"
          >
            <span>START A PROJECT</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </header>
  );
}
