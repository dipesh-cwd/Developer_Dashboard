import { useMemo } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import ProjectCard from '../components/projects/ProjectCard'
import TaskCard from '../components/tasks/TaskCard'
import ActivityFeed from '../components/activity/ActivityFeed'
import { getProjects } from '../services/projectService'
import { getTasks } from '../services/taskService'

const Dashboard = () => {
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const tasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

  const projects = projectsQuery.data ?? []
  const tasks = tasksQuery.data ?? []

  const activeProjects = projects.filter(
    (project) => project.status === 'active',
  )

  const completedProjects = projects.filter(
    (project) => project.status === 'completed',
  )

  const todoTasks = tasks.filter((task) => task.status === 'todo')
  const inProgressTasks = tasks.filter(
    (task) => task.status === 'in-progress',
  )
  const doneTasks = tasks.filter((task) => task.status === 'done')

  const overdueTasks = useMemo(() => {
    const now = new Date()
    return tasks.filter((task) => {
      if (!task.dueDate || task.status === 'done') return false
      return new Date(task.dueDate) < now
    })
  }, [tasks])

  const upcomingTasks = useMemo(() => {
    const now = new Date()
    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)

    return tasks
      .filter((task) => {
        if (!task.dueDate || task.status === 'done') return false
        const dueDate = new Date(task.dueDate)
        return dueDate >= now && dueDate <= nextWeek
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }, [tasks])

  const focusTasks = useMemo(() => {
    const overdue = overdueTasks
      .map((task) => ({ ...task, focusType: 'overdue' }))
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

    const upcoming = upcomingTasks.map((task) => ({
      ...task,
      focusType: 'upcoming',
    }))

    return [...overdue, ...upcoming].slice(0, 6)
  }, [overdueTasks, upcomingTasks])

  const completionRate = tasks.length
    ? Math.round((doneTasks.length / tasks.length) * 100)
    : 0

  const projectProgress = projects.map((project) => {
    const projectTasks = tasks.filter(
      (task) => task.project?._id === project._id || task.project === project._id,
    )
    const completed = projectTasks.filter((task) => task.status === 'done').length
    const progress = projectTasks.length
      ? Math.round((completed / projectTasks.length) * 100)
      : 0

    return { ...project, taskCount: projectTasks.length, progress }
  })

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4)

  const activity = useMemo(() => {
    const projectActivities = projects.flatMap((project) => {
      const created = {
        id: `project-created-${project._id}`,
        type: 'project',
        label: 'Project',
        title: `Created ${project.name}`,
        description: project.description || 'New project added to your workspace.',
        date: project.createdAt,
        projectId: project._id,
      }

      const updatedAt = project.updatedAt && project.updatedAt !== project.createdAt
      const updated = updatedAt
        ? [{
            id: `project-updated-${project._id}`,
            type: 'project',
            label: 'Project',
            title: `Updated ${project.name}`,
            description: `Project status: ${project.status}.`,
            date: project.updatedAt,
            projectId: project._id,
          }]
        : []

      return [created, ...updated]
    })

    const taskActivities = tasks.map((task) => ({
      id: `task-${task._id}`,
      type: 'task',
      label: 'Task',
      title: task.title,
      description: `${task.status}${task.project?.name ? ` · ${task.project.name}` : ''}`,
      date: task.updatedAt || task.createdAt,
      projectId: task.project?._id || task.project,
    }))

    return [...projectActivities, ...taskActivities]
      .filter((item) => item.date)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [projects, tasks])

  const isLoading = projectsQuery.isPending || tasksQuery.isPending
  const isError = projectsQuery.isError || tasksQuery.isError

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="A quick overview of your development workspace."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="A quick overview of your development workspace."
        />
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-800">
            Could not load dashboard data
          </h2>
          <p className="mt-1 text-sm text-red-600">
            Check your connection and try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Understand your projects, workload, and progress at a glance."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Projects"
          value={projects.length}
          description={`${activeProjects.length} active`}
        />
        <StatCard
          title="Task completion"
          value={`${completionRate}%`}
          description={`${doneTasks.length} of ${tasks.length} done`}
        />
        <StatCard
          title="Open tasks"
          value={todoTasks.length + inProgressTasks.length}
          description={`${inProgressTasks.length} in progress`}
        />
        <StatCard
          title="Overdue"
          value={overdueTasks.length}
          description={overdueTasks.length ? 'Needs attention' : 'Nothing overdue'}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="ui-card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Project progress
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                See which projects are moving forward and which need attention.
              </p>
            </div>
            <Link
              to="/projects"
              className="text-sm font-medium text-slate-700 hover:text-slate-950"
            >
              View all
            </Link>
          </div>

          {projectProgress.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No projects yet. Create your first project from Projects.
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {projectProgress.slice(0, 5).map((project) => (
                <div key={project._id}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        to={`/projects/${project._id}`}
                        className="truncate text-sm font-semibold text-slate-900 hover:underline"
                      >
                        {project.name}
                      </Link>
                      <p className="mt-1 text-xs text-slate-500">
                        {project.taskCount} {project.taskCount === 1 ? 'task' : 'tasks'} · {project.status}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-slate-700">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ui-card p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Workload breakdown
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your current task distribution.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <ProgressRow label="Todo" value={todoTasks.length} total={tasks.length} />
            <ProgressRow label="In progress" value={inProgressTasks.length} total={tasks.length} />
            <ProgressRow label="Done" value={doneTasks.length} total={tasks.length} />
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {completedProjects.length} completed {completedProjects.length === 1 ? 'project' : 'projects'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Keep your active work small enough to finish consistently.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="ui-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Focus queue</h2>
              <p className="mt-1 text-sm text-slate-500">
                Work that deserves attention now or within the next 7 days.
              </p>
            </div>
            <Link
              to="/tasks"
              className="shrink-0 text-sm font-medium text-slate-700 hover:text-slate-950"
            >
              View tasks
            </Link>
          </div>

          {focusTasks.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <p className="text-sm font-medium text-slate-700">You are clear for now.</p>
              <p className="mt-1 text-xs text-slate-500">No overdue or upcoming tasks in the next 7 days.</p>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {focusTasks.map((task) => {
                const projectId = task.project?._id || task.project
                const isOverdue = task.focusType === 'overdue'

                return (
                  <div key={`${task.focusType}-${task._id}`} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{task.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span className={isOverdue ? 'font-semibold text-red-600' : 'text-slate-500'}>
                          {isOverdue ? 'Overdue' : 'Due'} · {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {task.project?.name && projectId && (
                          <>
                            <span className="text-slate-300">•</span>
                            <Link to={`/projects/${projectId}`} className="text-slate-500 hover:text-slate-900 hover:underline">
                              {task.project.name}
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-600">
                      {task.priority}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="ui-card p-6">
          <h2 className="text-lg font-bold text-slate-900">Planning signal</h2>
          <p className="mt-1 text-sm text-slate-500">A quick read on what your workspace needs next.</p>

          <div className="mt-5 space-y-3">
            <PlanningSignal
              label="Overdue"
              value={overdueTasks.length}
              message={overdueTasks.length ? 'Resolve these first.' : 'Nothing is late.'}
              urgent={overdueTasks.length > 0}
            />
            <PlanningSignal
              label="Next 7 days"
              value={upcomingTasks.length}
              message={upcomingTasks.length ? 'Plan these before they become urgent.' : 'No deadlines coming up.'}
            />
            <PlanningSignal
              label="In progress"
              value={inProgressTasks.length}
              message={inProgressTasks.length ? 'Finish existing work before starting more.' : 'Nothing currently in progress.'}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent projects
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest projects at a glance.
            </p>
          </div>
          <Link
            to="/projects"
            className="text-sm font-medium text-slate-700 hover:text-slate-950"
          >
            View all
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No projects yet. Create your first project from Projects.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentProjects.map((project) => (
              <ProjectCard key={project._id} project={project} readOnly />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="ui-card p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">Activity feed</h2>
            <p className="mt-1 text-sm text-slate-500">
              A timeline of changes across your workspace.
            </p>
          </div>
          <ActivityFeed activities={activity} emptyMessage="No workspace activity yet." />
        </div>

        <div className="ui-card p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">Recent tasks</h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest task changes.
            </p>
          </div>
          {recentTasks.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No task activity yet.
            </p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <TaskCard key={task._id} task={task} readOnly />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

const PlanningSignal = ({ label, value, message, urgent = false }) => (
  <div className="rounded-xl border border-slate-200 p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className={`text-xl font-bold ${urgent ? 'text-red-600' : 'text-slate-950'}`}>{value}</span>
    </div>
    <p className="mt-1 text-xs text-slate-500">{message}</p>
  </div>
)

const ProgressRow = ({ label, value, total }) => {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100)

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default Dashboard
