import { useEffect, useRef, useState } from 'react'

/*
 * Своя музыка, которая синтезируется прямо в браузере (Web Audio API).
 * Никаких аудиофайлов и чужих треков — значит, нет проблем с авторскими правами.
 * Темп 112 BPM, ля-минор, аккорды Am – F – C – G.
 * Чем ниже прокручена страница, тем "открытее" звучит музыка (фильтр + громкость хай-хэтов).
 */

const BPM = 112
const STEP = 60 / BPM / 4 // длительность 1/16
const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12)
// аккорды по тактам: [бас, ноты аккорда]
const CHORDS: [number, number[]][] = [
  [45, [57, 60, 64]], // Am
  [41, [57, 60, 65]], // F
  [48, [55, 60, 64]], // C
  [43, [55, 59, 62]], // G
]
const BASS_STEPS = [0, 3, 6, 8, 10, 11, 14]
const ARP = [0, 1, 2, 1] // арпеджио по нотам аккорда

class Engine {
  ctx: AudioContext
  master: GainNode
  filter: BiquadFilterNode
  noise: AudioBuffer
  hatGain: GainNode
  step = 0
  next = 0
  timer = 0

  constructor() {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    this.ctx = new Ctx()
    const comp = this.ctx.createDynamicsCompressor()
    comp.threshold.value = -14
    comp.ratio.value = 4
    this.filter = this.ctx.createBiquadFilter()
    this.filter.type = 'lowpass'
    this.filter.frequency.value = 900
    this.filter.Q.value = 0.7
    this.master = this.ctx.createGain()
    this.master.gain.value = 0
    this.hatGain = this.ctx.createGain()
    this.hatGain.gain.value = 0.3
    this.hatGain.connect(this.filter)
    this.filter.connect(comp).connect(this.master).connect(this.ctx.destination)
    // белый шум для хэтов и хлопков
    this.noise = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate)
    const d = this.noise.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }

  env(g: GainNode, t: number, peak: number, attack: number, decay: number) {
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(peak, t + attack)
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay)
  }

  kick(t: number) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain()
    o.frequency.setValueAtTime(140, t)
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12)
    this.env(g, t, 0.9, 0.002, 0.32)
    o.connect(g).connect(this.filter)
    o.start(t); o.stop(t + 0.4)
  }

  noiseHit(t: number, type: BiquadFilterType, freq: number, peak: number, decay: number, out: AudioNode) {
    const s = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain()
    s.buffer = this.noise
    f.type = type; f.frequency.value = freq
    this.env(g, t, peak, 0.001, decay)
    s.connect(f).connect(g).connect(out)
    s.start(t, Math.random() * 0.5); s.stop(t + decay + 0.05)
  }

  bass(t: number, note: number) {
    const o = this.ctx.createOscillator(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain()
    o.type = 'sawtooth'; o.frequency.value = midi(note)
    f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(180, t + 0.18)
    this.env(g, t, 0.32, 0.005, 0.2)
    o.connect(f).connect(g).connect(this.filter)
    o.start(t); o.stop(t + 0.3)
  }

  pad(t: number, notes: number[], len: number) {
    for (const n of notes) for (const det of [-6, 6]) {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain()
      o.type = 'triangle'; o.frequency.value = midi(n); o.detune.value = det
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.035, t + 0.4)
      g.gain.setValueAtTime(0.035, t + len - 0.3)
      g.gain.exponentialRampToValueAtTime(0.0001, t + len)
      o.connect(g).connect(this.filter)
      o.start(t); o.stop(t + len + 0.05)
    }
  }

  pluck(t: number, note: number) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain()
    o.type = 'square'; o.frequency.value = midi(note + 12)
    this.env(g, t, 0.045, 0.003, 0.16)
    o.connect(g).connect(this.filter)
    o.start(t); o.stop(t + 0.2)
  }

  schedule(t: number, s: number) {
    const bar = Math.floor(s / 16) % CHORDS.length
    const i = s % 16
    const [root, chord] = CHORDS[bar]
    if (i % 4 === 0) this.kick(t)
    if (i === 4 || i === 12) this.noiseHit(t, 'bandpass', 1800, 0.35, 0.16, this.filter) // хлопок
    if (i % 2 === 1) this.noiseHit(t, 'highpass', 8000, 0.25, 0.05, this.hatGain) // хэт
    if (BASS_STEPS.includes(i)) this.bass(t, root)
    if (i === 0) this.pad(t, chord, STEP * 16)
    if (i % 2 === 0 && s >= 32) this.pluck(t, chord[ARP[(i / 2) % 4]]) // арпеджио с 3-го такта
  }

  tick = () => {
    while (this.next < this.ctx.currentTime + 0.12) {
      this.schedule(this.next, this.step)
      this.next += STEP
      this.step++
    }
  }

  start() {
    this.ctx.resume()
    this.next = this.ctx.currentTime + 0.05
    this.timer = window.setInterval(this.tick, 25)
    const g = this.master.gain, t = this.ctx.currentTime
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.75, t + 1.2)
  }

  stop() {
    const g = this.master.gain, t = this.ctx.currentTime
    g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0, t + 0.5)
    window.setTimeout(() => { window.clearInterval(this.timer); this.ctx.suspend() }, 600)
  }

  /** 0..1 — насколько прокручена страница */
  setScroll(p: number) {
    const t = this.ctx.currentTime
    this.filter.frequency.setTargetAtTime(700 + Math.pow(p, 0.8) * 11000, t, 0.25)
    this.hatGain.gain.setTargetAtTime(0.15 + p * 0.6, t, 0.25)
  }
}

