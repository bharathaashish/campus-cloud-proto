import React, { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

const STORAGE_KEY = 'campus_cloud_user'

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (e) {
      return null
    }
  })

  const [posts, setPosts] = useState([
    { id: 1, title: 'Free Textbooks', description: 'Intro CS textbooks available' },
  ])

  useEffect(() => {
    try {
      if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      // ignore localStorage errors
    }
  }, [user])

  function login(userObj) {
    // userObj expected to be an object { email, name? }
    setUser(userObj)
  }

  function logout() {
    setUser(null)
  }

  function addPost(post) {
    setPosts((p) => [{ id: Date.now(), ...post }, ...p])
  }

  function search(query) {
    if (!query) return posts
    return posts.filter(
      (p) => p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  const isLoggedIn = Boolean(user)

  return (
    <AppContext.Provider value={{ user, isLoggedIn, login, logout, posts, addPost, search }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
