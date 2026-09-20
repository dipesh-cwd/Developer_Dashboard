import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../services/projectService";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectCard from "../components/projects/ProjectCard";
import { deleteProject } from "../services/projectService";
const Dashboard = () => {
  const { user, logout } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProject, setEditingProject] = useState(null);
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);

        const data = await getProjects();

        setProjects(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const activeProjects = projects.filter(
    (project) => project.status === "active",
  );

  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  );
  const handleDelete = async (projectId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) return;

    try {
      await deleteProject(projectId);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project._id !== projectId),
      );
    } catch (error) {
      console.error(error);
      setError("Failed to delete project.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Developer Dashboard</h1>

            <p className="text-sm text-slate-500">Welcome, {user?.name}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-100"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <ProjectForm
          project={editingProject}
          onCreated={(project) => {
            setProjects((currentProjects) => [project, ...currentProjects]);
          }}
          onUpdated={(updatedProject) => {
            setProjects((currentProjects) =>
              currentProjects.map((project) =>
                project._id === updatedProject._id ? updatedProject : project,
              ),
            );

            setEditingProject(null);
          }}
          onCancel={() => {
            setEditingProject(null);
          }}
        />

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">Total Projects</p>

            <p className="mt-2 text-3xl font-bold">{projects.length}</p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">Active Projects</p>

            <p className="mt-2 text-3xl font-bold">{activeProjects.length}</p>
          </div>

          <div className="rounded-xl border bg-white p-6">
            <p className="text-sm text-slate-500">Completed Projects</p>

            <p className="mt-2 text-3xl font-bold">
              {completedProjects.length}
            </p>
          </div>
        </section>

        {/* Projects */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Your Projects</h2>

            <p className="text-sm text-slate-500">
              Projects connected to your account.
            </p>
          </div>

          {loading && <p className="text-slate-500">Loading projects...</p>}

          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && projects.length === 0 && (
            <div className="rounded-xl border bg-white p-8 text-center">
              <p className="text-slate-500">No projects yet.</p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={(project) => {
                  setEditingProject(project);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
