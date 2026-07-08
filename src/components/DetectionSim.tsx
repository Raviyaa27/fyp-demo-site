import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type NodeId = 'xapp2' | 'xapp1' | 'minirag' | 'localkb' | 'globalrag' | 'rapp2' | 'dash'
type Scenario = 'local' | 'escalate'

type SimStep = {
  nodes: NodeId[]
  links?: string[]
  msg: string
  detail: string
  tone: 'info' | 'ok' | 'warn' | 'global'
}

const COMMON: SimStep[] = [
  {
    nodes: ['xapp2'],
    msg: 'Threat simulated',
    detail: 'xApp2 generates a simulated O-RAN threat — e.g. A1 malformed policy, F1 unauthorized access or E2 flooding.',
    tone: 'warn',
  },
  {
    nodes: ['xapp2', 'xapp1'],
    links: ['xapp2-xapp1'],
    msg: 'POST /api/events',
    detail: 'The raw event is posted to xApp1, the Cyber Probe Manager.',
    tone: 'info',
  },
  {
    nodes: ['xapp1'],
    msg: 'Normalized to ThreatEvent',
    detail: 'xApp1 converts the payload: threat_id, region_id, source, target_component, interface, description, indicators, metrics, timestamp.',
    tone: 'info',
  },
  {
    nodes: ['xapp1', 'minirag'],
    links: ['xapp1-minirag'],
    msg: 'POST /api/v1/analyze-threat',
    detail: 'The ThreatEvent is forwarded to this region’s Mini RAG agent.',
    tone: 'info',
  },
  {
    nodes: ['minirag', 'localkb'],
    links: ['minirag-localkb'],
    msg: 'Searching regional KB…',
    detail: 'Mini RAG performs semantic search against its own regional vector DB only — never another region’s.',
    tone: 'info',
  },
]

const STEPS: Record<Scenario, SimStep[]> = {
  local: [
    ...COMMON,
    {
      nodes: ['localkb', 'minirag'],
      links: ['minirag-localkb'],
      msg: 'Strong local match ✓',
      detail: 'All six strict checks pass (similarity > STRICT_LOCAL_THRESHOLD, component, interface, mitigation, confidence, fields). Local mitigation returned.',
      tone: 'ok',
    },
    {
      nodes: ['minirag', 'rapp2'],
      links: ['minirag-rapp2'],
      msg: 'Persisting to rApp2',
      detail: 'Mini RAG builds the mitigation report and saves event + report via /api/mini-rag/events and /api/mini-rag/mitigations.',
      tone: 'info',
    },
    {
      nodes: ['rapp2'],
      msg: 'Stored in region tables',
      detail: 'rApp2 writes to mini_rag_region_N_events and mini_rag_region_N_mitigations in PostgreSQL, then notifies the dashboard backend.',
      tone: 'info',
    },
    {
      nodes: ['rapp2', 'dash'],
      links: ['rapp2-dash'],
      msg: 'Live WebSocket push',
      detail: 'The dashboard backend broadcasts over /ws/{region_id} — the threat and its mitigation appear instantly on the global dashboard.',
      tone: 'ok',
    },
  ],
  escalate: [
    ...COMMON,
    {
      nodes: ['localkb'],
      msg: 'Weak local match ✗',
      detail: 'A strict check fails — e.g. similarity below STRICT_LOCAL_THRESHOLD or no useful mitigation. The local answer is rejected.',
      tone: 'warn',
    },
    {
      nodes: ['minirag', 'globalrag'],
      links: ['minirag-globalrag'],
      msg: 'Escalating to Global RAG',
      detail: 'Mini RAG calls the Global RAG via MCP (global_rag.analyze_threat) / REST /api/analyze.',
      tone: 'global',
    },
    {
      nodes: ['globalrag'],
      msg: 'Full-context global analysis',
      detail: 'Global RAG searches the complete threat knowledge base (ChromaDB) and generates structured mitigation recommendations.',
      tone: 'global',
    },
    {
      nodes: ['globalrag', 'minirag', 'localkb'],
      links: ['minirag-globalrag', 'minirag-localkb'],
      msg: 'Learning — this region only',
      detail: 'The useful global answer is stored in this region’s KB and vector DB (duplicates avoided). Other regions and the Global RAG DB are not updated.',
      tone: 'ok',
    },
    {
      nodes: ['minirag', 'rapp2'],
      links: ['minirag-rapp2'],
      msg: 'Persisting to rApp2',
      detail: 'Mini RAG builds the mitigation report and saves event + report to rApp2’s region-specific tables.',
      tone: 'info',
    },
    {
      nodes: ['rapp2', 'dash'],
      links: ['rapp2-dash'],
      msg: 'Live WebSocket push',
      detail: 'rApp2 notifies the dashboard backend, which broadcasts over /ws/{region_id}. xApp1 also keeps recent history for demo visibility.',
      tone: 'ok',
    },
  ],
}

