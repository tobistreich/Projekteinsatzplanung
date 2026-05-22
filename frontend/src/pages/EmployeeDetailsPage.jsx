import AppBadge from '@/components/AppBadge';
import AddSkillDialog from '@/components/AddSkillDialog';
import ProjectCard from '@/components/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Workload from '@/components/Workload';

function EmployeeDetailsSkeleton() {
  return (
    <div className="m-4 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton className="h-20 w-20 shrink-0 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-9 w-36" />
          </div>
          <Skeleton className="h-9 w-52" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="outline-solid outline-3">
            <CardContent className="pt-6 space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-16 rounded-full" />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="outline-solid outline-3">
            <CardContent className="flex items-center justify-between pb-4 pt-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-24" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
              <div className="space-y-1 text-right">
                <Skeleton className="h-8 w-16 ml-auto" />
                <Skeleton className="h-3 w-20 ml-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [allTeams, setAllTeams] = useState([]);
  const [teamQuery, setTeamQuery] = useState('');
  const blurTimerRef = useRef(null);

  const handleFocus = () => {
    clearTimeout(blurTimerRef.current);
    setIsEditing(true);
  };
  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => setIsEditing(false), 150);
  };
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setJobTitle(data.jobTitle);
      });
  }, [id]);

  useEffect(() => {
    if (!teamDialogOpen) return;
    fetch('/api/teams')
      .then((res) => res.json())
      .then(setAllTeams);
  }, [teamDialogOpen]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Mitarbeiter Detailansicht</h1>
      <Button className="flex justify-start" onClick={() => navigate(`/employees`)}>
        Zurück zur Übersicht
      </Button>
      {!employee ? (
        <EmployeeDetailsSkeleton />
      ) : (
        <div className="m-4 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-olive-400 text-2xl font-semibold text-white">
              {employee.firstName.charAt(0).toUpperCase()}
              {employee.lastName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
                <Button
                  className={isEditing ? 'visible' : 'invisible'}
                  onClick={() =>
                    fetch(`/api/employees/${id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ firstName, lastName, jobTitle }),
                    })
                      .then((r) => r.json())
                      .then((updated) => {
                        setEmployee(updated);
                        setFirstName(updated.firstName);
                        setLastName(updated.lastName);
                        setJobTitle(updated.jobTitle);
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
                    setFirstName(employee.firstName);
                    setLastName(employee.lastName);
                    setJobTitle(employee.jobTitle);
                    setIsEditing(false);
                  }}
                >
                  ✕
                </Button>
              </div>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="mt-1"
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <div className="mt-2 flex items-center gap-2">
                <AppBadge label={`${employee.team.name} Team`} variant="team" />
                <Button variant="ghost" size="xs" onClick={() => setTeamDialogOpen(true)}>
                  ändern
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="outline-solid outline-3">
              <CardContent className="pt-6">
                <h2 className="mb-4">Auslastung</h2>
                <Workload className="m-8 p-8" value={employee.availabilityPercent} max={100} />
                <p className="mt-2 text-center font-medium">
                  {employee.allocatedHours ?? 0} / {employee.monthlyCapacityHours ?? 0} h des Monats
                  verplant
                </p>
              </CardContent>
            </Card>
            <Card className="outline-solid outline-3">
              <CardContent className="pt-6">
                <h2 className="mb-4">Faktura</h2>
                <p className="text-2xl font-bold">{employee.billablePercent ?? 0}%</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {employee.billableAllocatedHours ?? 0} h fakturierbar
                </p>
              </CardContent>
            </Card>
            <Card className="outline-solid outline-3">
              <CardContent className="pt-6">
                <h2 className="mb-4">Intern</h2>
                <p className="text-2xl font-bold">{employee.internalPercent ?? 0}%</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {employee.internalAllocatedHours ?? 0} h intern
                </p>
              </CardContent>
            </Card>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium">Skills</span>
              <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
                Skills hinzufügen
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {employee.skills.map((s) => (
                <AppBadge key={s.id} label={s.name} variant="skill" />
              ))}
            </div>
            <AddSkillDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              employeeId={id}
              currentSkills={employee.skills}
              onSkillAdded={(updatedSkills) => {
                setEmployee((prev) => ({ ...prev, skills: updatedSkills }));
                setDialogOpen(false);
              }}
            />
            <Dialog
              open={teamDialogOpen}
              onOpenChange={(open) => {
                setTeamDialogOpen(open);
                if (!open) setTeamQuery('');
              }}
            >
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Team ändern</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Team suchen..."
                  value={teamQuery}
                  onChange={(e) => setTeamQuery(e.target.value)}
                  autoFocus
                />
                <div className="mt-1 max-h-60 overflow-y-auto">
                  {(() => {
                    const trimmed = teamQuery.trim();
                    const filtered = allTeams.filter((t) =>
                      t.name.toLowerCase().includes(trimmed.toLowerCase())
                    );
                    const exactMatch = allTeams.some(
                      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
                    );
                    const showCreate = trimmed.length > 0 && !exactMatch;

                    const assignTeam = (teamId) =>
                      fetch(`/api/employees/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ teamId }),
                      })
                        .then((r) => r.json())
                        .then((updated) => {
                          setEmployee(updated);
                          setTeamDialogOpen(false);
                          setTeamQuery('');
                        });

                    return (
                      <>
                        {filtered.map((team) => (
                          <button
                            key={team.id}
                            onClick={() => assignTeam(team.id)}
                            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
                          >
                            {team.name}
                          </button>
                        ))}
                        {showCreate && (
                          <button
                            onClick={async () => {
                              const res = await fetch('/api/teams', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ name: trimmed }),
                              });
                              const newTeam = await res.json();
                              setAllTeams((prev) => [...prev, newTeam]);
                              await assignTeam(newTeam.id);
                            }}
                            className="w-full rounded-md px-3 py-2 text-left text-sm text-primary hover:bg-muted"
                          >
                            + &ldquo;{trimmed}&rdquo; als neues Team erstellen
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <span className="mb-2 text-sm font-medium">Aktive Projekte</span>
            <div className="space-y-2">
              {(employee.projects ?? []).map((p) => (
                <ProjectCard
                  key={p.id}
                  title={p.title}
                  status={p.status}
                  skills={p.skills}
                  allocationPercent={p.allocationPercent}
                  allocationHoursPerMonth={p.allocationHoursPerMonth}
                  billable={p.billable}
                  onClick={() => navigate(`/projects/${p.id}`)}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-sm font-medium">
              <span>Verbleibende freie Kapazität</span>
              <span>
                {100 - (employee.availabilityPercent ?? 0)}%{' · '}
                {(employee.monthlyCapacityHours ?? 0) - (employee.allocatedHours ?? 0)} h / Monat
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
