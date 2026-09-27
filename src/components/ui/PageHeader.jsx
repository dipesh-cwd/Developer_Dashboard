const PageHeader = ({ title, description, action }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-400">Workspace</p>
      <h1 className="mt-2 text-3xl font-bold tracking-[-.035em] text-slate-950 sm:text-4xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
    {action}
  </div>
)

export default PageHeader
