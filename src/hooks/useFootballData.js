/**
 * ESPN public API integration — no API key required.
 * Endpoints: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/...
 *
 * Fetches scoreboards from tournament start through today, computes standings
 * from finished results when ESPN standings are empty, and polls automatically.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { GROUP_MATCHES, ALL_TEAMS } from '../data/scheduleData'
import { featuredMatches, predictions } from '../data/mockData'

const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world'
const TOURNAMENT_START = '2026-06-11'
const LIVE_INTERVAL = 30_000
const IDLE_INTERVAL = 300_000

// ─── Editorial lookup (odds, taglines) keyed by HOME_AWAY ─────────────────────

const EDITORIAL = {}
for (const m of featuredMatches) {
  EDITORIAL[`${m.home.code}_${m.away.code}`.toUpperCase()] = {
    odds: m.odds,
    tagline: m.tagline,
    kickoff: m.kickoff,
    iso: m.iso,
  }
}
for (const p of predictions) {
  const key = `${p.home.code}_${p.away.code}`.toUpperCase()
  if (!EDITORIAL[key]) {
    EDITORIAL[key] = {
      odds: { home: p.probs.home, draw: p.probs.draw, away: p.probs.away },
      tagline: p.factors?.[0]?.detail ?? '',
      kickoff: '',
      iso: null,
    }
  }
}

// ─── Date / time helpers ───────────────────────────────────────────────────────

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

/** ESPN scoreboard dates param: YYYYMMDD */
function toEspnDate(iso) {
  return iso.replace(/-/g, '')
}

function espnDateRange() {
  const dates = []
  const end = new Date(`${todayIso()}T12:00:00`)
  const start = new Date(`${TOURNAMENT_START}T12:00:00`)
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(toEspnDate(d.toISOString().slice(0, 10)))
  }
  return dates
}

function formatKickoff(date, time) {
  const d = new Date(`${date}T12:00:00`)
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return `${day} · ${time}`
}

function toIsoUtc(date, timeStr) {
  const m = timeStr.match(/(\d+):(\d+)\s*(AM|PM)\s*ET/i)
  if (!m) return `${date}T19:00:00Z`
  let h = parseInt(m[1], 10)
  const min = parseInt(m[2], 10)
  const ampm = m[3].toUpperCase()
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  const utcH = h + 4 // EDT (UTC-4) during June
  const utc = new Date(`${date}T00:00:00Z`)
  utc.setUTCHours(utcH, min, 0, 0)
  return utc.toISOString()
}

// ─── ESPN parsing ─────────────────────────────────────────────────────────────

function espnStatus(status) {
  const s = status?.type
  if (!s) return { live: false, finished: false, statusLabel: '' }
  const live = s.state === 'in'
  const finished = s.state === 'post'
  const statusLabel = live
    ? `${status.displayClock ?? ''}${status.period ? ` · ${status.period}′` : ''}`
    : s.shortDetail || ''
  return { live, finished, statusLabel }
}

function parseEvent(evt) {
  const comp = evt.competitions?.[0]
  if (!comp) return null
  const competitors = comp.competitors ?? []
  const home = competitors.find((c) => c.homeAway === 'home')
  const away = competitors.find((c) => c.homeAway === 'away')
  if (!home || !away) return null
  const st = espnStatus(comp.status)
  const key = `${home.team?.abbreviation}_${away.team?.abbreviation}`.toUpperCase()
  return {
    key,
    homeCode: home.team?.abbreviation,
    awayCode: away.team?.abbreviation,
    live: st.live,
    finished: st.finished,
    statusLabel: st.statusLabel,
    homeScore: home.score ?? null,
    awayScore: away.score ?? null,
    date: evt.date,
  }
}

