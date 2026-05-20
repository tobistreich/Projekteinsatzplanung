import SkillBadge from "@/components/SkillBadge"
import Workload from "./components/Workload"

function App() {
  return (
    <>
      <SkillBadge label="DevOps" variant="default" /> {/* default → blau */}
      <SkillBadge label="Ausgegraut" variant="disabled" /> {/* ausgegraut */}
      <Workload value={59} max={100} />
    </>
  )
}

export default App