import React from 'react'

export default function CommunityGuidelines({ onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close community guidelines"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Community Guidelines</h2>
        <div className="text-sm text-gray-700 space-y-2 max-h-64 overflow-y-auto">
          <p>Welcome to Campus Cloud! Please adhere to the following guidelines to maintain a respectful and productive community:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Be respectful and courteous to others.</li>
            <li>No spamming or advertising.</li>
            <li>Use appropriate language and content.</li>
            <li>Report any inappropriate behavior or content.</li>
            <li>Protect your personal information and privacy.</li>
          </ul>
          <p>Thank you for being a part of our community!</p>
        </div>
      </div>
    </div>
  )
}
