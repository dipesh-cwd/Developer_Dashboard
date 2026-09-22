const ProjectCard = ({ project, onEdit, onDelete }) => {
  const statusStyles = {
    planned: "bg-amber-100 text-amber-700",
    active: "bg-emerald-100 text-emerald-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-semibold">{project.name}</h3>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            statusStyles[project.status] || "bg-slate-100 text-slate-700"
          }`}
        >
          {project.status}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {project.description || "No description"}
      </p>

      <p className="mt-5 text-xs text-slate-400">
        Created: {new Date(project.createdAt).toLocaleDateString()}
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
  );
};

export default ProjectCard;
