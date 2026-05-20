import { Badge } from '@/components/ui/badge';

export default function AppBadge({ label, variant }) {
  return <Badge variant={variant}>{label}</Badge>;
}
