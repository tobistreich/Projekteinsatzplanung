import ProjectCard from '@/components/ProjectCard';
import SkillBadgeList from '@/components/SkillBadgeList';
import TeamBadge from '@/components/TeamBadge';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
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
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const blurTimerRef = useRef(null);

  const handleFocus = () => {
    clearTimeout(blurTimerRef.current);
    setIsEditing(true);
  };
  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => setIsEditing(false), 150);
  };

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Mitarbeiter Detailansicht</h1>
      <Button className="flex justify-start" onClick={() => navigate('/employees')}>
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
              <div className="mt-2">
                <TeamBadge
                  team={employee.team}
                  employeeId={id}
                  onTeamChanged={setEmployee}
                />
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

          <SkillBadgeList
            skills={employee.skills}
            employeeId={id}
            onSkillsChanged={(skills) => setEmployee((prev) => ({ ...prev, skills }))}
          />

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
