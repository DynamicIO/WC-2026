/**
 * ESPN public API integration — no API key required.
 * Endpoints: https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/...
 *
 * Falls back to mock data silently on any network or parse failure.
 * Auto-polls every 30 s during live matches, 5 min otherwise.
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import { featuredMatches } from '../data/mockData'

const BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world'
const LIVE_INTERVAL = 30_000
const IDLE_INTERVAL = 300_000

// ─── ESPN live-score overlay ──────────────────────────────────────────────────
// We do NOT replace the curated featuredMatches with ESPN data.
// ESPN is only used to inject live scores / status into matches we already know about.
// This keeps all editorial content (tagline, venue, stage label, flags, odds) intact.

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

/**
 * Build a lookup of { homeAbbr_awayAbbr -> liveData } from ESPN scoreboard events.
 * We match against our featuredMatches by team abbreviation.
 */
function buildLiveIndex(events) {
  const index = {}
  for (const evt of events) {
    const comp = evt.competitions?.[0]
    if (!comp) continue
    const competitors = comp.competitors ?? []
    const home = competitors.find((c) => c.homeAway === 'home')
    const away = competitors.find((c) => c.homeAway === 'away')
    if (!home || !away) continue
    const st = espnStatus(comp.status)
    const key = `${home.team?.abbreviation}_${away.team?.abbreviation}`.toUpperCase()
    index[key] = {
      live: st.live,
      finished: st.finished,
      statusLabel: st.statusLabel,
      homeScore: home.score ?? '0',
      awayScore: away.score ?? '0',
    }
  }
  return index
}

/**
 * Merge live ESPN data into our curated featuredMatches.
 * Preserves all editorial fields; only updates: live, finished, statusLabel, scores.
 */
function mergeLiveData(matches, liveIndex) {
  return matches.map((m) => {
    const key = `${m.home.code}_${m.away.code}`.toUpperCase()
    const live = liveIndex[key]
    if (!live) return m
    return {
      ...m,
      live: live.live,
      finished: live.finished,
      statusLabel: live.statusLabel,
      home: { ...m.home, score: live.homeScore },
      away: { ...m.away, score: live.awayScore },
    }
  })
}

