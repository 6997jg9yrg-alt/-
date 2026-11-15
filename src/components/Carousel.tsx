import { Children, useEffect, useRef, useState, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

const ArrowBtn = ({ dir, onClick, disabled, theme, item }: { dir: 'prev' | 'next'; onClick: () => void; disabled: boolean; theme: Theme; item: string }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={dir === 'prev' ? `Предыдущий ${item}` : `Следующий ${item}`}
    className={`w-12 h-12 md:w-14 md:h-14 rounded-full border flex items-center justify-center transition-colors disabled:opacity-30 disabled:pointer-events-none ${
      theme === 'dark' ? 'border-white/25 text-cream hover:bg-cream hover:text-ink' : 'border-text/25 text-text hover:bg-text hover:text-white'
    }`}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dir === 'prev' ? <path d="M20 12H4M10 6l-6 6 6 6" /> : <path d="M4 12h16M14 6l6 6-6 6" />}
    </svg>
  </button>
)

/** Карусель: свайп пальцем, перетаскивание мышкой, стрелки, клавиши ← →, медленная автопрокрутка с паузой */
export default function Carousel({ children, label, itemLabel, theme, footer }: { children: ReactNode; label: string; itemLabel: string; theme: Theme; footer?: ReactNode }) {
  const track = useRef<HTMLDivElement>(null)
  const pauseUntil = useRef(0)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null)
  const [edge, setEdge] = useState({ start: true, end: false })
  const [dragging, setDragging] = useState(false)

  const pause = (ms = 8000) => { pauseUntil.current = Date.now() + ms }
  const step = () => track.current?.querySelector<HTMLElement>('[data-slide]')?.offsetWidth ?? 300
  const go = (dir: 1 | -1) => { pause(); track.current?.scrollBy({ left: dir * step(), behavior: 'smooth' }) }
  const onScroll = () => {
    const el = track.current
    if (el) setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 })
  }

  useEffect(() => {
    onScroll()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      const el = track.current
      if (!el || Date.now() < pauseUntil.current) return
      const r = el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > window.innerHeight) return // не крутим, пока не видно
      const atEnd = el.scrollLeft + el.clientWidth > el.scrollWidth - 8
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step(), behavior: 'smooth' })
    }, 3500)
    return () => window.clearInterval(id)
  }, [])

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
        onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1) }}
        tabIndex={0}
        aria-label={label}
        className={`flex overflow-x-auto py-6 -my-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab snap-x snap-mandatory'}`}
      >
        {Children.map(children, (child) => (
          <div data-slide className="shrink-0 snap-start first:pl-3 md:first:pl-5 last:pr-3 md:last:pr-5">{child}</div>
        ))}
      </div>
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 mt-8 flex flex-wrap items-center gap-3">
        <ArrowBtn dir="prev" onClick={() => go(-1)} disabled={edge.start} theme={theme} item={itemLabel} />
        <ArrowBtn dir="next" onClick={() => go(1)} disabled={edge.end} theme={theme} item={itemLabel} />
        <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-sage' : 'text-sub'}`}>Листайте или нажимайте стрелки</span>
        {footer && <div className="w-full sm:w-auto sm:ml-auto">{footer}</div>}
      </div>
    </div>
  )
}
