import { Search } from 'lucide-react'

function FilterBar({ theme, filter, onFilterChange, searchValue, onSearchChange, allTags = [], selectedTag, onSelectTag }) {
  const isLight = theme === 'light'
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ]

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isLight ? 'text-gray-400' : 'text-white/50'}`} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          className={`w-full px-4 py-3 pl-10 rounded-xl text-sm transition-all duration-200 ${
            isLight
              ? 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
              : 'bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent'
          }`}
        />
      </div>

      <div className={`flex gap-2 flex-wrap ${isLight ? '' : ''}`}>
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === f.key
                ? isLight
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-900 shadow-lg'
                : isLight
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {allTags.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isLight ? 'text-gray-400' : 'text-white/40'} mr-1`}>Tags:</span>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                selectedTag === tag
                  ? isLight
                    ? 'bg-primary-500 text-white'
                    : 'bg-primary-500 text-white'
                  : isLight
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 border border-white/10'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterBar
