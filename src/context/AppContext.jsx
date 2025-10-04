import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AppContext = createContext(null)

const API_BASE = '/api'

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return { email: payload.email, role: payload.role, token }
    } catch {
      return null
    }
  })

  const [posts, setPosts] = useState([])
  const [reports, setReports] = useState([])
  const [bannedUsers, setBannedUsers] = useState([])
  const [theme, setThemeState] = useState(() => {
    try {
      const raw = localStorage.getItem('campus_cloud_theme')
      return raw || 'monochrome'
    } catch (e) {
      return 'monochrome'
    }
  })

  function setTheme(newTheme) {
    setThemeState(newTheme)
  }

  useEffect(() => {
    localStorage.setItem('campus_cloud_theme', theme)
  }, [theme])

  useEffect(() => {
    if (user?.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
      fetchPosts()
      fetchReports()
      fetchBannedUsers()
    } else {
      delete axios.defaults.headers.common['Authorization']
      setPosts([])
      setReports([])
      setBannedUsers([])
    }
  }, [user])

  async function fetchPosts() {
    try {
      const res = await axios.get(`${API_BASE}/posts`)
      setPosts(res.data)
    } catch (e) {
      console.error('Failed to fetch posts', e)
    }
  }

  async function fetchReports() {
    if (user?.role !== 'admin') return
    try {
      const res = await axios.get(`${API_BASE}/reports`)
      setReports(res.data)
    } catch (e) {
      console.error('Failed to fetch reports', e)
    }
  }

  async function fetchBannedUsers() {
    if (user?.role !== 'admin') return
    try {
      const res = await axios.get(`${API_BASE}/bans`)
      setBannedUsers(res.data.map(b => b.email))
    } catch (e) {
      console.error('Failed to fetch banned users', e)
    }
  }

  async function login({ email, password }) {
    try {
      const res = await axios.post(`${API_BASE}/auth/signin`, { email, password })
      const { token, user: userData } = res.data
      setUser({ ...userData, token })
      localStorage.setItem('token', token)
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Login failed' }
    }
  }

  async function signUp({ email, password, role = 'student', firstName, lastName, dateOfBirth, course, specialization }) {
    try {
      const res = await axios.post(`${API_BASE}/auth/signup`, { email, password, role, firstName, lastName, dateOfBirth, course, specialization })
      const { token, user: userData } = res.data
      setUser({ ...userData, token })
      localStorage.setItem('token', token)
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Signup failed' }
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('token')
  }

  async function addPost(post) {
    if (!user?.token) return { success: false, message: 'You must be logged in to post.' }
    try {
      const res = await axios.post(`${API_BASE}/posts`, post)
      setPosts((p) => [res.data, ...p])
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Failed to add post' }
    }
  }

  async function likePost(id) {
    if (!user?.token) return { success: false, message: 'Login required to like' }
    try {
      const res = await axios.post(`${API_BASE}/posts/${id}/like`)
      setPosts((prev) => prev.map((p) => (p._id === id ? res.data : p)))
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Failed to like post' }
    }
  }

  async function dislikePost(id) {
    if (!user?.token) return { success: false, message: 'Login required to dislike' }
    try {
      const res = await axios.post(`${API_BASE}/posts/${id}/dislike`)
      setPosts((prev) => prev.map((p) => (p._id === id ? res.data : p)))
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Failed to dislike post' }
    }
  }

  async function reportPost(postId, reason) {
    if (!user?.token) return { success: false, message: 'Login required to report' }
    const existing = reports.find(r => r.postId?._id === postId && r.reporter === user.email)
    if (existing) return { success: false, message: 'You have already reported this post.' }
    try {
      const res = await axios.post(`${API_BASE}/reports`, { postId, reason })
      if (!res.data) return { success: false, message: 'Failed to report post' }
      setReports((r) => [res.data, ...r])
      return { success: true }
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.response?.data?.errors?.[0]?.msg || 'Failed to report post'
      return { success: false, message: errorMessage }
    }
  }

  async function deletePost(postId) {
    if (!user?.token) return { success: false, message: 'Login required' }
    try {
      await axios.delete(`${API_BASE}/posts/${postId}`)
      setPosts((p) => p.filter((x) => x._id !== postId))
      setReports((r) => r.filter((rep) => rep.postId?._id !== postId))
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Failed to delete post' }
    }
  }

  async function banUser(email) {
    if (!user?.token) return { success: false, message: 'Login required' }
    try {
      await axios.post(`${API_BASE}/bans`, { email })
      setBannedUsers((b) => (b.includes(email) ? b : [...b, email]))
      setPosts((p) => p.filter((post) => post.authorEmail !== email))
      setReports((r) => r.filter((rep) => {
        const post = posts.find((x) => x._id === rep.postId?._id)
        return post && post.authorEmail !== email
      }))
      if (user.email === email) logout()
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Failed to ban user' }
    }
  }

  async function deleteReport(reportId) {
    if (!user?.token) return { success: false, message: 'Login required' }
    try {
      await axios.delete(`${API_BASE}/reports/${reportId}`)
      setReports((r) => r.filter((rep) => rep._id !== reportId))
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Failed to delete report' }
    }
  }

  async function updateProfile(updates) {
    if (!user?.token) return { success: false, message: 'Login required' }
    try {
      const res = await axios.put(`${API_BASE}/auth/me`, updates)
      setUser({ ...user, ...res.data })
      return { success: true }
    } catch (e) {
      return { success: false, message: e.response?.data?.message || 'Failed to update profile' }
    }
  }

  async function incrementView(postId) {
    try {
      await axios.post(`${API_BASE}/posts/${postId}/view`)
    } catch (e) {
      console.error('Failed to increment view', e)
    }
  }

  function search(query) {
    if (!query) return posts
    const q = query.toLowerCase()
    return posts.filter((p) => {
      return (
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.author && p.author.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.resourceType && p.resourceType.toLowerCase().includes(q))
      )
    })
  }

  const isLoggedIn = Boolean(user)

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        signUp,
        logout,
        posts,
        addPost,
        likePost,
        dislikePost,
        reportPost,
        reports,
        deletePost,
        banUser,
        deleteReport,
        bannedUsers,
        search,
        updateProfile,
        incrementView,
        theme,
        setTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
