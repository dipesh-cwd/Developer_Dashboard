const Project = require('../models/Project')

const getAllProjects = async () => {
  return Project.find().sort({ createdAt: -1 })
}

const createProject = async (projectData) => {
  const project = await Project.create(projectData)

  return project
}

module.exports = {
  getAllProjects,
  createProject,
}
