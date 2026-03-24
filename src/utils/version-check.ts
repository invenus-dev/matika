declare const __BUILD_ID__: string

const POLL_INTERVAL = 60_000 // 1 minute

export function startVersionPolling(): () => void {
  const currentBuildId =
    typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : null

  if (!currentBuildId) return () => {}

  const id = setInterval(async () => {
    try {
      const res = await fetch('/version.json', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      if (data.buildId && data.buildId !== currentBuildId) {
        window.location.reload()
      }
    } catch {
      // Network error — skip this cycle
    }
  }, POLL_INTERVAL)

  return () => clearInterval(id)
}
