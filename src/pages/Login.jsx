import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault(); setError('')
    try { await login(form.email, form.password); navigate('/dashboard') }
    catch (error) { setError(error.response?.data?.message || 'Login failed') }
  }

  return (
    <div className="auth-shell">
      <div className="auth-layout">
        <section className="auth-brand">
          <div className="auth-logo"><span className="auth-logo-mark">D</span><span>DevBoard</span></div>
          <div className="auth-brand-grid">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-slate-400">Developer workspace</p>
            <h2 className="mt-4 font-bold">Build. Track. Ship.</h2>
            <p>One focused workspace for your projects, tasks, GitHub activity, and development progress.</p>
            <div className="auth-feature-list">
              {['Projects and tasks in one place', 'GitHub commits, issues and PRs', 'Progress and activity at a glance'].map((item) => <div className="auth-feature" key={item}><span>✓</span>{item}</div>)}
            </div>
          </div>
        </section>

        <section className="auth-content">
          <div className="auth-form">
            <p className="text-sm font-semibold text-slate-500">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Sign in to your workspace</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Continue where you left off and keep your development work moving.</p>

            {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label><input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="ui-input" placeholder="you@example.com" /></div>
              <div><div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label></div><input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="ui-input" placeholder="Enter your password" /></div>
              <button type="submit" disabled={loading} className="ui-button-primary w-full py-3">{loading ? 'Signing in...' : 'Sign in'}</button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">Don't have an account? <Link to="/register" className="font-semibold text-slate-950 hover:underline">Create one</Link></p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
