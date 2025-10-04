import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function Reports() {
  const { user, reports, posts, likePost, dislikePost, deletePost, banUser, deleteReport } = useAppContext()
  const [reported, setReported] = useState({})

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-theme-primary mb-4">Access Denied</h2>
        <p className="text-theme-secondary">This page is for administrators only.</p>
      </div>
    )
  }

  // Filter out reports with null postId (e.g., if post was deleted)
  const validReports = reports.filter(r => r.postId)

  // Get unique post IDs that have reports
  const reportedPostIds = [...new Set(validReports.map(r => r.postId._id))]
  const reportedPosts = posts.filter(p => reportedPostIds.includes(p._id))

  // Get reporters for each post
  const getReporters = (postId) => validReports.filter(r => r.postId._id === postId).map(r => r.reporter)

  if (reportedPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-theme-primary mb-4">Review Reported Posts</h2>
        <p className="text-theme-secondary">No reported posts at this time.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-theme-primary">Review Reported Posts</h2>
      <div className="space-y-4">
        {reportedPosts.map((p) => (
          <article key={p._id} className="card-theme rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="flex">
              <div className="flex flex-col items-center p-4 bg-theme-accent">
                <button
                  onClick={() => likePost(p._id)}
                  disabled={(p.likedBy || []).includes(user.email)}
                  className="text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ▲
                </button>
                <span className="text-sm font-medium text-theme-primary">{(p.likes || 0) - (p.dislikes || 0)}</span>
                <button
                  onClick={() => dislikePost(p._id)}
                  disabled={(p.dislikedBy || []).includes(user.email)}
                  className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ▼
                </button>
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Posted by {p.author} • {p.resourceType}</p>
                <p className="text-gray-700 text-sm mb-4">{p.description}</p>
                <p className="text-sm text-red-600 mb-2">Reported by: {getReporters(p._id).join(', ')}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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
                <div className="flex gap-3">
                  <button
                    onClick={() => deletePost(p._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Delete Post
                  </button>
                  <button
                    onClick={() => banUser(p.authorEmail || p.author)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Ban User
                  </button>
                  <button
                    onClick={async () => {
                      // Dismiss all reports for this post
                      for (const r of reports.filter(r => r.postId && r.postId._id === p._id)) {
                        await deleteReport(r._id)
                      }
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Dismiss Reports
                  </button>
                </div>
              </div>
              {p.thumbnail && (
                <div className="w-24 h-24 bg-theme-accent flex items-center justify-center overflow-hidden">
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
