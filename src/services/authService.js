import api from "../lib/api"

export const updateProfile = async (profileData) => {
  const response = await api.put("/auth/me", profileData)
  return response.data.user
}

export const changePassword = async (passwordData) => {
  const response = await api.put("/auth/password", passwordData)
  return response.data
}
