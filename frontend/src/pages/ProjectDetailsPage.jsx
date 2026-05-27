import { Fragment, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CirclePlusIcon, PlusCircleIcon } from 'lucide-react';
import AppBadge from '@/components/AppBadge';
import AddSkillDialog from '@/components/AddSkillDialog';
import AddAssignmentDialog from '@/components/AddAssignmentDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { STATUS_LABELS, STATUS_VARIANTS } from '@/lib/projectStatus';
import { getSkillColorClass } from '@/lib/skillColors';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table.jsx';

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
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAssignmentDialogOpen, setDeleteAssignmentDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const blurTimerRef = useRef(null);

  const handleFocus = () => {
    clearTimeout(blurTimerRef.current);
    setIsEditing(true);
  };
  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => setIsEditing(false), 150);
  };

  useEffect(() => {
    Promise.all([
      fetch(`/api/projects/${id}`).then((r) => r.json()),
      fetch(`/api/assignments/project/${id}`).then((r) => r.json()),
    ]).then(([proj, asns]) => {
      setProject(proj);
      setTitle(proj.title);
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
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-semibold w-[80%]"
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <Button
              className={isEditing ? 'visible' : 'invisible'}
              onClick={() =>
                fetch(`/api/projects/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ title }),
                })
                  .then((r) => r.json())
                  .then((updated) => {
                    setProject(updated);
                    setTitle(updated.title);
                    setIsEditing(false);
                  })
              }
            >
              Speichern
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={isEditing ? 'visible text-destructive' : 'invisible'}
              onClick={() => {
                setTitle(project.title);
                setIsEditing(false);
              }}
            >
              ✕
            </Button>
            <p>
              {new Date(project.startDate).toLocaleDateString('de-DE')} -{' '}
              {new Date(project.endDate).toLocaleDateString('de-DE')}
            </p>
            <div className="ml-auto flex gap-2">
              <Button variant="outline" onClick={() => setAssignmentDialogOpen(true)}>
                <CirclePlusIcon />
                Mitarbeiter zuweisen
              </Button>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                Löschen
              </Button>
            </div>
          </div>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Projekt löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Möchten Sie das Projekt <strong>{project.title}</strong> wirklich löschen? Diese
                  Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() =>
                    fetch(`/api/projects/${id}`, { method: 'DELETE' }).then(() =>
                      navigate('/projects')
                    )
                  }
                >
                  Löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog
            open={deleteAssignmentDialogOpen}
            onOpenChange={setDeleteAssignmentDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Zuweisung löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Möchten Sie die Zuweisung von{' '}
                  <strong>
                    {assignmentToDelete?.employee.firstName} {assignmentToDelete?.employee.lastName}
                  </strong>{' '}
                  wirklich entfernen? Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 text-white hover:bg-red-600"
                  onClick={() =>
                    fetch(`/api/assignments/${assignmentToDelete.id}`, { method: 'DELETE' }).then(
                      () =>
                        fetch(`/api/assignments/project/${id}`)
                          .then((r) => r.json())
                          .then(setAssignments)
                    )
                  }
                >
                  Zuweisung entfernen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AppBadge
            variant={STATUS_VARIANTS[project.status] ?? 'secondary'}
            label={STATUS_LABELS[project.status] ?? project.status}
          />
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium">Skills</span>
              <Button variant="outline" size="sm" onClick={() => setSkillDialogOpen(true)}>
                <PlusCircleIcon />
                Skills hinzufügen
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {(project.skills ?? []).map((s) => (
                <AppBadge
                  key={s.id}
                  label={s.name}
                  variant="skill"
                  colorClass={getSkillColorClass(s)}
                  onRemove={() => removeSkill(s.id)}
                />
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
            <AddAssignmentDialog
              open={assignmentDialogOpen}
              onOpenChange={setAssignmentDialogOpen}
              project={project}
              assignments={assignments}
              onAssigned={() => {
                fetch(`/api/assignments/project/${id}`)
                  .then((r) => r.json())
                  .then(setAssignments);
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
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Kapazität</TableHead>
                  <TableHead>Auslastung</TableHead>
                  <TableHead>Typ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/employee-details/${a.employee.id}`)}
                      >
                        {a.employee.firstName} {a.employee.lastName}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(a.employee.skills ?? []).map((s) => (
                          <AppBadge
                            key={s.id}
                            label={s.name}
                            variant="skill"
                            colorClass={getSkillColorClass(s)}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{a.allocationHoursPerMonth} h</TableCell>
                    <TableCell>
                      {Math.round(((a.allocationHoursPerMonth ?? 0) / 160) * 100)}%
                    </TableCell>
                    <TableCell>{a.billable ? 'Faktura' : 'Intern'}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setAssignmentToDelete(a);
                          setDeleteAssignmentDialogOpen(true);
                        }}
                      >
                        Zuweisung entfernen
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
