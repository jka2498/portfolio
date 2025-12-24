import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Overview } from './components/Overview'
import { ExperiencesTable } from './components/ExperiencesTable'
import { ProjectsTable } from './components/ProjectsTable'
import { Storage } from './components/Storage'
import { Login } from './routes/Login'
import { AuthCallback } from './routes/AuthCallback'
import { AdminExperiencesPage } from './routes/AdminExperiencesPage'
import { AdminProjectsPage } from './routes/AdminProjectsPage'

function Home() {
  return (
    <Layout>
      <Overview />
      <ExperiencesTable />
      <Storage />
    </Layout>
  )
}

function ProjectsPage() {
  return (
    <Layout>
      <ProjectsTable />
    </Layout>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/admin/experiences" element={<AdminExperiencesPage />} />
      <Route path="/admin/projects" element={<AdminProjectsPage />} />
    </Routes>
  )
}
