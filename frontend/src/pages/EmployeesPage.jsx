import AppBadge from "@/components/AppBadge";
import Workload from "@/components/Workload";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table.jsx";

const employees = [
  {
    name: "Tobi Streich",
    team: "DCD",
    skills: ["React", "C#", "Java", "SQL"],
    auslastung: 30,
    faktura: 0,
    intern: 30,
    projekte: ["Projekteinsatzplanung"],
  },
  {
    name: "Jonny Do",
    team: "DCD",
    skills: ["Roblox", "C#", "Unity"],
    auslastung: 75,
    faktura: 60,
    intern: 15,
    projekte: ["Projekt Alpha", "Projekt Beta"],
  },
  {
    name: "Rainer Winkler",
    team: "Personal",
    skills: ["Forza", "Meddler", "Drachenlord"],
    auslastung: 50,
    faktura: 30,
    intern: 20,
    projekte: ["Projekt Brot"],
  },
  {
    name: "Max Müller",
    team: "AngryNerds",
    skills: ["Angular", "C#"],
    auslastung: 80,
    faktura: 70,
    intern: 10,
    projekte: ["Projekt Delta"],
  },
  {
    name: "Lisa Weber",
    team: "AngryNerds",
    skills: ["DevOps", "Kubernetes"],
    auslastung: 30,
    faktura: 0,
    intern: 30,
    projekte: [],
  },
];

const grouped = employees.reduce((acc, e) => {
  (acc[e.team] ??= []).push(e);
  return acc;
}, {});

export default function EmployeesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Mitarbeiterübersicht</h1>
      <div className="flex justify-end mb-4">
        <Button icon="plus">Neuer Mitarbeiter</Button>
      </div>
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
          {Object.entries(grouped).map(([team, members]) => (
            <>
              <TableRow key={team} className="hover:bg-transparent">
                <TableCell colSpan={5} className="py-2 text-left">
                  <AppBadge label={team} variant="team" />
                </TableCell>
              </TableRow>
              {members.map((e) => (
                <TableRow key={e.name}>
                  <TableCell><Button variant="outline">{e.name}</Button></TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {e.skills.map((s) => (
                        <AppBadge key={s} label={s} variant="skill" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="min-w-32">
                    <Workload value={e.auslastung} max={100} />
                  </TableCell>
                  <TableCell className="text-sm tabular-nums">
                    {e.faktura}% / {e.intern}%
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {e.projekte.map((p) => (
                        <AppBadge key={p} label={p} variant="project" />
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
