const express = require('express')

const {
  register,
me,
  login,
  refresh,
  updateProfile,
  changePassword,
} = require('../controllers/auth.controller')

const authenticate = require('../middleware/auth.middleware')

const router = express.Router()

router.post('/register', register)

router.post('/login', login)
router.post('/refresh', refresh)
router.get('/me', authenticate, me)
router.put('/me', authenticate, updateProfile)
router.put('/password', authenticate, changePassword)

module.exports = router
