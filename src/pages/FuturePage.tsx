import { motion } from 'framer-motion'
import { PageHeader, Block } from '../components/ui'

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

/* ── 1 · dApp pipeline ─────────────────────────────────────────── */

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

/* ── 2 · UE pentest features ───────────────────────────────────── */

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
            Three items from the original proposal have since been built and now appear in the main walkthrough:
            domain-specific regional feeds, the subscription and notification service, and the split between
            immediate and detailed mitigation actions. These two remain ahead of us.
          </>
        }
      />

      {/* 1 · dApp */}
      <Block
        title={
          <>
            <NumberChip n={1} color="#2563eb" />
            dApp for the end-to-end detection & mitigation pipeline
          </>
        }
        intro={
          <>
            A decentralized application that demonstrates the complete lifecycle: it simulates or generates controlled
            network traffic for O-RAN threat scenarios, passes it through the detection pipeline, produces the
            mitigation report and records the mitigation decision, leaving a verifiable evidence trail of detection
            and response that makes the full CTI lifecycle transparent and easy to demonstrate.
          </>
        }
      >
        <div className="card overflow-x-auto p-4">
          <DappPipelineDiagram />
        </div>
      </Block>

      {/* 2 · UE pentest tool */}
      <Block
        title={
          <>
            <NumberChip n={2} color="#7c3aed" />
            Penetration testing tool for User Equipment
          </>
        }
        intro={
          <>
            A controlled, authorized tool for evaluating User Equipment security, strictly for <strong>defensive testing
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
            🛡️ Defensive evaluation, not offensive tooling
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
