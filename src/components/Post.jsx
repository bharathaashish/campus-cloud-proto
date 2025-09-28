import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function Post() {
  const { addPost, isLoggedIn, user } = useAppContext()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [resourceType, setResourceType] = useState('notes')
  const [fileData, setFileData] = useState(null)
  const [link, setLink] = useState('')
  const [message, setMessage] = useState(null)

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleFile(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    try {
      const data = await readFileAsDataURL(f)
      setFileData({ name: f.name, type: f.type, data })
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to read file' })
    }
  }

  async function submit(e) {
    e.preventDefault()
    setMessage(null)

    if (!isLoggedIn) {
      setMessage({ type: 'error', text: 'You must be logged in to post.' })
      return
    }

    if (!title.trim()) {
      setMessage({ type: 'error', text: 'Title is required.' })
      return
    }

    if (resourceType === 'file' && !fileData) {
      setMessage({ type: 'error', text: 'Please upload a file.' })
      return
    }

    if (resourceType === 'link' && !link.trim()) {
      setMessage({ type: 'error', text: 'Please provide a link.' })
      return
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      resourceType,
      file: fileData,
      link: link.trim() || null,
      likes: 0,
      dislikes: 0,
    }

    const res = addPost(payload)
    if (!res || !res.success) {
      setMessage({ type: 'error', text: res?.message || 'Failed to add post.' })
      return
    }

    setMessage({ type: 'success', text: 'Post added.' })
    // reset form
    setTitle('')
    setDescription('')
    setFileData(null)
    setLink('')
    setResourceType('notes')
  }

  return (
    <form onSubmit={submit} className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Create Post</h2>
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Title" 
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Description"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Resource type</label>
        <select 
          value={resourceType} 
          onChange={(e) => setResourceType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="notes">Notes (text)</option>
          <option value="file">File (image / pdf)</option>
          <option value="link">Link</option>
        </select>
      </div>

      {resourceType === 'file' && (
        <div>
          <label className="block text-sm font-medium mb-2">Upload file</label>
          <input type="file" accept="image/*,application/pdf" onChange={handleFile} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {fileData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <strong className="block mb-2">{fileData.name}</strong>
              {fileData.type.startsWith('image/') && <img src={fileData.data} alt="preview" className="max-w-48 rounded-lg" />}
            </div>
          )}
        </div>
      )}

      {resourceType === 'link' && (
        <div>
          <label className="block text-sm font-medium mb-2">Link URL</label>
          <input 
            value={link} 
            onChange={(e) => setLink(e.target.value)} 
            placeholder="https://..." 
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
      >
        Add Post
      </button>

      {message && (
        <div className={`mt-4 p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {message.text}
        </div>
      )}
    </form>
  )
}
