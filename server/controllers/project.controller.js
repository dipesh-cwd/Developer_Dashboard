const projectService = require('../services/project.service')

const getProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects()

    res.json(projects)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch projects',
    })
  }
}

const createProject = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body)

    res.status(201).json(project)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to create project',
    })
  }
}

module.exports = {
  getProjects,
  createProject,
}
