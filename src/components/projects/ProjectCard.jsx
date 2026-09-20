const ProjectCard = ({
  project,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">
          {project.name}
        </h3>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium">
          {project.status}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {project.description || 'No description'}
      </p>

      <p className="mt-5 text-xs text-slate-400">
        Created:{' '}
        {new Date(project.createdAt).toLocaleDateString()}
      </p>

      <div className="mt-5 flex gap-2">
        <button
          onClick={() => onEdit(project)}
          className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(project._id)}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default ProjectCard

