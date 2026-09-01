import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PageHeader, Block, FileBadge, Endpoint } from '../components/ui'
import mttmImg from '../assets/results/mttm.png'
import lifecycleImg from '../assets/results/mitigation-lifecycle.png'
import ipaSharedImg from '../assets/results/ipa-shared.png'
import notificationImg from '../assets/results/notification.png'
import feedbackImg from '../assets/results/operator-feedback.png'

const EASE = [0.22, 1, 0.36, 1] as const

const SESSIONS = [30.6, 60.8, 65.5, 66.8, 67.8, 69.8, 69.7, 72.6, 75.6]

const HEADLINE = [
  ['75.6%', 'closed-loop intelligence score', 'up from 30.6% at the first session', '#0e7490'],
  ['100%', 'end-to-end detector capture', 'every emulated event reached persisted evidence', '#16a34a'],
  ['750', 'emulated security events', 'eight threat families over a five-day campaign', '#7c3aed'],
  ['92.4%', 'faster on a pre-armed peer', 'cross-region response advantage, N = 10 runs', '#d97706'],
] as const

const WEIGHTS = [
  ['54%', 'RAG intelligence', 'retrieval, ranking, routing, severity, generation', '#0e7490'],
  ['36%', 'End-to-end detection', 'persisted event capture and expected-rule accuracy', '#7c3aed'],
  ['10%', 'Mitigation response', 'execution, verification, timeliness, cross-region gain', '#16a34a'],
] as const

const METRICS = [
  ['100%', 'Generation reliability', '#16a34a'],
  ['100%', 'End-to-end detector capture', '#16a34a'],
  ['71.4%', 'Severity accuracy', '#d97706'],
  ['54.2%', 'Grounded Recall@3', '#7c3aed'],
  ['39.3%', 'Routing accuracy', '#e11d48'],
] as const

const MIT_WEIGHTS = [
  ['0.35', 'Successful execution', 'an action never applied cannot mitigate anything'],
  ['0.30', 'Cross-region advantage', 'does shared intelligence actually help a peer respond faster'],
  ['0.20', 'Verification', 'an API success is not proof of an operational effect'],
  ['0.15', 'Timeliness', 'bounded score derived from mean time to mitigate'],
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

const DETECTION = [
  ['Runtime process detection', 'Falco captured the bounded shell execution inside the UE container with its experiment marker intact.'],
  ['Resource anomaly detection', 'Memory-limit pressure crossed the configured threshold and produced a persisted event.'],
  ['RAN telemetry', 'E2SM-KPM throughput reporting was observed end to end through the correlator.'],
  ['Interface contracts', 'A1, F1 and E2 anomalies were submitted as structured detector contracts and normalised correctly.'],
] as const

const MIT_STATS = [
  ['5', 'allow-listed actuators', 'E2SM-RC throttle, UE access revocation, pod quarantine, credential rotation and A1 policy.', '#0e7490'],
  ['0.85', 'minimum confidence gate', 'Below it, or on a protected target, the candidate becomes an operator recommendation only.', '#7c3aed'],
  ['Rollback', 'on verification failure', 'executed_unverified is recorded distinctly and never counts towards mitigation success.', '#e11d48'],
] as const

const SHARING = [
  ['Source exclusion verified', 'The originating region is absent from every distribution target set, so intelligence is never reflected back to its author.', '#0e7490'],
  ['Peers correctly deduplicated', 'Peers already holding an equivalent record returned already_present with a similarity score and were skipped rather than re-ingested.', '#16a34a'],
  ['Provenance preserved', 'Destination records carry external and source-region metadata, so an operator can always distinguish shared intel from a local detection.', '#7c3aed'],
  ['Failure isolated, not fatal', 'An unreachable peer is skipped and logged; the remaining regions still receive the intelligence.', '#d97706'],
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
        d={line} fill="none" stroke="#0e7490" strokeWidth={2.6} strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
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
      <text x={x(0) + 6} y={y(SESSIONS[0]) - 10} fontSize={11} fontWeight={700} fill="#64748b">30.6%</text>
      <text x={x(SESSIONS.length - 1) - 6} y={y(75.6) - 12} textAnchor="end" fontSize={12} fontWeight={700} fill="#0e7490">
        75.6%
      </text>
    </svg>
  )
}

