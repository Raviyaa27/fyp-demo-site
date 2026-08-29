import { PageHeader, Block, Stepper, FileBadge, Endpoint, REGION_COLORS } from '../components/ui'

const steps = [
  {
    title: 'Harvest the source feeds',
    badge: 'pipeline/fetch_attack.py',
    body: (
      <>
        Pull MITRE ATT&amp;CK as the general adversary-technique baseline, MITRE FiGHT for 5G and RAN-specific
        coverage, CVSS vulnerability data, and the CISA Known Exploited Vulnerabilities catalogue.
      </>
    ),
  },
  {
    title: 'Normalise everything to STIX 2.1',
    badge: 'pipeline/convert_fight_to_stix.py',
    body: 'Each source is converted into the same STIX 2.1 object model and passed through a schema validator, so downstream stages never have to care where a record came from.',
  },
  {
    title: 'Score domain relevance',
    badge: 'pipeline/semantic_processor.py',
    body: 'Dense vector similarity scores every record against the O-RAN domain. A maximum-similarity model keeps what a radio access network could actually be exposed to.',
  },
  {
    title: 'Prune to O-RAN-relevant intelligence',
    badge: 'pipeline/prune_stix.py',
    body: 'Techniques and relationships that cannot touch an O-RAN component or interface are dropped, leaving a focused, high-signal knowledge set.',
  },
  {
    title: 'Reduce the graph and adjust risk',
    badge: 'pipeline/graph_builder.py',
    body: 'A bounded two-hop breadth-first search extracts the connected subgraph around each retained node, and CVSS v3.1 scores are adjusted with EPSS exploit-likelihood data.',
  },
  {
    title: 'Persist the knowledge graph',
    body: 'The reduced graph is stored in ArangoDB as the layered source of truth, with the vector store built alongside it for retrieval.',
  },
  {
    title: 'Serve it over TAXII 2.1 and to the regions',
    badge: 'pipeline/oran_taxii_server.py',
    body: 'An OASIS TAXII 2.1 gateway exposes the curated collection, while the regional syncer seeds each Mini RAG knowledge base and its ChromaDB collection.',
  },
]

const DOMAINS = [
  { n: 1, name: 'Rural connectivity', built: 'health', status: 'built' },
  { n: 2, name: 'University campus', built: 'education', status: 'built' },
  { n: 3, name: 'Smart city / tech park', built: '', status: 'planned' },
  { n: 4, name: 'Industrial / critical infrastructure', built: '', status: 'planned' },
] as const

