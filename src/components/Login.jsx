import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

// Assumption: "college Gmail addresses" means college email addresses (commonly ending with .edu).
// We validate that the email ends with `.edu` (case-insensitive). If you meant a different pattern
// (for example a specific Google Workspace domain), tell me and I can update the regex.

export default function Login() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const { user, login, logout, isLoggedIn } = useAppContext()

  function validateCollegeEmail(value) {
    if (!value) return false
    // basic email structure check
    const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!emailRe.test(value)) return false
    // must end with .edu (allow subdomains like student.college.edu)
    return value.toLowerCase().endsWith('.edu')
  }

  function submit(e) {
    e.preventDefault()
    setError('')
    const trimmed = email.trim()
    if (!validateCollegeEmail(trimmed)) {
      setError('Please enter a valid college email address (must end with .edu).')
      return
    }

    // Persisted via context (which writes to localStorage)
    login({ email: trimmed })
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
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="yourname@college.edu"
        aria-label="college-email"
      />
      <button type="submit">Login</button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </form>
  )
}
