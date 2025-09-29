import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import FileViewer from './FileViewer'

export default function Home() {
  const { posts, likePost, dislikePost, reportPost, reports, user, isLoggedIn, incrementView } = useAppContext()
  const [reported, setReported] = useState({})
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    if (posts.length > 0) {
      const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '[]')
      const newViewed = [...viewedPosts]
      posts.forEach((p) => {
        if (!newViewed.includes(p.id)) {
          incrementView(p.id)
          newViewed.push(p.id)
        }
      })
      sessionStorage.setItem('viewedPosts', JSON.stringify(newViewed))
    }
  }, [posts, incrementView])

  const featured = posts.filter((p) => p.authorRole === 'teacher')
  const suggestions = [...posts].sort((a, b) => ((b.likes || 0) + (b.views || 0)) - ((a.likes || 0) + (a.views || 0))).slice(0, 5)
  const others = posts.filter((p) => p.authorRole === 'student')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Featured</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {featured.length === 0 && <div className="text-gray-500">No featured posts</div>}
        {featured.map((p) => (
          <div key={p.id} className="min-w-[280px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center overflow-hidden">
              {p.thumbnail ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" /> : <div className="text-xs uppercase text-gray-500 font-medium">{p.resourceType}</div>}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{p.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{p.author} • <em>{p.resourceType}</em> • 👁 {p.views || 0}</p>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{p.description}</p>
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
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedFile(p.file)
                      setViewerOpen(true)
                    }}
                  >
                    {p.file.type.startsWith('image/') ? (
                      <img src={p.file.data} alt="preview" className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded text-xs font-medium">
                        PDF
                      </div>
                    )}
                  </div>
                )}
              </div>
              {reported[p.id] && <div className="bg-orange-50 text-orange-700 text-sm p-2 mt-2 rounded">Reported — admin will review</div>}
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => {
                  if (!isLoggedIn) return alert('Please log in to like')
                  likePost(p.id)
                }}
                disabled={isLoggedIn ? (p.likedBy || []).includes(user.email) : false}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                👍 {p.likes || 0}
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) return alert('Please log in to dislike')
                  dislikePost(p.id)
                }}
                disabled={isLoggedIn ? (p.dislikedBy || []).includes(user.email) : false}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                👎 {p.dislikes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Suggestions</h3>
      <div className="space-y-3">
        {suggestions.map((s) => (
          <div key={s.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <strong className="block text-gray-900">{s.title}</strong>
              <div className="text-xs text-gray-500">{s.author} • {s.resourceType}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!isLoggedIn) return alert('Please log in to like')
                  likePost(s.id)
                }}
                disabled={isLoggedIn ? (s.likedBy || []).includes(user.email) : false}
                className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                👍
              </button>
              <button
                onClick={() => {
                  if (!isLoggedIn) return alert('Please log in to dislike')
                  dislikePost(s.id)
                }}
                disabled={isLoggedIn ? (s.dislikedBy || []).includes(user.email) : false}
                className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                👎
              </button>
              {reports.some(r => r.postId === s.id && r.reporter === user.email) ? (
                <span className="text-orange-600 text-sm">Reported</span>
              ) : (
                <button
                  onClick={() => {
                    const res = reportPost(s.id, 'Inappropriate or spam')
                    if (!res.success) alert(res.message)
                    else setReported((rep) => ({ ...rep, [s.id]: true }))
                  }}
                  className="text-orange-600 hover:text-orange-700 text-sm"
                >
                  Report
                </button>
              )}
              <div className="text-red-500 font-bold">❤️ {s.likes || 0} | 👁 {s.views || 0}</div>
            </div>
          </div>
        ))}
      </div>
      {viewerOpen && <FileViewer file={selectedFile} onClose={() => { setViewerOpen(false); setSelectedFile(null); }} />}
    </div>
  )
}