export default function KnowledgePage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Knowledge Construction"
        title={
          <>
            From global CTI to an <span className="grad-text">O-RAN knowledge base</span>
          </>
        }
        lead={
          <>
            The ingestion pipeline is upstream and periodic, deliberately separate from real-time detection. It turns
            public threat intelligence into the O-RAN-focused knowledge that the Global RAG and the regional Mini
            RAGs reason over, cutting the data footprint by 85 to 90 percent along the way.
          </>
        }
      />

      <Block title="Pipeline stages">
        <div className="grid gap-10 lg:grid-cols-[1fr_330px]">
          <Stepper steps={steps} color="#0e7490" />
          <div className="space-y-4">
            <div className="card card-hover border-l-4 border-l-cyan-700 p-5">
              <h4 className="mb-2 font-bold">Why prune at all?</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                MITRE ATT&amp;CK is enterprise-wide and most of it never touches a RAN. An edge region cannot host a
                full enterprise corpus, and irrelevant intelligence actively degrades retrieval precision. Pruning is
                what keeps regional vector search both deployable and accurate.
              </p>
            </div>
            <div className="card card-hover p-5">
              <h4 className="mb-2 font-bold">Runs on a schedule, not per threat</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                Live detection never waits on ingestion. It consumes the knowledge base the pipeline has already
                prepared, so a slow upstream fetch can never delay a regional decision.
              </p>
            </div>
            <div className="card card-hover p-5">
              <h4 className="mb-2 font-bold">Pipeline files</h4>
              <div className="flex flex-wrap gap-1.5">
                <FileBadge>pipeline/app.py</FileBadge>
                <FileBadge>pipeline/fetch_fight.py</FileBadge>
                <FileBadge>pipeline/fetch_cvss.py</FileBadge>
                <FileBadge>pipeline/schema_validator.py</FileBadge>
                <FileBadge>pipeline/local_cti_syncer.py</FileBadge>
                <FileBadge>pipeline/visualize_stix.py</FileBadge>
              </div>
            </div>
          </div>
        </div>
      </Block>

      <Block
        title="Domain-specific regional feeds"
        intro={
          <>
            Every region keeps a separate knowledge base, but they need not learn the same things. Vendor connectors
            build domain-tailored STIX feeds from the CISA KEV catalogue so each Mini RAG becomes specialised in the
            threats its own environment actually faces. Two domains are live today, with the remaining two planned.
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOMAINS.map((d) => {
            const color = REGION_COLORS[`region_${d.n}`]
            const live = d.status === 'built'
            return (
              <div key={d.n} className="card card-hover p-5" style={{ borderTop: `3px solid ${color}` }}>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold" style={{ color }}>
                    Region {d.n}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      live ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {live ? 'Live' : 'Planned'}
                  </span>
                </div>
                <div className="font-bold leading-tight">{d.name}</div>
                {live && (
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    Deployed as the{' '}
                    <code className="font-mono text-[11px]">{d.built}</code> vendor domain, sourced from CISA KEV.
                  </p>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <FileBadge>pipeline/vendor_connectors.py</FileBadge>
        </div>
      </Block>

      <Block
        title="Where the knowledge lives: Global RAG"
        intro={
          <>
            The Global RAG holds the <strong>complete curated knowledge base</strong> and serves it to every region on
            demand. It performs full-context semantic search over the global vector store, generates the seven-section
            analysis, and returns structured recommendations when a Mini RAG escalates.
          </>
        }
        className="pb-16"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="card card-hover border-l-4 border-l-rose-600 p-6">
            <h3 className="mb-3 font-bold">Interfaces &amp; tools</h3>
            <div className="flex flex-col items-start gap-2">
              <div>
                <Endpoint>POST /api/analyze</Endpoint>
                <span className="ml-2 text-xs text-slate-500">REST analysis endpoint</span>
              </div>
              <div>
                <Endpoint>/mcp</Endpoint>
                <span className="ml-2 text-xs text-slate-500">FastMCP mount · SSE at /mcp/sse</span>
              </div>
              <div>
                <Endpoint>global_rag.analyze_threat</Endpoint>
                <span className="ml-2 text-xs text-slate-500">MCP tool · full-context analysis</span>
              </div>
              <div>
                <Endpoint>global_rag.report_local_intel</Endpoint>
                <span className="ml-2 text-xs text-slate-500">MCP tool · regions report local intel</span>
              </div>
              <div>
                <Endpoint>TAXII 2.1</Endpoint>
                <span className="ml-2 text-xs text-slate-500">standards gateway over the curated collection</span>
              </div>
            </div>
          </div>
          <div className="card card-hover p-6">
            <h3 className="mb-3 font-bold">Knowledge &amp; code</h3>
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              The global knowledge base and its ChromaDB vector store are the platform's single source of full CTI
              truth. Regional learning never writes back into it, so a region can only ever enrich itself.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <FileBadge>rag/api_server.py</FileBadge>
              <FileBadge>rag/rag_agent.py</FileBadge>
              <FileBadge>rag/threat_knowledge_base.py</FileBadge>
              <FileBadge>rag/data_transformer.py</FileBadge>
              <FileBadge>rag/metrics.py</FileBadge>
              <FileBadge>rag/tracing.py</FileBadge>
            </div>
          </div>
        </div>
      </Block>
    </div>
  )
}
