import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import FileViewer from './FileViewer'

export default function Announcements() {
  const { posts, likePost, dislikePost, reportPost, reports, user, isLoggedIn, incrementView } = useAppContext()
  const [reported, setReported] = useState({})
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const announcements = posts.filter((p) => p.authorRole === 'admin' || p.authorEmail === 'admin@college.edu.in')

  useEffect(() => {
    if (announcements.length > 0) {
      const viewedKey = 'viewedPosts_' + (user?.email || 'anonymous')
      const viewedPosts = JSON.parse(localStorage.getItem(viewedKey) || '[]')
      const newViewed = [...viewedPosts]
      announcements.forEach((p) => {
        if (!newViewed.includes(p._id)) {
          incrementView(p._id)
          newViewed.push(p._id)
        }
      })
      localStorage.setItem(viewedKey, JSON.stringify(newViewed))
    }
  }, [announcements, incrementView, user])

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-theme-primary mb-4">Announcements</h2>
        <p className="text-theme-secondary">No announcements at this time. Check back later!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-theme-primary mb-6">Announcements</h2>
      <div className="space-y-4">
        {announcements.map((p) => (
          <article key={p._id} className="card-theme rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex">
              <div className="flex flex-col items-center p-4 bg-theme-accent">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!isLoggedIn) return alert('Please log in to like')
                    likePost(p._id)
                  }}
                  disabled={isLoggedIn ? (p.likedBy || []).includes(user.email) : false}
                  className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ▲
                </button>
                <span className="text-sm font-medium text-theme-primary">{(p.likes || 0) - (p.dislikes || 0)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!isLoggedIn) return alert('Please log in to dislike')
                    dislikePost(p._id)
                  }}
                  disabled={isLoggedIn ? (p.dislikedBy || []).includes(user.email) : false}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ▼
                </button>
              </div>
              <div className="flex-1 p-4 cursor-pointer" onClick={() => {
                setSelectedFile(p.link || p.file)
                setViewerOpen(true)
              }}>
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Posted by {p.author} • {p.resourceType} • 👁 {p.views || 0}</p>
                <p className="text-gray-700 text-sm mb-4">{p.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {reports.some(r => r.postId?._id === p._id && r.reporter === user.email) ? (
                    <span className="text-orange-600">Already reported</span>
                  ) : (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        const res = await reportPost(p._id, 'Inappropriate or spam')
                        if (!res.success) alert(res.message)
                        else setReported((s) => ({ ...s, [p._id]: true }))
                      }}
                      className="hover:text-orange-600 transition-colors"
                    >
                      Report
                    </button>
                  )}
                  {p.file && (
                    <div
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(p.file)
                        setViewerOpen(true)
                      }}
                    >
                      {p.file && typeof p.file === 'string' && p.file.startsWith('data:image/') ? (
                        <img src={p.file} alt="preview" className="w-24 h-24 object-cover rounded" />
                      ) : (
                        <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded text-sm font-medium">
                          PDF
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {reported[p._id] && <div className="bg-orange-50 text-orange-700 text-sm p-2 mt-2 rounded">Reported — admin will review</div>}
              </div>
              {p.thumbnail && (
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      {viewerOpen && <FileViewer file={selectedFile} onClose={() => { setViewerOpen(false); setSelectedFile(null); }} />}
    </div>
  )
}
