import { Bell, Search, LogOut, Menu, User, X, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function UserDashboardHeader({ toggleSidebar }) {
    const { logoutHandler, user } = useAuth();
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    
    const notificationRef = useRef(null);
    const userMenuRef = useRef(null);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);

    // Handle outside clicks for dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsUserMenuOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchVisible(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle Escape key to close dropdowns and clear search
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                setIsNotificationOpen(false);
                setIsUserMenuOpen(false);
                setIsSearchVisible(false);
                if (document.activeElement === searchInputRef.current) {
                    searchInputRef.current.blur();
                    setSearchQuery("");
                }
            }
        }
        
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user || !user.username) return '?';
        return user.username.charAt(0).toUpperCase();
    };

    const handleLogout = () => {
        setIsUserMenuOpen(false);
        logoutHandler();
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        // Implement search functionality here
        console.log("Searching for:", searchQuery);
        // Clear search after submission
        setSearchQuery("");
        setIsSearchFocused(false);
        setIsSearchVisible(false);
    };

    // Fake notifications for demo
    const notifications = [
        { id: 1, message: "New project added to the Hive!", time: "5 minutes ago", read: false },
        { id: 2, message: "Your application was accepted!", time: "2 hours ago", read: false },
        { id: 3, message: "System maintenance scheduled for tonight", time: "1 day ago", read: true }
    ];

    return (
        <header className="sticky top-0 z-40 border-b border-gray-800 bg-gray-900 text-white shadow-md">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                {/* Left Section: Sidebar Toggle & Dashboard Title */}
                <div className="flex items-center gap-4">
                    <button 
                        className="lg:hidden p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="h-5 w-5 text-amber-500" />
                    </button>
                    <h1 className="text-xl font-bold">
                        <span className="text-white">Dashboard</span>
                    </h1>
                </div>

                {/* Right Section: Search Bar, Notifications, User Menu */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Mobile Search Toggle */}
                    <button 
                        className="sm:hidden relative p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                        aria-label="Toggle search"
                    >
                        <Search className="h-5 w-5 text-amber-500" />
                    </button>

                    {/* Desktop Search */}
                    <form 
                        ref={searchRef}
                        onSubmit={handleSearchSubmit}
                        className={`hidden sm:block relative ${isSearchFocused ? 'w-72' : 'w-48 md:w-64'} transition-all duration-300`}
                    >
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isSearchFocused ? 'text-amber-500' : 'text-gray-500'} transition-colors duration-200`} />
                            <input
                                ref={searchInputRef}
                                type="search"
                                placeholder="Search projects, users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className={`w-full bg-gray-800 border ${isSearchFocused ? 'border-amber-500' : 'border-gray-700'} rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500 transition-all duration-200`}
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                                    aria-label="Clear search"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Mobile Search Expanded */}
                    {isSearchVisible && (
                        <div className="absolute inset-x-0 top-0 bg-gray-900 p-4 sm:hidden z-50 border-b border-gray-800 animate-slideDown">
                            <form
                                onSubmit={(e) => {
                                    handleSearchSubmit(e);
                                    setIsSearchVisible(false);
                                }}
                                className="relative flex items-center"
                            >
                                <Search className="absolute left-3 text-amber-500 h-4 w-4" />
                                <input
                                    autoFocus
                                    type="search"
                                    placeholder="Search projects, users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-md pl-9 pr-9 py-2 text-sm focus:outline-none text-white placeholder-gray-500"
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsSearchVisible(false)}
                                    className="absolute right-3 text-gray-400"
                                    aria-label="Close search"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Notification Bell */}
                    <div className="relative" ref={notificationRef}>
                        <button
                            onClick={() => {
                                setIsNotificationOpen(!isNotificationOpen);
                                setIsUserMenuOpen(false);
                            }}
                            className="relative h-10 w-10 rounded-md flex items-center justify-center hover:bg-gray-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            aria-label="Notifications"
                        >
                            <Bell className="h-5 w-5 text-amber-500" />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-amber-500 ring-1 ring-gray-900" />
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-80 bg-gray-900 text-white rounded-md shadow-lg border border-gray-800 z-50 animate-slideDown overflow-hidden">
                                <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                                    <h3 className="text-sm font-semibold text-white">
                                        <Bell className="h-4 w-4 mr-2 inline text-amber-500" />
                                        Notifications
                                    </h3>
                                    <button className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
                                        Mark all as read
                                    </button>
                                </div>
                                
                                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? (
                                        <div>
                                            {notifications.map(notification => (
                                                <div 
                                                    key={notification.id}
                                                    className={`p-3 border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200 cursor-pointer ${notification.read ? '' : 'bg-gray-800/50'}`}
                                                >
                                                    <div className="flex items-start">
                                                        {!notification.read && (
                                                            <div className="h-2 w-2 mt-1.5 mr-2 rounded-full bg-amber-500 flex-shrink-0"></div>
                                                        )}
                                                        <div className={`flex-grow ${notification.read ? '' : 'pl-1'}`}>
                                                            <p className={`text-sm ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-amber-500/70 mt-1">
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center">
                                            <p className="text-gray-400 text-sm">No notifications</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-2 border-t border-gray-800 text-center">
                                    <button className="text-xs text-amber-500 hover:text-amber-400 flex items-center justify-center w-full py-1.5 transition-colors">
                                        View all notifications
                                        <ExternalLink className="h-3 w-3 ml-1.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative ml-2" ref={userMenuRef}>
                        <button
                            onClick={() => {
                                setIsUserMenuOpen(!isUserMenuOpen);
                                setIsNotificationOpen(false);
                            }}
                            className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-md hover:bg-gray-800 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            aria-label="User menu"
                        >
                            <div className="w-7 h-7 bg-amber-500/20 border border-amber-500/50 rounded-md flex items-center justify-center text-amber-500 text-sm flex-shrink-0">
                                {getUserInitials()}
                            </div>
                            <span className="hidden sm:inline-block text-sm text-gray-300">{user?.username}</span>
                        </button>

                        {/* User Menu Dropdown */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-gray-900 text-white rounded-md shadow-lg border border-gray-800 z-50 animate-slideDown overflow-hidden">
                                <div className="p-4 border-b border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/50 rounded-md flex items-center justify-center text-amber-500 font-bold text-sm">
                                            {getUserInitials()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold truncate max-w-[120px]">{user?.username}</p>
                                            <p className="text-xs text-gray-400">
                                                Developer
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setIsUserMenuOpen(false);
                                            navigate('/user/profile');
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                                    >
                                        <User className="h-4 w-4 text-amber-500 mr-2" />
                                        Profile
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center"
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Log Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Styles */}
            <style>{`
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out forwards;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(245, 158, 11, 0.3);
                    border-radius: 2px;
                }
            `}</style>
        </header>
    );
}