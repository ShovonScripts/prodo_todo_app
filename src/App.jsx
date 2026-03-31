import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, ListTodo, ChevronDown, User, LogOut } from 'lucide-react'
import { supabase } from './lib/supabase'
import Stats from './components/Stats'
import FilterBar from './components/FilterBar'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import ThemeToggle from './components/ThemeToggle'
import ToastContainer from './components/ToastContainer'
import AuthModal from './components/AuthModal'
import LegacyDataModal from './components/LegacyDataModal'

function App() {
  // Auth state
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Todo state
  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'dark'
  })
  const [selectedTodoId, setSelectedTodoId] = useState(null)
  const [completedExpanded, setCompletedExpanded] = useState(true)
  const [toasts, setToasts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showLegacyModal, setShowLegacyModal] = useState(false)
  const [legacyTodos, setLegacyTodos] = useState([])

  // Refs for keyboard shortcuts (defined first, initialized in useEffect)
  const selectedTodoIdRef = useRef(selectedTodoId)
  const activeTodosRef = useRef([])
  const toggleTodoRef = useRef(null)
  const deleteTodoRef = useRef(null)
  const subscriptionRef = useRef(null)

  // Computed values
  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'active' ? !todo.completed : filter === 'completed' ? todo.completed : true
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const activeTodos = filteredTodos.filter(t => !t.completed)
  const completedTodos = filteredTodos.filter(t => t.completed)

  // Theme persistence
  useEffect(() => {
    localStorage.setItem('theme', theme)
    if (theme === 'light') {
      document.body.classList.add('light-theme')
    } else {
      document.body.classList.remove('light-theme')
    }
  }, [theme])

  // Update refs when values change
  useEffect(() => {
    selectedTodoIdRef.current = selectedTodoId
  }, [selectedTodoId])

  useEffect(() => {
    activeTodosRef.current = activeTodos
  }, [activeTodos])

  // Auth state listener
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setAuthLoading(false)
    }
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchTodos()
        subscribeToRealtime()
      } else {
        setTodos([])
        unsubscribeFromRealtime()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase()
      const isInputFocused = tag === 'input' || tag === 'textarea'

      if (isInputFocused) {
        if (e.key === 'Escape') {
          e.preventDefault()
          e.target.blur()
          setSelectedTodoId(null)
        }
        return
      }

      if (e.key === '/') {
        e.preventDefault()
        const input = document.querySelector('input[placeholder="What needs to be done?"]')
        if (input) input.focus()
      } else if (e.ctrlKey && e.key === 'd') {
        e.preventDefault()
        const id = selectedTodoIdRef.current
        if (id) toggleTodoRef.current?.(id)
      } else if (e.key === 'Delete') {
        e.preventDefault()
        const id = selectedTodoIdRef.current
        if (id) deleteTodoRef.current?.(id)
      } else if (e.key === 'Escape') {
        setSelectedTodoId(null)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const active = activeTodosRef.current
        if (active.length > 0) {
          const currentId = selectedTodoIdRef.current
          const currentIndex = currentId ? active.findIndex(t => t.id === currentId) : -1
          const nextIndex = Math.min(currentIndex + 1, active.length - 1)
          if (nextIndex >= 0) setSelectedTodoId(active[nextIndex].id)
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const active = activeTodosRef.current
        if (active.length > 0) {
          const currentId = selectedTodoIdRef.current
          const currentIndex = currentId ? active.findIndex(t => t.id === currentId) : -1
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0
          setSelectedTodoId(active[prevIndex].id)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handlers
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const addToast = (message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  const fetchTodos = async () => {
    if (!user) return
    setIsLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (err) {
      setError(err.message)
      addToast('Failed to load tasks', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToRealtime = () => {
    if (!user) return
    unsubscribeFromRealtime()

    subscriptionRef.current = supabase
      .channel(`todos:${user.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'todos',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        handleRealtimeChange(payload)
      })
      .subscribe()
  }

  const unsubscribeFromRealtime = () => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current)
      subscriptionRef.current = null
    }
  }

  const handleRealtimeChange = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    if (eventType === 'INSERT') {
      setTodos(prev => [...prev, newRecord])
    } else if (eventType === 'UPDATE') {
      setTodos(prev => prev.map(t => t.id === newRecord.id ? newRecord : t))
    } else if (eventType === 'DELETE') {
      setTodos(prev => prev.filter(t => t.id !== oldRecord.id))
    }
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)

    // Check for legacy localStorage todos
    const legacy = localStorage.getItem('todos')
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLegacyTodos(parsed)
          setShowLegacyModal(true)
        } else {
          localStorage.removeItem('todos')
          addToast('Signed in successfully!', 'success')
        }
      } catch {
        localStorage.removeItem('todos')
        addToast('Signed in successfully!', 'success')
      }
    } else {
      addToast('Signed in successfully!', 'success')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    addToast('Signed out', 'info')
  }

  const toggleTodo = (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return

    const wasCompleted = todo.completed
    const newCompleted = !wasCompleted

    // Optimistic update
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: newCompleted } : t))

    supabase
      .from('todos')
      .update({ completed: newCompleted, updated_at: new Date().toISOString() })
      .eq('id', id)
      .then(({ error }) => {
        if (error) throw error
        if (!wasCompleted) addToast('Task completed!', 'success')
      })
      .catch((err) => {
        // Revert on error
        setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: wasCompleted } : t))
        addToast('Failed to update task', 'error')
      })
  }

  const deleteTodo = (id) => {
    if (!confirm('Delete this task?')) return

    const originalTodo = todos.find(t => t.id === id)

    // Optimistic removal
    setTodos(prev => prev.filter(t => t.id !== id))
    if (selectedTodoId === id) setSelectedTodoId(null)

    supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) throw error
        addToast('Task deleted', 'info')
      })
      .catch((err) => {
        // Revert on error
        setTodos(prev => [...prev, originalTodo])
        addToast('Failed to delete task', 'error')
      })
  }

  const clearCompleted = () => {
    const completedIds = todos.filter(t => t.completed).map(t => t.id)

    if (completedIds.length === 0) return

    // Optimistic removal
    setTodos(prev => prev.filter(t => !t.completed))

    supabase
      .from('todos')
      .delete()
      .in('id', completedIds)
      .then(({ error }) => {
        if (error) throw error
        addToast('Completed tasks cleared', 'info')
      })
      .catch((err) => {
        addToast('Failed to clear completed tasks', 'error')
      })
  }

  const handleReorder = async (reorderedActive) => {
    if (!user) return

    // Update order_index for each reordered item
    const updates = reorderedActive.map((todo, index) => ({
      id: todo.id,
      order_index: index + 1
    }))

    // Update local state optimistically
    setTodos(prev => {
      const newTodos = [...prev]
      reorderedActive.forEach((reorderedTodo, newIdx) => {
        const idx = newTodos.findIndex(t => t.id === reorderedTodo.id)
        if (idx !== -1) {
          newTodos[idx] = { ...newTodos[idx], order_index: newIdx + 1 }
        }
      })
      return newTodos
    })

    try {
      const { error } = await supabase
        .from('todos')
        .upsert(updates)

      if (error) throw error
      addToast('Order updated', 'info')
    } catch (err) {
      addToast('Failed to update order', 'error')
    }
  }

  const addTodo = async (text, priority = 2) => {
    if (!user) {
      addToast('Please sign in to add tasks', 'error')
      setShowAuthModal(true)
      return
    }

    // Calculate order_index (append to end of active tasks)
    const activeOnly = todos.filter(t => !t.completed)
    const maxOrder = activeOnly.length > 0 ? Math.max(...activeOnly.map(t => t.order_index || 0)) : 0

    const newTodo = {
      user_id: user.id,
      text,
      completed: false,
      priority,
      order_index: maxOrder + 1,
      tags: []
    }

    // Optimistic update
    const tempTodo = { ...newTodo, id: `temp-${Date.now()}` }
    setTodos(prev => [tempTodo, ...prev])

    try {
      const { data, error } = await supabase.from('todos').insert(newTodo).select().single()
      if (error) throw error
      // Replace temp with real
      setTodos(prev => prev.map(t => t.id === tempTodo.id ? data : t))
      addToast('Task added', 'info')
    } catch (err) {
      setTodos(prev => prev.filter(t => t.id !== tempTodo.id))
      addToast('Failed to add task', 'error')
    }
  }

  const handleImportLegacy = async () => {
    if (!user || legacyTodos.length === 0) return

    // Map legacy todos to Supabase format
    const activeOnly = todos.filter(t => !t.completed)
    const maxOrder = activeOnly.length > 0 ? Math.max(...activeOnly.map(t => t.order_index || 0)) : 0
    const todosToInsert = legacyTodos.map((todo, idx) => ({
      user_id: user.id,
      text: todo.text,
      completed: todo.completed || false,
      priority: 2,
      order_index: maxOrder + idx + 1,
      tags: [],
      created_at: todo.createdAt || new Date().toISOString()
    }))

    try {
      const { error } = await supabase.from('todos').insert(todosToInsert)
      if (error) throw error
      addToast(`Imported ${legacyTodos.length} tasks!`, 'success')
      await fetchTodos()
    } catch (err) {
      addToast('Failed to import tasks', 'error')
    } finally {
      setShowLegacyModal(false)
      setLegacyTodos([])
      localStorage.removeItem('todos')
    }
  }

  const handleDismissLegacy = () => {
    setShowLegacyModal(false)
    setLegacyTodos([])
    localStorage.removeItem('todos')
    addToast('Import skipped', 'info')
  }

  // Set function refs after they're defined
  useEffect(() => {
    toggleTodoRef.current = toggleTodo
  }, [toggleTodo])

  useEffect(() => {
    deleteTodoRef.current = deleteTodo
  }, [deleteTodo])

  // Derive boolean for UI
  const isLight = theme === 'light'
  const isLoggedIn = !!user

  return (
    <>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <nav className={`flex items-center justify-between mb-8 pb-4 ${isLight ? 'border-b border-gray-200' : 'border-b border-white/10'}`}>
            <div className="flex items-center gap-3">
              <div className={`flex items-center justify-center w-10 h-10 ${isLight ? 'bg-gray-200 text-gray-900' : 'bg-white/20 text-white'} backdrop-blur-sm rounded-xl`}>
                <ListTodo className="w-6 h-6" />
              </div>
              <h1 className={`text-2xl font-bold ${isLight ? 'text-gray-900' : 'text-white'}`}>ProDo</h1>
            </div>

            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <>
                  <span className={`text-sm font-medium ${isLight ? 'text-gray-700' : 'text-white/80'} hidden sm:inline-block`}>
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-lg ${isLight ? 'bg-gray-200 hover:bg-gray-300' : 'bg-white/10 hover:bg-white/20'} transition-all flex items-center gap-2`}
                    title="Sign out"
                  >
                    <LogOut className={`w-5 h-5 ${isLight ? 'text-gray-700' : 'text-white'}`} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className={`p-2 rounded-lg flex items-center gap-2 ${isLight ? 'bg-gray-200 hover:bg-gray-300' : 'bg-white/10 hover:bg-white/20'} transition-all`}
                >
                  <User className={`w-5 h-5 ${isLight ? 'text-gray-700' : 'text-white'}`} />
                  <span className={isLight ? 'text-gray-700' : 'text-white'}>Sign In</span>
                </button>
              )}
              <div className={`w-px h-6 ${isLight ? 'bg-gray-300' : 'bg-white/20'}`}></div>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Stats
                theme={theme}
                total={todos.length}
                completed={todos.filter(t => t.completed).length}
                active={todos.filter(t => !t.completed).length}
                onClearCompleted={clearCompleted}
              />
            </div>

            <div className="lg:col-span-3 space-y-6">
              <TodoForm theme={theme} onAdd={addTodo} />

              <div className={`${isLight ? 'bg-white border-gray-200' : 'bg-white/10 backdrop-blur-md border border-white/20'} rounded-2xl p-6 shadow-xl`}>
                <FilterBar
                  theme={theme}
                  filter={filter}
                  onFilterChange={setFilter}
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                />

                {/* Loading state */}
                {isLoading && (
                  <div className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                    <p className={`mt-4 ${isLight ? 'text-gray-600' : 'text-white/60'}`}>Loading your tasks...</p>
                  </div>
                )}

                {/* Error state */}
                {error && (
                  <div className="py-12 text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                      onClick={fetchTodos}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Content */}
                {!isLoading && !error && (
                  <>
                    {/* Active Tasks */}
                    {activeTodos.length > 0 && (
                      <div className="mb-6">
                        <h3 className={`text-sm font-semibold mb-3 ${isLight ? 'text-gray-700' : 'text-white/70'}`}>
                          Active Tasks
                        </h3>
                        <TodoList
                          theme={theme}
                          todos={activeTodos}
                          onToggle={toggleTodo}
                          onDelete={deleteTodo}
                          onReorder={handleReorder}
                          selectedTodoId={selectedTodoId}
                          onSelect={setSelectedTodoId}
                          enableDnd={true}
                        />
                      </div>
                    )}

                    {/* Completed */}
                    {completedTodos.length > 0 && (filter === 'all' || filter === 'completed') && (
                      <div className={`${isLight ? 'border-t border-gray-200 pt-4' : 'border-t border-white/10 pt-4'} mt-4`}>
                        <button
                          onClick={() => setCompletedExpanded(!completedExpanded)}
                          className={`w-full flex items-center justify-between ${isLight ? 'text-gray-900' : 'text-white'}`}
                        >
                          <span className="font-semibold">Completed ({completedTodos.length})</span>
                          <ChevronDown className={`w-5 h-5 transition-transform ${completedExpanded ? 'rotate-0' : 'rotate-180'}`} />
                        </button>
                        {completedExpanded && (
                          <div className="animate-fade-in mt-3">
                            <TodoList
                              theme={theme}
                              todos={completedTodos}
                              onToggle={toggleTodo}
                              onDelete={deleteTodo}
                              selectedTodoId={selectedTodoId}
                              onSelect={setSelectedTodoId}
                              enableDnd={false}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Empty state */}
                    {activeTodos.length === 0 && completedTodos.length === 0 && (
                      <div className="text-center py-12">
                        <ListTodo className={`w-16 h-16 mx-auto mb-4 ${isLight ? 'text-gray-400' : 'text-white/30'}`} />
                        <p className={`text-lg ${isLight ? 'text-gray-500' : 'text-white/60'}`}>
                          {searchQuery
                            ? `No tasks match "${searchQuery}"`
                            : filter === 'all'
                            ? 'No todos yet. Add one above!'
                            : `No ${filter} todos.`}
                        </p>
                        {!isLoggedIn && (
                          <p className={`text-sm mt-2 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
                            <button onClick={() => setShowAuthModal(true)} className="underline">Sign in</button> to sync your tasks
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-16 text-center py-6 text-sm ${isLight ? 'text-gray-500' : 'text-white/50'}`}>
          <p>
            Crafted by <a href="https://prodo.top" target="_blank" rel="noopener noreferrer" className={`font-medium ${isLight ? 'text-gray-800 hover:text-primary-600' : 'text-white/80 hover:text-white'} transition-colors`}>ProDo</a>
          </p>
        </footer>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {showLegacyModal && (
        <LegacyDataModal
          count={legacyTodos.length}
          onConfirm={handleImportLegacy}
          onDismiss={handleDismissLegacy}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}

export default App
