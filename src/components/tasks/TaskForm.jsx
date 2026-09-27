import { useEffect, useState } from 'react'

const emptyForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: '',
  project: '',
}

const TaskForm = ({
  task,
  projects = [],
  defaultProjectId = '',
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (!task) {
      setForm({ ...emptyForm, project: defaultProjectId })
      return
    }

    setForm({
      title: task.title || '',
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      project: task.project?._id || task.project || '',
    })
  }, [task, defaultProjectId])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
      project: form.project || undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">{task ? 'Edit task' : 'Create task'}</h2>
        <p className="mt-1 text-sm text-slate-500">Keep the next piece of work clear and actionable.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="title" className="mb-1 block text-sm font-medium">Title</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Build task API" required className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="mb-1 block text-sm font-medium">Description</label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange} rows="3" placeholder="What needs to be done?" className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-500" />
        </div>

        <div>
          <label htmlFor="project" className="mb-1 block text-sm font-medium">Project</label>
          <select id="project" name="project" value={form.project} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">Status</label>
          <select id="status" name="status" value={form.status} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="todo">Todo</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="mb-1 block text-sm font-medium">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="dueDate" className="mb-1 block text-sm font-medium">Due date</label>
          <input id="dueDate" name="dueDate" type="date" value={form.dueDate} onChange={handleChange} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button type="submit" disabled={isSubmitting} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
          {isSubmitting ? 'Saving...' : task ? 'Update task' : 'Create task'}
        </button>
        {task && (
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default TaskForm
