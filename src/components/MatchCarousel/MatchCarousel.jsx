import { useCallback, useEffect, useRef, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, MapPin, CalendarClock, ArrowRight, RefreshCw, Share2, Check } from 'lucide-react'
import { useScoreboard } from '../../hooks/useFootballData'
import { Badge } from '../ui'
import MatchDetail from '../MatchDetail/MatchDetail'

function ShareButton({ match }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const text = `${match.home.name} vs ${match.away.name} — FIFA World Cup 2026`
    const url = `${window.location.origin}${window.location.pathname}#top`
    if (navigator.share) {
      try { await navigator.share({ title: text, url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button
      onClick={handleShare}
      className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 border border-white/10 text-white/40 hover:text-white/80 transition-colors z-10"
      aria-label="Share this match"
      title="Share"
    >
      {copied ? <Check size={13} className="text-gold" /> : <Share2 size={13} />}
    </button>
  )
}

function formatCountdown(ms) {
  if (ms <= 0) return null
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const h = Math.floor(m / 60)
  const d = Math.floor(h / 24)
  if (d > 0) return `${d}d ${h % 24}h`
  if (h > 0) return `${h}h ${m % 60}m`
  return `${m}m ${s % 60}s`
}

function useCountdown(iso) {
  const [remaining, setRemaining] = useState(() => iso ? new Date(iso) - Date.now() : null)
  const ref = useRef(null)
  useEffect(() => {
    if (!iso) return
    const tick = () => setRemaining(new Date(iso) - Date.now())
    tick()
    ref.current = setInterval(tick, 1000)
    return () => clearInterval(ref.current)
  }, [iso])
  return remaining
}

function OddsStrip({ odds }) {
  return (
    <div className="flex gap-2" role="group" aria-label="Win probabilities">
      {[['Home', odds.home], ['Draw', odds.draw], ['Away', odds.away]].map(([label, v]) => (
        <div key={label} className="flex-1 rounded-xl bg-black/40 border border-white/10 px-2 py-2.5 text-center">
          <div className="text-[10px] uppercase tracking-wider text-muted mb-0.5">{label}</div>
          <div className="font-display text-xl font-bold text-gold">{v}%</div>
        </div>
      ))}
    </div>
  )
}

function Slide({ match, onViewDetail, featured }) {
  const scoreVisible = match.live || match.finished
  const remaining = useCountdown(!match.live && !match.finished ? match.iso : null)
  const countdown = remaining != null && remaining > 0 ? formatCountdown(remaining) : null

  return (
    // Each slide is the same flex basis; scale transform makes the featured one pop
    <div
      className="relative shrink-0 grow-0 min-w-0 basis-[92%] sm:basis-[88%] px-1.5 sm:px-2 transition-all duration-500"
      style={{
        transform: featured ? 'scale(1)' : 'scale(0.955)',
        opacity: featured ? 1 : 0.55,
      }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border px-4 py-6 sm:px-6 sm:py-8 md:px-12 md:py-12 text-[#F0F4FF]"
        style={{
          background: featured
            ? 'linear-gradient(135deg, #1A1608 0%, #1C1A0E 25%, #12192B 60%, #0D1117 100%)'
            : 'linear-gradient(135deg, #0F1520 0%, #0D1117 100%)',
          borderColor: featured ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.06)',
          boxShadow: featured
            ? '0 0 0 1px rgba(201,168,76,0.12), 0 28px 64px rgba(0,0,0,0.65)'
            : '0 8px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Gold top shimmer — only on featured */}
        {featured && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.8) 50%, transparent)' }}
          />
        )}

        {/* Gold radial glow — only on featured */}
        {featured && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 55% at 40% 50%, rgba(201,168,76,0.08) 0%, transparent 70%)' }}
          />
        )}

        {/* Pitch lines */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ opacity: featured ? 0.07 : 0.04 }}
          viewBox="0 0 100 60"
          preserveAspectRatio="none"
        >
          <circle cx="50" cy="30" r="14" fill="none" stroke={featured ? '#C9A84C' : 'white'} strokeWidth="0.5" />
          <line x1="50" y1="0" x2="50" y2="60" stroke={featured ? '#C9A84C' : 'white'} strokeWidth="0.5" />
          <rect x="0" y="14" width="13" height="32" fill="none" stroke={featured ? '#C9A84C' : 'white'} strokeWidth="0.5" />
          <rect x="87" y="14" width="13" height="32" fill="none" stroke={featured ? '#C9A84C' : 'white'} strokeWidth="0.5" />
          <circle cx="50" cy="30" r="1" fill={featured ? '#C9A84C' : 'white'} />
        </svg>

        {/* Share button */}
        <ShareButton match={match} />

        {/* Badges */}
        <div className="relative flex items-center gap-2 mb-4 sm:mb-5 flex-wrap pr-10">
          <Badge>{match.stage}</Badge>
          {match.live && (
            <Badge color="var(--color-live)" bg="rgba(0,217,255,0.13)">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" aria-hidden="true" />
              LIVE{match.statusLabel ? ` · ${match.statusLabel}` : ''}
            </Badge>
          )}
          {match.finished && (
            <Badge color="var(--color-muted)" bg="rgba(122,143,173,0.12)">Full time</Badge>
          )}
        </div>

        {/* Main grid */}
        <div className="relative grid gap-6 md:gap-8 md:grid-cols-[1fr_auto] md:items-center">
          {/* Left */}
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-5 sm:gap-4 md:gap-8">
              <div className="text-center" aria-label={match.home.name}>
                <div className="text-4xl sm:text-5xl md:text-7xl leading-none" aria-hidden="true">{match.home.flag}</div>
                <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide mt-2">{match.home.code}</div>
                {scoreVisible && (
                  <div className="font-display text-3xl sm:text-4xl font-black text-gold mt-1 leading-none">{match.home.score}</div>
                )}
              </div>
              <div className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold text-white/20 shrink-0" aria-hidden="true">
                {scoreVisible ? '–' : 'VS'}
              </div>
              <div className="text-center" aria-label={match.away.name}>
                <div className="text-4xl sm:text-5xl md:text-7xl leading-none" aria-hidden="true">{match.away.flag}</div>
                <div className="font-display text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-wide mt-2">{match.away.code}</div>
                {scoreVisible && (
                  <div className="font-display text-3xl sm:text-4xl font-black text-live mt-1 leading-none">{match.away.score}</div>
                )}
              </div>
            </div>

            <p className="mt-4 sm:mt-5 max-w-md text-sm md:text-base text-white/55 leading-relaxed line-clamp-3 sm:line-clamp-none">{match.tagline}</p>

            <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs md:text-sm text-white/35">
              {match.venue && (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={13} className="text-gold" aria-hidden="true" />{match.venue}
                </span>
              )}
              {match.kickoff && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock size={13} className="text-gold" aria-hidden="true" />{match.kickoff}
                </span>
              )}
            </div>

            {countdown && (
              <div className="mt-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5">
                <span className="text-[10px] uppercase tracking-widest text-muted font-semibold">Kicks off in</span>
                <span className="font-display text-base font-bold text-gold">{countdown}</span>
              </div>
            )}
          </div>

          {/* Right */}
          <div className="w-full md:w-72 shrink-0 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold/50">AI match prediction</p>
            {match.odds && <OddsStrip odds={match.odds} />}
            <button
              onClick={() => onViewDetail(match)}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 font-display text-lg font-bold uppercase tracking-wide text-bg-primary transition-colors hover:bg-[#ddbf60] focus-visible:outline-offset-4"
              aria-label={`View full preview for ${match.home.name} vs ${match.away.name}`}
            >
              Full match preview
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Index of the match that should be auto-featured: live first, then first non-finished. */
function getFeaturedIndex(matches) {
  const liveIdx = matches.findIndex((m) => m.live)
  if (liveIdx !== -1) return liveIdx
  const nextIdx = matches.findIndex((m) => !m.finished)
  return nextIdx !== -1 ? nextIdx : 0
}

export default function MatchCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: false,
  })
  const [selected, setSelected] = useState(0)
  const [detail, setDetail] = useState(null)

  const { matches, live, refetch } = useScoreboard()

  // Scroll to featured match on load and when live status changes
  useEffect(() => {
    if (!emblaApi || !matches.length) return
    const idx = getFeaturedIndex(matches)
    emblaApi.scrollTo(idx, true)
    // Let the 'select' listener update selected state naturally
  }, [emblaApi, matches])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let timer
    if (!reduced && !live) timer = setInterval(() => emblaApi.scrollNext(), 6000)
    return () => {
      emblaApi.off('select', onSelect)
      if (timer) clearInterval(timer)
    }
  }, [emblaApi, live])

  return (
    <>
      <section
        id="top"
        className="relative mx-auto max-w-7xl pt-5 sm:pt-8 pb-2 rise-in overflow-hidden"
        aria-label="Featured matches"
      >
        <div
          className="overflow-visible"
          ref={emblaRef}
          role="region"
          aria-label="Featured matches carousel"
          aria-roledescription="carousel"
        >
          <div className="flex">
            {matches.map((m, i) => (
              <div
                key={m.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${matches.length}: ${m.home.name} vs ${m.away.name}`}
              >
                <Slide match={m} onViewDetail={setDetail} featured={i === selected} />
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-5 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4 px-4">
          <button
            onClick={scrollPrev}
            aria-label="Previous match"
            className="grid h-10 w-10 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full bg-white/5 border border-white/10 text-muted hover:text-ink hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          <div role="tablist" aria-label="Select slide" className="flex gap-2 items-center flex-wrap justify-center min-w-0">
            {matches.map((m, i) => (
              <button
                key={m.id}
                role="tab"
                aria-selected={i === selected}
                aria-label={`Go to slide ${i + 1}: ${m.home.code} vs ${m.away.code}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === selected ? 'w-7 h-1.5 bg-gold' : 'w-2 h-1.5 bg-muted/40 hover:bg-muted/70'
                }`}
              />
            ))}
          </div>

          <button
            onClick={scrollNext}
            aria-label="Next match"
            className="grid h-10 w-10 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full bg-white/5 border border-white/10 text-muted hover:text-ink hover:bg-white/10 transition-colors"
          >
            <ChevronRight size={18} />
          </button>

          <button
            onClick={refetch}
            className="ml-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted/50 hover:text-muted transition-colors"
            aria-label="Refresh match data"
            title="Refresh scores"
          >
            <RefreshCw size={13} />
          </button>
        </div>

        {live && (
          <p className="mt-3 text-center text-[11px] font-semibold text-live/70 tracking-widest uppercase">
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-live mr-1.5 align-middle" />
            Live scores · updates every 30 s
          </p>
        )}
      </section>

      {detail && <MatchDetail match={detail} onClose={() => setDetail(null)} />}
    </>
  )
}
