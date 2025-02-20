import apiClient  from "../apiClient.js";
import Swal from "sweetalert2";

export const fetchUsers = async () => {
    const { data } = await apiClient.get("/admin/users");
    return data;
};

export const blockUser = async (userId, callback) => {
    try {
        await apiClient.post(`/admin/users/${userId}/block`);
        callback();
    } catch (error) {
        console.error("Error blocking user", error);
    }
};

export const unblockUser = async (userId, callback) => {
    try {
        await apiClient.post(`/admin/users/${userId}/unblock`);
        callback();
    } catch (error) {
        console.error("Error unblocking user", error);
    }
};

export const assignRoles = async (userId, roles, callback) => {
    try {
        await apiClient.post(`/admin/users/${userId}/roles`, { roleNames: roles });
        callback(); // Reload users
    } catch (error) {
        console.error("Failed to assign roles", error);
    }
};

export const removeRoles = async (userId, roles, callback) => {
    try {
        await apiClient.delete(`/admin/users/${userId}/roles`, { data: { roleNames: roles } });
        callback(); // Reload users
    } catch (error) {
        console.error("Failed to remove roles", error);
    }
};

export const createUser = async (userDetails, callback) => {
    try {
        await apiClient.post("/admin/users", userDetails);
        callback(); // Reload users
    } catch (error) {
        console.error("Failed to create user", error);
    }
};

export const fetchRoles = async () => {
    const { data } = await apiClient.get("/admin/roles");
    return data;
};

export const fetchPermissions = async () => {
    const { data } = await apiClient.get("/admin/permissions");
    return data;
};

export const assignPermissions = async (roleId, permissions , callback) => {
    try {
        const response = await apiClient.post(`/admin/roles/${roleId}/permissions`, { permissionNames: permissions });
        console.log("API Response : ", response);
        callback();
    } catch (error) {
        console.error("Error assigning permissions", error);
    }
};

export const removePermissions = async (roleId, permissions, callback) => {
    try {
        await apiClient.delete(`/admin/roles/${roleId}/permissions`, { data: { permissionNames: permissions } });
        callback();
    } catch (error) {
        console.error("Error removing permissions", error);
    }
};

export const createRole = async (roleName,callback) => {
    try {
        console.log("Creating role : ", roleName);
        const response = await apiClient.post("/admin/roles", { name: roleName });
        console.log("Role Created Successfully : ", response.data);
        callback();
    } catch (error) {
        console.error("Error creating role", error.response?.data || error.message);
    }
};

export const updateRole = async (roleId, newName, callback) => {
    try {
        await apiClient.put(`/admin/roles/${roleId}`, { name: newName });
        callback();
    } catch (error) {
        console.error("Error updating role", error);
    }
};

export const deleteRole = async (roleId, cllback) => {
    await apiClient.delete(`/admin/roles/${roleId}`);
    cllback();
};

export const fetchCategories = async () => {
    const response = await apiClient.get("/admin/categories");
    return response.data;
};

export const createCategory = async (categoryName, callback) => {
    try {
        await apiClient.post("/admin/categories", { name: categoryName });
        callback();
    } catch (error) {
        console.error("Error creating category", error);
    }
};

export const updateCategory = async (categoryId, newName, callback) => {
    try {
        await apiClient.put(`/admin/categories/${categoryId}`, { name: newName });
        callback();
    } catch (error) {
        console.error("Error updating category", error);
    }
};

export const deleteCategory = async (categoryId) => {
    try {
        await apiClient.delete(`/admin/categories/${categoryId}`);
    } catch (error) {
        console.error("Error deleting category", error);
        throw error;
    }
};


export const fetchPendingProjects = async () => {
    const response = await apiClient.get("/project/pending");
    return response.data;
};

export const fetchAcceptedProjects = async () => {
    const response = await apiClient.get(`/project/accepted`);
    return response.data;
};

export const fetchRejectedProjects = async () => {
    const response = await apiClient.get(`/project/rejected`);
    return response.data;
};

export const acceptProject = async (projectId) => {
    await apiClient.post(`/admin/projects/${projectId}/accept`);
};

export const rejectProject = async (projectId, feedback) => {
    await apiClient.post(`/admin/projects/${projectId}/reject`, { feedback });
};

