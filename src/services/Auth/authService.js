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

export const initiateGithubOAuth = () => {
    const currentHostname = window.location.origin;

    window.location.href = `http://localhost:8082/oauth2/authorization/github?redirect_uri=${currentHostname}/oauth-callback`;
};

export const handleOAuthCallback = async () => {
    try {
        const { data } = await apiClient.get(`/auth/oauth2/success`, { withCredentials: true });
        return data;
    } catch (error) {
        console.error("Error handling OAuth callback:", error);
        throw error;
    }
};