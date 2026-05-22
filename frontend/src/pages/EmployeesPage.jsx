import AppBadge from '@/components/AppBadge';
import Workload from '@/components/Workload';
import AddEmployeeDialog from '@/components/AddEmployeeDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table.jsx';

function EmployeeRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-8 w-36 rounded-md" />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </TableCell>
      <TableCell className="min-w-32">
        <Skeleton className="h-3 w-full rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-10" />
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  function loadEmployees() {
    fetch('/api/employees')
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const grouped = employees.reduce((acc, e) => {
    (acc[e.team.name] ??= []).push(e);
    return acc;
  }, {});
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Mitarbeiterübersicht</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setDialogOpen(true)}>Neuer Mitarbeiter</Button>
      </div>
      <AddEmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onEmployeeCreated={() => {
          setLoading(true);
          loadEmployees();
        }}
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Skills</TableHead>
            <TableHead>Auslastung</TableHead>
            <TableHead>Faktura</TableHead>
            <TableHead>Projekte</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <EmployeeRowSkeleton key={i} />)
            : Object.entries(grouped).map(([team, members]) => (
                <Fragment key={team}>
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="py-2 text-left">
                      <AppBadge label={`${team} Team`} variant="team" />
                    </TableCell>
                  </TableRow>
                  {members.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/employee-details/${e.id}`)}
                        >
                          {e.firstName} {e.lastName}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {e.skills.map((s) => (
                            <AppBadge key={s.id} label={s.name} variant="skill" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="min-w-32">
                        <Workload value={e.availabilityPercent} max={100} />
                      </TableCell>
                      <TableCell className="text-sm tabular-nums">
                        {e.billablePercent ?? 0}%
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(e.projects ?? []).map((p) => (
                            <AppBadge key={p.id} label={p.title} variant="project" />
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </Fragment>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
