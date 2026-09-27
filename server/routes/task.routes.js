const express = require('express')
const authenticate = require('../middleware/auth.middleware')

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller')

const router = express.Router()

router.get('/', authenticate, getTasks)
router.post('/', authenticate, createTask)
router.patch('/:id', authenticate, updateTask)
router.delete('/:id', authenticate, deleteTask)

module.exports = router
