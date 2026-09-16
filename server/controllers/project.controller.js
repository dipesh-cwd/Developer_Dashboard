const mongoose = require('mongoose')
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

    res.status(400).json({
      message: 'Failed to create project',
    })
  }
}

const updateProject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid project ID',
      })
    }

    const project = await projectService.updateProject(
      req.params.id,
      req.body
    )

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    res.json(project)
  } catch (error) {
    console.error(error)

    res.status(400).json({
      message: 'Failed to update project',
    })
  }
}

const deleteProject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid project ID',
      })
    }

    const project = await projectService.deleteProject(
      req.params.id
    )

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    res.status(204).send()
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to delete project',
    })
  }
}

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
}
