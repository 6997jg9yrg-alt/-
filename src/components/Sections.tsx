import { useEffect, useState } from 'react'
import * as C from '../content'
import { LangSwitch, useLang, useT } from '../i18n'
import { useCountUp, useInView } from './hooks'
import Carousel from './Carousel'

const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
)
const Star = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
)
const PhoneIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>
)
export const ToothIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M9 3c-2.2 0-4 1.8-4 4.2 0 2.5 1 4.3 1.6 6.5.5 2 .8 4.2 1.4 6 .3.9 1.5.9 1.8 0 .5-1.6.8-3.7 1.6-4.9.4-.6 1.2-.6 1.6 0 .8 1.2 1.1 3.3 1.6 4.9.3.9 1.5.9 1.8 0 .6-1.8.9-4 1.4-6 .6-2.2 1.6-4 1.6-6.5C19 4.8 17.2 3 15 3c-1.3 0-2 .7-3 .7S10.3 3 9 3z" /></svg>
)

/** запись к врачу / на услугу: заполняет форму и прокручивает к ней */
export function bookWith(detail: { service?: string; doctor?: string }) {
  window.dispatchEvent(new CustomEvent('booking-preset', { detail }))
  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
}

/* ---------------- Навигация ---------------- */
const NAV = [
  ['#about', 'О клинике'], ['#doctors', 'Врачи'], ['#services', 'Услуги'], ['#reviews', 'Отзывы'], ['#prices', 'Цены'], ['#contacts', 'Контакты'],
]
export function Navbar() {
  const t = useT()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 40)
    f(); window.addEventListener('scroll', f, { passive: true })
    return () => window.removeEventListener('scroll', f)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])
  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled || open ? 'bg-ink/90 backdrop-blur-md border-b border-white/5' : ''}`}>
        <div className="max-w-[1240px] mx-auto px-4 sm:px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-2 sm:gap-4">
          <a href="#top" className="flex items-center gap-2 sm:gap-2.5 text-cream shrink-0">
            <ToothIcon className="w-7 h-7 sm:w-8 sm:h-8 text-mint" />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight">Aktobe Dent</span>
          </a>
          <nav className="hidden xl:flex gap-5 text-[13px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap" aria-label={t('Основное меню')}>
            {NAV.map(([h, label]) => <a key={h} href={h} className="text-sage hover:text-white transition-colors">{t(label)}</a>)}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
            <LangSwitch />
            <a href={C.clinic.phoneHref} className="hidden md:inline text-cream font-bold whitespace-nowrap">{C.clinic.phone}</a>
            <a href="#booking" className="hidden md:inline bg-mint text-ink font-bold text-sm px-5 py-3 rounded-full hover:bg-white transition-colors">{t('Записаться')}</a>
            <button type="button" aria-label={t('Меню')} aria-expanded={open} onClick={() => setOpen(!open)} className="xl:hidden shrink-0 w-11 h-11 flex flex-col items-center justify-center gap-1.5">
              <span className={`block w-6 h-[2px] bg-cream transition-transform duration-500 ${open ? 'rotate-45 translate-y-[4px]' : ''}`} />
              <span className={`block w-6 h-[2px] bg-cream transition-transform duration-500 ${open ? '-rotate-45 -translate-y-[4px]' : ''}`} />
            </button>
          </div>
        </div>
      </header>
      <div className={`fixed inset-0 z-40 bg-ink flex flex-col items-center justify-center gap-6 transition-all duration-700 xl:hidden ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {NAV.map(([h, label], i) => (
          <a key={h} href={h} onClick={() => setOpen(false)}
            className={`font-display uppercase text-cream text-4xl transition-all duration-500 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: open ? `${120 + i * 70}ms` : '0ms' }}>{t(label)}</a>
        ))}
        <a href={C.clinic.phoneHref} className="mt-4 text-mint font-bold text-lg">{C.clinic.phone}</a>
      </div>
    </>
  )
}

/* ---------------- Главный экран: статистика и срочная кнопка ---------------- */
function Stat({ s, run }: { s: (typeof C.stats)[number]; run: boolean }) {
  const t = useT()
  const n = useCountUp(s.value, run)
  return (
    <div>
      <strong className="block font-display font-medium text-2xl sm:text-3xl md:text-4xl text-cream">
        {n.toLocaleString('ru-RU', { minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals })}{s.suffix}
      </strong>
      <span className="block text-sage text-xs sm:text-sm leading-tight">{t(s.label)}</span>
    </div>
  )
}
export function HeroStats() {
  const [ref, seen] = useInView<HTMLDivElement>(0.2)
  return (
    <div ref={ref} className="grid grid-cols-3 gap-3 max-w-[360px] sm:flex sm:max-w-none sm:gap-8 md:gap-12 pt-1 md:pt-2">
      {C.stats.map((s) => <Stat key={s.label} s={s} run={seen} />)}
    </div>
  )
}

/** «Болит зуб прямо сейчас» — сразу звонок */
export function UrgentCall() {
  const t = useT()
  return (
    <a href={C.clinic.phoneHref} className="group inline-flex items-center gap-4 self-start rounded-2xl border border-[#F14635]/50 bg-[#F14635]/10 pl-3 pr-5 py-3 hover:bg-[#F14635] transition-colors pointer-events-auto">
      <span className="relative flex w-11 h-11 items-center justify-center rounded-full bg-[#F14635] text-white">
        <span className="absolute inset-0 rounded-full bg-[#F14635] animate-ping opacity-40" aria-hidden="true" />
        <PhoneIcon className="relative w-5 h-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-extrabold text-cream">{t('Болит зуб? Позвоните сейчас')}</span>
        <span className="text-sm text-sage group-hover:text-white">{C.clinic.phone} · {t('Примем как можно скорее')}</span>
      </span>
    </a>
  )
}

export function Marquee() {
  const t = useT()
  const row = C.marquee.map((m) => `${t(m)}  ✦  `).join('')
  return (
    <div className="bg-mint text-ink overflow-hidden py-4 md:py-5" aria-hidden="true">
      <div className="marquee font-display font-medium uppercase text-2xl md:text-3xl whitespace-nowrap">
        <span className="pr-6">{row}</span><span className="pr-6">{row}</span>
      </div>
    </div>
  )
}

/* ---------------- Акция с видео ---------------- */
export function Promo() {
  const t = useT()
  const base = import.meta.env.BASE_URL
  const wa = `https://wa.me/${C.clinic.whatsapp}?text=${encodeURIComponent(t('Здравствуйте! Хочу записаться по акции «чистка в подарок».'))}`
  return (
    <section id="promo" className="bg-ink text-cream">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-20 md:py-28 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="reveal relative order-2 lg:order-1">
          <div className="absolute -inset-6 rounded-[3rem] bg-[#F14635]/25 blur-3xl" aria-hidden="true" />
          <div className="relative rounded-[2rem] overflow-hidden aspect-[720/632] ring-1 ring-white/10">
            <video src={base + C.promo.video} poster={base + C.promo.poster} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" aria-label={t('Видео: установка виниров')} />
            <span className="absolute top-4 left-4 bg-[#F14635] text-white text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full animate-pulse">{t('Акция')}</span>
          </div>
        </div>
        <div className="reveal order-1 lg:order-2 flex flex-col gap-6">
          <p className="kicker text-[#FF7A6B]">{t(C.promo.kicker)}</p>
          <h2 className="font-display font-medium uppercase leading-[1] text-4xl md:text-6xl">{t(C.promo.title)}</h2>
          <p className="text-xl md:text-2xl text-cream font-semibold">{t(C.promo.text)}</p>
          <p className="text-sage text-lg">{t(C.promo.note)}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#booking" onClick={(e) => { e.preventDefault(); bookWith({ service: C.promo.service }) }} className="bg-[#F14635] text-white font-extrabold text-lg px-8 py-4 rounded-full inline-flex items-center gap-2.5 hover:bg-[#d93a2a] transition-colors">{t(C.promo.cta)} <Arrow /></a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="border-[1.5px] border-cream/50 font-bold text-lg px-8 py-4 rounded-full hover:bg-cream hover:text-ink transition-colors">{t('Написать в WhatsApp')}</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Владелец ---------------- */
export function Owner() {
  const t = useT()
  const src = C.photoUrl(C.owner.photo)
  return (
    <section id="about" className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32 grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
      <div className="reveal relative">
        <div className="absolute -inset-4 rounded-[2.5rem] bg-mint/30 blur-2xl" aria-hidden="true" />
        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-ink">
          {src && <img src={src} alt={C.owner.name} className="w-full h-full object-cover" />}
        </div>
        <div className="absolute -bottom-6 -right-2 md:-right-6 bg-ink text-cream rounded-2xl px-6 py-4 shadow-xl">
          <p className="font-display text-3xl text-mint">5,0 ★</p>
          <p className="text-sage text-sm">{t('рейтинг в 2ГИС')}</p>
        </div>
      </div>
      <div className="reveal flex flex-col gap-6">
        <p className="kicker text-teal">{t('Кто стоит за клиникой')}</p>
        <h2 className="h2">{C.owner.name}</h2>
        <p className="text-lg text-teal font-bold">{t(C.owner.role)}</p>
        {C.owner.quote ? (
          <blockquote className="font-display text-2xl md:text-3xl leading-snug text-text">«{C.owner.quote}»</blockquote>
        ) : (
          <p className="text-lg leading-relaxed text-sub max-w-xl">{t('Руслан Райханетдинович — основатель Aktobe Dent и врач стоматолог-ортопед. Пациенты клиники ставят ей 5,0 в 2ГИС: более 1 400 оценок и 1 296 отзывов.')}</p>
        )}
        <div className="flex flex-wrap gap-3">
          {C.owner.facts.map((f) => <span key={f} className="px-4 py-2 rounded-full border border-line bg-white text-sm font-semibold">{t(f)}</span>)}
        </div>
        <button type="button" onClick={() => bookWith({ doctor: C.owner.name })} className="self-start mt-2 bg-ink text-mint font-bold px-6 py-3.5 rounded-full hover:bg-black transition-colors inline-flex items-center gap-2">{t('Записаться к врачу')} <Arrow /></button>
      </div>
    </section>
  )
}

/* ---------------- Клиника в цифрах ---------------- */
export function History() {
  const t = useT()
  const items = C.history.filter((h) => !C.isPlaceholder(h.year + h.title + h.text))
  return (
    <section className="bg-white border-y border-line">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-16">
          <div className="reveal">
            <p className="kicker text-teal mb-3">{t('О клинике')}</p>
            <h2 className="h2">{t('Клиника в цифрах')}</h2>
          </div>
          <div className="reveal rounded-[2rem] overflow-hidden aspect-[16/10]">
            <img src={C.photoUrl(C.clinicPhoto)} alt={t('Врач Aktobe Dent на приёме')} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
          </div>
        </div>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
          {items.map((h, i) => (
            <li key={i} className="reveal border-t-2 border-ink pt-5" style={{ transitionDelay: `${i * 100}ms` }}>
              <p className="font-display text-5xl text-ink leading-none">{h.year}</p>
              <h3 className="font-bold text-lg mt-4">{t(h.title)}</h3>
              <p className="text-sub text-[15px] leading-relaxed mt-1">{t(h.text)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Услуги ---------------- */
export function Services() {
  const t = useT()
  return (
    <section id="services" className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32">
      <div className="reveal mb-12"><p className="kicker text-teal mb-3">{t('Что мы делаем')}</p><h2 className="h2">{t('Услуги')}</h2></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {C.services.map((s, i) => (
          <div key={s.title} className="reveal group relative overflow-hidden rounded-3xl border border-line bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-ink" style={{ transitionDelay: `${(i % 4) * 80}ms` }}>
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-mint/0 group-hover:bg-mint/60 transition-colors duration-500" aria-hidden="true" />
            <p className="relative font-display text-teal tracking-widest">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="relative mt-6 text-xl font-bold">{t(s.title)}</h3>
            <p className="relative mt-2 text-sub text-[15px] leading-relaxed">{t(s.text)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Достижения (показываются, когда будут реальные данные) ---------------- */
export function Achievements() {
  const t = useT()
  const items = C.achievements.filter((a) => !C.isPlaceholder(a.value + a.title + a.text))
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map((a, i) => (
        <div key={i} className="reveal rounded-3xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors" style={{ transitionDelay: `${i * 100}ms` }}>
          <p className="font-display text-4xl text-mint">{a.value}</p>
          <h3 className="mt-3 font-bold text-cream">{t(a.title)}</h3>
          <p className="mt-1 text-sage text-sm leading-relaxed">{t(a.text)}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Отзывы ---------------- */
export function Reviews() {
  const t = useT()
  return (
    <section id="reviews" className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 flex flex-wrap items-end justify-between gap-8 mb-12">
        <div className="reveal"><p className="kicker text-teal mb-3">{t('Отзывы')}</p><h2 className="h2">{t('Что говорят пациенты')}</h2></div>
        <div className="reveal flex items-center gap-5">
          <span className="font-display text-7xl leading-none text-ink">5,0</span>
          <div>
            <div className="flex text-[#E0B500] gap-0.5" role="img" aria-label={t('5 из 5 звёзд')}>{[0, 1, 2, 3, 4].map((i) => <Star key={i} />)}</div>
            <p className="text-sub text-sm mt-1">{t('1 400+ оценок · 1 296 отзывов в 2ГИС')}</p>
          </div>
        </div>
      </div>
      <Carousel
        label={t('Отзывы пациентов — листайте')}
        theme="light"
        footer={<a href={C.clinic.gis} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold border-2 border-text rounded-full px-6 py-3 hover:bg-text hover:text-white transition-colors">{t('Все отзывы в 2ГИС')} <Arrow /></a>}
      >
        {C.reviews.map((r, i) => (
          <figure key={i} className="w-[calc(100vw-56px)] max-w-[400px] h-full mx-2 md:mx-3 rounded-3xl bg-white border border-line p-7 flex flex-col gap-4">
            <div className="flex text-[#E0B500] gap-0.5" aria-label={t('5 из 5 звёзд')}>{Array.from({ length: r.rating }, (_, k) => <Star key={k} />)}</div>
            <blockquote className="text-[17px] leading-relaxed">«{r.text}»</blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              <span className="w-10 h-10 shrink-0 rounded-full bg-ink text-mint font-bold flex items-center justify-center">{r.name.charAt(0)}</span>
              <span className="flex flex-col leading-tight"><span className="font-bold">{r.name}</span><span className="text-sm text-sub">{r.date} · 2ГИС</span></span>
            </figcaption>
          </figure>
        ))}
      </Carousel>
    </section>
  )
}

/* ---------------- Цены и вопросы ---------------- */
export function Prices() {
  const t = useT()
  return (
    <section id="prices" className="bg-white border-y border-line">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32 grid lg:grid-cols-2 gap-14">
        <div className="reveal">
          <p className="kicker text-teal mb-3">{t('Стоимость')}</p>
          <h2 className="h2 mb-8">{t('Цены')}</h2>
          <div className="rounded-3xl border border-line overflow-hidden">
            {C.prices.map((p) => (
              <div key={p.name} className="flex justify-between gap-4 px-6 py-5 border-b border-line last:border-0 hover:bg-paper transition-colors">
                <span>{t(p.name)}</span><strong className="whitespace-nowrap">{t(p.price)}</strong>
              </div>
            ))}
          </div>
          <p className="text-sm text-sub mt-4">{t('Цены зависят от ситуации: врач назовёт точную стоимость на бесплатной консультации — до начала лечения.')}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold mr-1">{t('Оплата:')}</span>
            {C.payment.map((p) => <span key={p} className="px-3 py-1.5 rounded-full bg-[#F14635] text-white text-sm font-bold">{t(p)}</span>)}
          </div>
        </div>
        <Faq />
      </div>
    </section>
  )
}
function Faq() {
  const t = useT()
  const [open, setOpen] = useState(0)
  return (
    <div className="reveal">
      <p className="kicker text-teal mb-3">{t('Вопросы')}</p>
      <h2 className="h2 mb-8">{t('Частые вопросы')}</h2>
      {C.faq.map((f, i) => (
        <div key={i} className="border-b border-line">
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex justify-between items-center gap-4 text-left py-5 text-lg font-bold hover:text-teal transition-colors">
            {t(f.q)}
            <span className={`shrink-0 text-2xl transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div className={`grid transition-all duration-500 ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <p className="overflow-hidden text-sub leading-relaxed pr-8">{t(f.a)}<span className="block h-5" /></p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Запись и контакты ---------------- */
const BOOKABLE = C.doctors.filter((d) => d.book && d.name)

export function Booking() {
  const t = useT()
  const { lang } = useLang()
  const [name, setName] = useState('')
  const [service, setService] = useState('')
  const [when, setWhen] = useState('')
  const [doctor, setDoctor] = useState('')
  const [note, setNote] = useState('')
  const [flash, setFlash] = useState(false)
  const pick = (label: string) => {
    setService(label)
    if (C.bookingOptions.find((o) => o.label === label)?.urgent) setWhen('Как можно скорее')
  }
  useEffect(() => {
    const f = (e: Event) => {
      const d = (e as CustomEvent<{ service?: string; doctor?: string }>).detail
      if (d.service) pick(d.service)
      if (d.doctor !== undefined) setDoctor(d.doctor)
      setFlash(true); window.setTimeout(() => setFlash(false), 1600)
    }
    window.addEventListener('booking-preset', f)
    return () => window.removeEventListener('booking-preset', f)
  }, [])

  const opt = C.bookingOptions.find((o) => o.label === service)
  const lines = [`${t('Здравствуйте!')} ${t(opt ? opt.msg : 'Хочу записаться на приём.')}`]
  if (when) lines.push(`${t('Когда удобно:')} ${t(when).toLowerCase()}`)
  if (name.trim()) lines.push(`${t('Имя:')} ${name.trim()}`)
  if (doctor) lines.push(`${t('Врач')}: ${doctor}`)
  if (note.trim()) lines.push(`${t('Комментарий:')} ${note.trim()}`)
  const text = lines.join('\n')
  const wa = `https://wa.me/${C.clinic.whatsapp}?text=${encodeURIComponent(text)}`
  const input = 'w-full text-base px-4 py-3.5 border-[1.5px] border-[#D6D3CA] rounded-xl bg-white focus:outline-none focus:border-ink'
  const chip = (on: boolean) =>
    `flex items-start gap-2 text-left rounded-2xl border-[1.5px] px-3 py-3 text-[15px] font-semibold leading-snug transition-colors ${on ? 'border-ink bg-mint text-ink' : 'border-[#D6D3CA] bg-white hover:border-ink'}`

  return (
    <section id="booking" className="bg-ink text-white">
      <div id="contacts" className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32 grid lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="h2 text-cream">{t('Запишитесь на приём')}</h2>
          <p className="text-sage text-lg leading-relaxed">{t('Выберите, что беспокоит, — откроется WhatsApp с готовым сообщением. Останется нажать «Отправить».')}</p>
          <dl className="grid gap-3 text-cream/90">
            <div><dt className="inline text-muted">{t('Адрес:')} </dt><dd className="inline">{t(C.clinic.address)}</dd></div>
            <div><dt className="inline text-muted">{t('Телефон:')} </dt><dd className="inline"><a href={C.clinic.phoneHref} className="font-bold text-cream">{C.clinic.phone}</a></dd></div>
            {C.clinic.hours && <div><dt className="inline text-muted">{t('Часы работы:')} </dt><dd className="inline">{t(C.clinic.hours)}</dd></div>}
          </dl>
          <div className="flex flex-wrap gap-3">
            <a href={C.clinic.instagram} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full border border-cream/40 font-bold hover:bg-cream hover:text-ink transition-colors">Instagram {C.clinic.instagramName}</a>
            <a href={C.clinic.gis} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full border border-cream/40 font-bold hover:bg-cream hover:text-ink transition-colors">{t('Как добраться — 2ГИС')}</a>
          </div>
          <iframe
            title={t('Карта: Aktobe Dent')}
            src={`https://yandex.kz/map-widget/v1/?text=${encodeURIComponent(C.clinic.mapQuery)}&z=16${lang === 'kz' ? '&lang=kk_KZ' : ''}`}
            className="w-full h-64 rounded-3xl border-0 mt-2"
            loading="lazy"
          />
        </div>
        <form
          className={`bg-white text-text rounded-3xl p-5 sm:p-6 md:p-9 flex flex-col gap-6 self-start transition-shadow duration-500 ${flash ? 'shadow-[0_0_0_6px_#F5D43B]' : ''}`}
          onSubmit={(e) => { e.preventDefault(); window.open(wa, '_blank') }}
        >
          <fieldset className="flex flex-col gap-2.5">
            <legend className="text-lg font-extrabold text-ink mb-2.5">{t('Что вас беспокоит?')}</legend>
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
              {C.bookingOptions.map((o) => (
                <button type="button" key={o.label} aria-pressed={service === o.label} onClick={() => pick(o.label)} className={chip(service === o.label)}>
                  <span aria-hidden="true" className="shrink-0">{o.icon}</span><span className="min-w-0">{t(o.label)}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="flex flex-col gap-2.5">
            <legend className="text-lg font-extrabold text-ink mb-2.5">{t('Когда удобно?')}</legend>
            <div className="flex flex-wrap gap-2">
              {C.bookingTimes.map((w) => (
                <button type="button" key={w} aria-pressed={when === w} onClick={() => setWhen(when === w ? '' : w)}
                  className={`rounded-full border-[1.5px] px-4 py-2.5 text-[15px] font-semibold transition-colors ${when === w ? 'border-ink bg-mint text-ink' : 'border-[#D6D3CA] bg-white hover:border-ink'}`}>
                  {t(w)}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">{t('Ваше имя')}
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder={t('Имя')} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">{t('Врач')}
            <select className={input} value={doctor} onChange={(e) => setDoctor(e.target.value)}>
              <option value="">{t('Любой врач')}</option>
              {BOOKABLE.map((d) => <option key={d.name} value={d.name}>{d.name} — {t(d.role)}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">{t('Комментарий (необязательно)')}
            <textarea className={input} rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder={t('Например: удобно после 18:00')} />
          </label>
          <div className="rounded-2xl bg-[#F4F2EC] p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-muted mb-1.5">{t('Ваше сообщение')}</div>
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink">{text}</p>
          </div>
          <button type="submit" className="bg-ink text-mint font-extrabold text-lg py-4 rounded-full hover:bg-black transition-colors">{t('Отправить в WhatsApp')}</button>
          <a href={C.clinic.phoneHref} className="text-center font-bold text-teal">{t('или позвонить:')} {C.clinic.phone}</a>
        </form>
      </div>
    </section>
  )
}

export function Footer() {
  const t = useT()
  return (
    <footer className="bg-deep text-muted text-sm pb-24 md:pb-0">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-8 flex flex-wrap justify-between gap-3">
        <span>© {new Date().getFullYear()} {C.clinic.name}. {t(C.clinic.license)}.</span>
        <span>{t('Имеются противопоказания, необходима консультация специалиста.')}</span>
      </div>
    </footer>
  )
}

export function MobileBar() {
  const t = useT()
  return (
    <div className="md:hidden fixed left-3 right-3 bottom-3 z-30 flex gap-2.5">
      <a href={C.clinic.phoneHref} className="flex-1 bg-cream text-ink font-extrabold min-h-[52px] rounded-full flex items-center justify-center shadow-xl">{t('Позвонить')}</a>
      <a href={`https://wa.me/${C.clinic.whatsapp}`} className="flex-1 bg-mint text-ink font-extrabold min-h-[52px] rounded-full flex items-center justify-center shadow-xl">WhatsApp</a>
    </div>
  )
}

export { Arrow }
