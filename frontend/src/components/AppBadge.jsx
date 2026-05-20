import { Badge } from "@/components/ui/badge"

const variantMap = {
  skill: "default",
  project: "project", 
  muted: "disabled"
}

export default function AppBadge({ label, type = "skill" }) {
  return <Badge variant={variantMap[type]}>{label}</Badge>
}