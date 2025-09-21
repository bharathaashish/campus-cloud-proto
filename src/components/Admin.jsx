import React from 'react'
import { useAppContext } from '../context/AppContext'

// Simple admin list - in a real app, admin checks are server-side
const ADMIN_EMAILS = ['admin@college.edu']

export default function Admin() {
  const { user, reports, posts, deletePost, banUser, deleteReport } = useAppContext()

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return <div>Access denied. Admins only.</div>
  }

  function findPostById(id) {
    return posts.find((p) => p.id === id)
  }

  return (
    <div>
      <h2>Admin — Reported Posts</h2>
      {reports.length === 0 && <div>No reports</div>}
      <ul>
        {reports.map((r) => {
          const p = findPostById(r.postId)
          return (
            <li key={r.id} style={{ marginBottom: 12 }}>
              <div>
                <strong>Report:</strong> {r.reason} — <small>{new Date(r.reportedAt).toLocaleString()}</small>
              </div>
              {p ? (
                <div style={{ marginTop: 6 }}>
                  <div><strong>{p.title}</strong> by {p.authorEmail || p.author}</div>
                  <div>{p.description}</div>
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => { deletePost(p.id) }}>Delete Post</button>
                    <button onClick={() => { banUser(p.authorEmail || p.author) }}>Ban User</button>
                    <button onClick={() => { deleteReport(r.id) }}>Dismiss Report</button>
                  </div>
                </div>
              ) : (
                <div>Post not found (maybe already deleted). <button onClick={() => deleteReport(r.id)}>Dismiss</button></div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
