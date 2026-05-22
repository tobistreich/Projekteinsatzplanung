import { useState } from 'react';
import AppBadge from '@/components/AppBadge';
import AddSkillDialog from '@/components/AddSkillDialog';
import { Button } from '@/components/ui/button';

export default function SkillBadgeList({ skills, employeeId, onSkillsChanged }) {
  const [dialogOpen, setDialogOpen] = useState(false);

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
          <AppBadge key={s.id} label={s.name} variant="skill" />
        ))}
      </div>
      <AddSkillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employeeId={employeeId}
        currentSkills={skills}
        onSkillAdded={(updatedSkills) => {
          onSkillsChanged(updatedSkills);
          setDialogOpen(false);
        }}
      />
    </div>
  );
}
