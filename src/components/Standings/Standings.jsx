import { useState } from 'react'
import { useStandings } from '../../hooks/useFootballData'
import { Card, SectionHeader } from '../ui'
import { SkeletonCard } from '../ui/Skeleton'
import { RefreshCw } from 'lucide-react'

const COLS = ['P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'Pts']

function GroupProgress({ entries }) {
  const totalGamesPlayed = entries.reduce((sum, e) => sum + (e.stats.P ?? 0), 0) / 2
  const totalGames = 6 // 4 teams × 3 games / 2
  const pct = Math.round((totalGamesPlayed / totalGames) * 100)
  return (
    <div className="flex items-center gap-2 text-[10px] text-muted">
      <div className="h-1 w-20 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gold/60 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span>{totalGamesPlayed}/{totalGames} played</span>
    </div>
  )
}

function StandingsTable({ group }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/5">
        <h3 className="font-display text-lg font-bold uppercase tracking-wide">{group.group}</h3>
        <GroupProgress entries={group.entries} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[400px]">
          <thead>
            <tr className="text-left border-b border-white/5">
              <th className="px-4 py-2 text-[10px] uppercase tracking-wider text-muted font-semibold w-full">Team</th>
              {COLS.map((c) => (
                <th key={c} className={`px-2 py-2 text-[10px] uppercase tracking-wider font-semibold text-center ${c === 'Pts' ? 'text-gold' : 'text-muted'}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.entries.map((entry, i) => {
              const qualified = i < 2
              return (
                <tr
                  key={entry.abbr}
                  className={`border-b border-white/5 last:border-0 transition-colors hover:bg-white/3 ${qualified ? 'bg-positive/4' : ''}`}
                >
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-bold w-4 text-center ${qualified ? 'text-positive' : 'text-muted'}`}>{i + 1}</span>
                      <span className="text-base leading-none">{entry.flag}</span>
                      <span className="font-medium truncate">{entry.team}</span>
                    </div>
                  </td>
                  {COLS.map((c) => (
                    <td key={c} className={`px-2 py-2.5 text-center font-display text-base ${c === 'Pts' ? 'font-bold text-gold' : 'text-ink/80'}`}>
                      {entry.stats[c] ?? 0}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default function Standings() {
  const { groups, loading } = useStandings()
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? groups : groups.slice(0, 4)

  return (
    <section id="standings" className="mx-auto max-w-7xl px-4 rise-in">
      <SectionHeader
        kicker="Group Stage"
        title="Standings"
        right={
          loading && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <RefreshCw size={12} className="animate-spin" /> Updating…
            </div>
          )
        }
      />

      {loading && !groups.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} height="h-36" rows={0} />)}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((g) => <StandingsTable key={g.group} group={g} />)}
          </div>

          {groups.length > 4 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="mt-4 w-full rounded-xl border border-white/10 bg-bg-card py-3 text-sm font-semibold text-muted hover:text-ink transition-colors"
            >
              {showAll ? 'Show fewer groups' : `Show all ${groups.length} groups`}
            </button>
          )}

          <p className="mt-3 text-[11px] text-muted text-center">
            <span className="inline-block h-2 w-2 rounded-sm bg-positive/30 mr-1.5" />
            Green rows qualify for the round of 32. Data via ESPN · auto-refreshes every 5 min.
          </p>
        </>
      )}
    </section>
  )
}