const NODE_META: Record<NodeId, { label: string; sub: string }> = {
  xapp2: { label: 'xApp2', sub: 'Threat Simulator' },
  xapp1: { label: 'xApp1', sub: 'Cyber Probe Mgr' },
  minirag: { label: 'Mini RAG', sub: 'Regional agent' },
  localkb: { label: 'Regional KB', sub: 'Vector DB' },
  globalrag: { label: 'Global RAG', sub: 'Full knowledge' },
  rapp2: { label: 'rApp2', sub: 'PostgreSQL' },
  dash: { label: 'Dashboard', sub: 'WebSocket live' },
}

const TONE_STYLES = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  ok: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warn: 'bg-amber-50 text-amber-900 border-amber-200',
  global: 'bg-rose-50 text-rose-800 border-rose-200',
}

function SimNode({ id, active, done }: { id: NodeId; active: boolean; done: boolean }) {
  const meta = NODE_META[id]
  const isGlobal = id === 'globalrag'
  return (
    <motion.div
      animate={{
        scale: active ? 1.06 : 1,
        boxShadow: active
          ? `0 0 0 3px ${isGlobal ? 'rgba(225,29,72,0.35)' : 'rgba(37,99,235,0.35)'}, 0 10px 24px rgba(15,23,42,0.14)`
          : '0 2px 8px rgba(15,23,42,0.06)',
      }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`relative w-[118px] shrink-0 rounded-xl border px-2 py-2.5 text-center ${
        isGlobal ? 'border-rose-200 bg-rose-50/70' : 'border-line bg-white'
      } ${active ? 'z-10' : ''}`}
    >
      <div className={`text-[13px] font-bold ${isGlobal ? 'text-rose-700' : 'text-ink'}`}>{meta.label}</div>
      <div className="text-[10px] text-slate-500">{meta.sub}</div>
      <AnimatePresence>
        {active && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className={`absolute -right-1.5 -top-1.5 h-3.5 w-3.5 rounded-full ${isGlobal ? 'bg-rose-500' : 'bg-blue-500'}`}
          >
            <span className={`absolute inset-0 animate-ping rounded-full ${isGlobal ? 'bg-rose-400' : 'bg-blue-400'}`} />
          </motion.span>
        )}
      </AnimatePresence>
      {done && !active && (
        <span className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-bold text-white">
          ✓
        </span>
      )}
    </motion.div>
  )
}

function Arrow({ active, vertical = false, warn = false }: { active: boolean; vertical?: boolean; warn?: boolean }) {
  const base = warn ? '#e11d48' : '#2563eb'
  return (
    <div className={`flex items-center justify-center ${vertical ? 'h-7' : 'w-8 shrink-0'}`}>
      <svg width={vertical ? 12 : 32} height={vertical ? 28 : 12} className="overflow-visible">
        <line
          x1={vertical ? 6 : 0}
          y1={vertical ? 0 : 6}
          x2={vertical ? 6 : 26}
          y2={vertical ? 22 : 6}
          stroke={active ? base : '#cbd5e1'}
          strokeWidth={active ? 2.5 : 1.5}
          strokeDasharray={active ? '5 4' : 'none'}
          markerEnd="url(#sim-arr)"
        >
          {active && <animate attributeName="stroke-dashoffset" from="18" to="0" dur="0.6s" repeatCount="indefinite" />}
        </line>
        <defs>
          <marker id="sim-arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto">
            <path d="M0 0L10 5L0 10z" fill={active ? base : '#cbd5e1'} />
          </marker>
        </defs>
      </svg>
    </div>
  )
}

