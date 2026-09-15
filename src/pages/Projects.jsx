import { useQuery } from '@tanstack/react-query'

import PageHeader from '../components/ui/PageHeader'
import { getProjects } from '../services/projects'

const Projects = () => {
  const {
    data: projects,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  if (isPending) {
    return <p>Loading projects...</p>
  }

  if (isError) {
    return <p>Something went wrong.</p>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Manage your development projects."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold">
              {project.name}
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {project.description}
            </p>

            <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm">
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects