import { PageHeader, Block, Stepper, FileBadge, Endpoint } from '../components/ui'

const steps = [
  {
    title: 'Fetch MITRE ATT&CK data',
    badge: 'cti-rapp1/app.py',
    body: 'Pull the full MITRE ATT&CK corpus as the general adversary-technique baseline.',
  },
  {
    title: 'Fetch FiGHT / O-RAN security data',
    badge: 'oran_r1_client.py',
    body: 'Retrieve MITRE FiGHT and O-RAN-specific security knowledge covering 5G/RAN threat surfaces.',
  },
  {
    title: 'Convert FiGHT data to STIX',
    body: 'Normalize the telecom-specific intelligence into STIX objects so all sources share one schema.',
  },
  {
    title: 'Visualize threat data',
    body: 'Render the combined corpus as a threat graph to inspect coverage before pruning.',
  },
  {
    title: 'Prune STIX to O-RAN-relevant intel',
    badge: 'prune_stix.py',
    body: 'Filter out techniques and relationships that do not apply to O-RAN components or interfaces, keeping a focused, high-signal knowledge set.',
  },
  {
    title: 'Generate O-RAN knowledge graph outputs',
    badge: 'pruned_stix_data.py',
    body: (
      <>
        Emit the pruned knowledge graph as <code className="font-mono text-xs">oran_pruned_nodes.json</code> and{' '}
        <code className="font-mono text-xs">oran_pruned_edges.json</code>.
      </>
    ),
  },
  {
    title: 'Store pruned CTI for the RAG knowledge base',
    badge: 'db.py',
    body: 'Persist / prepare the pruned CTI so it can seed the Global RAG knowledge base and the regional knowledge sources.',
  },
]

export default function KnowledgePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Knowledge Preparation Pipeline"
        title={
          <>
            rApp1 — from raw CTI to an <span className="grad-text">O-RAN knowledge base</span>
          </>
        }
        lead={
          <>
            rApp1 is the upstream, offline/periodic pipeline — deliberately separate from real-time detection.
            Scheduled via a Kubernetes CronJob, it turns raw public threat intelligence into the O-RAN-focused
            knowledge that the Global RAG and regional Mini RAGs reason over.
          </>
        }
      />

      <Block title="Pipeline steps">
        <div className="grid gap-10 lg:grid-cols-[1fr_330px]">
          <Stepper steps={steps} color="#0e7490" />
          <div className="space-y-4">
            <div className="card card-hover p-5">
              <h4 className="mb-2 font-bold">Why prune?</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                MITRE ATT&CK is enterprise-wide; most of it never touches a RAN. Pruning keeps only intelligence
                relevant to O-RAN components and interfaces, which makes RAG retrieval faster and dramatically more
                precise for regional agents.
              </p>
            </div>
            <div className="card card-hover border-l-4 border-l-cyan-700 p-5">
              <h4 className="mb-2 font-bold">Runs on a schedule, not per threat</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                A Kubernetes CronJob re-runs the pipeline periodically. Live detection never waits on rApp1 — it
                consumes the knowledge base rApp1 has already prepared.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <FileBadge>fyp-cti-non-rt-ric/cti-rapp1/app.py</FileBadge>
                <FileBadge>rapp1-cronjob.yaml</FileBadge>
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block
        title="Where the knowledge lives: Global RAG"
        intro={
          <>
            The Global RAG holds the <strong>complete threat knowledge base</strong> produced by rApp1 and serves it
            to every region on demand. It performs full-context semantic search over the global vector DB, generates
            mitigation analysis, and returns structured recommendations when Mini RAGs escalate.
          </>
        }
        className="pb-16"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card card-hover border-l-4 border-l-rose-600 p-6">
            <h3 className="mb-3 font-bold">Interfaces & tools</h3>
            <div className="flex flex-col items-start gap-2">
              <div>
                <Endpoint>POST /api/analyze</Endpoint>
                <span className="ml-2 text-xs text-slate-500">REST analysis endpoint</span>
              </div>
              <div>
                <Endpoint>/mcp</Endpoint>
                <span className="ml-2 text-xs text-slate-500">MCP bridge endpoint</span>
              </div>
              <div>
                <Endpoint>global_rag.analyze_threat</Endpoint>
                <span className="ml-2 text-xs text-slate-500">MCP tool — full-context analysis</span>
              </div>
              <div>
                <Endpoint>global_rag.report_local_intel</Endpoint>
                <span className="ml-2 text-xs text-slate-500">MCP tool — regions report local intel</span>
              </div>
            </div>
          </div>
          <div className="card card-hover p-6">
            <h3 className="mb-3 font-bold">Knowledge & code</h3>
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              The global knowledge base and its ChromaDB vector store are the platform's single source of full CTI
              truth. Regional learning never writes back into it.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <FileBadge>rag/api_server.py</FileBadge>
              <FileBadge>rag_agent.py</FileBadge>
              <FileBadge>threat_knowledge_base.py</FileBadge>
              <FileBadge>data_transformer.py</FileBadge>
              <FileBadge>rag/data/threat_knowledge_base.json</FileBadge>
              <FileBadge>rag/data/chromadb</FileBadge>
            </div>
          </div>
        </div>
      </Block>
    </div>
  )
}