function buildResultsMap(events) {
  const map = {}
  for (const evt of events) {
    const parsed = parseEvent(evt)
    if (!parsed) continue
    map[parsed.key] = {
      live: parsed.live,
      finished: parsed.finished,
      statusLabel: parsed.statusLabel,
      homeScore: parsed.homeScore,
      awayScore: parsed.awayScore,
    }
  }
  return map
}

async function safeFetch(url) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 8000)
  try {
    const res = await fetch(url, { signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(timer)
  }
}

/** Fetch scoreboards for every matchday from tournament start through today. */
async function fetchAllEvents() {
  const dates = espnDateRange()
  const batches = await Promise.all(
    dates.map((d) =>
      safeFetch(`${BASE}/scoreboard?dates=${d}`)
        .then((data) => data.events ?? [])
        .catch(() => []),
    ),
  )
  const seen = new Set()
  const events = []
  for (const batch of batches) {
    for (const evt of batch) {
      if (!seen.has(evt.id)) {
        seen.add(evt.id)
        events.push(evt)
      }
    }
  }
  return events
}

// ─── Featured carousel builder ────────────────────────────────────────────────

function scheduleToFeatured(scheduleMatch, results, matchNum) {
  const key = `${scheduleMatch.home.code}_${scheduleMatch.away.code}`.toUpperCase()
  const r = results[key]
  const ed = EDITORIAL[key] ?? {}
  const finished = r?.finished ?? false
  const live = r?.live ?? false

  return {
    id: scheduleMatch.id,
    iso: ed.iso ?? toIsoUtc(scheduleMatch.date, scheduleMatch.time),
    home: {
      ...scheduleMatch.home,
      score: (live || finished) ? (r?.homeScore ?? '0') : undefined,
    },
    away: {
      ...scheduleMatch.away,
      score: (live || finished) ? (r?.awayScore ?? '0') : undefined,
    },
    venue: scheduleMatch.venue,
    kickoff: ed.kickoff || formatKickoff(scheduleMatch.date, scheduleMatch.time),
    stage: `Group ${scheduleMatch.group} · Match ${matchNum}`,
    odds: ed.odds ?? { home: 33, draw: 34, away: 33 },
    tagline: ed.tagline || `${scheduleMatch.home.name} face ${scheduleMatch.away.name} in Group ${scheduleMatch.group}.`,
    live,
    finished,
    statusLabel: r?.statusLabel ?? '',
    date: scheduleMatch.date,
  }
}

function buildFeaturedMatches(results) {
  const today = todayIso()
  const enriched = GROUP_MATCHES.map((m, i) => ({
    ...scheduleToFeatured(m, results, i + 1),
    sortDate: m.date,
  }))

  const live = enriched.filter((m) => m.live)
  const todayUpcoming = enriched.filter((m) => m.date === today && !m.live && !m.finished)
  const todayFinished = enriched.filter((m) => m.date === today && m.finished)
  const recentFinished = enriched
    .filter((m) => m.date < today && m.finished)
    .sort((a, b) => b.date.localeCompare(a.date))
  const upcoming = enriched
    .filter((m) => m.date > today && !m.finished)
    .sort((a, b) => a.date.localeCompare(b.date))

  const ordered = [
    ...live,
    ...todayUpcoming,
    ...recentFinished.slice(0, 3),
    ...todayFinished,
    ...upcoming,
  ]

  const seen = new Set()
  const unique = []
  for (const m of ordered) {
    if (!seen.has(m.id)) {
      seen.add(m.id)
      unique.push(m)
    }
  }
  return unique.slice(0, 10)
}

// ─── Standings computation from results ───────────────────────────────────────

const zeroed = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }

