import AppBadge from "@/components/AppBadge"
import Workload from "./components/Workload"

function App() {
  return (
    <>
      <AppBadge label="Java" type="skill" />
      <AppBadge label="PR 01" type="project" />
      <AppBadge label="DevOps" type="muted" />
      <Workload value={59} max={100} />
    </>
  )
}

export default App