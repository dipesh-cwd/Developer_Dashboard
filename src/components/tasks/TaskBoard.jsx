import { useState } from 'react'
import TaskCard from './TaskCard'

const columns = [
  {
    id: 'todo',
    title: 'Todo',
    description: 'Planned work',
    accent: 'border-slate-200',
  },
  {
    id: 'in-progress',
    title: 'In progress',
    description: 'Work happening now',
    accent: 'border-amber-200',
  },
  {
    id: 'done',
    title: 'Done',
    description: 'Completed work',
    accent: 'border-emerald-200',
  },
]

const TaskBoard = ({ tasks, onEdit, onDelete, onStatusChange, isUpdating }) => {
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  const handleDrop = (status) => {
    if (!draggedTaskId) return

    const task = tasks.find((item) => item._id === draggedTaskId)
    if (task && task.status !== status) {
      onStatusChange(task._id, status)
    }

    setDraggedTaskId(null)
    setDragOverColumn(null)
  }

  return (
    <div className="grid gap-5 xl:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id)

        return (
          <section
            key={column.id}
            onDragOver={(event) => {
              event.preventDefault()
              setDragOverColumn(column.id)
            }}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={() => handleDrop(column.id)}
            className={`min-h-[320px] rounded-2xl border bg-slate-50/70 p-4 transition ${column.accent} ${
              dragOverColumn === column.id ? 'ring-2 ring-slate-300' : ''
            }`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">{column.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{column.description}</p>
              </div>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                {columnTasks.length}
              </span>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => (
                <div
                  key={task._id}
                  draggable
                  onDragStart={() => setDraggedTaskId(task._id)}
                  onDragEnd={() => {
                    setDraggedTaskId(null)
                    setDragOverColumn(null)
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TaskCard
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                    isUpdating={isUpdating(task._id)}
                  />
                </div>
              ))}

              {columnTasks.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-8 text-center">
                  <p className="text-sm text-slate-400">Drop a task here</p>
                </div>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default TaskBoard
