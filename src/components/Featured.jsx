import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import FileViewer from './FileViewer'

export default function Featured() {
  const { posts, likePost, dislikePost, reportPost, reports, user, isLoggedIn, incrementView } = useAppContext()
  const [reported, setReported] = useState({})
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const featured = posts.filter((p) => p.authorRole === 'teacher')

  useEffect(() => {
    if (featured.length > 0) {
      const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '[]')
      const newViewed = [...viewedPosts]
      featured.forEach((p) => {
        if (!newViewed.includes(p.id)) {
          incrementView(p.id)
          newViewed.push(p.id)
        }
      })
      sessionStorage.setItem('viewedPosts', JSON.stringify(newViewed))
    }
  }, [featured, incrementView])

  if (featured.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Resources</h2>
        <p className="text-gray-600">No featured resources at this time. Check back later!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Resources</h2>
      <div className="space-y-4">
        {featured.map((p) => (
          <article key={p.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex">
              <div className="flex flex-col items-center p-4 bg-gray-50">
                <button
                  onClick={() => {
                    if (!isLoggedIn) return alert('Please log in to like')
                    likePost(p.id)
                  }}
                  disabled={isLoggedIn ? (p.likedBy || []).includes(user.email) : false}
                  className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ▲
                </button>
                <span className="text-sm font-medium text-gray-700">{(p.likes || 0) - (p.dislikes || 0)}</span>
                <button
                  onClick={() => {
                    if (!isLoggedIn) return alert('Please log in to dislike')
                    dislikePost(p.id)
                  }}
                  disabled={isLoggedIn ? (p.dislikedBy || []).includes(user.email) : false}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ▼
                </button>
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Posted by {p.author} • {p.resourceType} • 👁 {p.views || 0}</p>
                <p className="text-gray-700 text-sm mb-4">{p.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {reports.some(r => r.postId === p.id && r.reporter === user.email) ? (
                    <span className="text-orange-600">Already reported</span>
                  ) : (
                    <button
                      onClick={() => {
                        const res = reportPost(p.id, 'Inappropriate or spam')
                        if (!res.success) alert(res.message)
                        else setReported((s) => ({ ...s, [p.id]: true }))
                      }}
                      className="hover:text-orange-600 transition-colors"
                    >
                      Report
                    </button>
                  )}
                  {p.file && (
                    <div
                      className="cursor-pointer text-blue-600 hover:text-blue-800 transition-colors"
                      onClick={() => {
                        // Open file in modal viewer instead of new tab
                        setSelectedFile(p.file)
                        setViewerOpen(true)
                      }}
                    >
                      View File
                    </div>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Open Link
                    </a>
                  )}
                </div>
                {reported[p.id] && <div className="bg-orange-50 text-orange-700 text-sm p-2 mt-2 rounded">Reported — admin will review</div>}
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
