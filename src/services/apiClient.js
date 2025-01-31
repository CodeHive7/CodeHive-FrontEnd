import axios  from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./Auth/tokenService.js";

const apiClient = axios.create({
    baseURL: "http://localhost:8082/api",
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if(token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if(isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = getRefreshToken();
                if(!refreshToken) {
                  console.warn("No refresh token found. Logging out...");
                  throw new Error("No refresh token available");
                }

                console.log("Attempting to refresh token...");
                const {data} = await axios.post("http://localhost:8082/api/auth/refresh", { refreshToken });

                setTokens(data);
                apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                processQueue(null, data.accessToken);
                return apiClient(originalRequest);
            } catch (err) {
                console.error("Refresh token failed. User session may expire, err");
                clearTokens();
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;