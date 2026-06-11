import { useMemo, useState } from 'react'
import { CalendarDays, MapPin, Filter } from 'lucide-react'
import { GROUP_MATCHES, MATCH_DATES, GROUPS } from '../../data/scheduleData'
import { useAllResults } from '../../hooks/useFootballData'
import { Card, SectionHeader } from '../ui'

const DAY_FMT = (dateStr) => {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}


function MatchRow({ match, favTeam }) {
  const isFav = favTeam && (match.home.code === favTeam || match.away.code === favTeam)
  const scoreVisible = match.status === 'live' || match.status === 'finished'

  return (
    <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 border-b border-white/5 last:border-0 transition-colors hover:bg-white/3 ${isFav ? 'bg-gold/5' : ''}`}>
      {/* Group badge */}
      <span className="hidden sm:inline shrink-0 w-6 text-center text-[10px] font-bold text-muted">
        {match.group}
      </span>

      {/* Home */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 sm:flex-none sm:w-36 justify-end">
        {isFav && match.home.code === favTeam && (
          <span className="text-[8px] text-gold font-bold shrink-0">★</span>
        )}
        <span className="text-[13px] sm:text-sm font-semibold truncate">{match.home.name}</span>
        <span className="text-base leading-none shrink-0">{match.home.flag}</span>
      </div>

      {/* Score / time */}
      <div className="flex flex-col items-center shrink-0 w-16 sm:w-24">
        {scoreVisible ? (
          <div className="font-display text-lg sm:text-xl font-bold whitespace-nowrap">
            <span className="text-gold">{match.homeScore ?? '?'}</span>
            <span className="text-muted mx-1">–</span>
            <span className="text-live">{match.awayScore ?? '?'}</span>
          </div>
        ) : (
          <span className="text-[11px] sm:text-xs font-semibold text-muted whitespace-nowrap">{match.time}</span>
        )}
        {match.status === 'live' && (
          <span className="flex items-center gap-1 text-[10px] text-live font-bold mt-0.5">
            <span className="live-dot h-1 w-1 rounded-full bg-live" />LIVE
          </span>
        )}
        {match.status === 'finished' && (
          <span className="text-[10px] text-muted">Full time</span>
        )}
      </div>

      {/* Away */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0 sm:flex-none sm:w-36">
        <span className="text-base leading-none shrink-0">{match.away.flag}</span>
        <span className="text-[13px] sm:text-sm font-semibold truncate">{match.away.name}</span>
        {isFav && match.away.code === favTeam && (
          <span className="text-[8px] text-gold font-bold shrink-0">★</span>
        )}
      </div>

      {/* Venue — hidden on small screens */}
      <span className="hidden lg:inline flex-1 text-xs text-muted truncate text-right">
        <MapPin size={10} className="inline mr-1 text-gold" />{match.venue}
      </span>
    </div>
  )
}

export default function Schedule({ favTeam }) {
  const espnResults = useAllResults()
  const today = new Date().toISOString().slice(0, 10)

  // Default tab = today if it exists, otherwise first date with matches
  const defaultDate = MATCH_DATES.includes(today) ? today : MATCH_DATES[0]
  const [activeDate, setActiveDate] = useState(defaultDate)
  const [groupFilter, setGroupFilter] = useState('ALL')
  const [showFilter, setShowFilter] = useState(false)

  const applyResults = (match) => {
    const key = `${match.home.code}_${match.away.code}`.toUpperCase()
    const r = espnResults[key]
    if (!r) return match
    return {
      ...match,
      status: r.live ? 'live' : r.finished ? 'finished' : match.status,
      homeScore: r.homeScore ?? match.homeScore,
      awayScore: r.awayScore ?? match.awayScore,
    }
  }

  const dayMatches = useMemo(() => {
    let list = GROUP_MATCHES.filter((m) => m.date === activeDate)
    if (groupFilter !== 'ALL') list = list.filter((m) => m.group === groupFilter)
    if (favTeam && groupFilter === 'MY') {
      list = GROUP_MATCHES.filter((m) => m.home.code === favTeam || m.away.code === favTeam)
    }
    return list.map(applyResults)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDate, groupFilter, favTeam, espnResults])

  return (
    <section id="schedule" className="mx-auto max-w-7xl px-4 rise-in">
      <SectionHeader
        kicker="Group Stage"
        title="Full Schedule"
        right={
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
              groupFilter !== 'ALL'
                ? 'bg-gold/15 border-gold/40 text-gold'
                : 'bg-bg-card border-white/10 text-muted hover:text-ink'
            }`}
          >
            <Filter size={12} /> Filter
          </button>
        }
      />

      {/* Group filter chips */}
      {showFilter && (
        <div className="flex flex-wrap gap-2 mb-4">
          {['ALL', ...(favTeam ? ['MY'] : []), ...GROUPS].map((g) => (
            <button
              key={g}
              onClick={() => { setGroupFilter(g); if (g === 'MY') setActiveDate(defaultDate) }}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                groupFilter === g
                  ? 'bg-gold text-bg-primary'
                  : 'bg-bg-card border border-white/10 text-muted hover:text-ink'
              }`}
            >
              {g === 'ALL' ? 'All groups' : g === 'MY' ? '⭐ My team' : `Group ${g}`}
            </button>
          ))}
        </div>
      )}

      {/* Day tabs */}
      {groupFilter !== 'MY' && (
        <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar mb-4">
          {MATCH_DATES.map((d) => {
            const isToday = d === today
            const isActive = d === activeDate
            return (
              <button
                key={d}
                onClick={() => setActiveDate(d)}
                className={`shrink-0 rounded-xl px-3 py-2 text-center transition-colors ${
                  isActive
                    ? 'bg-gold text-bg-primary'
                    : isToday
                    ? 'bg-live/15 border border-live/40 text-live'
                    : 'bg-bg-card border border-white/8 text-muted hover:text-ink'
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider">{isToday ? 'Today' : DAY_FMT(d).split(',')[0]}</div>
                <div className="text-xs font-semibold">{DAY_FMT(d).replace(/^[^,]+, /, '')}</div>
              </button>
            )
          })}
        </div>
      )}

      {/* Match list */}
      <Card>
        {/* Header row */}
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 border-b border-white/8 bg-white/3">
          <span className="hidden sm:inline w-6" />
          <span className="flex-1 sm:flex-none sm:w-36 text-right text-[10px] uppercase tracking-wider text-muted font-semibold">Home</span>
          <span className="w-16 sm:w-24 text-center text-[10px] uppercase tracking-wider text-muted font-semibold whitespace-nowrap">
            {groupFilter === 'MY'
              ? 'Score'
              : <><span className="sm:hidden">Time</span><span className="hidden sm:inline">{DAY_FMT(activeDate)}</span></>}
          </span>
          <span className="flex-1 sm:flex-none sm:w-36 text-[10px] uppercase tracking-wider text-muted font-semibold">Away</span>
          <span className="hidden lg:block flex-1 text-right text-[10px] uppercase tracking-wider text-muted font-semibold">Venue</span>
        </div>

        {dayMatches.length === 0 ? (
          <div className="py-10 text-center text-muted text-sm">
            No matches scheduled for this day / filter.
          </div>
        ) : (
          dayMatches.map((match) => (
            <MatchRow key={match.id} match={match} favTeam={favTeam} />
          ))
        )}
      </Card>

      <p className="mt-2 text-[11px] text-muted text-center flex items-center justify-center gap-1.5">
        <CalendarDays size={11} />
        All 72 group stage matches · {MATCH_DATES.length} matchdays · times in ET · source: FIFA.com
      </p>
    </section>
  )
}
