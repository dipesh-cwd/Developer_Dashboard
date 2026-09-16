const Project = require('../models/Project')

const getAllProjects = async (userId) => {
  return Project.find({
    owner: userId,
  }).sort({ createdAt: -1 })
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
  return Project.findOneAndDelete({
    _id: id,
    owner: userId,
  })
}

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
}
