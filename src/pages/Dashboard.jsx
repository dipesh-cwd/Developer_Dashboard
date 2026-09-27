import { useQuery } from '@tanstack/react-query'

import PageHeader from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import ProjectCard from '../components/projects/ProjectCard'
import TaskCard from '../components/tasks/TaskCard'
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

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3)

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4)

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
        description="A quick overview of your development workspace."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Projects"
          value={projects.length}
          description={`${activeProjects.length} active`}
        />
        <StatCard
          title="Completed projects"
          value={completedProjects.length}
          description="Projects finished"
        />
        <StatCard
          title="Open tasks"
          value={todoTasks.length + inProgressTasks.length}
          description={`${inProgressTasks.length} in progress`}
        />
        <StatCard
          title="Completed tasks"
          value={doneTasks.length}
          description={`of ${tasks.length} total`}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent projects
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your latest projects at a glance.
              </p>
            </div>
            <a
              href="/projects"
              className="text-sm font-medium text-slate-700 hover:text-slate-950"
            >
              View all
            </a>
          </div>

          {recentProjects.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No projects yet. Create your first project from Projects.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  readOnly
                />
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Task progress
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Current workload across your tasks.
              </p>
            </div>
            <a
              href="/tasks"
              className="text-sm font-medium text-slate-700 hover:text-slate-950"
            >
              View all
            </a>
          </div>

          <div className="mt-6 space-y-5">
            <ProgressRow
              label="Todo"
              value={todoTasks.length}
              total={tasks.length}
            />
            <ProgressRow
              label="In progress"
              value={inProgressTasks.length}
              total={tasks.length}
            />
            <ProgressRow
              label="Done"
              value={doneTasks.length}
              total={tasks.length}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Recent tasks
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            The latest work added to your workspace.
          </p>
        </div>

        {recentTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No tasks yet. Create your first task from Tasks.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {recentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                readOnly
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

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
