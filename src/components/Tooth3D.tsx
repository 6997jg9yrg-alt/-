import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ---------- форма зуба как "облако частиц" (signed distance function) ----------
const v = new THREE.Vector3()
function sdEllipsoid(p: THREE.Vector3, c: THREE.Vector3, r: THREE.Vector3) {
  v.copy(p).sub(c).divide(r)
  return (v.length() - 1) * Math.min(r.x, r.y, r.z)
}
function sdTaperedCapsule(p: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, ra: number, rb: number) {
  const ba = b.clone().sub(a)
  const pa = p.clone().sub(a)
  const h = Math.min(Math.max(pa.dot(ba) / ba.dot(ba), 0), 1)
  return pa.sub(ba.multiplyScalar(h)).length() - (ra + (rb - ra) * h)
}
function smin(a: number, b: number, k: number) {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.min(a, b) - (h * h * k) / 4
}
const CROWN_C = new THREE.Vector3(0, 0.55, 0)
const CROWN_R = new THREE.Vector3(1.05, 0.8, 0.95)
const CUSPS = [
  new THREE.Vector3(0.45, 1.12, 0.38),
  new THREE.Vector3(-0.45, 1.12, 0.38),
  new THREE.Vector3(0.45, 1.12, -0.38),
  new THREE.Vector3(-0.45, 1.12, -0.38),
]
const ROOTS: [THREE.Vector3, THREE.Vector3][] = [
  [new THREE.Vector3(0.45, 0.1, 0), new THREE.Vector3(0.32, -1.75, 0.05)],
  [new THREE.Vector3(-0.45, 0.1, 0), new THREE.Vector3(-0.32, -1.75, -0.05)],
]
function toothSDF(p: THREE.Vector3) {
  let d = sdEllipsoid(p, CROWN_C, CROWN_R)
  for (const c of CUSPS) d = smin(d, p.distanceTo(c) - 0.36, 0.35)
  for (const [a, b] of ROOTS) d = smin(d, sdTaperedCapsule(p, a, b, 0.42, 0.1), 0.45)
  return d
}
function sampleTooth(count: number) {
  const out: number[] = []
  const p = new THREE.Vector3()
  let guard = 0
  while (out.length < count * 3 && guard < 3_000_000) {
    guard++
    p.set((Math.random() - 0.5) * 3.2, -2 + Math.random() * 3.8, (Math.random() - 0.5) * 2.8)
    if (Math.abs(toothSDF(p)) < 0.025) out.push(p.x, p.y, p.z)
  }
  return new Float32Array(out)
}

function dotTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(255,255,255,0.8)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

export default function Tooth3D({ className = '', progressRef }: { className?: string; progressRef?: { current: number } }) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      return // нет WebGL — просто не показываем 3D
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    el.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 0, 7.2)

    const group = new THREE.Group()
    scene.add(group)
    const tex = dotTexture()

    // зуб
    const base = sampleTooth(window.innerWidth < 768 ? 3500 : 6500)
    const pos = new Float32Array(base)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const mat = new THREE.PointsMaterial({
      color: 0xf5d43b, size: 0.055, map: tex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, sizeAttenuation: true,
    })
    const tooth = new THREE.Points(geo, mat)
    tooth.position.y = 0.15
    group.add(tooth)

    // орбиты вокруг
    const ringCount = 900
    const ring = new Float32Array(ringCount * 3)
    for (let i = 0; i < ringCount; i++) {
      const a = Math.random() * Math.PI * 2
      const r = 2.3 + Math.random() * 0.5
      ring[i * 3] = Math.cos(a) * r
      ring[i * 3 + 1] = (Math.random() - 0.5) * 0.12
      ring[i * 3 + 2] = Math.sin(a) * r
    }
    const ringGeo = new THREE.BufferGeometry()
    ringGeo.setAttribute('position', new THREE.BufferAttribute(ring, 3))
    const ringMat = new THREE.PointsMaterial({
      color: 0xf5efe2, size: 0.03, map: tex, transparent: true, opacity: 0.55,
      depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const rings = new THREE.Points(ringGeo, ringMat)
    rings.rotation.x = 0.35
    group.add(rings)

    // звёзды
    const starCount = 500
    const stars = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i++) stars[i] = (Math.random() - 0.5) * 22
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(stars, 3))
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xf5d43b, size: 0.035, map: tex, transparent: true, opacity: 0.45, depthWrite: false,
    })))

    // взаимодействие: курсор поворачивает, перетаскивание крутит, клик — "взрыв"
    let targetX = 0, targetY = 0, dragY = 0, dragging = false, lastX = 0, burst = 0
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      targetX = ((e.clientY - r.top) / r.height - 0.5) * 0.6
      targetY = ((e.clientX - r.left) / r.width - 0.5) * 0.8
      if (dragging) { dragY += (e.clientX - lastX) * 0.01; lastX = e.clientX }
    }
    const onDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX; burst = 1 }
    const onUp = () => { dragging = false }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      renderer.domElement.style.width = w + 'px'
      renderer.domElement.style.height = h + 'px'
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()

    let visible = true
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting })
    io.observe(el)

    let raf = 0, t = 0, intro = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      t += 0.016
      intro = Math.min(1, intro + 0.012)
      const ease = 1 - Math.pow(1 - intro, 3)
      burst *= 0.94
      // частицы: сборка из хаоса при загрузке + дыхание + взрыв по клику
      for (let i = 0; i < pos.length; i += 3) {
        const n = Math.sin(i * 12.9898) * 43758.5453
        const rnd = n - Math.floor(n)
        const spread = (1 - ease) * 6 + burst * 1.6 * rnd
        const breathe = 1 + Math.sin(t * 1.5 + i) * 0.006
        pos[i] = base[i] * breathe * (1 + spread * (rnd - 0.3))
        pos[i + 1] = base[i + 1] * breathe + spread * (rnd - 0.5)
        pos[i + 2] = base[i + 2] * breathe * (1 + spread * (0.7 - rnd))
      }
      geo.attributes.position.needsUpdate = true
      if (progressRef) {
        // режим "истории": поворот и приближение управляются прокруткой
        const p = progressRef.current
        group.rotation.x += (targetX * 0.4 + Math.sin(p * Math.PI) * 0.35 - group.rotation.x) * 0.08
        group.rotation.y += (p * Math.PI * 2.4 + targetY * 0.4 + t * 0.05 - group.rotation.y) * 0.08
        camera.position.z += (7.6 - p * 2.6 - camera.position.z) * 0.08
      } else {
        group.rotation.x += (targetX - group.rotation.x) * 0.05
        group.rotation.y += (targetY + dragY + t * 0.25 - group.rotation.y) * 0.05
      }
      tooth.position.y = 0.15 + Math.sin(t) * 0.08
      rings.rotation.y = -t * 0.15
      renderer.render(scene, camera)
    }
    if (reduce) { intro = 1; renderer.render(scene, camera) } else frame()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect(); io.disconnect()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      geo.dispose(); ringGeo.dispose(); starGeo.dispose(); mat.dispose(); ringMat.dispose(); tex.dispose()
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
  }, [progressRef])

  return <div ref={host} className={className} aria-hidden="true" style={{ touchAction: 'pan-y' }} />
}