export default function DetectionSim() {
  const [scenario, setScenario] = useState<Scenario>('escalate')
  const [step, setStep] = useState(-1)
  const [playing, setPlaying] = useState(false)
  const steps = STEPS[scenario]
  const current = step >= 0 ? steps[Math.min(step, steps.length - 1)] : null
  const finished = step >= steps.length - 1

  useEffect(() => {
    if (!playing) return
    if (finished) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((s) => s + 1), 2100)
    return () => clearTimeout(t)
  }, [playing, step, finished])

  const visited = useMemo(() => {
    const v = new Set<NodeId>()
    for (let i = 0; i <= step && i < steps.length; i++) steps[i].nodes.forEach((n) => v.add(n))
    return v
  }, [step, steps])

  const isActive = (n: NodeId) => !!current?.nodes.includes(n)
  const linkOn = (l: string) => !!current?.links?.includes(l)

  const reset = (s?: Scenario) => {
    if (s) setScenario(s)
    setStep(-1)
    setPlaying(false)
  }

  return (
    <div className="card overflow-hidden">
      {/* controls */}
      <div className="flex flex-wrap items-center gap-3 border-b border-line bg-slate-50/70 px-5 py-3.5">
        <div className="flex overflow-hidden rounded-lg border border-line bg-white text-[13px] font-semibold">
          <button
            onClick={() => reset('local')}
            className={`px-3.5 py-1.5 transition-colors ${scenario === 'local' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Strong local match
          </button>
          <button
            onClick={() => reset('escalate')}
            className={`px-3.5 py-1.5 transition-colors ${scenario === 'escalate' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            Weak match → escalate
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => {
              if (finished) setStep(-1)
              setPlaying(!playing)
              if (step < 0) setStep(0)
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-1.5 text-[13px] font-bold text-white shadow hover:brightness-110"
          >
            {playing ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
                Pause
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4l14 8-14 8z" /></svg>
                {finished ? 'Replay' : step >= 0 ? 'Resume' : 'Play simulation'}
              </>
            )}
          </button>
          <button
            onClick={() => setStep((s) => Math.min(s + 1, steps.length - 1))}
            className="rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            Step ›
          </button>
          <button onClick={() => reset()} className="rounded-lg border border-line bg-white px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            Reset
          </button>
        </div>
      </div>

      {/* pipeline */}
      <div className="overflow-x-auto px-5 py-7">
        <div className="flex min-w-[820px] items-center justify-center">
          <SimNode id="xapp2" active={isActive('xapp2')} done={visited.has('xapp2')} />
          <Arrow active={linkOn('xapp2-xapp1')} />
          <SimNode id="xapp1" active={isActive('xapp1')} done={visited.has('xapp1')} />
          <Arrow active={linkOn('xapp1-minirag')} />
          <SimNode id="minirag" active={isActive('minirag')} done={visited.has('minirag')} />
          <Arrow active={linkOn('minirag-localkb') || linkOn('minirag-globalrag')} warn={linkOn('minirag-globalrag')} />
          <div className="flex shrink-0 flex-col items-center">
            <SimNode id="localkb" active={isActive('localkb')} done={visited.has('localkb')} />
            <Arrow active={linkOn('minirag-globalrag')} vertical warn />
            <SimNode id="globalrag" active={isActive('globalrag')} done={visited.has('globalrag')} />
          </div>
          <Arrow active={linkOn('minirag-rapp2')} />
          <SimNode id="rapp2" active={isActive('rapp2')} done={visited.has('rapp2')} />
          <Arrow active={linkOn('rapp2-dash')} />
          <SimNode id="dash" active={isActive('dash')} done={visited.has('dash')} />
        </div>
      </div>

      {/* status */}
      <div className="border-t border-line px-5 py-4">
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
          />
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${scenario}-${step}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
            className={`rounded-xl border px-4 py-3 ${current ? TONE_STYLES[current.tone] : 'border-line bg-slate-50 text-slate-500'}`}
          >
            {current ? (
              <>
                <span className="font-mono text-xs font-bold uppercase tracking-wide">
                  Step {step + 1}/{steps.length} — {current.msg}
                </span>
                <p className="mt-1 text-sm leading-relaxed">{current.detail}</p>
              </>
            ) : (
              <p className="text-sm">
                Press <strong>Play simulation</strong> to watch a threat travel from xApp2 to the live dashboard. Toggle the
                scenario to compare a strong local match against a Global RAG escalation.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
