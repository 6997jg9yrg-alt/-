import { useEffect, useRef, useState } from 'react'
import { chart } from '../content'
import { useInView } from './hooks'

const W = 64 // ширина и глубина столбика, px
const MAXH = 260 // высота самого большого столбика, px
const GAP = 44

function Bar({ x, h, label, value, delay, grow, hi }: { x: number; h: number; label: string; value: number; delay: number; grow: boolean; hi: boolean }) {
  const height = grow ? h : 2
  const front = hi ? '#F5D43B' : '#C9A814'
  const side = hi ? '#D9B81F' : '#9E8410'
  const top = hi ? '#FFE97A' : '#F5D43B'
  const face = { width: W, height, top: 0 } as const
  return (
    <div className="bar3d" style={{ left: x, width: W, height, transitionDelay: `${delay}ms` }}>
      <div style={{ ...face, background: front, transform: `translateZ(${W / 2}px)` }} />
      <div style={{ ...face, background: side, transform: `rotateY(180deg) translateZ(${W / 2}px)` }} />
      <div style={{ ...face, background: side, transform: `rotateY(90deg) translateZ(${W / 2}px)`, filter: 'brightness(.8)' }} />
      <div style={{ ...face, background: side, transform: `rotateY(-90deg) translateZ(${W / 2}px)`, filter: 'brightness(.8)' }} />
      <div style={{ width: W, height: W, top: -W / 2, background: top, transform: 'rotateX(90deg)' }} />
      <div
        className="font-display text-cream text-xl whitespace-nowrap text-center"
        style={{ width: W, top: -W / 2 - 34, transform: `translateZ(${W / 2}px)`, opacity: grow ? 1 : 0, transition: `opacity .6s ${delay + 900}ms` }}
      >
        {value.toLocaleString('ru-RU')}
      </div>
      <div className="text-sage text-sm font-bold text-center" style={{ width: W, bottom: -34, transform: `translateZ(${W / 2}px)` }}>
        {label}
      </div>
    </div>
  )
}

export default function Chart3D() {
  const [ref, seen] = useInView<HTMLDivElement>(0.35)
  const [rot, setRot] = useState({ x: -18, y: -28 })
  const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null)
  const auto = useRef(true)

  // лёгкое покачивание, пока пользователь не трогает
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const t0 = performance.now()
    const loop = (t: number) => {
      if (auto.current) setRot({ x: -18, y: -28 + Math.sin((t - t0) / 2200) * 14 })
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const max = Math.max(...chart.bars.map((b) => b.value))
  const total = chart.bars.length * W + (chart.bars.length - 1) * GAP

  return (
    <div
      ref={ref}
      className="relative select-none cursor-grab active:cursor-grabbing"
      style={{ perspective: 1100, height: 440, touchAction: 'pan-y' }}
      onPointerDown={(e) => { auto.current = false; drag.current = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y } }}
      onPointerMove={(e) => {
        if (!drag.current) return
        const d = drag.current
        setRot({ x: Math.max(-60, Math.min(5, d.rx - (e.clientY - d.y) * 0.3)), y: d.ry + (e.clientX - d.x) * 0.4 })
      }}
      onPointerUp={() => { drag.current = null }}
      onPointerLeave={() => { drag.current = null }}
      role="img"
      aria-label={`${chart.title}: ${chart.bars.map((b) => `${b.label} — ${b.value}`).join(', ')}`}
    >
      <div
        className="absolute left-1/2 top-[62%]"
        style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)` }}
      >
        <div style={{ position: 'absolute', transformStyle: 'preserve-3d', left: -total / 2, top: 0 }}>
          {/* пол с сеткой */}
          <div
            style={{
              position: 'absolute', left: -60, top: -(W + 120) / 2, width: total + 120, height: W + 120,
              transform: 'rotateX(90deg)',
              background: 'repeating-linear-gradient(90deg, rgba(245,212,59,.18) 0 1px, transparent 1px 36px), repeating-linear-gradient(0deg, rgba(245,212,59,.18) 0 1px, transparent 1px 36px), rgba(245,212,59,.05)',
              borderRadius: 12,
            }}
          />
          {chart.bars.map((b, i) => (
            <Bar
              key={b.label}
              x={i * (W + GAP)}
              h={(b.value / max) * MAXH}
              label={b.label}
              value={b.value}
              delay={i * 160}
              grow={seen}
              hi={i === chart.bars.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
