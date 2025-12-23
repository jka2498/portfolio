import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminFetch } from '../api/adminClient'
import { buildPublicApiUrl } from '../api/apiConfig'
import { isLoggedIn } from '../api/auth'

type ExperienceState = 'RUNNING' | 'STOPPED' | 'ARCHIVED'

type Experience = {
  id: string
  name: string
  organization: string
  domain?: string
  state: ExperienceState
  launchYear: number
  description?: string
}

type ExperienceForm = {
  id: string
  name: string
  organization: string
  domain: string
  state: ExperienceState
  launchYear: string
  description: string
}

const emptyForm: ExperienceForm = {
  id: '',
  name: '',
  organization: '',
  domain: '',
  state: 'RUNNING',
  launchYear: '',
  description: '',
}

const stateOptions: ExperienceState[] = ['RUNNING', 'STOPPED', 'ARCHIVED']

export function AdminExperiencesPage() {
  const navigate = useNavigate()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [form, setForm] = useState<ExperienceForm>(emptyForm)
  const loggedIn = isLoggedIn()

  const isEditing = Boolean(selectedId)

  const selectedExperience = useMemo(
    () => experiences.find((experience) => experience.id === selectedId) ?? null,
    [experiences, selectedId],
  )

  const resetMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const loadExperiences = async () => {
    try {
      setLoading(true)
      resetMessages()
      const response = await fetch(buildPublicApiUrl('/experiences'))
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to load experiences: ${response.status} ${errorText}`)
      }
      const data = (await response.json()) as Experience[]
      setExperiences(data)
    } catch (loadError) {
      console.error('Failed to load experiences.', loadError)
      setError('Unable to load experiences.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loggedIn) {
      navigate('/login', { replace: true })
      return
    }

    void loadExperiences()
  }, [loggedIn, navigate])

  useEffect(() => {
    if (!selectedExperience) {
      setForm(emptyForm)
      return
    }

    setForm({
      id: selectedExperience.id,
      name: selectedExperience.name,
      organization: selectedExperience.organization,
      domain: selectedExperience.domain ?? '',
      state: selectedExperience.state,
      launchYear: String(selectedExperience.launchYear),
      description: selectedExperience.description ?? '',
    })
  }, [selectedExperience])

  const handleChange = (field: keyof ExperienceForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleEdit = (experienceId: string) => {
    resetMessages()
    setSelectedId(experienceId)
  }

  const handleCreateNew = () => {
    resetMessages()
    setSelectedId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()
    setSaving(true)

    try {
      const payload: Experience = {
        id: form.id.trim(),
        name: form.name.trim(),
        organization: form.organization.trim(),
        domain: form.domain.trim() || undefined,
        state: form.state,
        launchYear: Number(form.launchYear),
        description: form.description.trim() || undefined,
      }

      if (!payload.id || !payload.name || !payload.organization || !payload.launchYear) {
        throw new Error('Please fill in all required fields.')
      }

      if (isEditing) {
        await adminFetch(`/experiences/${payload.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        setSuccess('Experience updated successfully.')
      } else {
        await adminFetch('/experiences', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setSuccess('Experience created successfully.')
      }

      await loadExperiences()
      if (!isEditing) {
        setForm(emptyForm)
      }
    } catch (submitError) {
      console.error('Failed to save experience.', submitError)
      setError(
        submitError instanceof Error ? submitError.message : 'Unable to save experience.',
      )
    } finally {
      setSaving(false)
    }
  }

  if (!loggedIn) {
    return <p>Redirecting to login…</p>
  }

  if (loading) {
    return <p>Loading experiences…</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <header>
        <h1>Admin Experiences</h1>
        <p>Manage your experiences and keep them up to date.</p>
      </header>

      {error && <p style={{ color: '#b42318' }}>{error}</p>}
      {success && <p style={{ color: '#027a48' }}>{success}</p>}

      <section>
        <h2>Existing Experiences</h2>
        {experiences.length === 0 ? (
          <p>No experiences available yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>State</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Launch Year</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }} aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {experiences.map((experience) => (
                <tr key={experience.id}>
                  <td style={{ padding: '0.5rem' }}>{experience.id}</td>
                  <td style={{ padding: '0.5rem' }}>{experience.name}</td>
                  <td style={{ padding: '0.5rem' }}>{experience.state}</td>
                  <td style={{ padding: '0.5rem' }}>{experience.launchYear}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <button type="button" onClick={() => handleEdit(experience.id)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2>{isEditing ? 'Edit Experience' : 'Create Experience'}</h2>
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
              required
            />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            Domain
            <input name="domain" value={form.domain} onChange={handleChange('domain')} />
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            State
            <select name="state" value={form.state} onChange={handleChange('state')}>
              {stateOptions.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: '0.25rem' }}>
            Launch Year
            <input
              name="launchYear"
              type="number"
              value={form.launchYear}
              onChange={handleChange('launchYear')}
              required
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
            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create experience'}
          </button>
        </form>
      </section>
    </div>
  )
}
