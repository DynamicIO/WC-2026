import { useState } from 'react'
import { CheckCircle2, XCircle, Clock, Trophy } from 'lucide-react'
import { predictions } from '../../data/mockData'
import { useAllResults } from '../../hooks/useFootballData'
import { Card, SectionHeader } from '../ui'

const STORAGE_KEY = 'wc26-my-picks'

// eslint-disable-next-line react-refresh/only-export-components
export function useMyPicks() {
  const [picks, setPicks] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') } catch { return {} }
  })
  const setPick = (matchId, pick) => {
    setPicks((prev) => {
      const next = { ...prev, [matchId]: pick }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }
  return [picks, setPick]
}

/** Determine actual outcome from ESPN result */
function getActualOutcome(match, espnResults) {
  const key = `${match.home.code}_${match.away.code}`.toUpperCase()
  const r = espnResults[key]
  if (!r?.finished) return null
  const hs = parseInt(r.homeScore) || 0
  const as_ = parseInt(r.awayScore) || 0
  if (hs > as_) return 'home'
  if (as_ > hs) return 'away'
  return 'draw'
}

const PICK_OPTS = [
  { value: 'home', label: 'Home Win' },
  { value: 'draw', label: 'Draw' },
  { value: 'away', label: 'Away Win' },
]

function PickRow({ match, pick, onPick, outcome }) {
  const isLocked = outcome !== null
  const isCorrect = isLocked && pick === outcome
  const isWrong = isLocked && pick && pick !== outcome

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0 ${isCorrect ? 'bg-positive/5' : isWrong ? 'bg-negative/5' : ''}`}>
      {/* Teams */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span>{match.home.flag}</span>
        <span className="font-display font-bold text-sm uppercase">{match.home.code}</span>
        <span className="text-muted text-xs">vs</span>
        <span className="font-display font-bold text-sm uppercase">{match.away.code}</span>
        <span>{match.away.flag}</span>
        <span className="text-[10px] text-muted hidden sm:inline ml-1">· {match.stage.split('·')[0].trim()}</span>
      </div>

      {/* Pick buttons / result */}
      <div className="flex items-center gap-1.5 shrink-0">
        {PICK_OPTS.map(({ value, label }) => {
          const selected = pick === value
          const isThisOutcome = isLocked && outcome === value
          return (
            <button
              key={value}
              onClick={() => !isLocked && onPick(match.id, value)}
              disabled={isLocked}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors border ${
                selected && isCorrect
                  ? 'bg-positive/20 border-positive/50 text-positive'
                  : selected && isWrong
                  ? 'bg-negative/20 border-negative/50 text-negative'
                  : isThisOutcome && !selected
                  ? 'bg-white/10 border-white/20 text-ink'
                  : selected
                  ? 'bg-gold/20 border-gold/50 text-gold'
                  : 'bg-black/20 border-white/10 text-muted hover:text-ink disabled:opacity-40 disabled:cursor-default'
              }`}
            >
              {label}
            </button>
          )
        })}

        {/* Status icon */}
        {isLocked && pick && (
          isCorrect
            ? <CheckCircle2 size={16} className="text-positive shrink-0" />
            : <XCircle size={16} className="text-negative shrink-0" />
        )}
        {!isLocked && !pick && (
          <Clock size={14} className="text-muted/40 shrink-0" />
        )}
      </div>
    </div>
  )
}

export default function MyPredictions() {
  const [picks, setPick] = useMyPicks()
  const espnResults = useAllResults()

  const rows = predictions.map((m) => ({
    match: m,
    pick: picks[m.id] ?? null,
    outcome: getActualOutcome(m, espnResults),
  }))

  const locked = rows.filter((r) => r.outcome !== null)
  const correct = locked.filter((r) => r.pick === r.outcome).length
  const total = locked.length
  const made = rows.filter((r) => r.pick !== null).length

  return (
    <section id="my-picks" className="rise-in">
      <SectionHeader
        kicker="Fan Tracker"
        title="My Picks"
        description="Pick a winner for each match. Results lock automatically after kick-off."
        right={
          total > 0 ? (
            <div className="flex items-center gap-2 rounded-full bg-gold/10 border border-gold/30 px-4 py-1.5">
              <Trophy size={14} className="text-gold" />
              <span className="font-display text-lg font-bold text-gold">{correct}</span>
              <span className="text-xs text-muted">/ {total} correct</span>
            </div>
          ) : made > 0 ? (
            <span className="text-xs text-muted">{made} picks made · awaiting kick-off</span>
          ) : null
        }
      />

      <Card>
        {rows.map(({ match, pick, outcome }) => (
          <PickRow
            key={match.id}
            match={match}
            pick={pick}
            onPick={setPick}
            outcome={outcome}
          />
        ))}
      </Card>

      <p className="mt-2 text-center text-[11px] text-muted">
        Picks are saved in your browser. Results update live via ESPN.
      </p>
    </section>
  )
}
