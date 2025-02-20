import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";

const ProtectedUserRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;

    if (!user || !user.roles.includes("USER")) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedUserRoute;
