import { ReactNode } from 'react'
import { motion } from 'framer-motion'

export const REGION_COLORS: Record<string, string> = {
  region_1: '#16a34a',
  region_2: '#d97706',
  region_3: '#db2777',
  region_4: '#7c3aed',
}

export function PageHeader({
  kicker,
  title,
  lead,
}: {
  kicker: string
  title: ReactNode
  lead?: ReactNode
}) {
  return (
    <div className="mx-auto max-w-3xl pb-12 pt-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="section-kicker">{kicker}</span>
        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{title}</h1>
        {lead && <p className="mt-4 text-[15px] leading-relaxed text-slate-600 sm:text-base">{lead}</p>}
      </motion.div>
    </div>
  )
}

export function Block({
  title,
  intro,
  children,
  className = '',
}: {
  title?: ReactNode
  intro?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`py-8 ${className}`}
    >
      {title && <h2 className="mb-3 text-xl font-bold sm:text-2xl">{title}</h2>}
      {intro && <div className="mb-7 max-w-3xl text-[15px] leading-relaxed text-slate-600">{intro}</div>}
      {children}
    </motion.section>
  )
}

export function FileBadge({ children }: { children: ReactNode }) {
  return (
    <span className="badge-file">
      <svg width="10" height="12" viewBox="0 0 10 12" fill="none" className="shrink-0">
        <path d="M1 1h5l3 3v7H1V1z" stroke="currentColor" strokeWidth="1" fill="white" />
      </svg>
      {children}
    </span>
  )
}

export function Endpoint({ children }: { children: ReactNode }) {
  return <span className="badge-endpoint">{children}</span>
}

export function RegionChip({ region }: { region: 1 | 2 | 3 | 4 }) {
  const color = REGION_COLORS[`region_${region}`]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{ background: `${color}16`, color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      Region {region}
    </span>
  )
}

export function ServiceCard({
  title,
  layer,
  color = '#1d4ed8',
  children,
  files = [],
  endpoints = [],
}: {
  title: string
  layer?: string
  color?: string
  children: ReactNode
  files?: string[]
  endpoints?: string[]
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card card-hover flex flex-col p-5"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="mb-1 flex items-center justify-between gap-2">
        <h3 className="font-bold">{title}</h3>
        {layer && (
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {layer}
          </span>
        )}
      </div>
      <div className="mb-3 text-sm leading-relaxed text-slate-600">{children}</div>
      {endpoints.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {endpoints.map((e) => (
            <Endpoint key={e}>{e}</Endpoint>
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-3">
          {files.map((f) => (
            <FileBadge key={f}>{f}</FileBadge>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export type Step = {
  title: string
  body: ReactNode
  badge?: string
  color?: string
}

/** Animated vertical stepper timeline */
export function Stepper({ steps, color = '#1d4ed8' }: { steps: Step[]; color?: string }) {
  return (
    <ol className="relative ml-3 border-l-2 border-dashed" style={{ borderColor: `${color}55` }}>
      {steps.map((s, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="relative pb-7 pl-8 last:pb-0"
        >
          <motion.span
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: i * 0.05 + 0.1 }}
            className="absolute -left-[15px] top-0 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow"
            style={{ background: s.color ?? color }}
          >
            {i + 1}
          </motion.span>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-semibold">{s.title}</h4>
            {s.badge && <FileBadge>{s.badge}</FileBadge>}
          </div>
          <div className="mt-1 text-sm leading-relaxed text-slate-600">{s.body}</div>
        </motion.li>
      ))}
    </ol>
  )
}
