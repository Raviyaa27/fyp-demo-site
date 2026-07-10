import { PageHeader, Block, Stepper, Endpoint, FileBadge, REGION_COLORS } from '../components/ui'

const MCP_BLUE = '#2563eb'
const REST_GREEN = '#059669'
const IPA_VIOLET = '#7c3aed'
const GLOBAL_ROSE = '#be123c'

/** Small dark mono chip rendered inside the SVG, mirroring the .badge-endpoint style */
function ToolChip({ x, y, w, label }: { x: number; y: number; w: number; label: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={20} rx={5} fill="#1e293b" />
      <text x={x + w / 2} y={y + 13.5} textAnchor="middle" fontSize={10} fontFamily="monospace" fill="#6ee7b7">
        {label}
      </text>
    </g>
  )
}

function AgentBox({
  x,
  y,
  w,
  h,
  color,
  title,
  sub,
  tools,
  note,
}: {
  x: number
  y: number
  w: number
  h: number
  color: string
  title: string
  sub: string
  tools: string[]
  note?: string
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} fill="#ffffff" stroke={color} strokeWidth={1.5} />
      <rect x={x} y={y} width={w} height={h} rx={12} fill={`${color}0a`} />
      <rect x={x} y={y} width={w} height={4} rx={2} fill={color} />
      <text x={x + 14} y={y + 26} fontSize={13} fontWeight={700} fill="#0f172a">
        {title}
      </text>
      <text x={x + 14} y={y + 43} fontSize={10} fill="#64748b">
        {sub}
      </text>
      {tools.map((t, i) => (
        <ToolChip key={t} x={x + 14} y={y + 52 + i * 24} w={t.length * 6.1 + 16} label={t} />
      ))}
      {note && (
        <text x={x + 14} y={y + h - 10} fontSize={9} fill="#94a3b8">
          {note}
        </text>
      )}
    </g>
  )
}

