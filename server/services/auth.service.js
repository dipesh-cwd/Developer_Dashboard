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

const updateProfile = async (userId, { name, email }) => {
  const updates = {}

  if (name !== undefined) {
    const normalizedName = name.trim()

    if (normalizedName.length < 2 || normalizedName.length > 50) {
      const error = new Error('Name must be between 2 and 50 characters')
      error.statusCode = 400
      throw error
    }

    updates.name = normalizedName
  }

  if (email !== undefined) {
    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: userId },
    })

    if (existingUser) {
      const error = new Error('Email already registered')
      error.statusCode = 409
      throw error
    }

    updates.email = normalizedEmail
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updates,
    { new: true, runValidators: true }
  ).select('name email')

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
  }
}

const changePassword = async (
  userId,
  { currentPassword, newPassword }
) => {
  if (!currentPassword || !newPassword) {
    const error = new Error('Current and new passwords are required')
    error.statusCode = 400
    throw error
  }

  if (newPassword.length < 8) {
    const error = new Error('New password must be at least 8 characters')
    error.statusCode = 400
    throw error
  }

  const user = await User.findById(userId).select('+password')

  if (!user) {
    const error = new Error('User not found')
    error.statusCode = 404
    throw error
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.password
  )

  if (!passwordMatches) {
    const error = new Error('Current password is incorrect')
    error.statusCode = 401
    throw error
  }

  user.password = await bcrypt.hash(newPassword, 12)
  await user.save()
}

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  changePassword,
}
