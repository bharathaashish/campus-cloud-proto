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
    <form onSubmit={submit}>
      <h2>Create Post</h2>
      <div>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        </label>
      </div>

      <div>
        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        </label>
      </div>

      <div>
        <label>
          Resource type
          <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
            <option value="notes">Notes (text)</option>
            <option value="file">File (image / pdf)</option>
            <option value="link">Link</option>
          </select>
        </label>
      </div>

      {resourceType === 'file' && (
        <div>
          <label>
            Upload file
            <input type="file" accept="image/*,application/pdf" onChange={handleFile} />
          </label>
          {fileData && (
            <div style={{ marginTop: 8 }}>
              <strong>{fileData.name}</strong>
              {fileData.type.startsWith('image/') && <div><img src={fileData.data} alt="preview" style={{ maxWidth: 200 }} /></div>}
            </div>
          )}
        </div>
      )}

      {resourceType === 'link' && (
        <div>
          <label>
            Link URL
            <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." />
          </label>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button type="submit">Add Post</button>
      </div>

      {message && (
        <div style={{ marginTop: 8, color: message.type === 'error' ? 'red' : 'green' }}>{message.text}</div>
      )}
    </form>
  )
}