function computeStandingsFromResults(results) {
  const groups = {}
  for (const letter of 'ABCDEFGHIJKL') {
    groups[letter] = {}
  }

  for (const m of GROUP_MATCHES) {
    const key = `${m.home.code}_${m.away.code}`.toUpperCase()
    const r = results[key]
    if (!r?.finished) continue

    const hs = parseInt(r.homeScore, 10) || 0
    const as_ = parseInt(r.awayScore, 10) || 0
    const g = m.group

    const init = (code, team) => {
      if (!groups[g][code]) {
        groups[g][code] = {
          team: team.name,
          abbr: team.code,
          flag: team.flag,
          stats: { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 },
        }
      }
    }
    init(m.home.code, m.home)
    init(m.away.code, m.away)

    const h = groups[g][m.home.code].stats
    const a = groups[g][m.away.code].stats
    h.P++; a.P++
    h.GF += hs; h.GA += as_; h.GD = h.GF - h.GA
    a.GF += as_; a.GA += hs; a.GD = a.GF - a.GA

    if (hs > as_) { h.W++; h.Pts += 3; a.L++ }
    else if (as_ > hs) { a.W++; a.Pts += 3; h.L++ }
    else { h.D++; a.D++; h.Pts++; a.Pts++ }
  }

  return Object.keys(groups)
    .sort()
    .map((letter) => {
      const teamsInGroup = GROUP_MATCHES
        .filter((m) => m.group === letter)
        .flatMap((m) => [m.home, m.away])
      const uniqueTeams = [...new Map(teamsInGroup.map((t) => [t.code, t])).values()]

      const entries = uniqueTeams.map((t) => {
        const row = groups[letter][t.code]
        return row ?? { team: t.name, abbr: t.code, flag: t.flag, stats: { ...zeroed } }
      })

      entries.sort((a, b) => {
        if (b.stats.Pts !== a.stats.Pts) return b.stats.Pts - a.stats.Pts
        if (b.stats.GD !== a.stats.GD) return b.stats.GD - a.stats.GD
        if (b.stats.GF !== a.stats.GF) return b.stats.GF - a.stats.GF
        return a.team.localeCompare(b.team)
      })

      return { group: `Group ${letter}`, entries }
    })
}

const FLAG_BY_CODE = Object.fromEntries(ALL_TEAMS.map((t) => [t.code, t.flag]))

// ─── Player goals & assists from match summaries ─────────────────────────────

function parseScoringPlays(summary, evt) {
  const comp = evt.competitions?.[0]
  const teamById = {}
  const teamByName = {}
  for (const c of comp?.competitors ?? []) {
    if (c.team?.id) teamById[String(c.team.id)] = c.team.abbreviation
    if (c.team?.displayName) teamByName[c.team.displayName.toLowerCase()] = c.team.abbreviation
  }

  const goals = {}
  const assists = {}

  for (const ev of summary.keyEvents ?? []) {
    if (!ev.scoringPlay) continue
    const isOwnGoal = (ev.shortText || ev.type?.text || '').toLowerCase().includes('own goal')
    const scorer = ev.participants?.[0]?.athlete?.displayName
    const assister = ev.participants?.[1]?.athlete?.displayName
    const teamAbbr =
      teamById[String(ev.team?.id)] ||
      teamByName[ev.team?.displayName?.toLowerCase()] ||
      '—'

    if (scorer && !isOwnGoal) {
      const key = scorer.toLowerCase()
      if (!goals[key]) goals[key] = { name: scorer, team: teamAbbr, value: 0 }
      goals[key].value++
    }
    if (assister) {
      const key = assister.toLowerCase()
      if (!assists[key]) assists[key] = { name: assister, team: teamAbbr, value: 0 }
      assists[key].value++
    }
  }
  return { goals, assists }
}

function mergeStatMaps(target, source) {
  for (const [key, row] of Object.entries(source)) {
    if (!target[key]) target[key] = { ...row }
    else target[key].value += row.value
  }
}

function toLeaderRows(map) {
  return Object.values(map)
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name))
    .map((r) => ({ ...r, flag: FLAG_BY_CODE[r.team] || '🏳️' }))
}

