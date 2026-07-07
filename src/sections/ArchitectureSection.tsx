import ArchitectureDiagram from '../components/ArchitectureDiagram'
import { Section, ServiceCard, REGION_COLORS } from '../components/ui'

export default function ArchitectureSection() {
  return (
    <Section
      id="architecture"
      kicker="Section 1"
      title="High-Level Architecture"
      intro={
        <>
          The platform is split into a <strong>Non-RT RIC / SMO global CTI layer</strong> and four isolated{' '}
          <strong>Near-RT RIC regions</strong>. Each region detects and analyzes its own threats; only two paths
          cross region boundaries — escalation to Global RAG, and peer sharing through the Inter-Platform Agent.
          No region ever writes directly into another region's database.
        </>
      }
    >
      <ArchitectureDiagram />

      <h3 className="mb-4 mt-12 text-lg font-bold">Platform services</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ServiceCard
          title="rApp1 — CTI Ingestion & Pruning"
          layer="Non-RT RIC"
          color="#0e7490"
          files={['cti-rapp1/app.py', 'prune_stix.py', 'rapp1-cronjob.yaml']}
        >
          Periodic pipeline that fetches MITRE ATT&CK and FiGHT/O-RAN security data, converts it to STIX, prunes
          it down to O-RAN-relevant intelligence and prepares the knowledge sources used by the RAG agents.
        </ServiceCard>
        <ServiceCard
          title="Global RAG — Central Knowledge Authority"
          layer="Non-RT RIC"
          color="#be123c"
          endpoints={['/api/analyze', '/mcp']}
          files={['rag/api_server.py', 'rag_agent.py', 'threat_knowledge_base.py']}
        >
          Holds the <strong>full global threat knowledge base</strong> and vector DB (ChromaDB). Performs
          full-context semantic search and generates mitigation analysis when a regional Mini RAG escalates. MCP
          tools: <code className="font-mono text-xs">global_rag.analyze_threat</code>,{' '}
          <code className="font-mono text-xs">global_rag.report_local_intel</code>.
        </ServiceCard>
        <ServiceCard
          title="Mini RAG Agents ×4 — Regional Intelligence"
          layer="Near-RT RIC"
          color={REGION_COLORS.region_1}
          endpoints={['/api/v1/analyze-threat', '/api/v1/ingest-local-knowledge']}
          files={['mini-rag-agent-flexric-4rics/app/main.py', 'app/services/rag_service.py']}
        >
          One agent per region, each with its own regional JSON knowledge base and vector DB. Answers locally when
          strict checks pass; otherwise escalates to Global RAG and learns the answer{' '}
          <strong>only into its own region</strong>.
        </ServiceCard>
        <ServiceCard
          title="xApps — Threat Simulation & Probing"
          layer="Near-RT RIC"
          color={REGION_COLORS.region_2}
          endpoints={['/api/events']}
          files={['xapp2_threat_simulator.py', 'xapp1_probe_manager_new.py']}
        >
          xApp2 simulates O-RAN threats (A1 malformed policy, F1 unauthorized access, E2 flooding). xApp1, the
          Cyber Probe Manager, normalizes each event into the Mini RAG <code className="font-mono text-xs">ThreatEvent</code>{' '}
          format and forwards it for analysis.
        </ServiceCard>
        <ServiceCard
          title="rApp2 — Persistence & Notification"
          layer="Non-RT RIC"
          color="#0e7490"
          endpoints={['/api/mini-rag/events', '/api/mini-rag/mitigations']}
          files={['cti-rapp2/app.py']}
        >
          Stores every threat event and mitigation report into <strong>region-specific PostgreSQL tables</strong>{' '}
          (e.g. <code className="font-mono text-xs">mini_rag_region_1_events</code>) and notifies the dashboard
          backend after each save.
        </ServiceCard>
        <ServiceCard
          title="Dashboard — Global Monitoring UI"
          layer="Non-RT RIC"
          color="#475569"
          endpoints={['GET /cti/threats', 'WS /ws/{region_id}']}
          files={['dashboard-backend/dashboard_backend.py', 'cti_dashboard/src']}
        >
          Single pane of glass over all four regions: threat lists, severity, confidence, mitigation insight,
          stats and metrics history, updated live over WebSocket.
        </ServiceCard>
        <ServiceCard
          title="Inter-Platform Agent — Threat Sharing"
          layer="Non-RT RIC"
          color="#7c3aed"
          files={['inter-platform-agent/app/main.py']}
        >
          Builds STIX/TAXII-style bundles from confirmed regional threats and delivers them to peer regions. The
          receiving Mini RAG deduplicates by similarity before ingesting — the only sanctioned cross-region path.
        </ServiceCard>
      </div>
    </Section>
  )
}
