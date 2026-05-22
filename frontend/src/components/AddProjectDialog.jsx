import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppBadge from '@/components/AppBadge';
import SearchableList from '@/components/SearchableList';
import { XIcon } from 'lucide-react';
import { STATUS_OPTIONS } from '@/lib/projectStatus';

export default function AddProjectDialog({ open, onOpenChange, onProjectCreated }) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('PLANNED');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillQuery, setSkillQuery] = useState('');
  const [allSkills, setAllSkills] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setTitle('');
      setStartDate('');
      setEndDate('');
      setStatus('PLANNED');
      setSelectedSkills([]);
      setSkillQuery('');
      return;
    }
    fetch('/api/skills/')
      .then((res) => res.json())
      .then(setAllSkills);
  }, [open]);

  async function handleSelectSkill(skill) {
    setSelectedSkills((prev) => [...prev, skill]);
    setSkillQuery('');
  }

  async function handleCreateSkill(name) {
    const res = await fetch('/api/skills/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const newSkill = await res.json();
    setSelectedSkills((prev) => [...prev, newSkill]);
    setAllSkills((prev) => [...prev, newSkill]);
    setSkillQuery('');
  }

  function removeSkill(skillId) {
    setSelectedSkills((prev) => prev.filter((s) => s.id !== skillId));
  }

  async function handleSubmit() {
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), startDate, endDate, status }),
      });
      const newProject = await res.json();

      if (selectedSkills.length > 0) {
        await fetch(`/api/projects/${newProject.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skillIds: selectedSkills.map((s) => s.id) }),
        });
        newProject.skills = selectedSkills;
      } else {
        newProject.skills = [];
      }

      onProjectCreated(newProject);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  const selectedSkillIds = new Set(selectedSkills.map((s) => s.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Neues Projekt erstellen</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Startdatum</label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">Enddatum</label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Skills</label>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedSkills.map((skill) => (
                  <span key={skill.id} className="flex items-center gap-1">
                    <AppBadge label={skill.name} variant="skill" />
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <XIcon size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <SearchableList
              items={allSkills}
              query={skillQuery}
              onQueryChange={setSkillQuery}
              onSelect={handleSelectSkill}
              onCreate={handleCreateSkill}
              excludeIds={selectedSkillIds}
              placeholder="Skill suchen..."
              createLabel="Skill"
              maxHeight="max-h-40"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || submitting}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {submitting ? 'Wird erstellt...' : 'Erstellen'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
