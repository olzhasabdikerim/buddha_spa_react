import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useT } from '../i18n.jsx'
import { handleHashNav } from '../lib/hashNav.js'

const HERO_IMAGE = '/images/hero-main.jpg'
const HERO_VIDEO = '/video/hero.mp4'

export default function Hero() {
  const t = useT()
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    // Ensure autoplay on browsers that require an explicit muted play() call.
    v.muted = true
    const tryPlay = () => {
      const p = v.play()
      if (p && p.catch) p.catch(() => {})
    }
    tryPlay()
    return () => {}
  }, [])

  return (
    <section id="top" className="hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
      <div className={`hero__video ${playing ? 'is-playing' : ''}`} aria-hidden="true">
        <video
          ref={videoRef}
          src={HERO_VIDEO}
          poster={HERO_IMAGE}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onPlaying={() => setPlaying(true)}
        />
      </div>
      <div className="hero__overlay" />
      <div className="wrap hero__content">
        <p className="eyebrow hero__eyebrow">{t('Тайский спа · Казахстан')}</p>
        <h1 className="hero__title">
          {t('Тайский массаж')}
          <br />
          {t('и уход')} <em>{t('за телом')}</em>
        </h1>
        <p className="hero__subtitle">
          {t('Порадуйте себя и своих близких — Buddha Spa встречает вас теплом подлинной тайской традиции.')}
        </p>
        <div className="hero__actions">
          <Link to="/#branches" className="btn btn-coral" onClick={(e) => handleHashNav(e, '/#branches')}>{t('Выбрать филиал')}</Link>
          <Link to="/#branches" className="btn btn-line" onClick={(e) => handleHashNav(e, '/#branches')}>{t('Записаться в BuddhaSpa')}</Link>
        </div>
      </div>
    </section>
  )
}
