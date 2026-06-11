import { useCallback, useEffect, useMemo, useState } from 'react'
import Nav from './components/Nav/Nav'
import MatchCarousel from './components/MatchCarousel/MatchCarousel'
import PredictionsHub from './components/PredictionCard/PredictionsHub'
import StatsPanel from './components/StatsPanel/StatsPanel'
import TacticalBoard from './components/TacticalBoard/TacticalBoard'
import PlayerComparison from './components/PlayerComparison/PlayerComparison'
import FanOpinions from './components/FanOpinions/FanOpinions'
import Standings from './components/Standings/Standings'
import Schedule from './components/Schedule/Schedule'
import Bracket from './components/Bracket/Bracket'
import BottomNav from './components/BottomNav/BottomNav'
import MyPredictions from './components/MyPredictions/MyPredictions'
import FavoriteTeamModal, { FavTeamSection, FavTeamTrigger, useFavTeam } from './components/FavoriteTeam/FavoriteTeam'
import PwaPrompt from './components/ui/PwaPrompt'
import ErrorBoundary from './components/ui/ErrorBoundary'
import { ToastProvider, useToast } from './components/ui/Toast'
import { useGoalNotifications } from './hooks/useFootballData'
import { resolvePlayersFromQuery } from './utils/playerSearch'

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('wc26-theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('wc26-theme', theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return { theme, toggle }
}

function AppInner() {
  const [search, setSearch] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const { theme, toggle } = useTheme()
  const { addToast } = useToast()
  const [fav, setFav] = useFavTeam()
  const [favModalOpen, setFavModalOpen] = useState(false)

  const pairFromSearch = useMemo(() => resolvePlayersFromQuery(submittedQuery), [submittedQuery])

  const handleSearchSubmit = () => {
    setSubmittedQuery(search)
    if (resolvePlayersFromQuery(search)) {
      setTimeout(() => document.getElementById('compare')?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }

  // Goal notifications via ESPN polling
  const handleGoal = useCallback((evt) => {
    addToast(`⚽ GOAL! ${evt.home} ${evt.homeScore}–${evt.awayScore} ${evt.away}${evt.clock ? ` · ${evt.clock}` : ''}`, 'live')
  }, [addToast])

  useGoalNotifications(handleGoal)

  return (
    <div className="min-h-screen bg-bg-primary text-ink">
      <Nav
        searchValue={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
        theme={theme}
        onThemeToggle={toggle}
        favSlot={<FavTeamTrigger fav={fav} onOpen={() => setFavModalOpen(true)} />}
      />

      <main className="space-y-10 sm:space-y-14 pb-10 lg:pb-16 overflow-x-clip">
        {/* 1 ─ Hero: live match carousel */}
        <ErrorBoundary label="Match carousel">
          <MatchCarousel />
        </ErrorBoundary>

        {/* 2 ─ My Team (personalised — shown only when a favourite is selected) */}
        {fav && (
          <ErrorBoundary label="Favourite team">
            <FavTeamSection fav={fav} onOpen={() => setFavModalOpen(true)} />
          </ErrorBoundary>
        )}

        {/* 3 ─ Full fixture schedule (all 72 group-stage matches) */}
        <ErrorBoundary label="Full schedule">
          <Schedule favTeam={fav} />
        </ErrorBoundary>

        {/* 4 ─ Group standings (live via ESPN) */}
        <ErrorBoundary label="Group standings">
          <Standings />
        </ErrorBoundary>

        {/* 5 ─ Knockout bracket */}
        <ErrorBoundary label="Knockout bracket">
          <Bracket />
        </ErrorBoundary>

        {/* 6 ─ AI predictions + leaderboards (2-col on desktop) */}
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-2 lg:gap-6">
          <ErrorBoundary label="Match predictions">
            <PredictionsHub />
          </ErrorBoundary>
          <ErrorBoundary label="Live stats">
            <StatsPanel />
          </ErrorBoundary>
        </div>

        {/* 7 ─ My Picks tracker */}
        <ErrorBoundary label="My Picks">
          <div className="mx-auto max-w-7xl px-4">
            <MyPredictions />
          </div>
        </ErrorBoundary>

        {/* 8 ─ Tactical board (AI analysis) */}
        <ErrorBoundary label="Tactical board">
          <TacticalBoard />
        </ErrorBoundary>

        {/* 10 ─ Player comparison (AI estimates) */}
        <ErrorBoundary label="Player comparison">
          <PlayerComparison pairFromSearch={pairFromSearch} />
        </ErrorBoundary>

        {/* 11 ─ Fan opinions (AI-generated perspectives) */}
        <ErrorBoundary label="Fan opinions">
          <FanOpinions />
        </ErrorBoundary>
      </main>

      <footer className="border-t border-white/5 bg-bg-secondary pb-20 lg:pb-0">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-xs text-muted">
          <span className="font-display text-base font-bold uppercase tracking-wider text-ink">
            WC26 <span className="text-gold">Pulse</span>
          </span>
          <nav className="flex flex-wrap gap-4">
            {[
              ['top',         'Matches'],
              ['schedule',    'Schedule'],
              ['standings',   'Standings'],
              ['bracket',     'Bracket'],
              ['predictions', 'Predictions'],
              ['my-picks',    'My Picks'],
              ['stats',       'Leaderboards'],
              ['compare',     'Compare'],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="hover:text-ink transition-colors">
                {label}
              </a>
            ))}
          </nav>
          <span>
            Live data via{' '}
            <a href="https://www.espn.com/" target="_blank" rel="noopener noreferrer" className="text-live underline underline-offset-2 hover:no-underline">ESPN</a>
            {' '}· AI narratives by Claude · unofficial fan project
          </span>
        </div>
      </footer>

      {favModalOpen && (
        <FavoriteTeamModal
          fav={fav}
          onSelect={setFav}
          onClose={() => setFavModalOpen(false)}
        />
      )}

      <BottomNav />
      <PwaPrompt />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  )
}

