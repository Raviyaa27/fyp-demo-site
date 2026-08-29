import { motion } from 'framer-motion'
import { RegionChip, Block } from '../components/ui'
import { PageId } from '../router'
import archImg from '../assets/overview-image-new.jpeg'

const stats = [
  ['4', 'Near-RT RIC regions', 'ric-1 … ric-4, fully isolated'],
  ['4 + 1', 'RAG agents', 'four regional Mini RAGs + one Global RAG'],
  ['5', 'Mitigation actuators', 'RC · UE access · quarantine · credential · A1'],
  ['750', 'Emulated events', 'eight threat families over five days'],
]

const journey = [
  ['Observe', 'Prometheus, Loki, Falco and E2SM-KPM detectors fire', '#dc2626'],
  ['Correlate', 'the gateway normalises, deduplicates and scores', '#ea580c'],
  ['Analyze', 'Mini RAG answers locally or escalates to Global RAG', '#2563eb'],
  ['Mitigate', 'the guarded controller executes, verifies, rolls back', '#7c3aed'],
  ['Persist', 'rApp2 stores events and reports per region', '#0e7490'],
  ['Share', 'Inter-Platform Agent spreads intel to peer regions', '#16a34a'],
] as const

const directory: { page: PageId; title: string; desc: string; icon: string }[] = [
  { page: 'architecture', title: 'System Architecture', desc: 'The full multi-region picture: Non-RT RIC platform, four Near-RT RICs and the RAN layer.', icon: '🏗️' },
  { page: 'knowledge', title: 'CTI Knowledge Pipeline', desc: 'How MITRE ATT&CK, FiGHT and CISA KEV become a pruned, O-RAN-specific knowledge base.', icon: '📚' },
  { page: 'detection', title: 'Anomaly Detection Gateway', desc: 'Four evidence sources normalised into one transparent schema, plus the live pipeline simulation.', icon: '⚡' },
  { page: 'mitigation', title: 'Guarded Mitigation', desc: 'Five actuators behind deterministic safety gates, with verification and automatic rollback.', icon: '🛡️' },
  { page: 'mcp', title: 'MCP Intelligence Sharing', desc: 'How the agents call each other as typed MCP tools over SSE, the protocol backbone of the platform.', icon: '🔌' },
  { page: 'sharing', title: 'Inter-Platform Sharing', desc: 'STIX/TAXII-style intelligence exchange between regions, with similarity-gated ingestion.', icon: '🔁' },
  { page: 'data', title: 'Persistence & Dashboard', desc: 'Region-partitioned PostgreSQL storage and the live global monitoring UI.', icon: '📊' },
  { page: 'evaluation', title: 'Evaluation & Observability', desc: 'The frozen benchmark, the 54/36/10 score, the OpenCTI comparison and the observability stack.', icon: '📈' },
  { page: 'run', title: 'Execution Order', desc: 'Dependency-ordered startup guide for demonstrating the whole platform.', icon: '🚀' },
  { page: 'future', title: 'Future Work', desc: 'What remains ahead: an end-to-end dApp and a controlled UE penetration-testing tool.', icon: '🔭' },
]

