const express = require('express')

const {
  getProjects,
  createProject,
} = require('../controllers/project.controller')

const router = express.Router()

router.get('/', getProjects)

router.post('/', createProject)

module.exports = router
