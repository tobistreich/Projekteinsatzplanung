import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SearchableList from '@/components/SearchableList';
import { CirclePlusIcon } from 'lucide-react';

export default function AddSkillDialog({
  open,
  onOpenChange,
  currentSkills,
  onSkillAdded,
  onAssign,
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

  async function handleAssign(skillId, newSkillObj) {
    await onAssign(skillId, newSkillObj);
    onSkillAdded([...currentSkills, newSkillObj]);
  }

  async function handleCreateNew(name) {
    const res = await fetch('/api/skills/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const newSkill = await res.json();
    await handleAssign(newSkill.id, newSkill);
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
          onSelect={(skill) => handleAssign(skill.id, skill)}
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
