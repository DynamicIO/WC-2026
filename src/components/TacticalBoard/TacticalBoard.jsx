import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { tacticalTeams } from '../../data/mockData'
import { useClaudeAuto } from '../../hooks/useClaude'
import { Card, SectionHeader, Badge, AiNote } from '../ui'

function Pitch({ team, showPress }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full rounded-xl bg-[#0E2818]" style={{ aspectRatio: '1.45' }} preserveAspectRatio="none">
      {/* pitch markings */}
      <rect x="1" y="1" width="98" height="98" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.45" />
      <line x1="50" y1="1" x2="50" y2="99" stroke="rgba(255,255,255,0.3)" strokeWidth="0.45" />
      <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.45" />
      <circle cx="50" cy="50" r="0.8" fill="rgba(255,255,255,0.4)" />
      {/* penalty boxes */}
      <rect x="1" y="26" width="13" height="48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.45" />
      <rect x="1" y="38" width="5" height="24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.45" />
      <rect x="86" y="26" width="13" height="48" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.45" />
      <rect x="94" y="38" width="5" height="24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.45" />
      {/* stripes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={i * 20 + 1} y="1" width="10" height="98" fill="rgba(255,255,255,0.025)" />
      ))}

      {/* pressing pattern overlay */}
      {showPress && (
        <g>
          <defs>
            <marker id={`arrow-${team.id}`} viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 6 3 L 0 6 z" fill="#00D9FF" />
            </marker>
          </defs>
          {team.pressing.map((p, i) => (
            <line
              key={i}
              x1={p.fromX} y1={p.fromY} x2={p.toX} y2={p.toY}
              stroke="#00D9FF" strokeWidth="0.8" strokeDasharray="2 1.4"
              strokeOpacity="0.85"
              markerEnd={`url(#arrow-${team.id})`}
            />
          ))}
        </g>
      )}

      {/* players */}
      {team.players.map((p) => (
        <g key={p.n}>
          <circle cx={p.x} cy={p.y} r="3.4" fill={team.color} stroke="#0D1117" strokeWidth="0.6" />
          <text x={p.x} y={p.y + 1.1} textAnchor="middle" fontSize="3" fontWeight="800" fill="#0D1117">{p.n}</text>
          <text x={p.x} y={p.y + 6.4} textAnchor="middle" fontSize="2.3" fontWeight="600" fill="rgba(240,244,255,0.75)">{p.role}</text>
        </g>
      ))}
    </svg>
  )
}

function TeamBoard({ team }) {
  const [showPress, setShowPress] = useState(false)
  const ai = useClaudeAuto('tactics', { team: team.name, formation: team.formation }, [team.id])

  return (
    <Card lift className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{team.flag}</span>
          <h3 className="font-display text-2xl font-bold uppercase">{team.name}</h3>
          <Badge>{team.formation}</Badge>
        </div>
        <button
          onClick={() => setShowPress(!showPress)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            showPress ? 'bg-live/15 text-live border border-live/40' : 'bg-black/30 text-muted border border-white/10 hover:text-ink'
          }`}
        >
          {showPress ? <Eye size={13} /> : <EyeOff size={13} />}
          Pressing pattern
        </button>
      </div>

      <Pitch team={team} showPress={showPress} />

      <AiNote
        label="Tactical summary"
        loading={ai.loading}
        error={ai.error}
        text={ai.response}
        onRetry={ai.retry}
      />
    </Card>
  )
}

export default function TacticalBoard() {
  return (
    <section id="tactics" className="mx-auto max-w-7xl px-4 rise-in">
      <SectionHeader kicker="AI Tactical Analysis" title="Tactical Board" />
      <div className="grid gap-5 lg:grid-cols-2">
        {tacticalTeams.map((t) => (
          <TeamBoard key={t.id} team={t} />
        ))}
      </div>
    </section>
  )
}
