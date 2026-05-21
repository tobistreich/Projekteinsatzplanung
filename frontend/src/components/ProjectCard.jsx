import AppBadge from '@/components/AppBadge';
import { Card, CardContent } from '@/components/ui/card';

const STATUS_LABELS = {
  ACTIVE: 'Aktiv',
  PLANNED: 'Geplant',
  DONE: 'Abgeschlossen',
};

const STATUS_COLORS = {
  ACTIVE: 'text-green-600',
  PLANNED: 'text-yellow-600',
  DONE: 'text-gray-500',
};

export default function ProjectCard({ title, status, skills, allocationPercent, allocationHoursPerMonth, billable }) {
  const statusLabel = STATUS_LABELS[status] ?? status;
  const statusColor = STATUS_COLORS[status] ?? 'text-gray-600';

  return (
    <Card className="outline-solid outline-3">
      <CardContent className="flex items-center justify-between pb-4 pt-4">
        <div>
          <p className="font-medium">{title}</p>
          <p className={`text-sm ${statusColor}`}>Status: {statusLabel}</p>
          <div className="mt-1 flex flex-wrap gap-1">
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
            <p className="text-sm text-muted-foreground">
              {billable ? 'Fakturierbar' : 'Intern'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
