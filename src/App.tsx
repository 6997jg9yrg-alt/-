import { useEffect, useState } from 'react'
import { Flower2 } from 'lucide-react'
import { content } from './content'

const ENTER = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
const OVERLAY = 'ease-[cubic-bezier(0.76,0,0.24,1)]'

function Navbar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const enter = (delay: number) => ({
    className: `transition-all duration-700 ${ENTER} ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`,
    style: { transitionDelay: mounted ? `${delay}ms` : '0ms' },
  })

  const logo = enter(0)
  const toggle = enter(200)
  const flower = enter(400)

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">
        <a
          href="#"
          className={`text-white text-xl md:text-2xl font-semibold tracking-tight z-50 ${logo.className}`}
          style={logo.style}
        >
          {content.brand}
        </a>

        <button
          type="button"
          onClick={onToggle}
          className={`hidden md:flex items-center gap-2 px-5 py-2 rounded-full border border-white/20 text-white/90 text-sm hover:bg-white/10 ${toggle.className}`}
          style={toggle.style}
        >
          {open ? content.navClose : content.navOpen}
        </button>

        <div className={`hidden md:flex ${flower.className}`} style={flower.style}>
          <Flower2 className="w-7 h-7 text-white/90" />
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={onToggle}
          className={`md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 ${toggle.className}`}
          style={toggle.style}
        >
          <span
            className={`block w-6 h-[2px] bg-white transition-transform duration-500 ${OVERLAY} ${
              open ? 'rotate-45 translate-y-[4px]' : ''
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-white transition-transform duration-500 ${OVERLAY} ${
              open ? '-rotate-45 -translate-y-[4px]' : ''
            }`}
          />
        </button>
      </div>
    </nav>
  )
}

function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-40 bg-black flex flex-col items-center justify-center transition-all duration-700 ${OVERLAY} ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div className="flex flex-col items-center gap-8">
        {content.links.map((label, i) => (
          <a
            key={label}
            href="#"
            onClick={onClose}
            className={`text-white font-instrument text-4xl md:text-6xl hover:opacity-60 transition-all duration-[600ms] ${OVERLAY} ${
              open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: open ? `${150 + i * 80}ms` : '0ms' }}
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  )
}

function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 300)
    return () => clearTimeout(t)
  }, [])

  const rise = (delay: number) => ({
    className: `transition-all duration-900 ${ENTER} ${
      mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`,
    style: { transitionDelay: mounted ? `${delay}ms` : '0ms' },
  })

  const h1 = rise(400)
  const sub = rise(600)
  const cta = rise(800)

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-end justify-center">
      <div
        className={`absolute inset-0 transition-all duration-[1400ms] ${ENTER} ${
          mounted ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
        }`}
      >
        <video
          src={content.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 text-center px-6 pb-16 md:pb-24 max-w-4xl mx-auto">
        <h1
          className={`font-instrument text-white text-[2.5rem] leading-[0.95] sm:text-5xl md:text-6xl lg:text-7xl mb-5 md:mb-6 ${h1.className}`}
          style={h1.style}
        >
          {content.titleLine1}
          <br className="hidden sm:block" /> {content.titleLine2}
        </h1>
        <p
          className={`text-white/70 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto ${sub.className}`}
          style={sub.style}
        >
          {content.subtitle}
        </p>
        <a
          href={content.ctaHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-block px-8 py-3.5 bg-white text-black text-sm md:text-base font-medium rounded-full hover:bg-white/90 ${cta.className}`}
          style={cta.style}
        >
          {content.cta}
        </a>
      </div>
    </section>
  )
}

export default function App() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="bg-black">
      <Navbar open={open} onToggle={() => setOpen((o) => !o)} />
      <MenuOverlay open={open} onClose={() => setOpen(false)} />
      <Hero />
    </div>
  )
}
