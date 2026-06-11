import { useEffect, useRef, useState } from 'react'
import { Menu, Search, Trophy, X, Sun, Moon } from 'lucide-react'
import { useLiveTicker } from '../../hooks/useFootballData'

const LINKS = [
  ['Schedule',    '#schedule'],
  ['Standings',   '#standings'],
  ['Bracket',     '#bracket'],
  ['Predictions', '#predictions'],
  ['My Picks',    '#my-picks'],
  ['Compare',     '#compare'],
]

export default function Nav({ searchValue, onSearchChange, onSearchSubmit, theme, onThemeToggle, favSlot }) {
  const [open, setOpen] = useState(false)
  const ticker = useLiveTicker()
  const inputRef = useRef(null)

  const submit = (e) => {
    e.preventDefault()
    onSearchSubmit?.()
    setOpen(false)
  }

  // Keyboard shortcut: / focuses search
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isLight = theme === 'light'

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-bg-primary/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 shrink-0" aria-label="WC26 Pulse home">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-gold/15 text-gold" aria-hidden="true">
            <Trophy size={18} />
          </span>
          <span className="font-display text-2xl font-bold uppercase tracking-wider leading-none">
            WC26 <span className="text-gold">Pulse</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 ml-6" aria-label="Main navigation">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="text-sm font-medium text-muted hover:text-ink transition-colors focus-visible:rounded">
              {label}
            </a>
          ))}
        </nav>

        {/* Search */}
        <form
          onSubmit={submit}
          role="search"
          className="ml-auto hidden md:flex items-center gap-2 rounded-full bg-bg-card border border-white/10 px-3.5 py-1.5 w-72 focus-within:border-live/50 transition-colors"
        >
          <Search size={15} className="text-muted shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={'Compare players \u2014 try \u201cMbapp\u00e9 vs Vin\u00edcius\u201d'}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
            aria-label="Player comparison search"
          />
          <kbd className="hidden xl:inline text-[10px] text-muted/50 border border-white/10 rounded px-1">/</kbd>
        </form>

        {/* Live ticker */}
        <a
          href="#top"
          aria-label={ticker ? `Live match: ${ticker}` : 'No live matches'}
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 shrink-0 transition-colors ${
            ticker ? 'bg-live/10 border border-live/30' : 'bg-bg-card border border-white/10'
          }`}
        >
          <span className={`h-2 w-2 rounded-full shrink-0 ${ticker ? 'bg-live live-dot' : 'bg-muted/40'}`} aria-hidden="true" />
          <span className={`text-xs font-bold whitespace-nowrap ${ticker ? 'text-live' : 'text-muted'}`}>
            {ticker ? `LIVE · ${ticker}` : 'No live matches'}
          </span>
        </a>

        {/* Favourite team trigger */}
        {favSlot}

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
          className="grid h-9 w-9 place-items-center rounded-lg bg-bg-card border border-white/10 text-muted hover:text-ink transition-colors shrink-0"
        >
          {isLight ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden grid h-9 w-9 place-items-center rounded-lg bg-bg-card border border-white/10 text-ink shrink-0"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div id="mobile-nav" className="lg:hidden border-t border-white/5 bg-bg-secondary px-4 py-4 space-y-3">
          <form onSubmit={submit} role="search" className="flex items-center gap-2 rounded-full bg-bg-card border border-white/10 px-3.5 py-2">
            <Search size={15} className="text-muted shrink-0" aria-hidden="true" />
            <input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Compare players…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted/70"
              aria-label="Player comparison search"
            />
          </form>
          {favSlot && <div>{favSlot}</div>}
          <nav aria-label="Mobile navigation">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-muted hover:text-ink">
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
