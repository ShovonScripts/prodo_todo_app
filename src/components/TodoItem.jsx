import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function TodoItem({ theme, todo, isSelected, onSelect, onToggle, onDelete, isSortable = true }) {
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
      <div className={`w-1 h-full rounded-full ${getPriorityColor(todo.priority || 2)}`} />

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

      <span
        className={`flex-1 cursor-pointer transition-all duration-200 ${
          todo.completed ? 'line-through opacity-50' : ''
        } ${isLight ? 'text-gray-900' : 'text-white'}`}
        onClick={() => onSelect(todo.id)}
      >
        {todo.text}
      </span>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(todo.id)
        }}
        className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 hover:bg-red-500/20 rounded-lg ${isLight ? 'text-red-600 hover:text-red-700' : 'text-red-400'}`}
        aria-label="Delete todo"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  )
}

export default TodoItem
