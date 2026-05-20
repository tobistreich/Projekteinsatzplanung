import SkillBadge from "@/components/SkillBadge"

function App() {
  return (
    <>
      <SkillBadge label="DevOps" variant="default" /> {/* default → blau */}
      <SkillBadge label="Ausgegraut" variant="outline" /> {/* ausgegraut */}
    </>
  )
}

export default App