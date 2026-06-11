import { useState } from 'react'
import { MapPin, X } from 'lucide-react'
import { Card, SectionHeader } from '../ui'

// Host cities with approximate SVG coordinates on a 600×380 canvas
// Origin mapped to roughly Lat 15°N–55°N, Lon 140°W–60°W
const scale = (lon, lat) => ({
  x: Math.round(((lon - (-140)) / 80) * 600),
  y: Math.round(((55 - lat) / 40) * 380),
})

const VENUES = [
  { id: 'mex-city',   country: 'MEX', city: 'Mexico City',        name: 'Mexico City Stadium (Estadio Azteca)',      matches: 6,  ...scale(-99.1,  19.4) },
  { id: 'guadalajara',country: 'MEX', city: 'Guadalajara',         name: 'Estadio Guadalajara (Estadio Akron)',        matches: 6,  ...scale(-103.3, 20.7) },
  { id: 'monterrey',  country: 'MEX', city: 'Monterrey',           name: 'Estadio Monterrey (Estadio BBVA)',           matches: 6,  ...scale(-100.3, 25.7) },
  { id: 'la',         country: 'USA', city: 'Los Angeles',         name: 'Los Angeles Stadium (SoFi Stadium)',         matches: 8,  ...scale(-118.2, 34.0) },
  { id: 'sf',         country: 'USA', city: 'San Francisco',       name: 'San Francisco Bay Area Stadium (Levi\'s)',   matches: 6,  ...scale(-122.4, 37.8) },
  { id: 'seattle',    country: 'USA', city: 'Seattle',             name: 'Seattle Stadium (Lumen Field)',              matches: 6,  ...scale(-122.3, 47.6) },
  { id: 'dallas',     country: 'USA', city: 'Dallas',              name: 'Dallas Stadium (AT&T Stadium)',              matches: 8,  ...scale(-96.8,  32.8) },
  { id: 'houston',    country: 'USA', city: 'Houston',             name: 'Houston Stadium (NRG Stadium)',              matches: 7,  ...scale(-95.4,  29.8) },
  { id: 'kc',         country: 'USA', city: 'Kansas City',         name: 'Kansas City Stadium (Arrowhead)',            matches: 6,  ...scale(-94.6,  39.1) },
  { id: 'atlanta',    country: 'USA', city: 'Atlanta',             name: 'Atlanta Stadium (Mercedes-Benz)',            matches: 6,  ...scale(-84.4,  33.7) },
  { id: 'miami',      country: 'USA', city: 'Miami',               name: 'Miami Stadium (Hard Rock Stadium)',          matches: 7,  ...scale(-80.2,  25.8) },
  { id: 'philly',     country: 'USA', city: 'Philadelphia',        name: 'Philadelphia Stadium (Lincoln Financial)',   matches: 6,  ...scale(-75.2,  40.0) },
  { id: 'boston',     country: 'USA', city: 'Boston',              name: 'Boston Stadium (Gillette Stadium)',          matches: 6,  ...scale(-71.1,  42.4) },
  { id: 'nynj',       country: 'USA', city: 'New York / New Jersey', name: 'New York NJ Stadium (MetLife Stadium)',    matches: 8,  ...scale(-74.0,  40.7) },
  { id: 'toronto',    country: 'CAN', city: 'Toronto',             name: 'Toronto Stadium (BMO Field)',                matches: 7,  ...scale(-79.4,  43.7) },
  { id: 'vancouver',  country: 'CAN', city: 'Vancouver',           name: 'BC Place, Vancouver',                        matches: 6,  ...scale(-123.1, 49.3) },
]

const COUNTRY_COLOR = { MEX: '#EF4444', USA: '#3B82F6', CAN: '#F59E0B' }
const COUNTRY_LABEL = { MEX: '🇲🇽 Mexico', USA: '🇺🇸 United States', CAN: '🇨🇦 Canada' }

export default function StadiumMap() {
  const [hovered, setHovered] = useState(null)
  const active = VENUES.find((v) => v.id === hovered)

  return (
    <section id="venues" className="rise-in">
      <SectionHeader
        kicker="Host Nations"
        title="Venue Map"
        description="16 stadiums across Mexico, the United States and Canada."
      />

      <Card className="overflow-hidden">
        <div className="relative">
          {/* SVG map */}
          <svg
            viewBox="0 0 600 380"
            className="w-full"
            style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d1f1a 100%)' }}
          >
            {/* Grid lines for reference */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={`v${i}`} x1={i * 120} y1="0" x2={i * 120} y2="380" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <line key={`h${i}`} x1="0" y1={i * 95} x2="600" y2={i * 95} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            ))}

            {/* Country label regions */}
            <text x="100" y="355" fontSize="9" fill="rgba(255,255,255,0.2)" fontWeight="600" textAnchor="middle">PACIFIC OCEAN</text>
            <text x="510" y="355" fontSize="9" fill="rgba(255,255,255,0.2)" fontWeight="600" textAnchor="middle">ATLANTIC OCEAN</text>

            {/* Venue dots */}
            {VENUES.map((v) => {
              const color = COUNTRY_COLOR[v.country]
              const isActive = hovered === v.id
              const r = isActive ? 9 : v.matches >= 8 ? 7 : 5.5
              return (
                <g
                  key={v.id}
                  onMouseEnter={() => setHovered(v.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setHovered(hovered === v.id ? null : v.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Pulse ring on hover */}
                  {isActive && (
                    <circle cx={v.x} cy={v.y} r={r + 7} fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
                  )}
                  <circle
                    cx={v.x} cy={v.y} r={r}
                    fill={color}
                    fillOpacity={isActive ? 1 : 0.75}
                    stroke="#0d1117"
                    strokeWidth="1.5"
                  />
                  {/* City label */}
                  <text
                    x={v.x}
                    y={v.y - r - 4}
                    textAnchor="middle"
                    fontSize={isActive ? "8.5" : "7"}
                    fontWeight={isActive ? "700" : "500"}
                    fill={isActive ? color : 'rgba(255,255,255,0.55)'}
                  >
                    {v.city}
                  </text>
                </g>
              )
            })}
          </svg>

          {/* Tooltip panel */}
          {active && (
            <div className="absolute top-3 right-3 w-60 rounded-xl bg-bg-secondary/95 border border-white/15 backdrop-blur p-4 shadow-2xl">
              <button
                onClick={() => setHovered(null)}
                className="absolute top-2 right-2 text-muted hover:text-ink"
                aria-label="Close"
              >
                <X size={14} />
              </button>
              <div
                className="text-[10px] font-bold uppercase tracking-widest mb-1"
                style={{ color: COUNTRY_COLOR[active.country] }}
              >
                {COUNTRY_LABEL[active.country]}
              </div>
              <div className="font-display font-bold text-base leading-tight mb-1">{active.city}</div>
              <div className="text-xs text-muted mb-2 leading-snug">{active.name}</div>
              <div className="flex items-center gap-1.5 text-xs text-ink/70">
                <MapPin size={11} style={{ color: COUNTRY_COLOR[active.country] }} />
                <span>{active.matches} matches scheduled</span>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 px-5 py-3 border-t border-white/5 text-xs text-muted">
          {Object.entries(COUNTRY_LABEL).map(([code, label]) => (
            <div key={code} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COUNTRY_COLOR[code] }} />
              <span>{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="h-3 w-3 rounded-full bg-white/30" />
            <span>Larger dot = more matches</span>
          </div>
        </div>
      </Card>
    </section>
  )
}
