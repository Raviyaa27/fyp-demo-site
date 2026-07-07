import Nav from './components/Nav'
import Hero from './components/Hero'
import ArchitectureSection from './sections/ArchitectureSection'
import OranNetworkSection from './sections/OranNetworkSection'
import Rapp1Section from './sections/Rapp1Section'
import DetectionSection from './sections/DetectionSection'
import MiniRagSection from './sections/MiniRagSection'
import Rapp2Section from './sections/Rapp2Section'
import SharingSection from './sections/SharingSection'
import DashboardSection from './sections/DashboardSection'
import StartupSection from './sections/StartupSection'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ArchitectureSection />
        <OranNetworkSection />
        <Rapp1Section />
        <DetectionSection />
        <MiniRagSection />
        <Rapp2Section />
        <SharingSection />
        <DashboardSection />
        <StartupSection />
      </main>
      <footer className="border-t border-line bg-white py-8 text-center text-sm text-slate-500">
        <p className="font-semibold text-ink">Multi-Region O-RAN CTI Platform — Final Year Project</p>
        <p className="mt-1">
          Mini RAG · Global RAG · rApps · xApps · Inter-Platform Threat Sharing · Global Dashboard
        </p>
      </footer>
    </>
  )
}
