const express = require('express')
const cors = require('cors')

const projectRoutes = require('./routes/project.routes')
const authRoutes = require('./routes/auth.routes')
const taskRoutes = require('./routes/task.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Developer Dashboard API is running',
  })
})

app.use('/api/projects', projectRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

module.exports = app
