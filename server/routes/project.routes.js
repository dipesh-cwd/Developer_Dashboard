const express = require('express')
const authenticate = require('../middleware/auth.middleware')

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/project.controller')

const router = express.Router()

router.get('/', authenticate, getProjects)

router.post('/', authenticate, createProject)

router.patch('/:id', authenticate, updateProject)

router.delete('/:id', authenticate, deleteProject)


module.exports = router
