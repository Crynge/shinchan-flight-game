type AudioCue = "launch" | "boost" | "warning" | "splash";

export class AudioSystem {
  private context: AudioContext | null = null;

  unlock(): void {
    if (typeof window === "undefined") {
      return;
    }

    if (!this.context) {
      const AudioContextClass = window.AudioContext ?? (window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }).webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      this.context = new AudioContextClass();
    }

    void this.context.resume();
  }

  playCue(cue: AudioCue): void {
    if (!this.context) {
      this.unlock();
    }

    if (!this.context) {
      return;
    }

    const ctx = this.context;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const noise = ctx.createOscillator();
    const noiseGain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    const now = ctx.currentTime;
    const [startFrequency, endFrequency, duration, volume] = {
      launch: [220, 520, 0.18, 0.09],
      boost: [540, 760, 0.14, 0.06],
      warning: [160, 140, 0.22, 0.05],
      splash: [240, 70, 0.32, 0.07],
    }[cue];

    oscillator.type = cue === "warning" ? "square" : "triangle";
    oscillator.frequency.setValueAtTime(startFrequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noise.type = "sawtooth";
    noise.frequency.setValueAtTime(cue === "splash" ? 48 : 90, now);
    noiseGain.gain.setValueAtTime(0.0001, now);
    noiseGain.gain.exponentialRampToValueAtTime(cue === "splash" ? 0.03 : 0.012, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.start(now);
    noise.start(now);
    oscillator.stop(now + duration + 0.03);
    noise.stop(now + duration + 0.03);
  }
}
