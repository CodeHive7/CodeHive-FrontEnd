import apiClient from "../apiClient.js";

export const fetchAllProjects = async () => {
    const response = await apiClient.get("/project/accepted");
    return response.data;
};

export const fetchCategories = async () => {
    const response = await apiClient.get("/admin/categories");
    return response.data;
}

export const applyForPosition = async (projectId, positionId) => {
    await apiClient.put(`/project/${projectId}/position/${positionId}/apply`);
};

export const createProject = async (projectData) => {
    await apiClient.post("/project", projectData);
}