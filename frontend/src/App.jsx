import { Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import EmployeesPage from './pages/EmployeesPage'
import ProjectsPage from './pages/ProjectsPage'
import MyAssignmentPage from './pages/MyAssignmentPage'

function App() {
  return (
    <div className="w-full bg-background">
      <NavBar />
      <Routes>
        <Route path="/" element={<Navigate to="/employees" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/my-assignment" element={<MyAssignmentPage />} />
      </Routes>
    </div>
  )
}

export default App