import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function Profile() {
  const [error, setError] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editFirstName, setEditFirstName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [editDateOfBirth, setEditDateOfBirth] = useState('')
  const [editCourse, setEditCourse] = useState('UG')
  const [editSpecialization, setEditSpecialization] = useState('')
  const { user, logout, updateProfile } = useAppContext()

  const formattedDOB = user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : ''

  async function handleSave() {
    const res = await updateProfile({
      firstName: editFirstName,
      lastName: editLastName,
      dateOfBirth: editDateOfBirth,
      course: editCourse,
      specialization: editSpecialization,
    })
    if (res.success) {
      setEditMode(false)
      setError('')
    } else {
      setError(res.message)
    }
  }

  function handleEdit() {
    setEditFirstName(user.firstName || '')
    setEditLastName(user.lastName || '')
    setEditDateOfBirth(user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '')
    setEditCourse(user.course || 'UG')
    setEditSpecialization(user.specialization || '')
    setEditMode(true)
    setError('')
  }

  function handleCancel() {
    setEditMode(false)
    setError('')
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-theme-primary">Profile</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {editMode ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-1">First Name</label>
            <input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className="w-full px-3 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-1">Last Name</label>
            <input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className="w-full px-3 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-1">Date of Birth</label>
            <input type="date" value={editDateOfBirth} onChange={(e) => setEditDateOfBirth(e.target.value)} className="w-full px-3 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-1">Course</label>
            <select value={editCourse} onChange={(e) => setEditCourse(e.target.value)} className="w-full px-3 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="UG">UG</option>
              <option value="PG">PG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-theme-primary mb-1">Specialization</label>
            <input value={editSpecialization} onChange={(e) => setEditSpecialization(e.target.value)} placeholder="e.g. Computer Science" className="w-full px-3 py-2 bg-theme-secondary border border-theme rounded-lg text-theme-primary placeholder:text-theme-secondary focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className="btn-theme-primary px-4 py-2 rounded-lg">Save</button>
            <button onClick={handleCancel} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          <p className="text-theme-primary"><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p className="text-theme-primary"><strong>Email:</strong> {user.email}</p>
          <p className="text-theme-primary"><strong>Role:</strong> {user.role}</p>
          <p className="text-theme-primary"><strong>Date of Birth:</strong> {formattedDOB}</p>
          <p className="text-theme-primary"><strong>Course:</strong> {user.course}</p>
          <p className="text-theme-primary"><strong>Specialization:</strong> {user.specialization}</p>
          <div className="flex gap-2 mt-4">
            <button onClick={handleEdit} className="btn-theme-primary px-4 py-2 rounded-lg">Edit Profile</button>
            <button onClick={() => logout()} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">Logout</button>
          </div>
        </div>
      )}
    </div>
  )
}
