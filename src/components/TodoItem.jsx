import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useRef, useEffect } from 'react'

function TodoItem({ theme, todo, isSelected, onSelect, onToggle, onDelete, onEdit, isSortable = true }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(todo.text)
  const [editDate, setEditDate] = useState(todo.due_date || '')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleEditSubmit = () => {
    const trimmed = editValue.trim()
    const finalDate = editDate || null
    if ((trimmed && trimmed !== todo.text) || finalDate !== (todo.due_date || null)) {
      onEdit && onEdit(todo.id, trimmed || todo.text, finalDate)
    } else {
      setEditValue(todo.text)
      setEditDate(todo.due_date || '')
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit()
    } else if (e.key === 'Escape') {
      setEditValue(todo.text)
      setEditDate(todo.due_date || '')
      setIsEditing(false)
    }
  }
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id, disabled: !isSortable })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 3: return 'bg-red-500' // High
      case 2: return 'bg-yellow-500' // Medium
      case 1: return 'bg-green-500' // Low
      default: return 'bg-gray-400'
    }
  }

  const isLight = theme === 'light'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 animate-fade-in ${
        isSelected
          ? 'ring-2 ring-primary-500 bg-primary-500/10'
          : isLight
          ? 'hover:bg-gray-50 border border-gray-200'
          : 'hover:bg-white/10'
      } ${isDragging ? 'shadow-xl scale-105 z-50' : ''}`}
      {...attributes}
      {...listeners}
    >
      {/* Priority indicator */}
      <div 
        className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${getPriorityColor(todo.priority || 2)}`} 
        title={`Priority: ${todo.priority === 3 ? 'High' : todo.priority === 2 ? 'Medium' : 'Low'}`}
      />

      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle(todo.id)
        }}
        className="flex-shrink-0 transition-transform duration-200 hover:scale-110"
      >
        {todo.completed ? (
          <div className={`w-6 h-6 ${isLight ? 'bg-green-600' : 'bg-green-500'} rounded-lg flex items-center justify-center checkbox-pop`}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <div className={`w-6 h-6 border-2 ${isLight ? 'border-gray-300' : 'border-white/50'} rounded-lg checkbox-empty`} />
        )}
      </button>

      {isEditing ? (
        <div className="flex-1 flex gap-2 items-center -ml-3">
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className={`flex-1 px-3 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${isLight ? 'bg-white border text-gray-900 border-gray-300' : 'bg-white/10 border border-white/20 text-white'}`}
          />
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            onKeyDown={handleKeyDown}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{ colorScheme: isLight ? 'light' : 'dark' }}
            className={`w-[130px] px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm ${isLight ? 'bg-white border text-gray-700 border-gray-300' : 'bg-white/10 border border-white/20 text-white'}`}
          />
          <button onClick={(e) => { e.stopPropagation(); handleEditSubmit(); }} className="p-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-start justify-center">
          <span
            className={`cursor-pointer transition-all duration-200 ${
              todo.completed ? 'line-through opacity-50' : ''
            } ${isLight ? 'text-gray-900' : 'text-white'}`}
            onClick={() => onSelect(todo.id)}
            onDoubleClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
            title="Double-click to edit"
          >
            {todo.text}
          </span>
          {(todo.tags && todo.tags.length > 0 || todo.due_date) && (
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {todo.tags && todo.tags.map(tag => (
                <span key={tag} className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${isLight ? 'bg-primary-100 text-primary-700' : 'bg-primary-400/20 text-primary-300'}`}>
                  #{tag}
                </span>
              ))}
              {todo.due_date && (
                <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide ${
                  todo.completed ? (isLight ? 'bg-gray-100 text-gray-500' : 'bg-white/5 text-white/40') :
                  new Date(todo.due_date) < new Date(new Date().setHours(0,0,0,0)) 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                    : isLight ? 'bg-gray-200 text-gray-700' : 'bg-white/10 text-white/70'
                }`}>
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(todo.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsEditing(true)
          }}
          className={`p-2 hover:bg-gray-500/20 rounded-lg ${isLight ? 'text-gray-500 hover:text-gray-700' : 'text-gray-400 hover:text-white'} transition-colors`}
          aria-label="Edit todo"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(todo.id)
          }}
          className={`p-2 hover:bg-red-500/20 rounded-lg ${isLight ? 'text-red-500 hover:text-red-600' : 'text-red-400 hover:text-red-300'} transition-colors`}
          aria-label="Delete todo"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default TodoItem
