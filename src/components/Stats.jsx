import { ListChecks, Clock, Trash2 } from 'lucide-react'

function Stats({ theme, total, completed, active, onClearCompleted }) {
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const isLight = theme === 'light'

  return (
    <div className={`${isLight ? 'bg-white border-gray-200' : 'bg-white/10 backdrop-blur-md border border-white/20'} rounded-2xl p-6 shadow-xl`}>
      <h2 className={`${isLight ? 'text-gray-900' : 'text-white'} font-semibold text-lg mb-4`}>Statistics</h2>

      <div className="space-y-4">
        <div className={`flex items-center justify-between p-3 ${isLight ? 'bg-gray-100 rounded-xl' : 'bg-white/5 rounded-xl'}`}>
          <div className="flex items-center gap-3">
            <ListChecks className={`w-5 h-5 ${isLight ? 'text-gray-600' : 'text-white/70'}`} />
            <span className={`${isLight ? 'text-gray-600' : 'text-white/80'} text-sm`}>Total</span>
          </div>
          <span className={`${isLight ? 'text-gray-900' : 'text-white'} font-bold text-xl`}>{total}</span>
        </div>

        <div className={`flex items-center justify-between p-3 ${isLight ? 'bg-gray-100 rounded-xl' : 'bg-white/5 rounded-xl'}`}>
          <div className="flex items-center gap-3">
            <Clock className={`w-5 h-5 ${isLight ? 'text-gray-600' : 'text-white/70'}`} />
            <span className={`${isLight ? 'text-gray-600' : 'text-white/80'} text-sm`}>Active</span>
          </div>
          <span className={`${isLight ? 'text-gray-900' : 'text-white'} font-bold text-xl`}>{active}</span>
        </div>

        <div className={`flex items-center justify-between p-3 ${isLight ? 'bg-gray-100 rounded-xl' : 'bg-white/5 rounded-xl'}`}>
          <div className="flex items-center gap-3">
            <ListChecks className={`w-5 h-5 ${isLight ? 'text-green-600' : 'text-green-400'}`} />
            <span className={`${isLight ? 'text-gray-600' : 'text-white/80'} text-sm`}>Completed</span>
          </div>
          <span className={`${isLight ? 'text-green-600' : 'text-green-400'} font-bold text-xl`}>{completed}</span>
        </div>

        <div className={`pt-4 ${isLight ? 'border-t border-gray-200' : 'border-t border-white/10'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${isLight ? 'text-gray-600' : 'text-white/70'} text-sm`}>Progress</span>
            <span className={`${isLight ? 'text-gray-900' : 'text-white/80'} text-sm font-medium`}>{completionRate}%</span>
          </div>
          <div className={`h-2 ${isLight ? 'bg-gray-200' : 'bg-white/10'} rounded-full overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-green-400 to-primary-500 transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {completed > 0 && (
          <button
            onClick={onClearCompleted}
            className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 ${isLight ? 'bg-red-100 hover:bg-red-200 text-red-700' : 'bg-red-500/20 hover:bg-red-500/30 text-red-200'} rounded-xl transition-all duration-200 text-sm font-medium`}
          >
            <Trash2 className={`w-4 h-4 ${isLight ? 'text-red-600' : 'text-red-400'}`} />
            Clear Completed
          </button>
        )}
      </div>
    </div>
  )
}

export default Stats
