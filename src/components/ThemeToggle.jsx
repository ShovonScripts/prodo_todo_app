import { Sun, Moon } from 'lucide-react'

function ThemeToggle({ theme, onToggle }) {
  const isLight = theme === 'light'

  return (
    <button
      onClick={onToggle}
      className={`p-2 rounded-xl backdrop-blur-sm border transition-all duration-200 ${
        isLight
          ? 'bg-gray-200 border-gray-300 hover:bg-gray-300'
          : 'bg-white/20 border-white/20 hover:bg-white/30'
      }`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className={`w-5 h-5 ${isLight ? 'text-yellow-600' : 'text-white'}`} />
      ) : (
        <Moon className={`w-5 h-5 ${isLight ? 'text-gray-800' : 'text-white'}`} />
      )}
    </button>
  )
}

export default ThemeToggle
