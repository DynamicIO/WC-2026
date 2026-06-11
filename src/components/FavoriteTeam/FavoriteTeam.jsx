import { useEffect, useState } from 'react'
import { Star, X, CalendarDays, ChevronDown } from 'lucide-react'
import { ALL_TEAMS, GROUP_MATCHES } from '../../data/scheduleData'
import { Card, Badge } from '../ui'

const STORAGE_KEY = 'wc26-fav-team'

// eslint-disable-next-line react-refresh/only-export-components
export function useFavTeam() {
  const [fav, setFav] = useState(() => localStorage.getItem(STORAGE_KEY) ?? null)
  const save = (code) => {
    setFav(code)
    if (code) localStorage.setItem(STORAGE_KEY, code)
    else localStorage.removeItem(STORAGE_KEY)
  }
  return [fav, save]
}

function TeamGrid({ onSelect, current }) {
  const byGroup = ALL_TEAMS.reduce((acc, t) => {
    if (!acc[t.group]) acc[t.group] = []
    acc[t.group].push(t)
    return acc
  }, {})

  return (
    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
      {Object.entries(byGroup).sort(([a], [b]) => a.localeCompare(b)).map(([group, teams]) => (
        <div key={group}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Group {group}</div>
          <div className="grid grid-cols-2 gap-2">
            {teams.map((t) => (
              <button
                key={t.code}
                onClick={() => onSelect(t.code === current ? null : t.code)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors text-left ${
                  t.code === current
                    ? 'border-gold/50 bg-gold/12 text-gold'
                    : 'border-white/8 bg-bg-card text-ink hover:border-white/20'
                }`}
              >
                <span className="text-xl shrink-0">{t.flag}</span>
                <span className="font-medium truncate">{t.name}</span>
                {t.code === current && <Star size={12} className="ml-auto shrink-0 fill-gold text-gold" />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function FavModal({ onClose, onSelect, current }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg max-h-[90dvh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-bg-secondary border border-white/10 shadow-2xl p-5 safe-area-pb">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">Pick your team</h2>
            <p className="text-xs text-muted mt-0.5">We'll highlight their fixtures throughout the dashboard</p>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full bg-bg-card border border-white/10 text-muted hover:text-ink transition-colors">
            <X size={15} />
          </button>
        </div>
        <TeamGrid onSelect={(code) => { onSelect(code); onClose() }} current={current} />
        {current && (
          <button
            onClick={() => { onSelect(null); onClose() }}
            className="mt-3 w-full text-center text-xs text-muted hover:text-negative transition-colors"
          >
            Remove favourite
          </button>
        )}
      </div>
    </div>
  )
}

function TeamFixtures({ teamCode }) {
  const team = ALL_TEAMS.find((t) => t.code === teamCode)
  if (!team) return null
  const fixtures = GROUP_MATCHES.filter((m) => m.home.code === teamCode || m.away.code === teamCode)

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{team.flag}</span>
        <div>
          <div className="font-display text-xl font-bold uppercase">{team.name}</div>
          <div className="text-xs text-muted">Group {team.group} · {fixtures.length} group stage fixtures</div>
        </div>
      </div>
      <div className="space-y-2">
        {fixtures.map((m) => {
          const isHome = m.home.code === teamCode
          const opp = isHome ? m.away : m.home
          const scoreVisible = m.status === 'live' || m.status === 'finished'
          return (
            <div key={m.id} className="flex items-center gap-3 rounded-lg bg-black/20 px-3 py-2">
              <Badge className="shrink-0">{`Group ${m.group}`}</Badge>
              <span className="text-xs text-muted shrink-0">{isHome ? 'vs' : '@'}</span>
              <span className="text-base">{opp.flag}</span>
              <span className="text-sm font-semibold flex-1 truncate">{opp.name}</span>
              {scoreVisible ? (
                <span className="font-display text-base font-bold">
                  <span className={isHome ? 'text-gold' : 'text-live'}>{isHome ? m.homeScore : m.awayScore}</span>
                  <span className="text-muted mx-1">–</span>
                  <span className={!isHome ? 'text-gold' : 'text-live'}>{isHome ? m.awayScore : m.homeScore}</span>
                </span>
              ) : (
                <span className="text-xs text-muted flex items-center gap-1">
                  <CalendarDays size={11} />{m.time}
                </span>
              )}
              {m.status === 'live' && (
                <span className="flex items-center gap-1 text-[10px] text-live font-bold">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-live" />LIVE
                </span>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

/** Compact trigger button shown in the Nav or as a floating widget */
export function FavTeamTrigger({ fav, onOpen }) {
  const team = fav ? ALL_TEAMS.find((t) => t.code === fav) : null
  return (
    <button
      onClick={onOpen}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors shrink-0 ${
        fav
          ? 'bg-gold/12 border-gold/40 text-gold'
          : 'bg-bg-card border-white/10 text-muted hover:text-ink'
      }`}
      aria-label={fav ? `My team: ${team?.name}` : 'Pick your favourite team'}
    >
      <Star size={12} className={fav ? 'fill-gold text-gold' : ''} />
      {team ? <>{team.flag} {team.code}</> : 'Follow a team'}
      <ChevronDown size={11} />
    </button>
  )
}

/** Full section rendered in the page when a team is selected */
export function FavTeamSection({ fav, onOpen }) {
  if (!fav) return null
  const team = ALL_TEAMS.find((t) => t.code === fav)
  if (!team) return null
  return (
    <section id="myteam" className="mx-auto max-w-7xl px-4 rise-in">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">My Team</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide leading-none mt-1 flex items-center gap-3">
            <span className="text-4xl">{team.flag}</span> {team.name}
          </h2>
        </div>
        <button onClick={onOpen} className="text-xs text-muted hover:text-ink transition-colors">Change team</button>
      </div>
      <TeamFixtures teamCode={fav} />
    </section>
  )
}

export default function FavoriteTeamModal({ fav, onSelect, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return <FavModal onClose={onClose} onSelect={onSelect} current={fav} />
}
