import { Bell,Search,LogOut,Menu } from "lucide-react";
import { useState } from "react";
import {useAuth} from "../../context/Auth/AuthContext.jsx";

export default function UserDashboardHeader({ toggleSidebar }) {
    const { logoutHandler } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <header className="sticky top-0 z-40 border-b border-gray-800 bg-[#0A0B14] text-white">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <button className="lg:hidden hover:bg-gray-800 p-2 rounded-md" onClick={toggleSidebar}>
                        <Menu className="h-6 w-6 text-white" />
                    </button>
                    <h1 className="text-xl font-semibold">User Dashboard</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="search"
                            placeholder="Search..."
                            className="w-64 bg-gray-900 border-gray-800 rounded-md pl-8 h-9 text-sm focus:border-purple-600 focus:ring-0"
                        />
                    </div>
                    <button className="sm:hidden hover:bg-gray-800 p-2 rounded-md">
                        <Search className="h-5 w-5 text-white" />
                    </button>

                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="relative h-9 w-9 rounded-full bg-transparent flex items-center justify-center hover:bg-gray-700"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-600" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-md shadow-lg z-50">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold">Notifications</h3>
                                    <hr className="my-2" />
                                    <p className="text-sm">New message received</p>
                                    <p className="text-xs text-gray-500">5 minutes ago</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={logoutHandler}
                        className="h-9 w-9 rounded-full bg-transparent flex items-center justify-center hover:bg-gray-700"
                    >
                        <LogOut className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
