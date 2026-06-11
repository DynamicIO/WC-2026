/**
 * Official FIFA World Cup 2026 knockout bracket.
 * R32 match paths sourced from FIFA.com official competition regulations.
 *
 * Bracket tree (match numbers = official FIFA numbering):
 *
 * QA ─ M73,M75 → M90 ─┐                   ┌─ M89 ← M74,M77
 *                       QF1(M97) ─ SF1(M101) ─┤
 * QB ─ M76,M78 → M91 ─┘                   └─ M92 ← M79,M80
 *                                                              FINAL(M103)
 * QC ─ M83,M84 → M93 ─┐                   ┌─ M94 ← M81,M82
 *                       QF3(M99) ─ SF2(M102) ─┤
 * QD ─ M86,M88 → M95 ─┘                   └─ M96 ← M85,M87
 */

import { useMemo, useState } from 'react'
import { Trophy, CalendarClock, ChevronDown, ChevronUp } from 'lucide-react'
import { SectionHeader, Badge } from '../ui'
import { useStandings } from '../../hooks/useFootballData'

/**
 * Build a lookup: standingsMap['A']['1st'] = { team, flag, abbr }
 *                  standingsMap['A']['2nd'] = ...
 * Used to show current group leaders in bracket slots before the knockout phase.
 */
