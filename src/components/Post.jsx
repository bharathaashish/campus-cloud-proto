import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function Post() {
  const { addPost } = useAppContext()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    addPost({ title: title.trim(), description: description.trim() })
    setTitle('')
    setDescription('')
  }

  return (
    <form onSubmit={submit}>
      <h2>Create Post</h2>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <button type="submit">Add</button>
    </form>
  )
}