function transformStandings(data) {
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

// ─── Fetch helpers ────────────────────────────────────────────────────────────

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

// ─── Hooks ───────────────────────────────────────────────────────────────────

/** Returns live scoreboard events, polling automatically. */
export function useScoreboard() {
  const [matches, setMatches] = useState(null)
  const [loading, setLoading] = useState(true)
  const [live, setLive] = useState(false)

  const fetch_ = useCallback(() => {
    safeFetch(`${BASE}/scoreboard`)
      .then((data) => {
        const liveIndex = buildLiveIndex(data.events ?? [])
        const merged = mergeLiveData(featuredMatches, liveIndex)
        const hasLive = merged.some((m) => m.live)
        setMatches(merged)
        setLive(hasLive)
      })
      .catch(() => {
        // ESPN unreachable — use curated matches as-is
        setMatches(featuredMatches)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetch_() }, [fetch_])

  // Poll
  useEffect(() => {
    const interval = live ? LIVE_INTERVAL : IDLE_INTERVAL
    const id = setInterval(fetch_, interval)
    return () => clearInterval(id)
  }, [fetch_, live])

  return { matches: matches ?? featuredMatches, loading: loading && !matches, live, refetch: fetch_ }
}

/** Returns group standings. */
export function useStandings() {
  const [groups, setGroups] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    safeFetch(`${BASE}/standings`)
      .then((data) => {
        if (cancelled) return
        const g = transformStandings(data)
        if (g.length > 0) setGroups(g)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { groups: groups ?? MOCK_GROUPS, loading }
}

/** Returns the live ticker string (e.g. "ESP 2–1 BRA · 67′"). */
export function useLiveTicker() {
  const { matches, live } = useScoreboard()
  if (!live) return null
  const liveMatches = matches.filter((m) => m.live)
  if (!liveMatches.length) return null
  return liveMatches.map((m) => `${m.home.code} ${m.home.score}–${m.away.score} ${m.away.code} · ${m.statusLabel}`).join('  ·  ')
}

/**
 * Polls scoreboard and fires onGoal(matchSummary) whenever a score changes.
 * Used for in-app toast notifications.
 */
export function useGoalNotifications(onGoal) {
  const prevRef = useRef({})

  const check = useCallback(() => {
    safeFetch(`${BASE}/scoreboard`)
      .then((data) => {
        for (const evt of data.events ?? []) {
          const comp = evt.competitions?.[0]
          if (!comp) continue
          const home = comp.competitors?.find((c) => c.homeAway === 'home')
          const away = comp.competitors?.find((c) => c.homeAway === 'away')
          if (!home || !away) continue
          const st = espnStatus(comp.status)
          if (!st.live) continue
          const key = evt.id
          const hs = parseInt(home.score) || 0
          const as_ = parseInt(away.score) || 0
          const prev = prevRef.current[key]
          if (prev && (hs !== prev.hs || as_ !== prev.as_)) {
            onGoal?.({
              home: home.team?.abbreviation,
              away: away.team?.abbreviation,
              homeScore: hs,
              awayScore: as_,
              clock: comp.status?.displayClock ?? '',
            })
          }
          prevRef.current[key] = { hs, as_ }
        }
      })
      .catch(() => {})
  }, [onGoal])

  useEffect(() => {
    const id = setInterval(check, LIVE_INTERVAL)
    return () => clearInterval(id)
  }, [check])
}

/**
 * Fetches all scoreboard events and returns a flat map keyed by "HOME_AWAY".
 * Used by Schedule and Bracket to overlay live / finished scores.
 * Polls every 30 s when any game is live, otherwise every 5 min.
 */
export function useAllResults() {
  const [results, setResults] = useState({})
  const [hasLive, setHasLive] = useState(false)

  const fetch_ = useCallback(() => {
    safeFetch(`${BASE}/scoreboard`)
      .then((data) => {
        const map = {}
        let live = false
        for (const evt of data.events ?? []) {
          const comp = evt.competitions?.[0]
          if (!comp) continue
          const competitors = comp.competitors ?? []
          const home = competitors.find((c) => c.homeAway === 'home')
          const away = competitors.find((c) => c.homeAway === 'away')
          if (!home || !away) continue
          const st = espnStatus(comp.status)
          if (st.live) live = true
          const key = `${home.team?.abbreviation}_${away.team?.abbreviation}`.toUpperCase()
          map[key] = {
            live: st.live,
            finished: st.finished,
            statusLabel: st.statusLabel,
            homeScore: home.score ?? null,
            awayScore: away.score ?? null,
          }
        }
        setResults(map)
        setHasLive(live)
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

/** Fetches top scorers / assists from ESPN leaders endpoint. Falls back to empty. */
export function useLeaders() {
  const [leaders, setLeaders] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    safeFetch(`${BASE}/leaders`)
      .then((data) => {
        if (cancelled) return
        // ESPN leaders shape: data.categories[].leaders[].athlete + statistics
        const cats = data.categories ?? []
        const parsed = {}
        for (const cat of cats) {
          const key = cat.name // e.g. 'goals', 'assists'
          parsed[key] = (cat.leaders ?? []).slice(0, 5).map((l) => ({
            name: l.athlete?.displayName ?? '—',
            team: l.athlete?.team?.abbreviation ?? '—',
            flag: '',
            value: l.value ?? 0,
          }))
        }
        if (Object.keys(parsed).length > 0) setLeaders(parsed)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { leaders, loading }
}

// ─── Mock standings fallback ──────────────────────────────────────────────────
// Official groups from the FIFA World Cup 2026 Final Draw (December 5, 2025).
// All stats reset to 0 — tournament begins June 11, 2026.
// ESPN API will provide live standings; this is shown only if the API is unreachable.

const zeroed = { P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0 }

const MOCK_GROUPS = [
  {
    group: 'Group A',
    entries: [
      { team: 'Mexico', abbr: 'MEX', flag: '🇲🇽', stats: { ...zeroed } },
      { team: 'South Africa', abbr: 'RSA', flag: '🇿🇦', stats: { ...zeroed } },
      { team: 'Korea Republic', abbr: 'KOR', flag: '🇰🇷', stats: { ...zeroed } },
      { team: 'Czechia', abbr: 'CZE', flag: '🇨🇿', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group B',
    entries: [
      { team: 'Canada', abbr: 'CAN', flag: '🇨🇦', stats: { ...zeroed } },
      { team: 'Bosnia & Herzegovina', abbr: 'BIH', flag: '🇧🇦', stats: { ...zeroed } },
      { team: 'Qatar', abbr: 'QAT', flag: '🇶🇦', stats: { ...zeroed } },
      { team: 'Switzerland', abbr: 'SUI', flag: '🇨🇭', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group C',
    entries: [
      { team: 'Brazil', abbr: 'BRA', flag: '🇧🇷', stats: { ...zeroed } },
      { team: 'Morocco', abbr: 'MAR', flag: '🇲🇦', stats: { ...zeroed } },
      { team: 'Haiti', abbr: 'HAI', flag: '🇭🇹', stats: { ...zeroed } },
      { team: 'Scotland', abbr: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group D',
    entries: [
      { team: 'United States', abbr: 'USA', flag: '🇺🇸', stats: { ...zeroed } },
      { team: 'Paraguay', abbr: 'PAR', flag: '🇵🇾', stats: { ...zeroed } },
      { team: 'Australia', abbr: 'AUS', flag: '🇦🇺', stats: { ...zeroed } },
      { team: 'Türkiye', abbr: 'TUR', flag: '🇹🇷', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group E',
    entries: [
      { team: 'Germany', abbr: 'GER', flag: '🇩🇪', stats: { ...zeroed } },
      { team: 'Curaçao', abbr: 'CUW', flag: '🇨🇼', stats: { ...zeroed } },
      { team: "Côte d'Ivoire", abbr: 'CIV', flag: '🇨🇮', stats: { ...zeroed } },
      { team: 'Ecuador', abbr: 'ECU', flag: '🇪🇨', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group F',
    entries: [
      { team: 'Netherlands', abbr: 'NED', flag: '🇳🇱', stats: { ...zeroed } },
      { team: 'Japan', abbr: 'JPN', flag: '🇯🇵', stats: { ...zeroed } },
      { team: 'Sweden', abbr: 'SWE', flag: '🇸🇪', stats: { ...zeroed } },
      { team: 'Tunisia', abbr: 'TUN', flag: '🇹🇳', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group G',
    entries: [
      { team: 'Belgium', abbr: 'BEL', flag: '🇧🇪', stats: { ...zeroed } },
      { team: 'Egypt', abbr: 'EGY', flag: '🇪🇬', stats: { ...zeroed } },
      { team: 'Iran', abbr: 'IRN', flag: '🇮🇷', stats: { ...zeroed } },
      { team: 'New Zealand', abbr: 'NZL', flag: '🇳🇿', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group H',
    entries: [
      { team: 'Spain', abbr: 'ESP', flag: '🇪🇸', stats: { ...zeroed } },
      { team: 'Cape Verde', abbr: 'CPV', flag: '🇨🇻', stats: { ...zeroed } },
      { team: 'Saudi Arabia', abbr: 'KSA', flag: '🇸🇦', stats: { ...zeroed } },
      { team: 'Uruguay', abbr: 'URU', flag: '🇺🇾', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group I',
    entries: [
      { team: 'France', abbr: 'FRA', flag: '🇫🇷', stats: { ...zeroed } },
      { team: 'Senegal', abbr: 'SEN', flag: '🇸🇳', stats: { ...zeroed } },
      { team: 'Iraq', abbr: 'IRQ', flag: '🇮🇶', stats: { ...zeroed } },
      { team: 'Norway', abbr: 'NOR', flag: '🇳🇴', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group J',
    entries: [
      { team: 'Argentina', abbr: 'ARG', flag: '🇦🇷', stats: { ...zeroed } },
      { team: 'Algeria', abbr: 'ALG', flag: '🇩🇿', stats: { ...zeroed } },
      { team: 'Austria', abbr: 'AUT', flag: '🇦🇹', stats: { ...zeroed } },
      { team: 'Jordan', abbr: 'JOR', flag: '🇯🇴', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group K',
    entries: [
      { team: 'Portugal', abbr: 'POR', flag: '🇵🇹', stats: { ...zeroed } },
      { team: 'DR Congo', abbr: 'COD', flag: '🇨🇩', stats: { ...zeroed } },
      { team: 'Uzbekistan', abbr: 'UZB', flag: '🇺🇿', stats: { ...zeroed } },
      { team: 'Colombia', abbr: 'COL', flag: '🇨🇴', stats: { ...zeroed } },
    ],
  },
  {
    group: 'Group L',
    entries: [
      { team: 'England', abbr: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stats: { ...zeroed } },
      { team: 'Croatia', abbr: 'CRO', flag: '🇭🇷', stats: { ...zeroed } },
      { team: 'Ghana', abbr: 'GHA', flag: '🇬🇭', stats: { ...zeroed } },
      { team: 'Panama', abbr: 'PAN', flag: '🇵🇦', stats: { ...zeroed } },
    ],
  },
]
