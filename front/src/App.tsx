import { BrowserRouter,Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/SignUp'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import {  useEffect } from 'react'
import api from './api/axios'
import { useState } from 'react';

const RootRedirect = () => {
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await api.get("/auth/verify", {
          withCredentials: true,
        });
        if (response.status === 200) {
          setRedirectTo("/projects");
        } else {
          setRedirectTo("/login");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setRedirectTo("/login");
      }
    };
    verify();
  }, []);
  console.log(redirectTo);
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }
  return null;
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
