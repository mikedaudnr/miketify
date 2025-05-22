// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === "undefined") return false

  const token = localStorage.getItem("token")
  return !!token
}

// Get user data
export const getUserData = () => {
  if (typeof window === "undefined") return null

  const userData = localStorage.getItem("user")
  if (!userData) return null

  try {
    return JSON.parse(userData)
  } catch (error) {
    return null
  }
}

// Logout user
export const logout = () => {
  if (typeof window === "undefined") return

  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
