import React from 'react'
import { useAppContext } from '../context/AppContext'

export default function ThemeSelector() {
  const { theme, setTheme } = useAppContext()

  const themes = [
    { name: 'dark', label: 'Dark' },
    { name: 'lavender', label: 'Lavender' },
    { name: 'monochrome', label: 'Monochrome' }
  ]

  return (
    <div className="relative">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="bg-theme-accent text-theme-primary px-3 py-2 rounded-lg border border-theme focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
      >
        {themes.map((t) => (
          <option key={t.name} value={t.name}>{t.label}</option>
        ))}
      </select>
    </div>
  )
}
