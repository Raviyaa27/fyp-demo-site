import { Section, FileBadge, Endpoint } from '../components/ui'

const checks = [
  ['Similarity threshold', 'Vector similarity must exceed STRICT_LOCAL_THRESHOLD'],
  ['O-RAN component', 'The matched record must reference a relevant O-RAN component'],
  ['Interface relevance', 'The matched record must cover the affected interface (A1/E2/F1/…)'],
  ['Useful mitigation', 'The record must actually contain actionable mitigation steps'],
  ['Confidence', 'Overall answer confidence must be high enough'],
  ['Required fields', 'All required fields must be present in the local answer'],
]

export default function MiniRagSection() {
  return (
    <Section
      id="mini-rag"
      kicker="Section 4 · Regional Intelligence"
      title="Mini RAG — Strict Local Decision Logic"
      intro={
        <>
          Each of the four Mini RAG agents (<FileBadge>k8s/mini-rag-region-1.yaml</FileBadge> …{' '}
          <FileBadge>mini-rag-region-4.yaml</FileBadge>) answers from its own regional knowledge first. A local
          answer is accepted <strong>only if every strict check passes</strong>; a single failure triggers
          escalation to Global RAG. This keeps regional answers trustworthy while guaranteeing weak matches always
          get full-context global analysis.
        </>
      }
    >
      {/* decision branch diagram */}
      <div className="card mb-10 overflow-x-auto p-4">
        <svg viewBox="0 0 1000 340" className="min-w-[760px]" role="img" aria-label="Mini RAG decision branches">
          <defs>
            <marker id="mg" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0L10 5L0 10z" fill="#059669" />
            </marker>
            <marker id="mr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0L10 5L0 10z" fill="#be123c" />
            </marker>
            <marker id="mb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0L10 5L0 10z" fill="#1d4ed8" />
            </marker>
          </defs>
          <rect x={30} y={130} width={190} height={70} rx={10} fill="white" stroke="#1d4ed8" strokeWidth={1.5} />
          <text x={125} y={160} textAnchor="middle" fontSize={13} fontWeight={700}>ThreatEvent arrives</text>
          <text x={125} y={180} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#64748b">/api/v1/analyze-threat</text>

          <line x1={220} y1={165} x2={280} y2={165} stroke="#1d4ed8" strokeWidth={2} className="flow-line" markerEnd="url(#mb)" />

          <g>
            <polygon points="395,105 510,165 395,225 280,165" fill="#eff6ff" stroke="#1d4ed8" strokeWidth={1.5} />
            <text x={395} y={158} textAnchor="middle" fontSize={12} fontWeight={700}>All strict local</text>
            <text x={395} y={176} textAnchor="middle" fontSize={12} fontWeight={700}>checks pass?</text>
          </g>

          <line x1={510} y1={165} x2={600} y2={80} stroke="#059669" strokeWidth={2} className="flow-line" markerEnd="url(#mg)" />
          <text x={545} y={105} fontSize={11} fontWeight={700} fill="#059669">YES</text>
          <rect x={602} y={40} width={360} height={80} rx={10} fill="#ecfdf5" stroke="#059669" strokeWidth={1.5} />
          <text x={782} y={72} textAnchor="middle" fontSize={13} fontWeight={700} fill="#065f46">Return local mitigation</text>
          <text x={782} y={95} textAnchor="middle" fontSize={11} fill="#065f46">Answer built purely from this region's KB / vector DB</text>

          <line x1={510} y1={165} x2={600} y2={250} stroke="#be123c" strokeWidth={2} className="flow-line" markerEnd="url(#mr)" />
          <text x={538} y={220} fontSize={11} fontWeight={700} fill="#be123c">NO</text>
          <rect x={602} y={212} width={360} height={110} rx={10} fill="#fff1f2" stroke="#be123c" strokeWidth={1.5} />
          <text x={782} y={240} textAnchor="middle" fontSize={13} fontWeight={700} fill="#9f1239">Escalate to Global RAG</text>
          <text x={782} y={262} textAnchor="middle" fontSize={11} fill="#9f1239">via MCP tool global_rag.analyze_threat / /api/analyze</text>
          <text x={782} y={284} textAnchor="middle" fontSize={11} fill="#9f1239">Useful answer is learned back into THIS region only,</text>
          <text x={782} y={302} textAnchor="middle" fontSize={11} fill="#9f1239">skipping duplicates — no other region is updated</text>
        </svg>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 font-bold">The six strict local-acceptance checks</h3>
          <ul className="space-y-3">
            {checks.map(([name, desc], i) => (
              <li key={name} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <span>
                  <strong>{name}.</strong>{' '}
                  <span className="text-slate-600">
                    {name === 'Similarity threshold' ? (
                      <>
                        Vector similarity must exceed <code className="font-mono text-xs">STRICT_LOCAL_THRESHOLD</code>
                      </>
                    ) : (
                      desc
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <div className="card border-l-4 border-l-region2 p-5">
            <h4 className="mb-2 font-bold">Regional isolation guarantee</h4>
            <p className="text-sm leading-relaxed text-slate-600">
              Regions 1–4 remain fully isolated. A Mini RAG only ever searches its own vector DB, and learning
              from a Global RAG escalation writes <strong>only to that same region's</strong> KB (
              <code className="font-mono text-xs">data/region_N/threats.json</code>) and vector store. The Global
              RAG database itself is never modified by this learning step.
            </p>
          </div>
          <div className="card border-l-4 border-l-global p-5">
            <h4 className="mb-2 font-bold">Global RAG — the escalation target</h4>
            <p className="mb-2 text-sm leading-relaxed text-slate-600">
              The Global RAG holds the complete threat knowledge base (
              <code className="font-mono text-xs">rag/data/threat_knowledge_base.json</code> + ChromaDB at{' '}
              <code className="font-mono text-xs">rag/data/chromadb</code>). It performs full-context semantic
              search over the global vector DB, generates mitigation analysis, and returns structured
              recommendations to the escalating Mini RAG.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Endpoint>/api/analyze</Endpoint>
              <Endpoint>/mcp</Endpoint>
              <Endpoint>global_rag.analyze_threat</Endpoint>
              <Endpoint>global_rag.report_local_intel</Endpoint>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <FileBadge>rag/api_server.py</FileBadge>
              <FileBadge>rag_agent.py</FileBadge>
              <FileBadge>threat_knowledge_base.py</FileBadge>
              <FileBadge>data_transformer.py</FileBadge>
            </div>
          </div>
          <div className="card p-5">
            <h4 className="mb-2 font-bold">Mini RAG service files</h4>
            <div className="flex flex-wrap gap-1.5">
              <FileBadge>app/main.py</FileBadge>
              <FileBadge>app/services/rag_service.py</FileBadge>
              <FileBadge>app/services/knowledge_base.py</FileBadge>
              <FileBadge>app/services/mcp_client.py</FileBadge>
              <FileBadge>app/services/rapp2_client.py</FileBadge>
              <FileBadge>app/config.py</FileBadge>
              <FileBadge>app/models.py</FileBadge>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
