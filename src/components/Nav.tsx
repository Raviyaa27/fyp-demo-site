const links = [
  ['#architecture', 'Architecture'],
  ['#oran-network', 'O-RAN Network'],
  ['#rapp1', 'rApp1 CTI Pipeline'],
  ['#detection', 'Detection Flow'],
  ['#mini-rag', 'Mini RAG Logic'],
  ['#rapp2', 'rApp2 & Live Updates'],
  ['#sharing', 'Threat Sharing'],
  ['#dashboard', 'Dashboard'],
  ['#startup', 'Startup Guide'],
]

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
        <a href="#top" className="flex items-center gap-2 font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-extrabold text-white">
            OC
          </span>
          <span className="hidden sm:inline">O-RAN CTI Platform</span>
        </a>
        <nav className="ml-auto hidden items-center gap-4 overflow-x-auto text-[13px] font-medium text-slate-600 lg:flex">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="whitespace-nowrap hover:text-accent">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
