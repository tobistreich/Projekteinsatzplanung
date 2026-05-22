import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppBadge from '@/components/AppBadge';
import SearchableList from '@/components/SearchableList';
import { XIcon } from 'lucide-react';

export default function AddEmployeeDialog({ open, onOpenChange, onEmployeeCreated }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [monthlyCapacityHours, setMonthlyCapacityHours] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamQuery, setTeamQuery] = useState('');
  const [allTeams, setAllTeams] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setFirstName('');
      setLastName('');
      setJobTitle('');
      setMonthlyCapacityHours('');
      setSelectedTeam(null);
      setTeamQuery('');
      return;
    }
    fetch('/api/teams')
      .then((res) => res.json())
      .then(setAllTeams);
  }, [open]);

  async function handleCreateTeam(name) {
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const newTeam = await res.json();
    setAllTeams((prev) => [...prev, newTeam]);
    setSelectedTeam(newTeam);
    setTeamQuery('');
  }

  const canSubmit = firstName.trim() && lastName.trim() && jobTitle.trim() && selectedTeam;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          jobTitle: jobTitle.trim(),
          monthlyCapacityHours: monthlyCapacityHours ? Number(monthlyCapacityHours) : 160,
          teamId: selectedTeam.id,
        }),
      });
      const newEmployee = await res.json();
      onEmployeeCreated(newEmployee);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Neuen Mitarbeiter anlegen</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Vorname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoFocus
            />
            <Input
              placeholder="Nachname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <Input
            placeholder="Jobtitel"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <Input
            placeholder="Monatliche Kapazität in Stunden (Standard: 160)"
            type="number"
            value={monthlyCapacityHours}
            onChange={(e) => setMonthlyCapacityHours(e.target.value)}
          />

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Team</label>
            {selectedTeam ? (
              <span className="flex items-center gap-1">
                <AppBadge label={`${selectedTeam.name} Team`} variant="team" />
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <XIcon size={12} />
                </button>
              </span>
            ) : (
              <SearchableList
                items={allTeams}
                query={teamQuery}
                onQueryChange={setTeamQuery}
                onSelect={(team) => { setSelectedTeam(team); setTeamQuery(''); }}
                onCreate={handleCreateTeam}
                placeholder="Team suchen..."
                createLabel="Team"
                maxHeight="max-h-40"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting}>
            {submitting ? 'Wird erstellt...' : 'Erstellen'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
