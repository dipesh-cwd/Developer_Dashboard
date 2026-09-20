import api from "../lib/api";

export const getProjects = async () => {
  const response = await api.get("/projects");

  return response.data;
};

export const createProject = async (projectData) => {
  const response = await api.post("/projects", projectData);
  return response.data;
};

export const updateProject = async (id, projectData) => {
  const response = await api.put(`/projects/${id}`, projectData);
  return response.data;
};

export const deleteProject = async (id) => {
  await api.delete(`/projects/${id}`);
};
