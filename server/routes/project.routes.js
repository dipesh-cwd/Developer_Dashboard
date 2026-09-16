const express = require('express')

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller')

const router = express.Router()

router.get('/', getProjects)

router.post('/', createProject)

router.patch('/:id', updateProject)

router.delete('/:id', deleteProject)

module.exports = router