/** Two-tier MCP pipeline diagram: vertical escalation (A) + horizontal distribution (B) */
function McpDiagram() {
  const r1 = REGION_COLORS.region_1
  const r2 = REGION_COLORS.region_2
  const r3 = REGION_COLORS.region_3
  const r4 = REGION_COLORS.region_4

  // pipeline B fan-out paths (IPA bottom edge → peer region tops)
  const checkPaths = [
    'M 730 214 C 620 300, 300 320, 185 436', // → region 1
    'M 790 214 C 780 300, 700 340, 665 436', // → region 3
    'M 850 214 C 890 300, 915 340, 920 436', // → region 4
  ]
  const ingestPaths = [
    'M 900 214 C 850 320, 740 360, 700 436', // REST → region 3
    'M 940 214 C 960 320, 962 360, 956 436', // REST → region 4
  ]

  return (
    <svg viewBox="0 0 1080 660" className="min-w-[960px]" role="img" aria-label="MCP pipeline architecture diagram">
      <defs>
        <marker id="mcp-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M0 0L10 5L0 10z" fill={MCP_BLUE} />
        </marker>
        <marker id="rest-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M0 0L10 5L0 10z" fill={REST_GREEN} />
        </marker>
      </defs>

      {/* ─── central tier band ─── */}
      <rect x={20} y={30} width={1040} height={196} rx={16} fill="#1d4ed808" stroke="#94a3b8" strokeWidth={1} strokeDasharray="5 5" />
      <text x={40} y={56} fontSize={11} fontWeight={800} letterSpacing={2} fill="#475569">
        NON-RT RIC / SMO · CENTRAL TIER
      </text>

      <AgentBox
        x={70}
        y={72}
        w={320}
        h={142}
        color={GLOBAL_ROSE}
        title="Global RAG Agent"
        sub="global threat KB · MITRE ATT&CK / FiGHT"
        tools={['global_rag.analyze_threat', 'global_rag.report_local_intel']}
        note="FastMCP server · /mcp · SSE stream /mcp/sse"
      />
      <AgentBox
        x={660}
        y={72}
        w={330}
        h={142}
        color={IPA_VIOLET}
        title="Inter-Platform Agent (IPA)"
        sub="orchestrator · sanitize / redact · tag source region"
        tools={['inter_platform.distribute_threat']}
        note="FastMCP server · /mcp · SSE stream /mcp/sse"
      />

      {/* ─── Pipeline A: vertical escalation (region 1 ↔ Global RAG) ─── */}
      <path d="M 120 436 V 220" stroke={MCP_BLUE} strokeWidth={2} fill="none" markerEnd="url(#mcp-arrow)" />
      <circle r={4} fill={MCP_BLUE}>
        <animateMotion dur="2.4s" repeatCount="indefinite" path="M 120 436 V 220" />
      </circle>
      <path d="M 190 220 V 430" stroke={MCP_BLUE} strokeWidth={1.6} opacity={0.65} fill="none" markerEnd="url(#mcp-arrow)" />
      <circle r={3.2} fill={MCP_BLUE} opacity={0.75}>
        <animateMotion dur="2.4s" begin="1.2s" repeatCount="indefinite" path="M 190 220 V 430" />
      </circle>
      <g transform="translate(155, 330) rotate(-90)">
        <text textAnchor="middle" fontSize={10.5} fontFamily="monospace" fontWeight={700} fill={MCP_BLUE}>
          global_rag.analyze_threat
        </text>
      </g>
      <g transform="translate(207, 330) rotate(-90)">
        <text textAnchor="middle" fontSize={9.5} fill="#64748b">
          structured mitigation ↓
        </text>
      </g>
      <text x={62} y={252} fontSize={11} fontWeight={800} fill={MCP_BLUE}>
        A
      </text>
      <text x={62} y={266} fontSize={9.5} fill="#64748b">
        vertical
      </text>
      <text x={62} y={278} fontSize={9.5} fill="#64748b">
        escalation
      </text>

      {/* ─── Pipeline B: distribute call (region 2 → IPA) ─── */}
      <path d="M 420 436 C 480 330, 600 280, 700 218" stroke={MCP_BLUE} strokeWidth={2} fill="none" markerEnd="url(#mcp-arrow)" />
      <circle r={4} fill={MCP_BLUE}>
        <animateMotion dur="2.6s" repeatCount="indefinite" path="M 420 436 C 480 330, 600 280, 700 218" />
      </circle>
      <text x={478} y={310} fontSize={10.5} fontFamily="monospace" fontWeight={700} fill={MCP_BLUE} transform="rotate(-26 478 310)">
        inter_platform.distribute_threat
      </text>
      <text x={352} y={368} fontSize={11} fontWeight={800} fill={IPA_VIOLET}>
        B
      </text>
      <text x={352} y={382} fontSize={9.5} fill="#64748b">
        horizontal
      </text>
      <text x={352} y={394} fontSize={9.5} fill="#64748b">
        distribution
      </text>

      {/* ─── Pipeline B: concurrent dedup checks (IPA → peers) ─── */}
      {checkPaths.map((p, i) => (
        <g key={p}>
          <path d={p} stroke={MCP_BLUE} strokeWidth={1.7} opacity={0.8} fill="none" markerEnd="url(#mcp-arrow)" />
          <circle r={3.4} fill={MCP_BLUE}>
            <animateMotion dur="2.2s" begin={`${0.5 + i * 0.12}s`} repeatCount="indefinite" path={p} />
          </circle>
        </g>
      ))}
      <text x={620} y={352} fontSize={10.5} fontFamily="monospace" fontWeight={700} fill={MCP_BLUE}>
        mini_rag.check_threat_intel
      </text>
      <text x={620} y={366} fontSize={9.5} fill="#64748b">
        concurrent dedup checks — “do you already have this?”
      </text>

      {/* ─── Pipeline B: REST ingest (only where missing) ─── */}
      {ingestPaths.map((p, i) => (
        <g key={p}>
          <path d={p} stroke={REST_GREEN} strokeWidth={1.7} strokeDasharray="6 5" fill="none" markerEnd="url(#rest-arrow)" />
          <circle r={3.4} fill={REST_GREEN}>
            <animateMotion dur="2.6s" begin={`${1.3 + i * 0.2}s`} repeatCount="indefinite" path={p} />
          </circle>
        </g>
      ))}
      <text x={1064} y={300} textAnchor="end" fontSize={10.5} fontWeight={700} fill={REST_GREEN}>
        REST ingest
      </text>
      <text x={1064} y={314} textAnchor="end" fontSize={9.5} fill="#64748b">
        only regions
      </text>
      <text x={1064} y={326} textAnchor="end" fontSize={9.5} fill="#64748b">
        that lack it
      </text>

      {/* ─── regional tier band ─── */}
      <rect x={20} y={412} width={1040} height={186} rx={16} fill="#16a34a06" stroke="#94a3b8" strokeWidth={1} strokeDasharray="5 5" />
      <text x={40} y={438} fontSize={11} fontWeight={800} letterSpacing={2} fill="#475569">
        NEAR-RT RIC · REGIONAL TIER (×4)
      </text>

      {([
        [45, r1, '1', 'peer check → already known · skipped'],
        [300, r2, '2', 'source region — confirmed HIGH/CRITICAL'],
        [555, r3, '3', 'new intel → vector-embed + append'],
        [810, r4, '4', 'new intel → vector-embed + append'],
      ] as const).map(([x, color, n, caption]) => (
        <g key={n}>
          <AgentBox
            x={x}
            y={450}
            w={225}
            h={118}
            color={color}
            title={`Mini-RAG Agent · R${n}`}
            sub="isolated regional vector KB"
            tools={['mini_rag.check_threat_intel']}
            note="MCP server + MCP client"
          />
          <text x={x + 112} y={588} textAnchor="middle" fontSize={9} fill="#64748b">
            {caption}
          </text>
        </g>
      ))}

      {/* ─── legend ─── */}
      <g transform="translate(330, 632)">
        <line x1={0} y1={0} x2={44} y2={0} stroke={MCP_BLUE} strokeWidth={2.2} />
        <circle cx={22} cy={0} r={3.4} fill={MCP_BLUE} />
        <text x={52} y={4} fontSize={10.5} fontWeight={600} fill="#475569">
          MCP over SSE — typed tool call
        </text>
        <line x1={260} y1={0} x2={304} y2={0} stroke={REST_GREEN} strokeWidth={2.2} strokeDasharray="6 5" />
        <text x={312} y={4} fontSize={10.5} fontWeight={600} fill="#475569">
          REST — ingest (write path)
        </text>
      </g>
    </svg>
  )
}

