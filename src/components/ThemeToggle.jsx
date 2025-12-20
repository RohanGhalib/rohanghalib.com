'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import './ThemeToggle.css'; // Using a separate CSS file for styling

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <button
      className="theme-toggle-btn" // Add a class for styling
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <i className="bi bi-sun"></i> : <i className="bi bi-moon"></i>}
    </button>
  )
}
