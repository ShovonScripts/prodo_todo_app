import { useState } from 'react'
import { Plus, Flag } from 'lucide-react'

function TodoForm({ theme, onAdd }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [priority, setPriority] = useState(2) // 1=Low, 2=Medium, 3=High
  const [dueDate, setDueDate] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = text.trim()

    if (!trimmed) {
      setError('Please enter a task')
      return
    }

    onAdd(trimmed, priority, dueDate || null)
    setText('')
    setError('')
    setPriority(2) // reset to default
    setDueDate('')
  }

  const isLight = theme === 'light'

  const priorities = [
    { value: 3, label: 'High', color: 'bg-red-500', border: 'border-red-500' },
    { value: 2, label: 'Med', color: 'bg-yellow-500', border: 'border-yellow-500' },
    { value: 1, label: 'Low', color: 'bg-green-500', border: 'border-green-500' },
  ]

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-stretch">
        <div className="w-full sm:flex-1 relative mb-4 sm:mb-0">
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setError('')
            }}
            placeholder="What needs to be done? Use #tags!"
            className={`w-full min-h-[56px] sm:h-full px-5 py-4 ${isLight ? 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-primary-500' : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:ring-white/40'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
          />
          {error && (
            <p className={`absolute -bottom-6 left-1 text-sm font-medium ${isLight ? 'text-red-500' : 'text-red-400'}`}>{error}</p>
          )}
        </div>

        {/* Actions container */}
        <div className="flex w-full sm:w-auto gap-3 h-[56px]">
          {/* Due Date selector */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ colorScheme: isLight ? 'light' : 'dark' }}
            className={`w-[130px] sm:w-min px-3 h-full flex items-center justify-center rounded-xl border-2 transition-all text-sm focus:outline-none focus:ring-2 focus:border-transparent ${
              isLight 
                ? 'border-gray-200 bg-white hover:border-gray-300 focus:ring-primary-500 text-gray-700' 
                : 'border-white/20 bg-white/5 hover:bg-white/10 focus:ring-white/40 text-white'
            }`}
            title="Set due date"
          />

          {/* Priority selector */}
          <div className="flex gap-1 sm:gap-2 flex-[1.2] sm:flex-none">
            {priorities.map(p => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 sm:w-14 h-full flex items-center justify-center rounded-xl border-2 transition-all ${
                  priority === p.value
                    ? `${p.border} ${isLight ? 'bg-gray-50' : 'bg-white/10 shadow-sm'}`
                    : `${isLight ? 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50' : 'border-white/20 bg-white/5 hover:bg-white/10'}`
                }`}
                title={p.label}
              >
                <div className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full ${p.color}`} />
              </button>
            ))}
          </div>

          <button
            type="submit"
            className="flex-1 sm:flex-none h-full px-6 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg">Add</span>
          </button>
        </div>
      </div>
    </form>
  )
}

export default TodoForm
