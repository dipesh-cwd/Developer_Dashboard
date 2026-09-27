import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import api from '../lib/api'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })
  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true)
    try { await api.post('/auth/register', form); navigate('/login') }
    catch (error) { setError(error.response?.data?.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="auth-shell">
      <div className="auth-layout">
        <section className="auth-brand">
          <div className="auth-logo"><span className="auth-logo-mark">D</span><span>DevBoard</span></div>
          <div className="auth-brand-grid">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-slate-400">Your developer workspace</p>
            <h2 className="mt-4 font-bold">Turn ideas into shipped work.</h2>
            <p>Create a focused space for the projects you are learning, building, and shipping.</p>
            <div className="auth-feature-list">
              {['Organize projects and tasks', 'Connect your GitHub repositories', 'See progress without the noise'].map((item) => <div className="auth-feature" key={item}><span>✓</span>{item}</div>)}
            </div>
          </div>
        </section>

        <section className="auth-content">
          <div className="auth-form">
            <p className="text-sm font-semibold text-slate-500">Get started</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Create your workspace</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Set up your account and start organizing your development work.</p>
            {error && <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div><label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">Name</label><input id="name" name="name" type="text" value={form.name} onChange={handleChange} required className="ui-input" placeholder="Your name" /></div>
              <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email</label><input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="ui-input" placeholder="you@example.com" /></div>
              <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="ui-input" placeholder="Create a secure password" /></div>
              <button type="submit" disabled={loading} className="ui-button-primary w-full py-3">{loading ? 'Creating account...' : 'Create account'}</button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-slate-950 hover:underline">Sign in</Link></p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Register
