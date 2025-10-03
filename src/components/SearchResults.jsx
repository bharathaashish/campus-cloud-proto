import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export default function SearchResults() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { posts, search, likePost, dislikePost, reportPost, reports, user, isLoggedIn, incrementView } = useAppContext()
  const [reported, setReported] = useState({})
  const results = query ? search(query) : []

  useEffect(() => {
    // Increment views for results once per session
    if (results.length > 0) {
      const viewedPosts = JSON.parse(sessionStorage.getItem('viewedPosts') || '[]')
      results.forEach((p) => {
        if (!viewedPosts.includes(p._id)) {
          incrementView(p._id)
          viewedPosts.push(p._id)
        }
      })
      sessionStorage.setItem('viewedPosts', JSON.stringify(viewedPosts))
    }
  }, [results, incrementView])

  if (!query) {
    return (
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Search</h2>
        <p className="text-gray-600 mb-4">Enter a search term to find resources.</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">Back to Home</Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Search Results for "{query}" ({results.length} found)
      </h2>
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No resources found for "{query}". Try different keywords.</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800">Back to Home</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((p) => (
            <article key={p._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex">
                <div className="flex flex-col items-center p-4 bg-gray-50">
                  <button
                    onClick={() => {
                      if (!isLoggedIn) return alert('Please log in to like')
                      likePost(p._id)
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
                      dislikePost(p._id)
                    }}
                    disabled={isLoggedIn ? (p.dislikedBy || []).includes(user.email) : false}
                    className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">Posted by {p.author} • {p.resourceType} • 👁 {p.views || 0} views</p>
                  <p className="text-gray-700 text-sm mb-4">{p.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {reports.some(r => r.postId?._id === p._id && r.reporter === user.email) ? (
                      <span className="text-orange-600">Already reported</span>
                    ) : (
                      <button
                        onClick={() => {
                          const res = reportPost(p._id, 'Inappropriate or spam')
                          if (!res.success) alert(res.message)
                          else setReported((s) => ({ ...s, [p._id]: true }))
                        }}
                        className="hover:text-orange-600 transition-colors"
                      >
                        Report
                      </button>
                    )}
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
      )}
    </div>
  )
}
