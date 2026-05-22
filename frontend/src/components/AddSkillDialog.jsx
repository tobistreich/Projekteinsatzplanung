import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SearchableList from '@/components/SearchableList';

export default function AddSkillDialog({
  open,
  onOpenChange,
  employeeId,
  currentSkills,
  onSkillAdded,
}) {
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

  async function assignSkill(skillId, newSkillObj) {
    const updatedIds = [...currentSkills.map((s) => s.id), skillId];
    await fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillIds: updatedIds }),
    });
    onSkillAdded([...currentSkills, newSkillObj]);
  }

  async function handleCreateNew(name) {
    const res = await fetch('/api/skills/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const newSkill = await res.json();
    await assignSkill(newSkill.id, newSkill);
  }

  const currentSkillIds = new Set(currentSkills.map((s) => s.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Skill hinzufügen</DialogTitle>
        </DialogHeader>
        <SearchableList
          items={allSkills}
          query={query}
          onQueryChange={setQuery}
          onSelect={(skill) => assignSkill(skill.id, skill)}
          onCreate={handleCreateNew}
          excludeIds={currentSkillIds}
          placeholder="Skill suchen..."
          createLabel="Skill"
          emptyMessage="Alle verfügbaren Skills bereits zugewiesen."
        />
      </DialogContent>
    </Dialog>
  );
}
