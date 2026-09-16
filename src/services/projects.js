const API_URL = 'http://localhost:5000/api'

export const getProjects = async () => {
  const response = await fetch(`${API_URL}/projects`)

  if (!response.ok) {
    throw new Error('Failed to fetch projects')
  }

  return response.json()
}