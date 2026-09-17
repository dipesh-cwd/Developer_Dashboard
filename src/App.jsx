// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
// } from 'react-router'

// import DashboardLayout from './layouts/DashboardLayout'

// import Dashboard from './pages/Dashboard'
// import Projects from './pages/Projects'
// import Tasks from './pages/Tasks'
// import Settings from './pages/Settings'

// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route element={<DashboardLayout />}>
//           <Route
//             path="/"
//             element={<Navigate to="/dashboard" replace />}
//           />

//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/projects" element={<Projects />} />
//           <Route path="/tasks" element={<Tasks />} />
//           <Route path="/settings" element={<Settings />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App




import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router'

import Login from './pages/Login'
import Register from './pages/Register'

const Dashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Developer Dashboard
      </h1>

      <p className="mt-2 text-slate-500">
        You are logged in.
      </p>
    </div>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App