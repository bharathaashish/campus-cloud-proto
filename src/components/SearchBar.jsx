import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'

export default function SearchBar() {
  const [q, setQ] = useState('')
  const { search } = useAppContext()
  const [results, setResults] = useState([])

  function doSearch(e) {
    if (e) e.preventDefault()
    setResults(search(q))
  }

  return (
    <div className="relative">
      <form onSubmit={doSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search resources..."
            aria-label="search-resources"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Search</button>
      </form>

      {results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
          {results.map((r) => (
            <li key={r.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
              <div className="font-medium text-gray-900">{r.title}</div>
              <small className="text-gray-500">{r.resourceType}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
