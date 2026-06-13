import { useEffect, useState } from 'react'
import { Trophy, Footprints, Shield } from 'lucide-react'
import { leaderboards as mockLeaderboards } from '../../data/mockData'
import { useLeaders } from '../../hooks/useFootballData'
import { Card, SectionHeader, EmptyState } from '../ui'
import { SkeletonRow } from '../ui/Skeleton'

const REDUCED_MOTION = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(REDUCED_MOTION ? target : 0)
  useEffect(() => {
    if (REDUCED_MOTION) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

function Counter({ value }) {
  const v = useCountUp(value)
  return <span className="font-display text-xl font-bold text-gold">{v}</span>
}

const BOARDS = [
  { key: 'goldenBoot',  espnKey: 'goals',   title: 'Goals',         icon: Trophy,     unit: 'G'  },
  { key: 'assists',     espnKey: 'assists',  title: 'Assists',       icon: Footprints, unit: 'A'  },
  { key: 'cleanSheets', espnKey: 'savePCT', title: 'Clean Sheets',  icon: Shield,     unit: 'CS' },
]

function Leaderboards() {
  const [active, setActive] = useState('goldenBoot')
  const { leaders: espnLeaders, loading } = useLeaders()
  const board = BOARDS.find((b) => b.key === active)

  const rows = (() => {
    if (espnLeaders?.[board.espnKey]?.length) return espnLeaders[board.espnKey]
    return mockLeaderboards[active] ?? []
  })()

  const allZero = rows.length > 0 && rows.every((r) => (r.value ?? 0) === 0)

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {BOARDS.map(({ key, title, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                active === key ? 'bg-gold text-bg-primary' : 'bg-black/30 text-muted hover:text-ink'
              }`}
            >
              <Icon size={13} /> {title}
            </button>
          ))}
        </div>
        {espnLeaders && (
          <span className="text-[10px] text-live font-semibold flex items-center gap-1">
            <span className="live-dot h-1 w-1 rounded-full bg-live" />Live · via ESPN
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => <SkeletonRow key={i} />)}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          title="No data yet"
          description="Leaderboards will populate live as the tournament progresses."
          icon={<Trophy size={28} className="text-gold/40" />}
        />
      ) : (
        <>
          {allZero && (
            <p className="text-[11px] text-muted/60 mb-3 italic">
              Tournament underway — scores update live after each match.
            </p>
          )}
          <ol className="space-y-2" aria-label={`${board.title} leaderboard`}>
            {rows.slice(0, 8).map((row, i) => (
              <li key={row.name} className="flex items-center gap-3 rounded-lg bg-black/20 px-3 py-2">
                <span className={`w-5 text-center font-display text-lg font-bold ${i === 0 ? 'text-gold' : 'text-muted'}`} aria-label={`Rank ${i + 1}`}>{i + 1}</span>
                <span className="text-lg" aria-hidden="true">{row.flag ?? '🏳️'}</span>
                <span className="flex-1 text-sm font-medium truncate">{row.name}</span>
                <span className="text-xs text-muted">{row.team}</span>
                <Counter key={`${active}-${row.name}`} value={row.value ?? 0} />
              </li>
            ))}
          </ol>
        </>
      )}
    </Card>
  )
}

export default function StatsPanel() {
  return (
    <section id="stats" className="rise-in">
      <SectionHeader kicker="The Numbers" title="Leaderboards" />
      <Leaderboards />
    </section>
  )
}