export default function MusicButton() {
  const engine = useRef<Engine | null>(null)
  const [on, setOn] = useState(false)
  const [hint, setHint] = useState(true)

  // связь со скроллом
  useEffect(() => {
    const f = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      engine.current?.setScroll(max > 0 ? window.scrollY / max : 0)
    }
    window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])

  // пауза, если вкладку свернули
  useEffect(() => {
    const f = () => { if (document.hidden && on) { engine.current?.stop(); setOn(false) } }
    document.addEventListener('visibilitychange', f)
    return () => document.removeEventListener('visibilitychange', f)
  }, [on])

  useEffect(() => { const t = window.setTimeout(() => setHint(false), 7000); return () => window.clearTimeout(t) }, [])

  const toggle = () => {
    setHint(false)
    try {
      if (!engine.current) engine.current = new Engine()
      const e = engine.current
      if (on) { e.stop(); setOn(false) }
      else {
        const max = document.documentElement.scrollHeight - window.innerHeight
        e.setScroll(max > 0 ? window.scrollY / max : 0)
        e.start(); setOn(true)
      }
    } catch {
      /* браузер без Web Audio — просто ничего не делаем */
    }
  }

  return (
    <div className="fixed left-4 md:left-6 bottom-4 md:bottom-6 z-50 flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? 'Выключить музыку' : 'Включить музыку'}
        className={`h-12 pl-4 pr-5 rounded-full flex items-center gap-3 font-bold text-sm shadow-xl backdrop-blur-md transition-colors ${on ? 'bg-mint text-ink' : 'bg-ink/85 text-cream hover:bg-ink'}`}
      >
        <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="w-[3px] rounded-full bg-current"
              style={{ height: on ? undefined : '4px', animation: on ? `eq 0.${5 + i}s ease-in-out ${i * 0.1}s infinite alternate` : 'none' }}
            />
          ))}
        </span>
        {on ? 'Музыка' : '♪ Музыка'}
      </button>
      {hint && !on && (
        <span className="hidden sm:block text-xs font-semibold bg-white text-ink px-3 py-2 rounded-full shadow-lg animate-pulse">Включите звук — музыка раскрывается при прокрутке</span>
      )}
      <style>{`@keyframes eq { from { height: 4px } to { height: 16px } }`}</style>
    </div>
  )
}
