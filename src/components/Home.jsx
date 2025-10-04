import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import FileViewer from './FileViewer'
import PostModal from './PostModal'

export default function Home() {
  const { posts, likePost, dislikePost, reportPost, reports, user, isLoggedIn, incrementView } = useAppContext()
  const [reported, setReported] = useState({})
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  useEffect(() => {
    if (posts.length > 0) {
      const viewedKey = 'viewedPosts_' + (user?.email || 'anonymous')
      const viewedPosts = JSON.parse(localStorage.getItem(viewedKey) || '[]')
      const newViewed = [...viewedPosts]
      posts.forEach((p) => {
        if (!newViewed.includes(p._id)) {
          incrementView(p._id)
          newViewed.push(p._id)
        }
      })
      localStorage.setItem(viewedKey, JSON.stringify(newViewed))
    }
  }, [posts, incrementView, user])

  const featured = posts.filter((p) => p.authorRole === 'teacher')
  const suggestions = [...posts].sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0))).slice(0, 5)
  const others = posts.filter((p) => p.authorRole === 'student')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Featured</h2>
      <div className="space-y-3">
        {featured.length === 0 && <div className="text-gray-500">No featured posts</div>}
        {featured.map((p) => (
          <div
            key={p._id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => {
              // Always open the post modal so the link is visible inside the post view.
              setSelectedPost(p)
              setPostModalOpen(true)
            }}
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{p.title}</h3>
              <p className="text-sm text-gray-600">{p.author} • {p.resourceType}</p>
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
                    else setReported((rep) => ({ ...rep, [p._id]: true }))
                  }}
                  className="text-orange-600 hover:text-orange-700 text-sm"
                >
                  Report
                </button>
              )}
              <span className="text-gray-600 text-sm">👁 {p.views || 0}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">Suggestions</h3>
      <div className="space-y-3">
        {suggestions.map((s) => (
          <div
            key={s._id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => {
              setSelectedPost(s)
              setPostModalOpen(true)
            }}
          >
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.author} • {s.resourceType}</p>
                {s.link && (
                  <div className="mt-1">
                    <a
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                      {s.link}
                    </a>
                  </div>
                )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isLoggedIn) return alert('Please log in to like')
                  likePost(s._id)
                }}
                disabled={isLoggedIn ? (s.likedBy || []).includes(user.email) : false}
                className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                👍 {s.likes || 0}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isLoggedIn) return alert('Please log in to dislike')
                  dislikePost(s._id)
                }}
                disabled={isLoggedIn ? (s.dislikedBy || []).includes(user.email) : false}
                className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                👎 {s.dislikes || 0}
              </button>
              {reports.some(r => r.postId?._id === s._id && r.reporter === user.email) ? (
                <span className="text-orange-600 text-sm">Reported</span>
              ) : (
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    const res = await reportPost(s._id, 'Inappropriate or spam')
                    if (!res.success) alert(res.message)
                    else setReported((rep) => ({ ...rep, [s._id]: true }))
                  }}
                  className="text-orange-600 hover:text-orange-700 text-sm"
                >
                  Report
                </button>
              )}
              <span className="text-gray-600 text-sm">👁 {s.views || 0}</span>
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
