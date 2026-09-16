const Project = require('../models/Project')

const getAllProjects = async () => {
  return Project.find().sort({ createdAt: -1 })
}

const createProject = async (projectData) => {
  return Project.create(projectData)
}

const updateProject = async (id, projectData) => {
  return Project.findByIdAndUpdate(
    id,
    projectData,
    {
      new: true,
      runValidators: true,
    }
  )
}

const deleteProject = async (id) => {
  return Project.findByIdAndDelete(id)
}

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
}
