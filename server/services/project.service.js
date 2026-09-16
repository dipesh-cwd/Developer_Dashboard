const Project = require('../models/Project')

const getAllProjects = async () => {
  return Project.find().sort({ createdAt: -1 })
}

module.exports = {
  getAllProjects,
}