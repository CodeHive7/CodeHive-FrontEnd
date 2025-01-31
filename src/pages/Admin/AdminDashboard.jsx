import { useAuth } from "../../context/Auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const { user, logoutHandler } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0A0B14] text-white">
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex-shrink-0">
                            <button className="flex items-center" onClick={() => navigate("/")}>
                                <svg className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                                </svg>
                                <span className="ml-2 text-xl font-bold">Admin Dashboard</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-white">Welcome, {user.username} (Admin)</span>
                            <button className="bg-red-600 px-4 py-2 rounded-md" onClick={logoutHandler}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-24">
                <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button className="bg-[#12141F] p-6 rounded-lg w-full text-center" onClick={() => navigate("/admin/users")}>
                        Manage Users
                    </button>
                    <button className="bg-[#12141F] p-6 rounded-lg w-full text-center" onClick={() => navigate("/admin/roles")}>
                        Manage Roles
                    </button>
                    <button className="bg-[#12141F] p-6 rounded-lg w-full text-center" onClick={() => navigate("/admin/projects")}>
                        Manage Projects
                    </button>
                </div>
            </div>
        </div>
    );
}