type LbItem = { src: string; alt: string; caption: string }

function Figure({
  src,
  alt,
  caption,
  ratio,
  maxH,
  onOpen,
}: {
  src: string
  alt: string
  caption: string
  ratio: number
  maxH?: number
  onOpen: (item: LbItem) => void
}) {
  return (
    <figure className="card overflow-hidden">
      <button
        type="button"
        onClick={() => onOpen({ src, alt, caption })}
        aria-label={`Enlarge: ${alt}`}
        className="group relative flex w-full cursor-zoom-in items-center justify-center bg-slate-50/60 p-3"
      >
        <img
          src={src}
          alt={alt}
          className="w-full rounded-lg transition-transform duration-300 group-hover:scale-[1.015]"
          style={{ maxHeight: maxH ?? 340, width: 'auto', aspectRatio: String(ratio) }}
        />
        <span className="pointer-events-none absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4.2-4.2M11 8v6M8 11h6" />
          </svg>
          Click to enlarge
        </span>
      </button>
      <figcaption className="border-t border-line px-4 py-2.5 text-xs leading-relaxed text-slate-500">{caption}</figcaption>
    </figure>
  )
}

function Lightbox({ item, onClose }: { item: LbItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex cursor-zoom-out flex-col items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <motion.img
            src={item.src}
            alt={item.alt}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="max-h-[82vh] max-w-full cursor-default rounded-xl bg-white shadow-2xl"
          />
          <p className="mt-4 max-w-3xl text-center text-sm leading-relaxed text-slate-200">{item.caption}</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close enlarged image"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ResultsPage() {
  const [lightbox, setLightbox] = useState<LbItem | null>(null)
  return (
    <div className="mx-auto max-w-6xl px-4">
      <Lightbox item={lightbox} onClose={() => setLightbox(null)} />
      <PageHeader
        kicker="Results & Evaluation"
        title={
          <>
            What the platform <span className="grad-text">actually measured</span>
          </>
        }
        lead={
          <>
            Every result below comes from the reproducible evaluation campaign: a frozen, checksummed ground-truth
            benchmark evaluated read-only, plus bounded emulations whose evidence is persisted. Weights were declared
            in advance, and any component that was not measured is omitted rather than scored as zero.
          </>
        }
      />

      {/* headline numbers */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HEADLINE.map(([v, l, sub, col], i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
            className="card card-hover p-5"
            style={{ borderTop: `3px solid ${col}` }}
          >
            <div className="text-3xl font-extrabold" style={{ color: col }}>{v}</div>
            <div className="mt-1 text-sm font-bold">{l}</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="card card-hover mt-4 border-l-4 border-l-blue-600 p-5">
        <h4 className="mb-2 font-bold">Scope of the evaluation</h4>
        <p className="text-sm leading-relaxed text-slate-600">
          <strong>All four regions are deployed and operational.</strong> Regions 1 and 2 were selected as the
          evaluated regions and carry the full instrumentation used for scoring: two gNB groups, six UEs, an O-RAN SC
          RIC, xApps and a Mini RAG agent each. Regions 3 and 4 run the same stack and participate as sharing peers
          for the inter-platform experiments; they were simply not part of the scored campaign, so no measurement in
          this page is attributed to them.
        </p>
      </div>

      {/* how it was measured */}
      <Block title="How the platform was measured">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card card-hover p-6">
            <h3 className="mb-2 font-bold">The 750-event campaign</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              A deterministic 150-slot schedule run over five days across the two evaluated regions, with a minimum
              80 s buffer between slots. Failed slots are retried and remain visible in the audit rather than being
              discarded, so a single UE fault cannot silently shrink the sample.
            </p>
          </div>
          <div className="card card-hover p-6">
            <h3 className="mb-2 font-bold">Frozen intelligence benchmark</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              A fixed, checksummed ground-truth case set evaluated read-only, so scores are comparable across
              sessions. It measures grounded retrieval recall, ranking, local-versus-global routing, severity accuracy
              and generation reliability.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_360px]">
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
                <span className="w-36 shrink-0 text-xs font-semibold text-slate-700">{name}</span>
                <div className="h-4 flex-1 overflow-hidden rounded bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(count / 36) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
                    className="h-full rounded bg-gradient-to-r from-blue-600 to-violet-600"
                  />
                </div>
                <span className="w-16 shrink-0 text-right text-xs text-slate-500">{count} · {share}</span>
              </motion.div>
            ))}
          </div>
          <div className="card card-hover p-5">
            <h4 className="mb-3 font-bold">The declared composite score</h4>
            {WEIGHTS.map(([w, t, d, col]) => (
              <div key={t} className="mb-3 flex items-start gap-3 last:mb-0">
                <span className="w-12 shrink-0 text-xl font-extrabold" style={{ color: col }}>{w}</span>
                <span>
                  <span className="block text-sm font-bold">{t}</span>
                  <span className="text-xs leading-relaxed text-slate-500">{d}</span>
                </span>
              </div>
            ))}
            <p className="mt-3 border-t border-line pt-3 text-xs leading-relaxed text-slate-500">
              Enforced in <code className="font-mono text-[11px]">security/evaluation/mitigation_score.py</code>.
            </p>
          </div>
        </div>
      </Block>

      {/* 1 · intelligence growth */}
      <Block title="1 · Measured intelligence growth">
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
                <span className="w-16 shrink-0 text-xl font-extrabold" style={{ color: col }}>{v}</span>
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

      {/* 2 · detection */}
      <Block
        title="2 · Detection and evidence transparency"
        intro="Bounded scenarios were run against the live detectors, and every accepted event had to reach persisted rApp2 evidence to count."
      >
        <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
          <div className="card card-hover flex flex-col justify-center p-6 text-center" style={{ borderTop: '3px solid #16a34a' }}>
            <div className="text-5xl font-extrabold text-emerald-600">100%</div>
            <div className="mt-2 text-sm font-bold">End-to-end detector capture</div>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              in the latest completed session; a retrieval improvement can never be credited when the live detection
              path did not actually execute.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {DETECTION.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                className="card card-hover p-4"
              >
                <div className="text-sm font-bold">{t}</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="card card-hover mt-4 border-l-4 border-l-amber-500 p-5">
          <h4 className="mb-2 font-bold">Stated honestly</h4>
          <p className="text-sm leading-relaxed text-slate-600">
            A1, F1 and selected E2 anomalies are <strong>detector-contract simulations</strong>. They submit a
            structured event representing the interface condition and are permanently flagged{' '}
            <code className="font-mono text-xs">simulation=true</code> in the database. Detection latency,
            false-positive rate and repeated-trial confidence would need a separate quantitative study.
          </p>
        </div>
      </Block>

      {/* 3 · mitigation */}
      <Block
        title="3 · Automated mitigation results"
        intro="Mitigation is scored on verified operational outcomes, not on whether an API call returned success."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Figure
            onOpen={setLightbox}
            src={mttmImg}
            alt="Mean time to mitigate, full regional loop versus pre-armed peer"
            ratio={662 / 383}
            caption="Mean time-to-mitigate over N = 10 bounded quarantine runs. A peer already carrying the shared intelligence responds without repeating the full analysis loop."
          />
          <Figure
            onOpen={setLightbox}
            src={lifecycleImg}
            alt="Persisted mitigation candidate lifecycle in the operator view"
            ratio={1465 / 762}
            caption="Persisted candidate lifecycle. executed_unverified is deliberately distinguishable from verified, so an issued command is never reported as a security outcome."
          />
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {MIT_STATS.map(([v, l, d, col], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
              className="card card-hover p-5"
              style={{ borderTop: `3px solid ${col}` }}
            >
              <div className="text-2xl font-extrabold" style={{ color: col }}>{v}</div>
              <div className="mt-0.5 text-sm font-bold">{l}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{d}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_340px]">
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
          <div className="card card-hover border-l-4 border-l-amber-500 p-5">
            <h4 className="mb-2 font-bold">Treated as indicative</h4>
            <p className="text-sm leading-relaxed text-slate-600">
              The cross-region advantage is measured over ten bounded quarantine observations. It is reported as a
              measured indication rather than a universal performance claim, and the raw archive is required before
              it can be strengthened.
            </p>
          </div>
        </div>
      </Block>

      {/* 4 · sharing */}
      <Block
        title="4 · Inter-platform sharing results"
        intro="The Inter-Platform Agent excludes the source region and concurrently checks the remaining peers before any ingest."
      >
        <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
          <Figure
            onOpen={setLightbox}
            src={ipaSharedImg}
            alt="Threat intelligence received through the Inter-Platform Agent"
            ratio={861 / 722}
            maxH={420}
            caption="Operator-visible proof: the card is marked external and identifies the region it came from."
          />
          <div className="space-y-3">
            {SHARING.map(([t, d, col], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: EASE }}
                className="card card-hover p-4"
                style={{ borderLeft: `4px solid ${col}` }}
              >
                <div className="text-sm font-bold">{t}</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{d}</p>
              </motion.div>
            ))}
            <div className="card card-hover p-4">
              <div className="text-sm font-bold">The threshold is a trade-off</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Too low suppresses useful contextual variants, too high admits duplicates. Every distribution decision
                therefore retains its similarity score and reasoning so it can be audited later.
              </p>
            </div>
          </div>
        </div>
      </Block>

      {/* 5 · notifications */}
      <Block
        title="5 · Notification and operator feedback results"
        intro="Configuring SMTP is not evidence of delivery, so both the delivered message and the recorded operator response are shown."
      >
        <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
          <Figure
            onOpen={setLightbox}
            src={notificationImg}
            alt="Delivered threat notification email"
            ratio={632 / 861}
            maxH={430}
            caption="A delivered Region 2 alert carrying the affected component, interface, severity, confidence, immediate actions and detailed mitigations."
          />
          <div className="space-y-4">
            <Figure
              onOpen={setLightbox}
              src={feedbackImg}
              alt="Operator action and knowledge feedback capture"
              ratio={862 / 842}
              maxH={300}
              caption="Operator action and knowledge-feedback capture, persisted with the threat."
            />
            <div className="card card-hover border-l-4 border-l-emerald-600 p-5">
              <h4 className="mb-2 font-bold">Why this closes the loop</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                Applied actions, additional actions and a usefulness rating are stored alongside the threat and can be
                promoted into reviewed regional knowledge. Delivery is guarded by a notification log keyed per threat,
                so a re-broadcast or a restart cannot email a subscriber twice.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Endpoint>POST /notifications/feedback</Endpoint>
                <FileBadge>dashboard-backend/notifications.py</FileBadge>
              </div>
            </div>
          </div>
        </div>
      </Block>

      {/* 6 · OpenCTI */}
      <Block
        title="6 · Benchmark against OpenCTI 6.0+"
        intro="Six ground-truth 5G security scenarios were executed concurrently against the Global-RAG platform and an isolated OpenCTI baseline."
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
      </Block>

      {/* 7 · observability */}
      <Block
        title="7 · Observability behind the numbers"
        intro="The platform measures itself. Every language-model call is traced, every service exposes Prometheus metrics, and a recording rule turns them into a live regional health score."
        className="pb-16"
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
          <Endpoint>GET /cti/intelligence/growth</Endpoint>
          <Endpoint>GET /cti/intelligence/evaluations</Endpoint>
          <FileBadge>security/evaluation/run_evaluation.py</FileBadge>
          <FileBadge>security/evaluation/mitigation_score.py</FileBadge>
          <FileBadge>security/emulation/run-150-anomaly-day.sh</FileBadge>
          <FileBadge>observability/kubernetes/phoenix.yaml</FileBadge>
        </div>
      </Block>
    </div>
  )
}
