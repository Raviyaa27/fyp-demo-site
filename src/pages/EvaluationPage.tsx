import { motion } from 'framer-motion'
import { PageHeader, Block, FileBadge, Endpoint } from '../components/ui'

const EASE = [0.22, 1, 0.36, 1] as const

const SESSIONS = [30.6, 60.8, 65.5, 66.8, 67.8, 69.8, 69.7, 72.6, 75.6]

const WEIGHTS = [
  ['54%', 'RAG intelligence', 'grounded recall, ranking, routing, severity, generation reliability', '#0e7490'],
  ['36%', 'End-to-end detection', 'persisted event capture and expected-rule accuracy', '#7c3aed'],
  ['10%', 'Mitigation response', 'execution, verification, timeliness, cross-region advantage', '#16a34a'],
] as const

const MIT_WEIGHTS = [
  ['0.35', 'Successful execution', 'an action never applied cannot mitigate anything'],
  ['0.30', 'Cross-region advantage', 'does shared intelligence actually help a peer respond faster'],
  ['0.20', 'Verification', 'an API success is not proof of an operational effect'],
  ['0.15', 'Timeliness', 'bounded score derived from mean time to mitigate'],
] as const

const METRICS = [
  ['100%', 'Generation reliability', '#16a34a'],
  ['100%', 'End-to-end detector capture', '#16a34a'],
  ['71.4%', 'Severity accuracy', '#d97706'],
  ['54.2%', 'Grounded Recall@3', '#7c3aed'],
  ['39.3%', 'Routing accuracy', '#e11d48'],
] as const

const CAMPAIGN = [
  ['UE DoS / KPM', 36, '24%'],
  ['UE runtime shell', 36, '24%'],
  ['A1 anomaly', 18, '12%'],
  ['F1 anomaly', 18, '12%'],
  ['E2 signalling', 18, '12%'],
  ['xApp invalid API', 12, '8%'],
  ['Generic pod shell', 6, '4%'],
  ['Memory anomaly', 6, '4%'],
] as const

const OBSERVABILITY = [
  ['Phoenix', 'Traces every LLM call: prompt and completion tokens, latency, provider and fallback status.', '#e11d48'],
  ['Prometheus', 'Histograms for analysis latency plus the detection rules themselves, scraped from every service.', '#d97706'],
  ['Grafana', 'Regional KPI dashboards and the recording rule that refreshes the platform score every 30 s.', '#7c3aed'],
  ['KPI exporter', 'Derives the regional operational score from live metrics and alerts when it stays below 70.', '#16a34a'],
] as const

function GrowthChart() {
  const W = 660
  const H = 260
  const PAD = { l: 44, r: 16, t: 16, b: 32 }
  const iw = W - PAD.l - PAD.r
  const ih = H - PAD.t - PAD.b
  const x = (i: number) => PAD.l + (i / (SESSIONS.length - 1)) * iw
  const y = (v: number) => PAD.t + ih - (v / 100) * ih
  const line = SESSIONS.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(SESSIONS.length - 1).toFixed(1)} ${y(0)} L ${x(0)} ${y(0)} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Intelligence score across nine sessions">
      {[0, 25, 50, 75, 100].map((g) => (
        <g key={g}>
          <line x1={PAD.l} y1={y(g)} x2={W - PAD.r} y2={y(g)} stroke="#e9eef5" strokeWidth={1} />
          <text x={PAD.l - 8} y={y(g) + 3.5} textAnchor="end" fontSize={9.5} fill="#94a3b8">
            {g}%
          </text>
        </g>
      ))}
      <path d={area} fill="#0e749015" />
      <motion.path
        d={line}
        fill="none"
        stroke="#0e7490"
        strokeWidth={2.6}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      {SESSIONS.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r={4} fill="#ffffff" stroke="#0e7490" strokeWidth={2.2} />
          <text x={x(i)} y={H - 12} textAnchor="middle" fontSize={9.5} fill="#94a3b8">
            S{i + 1}
          </text>
        </g>
      ))}
      <text x={x(0) + 6} y={y(SESSIONS[0]) - 10} fontSize={11} fontWeight={700} fill="#64748b">
        30.6%
      </text>
      <text x={x(SESSIONS.length - 1) - 6} y={y(75.6) - 12} textAnchor="end" fontSize={12} fontWeight={700} fill="#0e7490">
        75.6%
      </text>
    </svg>
  )
}

