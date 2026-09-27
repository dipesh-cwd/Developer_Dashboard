const statusStyles = {
  todo: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  done: 'bg-emerald-100 text-emerald-700',
}

const priorityStyles = {
  low: 'text-slate-500',
  medium: 'text-amber-600',
  high: 'text-red-600',
}

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  isDeleting,
  onStatusChange,
  isUpdating = false,
  readOnly = false,
}) => {
  return (
    <article className="ui-card ui-card-hover p-5">
      <div className="flex items-start justify-between gap-4">
        <h2 className="font-semibold text-slate-900">
          {task.title}
        </h2>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            statusStyles[task.status] || statusStyles.todo
          }`}
        >
          {task.status}
        </span>
      </div>

      <p className="mt-3 min-h-10 text-sm text-slate-500">
        {task.description || 'No description'}
      </p>

      {task.project?.name && (
        <span className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {task.project.name}
        </span>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
        <span className={`font-semibold ${priorityStyles[task.priority]}`}>
          {task.priority} priority
        </span>

        {task.dueDate && (
          <span className={`text-slate-400 ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'font-semibold text-red-600' : ''}`}>
            {new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'Overdue · ' : 'Due · '}
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {!readOnly && (
      <div className="mt-5 flex flex-wrap gap-2">
        {onStatusChange && (
          <button
            type="button"
            onClick={() => onStatusChange(task._id, task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo')}
            disabled={isUpdating}
            className="ui-button-primary"
          >
            {isUpdating ? 'Updating...' : task.status === 'todo' ? 'Start' : task.status === 'in-progress' ? 'Complete' : 'Reopen'}
          </button>
        )}

        <button
          type="button"
          onClick={() => onEdit(task)}
          className="ui-button-secondary"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(task._id)}
          disabled={isDeleting}
          className="ui-button-secondary !text-red-600"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      )}
    </article>
  )
}

export default TaskCard
