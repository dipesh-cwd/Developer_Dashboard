const express = require('express')
const cors = require('cors')

const projectRoutes = require('./routes/project.routes')

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

module.exports = app
