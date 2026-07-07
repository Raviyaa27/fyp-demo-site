import { Section, Stepper, FileBadge } from '../components/ui'

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
        Emit the pruned knowledge graph as{' '}
        <code className="font-mono text-xs">oran_pruned_nodes.json</code> and{' '}
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

export default function Rapp1Section() {
  return (
    <Section
      id="rapp1"
      kicker="Section 2 · Knowledge Preparation Pipeline"
      title="rApp1 — CTI Ingestion & Pruning"
      intro={
        <>
          rApp1 is the <strong>upstream, offline/periodic pipeline</strong> — deliberately separate from the
          real-time detection path. Scheduled via <FileBadge>rapp1-cronjob.yaml</FileBadge>, it turns raw public
          threat intelligence into the O-RAN-focused knowledge that the Global RAG and regional Mini RAGs reason
          over.
        </>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <Stepper steps={steps} color="#0e7490" />
        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="mb-2 font-bold">Why prune?</h4>
            <p className="text-sm leading-relaxed text-slate-600">
              MITRE ATT&CK is enterprise-wide; most of it never touches a RAN. Pruning keeps only intelligence
              relevant to O-RAN components and interfaces, which makes RAG retrieval faster and dramatically more
              precise for regional agents.
            </p>
          </div>
          <div className="card border-l-4 border-l-cyan-700 p-5">
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
    </Section>
  )
}
