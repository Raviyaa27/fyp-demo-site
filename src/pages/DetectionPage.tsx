import { motion } from 'framer-motion'
import DetectionSim from '../components/DetectionSim'
import { PageHeader, Block, FileBadge, Endpoint } from '../components/ui'

const EASE = [0.22, 1, 0.36, 1] as const

const SOURCES = [
  ['Prometheus', '#d97706', 'metric thresholds and baseline anomalies, delivered through Alertmanager'],
  ['Loki / LogQL', '#7c3aed', 'log patterns: auth failure bursts, PDU session rejects, crash signatures'],
  ['Falco', '#e11d48', 'container runtime security: unexpected shells and process activity'],
  ['E2SM-KPM', '#16a34a', 'RAN performance measurements streamed from the E2 nodes'],
] as const

const PROM_RULES = [
  ['OranKpmDecodeErrors', 'E2', 'KPM indication messages failing to decode'],
  ['OranKpmStreamStalled', 'E2', 'no KPM report for more than 15 s'],
  ['OranSubscriptionFailureBurst', 'E2', 'three or more subscription errors in 5 min'],
  ['OranControlFailure', 'E2', 'any RIC Control failure in 5 min'],
  ['OranControlSubmissionBurst', 'E2', 'five or more control actions in 1 min'],
  ['OranKpmThroughputBaselineAnomaly', 'E2', 'throughput deviating from its learned baseline'],
  ['OranRmrIndicationUnmatched', 'E2', 'unmatched or undecodable RMR indications'],
  ['OranXappInvalidApiBurst', 'xApp', 'five or more invalid xApp API events in 5 min'],
  ['OranPodMemoryLimitPressure', 'O-Cloud', 'container approaching its memory limit'],
  ['OranPodMemoryBaselineAnomaly', 'O-Cloud', 'memory deviating from baseline'],
  ['OranPodRestartBurst', 'O-Cloud', 'two or more restarts in 10 min'],
] as const

const LOKI_RULES = [
  ['ORANRegionalAuthenticationFailureBurst', 'repeated authentication failures in the regional logs'],
  ['ORANRegionalRepeatedPDUSessionReject', 'the 5G core rejecting PDU sessions repeatedly'],
  ['ORANRegionalRMRNoEndpoint', 'RMR routing failing to resolve an endpoint'],
  ['ORANRegionalRuntimeCrashSignature', 'crash signatures appearing in workload logs'],
] as const

