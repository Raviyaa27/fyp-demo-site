import IsometricArchitecture from '../components/IsometricArchitecture'
import { PageHeader, Block, ServiceCard, RegionChip, FileBadge, REGION_COLORS } from '../components/ui'

const perRegion = [
  'Own Mini RAG agent',
  'Own regional threat knowledge base',
  'Own regional vector database',
  'Own event & mitigation tables in rApp2',
  'Own WebSocket / dashboard stream',
]

export default function ArchitecturePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="System Architecture"
        title={
          <>
            One global CTI layer, <span className="grad-text">four isolated regions</span>
          </>
        }
        lead={
          <>
            The platform is split into a Non-RT RIC / O-Cloud / SMO global layer and four independent Near-RT RIC
            regional control domains. Only two paths cross a region boundary: escalation to Global RAG and peer
            sharing via the Inter-Platform Agent. No region ever writes directly into another region's database.
          </>
        }
      />

      <IsometricArchitecture />
      <p className="mt-3 text-center text-xs text-slate-400">
        Enhanced interactive rendering of the official system-architecture drawing, extended to all four Near-RT RIC regions.
      </p>

      <Block
        title="How the O-RAN network is used"
        intro={
          <>
            The project models a multi-region O-RAN deployment. It does <strong>not</strong> treat the network as
            one flat system. CTI processing is separated per Near-RT RIC region so each RIC learns from its own
            threats, while still escalating to Global RAG and sharing intelligence with peers. Monitored O-RAN
            interfaces: <strong>A1 · E2 · F1 · O1 · Open Fronthaul</strong>.
          </>
        }
        className="mt-8"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {([1, 2, 3, 4] as const).map((r) => {
            const color = REGION_COLORS[`region_${r}`]
            return (
              <div key={r} className="card card-hover p-5" style={{ borderTop: `3px solid ${color}` }}>
                <div className="mb-2 flex items-center justify-between">
                  <RegionChip region={r} />
                  <span className="font-mono text-xs text-slate-400">ric-{r}</span>
                </div>
                <h3 className="mb-2 font-bold">Near-RT RIC {r}</h3>
                <p className="mb-3 text-xs text-slate-500">A separate regional RAN control domain with:</p>
                <ul className="space-y-1.5 text-[13px] text-slate-600">
                  {perRegion.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="card card-hover p-6">
            <h3 className="mb-3 font-bold">Near-RT RIC side (regional)</h3>
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                <FileBadge>xapp2_threat_simulator.py</FileBadge> simulates threat telemetry targeting O-RAN
                interfaces such as <strong>A1, E2 and F1</strong>.
              </li>
              <li>
                <FileBadge>xapp1_probe_manager_new.py</FileBadge> is the <strong>Cyber Probe Manager xApp</strong>.
                It handles probe events and carries out the guarded E2SM-RC control action when instructed.
              </li>
              <li>
                The <strong>security correlator</strong> is the regional detection gateway. It unifies Prometheus,
                Loki, Falco and E2SM-KPM evidence into one schema before any analysis happens.
              </li>
              <li>
                The <strong>Mini RAG agent</strong> is the regional intelligence assistant, and the{' '}
                <strong>mitigation controller</strong> is the only component holding actuation credentials.
              </li>
            </ul>
          </div>
          <div className="card card-hover p-6">
            <h3 className="mb-3 font-bold">Non-RT RIC / SMO side (global)</h3>
            <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
              <li>
                Hosts the <strong>CTI ingestion pipeline</strong> (prepares the knowledge base), <strong>rApp2</strong> (stores
                threats and mitigation reports), <strong>Global RAG</strong>, the{' '}
                <strong>Inter-Platform Agent</strong> and the <strong>Dashboard Backend</strong>.
              </li>
              <li>
                <strong>Global RAG</strong> provides full CTI reasoning whenever a regional Mini RAG's confidence is
                too low.
              </li>
              <li>
                The <strong>dashboard</strong> monitors all four Near-RT RIC regions from one global view.
              </li>
            </ul>
          </div>
        </div>
      </Block>

      <Block title="Platform services" className="pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            title="CTI Ingestion Pipeline"
            layer="Non-RT RIC"
            color="#0e7490"
            files={['pipeline/app.py', 'pipeline/prune_stix.py', 'pipeline/graph_builder.py']}
          >
            Periodic pipeline that harvests MITRE ATT&CK, FiGHT, CVSS and CISA KEV, normalises them to STIX 2.1,
            prunes to O-RAN-relevant intelligence, builds the ArangoDB graph and serves it over TAXII 2.1.
          </ServiceCard>
          <ServiceCard
            title="Global RAG: Central Knowledge Authority"
            layer="Non-RT RIC"
            color="#be123c"
            endpoints={['/api/analyze', '/mcp']}
            files={['rag/api_server.py', 'rag_agent.py', 'threat_knowledge_base.py']}
          >
            Holds the <strong>full global threat knowledge base</strong> and ChromaDB vector store. Performs
            full-context semantic search and generates mitigation analysis on escalation. MCP tools:{' '}
            <code className="font-mono text-xs">global_rag.analyze_threat</code>,{' '}
            <code className="font-mono text-xs">global_rag.report_local_intel</code>.
          </ServiceCard>
          <ServiceCard
            title="Mini RAG Agents ×4: Regional Intelligence"
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
            title="xApps: Threat Simulation & Probing"
            layer="Near-RT RIC"
            color="#dc2626"
            endpoints={['/api/events']}
            files={['xapp2_threat_simulator.py', 'xapp1_probe_manager_new.py']}
          >
            xApp2 is the KPM detector that reports RAN telemetry anomalies. xApp1, the Cyber Probe Manager, handles
            probe events and executes the guarded E2SM-RC control action on behalf of the mitigation controller.
          </ServiceCard>
          <ServiceCard
            title="Security Correlator: Detection Gateway"
            layer="Near-RT RIC"
            color="#2563eb"
            endpoints={['POST /events', 'GET /metrics']}
            files={['security/correlator/app.py', 'security/kubernetes/detection-rules.yaml']}
          >
            Normalises Prometheus, Loki, Falco and E2SM-KPM evidence into one transparent schema, deduplicates by
            fingerprint, correlates over a 300 s window and forwards the scored event to the regional Mini RAG.
          </ServiceCard>
          <ServiceCard
            title="Mitigation Controller: Guarded Response"
            layer="Near-RT RIC"
            color="#7c3aed"
            endpoints={['POST /api/v1/mitigations', 'GET /api/v1/mitigations']}
            files={['security/mitigation-controller/app.py']}
          >
            Holds the actuation credentials and drives each candidate through approve, execute, verify and roll back
            across five actuators, behind deterministic safety gates. A1 actions always stay operator-approved.
          </ServiceCard>
          <ServiceCard
            title="rApp2: Persistence & Notification"
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
            title="Dashboard: Global Monitoring UI"
            layer="Non-RT RIC"
            color="#475569"
            endpoints={['GET /cti/threats', 'WS /ws/{region_id}']}
            files={['dashboard-backend/dashboard_backend.py', 'cti_dashboard/src']}
          >
            Single pane of glass over all four regions: threat lists, severity, confidence, mitigation insight,
            stats and metrics history, updated live over WebSocket.
          </ServiceCard>
          <ServiceCard
            title="Inter-Platform Agent: Threat Sharing"
            layer="Non-RT RIC"
            color="#7c3aed"
            files={['inter-platform-agent/app/main.py']}
          >
            Builds STIX/TAXII-style bundles from confirmed regional threats and delivers them to peer regions. The
            receiving Mini RAG deduplicates by similarity before ingesting. This is the only sanctioned cross-region path.
          </ServiceCard>
        </div>
      </Block>
    </div>
  )
}
