const authService = require('../services/auth.service')
const jwt = require('jsonwebtoken')
const {
  createAccessToken,
} = require('../utils/tokens')


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
    const result = await authService.loginUser(req.body)

    res.json(result)
  } catch (error) {
    console.error(error)

    res.status(error.statusCode || 401).json({
      message: error.message || 'Login failed',
    })
  }
}

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(401).json({
        message: 'Refresh token required',
      })
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    )

    const accessToken = createAccessToken(decoded.userId)

    return res.status(200).json({
      accessToken,
    })
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired refresh token',
    })
  }
}


module.exports = {
  register,
  login,
  refresh,
}

