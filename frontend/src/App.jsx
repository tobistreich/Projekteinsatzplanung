import { Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import EmployeesPage from './pages/EmployeesPage';
import ProjectsPage from './pages/ProjectsPage';
import EmployeeDetailsPage from './pages/EmployeeDetailsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';

function App() {
  return (
    <div className="mx-auto w-[85%] bg-slate-50 min-h-screen">
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/employee-details/:id" element={<EmployeeDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
