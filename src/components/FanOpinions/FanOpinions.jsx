import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react'
import { fanOpinions } from '../../data/mockData'
import { sentimentStyle, sentimentBreakdown } from '../../utils/sentimentParser'
import { useClaudeAuto } from '../../hooks/useClaude'
import { Card, SectionHeader, Badge, AiNote } from '../ui'

function OpinionCard({ opinion }) {
  const s = sentimentStyle(opinion.sentiment)
  return (
    <div className="shrink-0 grow-0 basis-[85%] sm:basis-[46%] lg:basis-[31%] min-w-0 pl-4">
      <Card lift className="h-full p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{opinion.flag}</span>
            <span className="text-sm font-semibold text-ink/90">{opinion.user}</span>
          </div>
          <Badge color={s.color} bg={s.bg}>{opinion.sentiment}</Badge>
        </div>
        <MessageSquareQuote size={18} className="text-gold/60" />
        <p className="text-sm leading-relaxed text-ink/85">{opinion.quote}</p>
      </Card>
    </div>
  )
}

function PulseBar() {
  const rows = sentimentBreakdown(fanOpinions)
  return (
    <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-black/40">
      {rows.map((r) => (
        <div
          key={r.label}
          className="prob-bar h-full"
          style={{ width: `${r.pct}%`, background: sentimentStyle(r.label).color }}
          title={`${r.label}: ${r.pct}%`}
        />
      ))}
    </div>
  )
}

export default function FanOpinions() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', dragFree: true })
  const ai = useClaudeAuto('fanPulse', { opinions: fanOpinions.map((o) => o.quote) }, [])
  const rows = sentimentBreakdown(fanOpinions)

  return (
    <section id="fans" className="mx-auto max-w-7xl px-4 rise-in">
      <SectionHeader
        kicker="AI Fan Perspectives"
        title="Fan Pulse"
        right={
          <div className="hidden sm:flex gap-2">
            <button onClick={() => emblaApi?.scrollPrev()} aria-label="Scroll back" className="grid h-9 w-9 place-items-center rounded-full bg-bg-card border border-white/10 text-muted hover:text-ink transition-colors">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => emblaApi?.scrollNext()} aria-label="Scroll forward" className="grid h-9 w-9 place-items-center rounded-full bg-bg-card border border-white/10 text-muted hover:text-ink transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        }
      />

      <p className="mb-4 text-xs text-muted/60">
        AI-generated fan perspectives reflecting real tournament storylines and matchups.
      </p>

      <div className="overflow-hidden -ml-4" ref={emblaRef}>
        <div className="flex">
          {fanOpinions.map((o) => (
            <OpinionCard key={o.id} opinion={o} />
          ))}
        </div>
      </div>

      <Card className="mt-5 p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-xl font-bold uppercase tracking-wide">Fan Pulse</h3>
          <div className="flex gap-3 text-xs text-muted">
            {rows.map((r) => (
              <span key={r.label} className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: sentimentStyle(r.label).color }} />
                {r.label} {r.pct}%
              </span>
            ))}
          </div>
        </div>
        <PulseBar />
        <div className="mt-4">
          <AiNote
            label="Pulse summary"
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