async function aggregatePlayerLeaders(events) {
  const finished = events.filter((e) => e.competitions?.[0]?.status?.type?.state === 'post')
  const allGoals = {}
  const allAssists = {}

  await Promise.all(
    finished.map(async (evt) => {
      try {
        const summary = await safeFetch(`${BASE}/summary?event=${evt.id}`)
        const { goals, assists } = parseScoringPlays(summary, evt)
        mergeStatMaps(allGoals, goals)
        mergeStatMaps(allAssists, assists)
      } catch {
        /* skip unavailable summaries */
      }
    }),
  )

  return {
    goals: toLeaderRows(allGoals),
    assists: toLeaderRows(allAssists),
  }
}

function parseEspnLeaders(data) {
  const cats = data.categories ?? []
  const parsed = {}
  for (const cat of cats) {
    parsed[cat.name] = (cat.leaders ?? []).slice(0, 8).map((l) => ({
      name: l.athlete?.displayName ?? '—',
      team: l.athlete?.team?.abbreviation ?? '—',
      flag: FLAG_BY_CODE[l.athlete?.team?.abbreviation] || '',
      value: l.value ?? 0,
    }))
  }
  return parsed
}

function transformEspnStandings(data) {
  return (data.standings ?? []).map((group) => ({
    group: group.name,
    entries: (group.entries ?? []).map((e) => ({
      team: e.team?.displayName ?? e.team?.name ?? '—',
      flag: e.team?.flag || '',
      abbr: e.team?.abbreviation || '',
      stats: {
        P: e.stats?.find((s) => s.name === 'gamesPlayed')?.value ?? 0,
        W: e.stats?.find((s) => s.name === 'wins')?.value ?? 0,
        D: e.stats?.find((s) => s.name === 'ties')?.value ?? 0,
        L: e.stats?.find((s) => s.name === 'losses')?.value ?? 0,
        GF: e.stats?.find((s) => s.name === 'pointsFor')?.value ?? 0,
        GA: e.stats?.find((s) => s.name === 'pointsAgainst')?.value ?? 0,
        GD: e.stats?.find((s) => s.name === 'pointDifferential')?.value ?? 0,
        Pts: e.stats?.find((s) => s.name === 'points')?.value ?? 0,
      },
    })),
  }))
}

// ─── Shared data fetch (used by multiple hooks) ───────────────────────────────

let _cache = { results: {}, events: [], leaders: null, ts: 0 }
let _inflight = null

async function loadTournamentData() {
  if (_inflight) return _inflight
  _inflight = fetchAllEvents()
    .then(async (events) => {
      const results = buildResultsMap(events)
      const leaders = await aggregatePlayerLeaders(events)
      _cache = { results, events, leaders, ts: Date.now() }
      _inflight = null
      return _cache
    })
    .catch(() => {
      _inflight = null
      return _cache
    })
  return _inflight
}

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Returns featured match carousel, built from schedule + live ESPN data. */
export function useScoreboard() {
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)

  const fetch_ = useCallback(() => {
    loadTournamentData()
      .then(({ results }) => {
        const featured = buildFeaturedMatches(results)
        setMatches(featured)
        setLive(featured.some((m) => m.live))
      })
      .catch(() => setMatches(buildFeaturedMatches({})))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetch_() }, [fetch_])
  useEffect(() => {
    const interval = live ? LIVE_INTERVAL : IDLE_INTERVAL
    const id = setInterval(fetch_, interval)
    return () => clearInterval(id)
  }, [fetch_, live])

  const fallback = buildFeaturedMatches(_cache.results)
  return { matches: matches ?? fallback, loading: loading && !matches, live, refetch: fetch_ }
}

