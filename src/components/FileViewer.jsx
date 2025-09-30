import React from 'react'

export default function FileViewer({ file, onClose }) {
  if (!file) return null

  const isPdf = file.type === 'application/pdf'

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-lg max-w-4xl w-full max-h-full overflow-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{file.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
        </div>
        <div className="flex justify-center">
          {isPdf ? (
            <iframe src={file.data} className="w-full h-96 border-0" title="PDF Viewer" />
          ) : (
            <img src={file.data} alt={file.name} className="max-w-full max-h-96 object-contain rounded-lg" />
          )}
        </div>
      </div>
    </div>
  )
}
