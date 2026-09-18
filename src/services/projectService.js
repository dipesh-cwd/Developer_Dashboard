import api from '../lib/api'

export const getProjects = async () => {
  const response = await api.get('/projects')

  return response.data
}
