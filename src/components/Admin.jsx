import React from 'react'
import { useAppContext } from '../context/AppContext'

// Simple admin list - in a real app, admin checks are server-side
const ADMIN_EMAILS = ['admin@college.edu.in']

export default function Admin() {
  const { user, reports, posts, deletePost, banUser, deleteReport } = useAppContext()

  if (!user || !ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
        <p className="text-gray-600">This page is for administrators only.</p>
      </div>
    )
  }

  function findPostById(id) {
    return posts.find((p) => p.id === id)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel — Reported Posts</h2>
      {reports.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No reports at this time.</p>
        </div>
      )}
      <div className="space-y-6">
        {reports.map((r) => {
          const p = findPostById(r.postId)
          return (
            <div key={r.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Report Reason:</span>
                  <span className="text-sm text-gray-500">{new Date(r.reportedAt).toLocaleString()}</span>
                </div>
                <p className="text-gray-700 mt-1">{r.reason}</p>
              </div>
              {p ? (
                <div className="border-t pt-4">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{p.title}</h3>
                    <p className="text-sm text-gray-600">by {p.authorEmail || p.author}</p>
                    <p className="text-gray-700 mt-2">{p.description}</p>
                    <p className="text-sm text-gray-500 mt-1">Type: {p.resourceType}</p>
                    {p.resourceType === 'file' && p.file && (
                      <p className="text-sm text-blue-600 mt-1">
                        File: <a href={p.file} target="_blank" rel="noopener noreferrer" className="underline">View File</a>
                      </p>
                    )}
                    {p.resourceType === 'link' && p.link && (
                      <p className="text-sm text-blue-600 mt-1">
                        Link: <a href={p.link} target="_blank" rel="noopener noreferrer" className="underline">Open Link</a>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => deletePost(p.id)}
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
                      onClick={() => deleteReport(r.id)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Dismiss Report
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t pt-4">
                  <p className="text-gray-600">Post not found (maybe already deleted).</p>
                  <button
                    onClick={() => deleteReport(r.id)}
                    className="mt-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Dismiss Report
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
