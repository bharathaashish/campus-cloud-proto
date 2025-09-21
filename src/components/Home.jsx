import React from 'react'
import { useAppContext } from '../context/AppContext'

export default function Home() {
  const { posts } = useAppContext()

  return (
    <div>
      <h2>Home</h2>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <strong>{p.title}</strong>
            <p>{p.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
