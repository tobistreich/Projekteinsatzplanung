import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppBadge from '@/components/AppBadge';
import AddSkillDialog from '@/components/AddSkillDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { STATUS_LABELS, STATUS_VARIANTS } from '@/lib/projectStatus';

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
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);

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

  async function removeSkill(skillId) {
    const updatedIds = (project.skills ?? []).filter((s) => s.id !== skillId).map((s) => s.id);
    await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillIds: updatedIds }),
    });
    setProject((prev) => ({ ...prev, skills: prev.skills.filter((s) => s.id !== skillId) }));
  }

  async function assignSkill(skillId) {
    const updatedIds = [...(project.skills ?? []).map((s) => s.id), skillId];
    await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillIds: updatedIds }),
    });
  }

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
            <h1 className="text-2xl font-semibold justify-start">{project.title}</h1>
            <div className="ml-20 flex gap-2">
              <Button variant="outline">Mitarbeiter zuweisen</Button>
              <Button variant="outline">Bearbeiten</Button>
              <Button variant="destructive">Löschen</Button>
            </div>
          </div>

          <AppBadge
            variant={STATUS_VARIANTS[project.status] ?? 'secondary'}
            label={STATUS_LABELS[project.status] ?? project.status}
          />

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium">Skills</span>
              <Button variant="outline" size="sm" onClick={() => setSkillDialogOpen(true)}>
                Skills hinzufügen
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {(project.skills ?? []).map((s) => (
                <AppBadge key={s.id} label={s.name} variant="skill" onRemove={() => removeSkill(s.id)} />
              ))}
            </div>
            <AddSkillDialog
              open={skillDialogOpen}
              onOpenChange={setSkillDialogOpen}
              currentSkills={project.skills ?? []}
              onAssign={assignSkill}
              onSkillAdded={(updatedSkills) => {
                setProject((prev) => ({ ...prev, skills: updatedSkills }));
                setSkillDialogOpen(false);
              }}
            />
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
