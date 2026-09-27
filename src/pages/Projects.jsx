import { useState } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import PageHeader from '../components/ui/PageHeader'
import { Link } from 'react-router'
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../services/projectService'
import { getTasks } from '../services/taskService'

const emptyForm = {
  name: '',
  description: '',
  status: 'planned',
}

const Projects = () => {
  const queryClient = useQueryClient()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const {
    data: projects = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
  })

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setForm(emptyForm)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setForm(emptyForm)
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.name.trim()) return

    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const startEditing = (project) => {
    setEditingId(project._id)
    setForm({
      name: project.name,
      description: project.description || '',
      status: project.status,
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const isSaving =
    createMutation.isPending || updateMutation.isPending

  if (isPending) {
    return <p className="text-slate-500">Loading projects...</p>
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="font-medium text-red-800">
          Failed to load projects.
        </p>
        <p className="mt-1 text-sm text-red-600">
          {error?.response?.data?.message || 'Please try again.'}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Create and manage the projects you are building."
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-5">
          <h2 className="text-lg font-semibold">
            {editingId ? 'Edit project' : 'Create project'}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {editingId
              ? 'Update the project details.'
              : 'Add a project to your workspace.'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <input
            value={form.name}
            onChange={(event) =>
              setForm({ ...form, name: event.target.value })
            }
            placeholder="Project name"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />

          <select
            value={form.status}
            onChange={(event) =>
              setForm({ ...form, status: event.target.value })
            }
            className="rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <textarea
            value={form.description}
            onChange={(event) =>
              setForm({
                ...form,
                description: event.target.value,
              })
            }
            placeholder="Project description"
            rows="3"
            className="resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500 md:col-span-2"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {isSaving
              ? 'Saving...'
              : editingId
                ? 'Update project'
                : 'Create project'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEditing}
              disabled={isSaving}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>

        {(createMutation.isError || updateMutation.isError) && (
          <p className="mt-3 text-sm text-red-600">
            Failed to save project.
          </p>
        )}
      </form>

      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold">Your projects</h2>
          <p className="text-sm text-slate-500">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-700">
              No projects yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">
                    {project.name}
                  </h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs">
                    {project.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-500">
                  {project.description || 'No description'}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    {tasks.filter((task) => task.project?._id === project._id || task.project === project._id).length} tasks
                  </p>
                  <Link
                    to={`/tasks?projectId=${project._id}`}
                    className="text-sm font-medium text-slate-700 hover:text-slate-950"
                  >
                    Open workspace →
                  </Link>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(project)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate(project._id)}
                    disabled={deleteMutation.isPending}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleteMutation.isPending &&
                    deleteMutation.variables === project._id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Projects
