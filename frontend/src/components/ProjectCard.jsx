import AppBadge from '@/components/AppBadge';
import { Card, CardContent } from '@/components/ui/card';

const STATUS_LABELS = {
  ACTIVE: 'Aktiv',
  PLANNED: 'Geplant',
  DONE: 'Abgeschlossen',
};

const STATUS_VARIANTS = {
  ACTIVE: 'status-active',
  PLANNED: 'status-planned',
  DONE: 'status-done',
};

export default function ProjectCard({
  title,
  status,
  skills,
  allocationPercent,
  allocationHoursPerMonth,
  billable,
}) {
  const statusLabel = STATUS_LABELS[status] ?? status;
  const statusVariant = STATUS_VARIANTS[status] ?? 'secondary';

  return (
    <Card className="outline-solid outline-3">
      <CardContent className="flex items-center justify-between pb-4 pt-4">
        <div>
          <div className="flex items-center gap-4 my-1">
            <AppBadge variant="project" label={title} className="text-lg font-semibold" />
            <AppBadge variant={statusVariant} label={statusLabel} />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(skills ?? []).map((s) => (
              <AppBadge key={s.id} label={s.name} variant="skill" />
            ))}
          </div>
        </div>
        {allocationPercent != null && (
          <div className="text-right">
            <p className="text-2xl font-bold">{allocationPercent}%</p>
            {allocationHoursPerMonth != null && (
              <p className="text-sm font-medium">{allocationHoursPerMonth} h / Monat</p>
            )}
            <p className="text-sm text-muted-foreground">{billable ? 'Fakturierbar' : 'Intern'}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
