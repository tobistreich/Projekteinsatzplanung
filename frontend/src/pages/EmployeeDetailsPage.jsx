import AppBadge from '@/components/AppBadge';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Workload from '@/components/Workload';

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/employees/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setEmployee(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
      });
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Mitarbeiter Detailansicht</h1>
      <Button className="flex justify-start" onClick={() => navigate(`/employees`)}>
        Zurück zur Übersicht
      </Button>
      {employee && (
        <div className="m-4 space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-olive-400 text-2xl font-semibold text-white">
              {employee.firstName.charAt(0).toUpperCase()}
              {employee.lastName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1"
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setTimeout(() => setIsEditing(false), 150)}
                />
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1"
                  onFocus={() => setIsEditing(true)}
                  onBlur={() => setTimeout(() => setIsEditing(false), 150)}
                />
                <Button className={isEditing ? 'visible' : 'invisible'}>Speichern</Button>
              </div>
              <Input value={employee.jobTitle} readOnly className="mt-1" />
              <div className="mt-2 flex">
                <AppBadge label={`${employee.team.name} Team`} variant="team" />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {employee.skills.map((s) => (
                  <AppBadge key={s.id} label={s.name} variant="skill" />
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Card className="outline-solid outline-3">
              <CardContent className="pt-6">
                <h2 className="mb-4">Auslastung</h2>
                <Workload className="m-8 p-8" value={employee.availabilityPercent} max={100} />
              </CardContent>
            </Card>
            <Card className="outline-solid outline-3">
              <CardContent className="pt-6">
                <h2 className="mb-4">Faktura</h2>
                {employee.billablePercent ?? 0}%
              </CardContent>
            </Card>
            <Card className="outline-solid outline-3">
              <CardContent className="pt-6">
                <h2 className="mb-4">Intern</h2>
                {100 - (employee.billablePercent ?? 0)}%
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
