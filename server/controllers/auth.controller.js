const authService = require('../services/auth.service')

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body)

    res.status(201).json({
      user,
    })
  } catch (error) {
    console.error(error)

    res.status(error.statusCode || 400).json({
      message: error.message || 'Registration failed',
    })
  }
}

const login = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body)

    res.json({
      user,
    })
  } catch (error) {
    console.error(error)

    res.status(error.statusCode || 401).json({
      message: error.message || 'Login failed',
    })
  }
}

module.exports = {
  register,
  login,
}

