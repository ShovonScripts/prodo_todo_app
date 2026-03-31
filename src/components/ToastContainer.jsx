import { X } from 'lucide-react'

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`backdrop-blur-md rounded-xl p-4 shadow-lg border flex items-center gap-3 min-w-[250px] animate-slide-in ${
            toast.type === 'success'
              ? 'bg-green-500/90 border-green-400 text-white'
              : toast.type === 'error'
              ? 'bg-red-500/90 border-red-400 text-white'
              : 'bg-white/90 border-white/40 text-gray-900'
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="p-1 hover:bg-black/10 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
