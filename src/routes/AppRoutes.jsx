import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Register from "../pages/Auth/Register.jsx";
import Login from "../pages/Auth/Login.jsx";
import AdminDashboard from "../pages/Admin/AdminDashboard.jsx";
import ProtectedAdminRoute from "./adminRoutes/ProtectedAdminRoute.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
                <ProtectedAdminRoute>
                    <AdminDashboard/>
                </ProtectedAdminRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;
