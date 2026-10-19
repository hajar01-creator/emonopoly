// Web Audio API sound synthesis for Emotionopoly

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playDiceRollSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Multiple random clicks imitating wooden/plastic dice rolling
  for (let i = 0; i < 6; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200 + Math.random() * 250, now + i * 0.05);
    osc.frequency.exponentialRampToValueAtTime(100, now + i * 0.05 + 0.04);

    gain.gain.setValueAtTime(0.2, now + i * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * 0.05);
    osc.stop(now + i * 0.05 + 0.04);
  }
}

export function playStepSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.07);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.07);
}

export function playStarSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0.2, now + idx * 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.3);
  });
}

export function playCalmBellSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(392, now); // G4 gentle singing bowl

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 1.2);
}

export function playFanfareSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51];
  const now = ctx.currentTime;

  chords.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + idx * 0.1);

    gain.gain.setValueAtTime(0.25, now + idx * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.1);
    osc.stop(now + idx * 0.1 + 0.6);
  });
}

export function speakText(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  // Try finding a Malay or Indonesian voice if available
  const voices = window.speechSynthesis.getVoices();
  const malayVoice = voices.find(
    (v) => v.lang.startsWith('ms') || v.lang.startsWith('id') || v.name.toLowerCase().includes('malay')
  );
  if (malayVoice) {
    utterance.voice = malayVoice;
  }
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}
