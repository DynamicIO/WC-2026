import { useEffect, useState } from 'react'
import { CalendarDays, BarChart2, Trophy, Star, Brain } from 'lucide-react'

const ITEMS = [
  { icon: CalendarDays, label: 'Schedule',   href: '#schedule'    },
  { icon: BarChart2,   label: 'Standings',  href: '#standings'   },
  { icon: Trophy,      label: 'Bracket',    href: '#bracket'     },
  { icon: Star,        label: 'My Picks',   href: '#my-picks'    },
  { icon: Brain,       label: 'Predict',    href: '#predictions' },
]

export default function BottomNav() {
  const [active, setActive] = useState('')

  // Highlight the nav item whose section is currently in view
  useEffect(() => {
    const ids = ITEMS.map((i) => i.href.slice(1))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-bg-secondary/95 backdrop-blur-md safe-area-pb"
      aria-label="Mobile navigation"
    >
      <div className="flex">
        {ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = active === href
          return (
            <a
              key={href}
              href={href}
              onClick={() => setActive(href)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2.5 transition-colors ${
                isActive ? 'text-gold' : 'text-muted hover:text-ink'
              }`}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? 'text-gold' : ''}`}>
                {label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
