import { useEffect, useState } from 'react'
import * as C from '../content'
import { useCountUp, useInView } from './hooks'

const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6" /></svg>
)
const Star = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
)
export const ToothIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true"><path d="M9 3c-2.2 0-4 1.8-4 4.2 0 2.5 1 4.3 1.6 6.5.5 2 .8 4.2 1.4 6 .3.9 1.5.9 1.8 0 .5-1.6.8-3.7 1.6-4.9.4-.6 1.2-.6 1.6 0 .8 1.2 1.1 3.3 1.6 4.9.3.9 1.5.9 1.8 0 .6-1.8.9-4 1.4-6 .6-2.2 1.6-4 1.6-6.5C19 4.8 17.2 3 15 3c-1.3 0-2 .7-3 .7S10.3 3 9 3z" /></svg>
)

/* ---------------- Навигация ---------------- */
const NAV = [
  ['#about', 'О клинике'], ['#doctors', 'Врачи'], ['#services', 'Услуги'], ['#reviews', 'Отзывы'], ['#prices', 'Цены'], ['#contacts', 'Контакты'],
]
export function Navbar() {
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
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 h-16 md:h-20 flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-2.5 text-cream">
            <ToothIcon className="w-8 h-8 text-mint" />
            <span className="text-xl font-extrabold tracking-tight">Aktobe Dent</span>
          </a>
          <nav className="hidden lg:flex gap-7 text-[13px] font-semibold uppercase tracking-[0.14em]" aria-label="Основное меню">
            {NAV.map(([h, t]) => <a key={h} href={h} className="text-sage hover:text-white transition-colors">{t}</a>)}
          </nav>
          <div className="hidden md:flex items-center gap-4">
            <a href={C.clinic.phoneHref} className="text-cream font-bold">{C.clinic.phone}</a>
            <a href="#booking" className="bg-cream text-ink font-bold text-sm px-5 py-3 rounded-full hover:bg-white transition-colors">Записаться</a>
          </div>
          <button type="button" aria-label="Меню" aria-expanded={open} onClick={() => setOpen(!open)} className="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5">
            <span className={`block w-6 h-[2px] bg-cream transition-transform duration-500 ${open ? 'rotate-45 translate-y-[4px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-cream transition-transform duration-500 ${open ? '-rotate-45 -translate-y-[4px]' : ''}`} />
          </button>
        </div>
      </header>
      <div className={`fixed inset-0 z-40 bg-ink flex flex-col items-center justify-center gap-6 transition-all duration-700 lg:hidden ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        {NAV.map(([h, t], i) => (
          <a key={h} href={h} onClick={() => setOpen(false)}
            className={`font-display uppercase text-cream text-4xl transition-all duration-500 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: open ? `${120 + i * 70}ms` : '0ms' }}>{t}</a>
        ))}
        <a href={C.clinic.phoneHref} className="mt-4 text-mint font-bold text-lg">{C.clinic.phone}</a>
      </div>
    </>
  )
}

/* ---------------- Статистика в hero ---------------- */
function Stat({ s, run }: { s: (typeof C.stats)[number]; run: boolean }) {
  const n = useCountUp(s.value, run)
  return (
    <div>
      <strong className="block font-display font-medium text-3xl md:text-4xl text-cream">
        {n.toLocaleString('ru-RU', { minimumFractionDigits: s.decimals, maximumFractionDigits: s.decimals })}{s.suffix}
      </strong>
      <span className="text-sage text-sm">{s.label}</span>
    </div>
  )
}
export function HeroStats() {
  const [ref, seen] = useInView<HTMLDivElement>(0.2)
  return (
    <div ref={ref} className="flex flex-wrap gap-8 md:gap-12 pt-2">
      {C.stats.map((s) => <Stat key={s.label} s={s} run={seen} />)}
    </div>
  )
}

