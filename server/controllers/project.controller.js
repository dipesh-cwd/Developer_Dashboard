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

module.exports = {
  getProjects,
}
