import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function Home() {
  const { posts, likePost, dislikePost, reportPost, user, isLoggedIn } = useAppContext()
  const [reported, setReported] = useState({})

  if (!posts || posts.length === 0) return <div>No resources yet.</div>
  const featured = posts.filter((p) => p.authorRole === 'teacher')
  const suggestions = []
  const others = posts.filter((p) => p.authorRole !== 'teacher')

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
              <p className="text-sm text-gray-600 mb-2">{p.author} • <em>{p.resourceType}</em></p>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">{p.description}</p>
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
            <div className="text-red-500 font-bold">❤️ {s.likes || 0}</div>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">All Resources</h3>
      <div className="space-y-4">
        {others.map((p) => (
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
                <p className="text-sm text-gray-600 mb-2">Posted by {p.author} • {p.resourceType}</p>
                <p className="text-gray-700 text-sm mb-4">{p.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <button
                    onClick={() => {
                      reportPost(p.id, 'Inappropriate or spam')
                      setReported((s) => ({ ...s, [p.id]: true }))
                    }}
                    className="hover:text-orange-600 transition-colors"
                  >
                    Report
                  </button>
                  {p.file && (
                    <button
                      onClick={() => window.open(p.file.data, '_blank')}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View File
                    </button>
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
    </div>
  )
}
