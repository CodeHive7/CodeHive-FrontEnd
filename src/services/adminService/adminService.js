import apiClient  from "../apiClient.js";

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
}

