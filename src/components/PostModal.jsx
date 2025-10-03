import React from 'react'
import FileViewer from './FileViewer'

export default function PostModal({ post, onClose }) {
  if (!post) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-full overflow-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.description}</p>
        <p className="text-sm text-gray-500 mb-4">
          Posted by <strong>{post.author}</strong> • {post.resourceType}
        </p>
        {post.file && (
          <div className="mb-4">
            {post.file.startsWith('data:image/') ? (
              <img src={post.file} alt={post.title} className="max-w-full h-48 object-cover rounded" />
            ) : (
              <iframe src={post.file} className="w-full h-48" title="File Viewer" />
            )}
          </div>
        )}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            {post.link}
          </a>
        )}
      </div>
    </div>
  )
}
