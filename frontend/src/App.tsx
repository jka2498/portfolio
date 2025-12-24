import './App.css'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Overview } from './components/Overview'
import { ExperiencesTable } from './components/ExperiencesTable'
import { ProjectsTable } from './components/ProjectsTable'
import { Login } from './routes/Login'
import { AuthCallback } from './routes/AuthCallback'
import { AdminExperiencesPage } from './routes/AdminExperiencesPage'
import { AdminProjectsPage } from './routes/AdminProjectsPage'

function SectionDivider({ label, helper }: { label: string; helper?: string }) {
  return (
    <div className="section-divider">
      <div className="section-label">{label}</div>
      {helper ? <div className="section-helper">{helper}</div> : null}
    </div>
  )
}

function Home() {
  return (
    <Layout>
      <div className="section-stack">
        <Overview />
        <div className="section-block">
          <SectionDivider
            label="Compute"
            helper="Runtime timeline of engagements powering delivery"
          />
          <ExperiencesTable />
        </div>
        <div className="section-block">
          <SectionDivider
            label="Services"
            helper="Provisioned inventory derived from project delivery"
          />
          <ProjectsTable />
        </div>
      </div>
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
