import { motion } from 'framer-motion'
import { PageHeader, Block, FileBadge, Endpoint } from '../components/ui'

const EASE = [0.22, 1, 0.36, 1] as const

const STATES = ['pending', 'approved', 'executing', 'executed', 'verifying', 'verified'] as const
const TERMINALS = [
  ['rejected', 'a gate refused the candidate', '#64748b'],
  ['expired', 'not approved inside the 300 s TTL', '#64748b'],
  ['failed', 'the actuator or verification failed', '#e11d48'],
  ['rolled_back', 'verification failed, the action was reversed', '#d97706'],
] as const

const ACTUATORS = [
  {
    id: 'rc',
    name: 'E2SM-RC throttle',
    color: '#2563eb',
    what: 'A PRB / slice throttle on the offending UE, submitted through xApp1 over E2.',
    note: 'Submission returns 202 immediately, so the controller confirms the real outcome from xApp1 control metrics rather than trusting the accept.',
  },
  {
    id: 'ue_access',
    name: 'UE access revocation',
    color: '#16a34a',
    what: 'Deprovisions the offending subscriber in the 5G core, addressed by IMSI from an explicit allow-list.',
    note: 'This is the routing that actually contains a UE on this testbed, because srsRAN answers an E2SM-RC control request with RIC Control Failure.',
  },
  {
    id: 'quarantine',
    name: 'Pod quarantine',
    color: '#d97706',
    what: 'A reversible Kubernetes NetworkPolicy label that isolates a disposable workload.',
    note: 'Opt-in only: a pod must advertise security.oran/quarantine-eligible, and critical components are always refused.',
  },
  {
    id: 'credential',
    name: 'Credential rotation',
    color: '#7c3aed',
    what: 'Rotates a named key inside a named, allow-listed Kubernetes Secret.',
    note: 'The target is supplied per request and bounded by an allow-list, so a mis-addressed request is refused rather than acted on.',
  },
  {
    id: 'a1',
    name: 'A1 policy',
    color: '#be123c',
    what: 'An admission-control policy pushed over the A1 interface for signalling and policy abuse.',
    note: 'Never auto-approved under any configuration. A1 always requires an operator.',
  },
]

const ROUTING = [
  ['UE-attributed throughput abuse', 'ue_access / rc', '#16a34a'],
  ['Signalling or subscription storm, A1 policy abuse', 'a1', '#be123c'],
  ['Authentication failure burst', 'credential', '#7c3aed'],
  ['Compromised, disposable workload', 'quarantine', '#d97706'],
] as const

const GATES = [
  ['Decision class', 'Only LOCAL_RESPONSE and LOCAL_RESPONSE_AND_REPORT are eligible for automatic execution.'],
  ['Confidence floor', 'The analysis must reach MIN_CONFIDENCE (0.85). A Global-RAG confidence is never promoted into a local one.'],
  ['Severity', 'Dispatch is limited to HIGH and CRITICAL findings.'],
  ['Target eligibility', 'The target must be a real, actionable entity. Hosts, the O-Cloud and unknown entities are refused.'],
  ['Protected components', 'mini-rag-agent, oran-mitigation-controller and xapp1-probe-manager can never be quarantined.'],
  ['Experiment binding', 'Every candidate carries an experiment id and a simulation flag, so test actions stay auditable.'],
] as const

function Lifecycle() {
  return (
    <svg viewBox="0 0 1040 250" className="min-w-[900px]" role="img" aria-label="Mitigation lifecycle state machine">
      <defs>
        <marker id="mit-a" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#94a3b8" />
        </marker>
      </defs>
      {STATES.map((s, i) => {
        const x = 18 + i * 170
        const last = i === STATES.length - 1
        return (
          <g key={s}>
            <rect
              x={x} y={40} width={150} height={54} rx={12}
              fill={last ? '#16a34a' : '#ffffff'}
              stroke={last ? '#16a34a' : '#cbd5e1'}
              strokeWidth={1.6}
            />
            <text x={x + 75} y={73} textAnchor="middle" fontSize={13} fontFamily="monospace" fontWeight={700}
                  fill={last ? '#ffffff' : '#0f172a'}>
              {s}
            </text>
            {i < STATES.length - 1 && (
              <>
                <path d={`M ${x + 152} 67 H ${x + 168}`} stroke="#94a3b8" strokeWidth={2} fill="none" markerEnd="url(#mit-a)" />
                <circle r={3} fill="#2563eb">
                  <animateMotion dur="1.6s" begin={`${i * 0.25}s`} repeatCount="indefinite" path={`M ${x + 152} 67 H ${x + 166}`} />
                </circle>
              </>
            )}
          </g>
        )
      })}
      <text x={18} y={132} fontSize={11.5} fontWeight={700} fill="#475569">
        Terminal states
      </text>
      {TERMINALS.map(([name, desc, col], i) => {
        const x = 18 + i * 256
        return (
          <g key={name}>
            <rect x={x} y={146} width={238} height={50} rx={10} fill={`${col}0d`} stroke={col} strokeWidth={1.4} />
            <text x={x + 14} y={168} fontSize={12} fontFamily="monospace" fontWeight={700} fill={col}>
              {name}
            </text>
            <text x={x + 14} y={185} fontSize={9.5} fill="#64748b">
              {desc}
            </text>
          </g>
        )
      })}
      <text x={18} y={228} fontSize={10} fill="#94a3b8">
        Every transition is persisted, so an issued command is never reported as a security outcome on its own.
      </text>
    </svg>
  )
}

