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

export const getUserProfileByUsername = async (username) => {
    try {
        const response = await apiClient.get(`/user/profile/${username}`);
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

export const fetchMyProjects = async () => {
    try {
        const response = await apiClient.get("/project/my-projects");
        return response.data;
    } catch (error) {
        console.error("Error fetching my projects", error);
        throw error;
    }
};

export const fetchAppliedProjects = async () => {
    try {
        const response = await apiClient.get("/project/applied-projects");
        return response.data;
    } catch (error) {
        console.error("Error fetching applied projects", error);
        throw error;
    }
};

export const fetchApplicantsForProjects = async () => {
    try {
        const response = await apiClient.get("/project/my-applicants");
        return response.data;
    } catch (error) {
        console.error("Error fetching applicants", error);
        throw error;
    }
};

export const updateApplicationStatus = async (projectId, applicationIds, accept, feedback= "") => {
    try {
        const response = await apiClient.put(`/project/${projectId}/applications`, {
            applicationIds,
            accept,
            feedback
        });
        return response.data;
    } catch (error) {
        console.error("Error updating application status", error);
        throw error;
    }
};

export const fetchProjectTasks = async (projectId) => {
    try {
        const response = await apiClient.get(`/tasks/${projectId}/tasks`);
        return response.data;
    } catch (error) {
        console.error("Error fetching project tasks", error);
        throw error;
    }
};

export const fetchAssignedTasks = async () => {
    try {
        const response = await apiClient.get("/tasks/my-tasks");
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks", error);
        throw error;
    }
};

export  const createTask = async (projectId, taskData) => {
    try {
        const response = await apiClient.post(`/tasks/${projectId}/tasks`, taskData);
        return response.data;
    } catch (error) {
        console.error("Error creating task", error);
        throw error;
    }
};

export const updateTaskStatus = async (taskId, status) => {
    try {
        const response = await apiClient.put(`/tasks/${taskId}/status`, {status});
        return response.data;
    } catch (error) {
        console.error("Error updating task", error);
        throw error;
    }
};