export default function EvaluationPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Evaluation & Observability"
        title={
          <>
            Measured against a <span className="grad-text">frozen benchmark</span>
          </>
        }
        lead={
          <>
            Intelligence growth is measured with a fixed, checksummed ground-truth case set evaluated read-only, so
            sessions are actually comparable. The weights are declared in advance, and any component that was not
            measured is omitted rather than scored as zero or assumed successful.
          </>
        }
      />

      <Block title="The declared composite score">
        <div className="grid gap-4 lg:grid-cols-3">
          {WEIGHTS.map(([w, t, d, col], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
              className="card card-hover p-5"
              style={{ borderTop: `3px solid ${col}` }}
            >
              <div className="text-4xl font-extrabold" style={{ color: col }}>
                {w}
              </div>
              <div className="mt-1 font-bold">{t}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{d}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 card card-hover p-5">
          <p className="text-sm leading-relaxed text-slate-600">
            Before mitigation was instrumented the score used a 60 / 40 split of RAG and detection. Adding the
            mitigation term as an independent 10% produced the current 54 / 36 / 10, which is why early sessions are
            only comparable to each other. The split is enforced in{' '}
            <code className="font-mono text-xs">security/evaluation/mitigation_score.py</code>.
          </p>
        </div>
      </Block>

      <Block title="Measured intelligence growth">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="card p-5">
            <GrowthChart />
            <p className="mt-2 text-center text-xs italic text-slate-500">
              Nine complete Region 1 sessions. Mean 64.4%, standard deviation 12.6 points.
            </p>
          </div>
          <div className="space-y-3">
            {METRICS.map(([v, l, col], i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                className="card card-hover flex items-center gap-4 px-5 py-3"
              >
                <span className="w-16 shrink-0 text-xl font-extrabold" style={{ color: col }}>
                  {v}
                </span>
                <span className="text-sm text-slate-600">{l}</span>
              </motion.div>
            ))}
            <div className="card card-hover border-l-4 border-l-amber-500 p-5">
              <h4 className="mb-2 font-bold">Read the components, not the total</h4>
              <p className="text-xs leading-relaxed text-slate-600">
                Generation and detector capture are saturated, so the remaining headroom is almost entirely retrieval
                grounding and routing. Movement between sessions can also come from corrected ground truth or a new
                evaluator version, so growth is only claimed where the knowledge and escalation evidence agree.
              </p>
            </div>
          </div>
        </div>
      </Block>

      <Block
        title="How the mitigation sub-score is built"
        intro="Only components actually measured in a session contribute; the remaining weights are renormalised so missing evidence never inflates or deflates the result."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MIT_WEIGHTS.map(([w, t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
              className="card card-hover p-4"
            >
              <div className="font-mono text-lg font-extrabold text-emerald-700">{w}</div>
              <div className="mt-0.5 text-sm font-bold">{t}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{d}</p>
            </motion.div>
          ))}
        </div>
      </Block>

      <Block
        title="The 750-event emulation campaign"
        intro="A deterministic 150-slot schedule, run over five days across two evaluated regions, with a minimum 80 s buffer between slots. Failed slots are retried and remain visible in the audit rather than being discarded."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="card p-5">
            {CAMPAIGN.map(([name, count, share], i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: EASE }}
                className="mb-2 flex items-center gap-3 last:mb-0"
              >
                <span className="w-40 shrink-0 text-xs font-semibold text-slate-700">{name}</span>
                <div className="h-4 flex-1 overflow-hidden rounded bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(count / 36) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                    className="h-full rounded bg-gradient-to-r from-blue-600 to-violet-600"
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-xs text-slate-500">
                  {count} · {share}
                </span>
              </motion.div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="card card-hover p-5">
              <h4 className="mb-2 font-bold">Bounded and labelled</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                UE DoS runs real iperf traffic through the UE's PDU path and runtime-shell tests are observed by
                Falco. A1, F1 and selected E2 anomalies are detector-contract simulations, submitted as structured
                events and permanently flagged <code className="font-mono text-xs">simulation=true</code> in the
                database.
              </p>
            </div>
            <div className="card card-hover p-5">
              <h4 className="mb-2 font-bold">Scripts</h4>
              <div className="flex flex-wrap gap-1.5">
                <FileBadge>security/emulation/run-150-anomaly-day.sh</FileBadge>
                <FileBadge>security/intelligence/freeze-benchmark.sh</FileBadge>
                <FileBadge>security/intelligence/run-frozen-benchmark.sh</FileBadge>
                <FileBadge>security/evaluation/run_evaluation.py</FileBadge>
                <FileBadge>security/evaluation/mitigation_score.py</FileBadge>
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block
        title="Observability"
        intro="The platform measures itself. Every language-model call is traced, every service exposes Prometheus metrics, and a recording rule turns them into a live regional health score."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {OBSERVABILITY.map(([name, desc, col], i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
              className="card card-hover p-5"
              style={{ borderTop: `3px solid ${col}` }}
            >
              <h3 className="font-bold">{name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <FileBadge>observability/kubernetes/phoenix.yaml</FileBadge>
          <FileBadge>observability/kubernetes/kpi-recording-rules.yaml</FileBadge>
          <FileBadge>observability/kpi-exporter</FileBadge>
          <FileBadge>observability/grafana/rag-24h-kpi-dashboard.json</FileBadge>
          <FileBadge>rag/tracing.py</FileBadge>
          <FileBadge>rag/llm_usage.py</FileBadge>
        </div>
      </Block>

      <Block
        title="Compared against OpenCTI 6.0+"
        intro="Six ground-truth 5G security scenarios were executed concurrently against the Global-RAG platform and an isolated OpenCTI baseline."
        className="pb-16"
      >
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-line bg-slate-50 text-left">
                <th className="px-5 py-3 font-bold">Evaluation metric</th>
                <th className="px-5 py-3 text-center font-bold text-accent">This platform</th>
                <th className="px-5 py-3 text-center font-bold text-slate-500">OpenCTI 6.0+</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {([
                ['STIX precision (Recall@3)', '100.0%', '0.0%', true],
                ['STIX taxonomy alignment', '100.0%', '33.3%', true],
                ['End-to-end detection', '100.0%', '100.0%', false],
                ['Platform stability', '100.0%', '100.0%', false],
                ['STIX confidence validation', '90.0%', '100.0%', false],
                ['Operational CTI latency', '3755 ms', '37.7 ms', false],
              ] as const).map(([m, a, b, win]) => (
                <tr key={m}>
                  <td className="px-5 py-2.5 text-slate-700">{m}</td>
                  <td className={`px-5 py-2.5 text-center ${win ? 'font-bold text-emerald-600' : 'text-slate-600'}`}>{a}</td>
                  <td className={`px-5 py-2.5 text-center ${win ? 'font-bold text-rose-600' : 'text-slate-500'}`}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card card-hover border-l-4 border-l-emerald-600 p-5">
            <h4 className="mb-2 font-bold">Why OpenCTI scores zero on precision</h4>
            <p className="text-sm leading-relaxed text-slate-600">
              It runs static keyword lookups over enterprise IT feeds that contain no 5G RAN context to retrieve, and
              its schema has no representation for a UE traffic surge, xApp API abuse or RIC pod exhaustion.
            </p>
          </div>
          <div className="card card-hover border-l-4 border-l-amber-500 p-5">
            <h4 className="mb-2 font-bold">The honest trade-off</h4>
            <p className="text-sm leading-relaxed text-slate-600">
              This platform is roughly a hundred times slower per query. That is the cost of vector embedding, MCP
              escalation and generative synthesis instead of a keyword index, and it is a deliberate choice for
              analysis at the Non-RT tier.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Endpoint>GET /cti/intelligence/growth</Endpoint>
          <Endpoint>GET /cti/intelligence/evaluations</Endpoint>
          <FileBadge>security/intelligence/run_custom_cti_evaluation.py</FileBadge>
          <FileBadge>security/intelligence/run_global_rag_evaluation.py</FileBadge>
        </div>
      </Block>
    </div>
  )
}
