import { useEffect, useMemo, useState } from 'react'
import { Gauge, ListChecks, Share2, Check } from 'lucide-react'
import { predictions } from '../../data/mockData'
import { useAllResults } from '../../hooks/useFootballData'
import { useClaudeAuto } from '../../hooks/useClaude'
import { Card, Badge, SectionHeader, AiNote, EmptyState } from '../ui'

function ProbBar({ label, value, color, animate }) {
  return (
    <div className="flex items-center gap-3" role="group" aria-label={`${label}: ${value}%`}>
      <span className="w-11 text-xs font-semibold text-muted" aria-hidden="true">{label}</span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/40" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="prob-bar h-full rounded-full"
          style={{ width: animate ? `${value}%` : '0%', background: color }}
        />
      </div>
      <span className="w-10 text-right font-display text-lg font-bold" aria-hidden="true">{value}%</span>
    </div>
  )
}

function ConfidenceMeter({ value }) {
  const hue = value >= 70 ? 'var(--color-positive)' : value >= 50 ? 'var(--color-neutral-s)' : 'var(--color-negative)'
  return (
    <div className="flex items-center gap-2">
      <Gauge size={14} style={{ color: hue }} />
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-black/40">
        <div className="prob-bar h-full rounded-full" style={{ width: `${value}%`, background: hue }} />
      </div>
      <span className="text-xs font-semibold" style={{ color: hue }}>{value}%</span>
    </div>
  )
}

function SharePick({ match }) {
  const [copied, setCopied] = useState(false)
  const handle = async () => {
    const fav = match.probs.home >= match.probs.away ? match.home.name : match.away.name
    const text = `My WC26 pick: ${fav} to win ${match.home.code} vs ${match.away.code} — ${match.stage}`
    const url = `${window.location.origin}${window.location.pathname}#predictions`
    if (navigator.share) {
      try { await navigator.share({ title: 'WC26 Pulse prediction', text, url }) } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <button
      onClick={handle}
      title="Share this pick"
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-black/30 border border-white/10 text-muted hover:text-ink transition-colors"
    >
      {copied ? <Check size={12} className="text-gold" /> : <Share2 size={12} />}
      {copied ? 'Copied!' : 'Share pick'}
    </button>
  )
}

function PredictionCard({ match, result }) {
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const finished = result?.finished
  const favorite = match.probs.home >= match.probs.away ? match.home.name : match.away.name
  const ai = useClaudeAuto('prediction', { home: favorite, away: favorite === match.home.name ? match.away.name : match.home.name }, [match.id])

  return (
    <Card lift className="p-5 space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{match.home.flag}</span>
          <span className="font-display text-xl font-bold uppercase">{match.home.code}</span>
          {finished ? (
            <span className="font-display text-xl font-bold">
              <span className="text-gold">{result.homeScore}</span>
              <span className="text-muted mx-1">–</span>
              <span className="text-live">{result.awayScore}</span>
            </span>
          ) : (
            <span className="text-muted text-sm">v</span>
          )}
          <span className="font-display text-xl font-bold uppercase">{match.away.code}</span>
          <span className="text-2xl">{match.away.flag}</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge>{match.stage}</Badge>
          {finished && <Badge color="var(--color-muted)" bg="rgba(122,143,173,0.12)">Full time</Badge>}
          {!finished && <SharePick match={match} />}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] text-muted/60 uppercase tracking-wider font-semibold mb-1">AI-estimated win probability</p>
        <ProbBar label={match.home.code} value={match.probs.home} color="var(--color-gold)" animate={animate} />
        <ProbBar label="Draw" value={match.probs.draw} color="var(--color-muted)" animate={animate} />
        <ProbBar label={match.away.code} value={match.probs.away} color="var(--color-live)" animate={animate} />
      </div>

      <div className="flex items-center justify-between border-y border-white/5 py-2.5">
        <span className="text-xs uppercase tracking-wider text-muted">Model confidence</span>
        <ConfidenceMeter value={match.confidence} />
      </div>

      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted mb-2">
          <ListChecks size={13} /> Key factors
        </div>
        <ul className="space-y-1.5">
          {match.factors.map((f) => (
            <li key={f.label} className="flex gap-2 text-sm">
              <span className="shrink-0 font-semibold text-gold">{f.label}:</span>
              <span className="text-ink/80">{f.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <AiNote
        label={`Why we think ${favorite} wins`}
        loading={ai.loading}
        error={ai.error}
        text={ai.response}
        onRetry={ai.retry}
      />
    </Card>
  )
}

const sortedPredictions = [...predictions].sort((a, b) => {
  const d = a.date.localeCompare(b.date)
  return d !== 0 ? d : (a.time || '').localeCompare(b.time || '')
})

export default function PredictionsHub() {
  const results = useAllResults()
  const today = new Date().toISOString().slice(0, 10)

  const visible = useMemo(() => {
    const upcoming = sortedPredictions.filter((m) => {
      const key = `${m.home.code}_${m.away.code}`.toUpperCase()
      return !results[key]?.finished
    })
    const recent = sortedPredictions.filter((m) => {
      const key = `${m.home.code}_${m.away.code}`.toUpperCase()
      return results[key]?.finished
    })
    return [...upcoming, ...recent].slice(0, 6)
  }, [results])

  return (
    <section id="predictions" className="rise-in">
      <SectionHeader
        kicker="AI Predictions"
        title="Match Predictions"
        right={
          <span className="text-[11px] text-muted">
            Updated {today}
          </span>
        }
      />
      {visible.length === 0 ? (
        <EmptyState title="No upcoming matches" description="Predictions will appear 24 hours before kick-off." />
      ) : (
        <div className="space-y-5">
          {visible.map((m) => {
            const key = `${m.home.code}_${m.away.code}`.toUpperCase()
            return <PredictionCard key={m.id} match={m} result={results[key]} />
          })}
        </div>
      )}
    </section>
  )
}
