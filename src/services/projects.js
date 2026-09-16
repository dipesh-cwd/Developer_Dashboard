const API_URL = 'http://localhost:5000/api'

export const getProjects = async () => {
  const response = await fetch(`${API_URL}/projects`)

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  return response.json()
}

export const createProject = async (projectData) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  })

  if (!response.ok) {
    throw new Error('Failed to create project')
  }

  return response.json()
}


export const updateProject = async (id, projectData) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  })

  if (!response.ok) {
    throw new Error('Failed to update project')
  }

  return response.json()
}

export const deleteProject = async (id) => {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete project')
  }
}
