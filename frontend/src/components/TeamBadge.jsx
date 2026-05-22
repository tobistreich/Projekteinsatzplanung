import { useEffect, useState } from 'react';
import AppBadge from '@/components/AppBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SearchableList from '@/components/SearchableList';

export default function TeamBadge({ team, employeeId, onTeamChanged }) {
  const [open, setOpen] = useState(false);
  const [allTeams, setAllTeams] = useState([]);
  const [query, setQuery] = useState('');
  const [pendingTeam, setPendingTeam] = useState(null);

  useEffect(() => {
    if (!open) return;
    fetch('/api/teams')
      .then((r) => r.json())
      .then(setAllTeams);
  }, [open]);

  function handleClose() {
    setOpen(false);
    setQuery('');
    setPendingTeam(null);
  }

  async function handleSave() {
    const res = await fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: pendingTeam.id }),
    });
    const updated = await res.json();
    onTeamChanged(updated);
    handleClose();
  }

  async function handleCreateTeam(name) {
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const newTeam = await res.json();
    setAllTeams((prev) => [...prev, newTeam]);
    setPendingTeam(newTeam);
    setQuery('');
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="cursor-pointer">
        <AppBadge label={`${team.name} Team`} variant="team" />
      </button>

      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Team ändern</DialogTitle>
          </DialogHeader>

          <SearchableList
            items={allTeams}
            query={query}
            onQueryChange={setQuery}
            onSelect={setPendingTeam}
            onCreate={handleCreateTeam}
            selectedId={pendingTeam?.id}
            placeholder="Team suchen..."
            createLabel="Team"
            maxHeight="max-h-52"
          />

          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={handleClose}>
              Abbrechen
            </Button>
            <Button onClick={handleSave} disabled={!pendingTeam}>
              Speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
