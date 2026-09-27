const express = require('express')
const authenticate = require('../middleware/auth.middleware')

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getGithubRepository,
} = require('../controllers/project.controller')

const router = express.Router()

router.get('/', authenticate, getProjects)

router.post('/', authenticate, createProject)

router.patch('/:id', authenticate, updateProject)
router.put('/:id', authenticate, updateProject)

router.get('/:id/github', authenticate, getGithubRepository)

router.delete('/:id', authenticate, deleteProject)


module.exports = router
