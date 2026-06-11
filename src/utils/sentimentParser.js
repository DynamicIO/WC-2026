export const SENTIMENTS = {
  Positive: { color: 'var(--color-positive)', bg: 'rgba(34,197,94,0.12)' },
  Neutral: { color: 'var(--color-neutral-s)', bg: 'rgba(245,158,11,0.12)' },
  Negative: { color: 'var(--color-negative)', bg: 'rgba(239,68,68,0.12)' },
}

export function sentimentStyle(sentiment) {
  return SENTIMENTS[sentiment] ?? SENTIMENTS.Neutral
}

export function sentimentBreakdown(opinions) {
  const counts = { Positive: 0, Neutral: 0, Negative: 0 }
  for (const o of opinions) counts[o.sentiment] = (counts[o.sentiment] ?? 0) + 1
  const total = opinions.length || 1
  return Object.entries(counts).map(([label, count]) => ({
    label,
    count,
    pct: Math.round((count / total) * 100),
  }))
}
