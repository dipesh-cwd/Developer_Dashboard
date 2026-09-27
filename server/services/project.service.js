const Project = require('../models/Project')
const Task = require('../models/Task')

const getAllProjects = async (userId) => {
  return Project.find({
    owner: userId,
  }).sort({ createdAt: -1 })
}

const getProjectById = async (id, userId) => {
  return Project.findOne({
    _id: id,
    owner: userId,
  })
}

const createProject = async (projectData, userId) => {
  return Project.create({
    ...projectData,
    owner: userId,
  })
}

const updateProject = async (id, projectData, userId) => {
  return Project.findOneAndUpdate(
    {
      _id: id,
      owner: userId,
    },
    projectData,
    {
      new: true,
      runValidators: true,
    }
  )
}

const deleteProject = async (id, userId) => {
  const project = await Project.findOneAndDelete({
    _id: id,
    owner: userId,
  })

  if (project) {
    await Task.updateMany(
      { owner: userId, project: id },
      { $unset: { project: 1 } }
    )
  }

  return project
}

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
}
