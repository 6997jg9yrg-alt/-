import { useRef } from 'react'
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
    <div className="float shrink-0 px-3" style={{ animationDelay: `${(i % 5) * -1.2}s`, perspective: 900 }}>
      <div
        ref={card}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative w-64 md:w-72 rounded-3xl overflow-hidden bg-ink border border-white/10 shadow-2xl transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {src ? (
            <img src={src} alt={d.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
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
          <p className="text-muted text-sm mt-1">{d.exp}</p>
        </div>
      </div>
    </div>
  )
}

export default function Doctors() {
  const list = [...doctors, ...doctors] // дубль для бесконечной ленты
  return (
    <div className="overflow-hidden py-6 -my-6">
      <div className="marquee marquee-slow">
        {list.map((d, i) => <DoctorCard key={i} d={d} i={i} />)}
      </div>
    </div>
  )
}
