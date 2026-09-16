const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: '',
      trim: true,
    },

    status: {
      type: String,
      enum: ['active', 'planned', 'completed'],
      default: 'planned',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Project', projectSchema)
