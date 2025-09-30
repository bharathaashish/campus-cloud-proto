import React from 'react'
import { useAppContext } from '../context/AppContext'

export default function ThemeSelector() {
  const { theme, setTheme } = useAppContext()

  const themes = [
    { name: 'monochrome', label: 'Monochrome' },
    { name: 'Lavender', label: 'Lavender' }
  ]

  return (
    <div className="relative">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-gray-800 text-gray-100 px-3 py-1 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {themes.map((t) => (
          <option key={t.name} value={t.name}>{t.label}</option>
        ))}
      </select>
    </div>
  )
}
