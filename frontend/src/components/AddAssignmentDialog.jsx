import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import AppBadge from '@/components/AppBadge';
import { getSkillColorClass } from '@/lib/skillColors';

export default function AddAssignmentDialog({
  open,
  onOpenChange,
  project,
  assignments = [],
  onAssigned,
}) {
  // null = noch nicht geladen (loading), [] = geladen aber leer
  const [matchingEmployees, setMatchingEmployees] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hours, setHours] = useState('');
  const [billable, setBillable] = useState(true);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(project.endDate ?? '');

  const loading = open && matchingEmployees === null;
  const assignedIds = new Set(assignments.map((a) => a.employee?.id));
  const availableEmployees = matchingEmployees?.filter((e) => !assignedIds.has(e.id)) ?? null;

  useEffect(() => {
    if (!open) return;
    fetch(`/api/projects/${project.id}/matching-employees`)
      .then((res) => res.json())
      .then(setMatchingEmployees);
  }, [open, project.id]);

  function handleOpenChange(nextOpen) {
    if (!nextOpen) {
      setMatchingEmployees(null);
      setError(null);
      setHours('');
      setBillable(true);
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate(project.endDate ?? '');
    }
    onOpenChange(nextOpen);
  }

  async function handleAssign(emp) {
    setError(null);
    const h = Number(hours);
    if (!h || h <= 0) {
      setError('Bitte eine gültige Stundenzahl eingeben.');
      return;
    }
    if (h > emp.minRemainingCapacityHours) {
      setError(
        `${h} h übersteigt die verfügbare Kapazität von ${emp.firstName} ${emp.lastName} (${emp.minRemainingCapacityHours} h/Monat).`
      );
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: emp.id,
          projectId: project.id,
          startDate,
          endDate,
          allocationHoursPerMonth: h,
          billable,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        setError(text || 'Zuweisung fehlgeschlagen.');
        return;
      }
      onAssigned();
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mitarbeiter zuweisen</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Startdatum</label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Enddatum</label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="flex items-end gap-6">
          <div className="space-y-1 flex-1">
            <label className="text-xs text-muted-foreground">Monatliche Stunden</label>
            <Input
              type="number"
              min="1"
              placeholder="z.B. 80"
              value={hours}
              onChange={(e) => {
                setHours(e.target.value);
                setError(null);
              }}
            />
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <span className={`text-sm ${!billable ? 'font-medium' : 'text-muted-foreground'}`}>
              Intern
            </span>
            <Switch checked={billable} onCheckedChange={setBillable} />
            <span className={`text-sm ${billable ? 'font-medium' : 'text-muted-foreground'}`}>
              Faktura
            </span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {loading ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          ) : availableEmployees?.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Keine passenden Mitarbeiter gefunden.
            </p>
          ) : (
            availableEmployees?.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">
                    {emp.firstName} {emp.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">{emp.jobTitle}</div>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {emp.matchedSkills.map((skill) => (
                      <AppBadge
                        key={skill.id}
                        label={skill.name}
                        variant="skill"
                        colorClass={getSkillColorClass(skill)}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Verfügbar: {emp.minRemainingCapacityHours} h/Monat
                  </div>
                </div>
                <Button size="sm" disabled={submitting} onClick={() => handleAssign(emp)}>
                  Zuweisen
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={submitting}>
            Schließen
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
