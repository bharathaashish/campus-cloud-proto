import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

// Assumption: "college Gmail addresses" means college email addresses (commonly ending with .edu).
// We validate that the email ends with `.edu` (case-insensitive). If you meant a different pattern
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
    // must end with .edu (allow subdomains like student.college.edu)
    return value.toLowerCase().endsWith('.edu')
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!validateCollegeEmail(trimmed)) {
      setError('Please enter a valid college email address (must end with .edu).')
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
      <div>
        <h2>Account</h2>
        <p>Logged in as <strong>{user.email}</strong></p>
        <button onClick={() => logout()}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button onClick={() => setMode('login')} disabled={mode === 'login'}>Login</button>
        <button onClick={() => setMode('signup')} disabled={mode === 'signup'}>Sign Up</button>
      </div>
      <form onSubmit={submit}>
        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
      <div>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@college.edu"
            aria-label="college-email"
          />
        </label>
      </div>
      <div>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
  <button type="submit">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
    </div>
  )
}
