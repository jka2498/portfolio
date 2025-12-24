import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminFetch } from '../api/adminClient'
import { buildPublicApiUrl } from '../api/apiConfig'
import { isLoggedIn } from '../api/auth'

type ProjectLifecycle = 'ACTIVE' | 'ARCHIVED'

type Project = {
  id: string
  name: string
  description?: string
  organization?: string
  region?: string
  lifecycle: ProjectLifecycle
  createdYear?: number
  technologies?: string[]
}

type ProjectForm = {
  id: string
  name: string
  description: string
  organization: string
  region: string
  lifecycle: ProjectLifecycle
  createdYear: string
  technologies: string
}

const emptyForm: ProjectForm = {
  id: '',
  name: '',
  description: '',
  organization: '',
  region: '',
  lifecycle: 'ACTIVE',
  createdYear: '',
  technologies: '',
}

const lifecycleOptions: ProjectLifecycle[] = ['ACTIVE', 'ARCHIVED']

export function AdminProjectsPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const loggedIn = isLoggedIn()

  const isEditing = Boolean(selectedId)

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [projects, selectedId],
  )

  const resetMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const loadProjects = async () => {
    try {
      setLoading(true)
      resetMessages()
      const response = await fetch(buildPublicApiUrl('/projects'))
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to load projects: ${response.status} ${errorText}`)
      }
      const data = (await response.json()) as Project[]
      setProjects(data)
    } catch (loadError) {
      console.error('Failed to load projects.', loadError)
      setError('Unable to load projects.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login', { replace: true })
      return
    }

    void loadProjects()
  }, [loggedIn, navigate])

  useEffect(() => {
    if (!selectedProject) {
      setForm(emptyForm)
      return
    }

    setForm({
      id: selectedProject.id,
      name: selectedProject.name,
      description: selectedProject.description ?? '',
      organization: selectedProject.organization ?? '',
      region: selectedProject.region ?? '',
      lifecycle: selectedProject.lifecycle,
      createdYear: selectedProject.createdYear ? String(selectedProject.createdYear) : '',
      technologies: selectedProject.technologies?.join(', ') ?? '',
    })
  }, [selectedProject])

  const handleChange = (field: keyof ProjectForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleEdit = (projectId: string) => {
    resetMessages()
    setSelectedId(projectId)
  }

  const handleCreateNew = () => {
    resetMessages()
    setSelectedId(null)
    setForm(emptyForm)
  }

  const buildPayload = (): Project => {
    const technologies = form.technologies
      .split(',')
      .map((tech) => tech.trim())
      .filter(Boolean)

    return {
      id: form.id.trim(),
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      organization: form.organization.trim() || undefined,
      region: form.region.trim() || undefined,
      lifecycle: form.lifecycle,
      createdYear: form.createdYear ? Number(form.createdYear) : undefined,
      technologies: technologies.length ? technologies : undefined,
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()
    setSaving(true)

    try {
      const payload = buildPayload()

      if (!payload.id || !payload.name) {
        throw new Error('Please fill in all required fields.')
      }

      if (isEditing) {
        await adminFetch(`/projects/${payload.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        setSuccess('Project updated successfully.')
      } else {
        await adminFetch('/projects', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setSuccess('Project created successfully.')
      }

      await loadProjects()
      if (!isEditing) {
        setForm(emptyForm)
      }
    } catch (submitError) {
      console.error('Failed to save project.', submitError)
      setError(submitError instanceof Error ? submitError.message : 'Unable to save project.')
    } finally {
      setSaving(false)
    }
  }

  const handleArchive = async (project: Project) => {
    resetMessages()
    setSaving(true)

    try {
      const payload: Project = {
        ...project,
        lifecycle: 'ARCHIVED',
      }

      await adminFetch(`/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      setSuccess(`Archived ${project.name}.`)
      await loadProjects()
    } catch (archiveError) {
      console.error('Failed to archive project.', archiveError)
      setError(archiveError instanceof Error ? archiveError.message : 'Unable to archive project.')
    } finally {
      setSaving(false)
    }
  }

  if (!loggedIn) {
    return <p>Redirecting to login…</p>
  }

  if (loading) {
    return <p>Loading projects…</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header>
        <h1>Admin Projects</h1>
        <p>Create, edit, and archive delivery buckets.</p>
      </header>

      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      {success && <p style={{ color: '#027a48' }}>{success}</p>}

      <section>
        <h2>Existing Projects</h2>
        {projects.length === 0 ? (
          <p>No projects available yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Region</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Lifecycle</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td style={{ padding: '0.5rem' }}>{project.id}</td>
                  <td style={{ padding: '0.5rem' }}>{project.name}</td>
                  <td style={{ padding: '0.5rem' }}>{project.region ?? 'Global'}</td>
                  <td style={{ padding: '0.5rem' }}>{project.lifecycle}</td>
                  <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <button type="button" onClick={() => handleEdit(project.id)}>
                      Edit
                    </button>
                    {project.lifecycle !== 'ARCHIVED' && (
                      <button type="button" onClick={() => handleArchive(project)}>
                        Archive
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2>{isEditing ? 'Edit Project' : 'Create Project'}</h2>
          {isEditing && (
            <button type="button" onClick={handleCreateNew}>
              Create new
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: 520 }}>
          <label style={{ display: 'grid', gap: '0.25rem' }}>
            ID
            <input
              name="id"
              value={form.id}
              onChange={handleChange('id')}
              readOnly={isEditing}
              required
            />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            Name
            <input name="name" value={form.name} onChange={handleChange('name')} required />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            Organization
            <input
              name="organization"
              value={form.organization}
              onChange={handleChange('organization')}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            Region
            <input name="region" value={form.region} onChange={handleChange('region')} />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            Lifecycle
            <select name="lifecycle" value={form.lifecycle} onChange={handleChange('lifecycle')}>
              {lifecycleOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            Created Year
            <input
              name="createdYear"
              type="number"
              value={form.createdYear}
              onChange={handleChange('createdYear')}
            />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            Technologies
            <input
              name="technologies"
              value={form.technologies}
              onChange={handleChange('technologies')}
              placeholder="React, AWS, Terraform"
            />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange('description')}
              rows={4}
            />
          </label>

          <button type="submit" disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create project'}
          </button>
        </form>
      </section>
    </div>
  )
}
