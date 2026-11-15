import { useEffect, useRef, useState } from 'react'
import * as C from '../content'
import Tooth3D from '../components/Tooth3D'
import { ToothIcon } from '../components/Sections'
import { ease, seg, useScrollProgress } from './useScrollProgress'
import MusicButton from './Music'

const base = import.meta.env.BASE_URL

/* ---------------- Шапка ---------------- */
function Header({ dark }: { dark: boolean }) {
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-500 ${dark ? 'text-cream' : 'text-ink'}`}>
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2.5 font-extrabold text-lg md:text-xl tracking-tight">
          <ToothIcon className={`w-7 h-7 ${dark ? 'text-mint' : 'text-teal'}`} />
          Aktobe Dent
        </a>
        <div className="flex items-center gap-2 md:gap-4">
          <a href={`${base}index.html`} className="hidden sm:inline text-sm font-semibold opacity-70 hover:opacity-100">Обычная версия</a>
          <a href="#final" className={`text-sm font-bold px-5 py-2.5 rounded-full transition-colors ${dark ? 'bg-cream text-ink hover:bg-white' : 'bg-ink text-cream hover:bg-black'}`}>Записаться</a>
        </div>
      </div>
    </header>
  )
}

/* ---------------- 1. Раскрытие: щель → видео ---------------- */
function Opening() {
  const [ref, p] = useScrollProgress<HTMLElement>()
  const open = ease(seg(p, 0, 0.6))
  const title = ease(seg(p, 0.5, 0.75))
  const fadeIntro = 1 - seg(p, 0.05, 0.25)
  return (
    <section ref={ref} id="top" className="relative h-[320vh] bg-white">
      <div className="sticky top-0 h-[100svh] overflow-hidden flex items-center justify-center">
        {/* текст до раскрытия */}
        <div className="absolute inset-x-0 top-24 md:top-28 px-5 md:px-8 max-w-[1400px] mx-auto flex justify-between items-start pointer-events-none" style={{ opacity: fadeIntro }}>
          <p className="kicker text-teal">Стоматология в Актобе</p>
          <p className="kicker text-sub text-right">История<br />вашей улыбки</p>
        </div>
        <h1 className="absolute left-5 md:left-8 bottom-24 md:bottom-28 font-display font-medium uppercase text-ink leading-[0.9] text-[15vw] md:text-[11vw] pointer-events-none" style={{ opacity: fadeIntro, transform: `translateY(${(1 - fadeIntro) * 40}px)` }}>
          Aktobe<br />Dent
        </h1>
        <p className="absolute right-5 md:right-8 bottom-7 md:bottom-9 text-sub text-sm flex items-center gap-2" style={{ opacity: fadeIntro }}>
          Листайте вниз
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="animate-bounce"><path d="M12 4v16M6 14l6 6 6-6" /></svg>
        </p>

        {/* окно, которое раскрывается */}
        <div
          className="relative overflow-hidden bg-ink"
          style={{
            width: `calc(${10 + open * 90}vw)`,
            height: `calc(${56 + open * 44}svh)`,
            borderRadius: `${(1 - open) * 18}px`,
          }}
        >
          <video
            src={`${base}${C.promo.video}`}
            poster={`${base}${C.promo.poster}`}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: `scale(${1.9 - open * 0.9})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" style={{ opacity: open }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ opacity: title, transform: `translateY(${(1 - title) * 40}px)` }}>
            <p className="kicker text-mint mb-5">Aktobe Dent · 5,0 в 2ГИС</p>
            <h2 className="font-display font-medium uppercase text-cream leading-[0.95] text-5xl sm:text-6xl md:text-8xl max-w-5xl">
              Улыбка, которой хочется делиться
            </h2>
            <p className="mt-6 text-sage text-lg md:text-xl max-w-xl">Лечение, коронки, виниры, импланты и детская стоматология. Консультация — бесплатно.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 2. 3D-зуб и путь пациента ---------------- */
const STEPS = [
  { n: '01', title: 'Бесплатный осмотр', text: 'Врач осмотрит и выслушает, что беспокоит. Консультация ничего не стоит.' },
  { n: '02', title: 'Снимок на месте', text: 'Прицельный рентген прямо в клинике — никуда не нужно ехать.' },
  { n: '03', title: 'План и цена заранее', text: 'Вы получаете понятный план лечения и полную стоимость до начала работы.' },
  { n: '04', title: 'Лечение без боли', text: 'Под местной анестезией. Можно в рассрочку: Kaspi Red и Kaspi Кредит.' },
]
function Journey() {
  const [ref, p, live] = useScrollProgress<HTMLElement>()
  const idx = Math.min(STEPS.length - 1, Math.floor(p * STEPS.length))
  return (
    <section ref={ref} className="relative h-[460vh] bg-ink text-cream">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Tooth3D progressRef={live} className="absolute inset-0 md:left-[35%] top-[30%] md:top-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(94,234,196,.10),transparent_60%)] pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-5 md:px-8 flex flex-col justify-start md:justify-center pt-24 md:pt-0 pointer-events-none">
          <p className="kicker text-mint mb-6">Ваш путь в клинике</p>
          <div className="relative h-[260px] md:h-[300px] max-w-md">
            {STEPS.map((s, i) => {
              const local = p * STEPS.length - i
              const vis = i === idx ? 1 : 0
              return (
                <div key={s.n} className="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={{ opacity: vis, transform: `translateY(${vis ? 0 : local < 0 ? 40 : -40}px)` }} aria-hidden={!vis}>
                  <p className="font-display text-[110px] md:text-[150px] leading-none text-mint/90">{s.n}</p>
                  <h3 className="font-display uppercase text-3xl md:text-5xl mt-2">{s.title}</h3>
                  <p className="text-sage text-lg mt-4 leading-relaxed">{s.text}</p>
                </div>
              )
            })}
          </div>
          {/* шкала прогресса */}
          <div className="mt-10 flex gap-2 max-w-md">
            {STEPS.map((s, i) => (
              <div key={s.n} className="h-1 flex-1 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full bg-mint" style={{ width: `${seg(p * STEPS.length, i, i + 1) * 100}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 3. До и после: видео кадр за кадром ---------------- */
function Transform() {
  const [ref, p] = useScrollProgress<HTMLElement>()
  const video = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const v = video.current
    if (!v || !ready || !v.duration) return
    const t = Math.min(v.duration - 0.05, p * v.duration)
    if (Math.abs(v.currentTime - t) > 0.02) v.currentTime = t
  }, [p, ready])
  const textIn = ease(seg(p, 0.05, 0.25))
  return (
    <section ref={ref} className="relative h-[380vh] bg-black text-cream">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <video
          ref={video}
          src={`${base}video/promo-scrub.mp4`}
          poster={`${base}${C.promo.poster}`}
          muted playsInline preload="auto"
          onLoadedMetadata={() => setReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
          aria-label="Видео: установка виниров"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-5 md:px-8 flex flex-col justify-end md:justify-center pb-24 md:pb-0" style={{ opacity: textIn, transform: `translateY(${(1 - textIn) * 30}px)` }}>
          <p className="kicker text-mint mb-4">Коронки и виниры</p>
          <h2 className="font-display font-medium uppercase leading-[0.95] text-5xl md:text-7xl max-w-2xl">Новая улыбка — за несколько визитов</h2>
          <p className="text-sage text-lg md:text-xl mt-5 max-w-lg">Исправим форму, цвет и сколы. Вы заранее увидите план и цену.</p>
          <div className="mt-8 flex items-center gap-4 max-w-sm">
            <span className="kicker text-sage">Было</span>
            <div className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden"><div className="h-full bg-mint" style={{ width: `${p * 100}%` }} /></div>
            <span className="kicker text-mint">Стало</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- 4. Доверие: 5,0 и отзывы с фото врачей ---------------- */
const DOC_PHOTO: [RegExp, string][] = [
  [/Еркебулан/i, 'erkebulan.jpg'],
  [/Урадыев/i, 'saltanat.jpg'],
  [/Валиеев|Валеев/i, 'valeev.jpg'],
]
function Trust() {
  const [ref, p] = useScrollProgress<HTMLElement>()
  const scale = 2.6 - ease(seg(p, 0, 0.35)) * 1.6
  const picked = C.reviews.filter((r) => r.text.length < 260).slice(0, 6)
  return (
    <section ref={ref} className="relative bg-white">
      <div className="h-[140vh]">
        <div className="sticky top-0 h-[100svh] flex flex-col items-center justify-center overflow-hidden px-5">
          <p className="kicker text-teal mb-4" style={{ opacity: seg(p, 0.1, 0.3) }}>Нам доверяют</p>
          <div className="font-display font-medium text-ink leading-none text-[34vw] md:text-[20vw] origin-center" style={{ transform: `scale(${scale})` }}>5,0</div>
          <p className="mt-4 text-xl md:text-2xl text-sub text-center" style={{ opacity: seg(p, 0.2, 0.4) }}>1 296 отзывов · более 1 400 оценок в 2ГИС</p>
        </div>
      </div>
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 pb-28 md:pb-40 grid md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
        {picked.map((r, i) => {
          const photo = DOC_PHOTO.find(([re]) => re.test(r.text))?.[1]
          return (
            <figure key={i} className="reveal flex flex-col gap-5" style={{ transitionDelay: `${(i % 3) * 120}ms` }}>
              <div className="flex text-amber-500 gap-0.5" aria-label="5 из 5">{'★★★★★'}</div>
              <blockquote className="text-xl md:text-2xl leading-snug text-ink">«{r.text}»</blockquote>
              <figcaption className="flex items-center gap-3 text-sm text-sub">
                {photo ? (
                  <img src={`${base}photos/${photo}`} alt="" className="w-12 h-12 rounded-full object-cover object-top" loading="lazy" />
                ) : (
                  <span className="w-12 h-12 rounded-full bg-ink text-mint font-bold flex items-center justify-center">{r.name.charAt(0)}</span>
                )}
                <span><b className="text-ink">{r.name}</b><br />{r.date} · 2ГИС</span>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- 5. Команда: горизонтальная прокрутка ---------------- */
function Team() {
  const [ref, p] = useScrollProgress<HTMLElement>()
  const track = useRef<HTMLDivElement>(null)
  const [shift, setShift] = useState(0)
  const people = C.doctors.filter((d) => d.photo)
  useEffect(() => {
    const calc = () => { const el = track.current; if (el) setShift(Math.max(0, el.scrollWidth - window.innerWidth)) }
    calc(); window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return (
    <section ref={ref} className="relative bg-ink text-cream" style={{ height: `calc(100svh + ${shift}px)` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden flex flex-col justify-center pt-14 md:pt-0">
        <div className="max-w-[1400px] w-full mx-auto px-5 md:px-8 mb-8 md:mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="kicker text-mint mb-3">Команда</p>
            <h2 className="font-display font-medium uppercase text-5xl md:text-7xl leading-none">Люди, которые<br />вас лечат</h2>
          </div>
          <p className="hidden md:block font-display text-6xl text-white/20">{String(Math.min(people.length, Math.floor(p * people.length) + 1)).padStart(2, '0')}/{String(people.length).padStart(2, '0')}</p>
        </div>
        <div ref={track} className="flex gap-5 md:gap-8 px-5 md:px-8 w-max will-change-transform" style={{ transform: `translateX(${-p * shift}px)` }}>
          {people.map((d, i) => (
            <figure key={i} className="w-[72vw] sm:w-[340px] md:w-[400px] shrink-0">
              <div className="aspect-[4/5] rounded-[1.75rem] overflow-hidden bg-deep">
                <img src={`${base}photos/${d.photo}`} alt={d.name.startsWith('[') ? d.role : d.name} className="w-full h-full object-cover" style={{ transform: `scale(${1.12 - Math.min(1, Math.abs(p * (people.length - 1) - i)) * 0.12})` }} loading="lazy" />
              </div>
              <figcaption className="mt-4">
                <p className="kicker text-mint">{d.role}</p>
                <p className="text-xl font-bold mt-1">{d.name}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------------- 6. Финал ---------------- */
function Final() {
  const msg = encodeURIComponent('Здравствуйте! Хочу записаться на бесплатную консультацию в Aktobe Dent.')
  return (
    <section id="final" className="relative bg-white min-h-[100svh] flex items-center">
      <div className="max-w-[1400px] w-full mx-auto px-5 md:px-8 py-28 grid lg:grid-cols-[1.3fr_1fr] gap-12 items-end">
        <div className="reveal">
          <span className="inline-block bg-[#F14635] text-white text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">Акция: чистка в подарок при лечении</span>
          <h2 className="font-display font-medium uppercase text-ink leading-[0.92] text-6xl md:text-8xl">Первый шаг —<br />бесплатный осмотр</h2>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={`https://wa.me/${C.clinic.whatsapp}?text=${msg}`} target="_blank" rel="noopener noreferrer" className="bg-teal text-white font-extrabold text-lg px-8 py-4 rounded-full hover:bg-[#0A665C] transition-colors">Записаться в WhatsApp</a>
            <a href={C.clinic.phoneHref} className="border-2 border-ink text-ink font-bold text-lg px-8 py-4 rounded-full hover:bg-ink hover:text-white transition-colors">{C.clinic.phone}</a>
          </div>
        </div>
        <div className="reveal text-sub leading-relaxed space-y-2">
          <p className="text-ink font-bold">Aktobe Dent</p>
          <p>{C.clinic.address}</p>
          <p>Оплата: Kaspi QR, Kaspi Red, Kaspi Кредит</p>
          <p className="flex gap-4 pt-2">
            <a href={C.clinic.instagram} target="_blank" rel="noopener noreferrer" className="font-bold text-teal">Instagram</a>
            <a href={C.clinic.gis} target="_blank" rel="noopener noreferrer" className="font-bold text-teal">2ГИС</a>
            <a href={`${base}index.html`} className="font-bold text-teal">Обычная версия сайта</a>
          </p>
          <p className="text-xs pt-6">{C.clinic.license}. Имеются противопоказания, необходима консультация специалиста.</p>
        </div>
      </div>
    </section>
  )
}

export default function Story() {
  const [dark, setDark] = useState(false)
  // цвет шапки под цвет секции под ней
  useEffect(() => {
    const f = () => {
      const el = [...document.querySelectorAll('section')].find((s) => { const r = s.getBoundingClientRect(); return r.top <= 40 && r.bottom > 40 })
      setDark(!!el && (el.classList.contains('bg-ink') || el.classList.contains('bg-black') || (el.id === 'top' && window.scrollY > window.innerHeight * 1.2)))
    }
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  // плавное появление .reveal
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: 0.15 })
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
  return (
    <main className="bg-white">
      <Header dark={dark} />
      <Opening />
      <Journey />
      <Transform />
      <Trust />
      <Team />
      <Final />
      <MusicButton />
    </main>
  )
}
