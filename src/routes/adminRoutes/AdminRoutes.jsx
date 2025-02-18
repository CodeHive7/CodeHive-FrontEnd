import {Routes, Route, Outlet} from "react-router-dom";
import AdminLayout from "../../components/layouts/admin/AdminLayout.jsx";
import DashboardPage from "../../pages/Admin/DashboardPage.jsx";
import UsersPage from "../../pages/Admin/UsersPage.jsx";
import SettingsPage from "../../pages/Admin/SettingsPage.jsx";
import ProtectedAdminRoute from "./ProtectedAdminRoute.jsx";
import NotificationsPage from "../../pages/Admin/NotificationsPage.jsx";
import ProjectsPage from "../../pages/Admin/ProjectsPage.jsx";
import AnalyticsPage from "../../pages/Admin/AnalysticsPage.jsx";
import RolePermissionsPage from "../../pages/Admin/RolePermissionsPage.jsx";
import CategoryManagementPage from "../../pages/Admin/CategoryManagementPage.jsx";
import AcceptedProjectsPage from "../../pages/Admin/AcceptedProjectsPage.jsx";
import RejectedProjectsPage from "../../pages/Admin/RejectedProjectsPage.jsx";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <DashboardPage />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <UsersPage />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />
            <Route
                path="/permissions"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <RolePermissionsPage />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />
            <Route
                path="/categories"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <CategoryManagementPage />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <SettingsPage/>
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />
            <Route
                path="/notifications"
                element={
                <ProtectedAdminRoute>
                    <AdminLayout>
                        <NotificationsPage/>
                    </AdminLayout>
                </ProtectedAdminRoute>
                }
            />
            <Route
                path="/projects"
                element={
                <ProtectedAdminRoute>
                    <AdminLayout>
                        <Outlet />
                    </AdminLayout>
                </ProtectedAdminRoute>
            }
            >
                <Route index element={<ProjectsPage />} /> {/* Default to Pending Projects */}
                <Route path="accepted" element={<AcceptedProjectsPage />} /> {/* Accepted Projects */}
                <Route path="rejected" element={<RejectedProjectsPage />} /> {/* Rejected Projects */}
            </Route>
            <Route
                path="analytics"
                element={
                    <ProtectedAdminRoute>
                        <AdminLayout>
                            <AnalyticsPage />
                        </AdminLayout>
                    </ProtectedAdminRoute>
                }
            />
        </Routes>
    );
};

export default AdminRoutes;
