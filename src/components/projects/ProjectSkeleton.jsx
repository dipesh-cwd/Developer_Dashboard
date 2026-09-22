const ProjectSkeleton = () => {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />

        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="mt-6 h-3 w-24 animate-pulse rounded bg-slate-200" />

      <div className="mt-5 flex gap-2">
        <div className="h-9 w-16 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  )
}

export default ProjectSkeleton

