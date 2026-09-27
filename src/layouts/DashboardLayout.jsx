import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

const navigation = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/settings', label: 'Settings' },
]

const DashboardLayout = () => {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r bg-white p-6 md:block">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Developer
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              DevBoard
            </h2>
          </div>

          <nav className="mt-8 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-10">
            <div className="border-t pt-5">
              <p className="truncate text-sm font-medium text-slate-900">
                {user?.name}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email}
              </p>

              <button
                type="button"
                onClick={logout}
                className="mt-4 text-sm font-medium text-red-600 hover:text-red-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b bg-white px-4 py-3 md:hidden">
            <div className="flex items-center justify-between">
              <span className="font-bold">DevBoard</span>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-red-600"
              >
                Sign out
              </button>
            </div>

            <nav className="mt-3 flex gap-2 overflow-x-auto">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </header>

          <main className="p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
