import { Bell, Search, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/Auth/AuthContext.jsx";

export default function DashboardHeader({ toggleSidebar }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { logoutHandler } = useAuth();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-yellow-500 bg-[#0A0B14] text-white shadow-md">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    {/* Mobile Sidebar Toggle */}
                    <button className="lg:hidden hover:bg-yellow-500/20 p-2 rounded-md transition" onClick={toggleSidebar}>
                        <Menu className="h-6 w-6 text-yellow-400" />
                    </button>
                    <h1 className="text-xl font-bold text-yellow-400">🐝 Dashboard</h1>
                </div>

                <div className="flex items-center gap-6">
                    {/* Search Input */}
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="search"
                            placeholder="Search..."
                            className="w-64 bg-gray-900 border border-yellow-500 rounded-md pl-10 h-9 text-sm text-white focus:border-yellow-400 focus:ring-0 transition"
                        />
                    </div>
                    <button className="sm:hidden hover:bg-yellow-500/20 p-2 rounded-md transition">
                        <Search className="h-5 w-5 text-yellow-400" />
                    </button>

                    {/* Notifications Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-yellow-500/20 transition"
                        >
                            <Bell className="h-5 w-5 text-yellow-400" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-[#181A28] text-white rounded-md shadow-lg border border-yellow-500 z-50">
                                <div className="p-4 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-yellow-400">Notifications</h3>
                                    <button onClick={toggleDropdown} className="text-gray-400 hover:text-gray-300">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <hr className="border-yellow-500" />
                                <div className="max-h-64 overflow-y-auto space-y-2">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div key={item} className="flex flex-col gap-1 p-3 hover:bg-yellow-500/10 cursor-pointer transition">
                                            <p className="text-sm">User joined a project</p>
                                            <p className="text-xs text-gray-400">2 minutes ago</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logoutHandler}
                        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-yellow-500/20 transition"
                    >
                        <LogOut className="h-5 w-5 text-yellow-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}
