const Task = require('../models/Task')

const getAllTasks = async (userId) => {
  return Task.find({ owner: userId }).sort({
    createdAt: -1,
  })
}

const createTask = async (taskData, userId) => {
  return Task.create({
    ...taskData,
    owner: userId,
  })
}

const updateTask = async (id, taskData, userId) => {
  return Task.findOneAndUpdate(
    {
      _id: id,
      owner: userId,
    },
    taskData,
    {
      new: true,
      runValidators: true,
    }
  )
}

const deleteTask = async (id, userId) => {
  return Task.findOneAndDelete({
    _id: id,
    owner: userId,
  })
}

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
}
