import { chart, hero } from './content'
import Tooth3D from './components/Tooth3D'
import Chart3D from './components/Chart3D'
import Doctors from './components/Doctors'
import { useRevealAll } from './components/hooks'
import {
  Achievements, Arrow, Promo, Booking, Footer, HeroStats, History, Marquee, MobileBar, Navbar, Owner, Prices, Reviews, Services,
} from './components/Sections'

export default function App() {
  useRevealAll()
  return (
    <div id="top">
      <Navbar />

      {/* ГЛАВНЫЙ ЭКРАН с 3D-зубом */}
      <section className="relative bg-ink text-cream overflow-hidden lg:min-h-[100svh] flex flex-col lg:flex-row lg:items-center">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_50%,rgba(94,234,196,.12),transparent_60%)]" aria-hidden="true" />
        <div className="relative z-10 max-w-[1240px] w-full mx-auto px-5 md:px-8 pt-28 lg:py-32 pointer-events-none">
          <div className="max-w-[620px] flex flex-col gap-7">
            <p className="kicker text-mint">{hero.kicker}</p>
            <h1 className="font-display font-medium uppercase leading-[0.98] text-[clamp(48px,7vw,108px)]">{hero.title}</h1>
            <p className="text-lg md:text-xl leading-relaxed text-sage max-w-[500px]">{hero.text}</p>
            <div className="flex flex-wrap gap-3 pointer-events-auto">
              <a href="#booking" className="bg-mint text-ink font-extrabold text-base md:text-lg px-7 py-4 rounded-full inline-flex items-center gap-2.5 hover:bg-white transition-colors">Записаться на консультацию <Arrow /></a>
              <a href="#about" className="border-[1.5px] border-cream/50 font-bold text-base md:text-lg px-7 py-4 rounded-full hover:bg-cream hover:text-ink transition-colors">О клинике</a>
            </div>
            <HeroStats />
          </div>
        </div>
        <Tooth3D className="relative z-0 w-full h-[400px] -mt-4 mb-6 lg:m-0 lg:absolute lg:inset-0 lg:left-[38%] lg:h-auto cursor-grab active:cursor-grabbing" />
        <p className="hidden lg:block absolute right-8 bottom-7 kicker text-muted pointer-events-none">Покрутите зуб мышкой · нажмите</p>
      </section>

      <Marquee />
      <Promo />
      <Owner />
      <History />

      {/* ВРАЧИ + 3D-ДИАГРАММА + ДОСТИЖЕНИЯ на тёмном фоне */}
      <section id="doctors" className="bg-ink text-cream py-24 md:py-32 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 md:px-8 mb-14 reveal">
          <p className="kicker text-mint mb-3">Команда</p>
          <h2 className="h2">Наша команда</h2>
          <p className="text-sage mt-4 max-w-xl">Наведите на карточку — она повернётся за курсором.</p>
        </div>
        <Doctors />

        <div className="max-w-[1240px] mx-auto px-5 md:px-8 mt-28 md:mt-36 grid lg:grid-cols-2 gap-14 items-center">
          <div className="reveal">
            <p className="kicker text-mint mb-3">Достижения</p>
            <h2 className="h2 mb-3">{chart.title}</h2>
            <p className="text-sage mb-2">Потяните диаграмму, чтобы покрутить её в 3D.</p>
            {chart.demo && <p className="text-xs font-bold uppercase tracking-widest text-amber-300/80">Пример данных — заменить на реальные</p>}
            <Chart3D />
          </div>
          <Achievements />
        </div>
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
