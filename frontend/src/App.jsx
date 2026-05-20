import AppBadge from "@/components/AppBadge"
import Workload from "./components/Workload"

function App() {
  return (
    <>
      <AppBadge label="Java" variant="skill" />
      <AppBadge label="PR 01" variant="project" />
      <AppBadge label="DevOps" variant="muted" />
      <Workload value={59} max={100} />
    </>
  )
}

export default App