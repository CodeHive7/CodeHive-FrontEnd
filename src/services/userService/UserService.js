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
};

export const getUserProfile = async () => {
    try {
        const response = await apiClient.get("/user/profile");
        return response.data;
    } catch (error) {
        console.error("Error fetching user profile", error);
        throw error;
    }
};

export const updateUserProfile = async (updatedUserProfile) => {
    try {
        const response = await apiClient.put("/user/profile", updatedUserProfile);
        return response.data;
    } catch (error) {
        console.error("Error updating user profile", error);
        throw error;
    }
};
