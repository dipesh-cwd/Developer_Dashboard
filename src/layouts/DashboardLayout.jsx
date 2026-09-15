import { NavLink, Outlet } from 'react-router'

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">

        <aside className="w-64 border-r bg-white p-6">
          <h2 className="text-2xl font-bold">
            DevBoard
          </h2>

          <nav className="mt-8 flex flex-col gap-2">
            <NavLink
              to="/dashboard"
              className="rounded-lg px-4 py-2 hover:bg-slate-100"
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/projects"
              className="rounded-lg px-4 py-2 hover:bg-slate-100"
            >
              Projects
            </NavLink>

            <NavLink
              to="/tasks"
              className="rounded-lg px-4 py-2 hover:bg-slate-100"
            >
              Tasks
            </NavLink>

            <NavLink
              to="/settings"
              className="rounded-lg px-4 py-2 hover:bg-slate-100"
            >
              Settings
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default DashboardLayout