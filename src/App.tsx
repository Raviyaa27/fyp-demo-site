import { AnimatePresence, motion } from 'framer-motion'
import Nav from './components/Nav'
import { usePage, PageId } from './router'
import OverviewPage from './pages/OverviewPage'
import ArchitecturePage from './pages/ArchitecturePage'
import KnowledgePage from './pages/KnowledgePage'
import DetectionPage from './pages/DetectionPage'
import SharingPage from './pages/SharingPage'
import DataPage from './pages/DataPage'
import RunPage from './pages/RunPage'

const ORDER: PageId[] = ['overview', 'architecture', 'knowledge', 'detection', 'sharing', 'data', 'run']
const TITLES: Record<PageId, [string, string]> = {
  overview: ['', ''],
  architecture: ['Next up', 'CTI Knowledge Pipeline'],
  knowledge: ['Next up', 'Live Threat Detection'],
  detection: ['Next up', 'Inter-Platform Sharing'],
  sharing: ['Next up', 'Persistence & Dashboard'],
  data: ['Next up', 'Execution Order'],
  run: ['Back to', 'Overview'],
}

function NextPageLink({ page, navigate }: { page: PageId; navigate: (p: PageId) => void }) {
  if (page === 'overview') return null
  const idx = ORDER.indexOf(page)
  const next = ORDER[(idx + 1) % ORDER.length]
  const [kicker, label] = TITLES[page]
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <button
        onClick={() => navigate(next)}
        className="card card-hover group flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span>
          <span className="block text-xs font-bold uppercase tracking-widest text-slate-400">{kicker}</span>
          <span className="text-lg font-extrabold group-hover:text-accent">{label}</span>
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow transition-transform group-hover:translate-x-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </div>
  )
}

export default function App() {
  const [page, navigate] = usePage()

  return (
    <>
      <Nav page={page} navigate={navigate} />
      <main className="pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {page === 'overview' && <OverviewPage navigate={navigate} />}
            {page === 'architecture' && <ArchitecturePage />}
            {page === 'knowledge' && <KnowledgePage />}
            {page === 'detection' && <DetectionPage />}
            {page === 'sharing' && <SharingPage />}
            {page === 'data' && <DataPage />}
            {page === 'run' && <RunPage />}
            <NextPageLink page={page} navigate={navigate} />
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="border-t border-line bg-white/70 py-8 text-center text-sm text-slate-500 backdrop-blur">
        <p className="font-semibold text-ink">Multi-Region O-RAN CTI Platform — Final Year Project</p>
        <p className="mt-1">Mini RAG · Global RAG · rApps · xApps · Inter-Platform Threat Sharing · Global Dashboard</p>
      </footer>
    </>
  )
}
