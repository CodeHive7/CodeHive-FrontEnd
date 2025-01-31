import {Navigate} from "react-router-dom";
import {useAuth} from "../../context/Auth/AuthContext.jsx";

const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if(!user || !user.roles.includes("SUPER_ADMIN")) {
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedAdminRoute;