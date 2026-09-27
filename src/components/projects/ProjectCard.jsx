import { Link } from 'react-router'

const ProjectCard = ({ project, onEdit, onDelete, isDeleting, readOnly = false }) => {
  const statusStyles = {
    planned: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    active: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    completed: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
  }

  return (
    <article className="ui-card ui-card-hover overflow-hidden p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[.15em] text-slate-400">Project</p>
          <h3 className="truncate text-lg font-bold tracking-tight text-slate-950">{project.name}</h3>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${statusStyles[project.status] || 'bg-slate-100 text-slate-600'}`}>{project.status}</span>
      </div>
      <p className="mt-3 min-h-10 text-sm leading-5 text-slate-500">{project.description || 'No description added yet.'}</p>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-xs font-medium text-slate-400">Created {new Date(project.createdAt).toLocaleDateString()}</p>
        <Link to={`/projects/${project._id}`} className="text-xs font-bold text-slate-800 hover:text-slate-950 hover:underline">Open →</Link>
      </div>
      {!readOnly && <div className="mt-3 flex gap-2">
        <Link to={`/projects/${project._id}`} className="ui-button-primary flex-1">Open</Link>
        <button type="button" onClick={() => onEdit(project)} className="ui-button-secondary">Edit</button>
        <button type="button" onClick={() => onDelete(project._id)} disabled={isDeleting} className="ui-button-secondary !text-red-600">{isDeleting ? 'Deleting...' : 'Delete'}</button>
      </div>}
    </article>
  )
}

export default ProjectCard
