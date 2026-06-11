import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Reusable Claude API hook.
 *
 * In production, set VITE_CLAUDE_PROXY_URL to a backend endpoint that forwards
 * to the Anthropic Messages API (never call Anthropic with a key from the
 * browser). Without it, the hook serves realistic simulated responses with a
 * short "thinking" delay so the whole UX is demoable offline.
 */

const PROXY_URL = import.meta.env.VITE_CLAUDE_PROXY_URL

const SIMULATED = {
  prediction: ({ home, away }) =>
    `${home} get the nod, and it comes down to control. Their midfield three has completed more progressive passes than any unit in the tournament, and ${away}'s press loses its shape once the first line is broken — which ${home} do, on average, every 94 seconds. ${away}'s counter-threat is real and keeps this from being a lock, but with their first-choice left flank disrupted by injury, the most dangerous transition lane is closed. Expect ${home} to suffocate the game after 60 minutes and win it late, narrow and on their terms.`,
  tactics: ({ team, formation }) =>
    `${team} set up in a ${formation} that is more elastic than the team sheet suggests. In build-up, the deepest midfielder drops between the centre-backs to form a back three, freeing both full-backs to push into midfield. Out of possession they compress into a mid-block and spring a trigger press whenever the ball travels backwards — the front three arc their runs to force play down the touchline. The key threat is the half-space: the wide forwards stay high and narrow, attacking the channel between full-back and centre-back the moment the ball is won. Beat the first wave of pressure and there is space behind their advanced full-backs; fail to, and the game is played entirely in your half.`,
  comparison: ({ a, b }) =>
    `${a.name} and ${b.name} solve different problems. ${a.name} (${a.position}) is the connective player — the radar shows it in passing and dribbling, and the eye test confirms it: he receives on the half-turn in traffic and moves his team thirty yards up the pitch in two touches. ${b.name} (${b.position}) is the end product — fewer touches, far more direct, and devastating in the final 25 metres. In a possession side, ${a.name} is the higher-leverage pick; in a transition side, it's ${b.name} and it isn't close. If they meet head-to-head, the matchup to watch is ${b.name} attacking the space ${a.name}'s team leaves when they commit bodies forward.`,
  fanPulse: () =>
    `The mood across the fanbase is electric with a sharp competitive edge. Host-nation supporters are riding the wave of a home tournament, while fans of the holders and the European heavyweights are bristling at being framed as anything other than favourites. The recurring theme is respect: smaller footballing nations are done being called underdogs, and 2022's surprise packages are openly promising more. Tension is highest around the marquee matchday-one fixtures — most fans agree the draw has produced knockout-level games a full month early, and nobody is complaining.`,
}

export function useClaude() {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const requestId = useRef(0)

  const ask = useCallback(async (type, context = {}) => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    setResponse(null)
    try {
      let text
      if (PROXY_URL) {
        const res = await fetch(PROXY_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, context }),
        })
        if (!res.ok) throw new Error(`Claude proxy returned ${res.status}`)
        const data = await res.json()
        text = data.text
      } else {
        // Simulated response with a believable latency
        await new Promise((r) => setTimeout(r, 700 + Math.random() * 600))
        const fn = SIMULATED[type]
        if (!fn) throw new Error(`Unknown prompt type: ${type}`)
        text = fn(context)
      }
      if (requestId.current === id) setResponse(text)
      return text
    } catch (e) {
      if (requestId.current === id) setError(e.message)
      return null
    } finally {
      if (requestId.current === id) setLoading(false)
    }
  }, [])

  return { ask, response, loading, error }
}

/** Fire a Claude request automatically on mount / when deps change. */
export function useClaudeAuto(type, context, deps = []) {
  const { ask, response, loading, error } = useClaude()
  useEffect(() => {
    ask(type, context)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return { response, loading, error, retry: () => ask(type, context) }
}
