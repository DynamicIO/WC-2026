import { Sparkles, AlertTriangle, InboxIcon } from 'lucide-react'

export function Card({ children, className = '', lift = false }) {
  return (
    <div
      className={`bg-bg-card rounded-[var(--radius-card)] border border-white/5 ${lift ? 'lift' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function Badge({ children, color = 'var(--color-gold)', bg = 'rgba(201,168,76,0.12)', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${className}`}
      style={{ color, background: bg }}
    >
      {children}
    </span>
  )
}

export function SectionHeader({ kicker, title, right }) {
  return (
    <div className="flex items-end justify-between gap-4 mb-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{kicker}</p>
        <h2 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-wide leading-none mt-1">
          {title}
        </h2>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}

export function Spinner({ label = 'Thinking…' }) {
  return (
    <div className="flex items-center gap-2 text-muted text-sm">
      <span className="h-4 w-4 rounded-full border-2 border-muted/40 border-t-live animate-spin" aria-hidden="true" />
      <span role="status">{label}</span>
    </div>
  )
}

export function AiNote({ loading, error, text, onRetry, label = 'AI breakdown' }) {
  return (
    <div className="rounded-lg border border-live/15 bg-live/5 p-3.5" role="region" aria-label={label}>
      <div className="flex items-center gap-1.5 text-live text-xs font-semibold uppercase tracking-wider mb-2" aria-hidden="true">
        <Sparkles size={13} />
        {label}
      </div>
      {loading && <Spinner label="Generating analysis…" />}
      {error && !loading && (
        <div className="flex items-start gap-2 text-sm text-muted">
          <AlertTriangle size={14} className="mt-0.5 text-negative/60 shrink-0" aria-hidden="true" />
          <span>
            The AI is mid-substitution.{' '}
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-live underline underline-offset-2 hover:no-underline"
                aria-label={`Retry ${label}`}
              >
                Run it back
              </button>
            )}
          </span>
        </div>
      )}
      {!loading && !error && text && <p className="text-sm leading-relaxed text-ink/90">{text}</p>}
    </div>
  )
}

/** Empty state for sections with no data */
export function EmptyState({ title = 'Nothing here yet', description = 'Data will appear once the tournament kicks off.' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/8 bg-bg-card py-12 text-center px-6">
      <InboxIcon size={28} className="text-muted/40" aria-hidden="true" />
      <div>
        <p className="font-display text-lg font-bold uppercase text-muted">{title}</p>
        <p className="text-sm text-muted/60 mt-1">{description}</p>
      </div>
    </div>
  )
}

/** Custom Recharts tooltip matching the dark design */
export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-bg-card shadow-2xl px-3.5 py-3 text-sm min-w-[120px]">
      {label && <p className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-2">{label}</p>}
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ background: p.color }} />
            <span className="text-muted">{p.name ?? p.dataKey}</span>
          </div>
          <span className="font-display text-base font-bold" style={{ color: p.color }}>
            {typeof p.value === 'number' && p.value % 1 === 0 ? p.value : p.value?.toFixed?.(1) ?? p.value}
            {p.unit ?? ''}
          </span>
        </div>
      ))}
    </div>
  )
}
