import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

const navigation = [
  { to: '/dashboard', label: 'Overview', icon: 'grid' },
  { to: '/projects', label: 'Projects', icon: 'folder' },
  { to: '/tasks', label: 'Tasks', icon: 'check' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
]

const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
    folder: <><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"/></>,
    check: <><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8 12 2.5 2.5L16 9"/></>,
    settings: <><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.55V20h-2.4v-.22a1.7 1.7 0 0 0-1.03-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.55-1.03H6v-2.4h.85A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.87L8 8.07l1.7-1.7.06.06a1.7 1.7 0 0 0 1.87.34A1.7 1.7 0 0 0 12.66 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.57 1.7 1.7 0 0 0 1.87-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.55 1.03H21v2.4h-.05A1.7 1.7 0 0 0 19.4 15Z"/></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const initials = user?.name?.trim()?.slice(0, 2)?.toUpperCase() || 'DB'

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
          <div className="px-6 pb-5 pt-7">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white shadow-sm">D</div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.18em] text-slate-400">Developer</p>
                <p className="text-lg font-bold tracking-tight text-slate-950">DevBoard</p>
              </div>
            </div>
          </div>

          <div className="px-4 pt-4">
            <p className="px-3 text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">Workspace</p>
            <nav className="mt-3 space-y-1">
              {navigation.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${isActive ? 'bg-slate-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">{initials}</div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <button type="button" onClick={logout} className="mt-3 w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-slate-500 hover:bg-white hover:text-red-600">Sign out</button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur md:hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-950 text-xs font-bold text-white">D</div>
                <span className="font-bold tracking-tight">DevBoard</span>
              </div>
              <button type="button" onClick={logout} className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100">Sign out</button>
            </div>
            <nav className="mt-3 flex gap-1 overflow-x-auto pb-1">
              {navigation.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${isActive ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon name={item.icon} size={15} />{item.label}
                </NavLink>
              ))}
            </nav>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1400px]"><Outlet /></div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
