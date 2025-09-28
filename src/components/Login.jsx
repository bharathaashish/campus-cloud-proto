import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

// Assumption: "college Gmail addresses" means college email addresses (commonly ending with .edu.in).
// We validate that the email ends with `.edu.in` (case-insensitive). If you meant a different pattern
// (for example a specific Google Workspace domain), tell me and I can update the regex.

export default function Login() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('student')
  const [mode, setMode] = useState('login') // login or signup
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { user, login, logout, isLoggedIn, signUp, signIn } = useAppContext()

  function validateCollegeEmail(value) {
    if (!value) return false
    // basic email structure check
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRe.test(value)) return false
    // must end with .edu.in (allow subdomains like student.college.edu.in)
    return value.toLowerCase().endsWith('.edu.in')
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!validateCollegeEmail(trimmed)) {
      setError('Please enter a valid college email address (must end with .edu.in).')
      return
    }
    if (mode === 'signup') {
      if (!password) return setError('Password required for sign up')
      const res = signUp({ email: trimmed, password, role })
      if (!res.success) return setError(res.message || 'Sign up failed')
      return
    }

    // login mode
    if (!password) return setError('Password required')
    const res = signIn({ email: trimmed, password })
    if (!res.success) return setError(res.message || 'Login failed')
  }

  if (isLoggedIn && user) {
    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Account</h2>
        <p className="mb-4">Logged in as <strong>{user.email}</strong></p>
        <button onClick={() => logout()} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">Logout</button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2 mb-6">
        <button onClick={() => setMode('login')} disabled={mode === 'login'} className={`px-4 py-2 rounded-lg font-medium ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Login</button>
        <button onClick={() => setMode('signup')} disabled={mode === 'signup'} className={`px-4 py-2 rounded-lg font-medium ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>Sign Up</button>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <h2 className="text-2xl font-bold text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@college.edu.in"
            aria-label="college-email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  )
}
