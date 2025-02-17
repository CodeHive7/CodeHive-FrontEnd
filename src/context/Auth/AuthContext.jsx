import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, refreshToken, logout } from "../../services/Auth/authService.js";
import { getAccessToken, clearTokens } from "../../services/Auth/tokenService.js";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
            const tokens = await login(credentials);
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

    const handleLogout = async () => {
       await logout();
       setUser(null);
       clearTokens();
       navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loginHandler, logoutHandler: handleLogout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
