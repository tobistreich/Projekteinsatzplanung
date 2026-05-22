import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppBadge from '@/components/AppBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STATUS_LABELS = { ACTIVE: 'Aktiv', PLANNED: 'Geplant', DONE: 'Abgeschlossen' };
const STATUS_VARIANTS = { ACTIVE: 'status-active', PLANNED: 'status-planned', DONE: 'status-done' };

function ProjectDetailsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-9 w-64" />
      <div className="flex gap-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-9 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  );
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/assignments/project/${id}`).then((r) => r.json()),
    ]).then(([proj, asns]) => {
      setProject(proj);
      setAssignments(asns);
    });
  }, [id]);

  const totalHours = assignments.reduce((s, a) => s + (a.allocationHoursPerMonth ?? 0), 0);

  return (
    <div className="p-6 space-y-4">
      <Button variant="ghost" className="px-0" onClick={() => navigate('/projects')}>
        ← Zurück zur Übersicht
      </Button>

      {!project ? (
        <ProjectDetailsSkeleton />
      ) : (
        <>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-semibold">{project.title}</h1>
            <div className="flex gap-2">
              <Button variant="outline">Mitarbeiter zuweisen</Button>
              <Button variant="outline">Bearbeiten</Button>
              <Button variant="destructive">Löschen</Button>
            </div>
          </div>

          <AppBadge
            variant={STATUS_VARIANTS[project.status] ?? 'secondary'}
            label={STATUS_LABELS[project.status] ?? project.status}
          />

          <div className="flex flex-wrap gap-2">
            {(project.skills ?? []).map((s) => (
              <AppBadge key={s.id} label={s.name} variant="skill" />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="outline-solid outline-3">
              <CardContent className="pt-6">
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                  Zugeordnete Mitarbeiter
                </h2>
                <p className="text-3xl font-bold">{assignments.length}</p>
              </CardContent>
            </Card>
            <Card className="outline-solid outline-3">
              <CardContent className="pt-6">
                <h2 className="mb-2 text-sm font-medium text-muted-foreground">
                  Gebuchte Kapazität
                </h2>
                <p className="text-3xl font-bold">{totalHours} h</p>
                <p className="text-sm text-muted-foreground">pro Monat</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
