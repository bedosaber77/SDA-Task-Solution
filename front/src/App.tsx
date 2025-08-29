import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/SignUp'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
const RootRedirect = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/projects" /> : <Navigate to="/login" />;
};
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
       <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />
      <Route
        path='/projects/:id'
        element={
          <ProtectedRoute>
            <ProjectDetail />
          </ProtectedRoute>
        }
      />
    </Routes>
    </BrowserRouter>
  )
}

export default App
