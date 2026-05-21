import ProjectCard from '@/components/ProjectCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

function ProjectCardSkeleton() {
  return (
    <div>
      <Button variant="ghost" className="p-0">
        Projekt hinzufügen
      </Button>
      <Card className="outline-solid outline-3">
        <CardContent className="flex items-center justify-between pb-4 pt-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-1 mt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Projektübersicht</h1>
      <div className="mt-4 space-y-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : projects.map((p) => (
              <ProjectCard key={p.id} title={p.title} status={p.status} skills={p.skills} />
            ))}
      </div>
    </div>
  );
}
