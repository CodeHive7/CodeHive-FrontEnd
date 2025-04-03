import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService, refreshToken, logout as logoutService } from "../../services/Auth/authService.js";
import { getAccessToken, clearTokens } from "../../services/Auth/tokenService.js";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoginWithGithubLoading, setIsLoginWithGithubLoading] = useState(false);
    const navigate = useNavigate();

    // Compute isAuthenticated from user
    const isAuthenticated = !!user;

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = getAccessToken();
            if (accessToken) {
                try {
                    const decodedToken = jwtDecode(accessToken);
                    setUser({
                        username: decodedToken.username || decodedToken.sub,
                        roles: decodedToken.roles || [],
                        permissions: decodedToken.permissions || [],
                    });

                    const isValid = await refreshToken();
                    if (!isValid) {
                        console.warn("Refresh token failed. User session may expire.");
                    }
                } catch (error) {
                    console.error("Error decoding token", error);
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const loginHandler = async (credentials) => {
        try {
            const tokens = await loginService(credentials);
            const decodedUser = jwtDecode(tokens.accessToken);

            const userData = {
                username: decodedUser.username || decodedUser.sub,
                roles: decodedUser.roles || [],
                permissions: decodedUser.permissions || [],
            };

            setUser(userData);

            setTimeout(() => {
                if(userData.roles.includes("SUPER_ADMIN")) {
                    navigate("/admin");
                } else {
                    navigate("/userHome");
                }
            }, 100);
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logoutHandler = async () => {
       await logoutService();
       setUser(null);
       clearTokens();
       navigate("/login");
    };

    const initiateGithubLogin = () => {
        window.location.href = 'http://localhost:8082/oauth2/authorization/github';
    };

    const loginWithGithub = async () => {
        try {
            setIsLoginWithGithubLoading(true);
            initiateGithubLogin();
            // Note: The actual authentication will be handled after redirect
            return true;
        } catch (error) {
            setError(error.response?.data || "Failed to authenticate with GitHub");
            return false;
        } finally {
            // This won't execute immediately since we're redirecting
            setIsLoginWithGithubLoading(false);
        }
    };

    // Create context value using your original function names
    const contextValue = {
        currentUser: user,        // Keep currentUser for compatibility
        user,        
        setUser,             // Also provide user for newer components
        isAuthenticated,          
        isLoading: loading,       // Keep isLoading for compatibility
        loading,                  // Also provide loading for newer components 
        error,
        loginHandler,             // Keep original name
        logoutHandler,            // Keep original name
        loginWithGithub,
        isLoginWithGithubLoading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);