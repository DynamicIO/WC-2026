import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export default function PwaPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [dismissed, setDismissed] = useState(
    () => localStorage.getItem('pwa-dismissed') === '1'
  )

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    setDismissed(true)
    localStorage.setItem('pwa-dismissed', '1')
  }

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setDeferredPrompt(null)
    dismiss()
  }

  if (!deferredPrompt || dismissed) return null

  return (
    <div className="pwa-banner" role="complementary" aria-label="Install app">
      <span className="text-xl">⚽</span>
      <span className="text-ink">Install WC 2026 app</span>
      <button
        onClick={install}
        className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-xs font-bold text-bg-primary"
      >
        <Download size={12} /> Install
      </button>
      <button onClick={dismiss} className="text-muted hover:text-ink transition-colors" aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  )
}
