import { motion } from 'framer-motion'
import { PageHeader, Block, REGION_COLORS } from '../components/ui'

const EASE = [0.22, 1, 0.36, 1] as const

function NumberChip({ n, color = '#1d4ed8' }: { n: number; color?: string }) {
  return (
    <span
      className="mr-2.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-extrabold text-white shadow"
      style={{ background: color }}
    >
      {n}
    </span>
  )
}

/* ── 1 · domain-wise feeds fan-out ─────────────────────────────── */

const DOMAINS = [
  { n: 1, icon: '🌾', title: 'Rural connectivity', sub: 'remote RAN threat intel' },
  { n: 2, icon: '🎓', title: 'University campus', sub: 'research network threat intel' },
  { n: 3, icon: '🏙️', title: 'Smart city / tech park', sub: 'IoT & urban threat intel' },
  { n: 4, icon: '🏭', title: 'Industrial', sub: 'critical infrastructure threat intel' },
] as const

function DomainFeedsDiagram() {
  return (
    <svg viewBox="0 0 1000 320" className="min-w-[820px]" role="img" aria-label="Domain-wise CTI feed fan-out">
      <defs>
        {DOMAINS.map((d) => (
          <marker
            key={d.n}
            id={`fw-arrow-${d.n}`}
            viewBox="0 0 10 10"
            refX="8.5"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto"
          >
            <path d="M0 0L10 5L0 10z" fill={REGION_COLORS[`region_${d.n}`]} />
          </marker>
        ))}
      </defs>

      <rect x={355} y={18} width={290} height={64} rx={14} fill="#1d4ed80d" stroke="#1d4ed8" strokeWidth={1.5} />
      <text x={500} y={45} textAnchor="middle" fontSize={13.5} fontWeight={700}>
        Domain-specific CTI feeds
      </text>
      <text x={500} y={65} textAnchor="middle" fontSize={10.5} fill="#64748b">
        curated per operational environment
      </text>

      {DOMAINS.map((d, i) => {
        const color = REGION_COLORS[`region_${d.n}`]
        const cx = 132 + i * 245
        const path = `M 500 82 C 500 140, ${cx} 130, ${cx} 188`
        return (
          <g key={d.n}>
            <path d={path} fill="none" stroke={color} strokeWidth={1.8} opacity={0.75} markerEnd={`url(#fw-arrow-${d.n})`} />
            <circle r={4} fill={color}>
              <animateMotion dur="2.4s" begin={`${i * 0.35}s`} repeatCount="indefinite" path={path} />
            </circle>
            <rect x={cx - 112} y={192} width={224} height={98} rx={14} fill={`${color}0d`} stroke={color} strokeWidth={1.5} />
            <text x={cx} y={226} textAnchor="middle" fontSize={20}>
              {d.icon}
            </text>
            <text x={cx} y={248} textAnchor="middle" fontSize={12.5} fontWeight={700}>
              Region {d.n} · {d.title}
            </text>
            <text x={cx} y={266} textAnchor="middle" fontSize={10} fill="#64748b">
              {d.sub}
            </text>
            <text x={cx} y={282} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={color}>
              specialized Mini RAG KB
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* ── 2 · subscription flow ─────────────────────────────────────── */

function SubscriptionDiagram() {
  const subscribers = [
    ['Vendors', '#0e7490'],
    ['Network operators', '#7c3aed'],
    ['Security teams', '#be123c'],
  ] as const
  return (
    <svg viewBox="0 0 520 330" className="w-full min-w-[440px]" role="img" aria-label="Subscription notification flow">
      <defs>
        <marker id="sub-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#d97706" />
        </marker>
      </defs>

      <rect x={30} y={20} width={220} height={58} rx={12} fill={`${REGION_COLORS.region_3}0d`} stroke={REGION_COLORS.region_3} strokeWidth={1.5} />
      <text x={140} y={44} textAnchor="middle" fontSize={12} fontWeight={700}>
        Region event
      </text>
      <text x={140} y={62} textAnchor="middle" fontSize={9.5} fill="#64748b">
        detected · analyzed · mitigated · shared
      </text>

      <path d="M 140 78 V 130" stroke="#d97706" strokeWidth={2} fill="none" markerEnd="url(#sub-arrow)" />
      <circle r={4} fill="#d97706">
        <animateMotion dur="1.8s" repeatCount="indefinite" path="M 140 78 V 130" />
      </circle>

      <rect x={30} y={134} width={220} height={64} rx={12} fill="#fffbeb" stroke="#d97706" strokeWidth={1.5} />
      <text x={125} y={161} textAnchor="middle" fontSize={12} fontWeight={700} fill="#92400e">
        Subscription service
      </text>
      <text x={125} y={180} textAnchor="middle" fontSize={9.5} fill="#b45309">
        region subscriptions → email alerts
      </text>
      {/* bell */}
      <g transform="translate(222, 152)">
        <path d="M0 12 a8 8 0 0 1 16 0 v5 l3 4 H-3 l3 -4 z" fill="#f59e0b">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 8 4; 12 8 4; -12 8 4; 8 8 4; 0 8 4"
            dur="2.2s"
            repeatCount="indefinite"
          />
        </path>
        <circle cx={8} cy={24} r={2.6} fill="#f59e0b" />
      </g>

      {subscribers.map(([label, color], i) => {
        const y = 240 + i * 0 // single row handled below
        const cx = 90 + i * 170
        const path = `M 140 198 C 140 225, ${cx} 215, ${cx} ${y}`
        return (
          <g key={label}>
            <path d={path} fill="none" stroke="#d97706" strokeWidth={1.6} opacity={0.7} markerEnd="url(#sub-arrow)" />
            <circle r={3.4} fill="#d97706">
              <animateMotion dur="2.2s" begin={`${0.5 + i * 0.25}s`} repeatCount="indefinite" path={path} />
            </circle>
            <rect x={cx - 75} y={244} width={150} height={56} rx={12} fill="#ffffff" stroke={color} strokeWidth={1.5} />
            <text x={cx} y={268} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={color}>
              {label}
            </text>
            <text x={cx} y={286} textAnchor="middle" fontSize={9.5} fill="#64748b">
              ✉ email notification
            </text>
          </g>
        )
      })}
    </svg>
  )
}

const EMAIL_FIELDS = [
  ['Threat summary', 'Malformed A1 policy flood targeting Near-RT RIC'],
  ['Affected component', 'Near-RT RIC · Policy Management Service'],
  ['Affected interface', 'A1'],
  ['Severity', 'CRITICAL'],
  ['Confidence', '0.89'],
  ['Mitigation report', 'RAG-generated — attached in full'],
  ['Immediate actions', 'throttle source IP · validate A1 payloads'],
  ['Actionable insight', 'full report link'],
  ['Source region', 'region_1 · shared to 3 peer regions'],
] as const

const FEEDBACK_METRICS = [
  ['Actions used', 'which recommended actions were actually applied'],
  ['Usefulness', 'whether the action helped in practice'],
  ['Feedback score', 'operator / vendor rating of the recommendation'],
  ['Effectiveness', 'measured mitigation effectiveness score'],
  ['Response time', 'time from notification to first action'],
] as const

/* ── 3 · immediate action chips ────────────────────────────────── */

const IMMEDIATE_ACTIONS = [
  'Block suspicious source',
  'Rate-limit abnormal traffic',
  'Validate A1 policy payloads',
  'Isolate affected component',
  'Increase monitoring',
  'Disable suspicious policy temporarily',
] as const

/* ── 4 · dApp pipeline ─────────────────────────────────────────── */

const DAPP_STAGES = [
  ['Threat traffic', 'controlled scenario traffic', '#dc2626'],
  ['Detection', 'anomaly + affected component', '#ea580c'],
  ['RAG decision', 'Mini RAG or Global RAG', '#2563eb'],
  ['Mitigation report', 'recommendation generated', '#0e7490'],
  ['Action execution', 'status recorded', '#16a34a'],
  ['Evidence trail', 'detection → response record', '#7c3aed'],
] as const

function DappPipelineDiagram() {
  return (
    <svg viewBox="0 0 1060 150" className="min-w-[920px]" role="img" aria-label="dApp end-to-end pipeline">
      <defs>
        <marker id="dapp-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#94a3b8" />
        </marker>
      </defs>
      {DAPP_STAGES.map(([title, sub, color], i) => {
        const x = 20 + i * 175
        return (
          <g key={title}>
            <rect x={x} y={30} width={150} height={86} rx={13} fill="#ffffff" stroke={color} strokeWidth={1.5} />
            <rect x={x} y={30} width={150} height={86} rx={13} fill={`${color}08`} />
            <rect x={x} y={30} width={150} height={4} rx={2} fill={color} />
            <circle cx={x + 22} cy={58} r={10} fill={color} />
            <text x={x + 22} y={62} textAnchor="middle" fontSize={10.5} fontWeight={800} fill="#ffffff">
              {i + 1}
            </text>
            <text x={x + 40} y={62} fontSize={11.5} fontWeight={700}>
              {title}
            </text>
            <text x={x + 14} y={86} fontSize={9} fill="#64748b">
              {sub.length > 30 ? sub.slice(0, 30) : sub}
            </text>
            {sub.length > 30 && (
              <text x={x + 14} y={98} fontSize={9} fill="#64748b">
                {sub.slice(30)}
              </text>
            )}
            {i < DAPP_STAGES.length - 1 && (
              <path d={`M ${x + 152} 73 H ${x + 172}`} stroke="#94a3b8" strokeWidth={1.8} className="flow-line" markerEnd="url(#dapp-arrow)" fill="none" />
            )}
          </g>
        )
      })}
      <circle r={4.5} fill="#2563eb">
        <animateMotion dur="6s" repeatCount="indefinite" path="M 30 22 H 1030" />
      </circle>
    </svg>
  )
}

/* ── 5 · UE pentest features ───────────────────────────────────── */

const PENTEST_FEATURES = [
  ['🧪', 'Test scenario generation', 'UE security test scenarios built for controlled runs'],
  ['📶', 'Abnormal traffic simulation', 'suspicious UE-side traffic patterns under lab conditions'],
  ['🔑', 'Authentication failure patterns', 'repeated / malformed auth attempts to probe detection'],
  ['🕵️', 'Suspicious session behavior', 'session anomalies the CTI platform should flag'],
  ['📝', 'Logging & reporting', 'every test run recorded with outcomes'],
  ['🧭', 'Mapping to O-RAN threat intel', 'detected behavior linked to known CTI entries'],
] as const

export default function FuturePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Roadmap"
        title={
          <>
            Future work & <span className="grad-text">research extensions</span>
          </>
        }
        lead={
          <>
            The next planned improvements for the platform — making it more domain-aware, operationally useful for
            vendors and operators, and closer to real-world threat detection and mitigation.
          </>
        }
      />

      {/* 1 · domain-wise feeds */}
      <Block
        title={
          <>
            <NumberChip n={1} color="#16a34a" />
            Domain-wise threat intelligence feeds
          </>
        }
        intro={
          <>
            Today every Mini RAG keeps a separate regional knowledge base, but they all learn the same kind of
            intelligence. The next step is feeding each region CTI that matches its operational environment, so each
            regional Mini RAG becomes specialized in the threats its own RAN actually faces.
          </>
        }
      >
        <div className="card overflow-x-auto p-4">
          <DomainFeedsDiagram />
        </div>
      </Block>

      {/* 2 · subscriptions */}
      <Block
        title={
          <>
            <NumberChip n={2} color="#d97706" />
            Vendor & operator subscription system
          </>
        }
        intro={
          <>
            Vendors, mobile network operators, cybersecurity teams and other interested parties subscribe to one or
            more regions. Whenever a threat is detected, analyzed, mitigated or shared from a subscribed region, they
            receive an email notification — so they can act quickly instead of only watching the dashboard.
          </>
        }
      >
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_400px]">
          <div className="card overflow-x-auto p-4">
            <SubscriptionDiagram />
          </div>
          {/* email mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="card overflow-hidden"
          >
            <div className="flex items-center gap-1.5 border-b border-line bg-slate-50 px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-[11px] font-semibold text-slate-500">New threat notification</span>
            </div>
            <div className="border-b border-line px-4 py-2.5">
              <div className="text-[13px] font-bold">⚠️ CRITICAL threat mitigated in region_1</div>
              <div className="mt-0.5 text-[11px] text-slate-400">cti-platform · to region_1 subscribers</div>
            </div>
            <dl className="px-4 py-3">
              {EMAIL_FIELDS.map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
                  className="flex items-baseline gap-2 border-b border-dashed border-line py-1.5 last:border-0"
                >
                  <dt className="w-[126px] shrink-0 text-[10.5px] font-bold uppercase tracking-wide text-slate-400">
                    {k}
                  </dt>
                  <dd
                    className={`text-[11.5px] ${
                      k === 'Severity' ? 'font-extrabold text-rose-600' : 'text-slate-600'
                    }`}
                  >
                    {v}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </motion.div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
              Closing the loop — what gets recorded
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {FEEDBACK_METRICS.map(([title, desc], i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                  className="card card-hover p-3.5"
                >
                  <div className="text-[13px] font-bold">{title}</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="card card-hover border-l-4 border-l-amber-500 p-5">
            <h4 className="mb-2 font-bold">Why record all this?</h4>
            <p className="text-sm leading-relaxed text-slate-600">
              These records become training signals: they can be used to improve the RAG agents, evaluate mitigation
              quality, and refine future recommendations based on what operators actually found useful.
            </p>
          </div>
        </div>
      </Block>

      {/* 3 · immediate actions */}
      <Block
        title={
          <>
            <NumberChip n={3} color="#dc2626" />
            Highlight immediate actions from actionable insights
          </>
        }
        intro={
          <>
            The RAG agents already generate mitigation analysis and recommendations. The plan is to split them into
            two levels, so operators can respond without reading the full report first — both on the dashboard and in
            email notifications.
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="card overflow-hidden border-2 border-rose-200"
          >
            <div className="flex items-center gap-2.5 border-b border-rose-100 bg-rose-50 px-5 py-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-500 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-rose-600" />
              </span>
              <h3 className="font-extrabold text-rose-700">Take Action Now</h3>
              <span className="ml-auto rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                immediate
              </span>
            </div>
            <div className="flex flex-wrap gap-2 p-5">
              {IMMEDIATE_ACTIONS.map((a, i) => (
                <motion.span
                  key={a}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22, delay: i * 0.07 }}
                  className="rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-[12px] font-semibold text-rose-700"
                >
                  {a}
                </motion.span>
              ))}
            </div>
            <p className="border-t border-rose-100 px-5 py-3 text-xs leading-relaxed text-slate-500">
              Quick actions that reduce risk right away — surfaced in a dedicated panel on the dashboard and at the
              top of every notification email.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
            className="card overflow-hidden"
          >
            <div className="flex items-center gap-2.5 border-b border-line bg-slate-50 px-5 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
              <h3 className="font-extrabold text-slate-700">Detailed actions</h3>
              <span className="ml-auto rounded bg-slate-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                planned
              </span>
            </div>
            <ul className="space-y-2.5 p-5 text-sm leading-relaxed text-slate-600">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                Longer-term recommendations that need operator review before rollout
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                Changes requiring vendor support or coordination
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                Configuration changes with wider operational impact
              </li>
            </ul>
            <p className="border-t border-line px-5 py-3 text-xs leading-relaxed text-slate-500">
              Kept in the full mitigation report — reviewed after the immediate risk is contained.
            </p>
          </motion.div>
        </div>
      </Block>

      {/* 4 · dApp */}
      <Block
        title={
          <>
            <NumberChip n={4} color="#2563eb" />
            dApp for the end-to-end detection & mitigation pipeline
          </>
        }
        intro={
          <>
            A decentralized application that demonstrates the complete lifecycle: it simulates or generates controlled
            network traffic for O-RAN threat scenarios, passes it through the detection pipeline, produces the
            mitigation report and records the mitigation decision — leaving a verifiable evidence trail of detection
            and response that makes the full CTI lifecycle transparent and easy to demonstrate.
          </>
        }
      >
        <div className="card overflow-x-auto p-4">
          <DappPipelineDiagram />
        </div>
      </Block>

      {/* 5 · UE pentest tool */}
      <Block
        title={
          <>
            <NumberChip n={5} color="#7c3aed" />
            Penetration testing tool for User Equipment
          </>
        }
        intro={
          <>
            A controlled, authorized tool for evaluating User Equipment security — <strong>defensive testing
            only</strong>. It checks how UEs behave under controlled test scenarios and whether the CTI platform
            detects suspicious UE-side activity, with useful findings fed back into the mitigation pipeline.
          </>
        }
        className="pb-16"
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-700">
            ⚠️ Lab environment / authorized testbed only
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
            🛡️ Defensive evaluation — not offensive tooling
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PENTEST_FEATURES.map(([icon, title, desc], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
              className="card card-hover p-4"
            >
              <div className="mb-1.5 text-xl">{icon}</div>
              <div className="text-sm font-bold">{title}</div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
            </motion.div>
          ))}
        </div>
      </Block>
    </div>
  )
}
