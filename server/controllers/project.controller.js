const mongoose = require('mongoose')
const projectService = require('../services/project.service')
const githubService = require('../services/github.service')

const getProjects = async (req, res) => {
  try {
const projects = await projectService.getAllProjects(
  req.user.id
)
    res.json(projects)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch projects',
    })
  }
}

const getProject = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid project ID',
      })
    }

    const project = await projectService.getProjectById(
      req.params.id,
      req.user.id
    )

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    res.json(project)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: 'Failed to fetch project',
    })
  }
}

const createProject = async (req, res) => {
  try {
const project = await projectService.createProject(
  req.body,
  req.user.id
)

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
      req.body,
      req.user.id
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

const getGithubRepository = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid project ID',
      })
    }

    const project = await projectService.getProjectById(
      req.params.id,
      req.user.id
    )

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      })
    }

    if (!project.githubUrl) {
      return res.status(400).json({
        message: 'This project has no GitHub repository connected',
      })
    }

    const repository = await githubService.getRepository(project.githubUrl)

    res.json(repository)
  } catch (error) {
    console.error(error)

    res.status(error.statusCode || 500).json({
      message: error.message || 'Failed to fetch GitHub repository',
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
      req.params.id,
      req.user.id
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
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getGithubRepository,
}
