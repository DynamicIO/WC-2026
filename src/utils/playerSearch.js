import { players } from '../data/mockData'

function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Resolve a free-text query like "mbappe vs vinicius" to two players. */
export function resolvePlayersFromQuery(query) {
  if (!query) return null
  const parts = normalize(query).split(/\s+(?:vs\.?|v|versus|x)\s+|,/).map((p) => p.trim()).filter(Boolean)
  if (parts.length < 2) return null
  const find = (term) =>
    players.find((p) => normalize(p.name).includes(term) || normalize(p.team).includes(term))
  const a = find(parts[0])
  const b = find(parts[1])
  return a && b && a.id !== b.id ? [a, b] : null
}