/** Returns group standings — ESPN when available, otherwise computed from results. */
export function useStandings() {
  const [groups, setGroups] = useState(null)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('computed')

  const fetch_ = useCallback(() => {
    Promise.all([
      safeFetch(`${BASE}/standings`).catch(() => ({ standings: [] })),
      loadTournamentData(),
    ])
      .then(([espnData, { results }]) => {
        const espn = transformEspnStandings(espnData)
        if (espn.length > 0) {
          setGroups(espn)
          setSource('espn')
        } else {
          setGroups(computeStandingsFromResults(results))
          setSource('computed')
        }
      })
      .catch(() => setGroups(computeStandingsFromResults(_cache.results)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetch_() }, [fetch_])
  useEffect(() => {
    const id = setInterval(fetch_, IDLE_INTERVAL)
    return () => clearInterval(id)
  }, [fetch_])

  const fallback = computeStandingsFromResults(_cache.results)
  return { groups: groups ?? fallback, loading, source }
}

/** Returns the live ticker string (e.g. "ESP 2–1 BRA · 67′"). */
export function useLiveTicker() {
  const { matches, live } = useScoreboard()
  if (!live) return null
  const liveMatches = matches.filter((m) => m.live)
  if (!liveMatches.length) return null
  return liveMatches
    .map((m) => `${m.home.code} ${m.home.score}–${m.away.score} ${m.away.code} · ${m.statusLabel}`)
    .join('  ·  ')
}

/** Polls scoreboard and fires onGoal whenever a score changes. */
export function useGoalNotifications(onGoal) {
  const prevRef = useRef({})

  const check = useCallback(() => {
    loadTournamentData()
      .then(({ events }) => {
        for (const evt of events) {
          const parsed = parseEvent(evt)
          if (!parsed || !parsed.live) continue
          const hs = parseInt(parsed.homeScore, 10) || 0
          const as_ = parseInt(parsed.awayScore, 10) || 0
          const prev = prevRef.current[evt.id]
          if (prev && (hs !== prev.hs || as_ !== prev.as_)) {
            onGoal?.({
              home: parsed.homeCode,
              away: parsed.awayCode,
              homeScore: hs,
              awayScore: as_,
              clock: parsed.statusLabel,
            })
          }
          prevRef.current[evt.id] = { hs, as_ }
        }
      })
      .catch(() => {})
  }, [onGoal])

  useEffect(() => {
    check()
    const id = setInterval(check, LIVE_INTERVAL)
    return () => clearInterval(id)
  }, [check])
}

/**
 * Flat map keyed by "HOME_AWAY" for Schedule, Bracket, My Picks.
 * Includes all finished + live matches from tournament start through today.
 */
export function useAllResults() {
  const [results, setResults] = useState({})
  const [hasLive, setHasLive] = useState(false)

  const fetch_ = useCallback(() => {
    loadTournamentData()
      .then(({ results: map }) => {
        setResults(map)
        setHasLive(Object.values(map).some((r) => r.live))
      })
      .catch(() => {})
  }, [])

  useEffect(() => { fetch_() }, [fetch_])
  useEffect(() => {
    const id = setInterval(fetch_, hasLive ? LIVE_INTERVAL : IDLE_INTERVAL)
    return () => clearInterval(id)
  }, [fetch_, hasLive])

  return results
}

/** Fetches top scorers / assists — ESPN leaders endpoint, then aggregated from match summaries. */
export function useLeaders() {
  const [leaders, setLeaders] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetch_ = useCallback(() => {
    Promise.all([
      safeFetch(`${BASE}/leaders`).catch(() => ({ categories: [] })),
      loadTournamentData(),
    ])
      .then(([espnData, { leaders: computed }]) => {
        const espn = parseEspnLeaders(espnData)
        const merged = { ...computed }
        if (espn.goals?.length) merged.goals = espn.goals
        if (espn.assists?.length) merged.assists = espn.assists
        if (Object.keys(merged).length > 0) setLeaders(merged)
      })
      .catch(() => {
        if (_cache.leaders) setLeaders(_cache.leaders)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetch_() }, [fetch_])
  useEffect(() => {
    const id = setInterval(fetch_, IDLE_INTERVAL)
    return () => clearInterval(id)
  }, [fetch_])

  return { leaders, loading }
}
