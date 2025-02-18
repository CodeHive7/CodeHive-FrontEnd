import apiClient from "../apiClient.js";

export const fetchAllProjects = async () => {
    const response = await apiClient.get("/project/accepted");
    return response.data;
};

export const fetchCategories = async () => {
    const response = await apiClient.get("/admin/categories");
    return response.data;
}

export const applyForPosition = async (projectId, positionId, answers = {}) => {
    await apiClient.post(`/project/${projectId}/positions/${positionId}/apply`, answers);
};

export const createProject = async (projectData) => {
    await apiClient.post("/project", projectData);
};

export const fetchProjectById = async (projectId) => {
    const response = await apiClient.get(`/project/${projectId}`);
    return response.data;
}
