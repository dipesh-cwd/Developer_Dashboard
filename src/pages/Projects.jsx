import { useState } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import PageHeader from '../components/ui/PageHeader'
import ProjectCard from '../components/projects/ProjectCard'
import { Link } from 'react-router'
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  getGithubRepository,
} from '../services/projectService'
import { getTasks } from '../services/taskService'

const emptyForm = {
  name: '',
  description: '',
  status: 'planned',
  githubUrl: '',
}

const GithubRepositoryPreview = ({ project }) => {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ['github-repository', project._id],
    queryFn: () => getGithubRepository(project._id),
    enabled: Boolean(project.githubUrl),
    staleTime: 5 * 60 * 1000,
  })

  if (!project.githubUrl) {
    return (
      <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        No GitHub repository connected.
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        Loading GitHub data...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
        <p className="text-xs text-red-700">
          {error?.response?.data?.message || 'Unable to load GitHub data.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-xs font-medium text-red-800 underline"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-3">
        <a
          href={data.htmlUrl}
          target="_blank"
          rel="noreferrer"
          className="truncate text-sm font-semibold hover:underline"
        >
          {data.fullName}
        </a>
        <span className="shrink-0 text-xs text-slate-500">
          {data.defaultBranch}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-md bg-white p-2">
          <p className="font-semibold">{data.stars}</p>
          <p className="text-slate-500">Stars</p>
        </div>
        <div className="rounded-md bg-white p-2">
          <p className="font-semibold">{data.forks}</p>
          <p className="text-slate-500">Forks</p>
        </div>
        <div className="rounded-md bg-white p-2">
          <p className="font-semibold">{data.openIssues}</p>
          <p className="text-slate-500">Issues</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>{data.language || 'No language detected'}</span>
        <button
          type="button"
          onClick={() => refetch()}
          className="font-medium text-slate-700 hover:text-slate-950"
        >
          Refresh
        </button>
      </div>

      {data.recentCommits?.length > 0 && (
        <div className="mt-3 border-t border-slate-200 pt-3">
          <p className="mb-2 text-xs font-semibold text-slate-700">
            Recent commits
          </p>
          <div className="space-y-2">
            {data.recentCommits.slice(0, 3).map((commit) => (
              <a
                key={commit.sha}
                href={commit.url}
                target="_blank"
                rel="noreferrer"
                className="block truncate text-xs text-slate-600 hover:text-slate-950 hover:underline"
              >
                {commit.message}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
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
      githubUrl: form.githubUrl.trim(),
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
      githubUrl: project.githubUrl || '',
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
        className="ui-card p-6 sm:p-7"
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
            className="ui-input"
          />

          <select
            value={form.status}
            onChange={(event) =>
              setForm({ ...form, status: event.target.value })
            }
            className="ui-select"
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <input
            value={form.githubUrl}
            onChange={(event) =>
              setForm({ ...form, githubUrl: event.target.value })
            }
            placeholder="GitHub repository URL (optional)"
            type="url"
            className="ui-input md:col-span-2"
          />

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
            className="ui-textarea md:col-span-2"
          />
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="ui-button-primary"
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
              className="ui-button-secondary"
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
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={startEditing}
                onDelete={deleteMutation.mutate}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === project._id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Projects
