import apiClient from "../apiClient.js";


export const registerUser = async (registerData) => {
    const { data } = await apiClient.post("/auth/register", registerData);
    return data;
}

export const login = async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    return data;
};

export const refreshToken = async () => {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await apiClient.post("/auth/refresh", { refreshToken });
        localStorage.setItem("accessToken", data.accessToken);
        return true;
    } catch {
        return false;
    }
};

export const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    await apiClient.post("/auth/logout", { refreshToken });
}