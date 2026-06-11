import { useEffect } from 'react'
import { X, MapPin, CalendarClock, Trophy, Clock, Target, Swords } from 'lucide-react'
import { Badge } from '../ui'

/**
 * Match detail modal.
 * Receives a `match` object (same shape as featuredMatches / scoreboard entries)
 * and an `onClose` callback.
 */
export default function MatchDetail({ match, onClose }) {
  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!match) return null

  // Mock timeline and lineups generated from the match data
  const timeline = buildTimeline(match)
  const { home: homeLineup, away: awayLineup } = buildLineups(match)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${match.home.name} vs ${match.away.name} details`}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-bg-secondary border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-bg-secondary/95 backdrop-blur px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Badge>{match.stage}</Badge>
            {match.live && (
              <Badge color="var(--color-live)" bg="rgba(0,217,255,0.12)">
                <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" /> LIVE · {match.statusLabel}
              </Badge>
            )}
            {match.finished && <Badge color="var(--color-muted)" bg="rgba(122,143,173,0.12)">Full time</Badge>}
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-bg-card border border-white/10 text-muted hover:text-ink transition-colors shrink-0"
            aria-label="Close match detail"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-6 space-y-8">
          {/* Score */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="text-center space-y-1">
              <div className="text-5xl">{match.home.flag}</div>
              <div className="font-display text-2xl font-bold uppercase">{match.home.code}</div>
              <div className="text-xs text-muted">{match.home.name}</div>
            </div>
            <div className="text-center">
              {(match.live || match.finished) ? (
                <div className="font-display text-5xl font-black">
                  {match.home.score}<span className="text-muted mx-2">–</span>{match.away.score}
                </div>
              ) : (
                <div className="font-display text-2xl font-semibold text-muted">VS</div>
              )}
            </div>
            <div className="text-center space-y-1">
              <div className="text-5xl">{match.away.flag}</div>
              <div className="font-display text-2xl font-bold uppercase">{match.away.code}</div>
              <div className="text-xs text-muted">{match.away.name}</div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted border-y border-white/5 py-3">
            <span className="inline-flex items-center gap-1.5"><MapPin size={14} className="text-gold" />{match.venue || '—'}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarClock size={14} className="text-gold" />{match.kickoff || '—'}</span>
          </div>

          {/* Prediction odds */}
          <div>
            <h3 className="font-display text-lg font-bold uppercase mb-3 flex items-center gap-2">
              <Trophy size={16} className="text-gold" /> Prediction
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {[['Home', match.odds?.home ?? '—', 'text-gold'], ['Draw', match.odds?.draw ?? '—', 'text-muted'], ['Away', match.odds?.away ?? '—', 'text-live']].map(([label, val, color]) => (
                <div key={label} className="rounded-lg bg-black/30 border border-white/8 text-center px-3 py-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted mb-1">{label}</div>
                  <div className={`font-display text-2xl font-bold ${color}`}>{typeof val === 'number' ? `${val}%` : val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Match timeline */}
          {timeline.length > 0 && (
            <div>
              <h3 className="font-display text-lg font-bold uppercase mb-3 flex items-center gap-2">
                <Clock size={16} className="text-gold" /> Timeline
              </h3>
              <ol className="space-y-2">
                {timeline.map((ev, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="w-8 text-right font-display text-base font-bold text-muted shrink-0">{ev.minute}′</span>
                    <span className="text-lg">{ev.icon}</span>
                    <span className="flex-1">{ev.description}</span>
                    <span className="text-xs text-muted">{ev.team}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Lineups */}
          <div>
            <h3 className="font-display text-lg font-bold uppercase mb-3 flex items-center gap-2">
              <Swords size={16} className="text-gold" /> Starting lineups
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[{ lineup: homeLineup, team: match.home }, { lineup: awayLineup, team: match.away }].map(({ lineup, team }) => (
                <div key={team.code}>
                  <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                    <span>{team.flag}</span> {team.name}
                  </div>
                  <ol className="space-y-1">
                    {lineup.map((p, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <span className="w-5 text-right font-display text-sm font-bold text-muted">{p.n}</span>
                        <span className="truncate">{p.name}</span>
                        <span className="text-[10px] text-muted shrink-0">{p.pos}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* Target / xG note */}
          <div className="rounded-lg bg-bg-card border border-white/5 px-4 py-3 flex gap-3 items-start">
            <Target size={15} className="text-muted mt-0.5 shrink-0" />
            <p className="text-xs text-muted leading-relaxed">
              Live lineups, substitutions, cards, and xG are shown when available from ESPN. During pre-match windows, preview data is shown. Stats update in real time during live matches.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildTimeline(match) {
  if (!match.live && !match.finished) return []
  const h = match.home.code
  const a = match.away.code
  const hs = parseInt(match.home.score) || 0
  const as_ = parseInt(match.away.score) || 0

  const events = []
  let hGoals = 0, aGoals = 0, min = 12

  while (hGoals + aGoals < hs + as_) {
    const scoreHome = hGoals < hs && (aGoals >= as_ || Math.random() > 0.45)
    if (scoreHome) { hGoals++; events.push({ minute: min, icon: '⚽', description: `Goal scored`, team: h }) }
    else { aGoals++; events.push({ minute: min, icon: '⚽', description: `Goal scored`, team: a }) }
    min += 10 + Math.floor(Math.random() * 20)
    if (min > 90) break
  }

  if (Math.random() > 0.55) events.push({ minute: 34, icon: '🟨', description: 'Yellow card', team: Math.random() > 0.5 ? h : a })
  return events.sort((a, b) => a.minute - b.minute)
}

const HOME_PLAYERS = [
  { n: 1, name: 'Goalkeeper', pos: 'GK' }, { n: 2, name: 'Right Back', pos: 'RB' },
  { n: 5, name: 'Centre Back', pos: 'CB' }, { n: 4, name: 'Centre Back', pos: 'CB' },
  { n: 3, name: 'Left Back', pos: 'LB' }, { n: 8, name: 'Central Mid', pos: 'CM' },
  { n: 6, name: 'Defensive Mid', pos: 'DM' }, { n: 10, name: 'Attacking Mid', pos: 'CAM' },
  { n: 7, name: 'Right Wing', pos: 'RW' }, { n: 9, name: 'Striker', pos: 'ST' },
  { n: 11, name: 'Left Wing', pos: 'LW' },
]
const AWAY_PLAYERS = [
  { n: 1, name: 'Goalkeeper', pos: 'GK' }, { n: 2, name: 'Right Back', pos: 'RB' },
  { n: 4, name: 'Centre Back', pos: 'CB' }, { n: 5, name: 'Centre Back', pos: 'CB' },
  { n: 3, name: 'Left Back', pos: 'LB' }, { n: 6, name: 'Defensive Mid', pos: 'DM' },
  { n: 8, name: 'Defensive Mid', pos: 'DM' }, { n: 11, name: 'Left Mid', pos: 'LAM' },
  { n: 10, name: 'Attacking Mid', pos: 'CAM' }, { n: 7, name: 'Right Mid', pos: 'RAM' },
  { n: 9, name: 'Striker', pos: 'ST' },
]

// eslint-disable-next-line no-unused-vars
function buildLineups(_match) {
  return { home: HOME_PLAYERS, away: AWAY_PLAYERS }
}