export default function OverviewPage({ navigate }: { navigate: (p: PageId) => void }) {
  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* hero */}
      <div className="relative py-16 text-center sm:py-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
          <span className="section-kicker">Final Year Project · Interactive Technical Walkthrough</span>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-6xl">
            Multi-Region O-RAN <span className="grad-text">Cyber Threat Intelligence</span> Platform
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
            O-RAN threats are caught by a regional <strong>detection gateway</strong> that unifies Prometheus, Loki,
            Falco and E2SM-KPM evidence, analysed by regional <strong>Mini RAG</strong> agents that escalate to a
            central <strong>Global RAG</strong> only when local evidence is weak, answered by a{' '}
            <strong>guarded mitigation controller</strong> that verifies its own effect, and shared across regions
            through the <strong>Inter-Platform Agent</strong>.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <RegionChip region={1} />
            <RegionChip region={2} />
            <RegionChip region={3} />
            <RegionChip region={4} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600" /> Global RAG
            </span>
          </div>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('detection')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z" /></svg>
              Run the live simulation
            </button>
            <button
              onClick={() => navigate('architecture')}
              className="rounded-xl border border-line bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              View the architecture
            </button>
          </div>
        </motion.div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([n, label, sub], i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="card card-hover px-4 py-5 text-center"
          >
            <div className="grad-text text-3xl font-extrabold">{n}</div>
            <div className="mt-1 text-sm font-bold">{label}</div>
            <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
          </motion.div>
        ))}
      </div>

      {/* system architecture image */}
      <Block
        title="The system at a glance"
        intro={
          <>
            The full platform on one canvas: the Non-RT RIC / O-Cloud / SMO layer hosting the MCP Server, Global RAG
            Agent, threat-intel rApps and global dashboard, over the regional Near-RT RICs. Each one carries its own
            Threat Simulator, Probe Manager, Mini RAG Agent and Inter-Platform Agent, connected to its RAN layer
            over the E2 interface.
          </>
        }
        className="mt-10"
      >
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="card overflow-hidden"
        >
          <div className="overflow-x-auto p-3 sm:p-5">
            <img
              src={archImg}
              alt="Multi-Region O-RAN CTI Platform system architecture"
              className="mx-auto w-full min-w-[820px] max-w-[1200px] rounded-xl"
            />
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-slate-50/60 px-5 py-3 text-xs text-slate-500">
            <span>
              System architecture: Non-RT RIC / SMO platform over the regional Near-RT RICs and their domain-specific
              RANs (rural connectivity, university campus, smart city / tech park).
            </span>
            <button
              onClick={() => navigate('architecture')}
              className="inline-flex items-center gap-1 font-bold text-accent hover:underline"
            >
              Explore the interactive version
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </figcaption>
        </motion.figure>
      </Block>

      {/* journey */}
      <Block
        title="The platform in six moves"
        intro="One threat's journey through the system. Each move is explored in depth on its own page."
        className="mt-8"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {journey.map(([title, desc, color], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
              className="card card-hover relative p-4"
              style={{ borderTop: `3px solid ${color}` }}
            >
              <span
                className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-white"
                style={{ background: color }}
              >
                {i + 1}
              </span>
              <div className="text-sm font-bold">{title}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
              {i < journey.length - 1 && (
                <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-slate-300 lg:block">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 5l7 7-7 7" /></svg>
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </Block>

      {/* the core idea */}
      <Block title="The core idea: regions learn alone, escalate together">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card card-hover border-l-4 border-l-emerald-500 p-5">
            <h3 className="mb-2 font-bold">Regional isolation</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Each Near-RT RIC region has its own Mini RAG, knowledge base, vector DB, database tables and dashboard
              stream. No region ever writes into another region's data.
            </p>
          </div>
          <div className="card card-hover border-l-4 border-l-rose-500 p-5">
            <h3 className="mb-2 font-bold">Global escalation</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              When a region's local answer fails strict quality checks, the Global RAG, the central knowledge
              authority, provides full-context analysis and the region learns the answer locally.
            </p>
          </div>
          <div className="card card-hover border-l-4 border-l-violet-500 p-5">
            <h3 className="mb-2 font-bold">Controlled sharing</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              Confirmed threats travel to peer regions only through the Inter-Platform Agent, tagged as external
              intel and deduplicated by similarity before ingestion.
            </p>
          </div>
        </div>
      </Block>

      {/* directory */}
      <Block title="Explore the walkthrough" className="pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {directory.map((d, i) => (
            <motion.button
              key={d.page}
              onClick={() => navigate(d.page)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="card card-hover group p-5 text-left"
            >
              <div className="mb-2 text-2xl">{d.icon}</div>
              <div className="flex items-center gap-1.5 font-bold group-hover:text-accent">
                {d.title}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{d.desc}</p>
            </motion.button>
          ))}
        </div>
      </Block>
    </div>
  )
}
