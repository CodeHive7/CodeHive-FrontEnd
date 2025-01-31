import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
    const navigate = useNavigate();
    const { user, logoutHandler } = useAuth();

    return (
        <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#0A0B14] text-white">
            <div className="flex h-16 items-center justify-between px-6">
                <h1 className="text-xl font-semibold">Dashboard</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="search"
                            placeholder="Search..."
                            className="w-64 bg-gray-900 border-gray-800 rounded-md pl-8 h-9 text-sm focus:border-purple-600 focus:ring-0"
                        />
                    </div>
                    <button className="relative h-9 w-9 rounded-full bg-transparent" onClick={() => navigate("/admin/notifications")}>
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-600" />
                    </button>
                    <button className="bg-red-600 px-4 py-2 rounded-md" onClick={logoutHandler}>
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
