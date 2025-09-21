import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Post from './components/Post'
import Featured from './components/Featured'
import SearchBar from './components/SearchBar'
import Admin from './components/Admin'
import RequireAuth from './components/RequireAuth'
import { useAppContext } from './context/AppContext'

export default function App() {
  const { user } = useAppContext()
  const isAdmin = user && ['admin@college.edu'].includes(user.email)
  // If user is not logged in, show only the login/sign-up page
  if (!user) {
    return (
      <div className="app">
        <header className="header">
          <h1>Campus Cloud</h1>
        </header>
        <main>
          <Login />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Campus Cloud</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/post">Post</Link>
          <Link to="/featured">Featured</Link>
          <Link to="/login">Account</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
        </nav>
        <SearchBar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<RequireAuth><Post /></RequireAuth>} />
          <Route path="/featured" element={<RequireAuth><Featured /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth adminOnly={true}><Admin /></RequireAuth>} />
        </Routes>
      </main>
    </div>
  )
}
