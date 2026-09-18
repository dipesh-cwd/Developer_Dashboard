import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getProjects } from '../services/projectService'

const Dashboard = () => {
  const { user, logout } = useAuth()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true)

        const data = await getProjects()

        setProjects(data)
      } catch (error) {
        console.error(error)
        setError('Failed to load projects.')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const activeProjects = projects.filter(
    (project) => project.status === 'active',
  )

  const completedProjects = projects.filter(
    (project) => project.status === 'completed',
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">
              Developer Dashboard
            </h1>

            <p className="text-sm text-slate-500">
              Welcome, {user?.name}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Total Projects
            </p>

            <p className="mt-2 text-3xl font-bold">
              {projects.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Active Projects
            </p>

            <p className="mt-2 text-3xl font-bold">
              {activeProjects.length}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">
              Completed Projects
            </p>

            <p className="mt-2 text-3xl font-bold">
              {completedProjects.length}
            </p>
          </div>

        </section>

        {/* Projects */}
        <section className="mt-8">

          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              Your Projects
            </h2>

            <p className="text-sm text-slate-500">
              Projects connected to your account.
            </p>
          </div>

          {loading && (
            <p className="text-slate-500">
              Loading projects...
            </p>
          )}

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          {!loading && !error && projects.length === 0 && (
            <div className="rounded-xl border bg-white p-8 text-center">
              <p className="text-slate-500">
                No projects yet.
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">

                  <h3 className="text-lg font-semibold">
                    {project.name}
                  </h3>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
                    {project.status}
                  </span>

                </div>

                <p className="mt-3 text-sm text-slate-500">
                  {project.description}
                </p>

                <p className="mt-5 text-xs text-slate-400">
                  Created:{' '}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

        </section>
      </main>
    </div>
  )
}

export default Dashboard