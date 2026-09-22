import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import PageHeader from "../components/ui/PageHeader";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from '../services/projects'

const Projects = () => {
  const queryClient = useQueryClient();

  const [name, setName] = useState('')
const [description, setDescription] = useState('')
const [editingProject, setEditingProject] = useState(null)

  const {
    data: projects,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setName("");
      setDescription("");
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, projectData }) => updateProject(id, projectData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      setName("");
      setDescription("");
      setEditingProject(null);
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim()) return;

    const projectData = {
      name: name.trim(),
      description: description.trim(),
    };

    if (editingProject) {
      updateProjectMutation.mutate({
        id: editingProject._id,
        projectData,
      });

      return;
    }

    createProjectMutation.mutate({
      ...projectData,
      status: "planned",
    });
  };

  if (isPending) {
    return <p>Loading projects...</p>;
  }

  if (isError) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Projects"
        description="Manage your development projects."
      />

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold">
          {editingProject ? "Edit Project" : "Create Project"}
        </h2>
        
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Project name"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
        />
        

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Project description"
          rows="3"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
        />

        <button
          type="submit"
          disabled={createProjectMutation.isPending}
          className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {editingProject
            ? updateProjectMutation.isPending
              ? "Updating..."
              : "Update Project"
            : createProjectMutation.isPending
              ? "Creating..."
              : "Create Project"}

          {editingProject && (
            <button
              type="button"
              onClick={() => {
                setEditingProject(null);
                setName("");
                setDescription("");
              }}
              className="ml-2 rounded-lg border px-4 py-2 font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </button>

        {createProjectMutation.isError && (
          <p className="text-sm text-red-600">Failed to create project.</p>
        )}
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project._id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{project.name}</h2>

            <p className="mt-2 text-sm text-slate-500">{project.description}</p>

            <span className="mt-4 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm">
              {project.status}
            </span>
            <button
              onClick={() => deleteProjectMutation.mutate(project._id)}
              disabled={deleteProjectMutation.isPending}
              className="mt-4 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
