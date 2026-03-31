import { useState } from 'react'
import { Plus, Flag } from 'lucide-react'

function TodoForm({ theme, onAdd }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [priority, setPriority] = useState(2) // 1=Low, 2=Medium, 3=High

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()

    if (!trimmed) {
      setError('Please enter a task')
      return
    }

    onAdd(trimmed, priority)
    setText('')
    setError('')
    setPriority(2) // reset to default
  }

  const isLight = theme === 'light'

  const priorities = [
    { value: 3, label: 'High', color: 'bg-red-500', border: 'border-red-500' },
    { value: 2, label: 'Med', color: 'bg-yellow-500', border: 'border-yellow-500' },
    { value: 1, label: 'Low', color: 'bg-green-500', border: 'border-green-500' },
  ]

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-3 items-start">
        <div className="flex-1 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setError('')
            }}
            placeholder="What needs to be done?"
            className={`w-full px-5 py-4 ${isLight ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-primary-500' : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:ring-white/40'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
          />
          {error && (
            <p className={`absolute -bottom-5 left-0 text-sm ${isLight ? 'text-red-600' : 'text-red-300'}`}>{error}</p>
          )}
        </div>

        {/* Priority selector */}
        <div className="flex gap-1">
          {priorities.map(p => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPriority(p.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                priority === p.value
                  ? `${p.border} ${isLight ? 'bg-white' : 'bg-white/5'}`
                  : `${isLight ? 'border-gray-300 bg-white' : 'border-white/20 bg-white/5'}`
              }`}
              title={p.label}
            >
              <div className={`w-3 h-3 rounded-full ${p.color}`} />
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="px-6 py-4 bg-white text-gray-900 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Add
        </button>
      </div>
    </form>
  )
}

export default TodoForm
