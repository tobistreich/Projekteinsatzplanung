import { useState } from 'react';
import AppBadge from '@/components/AppBadge';
import { getSkillColorClass } from '@/lib/skillColors';
import AddSkillDialog from '@/components/AddSkillDialog';
import { Button } from '@/components/ui/button';

export default function SkillBadgeList({ skills, employeeId, onSkillsChanged }) {
  const [dialogOpen, setDialogOpen] = useState(false);

  async function removeSkill(skillId) {
    const updatedIds = skills.filter((s) => s.id !== skillId).map((s) => s.id);
    await fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillIds: updatedIds }),
    });
    onSkillsChanged(skills.filter((s) => s.id !== skillId));
  }

  async function assignSkill(skillId) {
    const updatedIds = [...skills.map((s) => s.id), skillId];
    await fetch(`/api/employees/${employeeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillIds: updatedIds }),
    });
  }

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-medium">Skills</span>
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          Skills hinzufügen
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {skills.map((s) => (
          <AppBadge key={s.id} label={s.name} variant="skill" colorClass={getSkillColorClass(s)} onRemove={() => removeSkill(s.id)} />
        ))}
      </div>
      <AddSkillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentSkills={skills}
        onAssign={assignSkill}
        onSkillAdded={(updatedSkills) => {
          onSkillsChanged(updatedSkills);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
