import { motion } from 'framer-motion'
import { RegionChip } from './ui'

const stats = [
  ['4', 'Near-RT RIC regions'],
  ['4 + 1', 'Mini RAG agents + Global RAG'],
  ['2', 'rApps (CTI prep & persistence)'],
  ['2', 'xApps per region (simulator & probe)'],
]

export default function Hero() {
  return (
    <div id="top" className="relative overflow-hidden border-b border-line bg-white">
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_20%_10%,#dbeafe_0%,transparent_45%),radial-gradient(circle_at_85%_30%,#ede9fe_0%,transparent_40%)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="section-kicker">Final Year Project · Technical Walkthrough</span>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl">
            Multi-Region O-RAN{' '}
            <span className="bg-gradient-to-r from-accent to-region4 bg-clip-text text-transparent">
              Cyber Threat Intelligence
            </span>{' '}
            Platform
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-slate-600">
            Simulated O-RAN threats are detected by Near-RT RIC xApps, analyzed by regional{' '}
            <strong>Mini RAG</strong> agents, escalated to a central <strong>Global RAG</strong> when local
            confidence is low, persisted by <strong>rApp2</strong> into PostgreSQL, streamed live to a{' '}
            <strong>global dashboard</strong>, and shared across regions through a TAXII-style{' '}
            <strong>Inter-Platform Agent</strong>.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <RegionChip region={1} />
            <RegionChip region={2} />
            <RegionChip region={3} />
            <RegionChip region={4} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-global">
              <span className="h-1.5 w-1.5 rounded-full bg-global" /> Global RAG
            </span>
          </div>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(([n, label]) => (
              <div key={label} className="card px-3 py-4">
                <div className="text-2xl font-extrabold text-accent">{n}</div>
                <div className="mt-1 text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>
          <a
            href="#architecture"
            className="mt-10 inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-800"
          >
            Explore the architecture
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
