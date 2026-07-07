import { Section, Stepper, Endpoint, RegionChip } from '../components/ui'

const steps = [
  {
    title: 'xApp2 generates a simulated O-RAN threat',
    badge: 'xapp2_threat_simulator.py',
    body: 'Examples: A1 malformed policy requests, F1 unauthorized access, E2 interface flooding.',
  },
  {
    title: 'xApp2 posts the event to xApp1 Cyber Probe Manager',
    body: (
      <>
        Raw event delivered to <Endpoint>POST /api/events</Endpoint> on xApp1.
      </>
    ),
  },
  {
    title: 'xApp1 normalizes the payload into a ThreatEvent',
    badge: 'xapp1_probe_manager_new.py',
    body: (
      <>
        Fields: <code className="font-mono text-xs">threat_id, region_id, source, target_component, interface,
        description, indicators, metrics, timestamp</code>.
      </>
    ),
  },
  {
    title: 'xApp1 forwards the event to the regional Mini RAG',
    body: (
      <>
        <Endpoint>POST /api/v1/analyze-threat</Endpoint> on the Mini RAG that belongs to the same region.
      </>
    ),
  },
  {
    title: 'Mini RAG searches its local regional KB first',
    badge: 'app/services/rag_service.py',
    body: 'Semantic search against the regional vector DB only — never against other regions.',
  },
  {
    title: 'Strong local match → local mitigation returned',
    color: '#059669',
    body: 'If all strict checks pass (see Section 4), the answer comes entirely from regional knowledge.',
  },
  {
    title: 'Weak local match → escalate to Global RAG',
    color: '#be123c',
    badge: 'app/services/mcp_client.py',
    body: 'Escalation uses the MCP / Global RAG API. Global RAG returns full mitigation intelligence from the global knowledge base.',
  },
  {
    title: 'Mini RAG learns the useful global answer locally',
    body: 'The learned record is stored only in this region’s KB and vector DB — other regions and the Global RAG DB are untouched, and duplicates are avoided.',
  },
  {
    title: 'Mini RAG builds the mitigation report',
    body: 'Structured recommendation with severity, confidence, affected component and mitigation steps.',
  },
  {
    title: 'Event + report saved to rApp2',
    badge: 'app/services/rapp2_client.py',
    body: (
      <>
        <Endpoint>POST /api/mini-rag/events</Endpoint> <Endpoint>POST /api/mini-rag/mitigations</Endpoint> — rApp2
        persists to region-specific tables and triggers the live dashboard update.
      </>
    ),
  },
  {
    title: 'xApp1 receives the result and keeps recent history',
    body: 'The Cyber Probe Manager retains recent event history for demo visibility.',
  },
]

export default function DetectionSection() {
  return (
    <Section
      id="detection"
      kicker="Section 3 · Main Live Demo Path"
      title="Threat Detection → Mitigation Report"
      tint="#fbfcfe"
      intro={
        <>
          This is the end-to-end runtime path shown during the live demo. It runs identically and independently in
          each region — <RegionChip region={1} /> <RegionChip region={2} /> <RegionChip region={3} />{' '}
          <RegionChip region={4} /> — from simulated threat to persisted mitigation report.
        </>
      }
    >
      <div className="card mb-10 overflow-x-auto p-4">
        <svg viewBox="0 0 1100 120" className="min-w-[800px]" role="img" aria-label="Detection pipeline overview">
          <defs>
            <marker id="fa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0L10 5L0 10z" fill="#1d4ed8" />
            </marker>
          </defs>
          {[
            ['xApp2', 'Threat Simulator'],
            ['xApp1', 'Cyber Probe Mgr'],
            ['Mini RAG', 'Regional analysis'],
            ['Global RAG', 'Escalation only'],
            ['rApp2', 'PostgreSQL'],
            ['Dashboard', 'WebSocket live'],
          ].map(([t, s], i) => (
            <g key={t}>
              <rect x={20 + i * 182} y={28} width={150} height={64} rx={10} fill={i === 3 ? '#fff1f2' : 'white'} stroke={i === 3 ? '#be123c' : '#1d4ed8'} strokeWidth={1.5} />
              <text x={95 + i * 182} y={55} textAnchor="middle" fontSize={14} fontWeight={700} fill="#1b2432">{t}</text>
              <text x={95 + i * 182} y={74} textAnchor="middle" fontSize={10} fill="#64748b">{s}</text>
              {i < 5 && (
                <line x1={170 + i * 182} y1={60} x2={198 + i * 182} y2={60} stroke="#1d4ed8" strokeWidth={2} className="flow-line" markerEnd="url(#fa)" />
              )}
            </g>
          ))}
          <text x={641} y={110} textAnchor="middle" fontSize={10} fill="#be123c">only when the local match is weak</text>
        </svg>
      </div>
      <Stepper steps={steps} />
    </Section>
  )
}
