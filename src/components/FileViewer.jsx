import React from 'react'

export default function FileViewer({ file, onClose }) {
  if (!file) return null

  const isLink = typeof file === 'string' && (file.startsWith('http') || file.startsWith('//'))
  const isPdf = !isLink && (typeof file === 'string' ? file.includes('application/pdf') : file.type === 'application/pdf')
  const fileName = typeof file === 'string' ? (isLink ? 'Link' : 'File') : file.name
  const fileData = typeof file === 'string' ? file : file.data

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg max-w-4xl w-full max-h-full overflow-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{fileName}</h3>
          <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold">&times;</button>
        </div>
        <div className="flex justify-center">
          {isLink ? (
            <a
              href={fileData}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline text-xl break-all"
            >
              {fileData}
            </a>
          ) : isPdf ? (
            <iframe src={fileData} className="w-full h-96 border-0" title="PDF Viewer" />
          ) : (
            <img src={fileData} alt={fileName} className="max-w-full max-h-96 object-contain rounded-lg" />
          )}
        </div>
      </div>
    </div>
  )
}
