import { Bell, Search, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import { HiTerminal, HiCode } from 'react-icons/hi';
import { BiCodeAlt } from 'react-icons/bi';

export default function DashboardHeader({ toggleSidebar }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { logoutHandler } = useAuth();

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-amber-500/30 bg-gray-950 text-white shadow-md">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    {/* Mobile Sidebar Toggle */}
                    <button className="lg:hidden hover:bg-amber-500/10 p-2 rounded-md transition" onClick={toggleSidebar}>
                        <Menu className="h-6 w-6 text-amber-500" />
                    </button>
                    
                    <div className="flex items-center">
                        <HiTerminal className="text-amber-500 w-6 h-6" />
                        <h1 className="ml-2 text-xl font-bold">
                            <span className="font-mono text-green-400">console</span>.
                            <span className="text-amber-500">dashboard</span>()
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* Search Input */}
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="search"
                            placeholder="search.query()"
                            className="w-64 bg-gray-900 border border-gray-700 rounded-md pl-10 h-9 text-sm text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition font-mono"
                        />
                    </div>
                    <button className="sm:hidden hover:bg-amber-500/10 p-2 rounded-md transition">
                        <Search className="h-5 w-5 text-amber-500" />
                    </button>

                    {/* Notifications Dropdown */}
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-amber-500/10 transition"
                        >
                            <Bell className="h-5 w-5 text-amber-500" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-gray-900 text-white rounded-md shadow-lg border border-gray-700 z-50 overflow-hidden">
                                <div className="p-4 flex justify-between items-center bg-gray-950">
                                    <h3 className="text-sm font-semibold font-mono">
                                        <span className="text-blue-400">new</span> 
                                        <span className="text-amber-500">Notifications</span>()
                                    </h3>
                                    <button onClick={toggleDropdown} className="text-gray-400 hover:text-gray-300">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="max-h-64 overflow-y-auto space-y-0 divide-y divide-gray-800">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div key={item} className="flex items-start p-3 hover:bg-gray-800 cursor-pointer transition">
                                            <div className="mt-1 mr-3">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-mono">
                                                    <span className="text-green-400">user</span>.
                                                    <span className="text-amber-500">joinedProject</span>('{item}')
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">2 minutes ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-2 bg-gray-950 border-t border-gray-800 flex justify-end">
                                    <button className="text-xs text-amber-500 hover:text-amber-400 font-mono">
                                        markAllAsRead()
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logoutHandler}
                        className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-amber-500/10 transition group"
                        title="Log Out"
                    >
                        <LogOut className="h-5 w-5 text-amber-500 group-hover:text-amber-400" />
                    </button>
                </div>
            </div>
        </header>
    );
}