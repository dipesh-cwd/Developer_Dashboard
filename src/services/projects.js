const projects = [
  {
    id: 1,
    name: 'Developer Dashboard',
    description: 'React + Tailwind developer workspace',
    status: 'active',
  },
  {
    id: 2,
    name: 'LifeOS',
    description: 'MERN productivity application',
    status: 'planned',
  },
]

export const getProjects = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return projects
}