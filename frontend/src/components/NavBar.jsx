import { Link, useMatch } from 'react-router-dom';

const links = [
  { to: '/employees', label: 'Mitarbeiter' },
  { to: '/projects', label: 'Projekte' },
];

function NavItem({ to, label }) {
  const isActive = useMatch({ path: to, end: false });
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {label}
    </Link>
  );
}

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 bg-white text-slate-900 border-b border-slate-200">
      <div className="flex items-center justify-between px-6 py-3">
        <p className="font-semibold text-slate-900 tracking-tight">Projekteinsatzplanung</p>
        <div className="flex items-center gap-1">
          {links.map(({ to, label }) => (
            <NavItem key={to} to={to} label={label} />
          ))}
        </div>
      </div>
    </nav>
  );
}
