import React from 'react'
import { useAppContext } from '../context/AppContext'

export default function Featured() {
  const { posts, likePost, dislikePost, reportPost, user, isLoggedIn } = useAppContext()
  const featured = posts.filter((p) => p.authorRole === 'teacher')

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
                <p className="text-sm text-gray-600 mb-2">Posted by {p.author} • {p.resourceType}</p>
                <p className="text-gray-700 text-sm mb-4">{p.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <button
                    onClick={() => {
                      reportPost(p.id, 'Inappropriate or spam')
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
