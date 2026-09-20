import { useState, useEffect } from "react";
import { createProject, updateProject } from "../../services/projectService";
const ProjectForm = ({ project, onCreated, onUpdated, onCancel }) => {

  const [form, setForm] = useState({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "planned",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      name: project?.name || "",
      description: project?.description || "",
      status: project?.status || "planned",
    });
  }, [project]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Project name is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (project) {
        const updatedProject = await updateProject(project._id, {
          name: form.name.trim(),
          description: form.description.trim(),
          status: form.status,
        });

        onUpdated?.(updatedProject);
      } else {
        const newProject = await createProject({
          name: form.name.trim(),
          description: form.description.trim(),
          status: form.status,
        });

        onCreated?.(newProject);

        setForm({
          name: "",
          description: "",
          status: "planned",
        });
      }
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to save project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          {project ? "Edit Project" : "Create Project"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add a new project to your dashboard.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Project name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Developer Dashboard"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your project..."
            rows="4"
            className="w-full resize-none rounded-lg border px-3 py-2 outline-none focus:border-slate-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-500"
          >
            <option value="planned">Planned</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : project
              ? "Update Project"
              : "Create Project"}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
