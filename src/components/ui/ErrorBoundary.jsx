import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * Wraps a dashboard section so a JS error in one panel doesn't
 * take down the whole page. Shows an inline error card with retry.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="rounded-xl border border-negative/25 bg-negative/8 p-6 text-center space-y-3">
        <AlertTriangle size={28} className="mx-auto text-negative/70" />
        <div>
          <p className="font-display text-lg font-bold uppercase text-ink">Something broke here</p>
          <p className="text-sm text-muted mt-1">{this.props.label ?? 'This section'} couldn't load. Everything else is fine.</p>
        </div>
        <button
          onClick={this.reset}
          className="inline-flex items-center gap-2 rounded-full bg-bg-card border border-white/10 px-4 py-2 text-sm font-semibold text-muted hover:text-ink transition-colors"
        >
          <RefreshCw size={14} /> Try again
        </button>
      </div>
    )
  }
}
