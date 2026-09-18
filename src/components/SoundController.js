// Enhanced Web Audio API Sound Engine
// Features deep sub-bass shockwaves, kinetic UI chimes, frequency warps, and ambient drones

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.droneFilter = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      // Master ambient chain
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.droneFilter = this.ctx.createBiquadFilter();
      this.droneFilter.type = 'lowpass';
      this.droneFilter.frequency.setValueAtTime(220, this.ctx.currentTime);
      this.droneFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      this.ambientGain.connect(this.droneFilter);
      this.droneFilter.connect(this.ctx.destination);

      // Drone Oscillator 1 (D2 ~ 73.4Hz)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(73.4, this.ctx.currentTime);

      // Drone Oscillator 2 (110Hz harmonic)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(110.0, this.ctx.currentTime);

      this.droneOsc1.connect(this.ambientGain);
      this.droneOsc2.connect(this.ambientGain);

      this.droneOsc1.start();
      this.droneOsc2.start();

      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext deferred:', e);
    }
  }

  toggleSound() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (this.ambientGain) {
      const targetGain = this.isMuted ? 0 : 0.05;
      this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 1.2);
    }

    if (!this.isMuted) {
      this.playShockwave();
    }

    return !this.isMuted;
  }

  // MASSIVE SUB-BASS SHOCKWAVE DROP
  playShockwave() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Sub-bass 808 drop: starts at 140Hz and plunges to 28Hz
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(28, this.ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.5);
    } catch (e) {}
  }

  // SUPERNOVA EXPLOSION WARP
  playSupernova() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } catch (e) {}
  }

  playHover() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400 + Math.random() * 200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(700, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playClick() {
    this.playShockwave();
  }

  playSweep() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);
    } catch (e) {}
  }

  // HOLLYWOOD CINEMATIC BLAST GATE AUDIO (SLOW HEAVY PARTING + AURA SURGE)
  playGateOpen() {
    this.init();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    try {
      const now = this.ctx.currentTime;

      // 1. Initial Heavy Hydraulic Release Clank (0s - 0.5s)
      const clankOsc = this.ctx.createOscillator();
      const clankGain = this.ctx.createGain();
      clankOsc.type = 'sawtooth';
      clankOsc.frequency.setValueAtTime(320, now);
      clankOsc.frequency.exponentialRampToValueAtTime(65, now + 0.35);
      clankGain.gain.setValueAtTime(0.2, now);
      clankGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      clankOsc.connect(clankGain);
      clankGain.connect(this.ctx.destination);
      clankOsc.start(now);
      clankOsc.stop(now + 0.4);

      // 2. Continuous Deep Sub-Bass Earth Rumble (Dune / Blade Runner style) lasting 3.8s
      const rumbleOsc = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();
      rumbleOsc.type = 'triangle';
      rumbleOsc.frequency.setValueAtTime(48, now);
      rumbleOsc.frequency.linearRampToValueAtTime(36, now + 2.0);
      rumbleOsc.frequency.linearRampToValueAtTime(28, now + 3.8);

      rumbleGain.gain.setValueAtTime(0.01, now);
      rumbleGain.gain.linearRampToValueAtTime(0.25, now + 0.6);
      rumbleGain.gain.linearRampToValueAtTime(0.22, now + 2.6);
      rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

      rumbleOsc.connect(rumbleGain);
      rumbleGain.connect(this.ctx.destination);
      rumbleOsc.start(now);
      rumbleOsc.stop(now + 4.0);

      // 3. Cinematic Brass / Aura Swell (Hans Zimmer crescendo)
      const swellOsc = this.ctx.createOscillator();
      const swellGain = this.ctx.createGain();
      swellOsc.type = 'sawtooth';
      swellOsc.frequency.setValueAtTime(65.4, now + 0.4); // C2
      swellOsc.frequency.exponentialRampToValueAtTime(130.8, now + 3.2); // C3

      // Lowpass filter to give that dark, warm Hollywood brass texture
      const swellFilter = this.ctx.createBiquadFilter();
      swellFilter.type = 'lowpass';
      swellFilter.frequency.setValueAtTime(180, now + 0.4);
      swellFilter.frequency.exponentialRampToValueAtTime(800, now + 3.2);

      swellGain.gain.setValueAtTime(0.001, now + 0.4);
      swellGain.gain.linearRampToValueAtTime(0.12, now + 2.5);
      swellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);

      swellOsc.connect(swellFilter);
      swellFilter.connect(swellGain);
      swellGain.connect(this.ctx.destination);
      swellOsc.start(now + 0.4);
      swellOsc.stop(now + 3.6);

      // 4. Steam / Hydraulic Atmosphere Hiss
      const bufferSize = this.ctx.sampleRate * 2.2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const hissSource = this.ctx.createBufferSource();
      hissSource.buffer = noiseBuffer;

      const hissFilter = this.ctx.createBiquadFilter();
      hissFilter.type = 'bandpass';
      hissFilter.frequency.setValueAtTime(700, now);
      hissFilter.frequency.linearRampToValueAtTime(250, now + 2.2);
      hissFilter.Q.setValueAtTime(2.0, now);

      const hissGain = this.ctx.createGain();
      hissGain.gain.setValueAtTime(0.08, now);
      hissGain.gain.linearRampToValueAtTime(0.04, now + 1.2);
      hissGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      hissSource.connect(hissFilter);
      hissFilter.connect(hissGain);
      hissGain.connect(this.ctx.destination);
      hissSource.start(now);

      // 5. Celestial Aura Chime at full opening (around 2.8s)
      setTimeout(() => {
        try {
          const chime = this.ctx.createOscillator();
          const chimeGain = this.ctx.createGain();
          chime.type = 'sine';
          chime.frequency.setValueAtTime(880, this.ctx.currentTime);
          chimeGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
          chime.connect(chimeGain);
          chimeGain.connect(this.ctx.destination);
          chime.start();
          chime.stop(this.ctx.currentTime + 1.2);
        } catch (e) {}
      }, 2600);

    } catch (e) {
      console.warn('Audio gate error:', e);
    }
  }

  playSuccess() {
    if (this.isMuted || !this.ctx || this.ctx.state !== 'running') return;
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.5);
        } catch (e) {}
      }, idx * 80);
    });
  }
}

export const sound = new SoundEngine();