const CHECKS: [string, React.ReactNode][] = [
  ['Similarity threshold', <>Vector similarity must clear the region's routing threshold (<code className="font-mono text-xs">0.69</code> in the active manifests)</>],
  ['O-RAN component', 'The matched record must reference a relevant O-RAN component'],
  ['Interface relevance', 'The matched record must cover the affected interface (A1/E2/F1/O1)'],
  ['Useful mitigation', 'The record must actually contain actionable mitigation steps'],
  ['Confidence', 'Overall answer confidence must be high enough'],
  ['Required fields', 'All seven report sections must be present in the local answer'],
]

/** Evidence fan-in to the correlator, then on to Mini RAG and the controller */
function GatewayDiagram() {
  return (
    <svg viewBox="0 0 1040 380" className="min-w-[900px]" role="img" aria-label="Anomaly detection gateway flow">
      <defs>
        <marker id="gw-a" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#64748b" />
        </marker>
        <marker id="gw-b" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="#2563eb" />
        </marker>
      </defs>

      {SOURCES.map(([name, color, ,], i) => {
        const y = 26 + i * 84
        const path = `M 214 ${y + 30} C 290 ${y + 30}, 300 190, 372 190`
        return (
          <g key={name}>
            <rect x={24} y={y} width={190} height={60} rx={12} fill={`${color}0d`} stroke={color} strokeWidth={1.5} />
            <text x={119} y={y + 27} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">
              {name}
            </text>
            <text x={119} y={y + 45} textAnchor="middle" fontSize={9.5} fill="#64748b">
              evidence source
            </text>
            <path d={path} fill="none" stroke="#94a3b8" strokeWidth={1.6} markerEnd="url(#gw-a)" />
            <circle r={3.6} fill={color}>
              <animateMotion dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" path={path} />
            </circle>
          </g>
        )
      })}

      <rect x={374} y={126} width={250} height={128} rx={14} fill="#eff6ff" stroke="#2563eb" strokeWidth={2} />
      <text x={499} y={155} textAnchor="middle" fontSize={14.5} fontWeight={700} fill="#1e3a8a">
        Anomaly Detection Gateway
      </text>
      <text x={499} y={175} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#2563eb">
        security/correlator/app.py
      </text>
      {['normalise to one schema', 'deduplicate by fingerprint', 'correlate over a 300 s window', 'score, then forward'].map(
        (t, i) => (
          <text key={t} x={499} y={196 + i * 15} textAnchor="middle" fontSize={10} fill="#475569">
            {t}
          </text>
        ),
      )}

      <path d="M 626 168 H 792" stroke="#2563eb" strokeWidth={2} fill="none" markerEnd="url(#gw-b)" />
      <circle r={4} fill="#2563eb">
        <animateMotion dur="2s" repeatCount="indefinite" path="M 626 168 H 792" />
      </circle>
      <text x={709} y={158} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#2563eb">
        /api/v1/analyze-threat
      </text>
      <rect x={794} y={138} width={220} height={62} rx={12} fill="#16a34a0d" stroke="#16a34a" strokeWidth={1.5} />
      <text x={904} y={165} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">
        Regional Mini-RAG
      </text>
      <text x={904} y={183} textAnchor="middle" fontSize={9.5} fill="#64748b">
        contextualise and decide
      </text>

      <path d="M 626 212 H 792" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6 5" fill="none" markerEnd="url(#gw-b)" />
      <circle r={4} fill="#7c3aed">
        <animateMotion dur="2.4s" begin="0.8s" repeatCount="indefinite" path="M 626 212 H 792" />
      </circle>
      <text x={709} y={232} textAnchor="middle" fontSize={10} fill="#7c3aed">
        mitigation dispatch
      </text>
      <rect x={794} y={222} width={220} height={62} rx={12} fill="#7c3aed0d" stroke="#7c3aed" strokeWidth={1.5} />
      <text x={904} y={249} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">
        Mitigation Controller
      </text>
      <text x={904} y={267} textAnchor="middle" fontSize={9.5} fill="#64748b">
        only on HIGH / CRITICAL
      </text>

      <text x={24} y={368} fontSize={10} fill="#94a3b8">
        Suricata, Zeek and Kubernetes audit events use the same normalised schema.
      </text>
    </svg>
  )
}

export default function DetectionPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Detection"
        title={
          <>
            Four evidence sources, one <span className="grad-text">transparent schema</span>
          </>
        }
        lead={
          <>
            Each region runs a security correlator that turns heterogeneous telemetry into a single normalised threat
            event. It records the rule that fired, the criterion, the measured value and the threshold independently
            of any AI explanation, so an operator can always see why an event exists.
          </>
        }
      />

      <div className="card overflow-x-auto p-4">
        <GatewayDiagram />
      </div>

      <Block title="What each source contributes" className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {SOURCES.map(([name, color, desc], i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.07, ease: EASE }}
              className="card card-hover p-5"
              style={{ borderTop: `3px solid ${color}` }}
            >
              <h3 className="font-bold">{name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <FileBadge>security/correlator/app.py</FileBadge>
          <FileBadge>security/kubernetes/detection-rules.yaml</FileBadge>
          <FileBadge>security/kubernetes/loki-rules-region1.yaml</FileBadge>
          <FileBadge>security/falco-values.yaml</FileBadge>
          <FileBadge>security/kubernetes/correlator.yaml</FileBadge>
        </div>
      </Block>

      <Block
        title="The deployed detection rules"
        intro="These are the alerts that actually fire in the testbed, not illustrative examples. Every one carries its rule name into the normalised event, so the dashboard can show the exact criterion that triggered."
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_460px]">
          <div className="card overflow-hidden">
            <div className="border-b border-line bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Prometheus rules
            </div>
            <div className="divide-y divide-line">
              {PROM_RULES.map(([name, scope, desc]) => (
                <div key={name} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-2.5">
                  <code className="font-mono text-[11.5px] font-semibold text-accent">{name}</code>
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {scope}
                  </span>
                  <span className="text-xs text-slate-600">{desc}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card overflow-hidden">
              <div className="border-b border-line bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                Loki / LogQL rules
              </div>
              <div className="divide-y divide-line">
                {LOKI_RULES.map(([name, desc]) => (
                  <div key={name} className="px-5 py-2.5">
                    <code className="block font-mono text-[11.5px] font-semibold text-violet-700">{name}</code>
                    <span className="text-xs text-slate-600">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card card-hover border-l-4 border-l-emerald-600 p-5">
              <h4 className="mb-2 font-bold">Explainable without the AI</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                The rule, criterion, measured value, threshold and correlation disposition are stored separately from
                the generated explanation. If every language-model provider is unreachable, the event still stands on
                its own evidence and severity falls back to the rule.
              </p>
            </div>
          </div>
        </div>
      </Block>

      <Block
        title="Watch a threat travel the pipeline"
        intro="The same path runs independently in each region. Toggle between a strong local match and a Global RAG escalation."
      >
        <DetectionSim />
      </Block>

      <Block
        title="Mini-RAG strict local decision logic"
        intro={
          <>
            A local answer is accepted <strong>only if every one of six strict checks passes</strong>. A single
            failure triggers escalation to Global RAG, which keeps regional answers trustworthy while guaranteeing
            that weak matches always receive full-context global analysis.
          </>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card card-hover p-6">
            <h3 className="mb-4 font-bold">The six strict acceptance checks</h3>
            <ul className="space-y-3">
              {CHECKS.map(([name, desc], i) => (
                <li key={name} className="flex gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-accent">
                    {i + 1}
                  </span>
                  <span>
                    <strong>{name}.</strong> <span className="text-slate-600">{desc}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="card card-hover border-l-4 border-l-emerald-500 p-5">
              <h4 className="mb-2 font-bold">Regional isolation guarantee</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                A Mini RAG only ever searches its own vector DB, and learning from a Global RAG escalation writes{' '}
                <strong>only to that same region's</strong> knowledge base and vector store. Duplicate learned records
                are avoided, and the Global RAG database is never modified by this learning step.
              </p>
            </div>
            <div className="card card-hover border-l-4 border-l-rose-600 p-5">
              <h4 className="mb-2 font-bold">Every answer is a seven-section report</h4>
              <p className="mb-3 text-sm leading-relaxed text-slate-600">
                Threat Identification, Attack Pattern &amp; Kill Chain, O-RAN Impact Assessment, Evidence Correlation,
                Immediate Actions, Detailed Mitigations and Severity Assessment. A response missing more than one
                section is rejected as malformed.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Endpoint>global_rag.analyze_threat</Endpoint>
                <Endpoint>POST /api/analyze</Endpoint>
              </div>
            </div>
            <div className="card card-hover p-5">
              <h4 className="mb-2 font-bold">Mini RAG service files</h4>
              <div className="flex flex-wrap gap-1.5">
                <FileBadge>app/main.py</FileBadge>
                <FileBadge>app/services/rag_service.py</FileBadge>
                <FileBadge>app/services/knowledge_base.py</FileBadge>
                <FileBadge>app/services/severity.py</FileBadge>
                <FileBadge>app/services/payload_reduction.py</FileBadge>
                <FileBadge>app/services/mcp_client.py</FileBadge>
                <FileBadge>app/services/rapp2_client.py</FileBadge>
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block title="The Mini-RAG API surface" className="pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card card-hover p-6">
            <h3 className="mb-3 font-bold">Endpoints</h3>
            <div className="flex flex-col items-start gap-2">
              <div>
                <Endpoint>POST /api/v1/analyze-threat</Endpoint>
                <span className="ml-2 text-xs text-slate-500">the live detection path</span>
              </div>
              <div>
                <Endpoint>POST /api/v1/evaluate-threat</Endpoint>
                <span className="ml-2 text-xs text-slate-500">benchmark scoring, read-only</span>
              </div>
              <div>
                <Endpoint>POST /api/v1/check-threat-intel</Endpoint>
                <span className="ml-2 text-xs text-slate-500">peer de-duplication check</span>
              </div>
              <div>
                <Endpoint>POST /api/v1/ingest-local-knowledge</Endpoint>
                <span className="ml-2 text-xs text-slate-500">accept shared intel</span>
              </div>
              <div>
                <Endpoint>POST /api/v1/intelligence/snapshot</Endpoint>
                <span className="ml-2 text-xs text-slate-500">capture KB state for a session</span>
              </div>
              <div>
                <Endpoint>POST /api/v1/reload-knowledge-base</Endpoint>
                <span className="ml-2 text-xs text-slate-500">re-index after ingest</span>
              </div>
              <div>
                <Endpoint>GET /metrics</Endpoint>
                <span className="ml-2 text-xs text-slate-500">Prometheus scrape target</span>
              </div>
            </div>
          </div>
          <div className="card overflow-hidden">
            <div className="border-b border-line bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              Normalised threat event
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-slate-700">{`{
  "threat_id":        "region_1-34f21ce618ca",
  "region_id":        "region_1",
  "source":           "prometheus",
  "rule":             "OranControlFailure",
  "target_component": "Near-RT RIC",
  "interface":        "E2",
  "measured_value":   4200,
  "threshold":        300,
  "correlation":      { "score": 0.82, "related": 3 },
  "experiment_id":    "anom150-day3-slot17",
  "simulation":       true,
  "timestamp":        "2026-07-28T09:39:20Z"
}`}</pre>
          </div>
        </div>
      </Block>
    </div>
  )
}
