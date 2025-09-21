import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Post from './components/Post'
import Featured from './components/Featured'
import SearchBar from './components/SearchBar'
import Admin from './components/Admin'
import { useAppContext } from './context/AppContext'

export default function App() {
  const { user } = useAppContext()
  const isAdmin = user && ['admin@college.edu'].includes(user.email)

  return (
    <div className="app">
      <header className="header">
        <h1>Campus Cloud</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/post">Post</Link>
          <Link to="/featured">Featured</Link>
          <Link to="/login">Login</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
        </nav>
        <SearchBar />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post" element={<Post />} />
          <Route path="/featured" element={<Featured />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}
