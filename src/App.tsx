import { lazy, Suspense } from 'react'
import { chart, hero } from './content'
// 3D-зуб и диаграмма грузятся отдельно, после основной страницы — сайт открывается быстрее
const Tooth3D = lazy(() => import('./components/Tooth3D'))
const Chart3D = lazy(() => import('./components/Chart3D'))
import Doctors from './components/Doctors'
import { useRevealAll } from './components/hooks'
import { useT } from './i18n'
import {
  Achievements, Arrow, Promo, UrgentCall, Booking, Footer, HeroStats, History, Marquee, MobileBar, Navbar, Owner, Prices, Reviews, Services,
} from './components/Sections'

export default function App() {
  useRevealAll()
  const t = useT()
  return (
    <div id="top">
      <Navbar />

      {/* ГЛАВНЫЙ ЭКРАН с 3D-зубом */}
      <section className="relative bg-ink text-cream overflow-hidden lg:min-h-[100svh] flex flex-col lg:flex-row lg:items-center">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_50%,rgba(245,212,59,.10),transparent_60%)]" aria-hidden="true" />
        <div className="relative z-10 max-w-[1240px] w-full mx-auto px-5 md:px-8 pt-20 sm:pt-24 lg:py-32 pointer-events-none">
          <div className="max-w-[620px] flex flex-col gap-4 sm:gap-5 md:gap-7">
            <p className="kicker text-mint">{t(hero.kicker)}</p>
            <h1 className="font-display font-medium uppercase leading-[0.98] text-[clamp(34px,7vw,108px)]">{t(hero.title)}</h1>
            <p className="hidden sm:block text-base md:text-xl leading-relaxed text-sage max-w-[500px]">{t(hero.text)}</p>
            <p className="sm:hidden text-base leading-snug text-sage">{t(hero.short)}</p>
            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <a href="#booking" className="bg-mint text-ink font-extrabold text-base md:text-lg px-6 md:px-7 py-3.5 md:py-4 rounded-full inline-flex items-center gap-2.5 hover:bg-white transition-colors">{t('Записаться на консультацию')} <Arrow /></a>
              <a href="#about" className="hidden sm:inline-flex border-[1.5px] border-cream/50 font-bold text-base md:text-lg px-7 py-4 rounded-full hover:bg-cream hover:text-ink transition-colors">{t('О клинике')}</a>
            </div>
            <UrgentCall />
            <HeroStats />
          </div>
        </div>
        <Suspense fallback={<div className="relative z-0 w-full h-[340px] sm:h-[400px] -mt-2 mb-6 lg:m-0 lg:absolute lg:inset-0 lg:left-[38%] lg:h-auto cursor-grab active:cursor-grabbing" />}>
          <Tooth3D className="relative z-0 w-full h-[340px] sm:h-[400px] -mt-2 mb-6 lg:m-0 lg:absolute lg:inset-0 lg:left-[38%] lg:h-auto cursor-grab active:cursor-grabbing" />
        </Suspense>
        <p className="hidden lg:block absolute right-8 bottom-7 kicker text-muted pointer-events-none">{t('Покрутите зуб мышкой · нажмите')}</p>
      </section>

      <Marquee />
      <Promo />
      <Owner />
      <History />

      {/* ВРАЧИ + 3D-ДИАГРАММА + ДОСТИЖЕНИЯ на тёмном фоне */}
      <section id="doctors" className="bg-ink text-cream py-24 md:py-32 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 mb-14 reveal">
          <p className="kicker text-mint mb-3">{t('Команда')}</p>
          <h2 className="h2">{t('Наша команда')}</h2>
          <p className="text-sage mt-4 max-w-xl">{t('Листайте карточки — пальцем, мышкой или стрелками.')}</p>
        </div>
        <Doctors />

        {/* Диаграмма и «Достижения» появятся, когда в content.ts будут реальные данные (chart.demo = false) */}
        {!chart.demo && (
          <div className="max-w-[1240px] mx-auto px-5 md:px-8 mt-28 md:mt-36 grid lg:grid-cols-2 gap-14 items-center">
            <div className="reveal">
              <p className="kicker text-mint mb-3">{t('Достижения')}</p>
              <h2 className="h2 mb-3">{t(chart.title)}</h2>
              <Suspense fallback={<div className="h-[440px]" />}><Chart3D /></Suspense>
            </div>
            <Achievements />
          </div>
        )}
      </section>

      <Services />
      <Reviews />
      <Prices />
      <Booking />
      <Footer />
      <MobileBar />
    </div>
  )
}
