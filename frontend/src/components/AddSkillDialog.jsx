import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function AddSkillDialog({ open, onOpenChange, employeeId, currentSkills, onSkillAdded }) {
  const [query, setQuery] = useState('');
  const [allSkills, setAllSkills] = useState([]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    fetch('/api/skills/')
      .then((res) => res.json())
      .then(setAllSkills);
  }, [open]);

  const currentSkillIds = new Set(currentSkills.map((s) => s.id));

  const filteredSkills = allSkills.filter(
    (s) =>
      !currentSkillIds.has(s.id) &&
      s.name.toLowerCase().includes(query.toLowerCase()),
  );

  const trimmed = query.trim();
  const exactMatch = allSkills.some(
    (s) => s.name.toLowerCase() === trimmed.toLowerCase(),
  );
  const showCreateOption = trimmed.length > 0 && !exactMatch;

  async function assignSkill(skillId, newSkillObj) {
    const updatedIds = [...currentSkills.map((s) => s.id), skillId];
    await fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillIds: updatedIds }),
    });
    onSkillAdded([...currentSkills, newSkillObj]);
  }

  async function handleAssignExisting(skill) {
    await assignSkill(skill.id, skill);
  }

  async function handleCreateNew() {
    const res = await fetch('/api/skills/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    });
    const newSkill = await res.json();
    await assignSkill(newSkill.id, newSkill);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Skill hinzufügen</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Skill suchen..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="mt-1 max-h-60 overflow-y-auto">
          {filteredSkills.map((skill) => (
            <button
              key={skill.id}
              onClick={() => handleAssignExisting(skill)}
              className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
            >
              {skill.name}
            </button>
          ))}
          {showCreateOption && (
            <button
              onClick={handleCreateNew}
              className="w-full rounded-md px-3 py-2 text-left text-sm text-primary hover:bg-muted"
            >
              + &ldquo;{trimmed}&rdquo; als neuen Skill erstellen
            </button>
          )}
          {filteredSkills.length === 0 && !showCreateOption && (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              Alle verfügbaren Skills bereits zugewiesen.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
