// import PageHeader from '../components/ui/PageHeader'
// import StatCard from '../components/ui/StatCard'

// const Dashboard = () => {
//   return (
//     <div className="space-y-8">

//       <PageHeader
//         title="Good morning 👋"
//         description="Here's what's happening with your development work."
//       />

//       <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         <StatCard
//           title="Projects"
//           value="12"
//           description="3 active projects"
//         />

//         <StatCard
//           title="Tasks"
//           value="24"
//           description="8 tasks completed"
//         />

//         <StatCard
//           title="Open Issues"
//           value="5"
//           description="2 high priority"
//         />
//       </section>

//       <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
//         <h2 className="text-xl font-semibold text-slate-900">
//           Recent Projects
//         </h2>

//         <div className="mt-4 divide-y divide-slate-100">
//           <div className="py-4">
//             <p className="font-medium">Developer Dashboard</p>
//             <p className="text-sm text-slate-500">
//               React + Tailwind
//             </p>
//           </div>

//           <div className="py-4">
//             <p className="font-medium">LifeOS</p>
//             <p className="text-sm text-slate-500">
//               MERN + AI
//             </p>
//           </div>
//         </div>
//       </section>

//     </div>
//   )
// }

// export default Dashboard






import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

const Dashboard = () => {
  const { user, accessToken } = useAuth()
   const testProjects = async () => {
    try {
      const response = await api.get('/projects')

      console.log(response.data)
    } catch (error) {
      console.error(error.response?.data)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        Developer Dashboard
      </h1>

      <p className="mt-2">
        Welcome, {user?.name}
      </p>

      <button
        onClick={testProjects}
        className="mt-6 rounded-lg bg-black px-4 py-2 text-white"
      >
        Test Projects API
      </button>
    </div>
  )
}

export default Dashboard