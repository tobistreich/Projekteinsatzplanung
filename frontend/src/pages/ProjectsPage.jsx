import ProjectCard from '@/components/ProjectCard';
import AddProjectDialog from '@/components/AddProjectDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';

function ProjectCardSkeleton() {
  return (
    <div>
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Projektübersicht</h1>
      <Button
        className="mt-4 px-4 py-2"
        onClick={() => { setDialogKey((k) => k + 1); setDialogOpen(true); }}
      >
        <PlusCircleIcon />
        Projekt hinzufügen
      </Button>
      <AddProjectDialog
        key={dialogKey}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onProjectCreated={(p) => setProjects((prev) => [p, ...prev])}
      />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : projects.map((p) => (
              <ProjectCard
                key={p.id}
                title={p.title}
                status={p.status}
                skills={p.skills}
                startDate={p.startDate}
                endDate={p.endDate}
                onClick={() => navigate(`/projects/${p.id}`)}
              />
            ))}
      </div>
    </div>
  );
}
