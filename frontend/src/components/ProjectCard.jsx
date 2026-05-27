import AppBadge from '@/components/AppBadge';
import { getSkillColorClass } from '@/lib/skillColors';
import { Card, CardContent } from '@/components/ui/card';
import { STATUS_LABELS, STATUS_VARIANTS } from '@/lib/projectStatus';
import { formatDate } from '@/lib/format';

export default function ProjectCard({
  title,
  status,
  skills,
  startDate,
  endDate,
  allocationPercent,
  allocationHoursPerMonth,
  billable,
  onClick,
}) {
  const statusLabel = STATUS_LABELS[status] ?? status;
  const statusVariant = STATUS_VARIANTS[status] ?? 'secondary';

  return (
    <Card
      className="outline-solid outline-3 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="flex items-center justify-between pb-4 pt-4">
        <div className="w-full">
          <div className="flex items-center gap-4 my-1">
            <AppBadge variant="project" label={title} className="text-lg font-semibold" />
            <AppBadge variant={statusVariant} label={statusLabel} />
          </div>
          {(startDate || endDate) && (
            <span className="text-sm text-muted-foreground mt-1 block text-left">
              {formatDate(startDate)} – {formatDate(endDate)}
            </span>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {(skills ?? []).map((s) => (
              <AppBadge
                key={s.id}
                label={s.name}
                variant="skill"
                colorClass={getSkillColorClass(s)}
              />
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
