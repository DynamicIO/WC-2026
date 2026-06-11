# WC26 Pulse — FIFA World Cup 2026 Fan Dashboard

An AI-powered, fully interactive React dashboard for the 2026 FIFA World Cup: match predictions, player comparisons, tactical breakdowns, live stats, and fan sentiment in one place.

## Run it

```bash
npm install
npm run dev
```

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Recharts (possession, radar charts)
- Embla Carousel (hero + fan opinions)
- Lucide React (icons)

## Sections

1. **Featured Match Carousel** — auto-playing hero with odds and CTAs
2. **Match Predictions Hub** — animated win-probability bars, key factors, confidence meter, AI narrative
3. **Player Comparison** — radar chart + stats table; type `Mbappé vs Vinícius` in the search bar
4. **Tactical Analysis Board** — SVG pitch, formations, toggleable pressing overlay, AI summaries
5. **Live Stats & Infographics** — possession map, shot map (xG-sized dots), pass network, leaderboards
6. **Fan Opinions** — swipeable sentiment carousel + AI Fan Pulse summary

## AI integration

All AI copy flows through `src/hooks/useClaude.js`. By default it serves realistic simulated responses so the app works offline. To wire up the real Claude API, set:

```
VITE_CLAUDE_PROXY_URL=https://your-backend/claude
```

in a `.env` file, pointing at a backend endpoint that forwards `{ type, context }` to the Anthropic Messages API (keep the API key server-side).
