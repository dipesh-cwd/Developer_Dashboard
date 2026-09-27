const mongoose = require('mongoose')
const taskService = require('../services/task.service')

const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks(
      req.user.id,
      req.query.projectId
    )
    res.json(tasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch tasks',
    })
  }
}

const createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(req.body, req.user.id)
    res.status(201).json(task)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 400).json({
      message: error.message || 'Failed to create task',
    })
  }
}

const updateTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      })
    }

    const task = await taskService.updateTask(
      req.params.id,
      req.body,
      req.user.id
    )

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    res.json(task)
  } catch (error) {
    console.error(error)
    res.status(error.statusCode || 400).json({
      message: error.message || 'Failed to update task',
    })
  }
}

const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid task ID',
      })
    }

    const task = await taskService.deleteTask(
      req.params.id,
      req.user.id
    )

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      })
    }

    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to delete task',
    })
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
}
