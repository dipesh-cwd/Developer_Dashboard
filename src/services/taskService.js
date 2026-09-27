import api from '../lib/api'

export const getTasks = async () => {
  const response = await api.get('/tasks')
  return response.data
}

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData)
  return response.data
}

export const updateTask = async (id, taskData) => {
  const response = await api.patch(`/tasks/${id}`, taskData)
  return response.data
}

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`)
}
