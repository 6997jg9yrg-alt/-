import { useRef } from 'react'
import Carousel from './Carousel'
import { doctors, photoUrl } from '../content'
import { useT } from '../i18n'
import { bookWith } from './Sections'

function Silhouette() {
  return (
    <svg viewBox="0 0 200 250" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="sil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3A3A3A" />
          <stop offset="1" stopColor="#151515" />
        </linearGradient>
      </defs>
      <rect width="200" height="250" fill="#1D1D1D" />
      <circle cx="100" cy="95" r="42" fill="url(#sil)" />
      <path d="M22 250c4-56 38-88 78-88s74 32 78 88z" fill="url(#sil)" />
      <path d="M80 168l20 26 20-26" fill="none" stroke="#F5D43B" strokeWidth="3" />
    </svg>
  )
}

function DoctorCard({ d, i }: { d: (typeof doctors)[number]; i: number }) {
  const t = useT()
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
    <div className="float px-2 md:px-3" style={{ animationDelay: `${(i % 5) * -1.2}s`, perspective: 900 }}>
      <div
        ref={card}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="group relative w-64 md:w-72 rounded-3xl overflow-hidden bg-ink border border-white/10 shadow-2xl transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          {src ? (
            <img src={src} alt={d.name || t(d.role)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none" loading="lazy" draggable={false} />
          ) : (
            <div className="w-full h-full transition-transform duration-700 group-hover:scale-110"><Silhouette /></div>
          )}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(245,212,59,.35), transparent 55%)' }} />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink to-transparent" />
        </div>
        <div className="relative p-5 -mt-14" style={{ transform: 'translateZ(40px)' }}>
          {d.name ? (
            <>
              <p className="kicker text-mint">{t(d.role)}</p>
              <h3 className="text-cream text-xl font-bold mt-1">{d.name}</h3>
            </>
          ) : (
            <h3 className="text-cream text-xl font-bold">{t(d.role)}</h3>
          )}
          {d.exp && <p className="text-muted text-sm mt-1">{t(d.exp)}</p>}
          {d.book && d.name && (
            <button
              type="button"
              onClick={() => bookWith({ doctor: d.name })}
              className="mt-4 w-full bg-mint text-ink font-bold text-sm py-3 rounded-full hover:bg-white transition-colors"
            >
              {t('Записаться к врачу')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Doctors() {
  const t = useT()
  return (
    <Carousel label={t('Команда клиники — листайте')} theme="dark">
      {doctors.map((d, i) => <DoctorCard key={i} d={d} i={i} />)}
    </Carousel>
  )
}
