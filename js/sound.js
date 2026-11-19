/**
 * Procedural Lo-Fi Sound Generator using Web Audio API
 * Provides real playable chill background music for the Daily Rotation Spotify widget.
 */
class LofiPlayer {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.volume = 0.6;
    this.masterGain = null;
    this.timer = null;
    this.step = 0;
    this.currentTime = 0;
    this.onProgressUpdate = null;
    this.onStateChange = null;

    // Chord progressions for chill lo-fi (frequency in Hz)
    // Dm9 - G13 - Cmaj9 - Am7
    this.chords = [
      [146.83, 220.00, 261.63, 329.63, 392.00], // Dm9
      [98.00, 196.00, 246.94, 329.63, 440.00],  // G13
      [130.81, 196.00, 246.94, 293.66, 392.00], // Cmaj9
      [110.00, 164.81, 220.00, 261.63, 329.63]  // Am7
    ];

    this.tracks = [
      {
        id: 1,
        title: "New Life",
        artist: "whyu",
        duration: 184, // 3:04
        tempo: 72,
        cover: "assets/images/spotify_album.jpg"
      },
      {
        id: 2,
        title: "Terbuang Dalam Waktu",
        artist: "Barasuara",
        duration: 281, // 4:41
        tempo: 68,
        cover: "assets/images/spotify_album.jpg"
      },
      {
        id: 3,
        title: "Raindance (feat. Tems)",
        artist: "Dave, Tems",
        duration: 219, // 3:39
        tempo: 76,
        cover: "assets/images/spotify_album.jpg"
      },
      {
        id: 4,
        title: "Одного",
        artist: "Татьяна Куртукова",
        duration: 192, // 3:12
        tempo: 70,
        cover: "assets/images/spotify_album.jpg"
      }
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Lowpass filter to give that signature warm muffled lo-fi vinyl tone
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(950, this.ctx.currentTime);

      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTrack(index = 0) {
    this.init();
    if (index !== this.currentTrackIndex) {
      this.currentTime = 0;
      this.step = 0;
    }
    this.currentTrackIndex = index;
    this.isPlaying = true;

    if (this.timer) clearInterval(this.timer);

    const tempo = this.tracks[this.currentTrackIndex].tempo;
    const intervalMs = (60 / tempo) * 1000 / 2; // eighth notes

    // Trigger initial beat
    this.scheduleStep();

    this.timer = setInterval(() => {
      if (!this.isPlaying) return;
      this.scheduleStep();
      this.currentTime += intervalMs / 1000;
      
      const curTrack = this.tracks[this.currentTrackIndex];
      if (this.currentTime >= curTrack.duration) {
        this.nextTrack();
      }

      if (this.onProgressUpdate) {
        this.onProgressUpdate(this.currentTime, curTrack.duration);
      }
    }, intervalMs);

    if (this.onStateChange) this.onStateChange(true, this.currentTrackIndex);
  }

  scheduleStep() {
    const chordIndex = Math.floor(this.step / 8) % this.chords.length;
    const subStep = this.step % 8;

    // Play chord pad on beat 0 and beat 4
    if (subStep === 0 || subStep === 4) {
      this.playLofiChord(this.chords[chordIndex], subStep === 0 ? 1.8 : 1.2);
    }

    // Gentle lo-fi kick on 0, 3, 6
    if (subStep === 0 || subStep === 3) {
      this.playSoftKick();
    }

    // Warm snare / rim tap on 2 and 6
    if (subStep === 2 || subStep === 6) {
      this.playRimTap();
    }

    // Subtle vinyl hi-hat click on odd steps
    if (subStep % 2 === 1) {
      this.playSoftHat();
    }

    this.step++;
  }

  playLofiChord(notes, duration) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Mix between triangle and sine for warm Rhodes-like tone
      osc.type = idx % 2 === 0 ? "triangle" : "sine";
      // Slight pitch detune for tape warble
      const detuneAmount = (Math.random() - 0.5) * 8;
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime(detuneAmount, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.filter);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    });
  }

  playSoftKick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  playRimTap() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Filtered noise for rim/shaker
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 1600;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  playSoftHat() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.03;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 6000;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.025, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    noise.connect(noiseFilter);
    noiseFilter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
  }

  pause() {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.onStateChange) this.onStateChange(false, this.currentTrackIndex);
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.playTrack(this.currentTrackIndex);
    }
  }

  nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % this.tracks.length;
    this.playTrack(nextIdx);
  }

  prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.playTrack(prevIdx);
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex];
  }
}

window.lofiPlayer = new LofiPlayer();
