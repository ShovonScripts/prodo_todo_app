import { useState, useEffect } from 'react'
import { X, Mail } from 'lucide-react'
import { supabase } from '../lib/supabase'

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSignupSuccess(false)
      setError('')
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onAuthSuccess()
        setEmail('')
        setPassword('')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSignupSuccess(true)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isOpen) return null

  if (signupSuccess) {
    return (
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl text-center animate-fade-in">
          <div className="flex justify-end mb-2">
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500/20 text-primary-400 rounded-full mb-6">
            <Mail className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Check your inbox</h2>
          <p className="text-white/80 mb-8 leading-relaxed">
            We've sent a secure confirmation link to <br/>
            <span className="font-semibold text-white">{email}</span><br/><br/>
            Please click the link in the email to activate your account and start using ProDo.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-white/90 transition-all duration-200"
          >
            Back to app
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-300 text-sm bg-red-500/20 p-3 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-white text-gray-900 rounded-xl font-medium hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/70 hover:text-white text-sm transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
