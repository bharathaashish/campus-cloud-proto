import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import FileViewer from './FileViewer'
import PostModal from './PostModal'

export default function MyPosts() {
  const { posts, user, isLoggedIn, deletePost } = useAppContext()
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  // Filter posts to show only the current user's posts
  const myPosts = posts.filter(post => post.authorEmail === user?.email)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-theme-primary">My Posts</h2>
      <div className="space-y-3">
        {myPosts.length === 0 && <div className="text-theme-secondary">You haven't posted anything yet.</div>}
        {myPosts.map((p) => (
          <div
            key={p._id}
            className="card-theme flex justify-between items-center p-4 cursor-pointer"
            onClick={() => {
              setSelectedPost(p)
              setPostModalOpen(true)
            }}
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-theme-primary">{p.title}</h3>
              <p className="text-sm text-theme-secondary">{p.author} • {p.resourceType}</p>
              <p className="text-xs text-theme-secondary">
                {new Date(p.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })}
              </p>
              {p.link && (
                <div className="mt-1">
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                  >
                    {p.link}
                  </a>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-600">👍 {p.likes || 0}</span>
              <span className="text-red-600">👎 {p.dislikes || 0}</span>
              <span className="text-theme-secondary text-sm">👁 {p.views || 0}</span>
              <button
                onClick={async (e) => {
                  e.stopPropagation()
                  if (confirm('Are you sure you want to delete this post?')) {
                    const res = await deletePost(p._id)
                    if (!res.success) alert(res.message)
                  }
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {viewerOpen && <FileViewer file={selectedFile} onClose={() => { setViewerOpen(false); setSelectedFile(null); }} />}
      {postModalOpen && selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => {
            setPostModalOpen(false)
            setSelectedPost(null)
          }}
        />
      )}
    </div>
  )
}
