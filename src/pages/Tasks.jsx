import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import PageHeader from '../components/ui/PageHeader'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import { getProjects } from '../services/projectService'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../services/taskService'

const Tasks = () => {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('projectId') || ''
  const [editingTask, setEditingTask] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [search, setSearch] = useState('')

  const { data: tasks = [], isPending, isError, error } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => getTasks(projectId),
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const selectedProject = projects.find((project) => project._id === projectId)

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, taskData }) => updateTask(id, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setEditingTask(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const handleSubmit = (taskData) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask._id, taskData })
      return
    }
    createMutation.mutate(taskData)
  }

  const handleStatusChange = (id, status) => {
    const task = tasks.find((item) => item._id === id)
    if (!task) return

    updateMutation.mutate({
      id,
      taskData: { status },
    })
  }

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()

    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      const matchesSearch = !query || `${task.title} ${task.description || ''}`.toLowerCase().includes(query)
      return matchesStatus && matchesPriority && matchesSearch
    })
  }, [tasks, statusFilter, priorityFilter, search])

  const stats = useMemo(() => {
    const now = new Date()
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === 'todo').length,
      progress: tasks.filter((task) => task.status === 'in-progress').length,
      done: tasks.filter((task) => task.status === 'done').length,
      overdue: tasks.filter((task) => task.dueDate && new Date(task.dueDate) < now && task.status !== 'done').length,
    }
  }, [tasks])

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  if (isPending) return <p className="text-slate-500">Loading tasks...</p>

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="font-medium text-red-800">Failed to load tasks.</p>
        <p className="mt-1 text-sm text-red-600">{error?.response?.data?.message || 'Please try again.'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={selectedProject ? `${selectedProject.name} tasks` : 'Tasks'}
        description={selectedProject ? 'Tasks connected to this project.' : 'Track the work behind your projects.'}
      />

      {selectedProject && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm text-slate-600">Project workspace · <span className="font-semibold text-slate-900">{selectedProject.name}</span></p>
          <Link to="/tasks" className="text-sm font-medium text-slate-700 hover:text-slate-950">View all tasks</Link>
        </div>
      )}

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ['Total', stats.total],
          ['Todo', stats.todo],
          ['In progress', stats.progress],
          ['Done', stats.done],
          ['Overdue', stats.overdue],
        ].map(([label, value]) => (
          <div key={label} className="ui-card p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </section>

      <TaskForm
        task={editingTask}
        projects={projects}
        defaultProjectId={projectId}
        onSubmit={handleSubmit}
        onCancel={() => setEditingTask(null)}
        isSubmitting={isSubmitting}
      />

      {(createMutation.isError || updateMutation.isError) && (
        <p className="text-sm text-red-600">Failed to save the task. Please try again.</p>
      )}

      <section>
        <div className="mb-5 flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold">Your tasks</h2>
            <p className="text-sm text-slate-500">{filteredTasks.length} of {tasks.length} tasks shown</p>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
              className="ui-input"
            />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="ui-select">
              <option value="all">All statuses</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <select value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)} className="ui-select">
              <option value="all">All priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-700">{tasks.length === 0 ? 'No tasks yet.' : 'No tasks match your filters.'}</p>
            <p className="mt-1 text-sm text-slate-500">Create a task or adjust your filters.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                onDelete={deleteMutation.mutate}
                onStatusChange={handleStatusChange}
                isUpdating={updateMutation.isPending && updateMutation.variables?.id === task._id}
                isDeleting={deleteMutation.isPending && deleteMutation.variables === task._id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Tasks
