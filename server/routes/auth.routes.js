const express = require('express')

const {
  register,

  login,
  refresh,
} = require('../controllers/auth.controller')

const authenticate = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/register', register)

router.post('/login', login)
router.post('/refresh', refresh)
router.get('/me', authenticate, (req, res) => {
  res.json({
    message: 'You are authenticated',
    user: req.user,
  })
})

module.exports = router