export default function MitigationPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Guarded Response"
        title={
          <>
            A recommendation is not <span className="grad-text">execution authority</span>
          </>
        }
        lead={
          <>
            When a regional analysis recommends a local response to a high-severity finding, the correlator hands a
            structured request to a separate mitigation controller. The controller holds the actuation credentials,
            enforces deterministic gates, verifies the effect against live telemetry and rolls back when the effect
            cannot be confirmed.
          </>
        }
      />

      <div className="card overflow-x-auto p-4">
        <Lifecycle />
      </div>

      <Block
        title="Five actuators behind one abstraction"
        intro="Each finding is routed to the actuator that can actually contain it. The controller validates the request, executes, then proves the effect."
        className="mt-6"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ACTUATORS.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
              className="card card-hover flex flex-col p-5"
              style={{ borderTop: `3px solid ${a.color}` }}
            >
              <div className="mb-1 flex items-center justify-between gap-2">
                <h3 className="font-bold">{a.name}</h3>
                <code className="rounded bg-slate-800 px-2 py-0.5 font-mono text-[10.5px] text-emerald-300">{a.id}</code>
              </div>
              <p className="mb-3 text-sm leading-relaxed text-slate-600">{a.what}</p>
              <p className="mt-auto border-t border-line pt-3 text-xs leading-relaxed text-slate-500">{a.note}</p>
            </motion.div>
          ))}
          <div className="card border-2 border-dashed border-line p-5">
            <h3 className="mb-2 font-bold text-slate-500">How a finding is routed</h3>
            <ul className="space-y-2">
              {ROUTING.map(([sig, act, col]) => (
                <li key={act} className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="text-slate-600">{sig}</span>
                  <code className="shrink-0 font-mono font-bold" style={{ color: col }}>
                    {act}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Block>

      <Block title="The gates every candidate must pass">
        <div className="grid gap-4 lg:grid-cols-[1fr_400px]">
          <div className="grid gap-3 sm:grid-cols-2">
            {GATES.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
                className="card card-hover p-4"
              >
                <div className="text-sm font-bold">{t}</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="card card-hover border-l-4 border-l-rose-600 p-5">
              <h4 className="mb-2 font-bold">Why protected targets exist</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                An early, broader policy once quarantined one of the platform's own Mini-RAG pods. Target eligibility
                and critical-component denial were made explicit in response, so the response loop can never cut off
                its own detector, intelligence or mitigation services.
              </p>
            </div>
            <div className="card card-hover border-l-4 border-l-emerald-600 p-5">
              <h4 className="mb-2 font-bold">Verification, then rollback</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                After an 8 s settle interval the controller runs a PromQL query to confirm the effect actually
                happened. If it cannot be confirmed the action is reversed automatically. A candidate that executed
                but failed verification is recorded as{' '}
                <code className="font-mono text-xs">executed_unverified</code> and never counts as a success.
              </p>
            </div>
          </div>
        </div>
      </Block>

      <Block title="Controller interface" className="pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card card-hover min-w-0 p-6">
            <h3 className="mb-3 font-bold">Endpoints</h3>
            <div className="flex flex-col items-start gap-2">
              <div>
                <Endpoint>POST /api/v1/mitigations</Endpoint>
                <span className="ml-2 text-xs text-slate-500">submit a candidate</span>
              </div>
              <div>
                <Endpoint>GET /api/v1/mitigations</Endpoint>
                <span className="ml-2 text-xs text-slate-500">list candidates and their lifecycle</span>
              </div>
              <div>
                <Endpoint>GET /api/v1/mitigations/{'{id}'}</Endpoint>
                <span className="ml-2 text-xs text-slate-500">one candidate with full history</span>
              </div>
              <div>
                <Endpoint>POST /internal/mitigation/lifecycle</Endpoint>
                <span className="ml-2 text-xs text-slate-500">streams state changes to the dashboard</span>
              </div>
              <div>
                <Endpoint>GET /metrics</Endpoint>
                <span className="ml-2 text-xs text-slate-500">Prometheus counters</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line pt-4">
              <FileBadge>security/mitigation-controller/app.py</FileBadge>
              <FileBadge>security/kubernetes/mitigation-controller.yaml</FileBadge>
              <FileBadge>security/kubernetes/quarantine-policy.yaml</FileBadge>
              <FileBadge>security/kubernetes/gen_mitigation_controllers.py</FileBadge>
            </div>
          </div>
          <div className="card card-hover min-w-0 border-l-4 border-l-violet-500 p-6">
            <h3 className="mb-3 font-bold">Separation of authority</h3>
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              The correlator detects and the language model explains, but neither can act. Actuation credentials live
              only in the controller, which is deployed per region with its own Role and its own allow-lists.
            </p>
            <div className="overflow-x-auto rounded-xl bg-slate-800 p-4 font-mono text-[12px] leading-relaxed text-slate-200">
              <div className="text-slate-400">// what the controller checks first</div>
              <div className="whitespace-nowrap">
                actuator <span className="text-emerald-300">in</span> {'{'}rc, ue_access, quarantine, credential, a1{'}'}
              </div>
              <div>
                decision <span className="text-emerald-300">in</span> {'{'}LOCAL_RESPONSE, …_AND_REPORT{'}'}
              </div>
              <div>
                confidence ≥ <span className="text-amber-300">0.85</span>
              </div>
              <div>
                severity <span className="text-emerald-300">in</span> {'{'}HIGH, CRITICAL{'}'}
              </div>
              <div>
                target <span className="text-rose-300">not</span> protected
              </div>
            </div>
          </div>
        </div>
      </Block>
    </div>
  )
}
