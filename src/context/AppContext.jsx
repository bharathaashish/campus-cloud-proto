import React, { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'campus_cloud_user'
const POSTS_KEY = 'campus_cloud_posts'
const REPORTS_KEY = 'campus_cloud_reports'
const BANS_KEY = 'campus_cloud_bans'
const USERS_KEY = 'campus_cloud_users'

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  const [posts, setPosts] = useState(() => {
    try {
      const raw = localStorage.getItem(POSTS_KEY)
      if (raw) return JSON.parse(raw)
    } catch (e) {
      // ignore
    }

    return []
  })

  const [reports, setReports] = useState(() => {
    try {
      const raw = localStorage.getItem(REPORTS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem(USERS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  const [bannedUsers, setBannedUsers] = useState(() => {
    try {
      const raw = localStorage.getItem(BANS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      // ignore localStorage errors
    }
  }, [user])

  useEffect(() => {
    try {
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
    } catch (e) {
      // ignore
    }
  }, [posts])

  useEffect(() => {
    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
    } catch (e) {
      // ignore
    }
  }, [reports])

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users))
    } catch (e) {
      // ignore
    }
  }, [users])

  useEffect(() => {
    try {
      localStorage.setItem(BANS_KEY, JSON.stringify(bannedUsers))
    } catch (e) {
      // ignore
    }
  }, [bannedUsers])

  function login(userObj) {
    // userObj expected to be an object { email, name? }
    // prevent banned users from logging in
    if (userObj && userObj.email && bannedUsers.includes(userObj.email)) {
      return { success: false, message: 'This account has been banned.' }
    }

    // ensure role set (teacher for @eec.srmrmp.edu.in, admin for admin@college.edu.in, else student)
    const role = userObj.email === 'admin@college.edu.in' ? 'admin' : userObj.email.endsWith('@eec.srmrmp.edu.in') ? 'teacher' : 'student'
    const withRole = { ...userObj, role }
    setUser(withRole)
    return { success: true }
  }

  // sign up: save user to users list and auto-login
  function signUp({ email, password, role = 'student' }) {
    if (!email || !password) return { success: false, message: 'Email and password required' }
    const exists = users.find((u) => u.email === email)
    if (exists) return { success: false, message: 'User already exists' }
    const newUser = { email, password, role }
    setUsers((u) => [newUser, ...u])
    setUser({ email, role })
    return { success: true }
  }

  // sign in: validate against users list
  function signIn({ email, password }) {
    const u = users.find((x) => x.email === email && x.password === password)
    if (!u) return { success: false, message: 'Invalid credentials' }
    if (bannedUsers.includes(email)) return { success: false, message: 'This account has been banned.' }
    setUser({ email: u.email, role: u.role })
    return { success: true }
  }

  function logout() {
    setUser(null)
  }

  // Add post with rate limit (1 post per 7 days per student only)
  // Returns { success: boolean, message?: string }
  function addPost(post) {
    // must have a logged in user with email
    if (!user || !user.email) return { success: false, message: 'You must be logged in to post.' }

    const now = Date.now()
    const oneWeek = 1000 * 60 * 60 * 24 * 7

    // Rate limit only for students
    if (user.role === 'student') {
      // find the latest post by this user
      const latest = posts
        .filter((p) => p.authorEmail && p.authorEmail === user.email)
        .sort((a, b) => b.createdAt - a.createdAt)[0]

      if (latest && now - latest.createdAt < oneWeek) {
        const remaining = Math.ceil((oneWeek - (now - latest.createdAt)) / (1000 * 60 * 60 * 24))
        return { success: false, message: `You can only post once per week. Please wait ${remaining} day(s).` }
      }
    }

    const newPost = {
      id: Date.now(),
      ...post,
      author: user.email.split('@')[0],
      authorEmail: user.email,
      authorRole: user.role || 'student',
      createdAt: now,
      views: 0,
    }
    setPosts((p) => [newPost, ...p])
    return { success: true }
  }

  function incrementView(id) {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return { ...p, views: (p.views || 0) + 1 }
      })
    )
  }

  function likePost(id) {
    if (!user || !user.email) return { success: false, message: 'Login required to like' }
    setPosts((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const likedBy = new Set(r.likedBy || [])
        const dislikedBy = new Set(r.dislikedBy || [])
        if (likedBy.has(user.email)) return r // already liked
        const wasDisliked = dislikedBy.has(user.email)
        likedBy.add(user.email)
        dislikedBy.delete(user.email)
        return { ...r, likes: (r.likes || 0) + 1, dislikes: Math.max(0, (r.dislikes || 0) - (wasDisliked ? 1 : 0)), likedBy: Array.from(likedBy), dislikedBy: Array.from(dislikedBy) }
      })
    )
    return { success: true }
  }

  function dislikePost(id) {
    if (!user || !user.email) return { success: false, message: 'Login required to dislike' }
    setPosts((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r
        const likedBy = new Set(r.likedBy || [])
        const dislikedBy = new Set(r.dislikedBy || [])
        if (dislikedBy.has(user.email)) return r // already disliked
        const wasLiked = likedBy.has(user.email)
        dislikedBy.add(user.email)
        likedBy.delete(user.email)
        return { ...r, dislikes: (r.dislikes || 0) + 1, likes: Math.max(0, (r.likes || 0) - (wasLiked ? 1 : 0)), likedBy: Array.from(likedBy), dislikedBy: Array.from(dislikedBy) }
      })
    )
    return { success: true }
  }

  function reportPost(postId, reason) {
    if (!user || !user.email) return { success: false, message: 'Login required to report' }
    const existing = reports.find(r => r.postId === postId && r.reporter === user.email)
    if (existing) return { success: false, message: 'You have already reported this post.' }
    const now = Date.now()
    const rep = { id: now, postId, reason: reason || '', reportedAt: now, reporter: user.email }
    setReports((r) => [rep, ...r])
    return { success: true }
  }

  function deletePost(postId) {
    setPosts((p) => p.filter((x) => x.id !== postId))
    // remove related reports
    setReports((r) => r.filter((rep) => rep.postId !== postId))
    return { success: true }
  }

  function banUser(email) {
    if (!email) return { success: false }
    setBannedUsers((b) => (b.includes(email) ? b : [...b, email]))
    // optionally remove user's posts
    setPosts((p) => p.filter((post) => post.authorEmail !== email))
    // remove related reports
    setReports((r) => r.filter((rep) => {
      const post = posts.find((x) => x.id === rep.postId)
      return post && post.authorEmail !== email
    }))
    // if the banned user is currently logged in, log them out
    if (user && user.email === email) setUser(null)
    return { success: true }
  }

  function deleteReport(reportId) {
    setReports((r) => r.filter((rep) => rep.id !== reportId))
    return { success: true }
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
        signIn,
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
        incrementView,
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
