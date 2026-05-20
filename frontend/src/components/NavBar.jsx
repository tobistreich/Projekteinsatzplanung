import { Link, useMatch } from 'react-router-dom';
import { Button } from './ui/button';

const links = [
  { to: '/employees', label: 'Mitarbeiter' },
  { to: '/projects', label: 'Projekte' },
  { to: '/my-assignment', label: 'Mein Einsatz' },
];

function NavItem({ to, label }) {
  const isActive = useMatch({ path: to, end: true });
  return (
    <Button variant="ghost" asChild className={isActive ? 'underline underline-offset-4' : ''}>
      <Link to={to}>{label}</Link>
    </Button>
  );
}

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 border-b bg-background">
      <div className="flex items-center justify-between px-6 py-2">
        <p>Projekteinsatzplanung</p>
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavItem key={to} to={to} label={label} />
          ))}
        </div>
      </div>
    </nav>
  );
}
