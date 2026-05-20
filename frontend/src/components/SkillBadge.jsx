import { Badge } from "@/components/ui/badge"

export default function SkillBadge({ label, variant = "default" }) {
  return <Badge variant={variant}>{label}</Badge>
}