function useStandingsMap() {
  const { groups } = useStandings()
  return useMemo(() => {
    const map = {}
    for (const g of groups) {
      const letter = g.group.replace('Group ', '')
      map[letter] = {}
      g.entries.forEach((e, i) => {
        const pos = i === 0 ? '1st' : i === 1 ? '2nd' : i === 2 ? '3rd' : '4th'
        map[letter][pos] = { team: e.team, flag: e.flag || '🏳️', abbr: e.abbr }
      })
    }
    return map
  }, [groups])
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const GROUPS = {
  A: { teams: ['Mexico 🇲🇽', 'South Africa 🇿🇦', 'South Korea 🇰🇷', 'Czechia 🇨🇿'] },
  B: { teams: ['Canada 🇨🇦', 'Bosnia 🇧🇦', 'Qatar 🇶🇦', 'Switzerland 🇨🇭'] },
  C: { teams: ['Brazil 🇧🇷', 'Morocco 🇲🇦', 'Haiti 🇭🇹', 'Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿'] },
  D: { teams: ['USA 🇺🇸', 'Paraguay 🇵🇾', 'Australia 🇦🇺', 'Türkiye 🇹🇷'] },
  E: { teams: ['Germany 🇩🇪', 'Curaçao 🇨🇼', "Côte d'Ivoire 🇨🇮", 'Ecuador 🇪🇨'] },
  F: { teams: ['Netherlands 🇳🇱', 'Japan 🇯🇵', 'Sweden 🇸🇪', 'Tunisia 🇹🇳'] },
  G: { teams: ['Belgium 🇧🇪', 'Egypt 🇪🇬', 'Iran 🇮🇷', 'New Zealand 🇳🇿'] },
  H: { teams: ['Spain 🇪🇸', 'Cape Verde 🇨🇻', 'Saudi Arabia 🇸🇦', 'Uruguay 🇺🇾'] },
  I: { teams: ['France 🇫🇷', 'Senegal 🇸🇳', 'Iraq 🇮🇶', 'Norway 🇳🇴'] },
  J: { teams: ['Argentina 🇦🇷', 'Algeria 🇩🇿', 'Austria 🇦🇹', 'Jordan 🇯🇴'] },
  K: { teams: ['Portugal 🇵🇹', 'DR Congo 🇨🇩', 'Uzbekistan 🇺🇿', 'Colombia 🇨🇴'] },
  L: { teams: ['England 🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croatia 🇭🇷', 'Ghana 🇬🇭', 'Panama 🇵🇦'] },
}

// Favourite teams in each group (group top seeds by FIFA ranking)
const GROUP_FAVE = { A:'🇲🇽', B:'🇨🇦', C:'🇧🇷', D:'🇺🇸', E:'🇩🇪', F:'🇳🇱', G:'🇧🇪', H:'🇪🇸', I:'🇫🇷', J:'🇦🇷', K:'🇵🇹', L:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' }

// All 16 R32 matches in bracket order
// Bracket quadrant assignment: A=upper-left, B=upper-right, C=lower-left, D=lower-right
const R32 = [
  // ── Quadrant A (upper-left) ─────────────────────────────────────────────────
  { id: 73, quadrant: 'A', pos: 0, date: 'Jun 28', home: { label: '2nd A', g: 'A' }, away: { label: '2nd B', g: 'B' } },
  { id: 75, quadrant: 'A', pos: 1, date: 'Jun 29', home: { label: '1st F', g: 'F' }, away: { label: '2nd C', g: 'C' } },
  { id: 74, quadrant: 'A', pos: 2, date: 'Jun 28', home: { label: '1st E', g: 'E' }, away: { label: '3rd A/B/C/D/F', g: null } },
  { id: 77, quadrant: 'A', pos: 3, date: 'Jun 30', home: { label: '1st I', g: 'I' }, away: { label: '3rd C/D/F/G/H', g: null } },
  // ── Quadrant B (upper-right) ─────────────────────────────────────────────────
  { id: 76, quadrant: 'B', pos: 0, date: 'Jun 29', home: { label: '1st C', g: 'C' }, away: { label: '2nd F', g: 'F' } },
  { id: 78, quadrant: 'B', pos: 1, date: 'Jun 30', home: { label: '2nd E', g: 'E' }, away: { label: '2nd I', g: 'I' } },
  { id: 79, quadrant: 'B', pos: 2, date: 'Jun 30', home: { label: '1st A', g: 'A' }, away: { label: '3rd C/E/F/H/I', g: null } },
  { id: 80, quadrant: 'B', pos: 3, date: 'Jul 1',  home: { label: '1st L', g: 'L' }, away: { label: '3rd E/H/I/J/K', g: null } },
  // ── Quadrant C (lower-left) ──────────────────────────────────────────────────
  { id: 83, quadrant: 'C', pos: 0, date: 'Jul 2',  home: { label: '2nd K', g: 'K' }, away: { label: '2nd L', g: 'L' } },
  { id: 84, quadrant: 'C', pos: 1, date: 'Jul 2',  home: { label: '1st H', g: 'H' }, away: { label: '2nd J', g: 'J' } },
  { id: 81, quadrant: 'C', pos: 2, date: 'Jul 1',  home: { label: '1st D', g: 'D' }, away: { label: '3rd B/E/F/I/J', g: null } },
  { id: 82, quadrant: 'C', pos: 3, date: 'Jul 1',  home: { label: '1st G', g: 'G' }, away: { label: '3rd A/E/H/I/J', g: null } },
  // ── Quadrant D (lower-right) ─────────────────────────────────────────────────
  { id: 86, quadrant: 'D', pos: 0, date: 'Jul 3',  home: { label: '1st J', g: 'J' }, away: { label: '2nd H', g: 'H' } },
  { id: 88, quadrant: 'D', pos: 1, date: 'Jul 3',  home: { label: '2nd D', g: 'D' }, away: { label: '2nd G', g: 'G' } },
  { id: 85, quadrant: 'D', pos: 2, date: 'Jul 2',  home: { label: '1st B', g: 'B' }, away: { label: '3rd E/F/G/I/J', g: null } },
  { id: 87, quadrant: 'D', pos: 3, date: 'Jul 3',  home: { label: '1st K', g: 'K' }, away: { label: '3rd D/E/I/J/L', g: null } },
]

// R16 matchup structure: which R32 matches pair up
const R16 = [
  { id: 90, quadrant: 'A', feeds: [73, 75], date: 'Jul 4–5', label: 'M90' },
  { id: 89, quadrant: 'A', feeds: [74, 77], date: 'Jul 4–5', label: 'M89' },
  { id: 91, quadrant: 'B', feeds: [76, 78], date: 'Jul 5–6', label: 'M91' },
  { id: 92, quadrant: 'B', feeds: [79, 80], date: 'Jul 5–6', label: 'M92' },
  { id: 93, quadrant: 'C', feeds: [83, 84], date: 'Jul 6–7', label: 'M93' },
  { id: 94, quadrant: 'C', feeds: [81, 82], date: 'Jul 6–7', label: 'M94' },
  { id: 95, quadrant: 'D', feeds: [86, 88], date: 'Jul 6–7', label: 'M95' },
  { id: 96, quadrant: 'D', feeds: [85, 87], date: 'Jul 6–7', label: 'M96' },
]

const QF = [
  { id: 97, side: 'upper', feedR16: [90, 89], date: 'Jul 9', label: 'QF1' },
  { id: 98, side: 'upper', feedR16: [91, 92], date: 'Jul 10', label: 'QF2' },
  { id: 99, side: 'lower', feedR16: [93, 94], date: 'Jul 9', label: 'QF3' },
  { id: 100, side: 'lower', feedR16: [95, 96], date: 'Jul 11', label: 'QF4' },
]

const SF = [
  { id: 101, feedQF: [97, 98], date: 'Jul 14', label: 'SF1' },
  { id: 102, feedQF: [99, 100], date: 'Jul 15', label: 'SF2' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function TeamSlot({ slot, winner, standingsMap }) {
  const is3rd = slot.label.startsWith('3rd')
  // Try to find current leader for this slot from live standings
  const posMatch = slot.label.match(/^(\d(?:st|nd|rd|th))\s+([A-L])$/)
  const liveTeam = posMatch && standingsMap?.[posMatch[2]]?.[posMatch[1]]
  const flag = liveTeam ? liveTeam.flag : (slot.g ? GROUP_FAVE[slot.g] : '❓')
  const abbr = liveTeam ? liveTeam.abbr : null

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1.5 border-b border-white/5 last:border-0 ${winner ? 'bg-gold/8' : ''}`}>
      <span className="text-base leading-none shrink-0 w-5 text-center">{flag}</span>
      <span className={`text-[11px] font-semibold leading-tight truncate flex-1 ${is3rd ? 'text-muted/60 italic' : winner ? 'text-gold' : 'text-ink/80'}`}>
        {abbr ? <><span className="text-muted/50 mr-1">{slot.label.split(' ')[0]}</span>{abbr}</> : slot.label}
      </span>
      {winner && <span className="text-[9px] text-gold font-bold">W</span>}
    </div>
  )
}

function MatchBox({ match, size = 'sm', round, standingsMap }) {
  const colors = {
    r32:   'border-white/8  bg-bg-card',
    r16:   'border-white/12 bg-bg-secondary',
    qf:    'border-live/20  bg-bg-secondary',
    sf:    'border-gold/25  bg-[#1A1B10]',
    final: 'border-gold/50  bg-[#1C1A0E]',
  }
  return (
    <div className={`rounded-lg border overflow-hidden ${colors[round] ?? colors.r32} ${size === 'lg' ? 'w-52' : size === 'xl' ? 'w-56' : 'w-44'}`}>
      <TeamSlot slot={match.home} standingsMap={standingsMap} />
      <TeamSlot slot={match.away} standingsMap={standingsMap} />
    </div>
  )
}

function PlaceholderBox({ label, date, round }) {
  const colors = {
    r16:   'border-white/10 bg-bg-secondary',
    qf:    'border-live/15  bg-bg-secondary',
    sf:    'border-gold/20  bg-[#1A1B10]',
    final: 'border-gold/40  bg-[#1C1A0E]',
  }
  return (
    <div className={`rounded-lg border overflow-hidden w-44 ${colors[round] ?? colors.r16}`}>
      <div className="flex items-center gap-2 px-2.5 py-1.5 border-b border-white/5">
        <span className="text-base w-5 text-center">🏳️</span>
        <span className="text-[11px] text-muted/40 italic">TBD</span>
      </div>
      <div className="flex items-center gap-2 px-2.5 py-1.5">
        <span className="text-base w-5 text-center">🏳️</span>
        <span className="text-[11px] text-muted/40 italic">TBD</span>
      </div>
      <div className="px-2.5 pb-1.5 flex items-center justify-between">
        <span className="text-[9px] text-muted/40 font-bold uppercase">{label}</span>
        <span className="text-[9px] text-muted/40">{date}</span>
      </div>
    </div>
  )
}

// ─── Quadrant rendering ───────────────────────────────────────────────────────

function QuadrantMatches({ quadrant, standingsMap }) {
  const matches = R32.filter((m) => m.quadrant === quadrant)
  return (
    <div className="flex flex-col gap-2">
      {matches.map((m) => (
        <div key={m.id} className="flex flex-col">
          <div className="mb-0.5 px-1 flex items-center gap-1.5">
            <span className="text-[9px] font-bold text-muted/50">M{m.id}</span>
            <span className="text-[9px] text-muted/40">{m.date}</span>
          </div>
          <MatchBox match={m} round="r32" standingsMap={standingsMap} />
        </div>
      ))}
    </div>
  )
}

// ─── Main bracket section ─────────────────────────────────────────────────────

export default function Bracket() {
  const [showGroups, setShowGroups] = useState(false)
  const standingsMap = useStandingsMap()

  return (
    <section id="bracket" className="mx-auto max-w-7xl px-4 rise-in">
      <SectionHeader
        kicker="Knockout Stage"
        title="Tournament Bracket"
        right={<Badge color="var(--color-muted)" bg="rgba(122,143,173,0.1)">Bracket locks Jun 27</Badge>}
      />

      {/* Round dates legend */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { round: 'R32', date: 'Jun 28 – Jul 3', color: 'text-muted' },
          { round: 'R16', date: 'Jul 4–7',        color: 'text-ink/70' },
          { round: 'QF',  date: 'Jul 9–11',       color: 'text-live/80' },
          { round: 'SF',  date: 'Jul 14–15',      color: 'text-gold/80' },
          { round: 'Final', date: 'Jul 19 · MetLife', color: 'text-gold font-bold' },
        ].map(({ round, date, color }) => (
          <div key={round} className="flex items-center gap-1.5 text-xs">
            <span className={`font-bold ${color}`}>{round}</span>
            <span className="text-muted/50">{date}</span>
            {round !== 'Final' && <span className="text-muted/20">·</span>}
          </div>
        ))}
      </div>

      {/* Mobile swipe hint */}
      <p className="md:hidden mb-2 text-center text-[11px] font-semibold uppercase tracking-widest text-muted/60">
        ← Swipe to explore the bracket →
      </p>

      {/* Full bracket — horizontally scrollable, edge-to-edge on mobile */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        <div style={{ minWidth: 860 }}>

          {/* ── UPPER HALF ─────────────────────────────────────────────── */}
          <div className="flex items-stretch gap-0">

            {/* Round labels (vertical) */}
            <div className="flex flex-col justify-around shrink-0 pr-2 border-r border-white/6" style={{ width: 36 }}>
              {['R32', 'R16', 'QF', 'SF', 'Final'].map((r) => (
                <span key={r} className="text-[10px] font-bold text-muted/40 writing-vertical" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', padding: '2px 0' }}>{r}</span>
              ))}
            </div>

            {/* Quadrant A — R32 */}
            <div className="flex flex-col justify-around px-3 py-2 shrink-0 border-r border-dashed border-white/6">
              <QuadrantMatches quadrant="A" standingsMap={standingsMap} />
            </div>

            {/* Connector A → R16 */}
            <div className="flex flex-col justify-around shrink-0 border-r border-white/6" style={{ width: 12 }}>
              {[0,1,2,3].map((i) => (
                <div key={i} className="flex-1 border-r border-white/10 relative">
                  {i % 2 === 0 && (
                    <div className="absolute right-0 top-0 bottom-0 border-r border-b border-white/10" style={{ width: 12, borderBottomRightRadius: 4 }} />
                  )}
                  {i % 2 === 1 && (
                    <div className="absolute right-0 top-0 bottom-0 border-r border-t border-white/10" style={{ width: 12, borderTopRightRadius: 4 }} />
                  )}
                </div>
              ))}
            </div>

            {/* R16 for quadrant A */}
            <div className="flex flex-col justify-around px-3 py-8 shrink-0 border-r border-dashed border-white/6 gap-8">
              {R16.filter((m) => m.quadrant === 'A').map((m) => (
                <div key={m.id} className="flex flex-col">
                  <div className="mb-0.5 px-1 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-muted/50">{m.label}</span>
                    <span className="text-[9px] text-muted/40">{m.date}</span>
                  </div>
                  <PlaceholderBox label={m.label} date={m.date} round="r16" />
                </div>
              ))}
            </div>

            {/* QF1 */}
            <div className="flex flex-col justify-around px-3 py-20 shrink-0 border-r border-dashed border-white/6">
              <div className="flex flex-col">
                <div className="mb-0.5 px-1 flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-live/50">{QF[0].label}</span>
                  <span className="text-[9px] text-muted/40">{QF[0].date}</span>
                </div>
                <PlaceholderBox label={QF[0].label} date={QF[0].date} round="qf" />
              </div>
            </div>

            {/* SF1 */}
            <div className="flex flex-col justify-center px-3 py-6 shrink-0 border-r border-dashed border-white/6">
              <div className="flex flex-col">
                <div className="mb-0.5 px-1 flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-gold/60">{SF[0].label}</span>
                  <span className="text-[9px] text-muted/40">{SF[0].date}</span>
                </div>
                <PlaceholderBox label={SF[0].label} date={SF[0].date} round="sf" />
              </div>
            </div>

            {/* FINAL (center) */}
            <div className="flex items-center px-4 shrink-0">
              <div className="flex flex-col items-center gap-3">
                <Trophy size={20} className="text-gold" />
                <div
                  className="rounded-xl border-2 border-gold/50 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#1A1608,#12192B)', boxShadow: '0 0 20px rgba(201,168,76,0.15)', width: 176 }}
                >
                  <div className="px-3 pt-2 pb-1 text-center border-b border-gold/20">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-gold/60">World Champion</div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
                    <span className="text-xl">🏆</span>
                    <span className="text-xs text-muted/40 italic">TBD · Jul 19</span>
                  </div>
                  <div className="px-3 pb-2 pt-1 text-center text-[9px] text-muted/40">MetLife Stadium, NJ</div>
                </div>
              </div>
            </div>

            {/* SF2 (right side) */}
            <div className="flex flex-col justify-center px-3 py-6 shrink-0 border-l border-dashed border-white/6">
              <div className="flex flex-col">
                <div className="mb-0.5 px-1 flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-gold/60">{SF[1].label}</span>
                  <span className="text-[9px] text-muted/40">{SF[1].date}</span>
                </div>
                <PlaceholderBox label={SF[1].label} date={SF[1].date} round="sf" />
              </div>
            </div>

            {/* QF3 */}
            <div className="flex flex-col justify-around px-3 py-20 shrink-0 border-l border-dashed border-white/6">
              <div className="flex flex-col">
                <div className="mb-0.5 px-1 flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-live/50">{QF[2].label}</span>
                  <span className="text-[9px] text-muted/40">{QF[2].date}</span>
                </div>
                <PlaceholderBox label={QF[2].label} date={QF[2].date} round="qf" />
              </div>
            </div>

            {/* R16 for quadrant C */}
            <div className="flex flex-col justify-around px-3 py-8 shrink-0 border-l border-dashed border-white/6 gap-8">
              {R16.filter((m) => m.quadrant === 'C').map((m) => (
                <div key={m.id} className="flex flex-col">
                  <div className="mb-0.5 px-1 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-muted/50">{m.label}</span>
                    <span className="text-[9px] text-muted/40">{m.date}</span>
                  </div>
                  <PlaceholderBox label={m.label} date={m.date} round="r16" />
                </div>
              ))}
            </div>

            {/* Quadrant C — R32 */}
            <div className="flex flex-col justify-around px-3 py-2 shrink-0 border-l border-dashed border-white/6">
              <QuadrantMatches quadrant="C" standingsMap={standingsMap} />
            </div>
          </div>

          {/* ── Divider ──────────────────────────────────────────────────── */}
          <div className="my-3 border-t border-dashed border-white/6" />

          {/* ── LOWER HALF ─────────────────────────────────────────────── */}
          <div className="flex items-stretch gap-0">

            {/* spacer for round labels */}
            <div style={{ width: 36 }} />

            {/* Quadrant B — R32 */}
            <div className="flex flex-col justify-around px-3 py-2 shrink-0 border-r border-dashed border-white/6">
              <QuadrantMatches quadrant="B" standingsMap={standingsMap} />
            </div>

            <div className="shrink-0 border-r border-white/6" style={{ width: 12 }} />

            {/* R16 for quadrant B */}
            <div className="flex flex-col justify-around px-3 py-8 shrink-0 border-r border-dashed border-white/6 gap-8">
              {R16.filter((m) => m.quadrant === 'B').map((m) => (
                <div key={m.id} className="flex flex-col">
                  <div className="mb-0.5 px-1 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-muted/50">{m.label}</span>
                    <span className="text-[9px] text-muted/40">{m.date}</span>
                  </div>
                  <PlaceholderBox label={m.label} date={m.date} round="r16" />
                </div>
              ))}
            </div>

            {/* QF2 */}
            <div className="flex flex-col justify-around px-3 py-20 shrink-0 border-r border-dashed border-white/6">
              <div className="flex flex-col">
                <div className="mb-0.5 px-1 flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-live/50">{QF[1].label}</span>
                  <span className="text-[9px] text-muted/40">{QF[1].date}</span>
                </div>
                <PlaceholderBox label={QF[1].label} date={QF[1].date} round="qf" />
              </div>
            </div>

            {/* SF1 placeholder (already rendered above) */}
            <div className="border-r border-dashed border-white/6" style={{ minWidth: 146 }} />

            {/* Final spacer */}
            <div style={{ minWidth: 220 }} />

            {/* SF2 spacer */}
            <div className="border-l border-dashed border-white/6" style={{ minWidth: 146 }} />

            {/* QF4 */}
            <div className="flex flex-col justify-around px-3 py-20 shrink-0 border-l border-dashed border-white/6">
              <div className="flex flex-col">
                <div className="mb-0.5 px-1 flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-live/50">{QF[3].label}</span>
                  <span className="text-[9px] text-muted/40">{QF[3].date}</span>
                </div>
                <PlaceholderBox label={QF[3].label} date={QF[3].date} round="qf" />
              </div>
            </div>

            {/* R16 for quadrant D */}
            <div className="flex flex-col justify-around px-3 py-8 shrink-0 border-l border-dashed border-white/6 gap-8">
              {R16.filter((m) => m.quadrant === 'D').map((m) => (
                <div key={m.id} className="flex flex-col">
                  <div className="mb-0.5 px-1 flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-muted/50">{m.label}</span>
                    <span className="text-[9px] text-muted/40">{m.date}</span>
                  </div>
                  <PlaceholderBox label={m.label} date={m.date} round="r16" />
                </div>
              ))}
            </div>

            {/* Quadrant D — R32 */}
            <div className="flex flex-col justify-around px-3 py-2 shrink-0 border-l border-dashed border-white/6">
              <QuadrantMatches quadrant="D" standingsMap={standingsMap} />
            </div>
          </div>

        </div>
      </div>

      {/* Group reference key */}
      <div className="mt-3">
        <button
          onClick={() => setShowGroups(!showGroups)}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-ink transition-colors"
        >
          {showGroups ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          {showGroups ? 'Hide' : 'Show'} group reference
        </button>
        {showGroups && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(GROUPS).map(([g, { teams }]) => (
              <div key={g} className="rounded-lg border border-white/8 bg-bg-card px-3 py-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-display text-sm font-bold text-gold">{g}</span>
                  <span className="text-[10px] text-muted">Group {g}</span>
                </div>
                {teams.map((t) => (
                  <div key={t} className="text-[11px] text-muted/80">{t}</div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] text-muted/50 flex items-center gap-1.5">
        <CalendarClock size={10} />
        R32 match paths sourced from official FIFA WC 2026 regulations · 3rd-place slots determined by group stage rankings (Jun 27) · 495 pre-defined scenarios per Annex C
      </p>
    </section>
  )
}
