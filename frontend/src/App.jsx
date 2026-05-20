import { Navigate, Route, Routes } from 'react-router-dom'
import EmployeesPage from './pages/EmployeesPage'
import ProjectsPage from './pages/ProjectsPage'
import MyAssignmentPage from './pages/MyAssignmentPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/employees" replace />} />
      <Route path="/employees" element={<EmployeesPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/my-assignment" element={<MyAssignmentPage />} />
    </Routes>
  )
}

export default App