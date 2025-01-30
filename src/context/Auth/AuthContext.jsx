import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, refreshToken, logout } from "../../services/Auth/authService.js";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                try {
                    const decodedToken = jwtDecode(accessToken);
                    setUser({ username: decodedToken.username || decodedToken.sub });

                    const isValid = await refreshToken();
                    if (!isValid) {
                        handleLogout();
                    }
                } catch (error) {
                    console.error("Error decoding token", error);
                    handleLogout();
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const loginHandler = async (credentials) => {
        try {
            const tokens = await login(credentials);
            localStorage.setItem("accessToken", tokens.accessToken);
            localStorage.setItem("refreshToken", tokens.refreshToken);

            // **Fix:** Update `user` state immediately
            const decodedUser = jwtDecode(tokens.accessToken);
            setUser({ username: decodedUser.username || decodedUser.sub });

            navigate("/");
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed", error);
        }
        setUser(null);
        localStorage.clear();
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loginHandler, logoutHandler: handleLogout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
