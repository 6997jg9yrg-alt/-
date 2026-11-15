import { useEffect, useRef, useState } from 'react'
import { doctors, photoUrl } from '../content'

function Silhouette() {
  return (
    <svg viewBox="0 0 200 250" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1B8D79" />
          <stop offset="1" stopColor="#0A3A34" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="#0C2A26" />
      <circle cx="100" cy="95" r="42" fill="url(#sil)" />
      <path d="M22 250c4-56 38-88 78-88s74 32 78 88z" fill="url(#sil)" />
      <path d="M80 168l20 26 20-26" fill="none" stroke="#5EEAC4" strokeWidth="3" />
    </svg>
  )
}

function DoctorCard({ d, i }: { d: (typeof doctors)[number]; i: number }) {
  const card = useRef<HTMLDivElement>(null)
  // 3D-наклон карточки за курсором
  const onMove = (e: React.PointerEvent) => {
    const el = card.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.04)`
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const onLeave = () => { if (card.current) card.current.style.transform = '' }
  const src = photoUrl(d.photo)

  return (
    <div className="float shrink-0 snap-start px-2 md:px-3 first:pl-5 md:first:pl-8 last:pr-5 md:last:pr-8" style={{ animationDelay: `${(i % 5) * -1.2}s`, perspective: 900 }}>
      <div
        ref={card}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative w-64 md:w-72 rounded-3xl overflow-hidden bg-ink border border-white/10 shadow-2xl transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {src ? (
            <img src={src} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" loading="lazy" draggable={false} />
          ) : (
            <div className="w-full h-full transition-transform duration-700 group-hover:scale-110"><Silhouette /></div>
          )}
          {!src && (
            <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-widest bg-black/50 text-sage px-2.5 py-1 rounded-full">Фото врача</span>
          )}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(94,234,196,.35), transparent 55%)' }} />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
        </div>
        <div className="relative p-5 -mt-14" style={{ transform: 'translateZ(40px)' }}>
          <p className="kicker text-mint">{d.role}</p>
          <h3 className="text-cream text-xl font-bold mt-1">{d.name}</h3>
          {d.exp && <p className="text-muted text-sm mt-1">{d.exp}</p>}
        </div>
      </div>
    </div>
  )
}

const ArrowBtn = ({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === 'prev' ? 'Предыдущий врач' : 'Следующий врач'}
    className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/25 text-cream flex items-center justify-center hover:bg-cream hover:text-ink transition-colors disabled:opacity-30 disabled:pointer-events-none"
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'prev' ? <path d="M20 12H4M10 6l-6 6 6 6" /> : <path d="M4 12h16M14 6l6 6-6 6" />}
    </svg>
  </button>
)

export default function Doctors() {
  const track = useRef<HTMLDivElement>(null)
  const pauseUntil = useRef(0)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const [dragging, setDragging] = useState(false)

  const pause = (ms = 8000) => { pauseUntil.current = Date.now() + ms }
  const step = () => {
    const el = track.current
    const card = el?.querySelector<HTMLElement>('.snap-start')
    return card ? card.offsetWidth : 300
  }
  const go = (dir: 1 | -1) => {
    pause()
    track.current?.scrollBy({ left: dir * step(), behavior: 'smooth' })
  }
  const onScroll = () => {
    const el = track.current
    if (!el) return
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 })
  }

  // медленная автопрокрутка: по одной карточке, пока человек сам не листает
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      const el = track.current
      if (!el || Date.now() < pauseUntil.current) return
      const atEnd = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step(), behavior: 'smooth' })
    }, 3500)
    onScroll()
    return () => window.clearInterval(id)
  }, [])

  // перетаскивание мышкой на компьютере (на телефоне — обычный свайп)
  const onPointerDown = (e: React.PointerEvent) => {
    pause()
    if (e.pointerType !== 'mouse' || !track.current) return
    drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d || !track.current) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 5) { d.moved = true; setDragging(true) }
    if (d.moved) track.current.scrollLeft = d.left - dx
  }
  const endDrag = () => {
    if (drag.current?.moved) {
      setDragging(false)
      // доводим до ближайшей карточки
      const el = track.current
      if (el) { const w = step(); el.scrollTo({ left: Math.round(el.scrollLeft / w) * w, behavior: 'smooth' }) }
    }
    drag.current = null
  }

  return (
    <div>
      <div
        ref={track}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onTouchStart={() => pause()}
        onWheel={() => pause()}
        onMouseEnter={() => pause(4000)}
        className={`flex overflow-x-auto py-6 -my-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'}`}
        tabIndex={0}
        aria-label="Команда клиники — листайте"
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
      >
        {doctors.map((d, i) => <DoctorCard key={i} d={d} i={i} />)}
      </div>
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 mt-8 flex items-center gap-3">
        <ArrowBtn dir="prev" onClick={() => go(-1)} disabled={edge.start} />
        <ArrowBtn dir="next" onClick={() => go(1)} disabled={edge.end} />
        <span className="ml-2 text-sage text-sm">Листайте или нажимайте стрелки</span>
      </div>
    </div>
  )
}
