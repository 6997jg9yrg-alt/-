import { useEffect, useRef, useState } from 'react'

/**
 * Прогресс прокрутки "закреплённой" секции: 0 — секция только доехала до верха экрана,
 * 1 — её закреплённая часть прокручена до конца.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const live = useRef(0)
  const [p, setP] = useState(0)
  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const span = r.height - window.innerHeight
      const v = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0
      live.current = v
      setP(v)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read) }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return [ref, p, live] as const
}

/** отрезок прогресса a..b → 0..1 */
export const seg = (p: number, a: number, b: number) => Math.min(1, Math.max(0, (p - a) / (b - a)))
/** плавность */
export const ease = (x: number) => 1 - Math.pow(1 - x, 3)
