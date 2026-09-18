import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowUpRight, ArrowUp, Send, CheckCircle2, Sparkles, X, Mail, User, ShieldCheck } from 'lucide-react';
import { sound } from './SoundController';

export default function ContactFooter({ isInquireOpen, setIsInquireOpen }) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedServices, setSelectedServices] = useState(['WebGL Experience', '3D & Motion Design']);
  const [budget, setBudget] = useState('$50K — $100K');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const recipientName = 'Sanjay';
  const recipientEmail = 'sanjaysanjay02081@gmail.com';

  const servicesList = [
    'WebGL Experience',
    '3D & Motion Design',
    'Interactive Installation',
    'Generative AI Pipeline',
    'Procedural Shaders',
    'Spatial UI / VisionOS',
  ];

  const budgetTiers = [
    '$15K — $30K',
    '$30K — $50K',
    '$50K — $100K',
    '$100K+',
  ];

  const toggleService = (srv) => {
    sound.playClick();
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  // ASYNCHRONOUS ZERO-REDIRECT FORM SUBMISSION:
  // User STAYS on the website, message is dispatched in background directly to Sanjay!
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    sound.playClick();

    const payload = {
      to_name: recipientName,
      to_email: recipientEmail,
      from_name: formData.name,
      reply_to: formData.email,
      services: selectedServices.join(', '),
      budget: budget,
      message: formData.message,
      subject: `New Creative Commission from ${formData.name} for Sanjay`,
    };

    try {
      // Direct AJAX delivery to Sanjay's inbox with zero page reload
      await fetch('https://formsubmit.co/ajax/sanjaysanjay02081@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          services: selectedServices.join(', '),
          budget: budget,
          message: formData.message,
          _subject: `New Project Inquiry from ${formData.name} for Sanjay`,
          _template: 'table',
        }),
      });
    } catch (err) {
      console.log('Dispatch background error:', err);
    }

    setIsSending(false);
    sound.playSuccess();

    // Fire Celebration Confetti
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00ff88', '#00e5ff', '#ffffff', '#ff3366', '#f59e0b'],
    });

    setFormSubmitted(true);
  };

  const scrollToTop = () => {
    sound.playSweep();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#040406] text-white pt-28 pb-14 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Giant Interactive Call To Action */}
        <div className="flex flex-col items-center text-center py-16">
          <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-[#00ff88] uppercase mb-6">
            <Sparkles className="w-4 h-4" />
            <span>DIRECT STUDIO COMMISSIONS</span>
          </div>

          <h2 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight text-white max-w-5xl leading-[0.95]">
            LET’S CREATE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] via-[#00e5ff] to-white hover:glow-text-emerald transition-all">
              IMPOSSIBLE.
            </span>
          </h2>

          <div className="mt-12">
            <button
              onClick={() => {
                sound.playClick();
                setFormSubmitted(false);
                setIsInquireOpen(true);
              }}
              onMouseEnter={() => sound.playHover()}
              className="group relative inline-flex items-center space-x-4 bg-white text-black font-sans font-bold text-sm sm:text-base px-10 py-5 rounded-full hover:bg-[#00ff88] transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(0,255,136,0.6)]"
            >
              <span>SEND ENQUIRY TO SANJAY</span>
              <div className="w-8 h-8 rounded-full bg-black text-white group-hover:bg-white group-hover:text-black flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Footer Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-20 border-t border-white/10">
          {/* Brand & Studio */}
          <div className="space-y-4">
            <span className="font-display font-extrabold text-2xl tracking-tight text-white flex items-center gap-2">
              SANJAY <span className="text-xs font-mono text-[#00ff88]">STUDIOS</span>
            </span>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Award-winning creative production studio directed by Sanjay. Merging real-time 3D, physics shaders, and interactive digital excellence.
            </p>
            <div className="text-xs font-mono text-zinc-500 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-ping" />
              <span>DIRECTOR: SANJAY • WORLDWIDE</span>
            </div>
          </div>

          {/* Direct Inquiries to Sanjay */}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-4">
              DIRECT INQUIRIES // SANJAY
            </h4>
            <div className="space-y-2 text-sm font-mono">
              <div>
                <a
                  href={`mailto:${recipientEmail}`}
                  onMouseEnter={() => sound.playHover()}
                  className="text-[#00ff88] hover:text-white transition-colors font-bold flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>{recipientEmail}</span>
                </a>
              </div>
              <div className="text-xs text-zinc-500 font-mono pt-1">
                Direct Client Response: &lt; 24h
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-4">
              CHANNELS
            </h4>
            <ul className="space-y-2 text-xs font-mono text-zinc-400">
              {['TWITTER / X', 'INSTAGRAM', 'LINKEDIN', 'GITHUB', 'VIMEO'].map((ch) => (
                <li key={ch}>
                  <a
                    href="#"
                    onClick={() => sound.playClick()}
                    onMouseEnter={() => sound.playHover()}
                    className="hover:text-[#00ff88] transition-colors flex items-center space-x-1"
                  >
                    <span>{ch}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Jump */}
          <div className="flex flex-col justify-between items-start md:items-end">
            <button
              onClick={scrollToTop}
              onMouseEnter={() => sound.playHover()}
              className="flex items-center space-x-2 text-xs font-mono text-zinc-400 hover:text-white border border-white/10 px-4 py-2 rounded-full hover:border-[#00ff88] transition-all"
            >
              <span>TOP OF EXPERIENCE</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#00ff88]" />
            </button>
            <div className="mt-8 md:mt-0 text-[11px] font-mono text-zinc-600">
              © {new Date().getFullYear()} SANJAY STUDIOS LTD. <br /> ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Project Inquiry Modal with ZERO REDIRECT */}
      {isInquireOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl"
          onClick={() => setIsInquireOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0d0d14] border border-white/25 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-y-auto max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => {
                sound.playClick();
                setIsInquireOpen(false);
              }}
              className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white hover:bg-[#00ff88] hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              /* Success State - User stays right on website! */
              <div className="text-center py-12 space-y-5 animate-scale-up">
                <div className="w-20 h-20 rounded-full bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/40 mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(0,255,136,0.4)]">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#00ff88] px-3 py-1 rounded-full border border-[#00ff88]/30 bg-[#00ff88]/10">
                  <ShieldCheck className="w-4 h-4" />
                  <span>TRANSMISSION CONFIRMED</span>
                </div>
                <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                  BRIEF RECEIVED BY SANJAY
                </h3>
                <p className="text-zinc-300 text-sm font-sans max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-bold">{formData.name}</span>. Your project brief has been dispatched directly to <span className="text-[#00ff88] font-mono font-bold">{recipientEmail}</span>. Sanjay will review your requirements and respond within 24 hours.
                </p>

                <div className="pt-6 flex justify-center">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsInquireOpen(false);
                      setFormData({ name: '', email: '', message: '' });
                    }}
                    className="bg-white text-black font-extrabold text-xs font-mono px-8 py-3.5 rounded-full hover:bg-[#00ff88] transition-colors"
                  >
                    CONTINUE EXPLORING SITE
                  </button>
                </div>
              </div>
            ) : (
              /* Inquiry Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#00ff88] mb-2 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-ping" />
                    <span>DIRECT INQUIRY // TO SANJAY ({recipientEmail})</span>
                  </div>
                  <h3 className="font-display font-extrabold text-3xl text-white">
                    INITIATE A PROJECT COMMISSION
                  </h3>
                </div>

                {/* Service tags */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-3">
                    SERVICES NEEDED:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {servicesList.map((srv) => {
                      const isSel = selectedServices.includes(srv);
                      return (
                        <button
                          type="button"
                          key={srv}
                          onClick={() => toggleService(srv)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-mono border transition-all ${
                            isSel
                              ? 'bg-[#00ff88] text-black border-[#00ff88] font-extrabold shadow-[0_0_15px_rgba(0,255,136,0.5)]'
                              : 'bg-white/5 text-zinc-300 border-white/10 hover:text-white'
                          }`}
                        >
                          {srv}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget selection */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-3">
                    ESTIMATED BUDGET:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {budgetTiers.map((tier) => (
                      <button
                        type="button"
                        key={tier}
                        onClick={() => {
                          sound.playClick();
                          setBudget(tier);
                        }}
                        className={`p-3 rounded-xl text-xs font-mono text-center border transition-all ${
                          budget === tier
                            ? 'bg-white text-black border-white font-extrabold'
                            : 'bg-white/5 text-zinc-300 border-white/10 hover:text-white'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                      YOUR NAME *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/70 border border-white/15 focus:border-[#00ff88] outline-none px-4 py-3.5 rounded-xl text-sm font-mono text-white placeholder:text-zinc-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                      YOUR EMAIL *
                    </label>
                    <input
                      required
                      type="email"
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black/70 border border-white/15 focus:border-[#00ff88] outline-none px-4 py-3.5 rounded-xl text-sm font-mono text-white placeholder:text-zinc-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                    PROJECT VISION & OBJECTIVES
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your desired aesthetic, deliverables, and timeline..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/70 border border-white/15 focus:border-[#00ff88] outline-none p-4 rounded-xl text-sm font-mono text-white placeholder:text-zinc-600"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSending}
                  onMouseEnter={() => sound.playHover()}
                  className="w-full py-4 rounded-full bg-[#00ff88] text-black font-sans font-extrabold text-sm tracking-widest flex items-center justify-center space-x-2 hover:bg-white transition-all shadow-[0_0_25px_rgba(0,255,136,0.5)]"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSending ? 'DISPATCHING TO SANJAY...' : 'DISPATCH COMMISSION BRIEF TO SANJAY'}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
