import { useState } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import PageHeader from '../components/ui/PageHeader'
import TaskCard from '../components/tasks/TaskCard'
import TaskForm from '../components/tasks/TaskForm'
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../services/taskService'

const Tasks = () => {
  const queryClient = useQueryClient()
  const [editingTask, setEditingTask] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const {
    data: tasks = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, taskData }) =>
      updateTask(id, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      setEditingTask(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })

  const handleSubmit = (taskData) => {
    if (editingTask) {
      updateMutation.mutate({
        id: editingTask._id,
        taskData,
      })
      return
    }

    createMutation.mutate(taskData)
  }

  const filteredTasks =
    statusFilter === 'all'
      ? tasks
      : tasks.filter((task) => task.status === statusFilter)

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending

  if (isPending) {
    return <p className="text-slate-500">Loading tasks...</p>
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="font-medium text-red-800">
          Failed to load tasks.
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
        title="Tasks"
        description="Track the work behind your projects."
      />

      <TaskForm
        task={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setEditingTask(null)}
        isSubmitting={isSubmitting}
      />

      {(createMutation.isError || updateMutation.isError) && (
        <p className="text-sm text-red-600">
          Failed to save the task. Please try again.
        </p>
      )}

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Your tasks</h2>
            <p className="text-sm text-slate-500">
              {tasks.length} total task{tasks.length === 1 ? '' : 's'}
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-700">
              {tasks.length === 0
                ? 'No tasks yet.'
                : 'No tasks match this filter.'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Create a task above to start tracking your work.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={setEditingTask}
                onDelete={deleteMutation.mutate}
                isDeleting={
                  deleteMutation.isPending &&
                  deleteMutation.variables === task._id
                }
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Tasks
