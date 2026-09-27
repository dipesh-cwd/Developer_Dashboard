const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    dueDate: {
      type: Date,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Task', taskSchema)
