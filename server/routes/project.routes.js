const express = require('express')
const { getProjects } = require('../controllers/project.controller')

const router = express.Router()

router.get('/', getProjects)

module.exports = router
