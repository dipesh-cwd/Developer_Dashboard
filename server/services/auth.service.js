const bcrypt = require('bcryptjs')
const User = require('../models/User')
const {
  createAccessToken,
  createRefreshToken,
} = require('../utils/tokens')


const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase().trim()

  const existingUser = await User.findOne({
    email: normalizedEmail,
  })

  if (existingUser) {
    const error = new Error('Email already registered')
    error.statusCode = 409
    throw error
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  })

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  }
}

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim()

  const user = await User.findOne({
    email: normalizedEmail,
  }).select('+password')

  if (!user) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.password
  )

  if (!passwordMatches) {
    const error = new Error('Invalid email or password')
    error.statusCode = 401
    throw error
  }

  const accessToken = createAccessToken(user._id)
  const refreshToken = createRefreshToken(user._id)

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
    refreshToken,
  }
}

module.exports = {
  registerUser,
  loginUser,
}
