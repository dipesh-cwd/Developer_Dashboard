import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import PageHeader from '../components/ui/PageHeader'
import { getProject, getGithubRepository } from '../services/projectService'
import { getTasks } from '../services/taskService'

const ProjectDetails = () => {
  const { id } = useParams()

  const projectQuery = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
    enabled: Boolean(id),
  })

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
    enabled: Boolean(id),
  })

  const githubQuery = useQuery({
    queryKey: ['github-repository', id],
    queryFn: () => getGithubRepository(id),
    enabled: Boolean(id && projectQuery.data?.githubUrl),
    staleTime: 5 * 60 * 1000,
  })

  const projectTasks = useMemo(() => {
    const tasks = tasksQuery.data || []
    return tasks.filter((task) => task.project?._id === id || task.project === id)
  }, [tasksQuery.data, id])

  const completed = projectTasks.filter((task) => task.status === 'done').length
  const inProgress = projectTasks.filter((task) => task.status === 'in-progress').length
  const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0

  if (projectQuery.isPending) {
    return <p className="text-slate-500">Loading project...</p>
  }

  if (projectQuery.isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="font-medium text-red-800">Unable to load project.</p>
        <p className="mt-1 text-sm text-red-600">
          {projectQuery.error?.response?.data?.message || 'Please try again.'}
        </p>
        <Link to="/projects" className="mt-4 inline-block text-sm font-medium underline">
          Back to projects
        </Link>
      </div>
    )
  }

  const project = projectQuery.data

  return (
    <div className="space-y-8">
      <PageHeader
        title={project.name}
        description={project.description || 'Project workspace'}
      />

      <div className="flex flex-wrap gap-3">
        <Link to="/projects" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
          ← Projects
        </Link>
        <Link to={`/tasks?projectId=${project._id}`} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700">
          Manage tasks
        </Link>
        {project.githubUrl && githubQuery.data?.htmlUrl && (
          <a href={githubQuery.data.htmlUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
            Open GitHub ↗
          </a>
        )}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Status" value={project.status} />
        <Metric label="Tasks" value={projectTasks.length} />
        <Metric label="Completed" value={completed} />
        <Metric label="Progress" value={`${progress}%`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Task progress</h2>
              <p className="mt-1 text-sm text-slate-500">{completed} completed · {inProgress} in progress · {projectTasks.length - completed - inProgress} todo</p>
            </div>
            <span className="text-2xl font-bold">{progress}%</span>
          </div>
          <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-slate-900 transition-all" style={{ width: `${progress}%` }} />
          </div>

          <div className="mt-6 space-y-3">
            {projectTasks.slice(0, 5).map((task) => (
              <div key={task._id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
                <div className="min-w-0">
                  <p className="truncate font-medium">{task.title}</p>
                  {task.description && <p className="mt-1 truncate text-sm text-slate-500">{task.description}</p>}
                </div>
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">{task.status}</span>
              </div>
            ))}
            {projectTasks.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                No tasks are connected to this project yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">GitHub</h2>
          {!project.githubUrl ? (
            <p className="mt-3 text-sm text-slate-500">No repository connected.</p>
          ) : githubQuery.isPending ? (
            <p className="mt-3 text-sm text-slate-500">Loading repository...</p>
          ) : githubQuery.isError ? (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-700">{githubQuery.error?.response?.data?.message || 'Unable to load GitHub data.'}</p>
              <button onClick={() => githubQuery.refetch()} className="mt-3 text-sm font-medium text-red-800 underline">Retry</button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div>
                <a href={githubQuery.data.htmlUrl} target="_blank" rel="noreferrer" className="font-semibold hover:underline">{githubQuery.data.fullName}</a>
                <p className="mt-1 text-xs text-slate-500">{githubQuery.data.defaultBranch} · {githubQuery.data.language || 'Unknown language'}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <Metric label="Stars" value={githubQuery.data.stars} compact />
                <Metric label="Forks" value={githubQuery.data.forks} compact />
                <Metric label="Open items" value={githubQuery.data.openIssues} compact />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-700">Recent commits</p>
                <div className="mt-2 space-y-2">
                  {githubQuery.data.recentCommits?.slice(0, 4).map((commit) => (
                    <a key={commit.sha} href={commit.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-slate-600 hover:text-slate-950 hover:underline">
                      {commit.message}
                    </a>
                  ))}
                  {!githubQuery.data.recentCommits?.length && (
                    <p className="text-xs text-slate-400">No recent commits.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {project.githubUrl && githubQuery.data && (
        <section className="grid gap-6 lg:grid-cols-2">
          <GithubList
            title="Open issues"
            emptyMessage="No open issues."
            items={githubQuery.data.recentIssues || []}
            renderItem={(issue) => (
              <a
                href={issue.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-slate-900">
                    #{issue.number} {issue.title}
                  </p>
                  <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {issue.state}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {issue.comments} comment{issue.comments === 1 ? '' : 's'}
                </p>
              </a>
            )}
          />

          <GithubList
            title="Open pull requests"
            emptyMessage="No open pull requests."
            items={githubQuery.data.recentPullRequests || []}
            renderItem={(pullRequest) => (
              <a
                href={pullRequest.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-slate-900">
                    #{pullRequest.number} {pullRequest.title}
                  </p>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${pullRequest.draft ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {pullRequest.draft ? 'draft' : 'open'}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  By {pullRequest.author}
                </p>
              </a>
            )}
          />
        </section>
      )}
    </div>
  )
}

const GithubList = ({ title, emptyMessage, items, renderItem }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">From the connected repository.</p>
      </div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
        Recent
      </span>
    </div>

    <div className="mt-5 space-y-3">
      {items.length ? items.map((item) => (
        <div key={item.number}>{renderItem(item)}</div>
      )) : (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
          {emptyMessage}
        </p>
      )}
    </div>
  </div>
)

const Metric = ({ label, value, compact = false }) => (
  <div className={`rounded-xl border border-slate-200 bg-white ${compact ? 'p-3' : 'p-5'} shadow-sm`}>
    <p className="text-xs text-slate-500">{label}</p>
    <p className={`${compact ? 'mt-1 text-base' : 'mt-2 text-xl'} font-bold capitalize`}>{value}</p>
  </div>
)

export default ProjectDetails
