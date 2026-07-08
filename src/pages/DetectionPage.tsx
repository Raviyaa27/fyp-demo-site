import DetectionSim from '../components/DetectionSim'
import { PageHeader, Block, FileBadge, Endpoint } from '../components/ui'

const checks: [string, React.ReactNode][] = [
  ['Similarity threshold', <>Vector similarity must exceed <code className="font-mono text-xs">STRICT_LOCAL_THRESHOLD</code></>],
  ['O-RAN component', 'The matched record must reference a relevant O-RAN component'],
  ['Interface relevance', 'The matched record must cover the affected interface (A1/E2/F1/…)'],
  ['Useful mitigation', 'The record must actually contain actionable mitigation steps'],
  ['Confidence', 'Overall answer confidence must be high enough'],
  ['Required fields', 'All required fields must be present in the local answer'],
]

export default function DetectionPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Main Live Demo Path"
        title={
          <>
            From simulated threat to <span className="grad-text">mitigation report</span>
          </>
        }
        lead={
          <>
            This is the end-to-end runtime path shown during the live demo — it runs identically and independently
            in each of the four regions. Press play to watch a threat travel through the pipeline, and toggle
            between a strong local match and a Global RAG escalation.
          </>
        }
      />

      <DetectionSim />

      <Block
        title="Mini RAG strict local decision logic"
        intro={
          <>
            A local answer is accepted <strong>only if every one of six strict checks passes</strong> — a single
            failure triggers escalation to Global RAG. This keeps regional answers trustworthy while guaranteeing
            weak matches always receive full-context global analysis.
          </>
        }
        className="mt-10"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card card-hover p-6">
            <h3 className="mb-4 font-bold">The six strict acceptance checks</h3>
            <ul className="space-y-3">
              {checks.map(([name, desc], i) => (
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
                <strong>only to that same region's</strong> KB (
                <code className="font-mono text-xs">data/region_N/threats.json</code>) and vector store. Duplicate
                learned records are avoided, and the Global RAG database is never modified by this learning step.
              </p>
            </div>
            <div className="card card-hover border-l-4 border-l-rose-600 p-5">
              <h4 className="mb-2 font-bold">Escalation target: Global RAG</h4>
              <p className="mb-2 text-sm leading-relaxed text-slate-600">
                Escalation uses the existing MCP / Global RAG API. Global RAG performs full-context semantic search
                and returns structured mitigation recommendations.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Endpoint>global_rag.analyze_threat</Endpoint>
                <Endpoint>/api/analyze</Endpoint>
              </div>
            </div>
            <div className="card card-hover p-5">
              <h4 className="mb-2 font-bold">Mini RAG service files</h4>
              <div className="flex flex-wrap gap-1.5">
                <FileBadge>app/main.py</FileBadge>
                <FileBadge>app/services/rag_service.py</FileBadge>
                <FileBadge>app/services/knowledge_base.py</FileBadge>
                <FileBadge>app/services/mcp_client.py</FileBadge>
                <FileBadge>app/services/rapp2_client.py</FileBadge>
                <FileBadge>app/config.py</FileBadge>
                <FileBadge>app/models.py</FileBadge>
                <FileBadge>k8s/mini-rag-region-1…4.yaml</FileBadge>
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block title="The ThreatEvent contract" className="pb-16">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card overflow-hidden">
            <div className="border-b border-line bg-slate-50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              xApp1 → Mini RAG payload
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed text-slate-700">{`{
  "threat_id":        "thr-e2-flood-0042",
  "region_id":        "region_1",
  "source":           "xapp2_threat_simulator",
  "target_component": "Near-RT RIC",
  "interface":        "E2",
  "description":      "E2 interface flooding detected",
  "indicators":       ["high msg rate", "repeated subscriptions"],
  "metrics":          { "msg_rate": 4200, "baseline": 300 },
  "timestamp":        "2026-01-15T10:24:31Z"
}`}</pre>
          </div>
          <div className="card card-hover p-6">
            <h3 className="mb-3 font-bold">Simulated threat classes</h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="mt-0.5 rounded bg-rose-100 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-700">A1</span>
                Malformed policy requests targeting the A1 policy interface between Non-RT and Near-RT RIC.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 rounded bg-amber-100 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-700">F1</span>
                Unauthorized access attempts on the F1 midhaul interface between O-CU and O-DU.
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-blue-700">E2</span>
                Flooding of the E2 interface that connects the Near-RT RIC to RAN nodes.
              </li>
            </ul>
            <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-slate-600">
              After analysis, xApp1 receives the Mini RAG result and keeps recent event history for demo
              visibility, while the event and mitigation report are persisted to rApp2.
            </p>
          </div>
        </div>
      </Block>
    </div>
  )
}