export function Marquee() {
  const row = C.marquee.map((m) => `${m}  ✦  `).join('')
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
  const base = import.meta.env.BASE_URL
  const pick = () => window.dispatchEvent(new CustomEvent('set-service', { detail: C.promo.service }))
  return (
    <section id="promo" className="bg-ink text-cream">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-20 md:py-28 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="reveal relative order-2 lg:order-1">
          <div className="absolute -inset-6 rounded-[3rem] bg-[#F14635]/25 blur-3xl" aria-hidden="true" />
          <div className="relative rounded-[2rem] overflow-hidden aspect-[720/632] ring-1 ring-white/10">
            <video src={base + C.promo.video} poster={base + C.promo.poster} autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover" aria-label="Видео: установка виниров" />
            <span className="absolute top-4 left-4 bg-[#F14635] text-white text-xs font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full animate-pulse">Акция</span>
          </div>
        </div>
        <div className="reveal order-1 lg:order-2 flex flex-col gap-6">
          <p className="kicker text-[#FF7A6B]">{C.promo.kicker}</p>
          <h2 className="font-display font-medium uppercase leading-[1] text-4xl md:text-6xl">{C.promo.title}</h2>
          <p className="text-xl md:text-2xl text-cream font-semibold">{C.promo.text}</p>
          <p className="text-sage text-lg">{C.promo.note}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="#booking" onClick={pick} className="bg-[#F14635] text-white font-extrabold text-lg px-8 py-4 rounded-full inline-flex items-center gap-2.5 hover:bg-[#d93a2a] transition-colors">{C.promo.cta} <Arrow /></a>
            <a href={`https://wa.me/${C.clinic.whatsapp}?text=${encodeURIComponent('Здравствуйте! Хочу записаться по акции «чистка в подарок».')}`} target="_blank" rel="noopener noreferrer" className="border-[1.5px] border-cream/50 font-bold text-lg px-8 py-4 rounded-full hover:bg-cream hover:text-ink transition-colors">Написать в WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Владелец ---------------- */
export function Owner() {
  const src = C.photoUrl(C.owner.photo)
  return (
    <section id="about" className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32 grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
      <div className="reveal relative">
        <div className="absolute -inset-4 rounded-[2.5rem] bg-mint/20 blur-2xl" aria-hidden="true" />
        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-ink">
          {src ? <img src={src} alt={C.owner.name} className="w-full h-full object-cover" /> : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-sage border-2 border-dashed border-teal/50 rounded-[2rem]">
              <ToothIcon className="w-16 h-16 text-mint" />
              <span className="font-bold">[ФОТО ВЛАДЕЛЬЦА]</span>
            </div>
          )}
        </div>
        <div className="absolute -bottom-6 -right-2 md:-right-6 bg-cream rounded-2xl px-6 py-4 shadow-xl">
          <p className="font-display text-3xl text-ink">5,0 ★</p>
          <p className="text-sub text-sm">рейтинг в 2ГИС</p>
        </div>
      </div>
      <div className="reveal flex flex-col gap-6">
        <p className="kicker text-teal">Кто стоит за клиникой</p>
        <h2 className="h2">{C.owner.name}</h2>
        <p className="text-lg text-teal font-bold">{C.owner.role}</p>
        <blockquote className="font-display text-2xl md:text-3xl leading-snug text-text border-l-0">
          «{C.owner.quote}»
        </blockquote>
        <div className="flex flex-wrap gap-3">
          {C.owner.facts.map((f) => <span key={f} className="px-4 py-2 rounded-full border border-line bg-white text-sm font-semibold">{f}</span>)}
        </div>
      </div>
    </section>
  )
}

/* ---------------- История ---------------- */
export function History() {
  return (
    <section className="bg-white border-y border-line">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-16">
          <div className="reveal">
            <p className="kicker text-teal mb-3">История</p>
            <h2 className="h2">Как росла клиника</h2>
          </div>
          <div className="reveal rounded-[2rem] overflow-hidden aspect-[16/10]">
            <img src={C.photoUrl(C.clinicPhoto)} alt="Врач Aktobe Dent на приёме" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" loading="lazy" />
          </div>
        </div>
        <ol className="relative grid gap-10 md:grid-cols-5 md:gap-6">
          <div className="hidden md:block absolute left-0 right-0 top-[34px] h-[2px] bg-line" aria-hidden="true" />
          {C.history.map((h, i) => (
            <li key={i} className="reveal relative flex md:flex-col gap-5 md:gap-4" style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="relative z-10 shrink-0 w-[68px] h-[68px] rounded-full bg-ink text-mint font-display text-lg flex items-center justify-center text-center leading-none ring-8 ring-white">
                {h.year.length > 6 ? '★' : h.year}
              </div>
              <div>
                {h.year.length > 6 && <p className="kicker text-teal mb-1">{h.year}</p>}
                <h3 className="font-bold text-lg">{h.title}</h3>
                <p className="text-sub text-[15px] leading-relaxed mt-1">{h.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Услуги ---------------- */
export function Services() {
  return (
    <section id="services" className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32">
      <div className="reveal mb-12"><p className="kicker text-teal mb-3">Что мы делаем</p><h2 className="h2">Услуги</h2></div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {C.services.map((s, i) => (
          <div key={s.title} className="reveal group relative overflow-hidden rounded-3xl border border-line bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-teal/40" style={{ transitionDelay: `${(i % 4) * 80}ms` }}>
            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-mint/0 group-hover:bg-mint/25 transition-colors duration-500" aria-hidden="true" />
            <p className="font-display text-teal tracking-widest">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-6 text-xl font-bold">{s.title}</h3>
            <p className="mt-2 text-sub text-[15px] leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------- Достижения ---------------- */
export function Achievements() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {C.achievements.map((a, i) => (
        <div key={i} className="reveal rounded-3xl bg-white/5 border border-white/10 p-6 hover:bg-white/10 transition-colors" style={{ transitionDelay: `${i * 100}ms` }}>
          <p className="font-display text-4xl text-mint">{a.value}</p>
          <h3 className="mt-3 font-bold text-cream">{a.title}</h3>
          <p className="mt-1 text-sage text-sm leading-relaxed">{a.text}</p>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Отзывы ---------------- */
export function Reviews() {
  const list = [...C.reviews, ...C.reviews]
  return (
    <section id="reviews" className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 flex flex-wrap items-end justify-between gap-8 mb-12">
        <div className="reveal"><p className="kicker text-teal mb-3">Отзывы</p><h2 className="h2">Что говорят пациенты</h2></div>
        <div className="reveal flex items-center gap-5">
          <span className="font-display text-7xl leading-none text-teal">5,0</span>
          <div>
            <div className="flex text-amber-500 gap-0.5" role="img" aria-label="5 из 5 звёзд">{[0, 1, 2, 3, 4].map((i) => <Star key={i} />)}</div>
            <p className="text-sub text-sm mt-1">1 400+ оценок · 1 296 отзывов в 2ГИС</p>
          </div>
        </div>
      </div>
      <div className="marquee marquee-slow">
        {list.map((r, i) => (
          <figure key={i} className="shrink-0 w-[300px] md:w-[400px] mx-3 rounded-3xl bg-white border border-line p-7 flex flex-col gap-4">
            <div className="flex text-amber-500 gap-0.5" aria-label={`${r.rating} из 5`}>{Array.from({ length: r.rating }, (_, k) => <Star key={k} />)}</div>
            <blockquote className="text-[17px] leading-relaxed">«{r.text}»</blockquote>
            <figcaption className="mt-auto flex items-center gap-3">
              <span className="w-10 h-10 shrink-0 rounded-full bg-ink text-mint font-bold flex items-center justify-center">{r.name.charAt(0)}</span>
              <span className="flex flex-col leading-tight"><span className="font-bold">{r.name}</span><span className="text-sm text-sub">{r.date} · 2ГИС</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="text-center mt-12">
        <a href={C.clinic.gis} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-bold border-2 border-text rounded-full px-7 py-3.5 hover:bg-text hover:text-white transition-colors">Все отзывы в 2ГИС <Arrow /></a>
      </div>
    </section>
  )
}

/* ---------------- Цены и вопросы ---------------- */
export function Prices() {
  return (
    <section id="prices" className="bg-white border-y border-line">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32 grid lg:grid-cols-2 gap-14">
        <div className="reveal">
          <p className="kicker text-teal mb-3">Стоимость</p>
          <h2 className="h2 mb-8">Цены</h2>
          <div className="rounded-3xl border border-line overflow-hidden">
            {C.prices.map((p) => (
              <div key={p.name} className="flex justify-between gap-4 px-6 py-5 border-b border-line last:border-0 hover:bg-paper transition-colors">
                <span>{p.name}</span><strong className="whitespace-nowrap">{p.price}</strong>
              </div>
            ))}
          </div>
          <p className="text-sm text-sub mt-4">Цены зависят от ситуации: врач назовёт точную стоимость на бесплатной консультации — до начала лечения.</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold mr-1">Оплата:</span>
            {C.payment.map((p) => <span key={p} className="px-3 py-1.5 rounded-full bg-[#F14635] text-white text-sm font-bold">{p}</span>)}
          </div>
        </div>
        <Faq />
      </div>
    </section>
  )
}
function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="reveal">
      <p className="kicker text-teal mb-3">Вопросы</p>
      <h2 className="h2 mb-8">Частые вопросы</h2>
      {C.faq.map((f, i) => (
        <div key={i} className="border-b border-line">
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex justify-between items-center gap-4 text-left py-5 text-lg font-bold hover:text-teal transition-colors">
            {f.q}
            <span className={`shrink-0 text-2xl transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>+</span>
          </button>
          <div className={`grid transition-all duration-500 ${open === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <p className="overflow-hidden text-sub leading-relaxed pr-8">{f.a}<span className="block h-5" /></p>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- Запись и контакты ---------------- */
export function Booking() {
  const [name, setName] = useState('')
  const [service, setService] = useState(C.bookingOptions[0])
  useEffect(() => {
    const f = (e: Event) => setService((e as CustomEvent<string>).detail)
    window.addEventListener('set-service', f)
    return () => window.removeEventListener('set-service', f)
  }, [])
  const [note, setNote] = useState('')
  const lines = [`Здравствуйте! Хочу записаться в ${C.clinic.name}.`]
  if (name.trim()) lines.push('Имя: ' + name.trim())
  lines.push('Вопрос: ' + service)
  if (note.trim()) lines.push('Комментарий: ' + note.trim())
  const wa = `https://wa.me/${C.clinic.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
  const input = 'w-full text-base px-4 py-3.5 border-[1.5px] border-[#CBD5D2] rounded-xl bg-white focus:outline-none focus:border-teal'

  return (
    <section id="booking" className="bg-ink text-white">
      <div id="contacts" className="max-w-[1240px] mx-auto px-5 md:px-8 py-24 md:py-32 grid lg:grid-cols-2 gap-12">
        <div className="flex flex-col gap-6">
          <h2 className="h2 text-cream">Запишитесь на приём</h2>
          <p className="text-sage text-lg leading-relaxed">Заполните форму — откроется WhatsApp с готовым сообщением. Останется нажать «Отправить».</p>
          <dl className="grid gap-3 text-[#E6EFED]">
            <div><dt className="inline text-muted">Адрес: </dt><dd className="inline">{C.clinic.address}</dd></div>
            <div><dt className="inline text-muted">Телефон: </dt><dd className="inline"><a href={C.clinic.phoneHref} className="font-bold text-cream">{C.clinic.phone}</a></dd></div>
            <div><dt className="inline text-muted">Часы работы: </dt><dd className="inline">{C.clinic.hours}</dd></div>
          </dl>
          <div className="flex flex-wrap gap-3">
            <a href={C.clinic.instagram} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full border border-cream/40 font-bold hover:bg-cream hover:text-ink transition-colors">Instagram {C.clinic.instagramName}</a>
            <a href={C.clinic.gis} target="_blank" rel="noopener noreferrer" className="px-5 py-3 rounded-full border border-cream/40 font-bold hover:bg-cream hover:text-ink transition-colors">Как добраться — 2ГИС</a>
          </div>
          <iframe
            title="Карта: Aktobe Dent"
            src={`https://yandex.kz/map-widget/v1/?text=${encodeURIComponent(C.clinic.mapQuery)}&z=16`}
            className="w-full h-64 rounded-3xl border-0 mt-2"
            loading="lazy"
          />
        </div>
        <form className="bg-white text-text rounded-3xl p-7 md:p-9 flex flex-col gap-5 self-start" onSubmit={(e) => { e.preventDefault(); window.open(wa, '_blank') }}>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">Ваше имя
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">Что беспокоит
            <select className={input} value={service} onChange={(e) => setService(e.target.value)}>
              {C.bookingOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">Комментарий (необязательно)
            <textarea className={input} rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Например: удобно после 18:00" />
          </label>
          <button type="submit" className="bg-teal text-white font-extrabold text-lg py-4 rounded-full hover:bg-[#0A665C] transition-colors">Отправить в WhatsApp</button>
          <a href={C.clinic.phoneHref} className="text-center font-bold text-teal">или позвонить: {C.clinic.phone}</a>
        </form>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-deep text-muted text-sm pb-24 md:pb-0">
      <div className="max-w-[1240px] mx-auto px-5 md:px-8 py-8 flex flex-wrap justify-between gap-3">
        <span>© {new Date().getFullYear()} {C.clinic.name}. {C.clinic.license}.</span>
        <span>Имеются противопоказания, необходима консультация специалиста.</span>
      </div>
    </footer>
  )
}

export function MobileBar() {
  return (
    <div className="md:hidden fixed left-3 right-3 bottom-3 z-30 flex gap-2.5">
      <a href={C.clinic.phoneHref} className="flex-1 bg-cream text-ink font-extrabold min-h-[52px] rounded-full flex items-center justify-center shadow-xl">Позвонить</a>
      <a href={`https://wa.me/${C.clinic.whatsapp}`} className="flex-1 bg-teal text-white font-extrabold min-h-[52px] rounded-full flex items-center justify-center shadow-xl">WhatsApp</a>
    </div>
  )
}

export { Arrow }
