import { useMemo, useState } from 'react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend,
} from 'recharts'
import { Users, Swords, Info } from 'lucide-react'
import { players } from '../../data/mockData'
import { useClaudeAuto } from '../../hooks/useClaude'
import { Card, SectionHeader, Badge, AiNote } from '../ui'

const ATTR_KEYS = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defending', 'Physicality']
const STAT_KEYS = ['Goals', 'Assists', 'Key Passes', 'Dribbles Won', 'Tackles', 'Minutes']

function PlayerSelect({ value, onChange, exclude }) {
  return (
    <select
      value={value.id}
      onChange={(e) => onChange(players.find((p) => p.id === e.target.value))}
      className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm outline-none focus:border-live/50"
    >
      {players.filter((p) => p.id !== exclude.id || p.id === value.id).map((p) => (
        <option key={p.id} value={p.id} className="bg-bg-card">
          {p.flag} {p.name} — {p.team}
        </option>
      ))}
    </select>
  )
}

function PlayerHeader({ player, color }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-12 w-12 place-items-center rounded-full text-2xl" style={{ background: `${color}22`, border: `1px solid ${color}55` }}>
        {player.flag}
      </span>
      <div>
        <div className="font-display text-xl font-bold leading-tight">{player.name}</div>
        <div className="text-xs text-muted">{player.position} · {player.team} · {player.age}y</div>
      </div>
    </div>
  )
}

export default function PlayerComparison({ pairFromSearch }) {
  const [manualA, setManualA] = useState(players[0])
  const [manualB, setManualB] = useState(players[1])

  const [a, b] = pairFromSearch ?? [manualA, manualB]

  const radarData = useMemo(
    () => ATTR_KEYS.map((k) => ({ attr: k, [a.name]: a.attrs[k], [b.name]: b.attrs[k] })),
    [a, b]
  )

  const ai = useClaudeAuto(
    'comparison',
    { a: { name: a.name, position: a.position }, b: { name: b.name, position: b.position } },
    [a.id, b.id]
  )

  return (
    <section id="compare" className="mx-auto max-w-7xl px-4 rise-in">
      <SectionHeader
        kicker="Head to Head"
        title="Player Comparison"
        right={<Badge color="var(--color-live)" bg="rgba(0,217,255,0.12)"><Swords size={12} /> {a.name.split(' ').pop()} v {b.name.split(' ').pop()}</Badge>}
      />

      <Card className="p-4 sm:p-5 md:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <PlayerHeader player={a} color="#C9A84C" />
            <PlayerSelect value={a} onChange={setManualA} exclude={b} />
          </div>
          <div className="space-y-3">
            <PlayerHeader player={b} color="#00D9FF" />
            <PlayerSelect value={b} onChange={setManualB} exclude={a} />
          </div>
        </div>

        <p className="mt-3 text-[11px] text-muted flex items-center gap-1.5">
          <Users size={12} /> Tip: type a matchup like &ldquo;Mbapp&eacute; vs Vin&iacute;cius&rdquo; in the search bar above.
        </p>

        {/* Disclaimer */}
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-gold/15 bg-gold/5 px-3 py-2.5">
          <Info size={13} className="text-gold/60 mt-px shrink-0" />
          <p className="text-[11px] text-gold/70 leading-relaxed">
            Radar attributes are AI-estimated based on 2025/26 club season form — not official FIFA statistics.
            Tournament stats (goals, assists, etc.) will fill in from live data as matches are played.
          </p>
        </div>

        {/* Radar chart */}
        <div className="mt-5 h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} outerRadius="75%">
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="attr" tick={{ fill: '#7A8FAD', fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name={a.name} dataKey={a.name} stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.28} animationDuration={900} />
              <Radar name={b.name} dataKey={b.name} stroke="#00D9FF" fill="#00D9FF" fillOpacity={0.28} animationDuration={900} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Tournament stats table */}
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted">
                <th className="py-2 pr-4">Tournament stat</th>
                <th className="py-2 pr-4 text-gold">{a.name}</th>
                <th className="py-2 text-live">{b.name}</th>
              </tr>
            </thead>
            <tbody>
              {STAT_KEYS.map((k) => {
                const av = a.stats[k]
                const bv = b.stats[k]
                return (
                  <tr key={k} className="border-b border-white/5">
                    <td className="py-2 pr-4 text-muted">{k}</td>
                    <td className={`py-2 pr-4 font-display text-lg font-bold ${av > bv ? 'text-gold' : av === bv ? 'text-muted' : 'text-ink/50'}`}>{av}</td>
                    <td className={`py-2 font-display text-lg font-bold ${bv > av ? 'text-live' : bv === av ? 'text-muted' : 'text-ink/50'}`}>{bv}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="mt-1.5 text-[11px] text-muted/50">Tournament stats update live via ESPN as matches are played.</p>
        </div>

        <div className="mt-5">
          <AiNote
            label="AI tactical comparison"
            loading={ai.loading}
            error={ai.error}
            text={ai.response}
            onRetry={ai.retry}
          />
        </div>
      </Card>
    </section>
  )
}
