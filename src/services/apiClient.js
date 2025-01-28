import axios  from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:8082/api",
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh = localStorage.getItem("refreshToken");
            const {data} = await axios.post("/auth/refresh", {refreshToken: refresh});
            localStorage.setItem("accessToken", data.accessToken);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            return apiClient(originalRequest);
        }
        return Promise.reject(error);
    }
);

export default apiClient;