export default function McpPage() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <PageHeader
        kicker="Agent-to-Agent Communication"
        title={
          <>
            MCP-powered <span className="grad-text">intelligence sharing</span>
          </>
        }
        lead={
          <>
            Every agent in the platform is wired together with <strong>MCP (Model Context Protocol)</strong> — the
            same open standard used to connect AI agents to tools. Each agent exposes its capabilities as typed{' '}
            <strong>“tools”</strong> that other agents call over a live streaming connection, and that is exactly how
            threat intelligence flows through the system.
          </>
        }
      />

      <Block
        title="Three MCP servers, four typed tools"
        intro={
          <>
            Each agent is a <strong>FastMCP server</strong> built on the official MCP SDK, mounted at{' '}
            <Endpoint>/mcp</Endpoint> and serving its SSE (Server-Sent Events) stream at{' '}
            <Endpoint>/mcp/sse</Endpoint>. Other agents connect to it as MCP <em>clients</em> and invoke its tools.
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="card card-hover p-5" style={{ borderTop: `3px solid ${REGION_COLORS.region_1}` }}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <h3 className="font-bold">Mini-RAG Agent</h3>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Near-RT RIC · ×4
              </span>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              One per region, each with its own isolated regional knowledge base (vector DB) of known threats.
              Answers “does this region already know this?” using vector cosine similarity. Also acts as an MCP{' '}
              <strong>client</strong> to the two central servers.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Endpoint>mini_rag.check_threat_intel</Endpoint>
            </div>
          </div>
          <div className="card card-hover p-5" style={{ borderTop: `3px solid ${IPA_VIOLET}` }}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <h3 className="font-bold">Inter-Platform Agent (IPA)</h3>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Non-RT RIC / SMO
              </span>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              The orchestrator that shares intelligence between regions. Accepts a sanitized threat + mitigation from
              one region and distributes it to the other regions that lack it.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Endpoint>inter_platform.distribute_threat</Endpoint>
            </div>
          </div>
          <div className="card card-hover p-5" style={{ borderTop: `3px solid ${GLOBAL_ROSE}` }}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <h3 className="font-bold">Global RAG Agent</h3>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Non-RT RIC / SMO
              </span>
            </div>
            <p className="mb-3 text-sm leading-relaxed text-slate-600">
              The central knowledge authority — a large curated threat KB built from MITRE ATT&CK / FiGHT. Performs
              deep analysis and produces mitigations when a region escalates.
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Endpoint>global_rag.analyze_threat</Endpoint>
              <Endpoint>global_rag.report_local_intel</Endpoint>
            </div>
          </div>
        </div>
      </Block>

      <Block
        title="The two MCP pipelines"
        intro={
          <>
            Solid blue arrows are <strong>MCP tool calls over SSE</strong>; dashed green arrows are the{' '}
            <strong>REST write path</strong> used for ingestion. Pipeline <strong>A</strong> escalates a threat
            vertically from a region to the Global RAG; pipeline <strong>B</strong> distributes confirmed intel
            horizontally between regions through the IPA.
          </>
        }
      >
        <div className="card overflow-x-auto p-4">
          <McpDiagram />
        </div>
      </Block>

      <Block title="How the pipelines run, step by step">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-extrabold text-white">
                A
              </span>
              <div>
                <h3 className="font-bold leading-tight">Vertical escalation</h3>
                <p className="text-xs text-slate-500">region ↔ global</p>
              </div>
            </div>
            <Stepper
              color={MCP_BLUE}
              steps={[
                {
                  title: 'A threat is reported',
                  body: 'An xApp threat detector reports a threat to its regional Mini-RAG Agent.',
                },
                {
                  title: 'The region searches only its own KB',
                  body: 'The agent first searches its own regional knowledge base — nothing else.',
                },
                {
                  title: 'High confidence → answered locally',
                  body: 'If local confidence is high, the region answers immediately. Fast, and no escalation.',
                },
                {
                  title: 'Low confidence or HIGH/CRITICAL → escalate',
                  body: (
                    <>
                      The agent calls the Global RAG Agent's <Endpoint>global_rag.analyze_threat</Endpoint> tool over
                      MCP/SSE for deep analysis from the global knowledge base.
                    </>
                  ),
                },
                {
                  title: 'The region learns the answer',
                  body: 'The Global RAG returns a structured mitigation, which the region ingests and re-vectorizes into its own KB — so each region continuously learns.',
                },
              ]}
            />
          </div>
          <div className="card p-6">
            <div className="mb-5 flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-extrabold text-white">
                B
              </span>
              <div>
                <h3 className="font-bold leading-tight">Horizontal distribution</h3>
                <p className="text-xs text-slate-500">region ↔ region, via the IPA</p>
              </div>
            </div>
            <Stepper
              color={IPA_VIOLET}
              steps={[
                {
                  title: 'A region confirms a HIGH/CRITICAL threat',
                  body: (
                    <>
                      Its Mini-RAG Agent calls the IPA's <Endpoint>inter_platform.distribute_threat</Endpoint> tool
                      over MCP/SSE, handing off the threat event and mitigation report.
                    </>
                  ),
                },
                {
                  title: 'The IPA sanitizes and tags',
                  body: 'Region-specific and sensitive fields are redacted, and the intel is tagged with its source region.',
                },
                {
                  title: 'Concurrent dedup checks fan out',
                  body: (
                    <>
                      The IPA calls every <em>other</em> region's <Endpoint>mini_rag.check_threat_intel</Endpoint>{' '}
                      tool over SSE — asking “do you already have this?” — all in parallel.
                    </>
                  ),
                },
                {
                  title: 'Push only to regions that lack it',
                  body: 'Missing regions receive the intel over REST and vector-embed + append it. Regions that already have it are skipped; unreachable regions are skipped and logged.',
                },
                {
                  title: 'Net effect: safe automatic propagation',
                  body: 'A threat learned in one region is automatically propagated to every other region that doesn’t yet know it — deduplicated and sanitized.',
                },
              ]}
            />
          </div>
        </div>
      </Block>

      <Block title="Design decisions worth noticing" className="pb-16">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="card card-hover border-l-4 border-l-blue-600 p-5">
            <h4 className="mb-2 font-bold">A deliberate transport split</h4>
            <p className="text-sm leading-relaxed text-slate-600">
              The IPA uses <strong>MCP/SSE for the read</strong> — the <Endpoint>mini_rag.check_threat_intel</Endpoint>{' '}
              dedup query — and <strong>a REST call for the write</strong> — the actual ingest. Queries stay on the
              typed, streaming tool interface; state changes go through a plain, auditable REST endpoint.
            </p>
          </div>
          <div className="card card-hover border-l-4 border-l-emerald-600 p-5">
            <h4 className="mb-2 font-bold">Concurrent, failure-isolated fan-out</h4>
            <p className="text-sm leading-relaxed text-slate-600">
              All peer calls run <strong>concurrently</strong> for low latency, and any single peer failing never
              blocks the others — an unreachable region is simply skipped and logged while the rest of the platform
              keeps learning.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <FileBadge>FastMCP · official MCP SDK</FileBadge>
          <FileBadge>/mcp</FileBadge>
          <FileBadge>/mcp/sse</FileBadge>
        </div>
      </Block>
    </div>
  )
}
