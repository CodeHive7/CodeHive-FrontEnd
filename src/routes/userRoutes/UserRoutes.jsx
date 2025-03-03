import { Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "../../components/layouts/user/UserLayout.jsx";
import ProfilePage from "../../pages/User/dashboard/ProfilePage.jsx";
import MyProjectsPage from "../../pages/User/dashboard/MyProjectsPage.jsx";
import AppliedProjectsPage from "../../pages/User/dashboard/AppliedProjectsPage.jsx";
import ProjectApplicantsPage from "../../pages/User/dashboard/ProjectApplicantsPage.jsx";
import ProtectedUserRoute from "./ProtectedUserRoute.jsx";
import ViewUserProfilePage from "../../pages/User/ViewUserProfile/ViewUserProfilePage.jsx";
import CreateTaskPage from "../../pages/User/tasks/CreateTaskPage.jsx";
import AssignedTasksPage from "../../pages/User/tasks/AssignedTasksPage.jsx";

const UserRoutes = () => {
    return (
        <Routes>
            {/* Redirect /user to /user/profile */}
            <Route path="/" element={<Navigate to="/user/profile" replace />} />

            <Route
                path="/profile"
                element={
                    <ProtectedUserRoute>
                        <UserLayout>
                            <ProfilePage />
                        </UserLayout>
                    </ProtectedUserRoute>
                }
            />
            <Route
                path="/my-projects"
                element={
                    <ProtectedUserRoute>
                        <UserLayout>
                            <MyProjectsPage />
                        </UserLayout>
                    </ProtectedUserRoute>
                }
            />
            <Route
                path="/applied-projects"
                element={
                    <ProtectedUserRoute>
                        <UserLayout>
                            <AppliedProjectsPage />
                        </UserLayout>
                    </ProtectedUserRoute>
                }
            />
            <Route
                path="/project-applicants"
                element={
                    <ProtectedUserRoute>
                        <UserLayout>
                            <ProjectApplicantsPage />
                        </UserLayout>
                    </ProtectedUserRoute>
                }
            />
            <Route
                path="/profile/view/:username"
                element={
                <UserLayout>
                    <ViewUserProfilePage />
                </UserLayout>}
            />
            <Route
                path="/create-task"
                element={
                <ProtectedUserRoute>
                    <UserLayout>
                        <CreateTaskPage />
                    </UserLayout>
                </ProtectedUserRoute>
                }
            />
            <Route
                path="/assigned-tasks"
                element={
                    <ProtectedUserRoute>
                        <UserLayout>
                            <AssignedTasksPage />
                        </UserLayout>
                    </ProtectedUserRoute>
                }
            />
        </Routes>
    );
};

export default UserRoutes;
