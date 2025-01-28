import {createContext, useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { login , refreshToken, logout} from "../../services/Auth/authService.js";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem("accessToken");
            if(token) {
                const isValid = await refreshToken(token);
                if(isValid) {
                    setUser({ username: "example" });
                } else {
                    localStorage.removeItem("accessToken");
                }
            }
            setLoading(false);
        };
        initializeAuth();
    }, []);

    const loginHandler = async (credentials) => {
        const tokens = await login(credentials);
        localStorage.setItem("accessToken", tokens.accessToken);
        localStorage.setItem("refreshToken", tokens.refreshToken);
        setUser({ username: credentials.username });
        navigate("/dashboard");
    };

    const logoutHandler = async () => {
        await logout();
        setUser(null);
        localStorage.clear();
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loginHandler, logoutHandler ,loading }}>
        {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);