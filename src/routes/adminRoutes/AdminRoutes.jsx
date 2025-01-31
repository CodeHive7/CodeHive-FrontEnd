import { Routes, Route } from "react-router-dom";
import AdminLayout from "../../components/layouts/admin/AdminLayout.jsx";
import DashboardPage from "../../pages/Admin/DashboardPage.jsx";
import UsersPage from "../../pages/Admin/UsersPage.jsx";
import ProtectedAdminRoute from "./ProtectedAdminRoute.jsx";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route
                path="/admin"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <DashboardPage />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <UsersPage />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />
        </Routes>
    );
};

export default AdminRoutes;
