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
    <div className="searchbar">
      <form onSubmit={doSearch} style={{ display: 'flex', gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search resources..."
          aria-label="search-resources"
        />
        <button type="submit">Search</button>
      </form>

      {results.length > 0 && (
        <ul className="search-results">
          {results.map((r) => (
            <li key={r.id}>{r.title} — <small>{r.resourceType}</small></li>
          ))}
        </ul>
      )}
    </div>
  )
}
