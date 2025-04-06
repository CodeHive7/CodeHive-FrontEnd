import { Code } from "lucide-react";
import apiClient from "../apiClient.js";
import { setTokens, clearTokens, getRefreshToken } from "./tokenService.js";



export const registerUser = async (registerData) => {
    const { data } = await apiClient.post("/auth/register", registerData);
    return data;
}

export const login = async (credentials) => {
    const { data } = await apiClient.post("/auth/login", credentials);
    setTokens(data);
    return data;
};

export const refreshToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        if(!refreshToken) return false;

        console.log("Refreshing token...");
        const { data } = await apiClient.post("/auth/refresh", { refreshToken });
        setTokens(data);
        return true;
    } catch (err) {
        console.error("Refresh token failed", err);
        return false;
    }
};

export const logout = async () => {
    try {
        const refreshToken = getRefreshToken();
        if(refreshToken) {
            await apiClient.post("/auth/logout", { refreshToken });
        }

    } catch (err) {
        console.error("Logout failed", err);
    } finally {
        clearTokens();
    }
};

export const getGitHubLoginUrl = async () => {
    const { data } = await apiClient.get("/auth/github/login");
    return data;
};

export const handleGitHubCallback = async (code) => {
    const { data } = await apiClient.get("/auth/github/callback", {
        params: { code }
    });
    setTokens(data);
    return data;
};