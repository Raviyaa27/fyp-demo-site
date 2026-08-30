import { useEffect, useState } from 'react'

export type PageId =
  | 'overview'
  | 'architecture'
  | 'knowledge'
  | 'detection'
  | 'mitigation'
  | 'mcp'
  | 'sharing'
  | 'data'
  | 'results'
  | 'future'

export const PAGES: { id: PageId; label: string; title: string }[] = [
  { id: 'overview', label: 'Overview', title: 'Project Overview' },
  { id: 'architecture', label: 'Architecture', title: 'System Architecture' },
  { id: 'knowledge', label: 'Knowledge', title: 'CTI Knowledge Pipeline' },
  { id: 'detection', label: 'Detection', title: 'Anomaly Detection Gateway' },
  { id: 'mitigation', label: 'Mitigation', title: 'Guarded Automated Mitigation' },
  { id: 'mcp', label: 'MCP', title: 'MCP Intelligence Sharing' },
  { id: 'sharing', label: 'Sharing', title: 'Inter-Platform Threat Sharing' },
  { id: 'data', label: 'Dashboard', title: 'Persistence, Dashboard & Alerts' },
  { id: 'results', label: 'Results', title: 'Results & Evaluation' },
  { id: 'future', label: 'Future', title: 'Future Work & Research Extensions' },
]

function parseHash(): PageId {
  const h = window.location.hash.replace(/^#\/?/, '')
  return (PAGES.some((p) => p.id === h) ? h : 'overview') as PageId
}

export function usePage(): [PageId, (p: PageId) => void] {
  const [page, setPage] = useState<PageId>(parseHash)

  useEffect(() => {
    const onHash = () => {
      setPage(parseHash())
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const navigate = (p: PageId) => {
    window.location.hash = `/${p}`
  }
  return [page, navigate]
}
