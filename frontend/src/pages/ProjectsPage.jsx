import ProjectCard from '@/components/ProjectCard';
import { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Projektübersicht</h1>
      <div className="mt-4 space-y-2">
        {projects.map((p) => (
          <ProjectCard key={p.id} title={p.title} status={p.status} skills={p.skills} />
        ))}
      </div>
    </div>
  );
}
