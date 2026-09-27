const Task = require('../models/Task')
const Project = require('../models/Project')

const getAllTasks = async (userId, projectId) => {
  const filter = { owner: userId }

  if (projectId) {
    const project = await Project.findOne({
      _id: projectId,
      owner: userId,
    })

    if (!project) return []

    filter.project = projectId
  }

  return Task.find(filter)
    .populate('project', 'name status')
    .sort({ createdAt: -1 })
}

const createTask = async (taskData, userId) => {
  const data = { ...taskData }

  if (data.project) {
    const project = await Project.findOne({
      _id: data.project,
      owner: userId,
    })

    if (!project) {
      const error = new Error('Project not found')
      error.statusCode = 404
      throw error
    }
  }

  return Task.create({
    ...data,
    owner: userId,
  })
}

const updateTask = async (id, taskData, userId) => {
  const data = { ...taskData }

  if (data.project) {
    const project = await Project.findOne({
      _id: data.project,
      owner: userId,
    })

    if (!project) {
      const error = new Error('Project not found')
      error.statusCode = 404
      throw error
    }
  }

  return Task.findOneAndUpdate(
    {
      _id: id,
      owner: userId,
    },
    data,
    {
      returnDocument: 'after',
      runValidators: true,
    }
  ).populate('project', 'name status')
}

const deleteTask = async (id, userId) => {
  return Task.findOneAndDelete({
    _id: id,
    owner: userId,
  })
}

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
}
