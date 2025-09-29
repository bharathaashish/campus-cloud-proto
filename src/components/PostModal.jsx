import React from 'react'
import FileViewer from './FileViewer'

export default function PostModal({ post, onClose }) {
  if (!post) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-full overflow-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl font-bold"
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
            {post.file.type.startsWith('image/') ? (
              <img src={post.file.data} alt={post.title} className="max-w-full h-48 object-cover rounded" />
            ) : (
              <iframe src={post.file.data} className="w-full h-48" title="PDF Viewer" />
            )}
          </div>
        )}
        {post.link && (
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Open Link
          </a>
        )}
      </div>
    </div>
  )
}
