import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProjects } from "../services/projectService";
import ProjectForm from "../components/projects/ProjectForm";
import ProjectCard from "../components/projects/ProjectCard";
import { deleteProject } from "../services/projectService";
import ProjectSkeleton from "../components/projects/ProjectSkeleton";
const Dashboard = () => {
  const { user, logout } = useAuth();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProject, setEditingProject] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();

      setProjects(data);
    } catch (error) {
      console.error(error);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const activeProjects = projects.filter(
    (project) => project.status === "active",
  );

  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  );

  const filteredProjects = projects
    .filter((project) => {
      const searchText = search.toLowerCase().trim();

      if (!searchText) return true;

      return (
        project.name.toLowerCase().includes(searchText) ||
        project.description?.toLowerCase().includes(searchText)
      );
    })
    .filter((project) => {
      if (statusFilter === "all") return true;

      return project.status === statusFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

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
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your Projects</h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search projects..."
                  className="rounded-lg border bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-lg border bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option value="all">All statuses</option>
                  <option value="planned">Planned</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>

                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  className="rounded-lg border bg-white px-4 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {loading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <ProjectSkeleton key={index} />
              ))}
            </div>
          )}

          {error && !loading && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h3 className="font-semibold text-red-800">
                Something went wrong
              </h3>

              <p className="mt-1 text-sm text-red-600">{error}</p>

              <button
                onClick={loadProjects}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredProjects.length === 0 && (
            <div className="rounded-xl border bg-white p-8 text-center">
              <p className="text-slate-500">
                {projects.length === 0
                  ? "No projects yet."
                  : "No projects match your filters."}
              </p>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
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
