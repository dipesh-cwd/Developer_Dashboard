const projectService = require('../services/project.service')

const getProjects = (req, res) => {
  const projects = projectService.getAllProjects()

  res.json(projects)
}

module.exports = {
  getProjects,
}
