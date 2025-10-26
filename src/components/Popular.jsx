import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import FileViewer from './FileViewer'
import PostModal from './PostModal'

export default function Popular() {
  const { posts, likePost, dislikePost, reportPost, reports, user, isLoggedIn, incrementView } = useAppContext()
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [sortBy, setSortBy] = useState('likes') // 'likes' or 'views'

  // Sort posts based on selected criteria
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'likes') {
      return (b.likes || 0) - (a.likes || 0)
    } else {
      return (b.views || 0) - (a.views || 0)
    }
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-theme-primary">Popular Posts</h2>

      {/* Sort Toggle */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSortBy('likes')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortBy === 'likes'
              ? 'bg-theme-accent text-theme-primary'
              : 'bg-theme-secondary text-theme-primary hover:bg-theme-accent'
          }`}
        >
          Most Liked
        </button>
        <button
          onClick={() => setSortBy('views')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            sortBy === 'views'
              ? 'bg-theme-accent text-theme-primary'
              : 'bg-theme-secondary text-theme-primary hover:bg-theme-accent'
          }`}
        >
          Most Viewed
        </button>
      </div>

      <div className="space-y-3">
        {sortedPosts.length === 0 && <div className="text-theme-secondary">No posts available.</div>}
        {sortedPosts.map((p) => (
          <div
            key={p._id}
            className="card-theme flex justify-between items-center p-4 cursor-pointer"
            onClick={() => {
              setSelectedPost(p)
              setPostModalOpen(true)
              incrementView(p._id)
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
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isLoggedIn) return alert('Please log in to like')
                  likePost(p._id)
                }}
                disabled={isLoggedIn ? (p.likedBy || []).includes(user.email) : false}
                className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                👍 {p.likes || 0}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isLoggedIn) return alert('Please log in to dislike')
                  dislikePost(p._id)
                }}
                disabled={isLoggedIn ? (p.dislikedBy || []).includes(user.email) : false}
                className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                👎 {p.dislikes || 0}
              </button>
              {reports.some(r => r.postId?._id === p._id && r.reporter === user.email) ? (
                <span className="text-orange-600 text-sm">Reported</span>
              ) : (
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    const res = await reportPost(p._id, 'Inappropriate or spam')
                    if (!res.success) alert(res.message)
                  }}
                  className="text-orange-600 hover:text-orange-700 text-sm"
                >
                  Report
                </button>
              )}
              <span className="text-theme-secondary text-sm">👁 {p.views || 0}</span>
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
