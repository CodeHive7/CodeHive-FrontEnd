import { Bell, Search, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/Auth/AuthContext.jsx";

export default function UserDashboardHeader({ toggleSidebar }) {
    const { logoutHandler } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <header className="sticky top-0 z-50 border-b border-yellow-500 bg-[#0A0B14] text-white shadow-md">
            <div className="flex h-16 items-center justify-between px-6">
                {/* Left Section: Sidebar Toggle & Dashboard Title */}
                <div className="flex items-center gap-4">
                    <button className="lg:hidden hover:bg-yellow-500/20 p-2 rounded-md" onClick={toggleSidebar}>
                        <Menu className="h-6 w-6 text-yellow-400" />
                    </button>
                    <h1 className="text-xl font-bold text-yellow-400">🐝 Hive Dashboard</h1>
                </div>

                {/* Right Section: Search Bar, Notifications, Logout */}
                <div className="flex items-center gap-4">
                    {/* 🔍 Search Bar (Desktop) */}
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-yellow-500" />
                        <input
                            type="search"
                            placeholder="Search the Hive..."
                            className="w-64 bg-gray-900 border border-yellow-500 rounded-md pl-8 h-9 text-sm focus:border-yellow-600 focus:ring-0 text-white placeholder-yellow-400"
                        />
                    </div>

                    {/* 🔍 Search Button (Mobile) */}
                    <button className="sm:hidden hover:bg-yellow-500/20 p-2 rounded-md">
                        <Search className="h-5 w-5 text-yellow-400" />
                    </button>

                    {/* 🔔 Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="relative h-9 w-9 rounded-full bg-transparent flex items-center justify-center hover:bg-yellow-500/20 transition duration-300"
                        >
                            <Bell className="h-5 w-5 text-yellow-400" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                        </button>

                        {/* Notification Dropdown */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-gray-900 text-white rounded-md shadow-lg border border-yellow-500 z-50">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-yellow-400">Notifications</h3>
                                    <hr className="my-2 border-yellow-500" />
                                    <p className="text-sm">📢 New project added to the Hive!</p>
                                    <p className="text-xs text-yellow-400">5 minutes ago</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 🚪 Logout Button */}
                    <button
                        onClick={logoutHandler}
                        className="h-9 w-9 rounded-full bg-transparent flex items-center justify-center hover:bg-yellow-500/20 transition duration-300"
                    >
                        <LogOut className="h-5 w-5 text-yellow-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}
