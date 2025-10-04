import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

// Assumption: "college Gmail addresses" means college email addresses (commonly ending with .edu.in).
// We validate that the email ends with `.edu.in` (case-insensitive). If you meant a different pattern
// (for example a specific Google Workspace domain), tell me and I can update the regex.

export default function Profile() {
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('student')
  const [mode, setMode] = useState('login') // login or signup
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [course, setCourse] = useState('UG')
  const [specialization, setSpecialization] = useState('')
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editDateOfBirth, setEditDateOfBirth] = useState('')
  const [editCourse, setEditCourse] = useState('UG')
  const [editSpecialization, setEditSpecialization] = useState('')
  const { user, login, logout, isLoggedIn, signUp, updateProfile } = useAppContext()

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
      if (!firstName) return setError('First name is required')
      if (!lastName) return setError('Last name is required')
      if (!dateOfBirth) return setError('Date of birth is required')
      if (!course) return setError('Course is required')
      if (!specialization) return setError('Specialization is required')
      const res = await signUp({ email: trimmed, password, role, firstName, lastName, dateOfBirth, course, specialization })
      if (!res.success) return setError(res.message || 'Sign up failed')
      return
    }

    // login mode
    if (!password) return setError('Password required')
    const res = await login({ email: trimmed, password })
    if (!res.success) return setError(res.message || 'Login failed')
  }

  if (isLoggedIn && user) {
    const formattedDOB = user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '';

    async function handleSave() {
      const res = await updateProfile({
        firstName: editFirstName,
        lastName: editLastName,
        dateOfBirth: editDateOfBirth,
        course: editCourse,
        specialization: editSpecialization,
      });
      if (res.success) {
        setEditMode(false);
        setError('');
      } else {
        setError(res.message);
      }
    }

    function handleEdit() {
      setEditFirstName(user.firstName || '');
      setEditLastName(user.lastName || '');
      setEditDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '');
      setEditCourse(user.course || 'UG');
      setEditSpecialization(user.specialization || '');
      setEditMode(true);
      setError('');
    }

    function handleCancel() {
      setEditMode(false);
      setError('');
    }

    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input type="date" value={editDateOfBirth} onChange={(e) => setEditDateOfBirth(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <select value={editCourse} onChange={(e) => setEditCourse(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="UG">UG</option>
                <option value="PG">PG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <input value={editSpecialization} onChange={(e) => setEditSpecialization(e.target.value)} placeholder="e.g. Computer Science" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Save</button>
              <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Date of Birth:</strong> {formattedDOB}</p>
            <p><strong>Course:</strong> {user.course}</p>
            <p><strong>Specialization:</strong> {user.specialization}</p>
            <div className="flex gap-2 mt-4">
              <button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">Edit Profile</button>
              <button onClick={() => logout()} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Logout</button>
            </div>
          </div>
        )}
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
        {mode === 'signup' && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <select value={course} onChange={(e) => setCourse(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="UG">UG</option>
                <option value="PG">PG</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Specialization</label>
              <input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Computer Science" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </>
        )}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors">{mode === 'login' ? 'Login' : 'Sign Up'}</button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  )
}
