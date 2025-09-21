import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function Home() {
  const { posts, likePost, dislikePost, reportPost, user, isLoggedIn } = useAppContext()
  const [reported, setReported] = useState({})

  if (!posts || posts.length === 0) return <div>No resources yet.</div>
  const featured = posts.filter((p) => p.authorRole === 'teacher')
  const suggestions = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5)
  const others = posts.filter((p) => p.authorRole !== 'teacher')

  return (
    <div>
      <h2>Featured</h2>
      <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
        {featured.length === 0 && <div>No featured posts</div>}
        {featured.map((p) => (
          <div key={p.id} style={{ minWidth: 260 }} className="card">
            <div className="thumb">{p.thumbnail ? <img src={p.thumbnail} alt={p.title} /> : <div className="placeholder">{p.resourceType}</div>}</div>
            <div className="card-body">
              <h3>{p.title}</h3>
              <p className="meta">{p.author} • <em>{p.resourceType}</em></p>
              <p className="desc">{p.description}</p>
            </div>
            <div className="card-actions">
              <button
                onClick={() => {
                  if (!isLoggedIn) return alert('Please log in to like')
                  likePost(p.id)
                }}
                disabled={isLoggedIn ? (p.likedBy || []).includes(user.email) : false}
              >
                👍 {p.likes || 0}
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) return alert('Please log in to dislike')
                  dislikePost(p.id)
                }}
                disabled={isLoggedIn ? (p.dislikedBy || []).includes(user.email) : false}
              >
                👎 {p.dislikes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 16 }}>Suggestions</h3>
      <div>
        {suggestions.map((s) => (
          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 6, borderBottom: '1px solid #eee' }}>
            <div>
              <strong>{s.title}</strong>
              <div style={{ fontSize: 12, color: '#666' }}>{s.author} • {s.resourceType}</div>
            </div>
            <div style={{ alignSelf: 'center' }}>❤️ {s.likes || 0}</div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 16 }}>All Resources</h3>
      <div className="grid">
        {others.map((p) => (
          <article key={p.id} className="card">
            <div className="thumb">
              {p.thumbnail ? <img src={p.thumbnail} alt={p.title} /> : <div className="placeholder">{p.resourceType}</div>}
            </div>
            <div className="card-body">
              <h3>{p.title}</h3>
              <p className="meta">{p.author} • <em>{p.resourceType}</em></p>
              <p className="desc">{p.description}</p>
            </div>
            <div className="card-actions">
              <button
                onClick={() => {
                  if (!isLoggedIn) return alert('Please log in to like')
                  likePost(p.id)
                }}
                disabled={isLoggedIn ? (p.likedBy || []).includes(user.email) : false}
              >
                👍 {p.likes || 0}
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) return alert('Please log in to dislike')
                  dislikePost(p.id)
                }}
                disabled={isLoggedIn ? (p.dislikedBy || []).includes(user.email) : false}
              >
                👎 {p.dislikes || 0}
              </button>
              <button
                onClick={() => {
                  reportPost(p.id, 'Inappropriate or spam')
                  setReported((s) => ({ ...s, [p.id]: true }))
                }}
              >
                🚩 Report
              </button>
            </div>
            {reported[p.id] && <div style={{ color: 'orange', marginTop: 8 }}>Reported — admin will review</div>}
          </article>
        ))}
      </div>
    </div>
  )
}
