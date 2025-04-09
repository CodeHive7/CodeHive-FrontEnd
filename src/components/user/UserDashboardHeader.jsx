import { Bell, Search, LogOut, Menu, User, X, ExternalLink, Code } from "lucide-react";
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
        <header className="sticky top-0 z-40 border-b border-amber-500/30 bg-gray-950 text-white shadow-md">
            <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
                {/* Left Section: Sidebar Toggle & Dashboard Title */}
                <div className="flex items-center gap-2 sm:gap-4">
                    <button 
                        className="lg:hidden p-1.5 sm:p-2 rounded-md transition-all duration-200 hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50" 
                        onClick={toggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="h-5 w-5 text-amber-400" />
                    </button>
                    <h1 className="text-base sm:text-xl font-bold whitespace-nowrap font-mono">
                        <span className="text-white">console.</span>
                        <span className="text-amber-400">log</span>
                        <span className="text-white">(</span>
                        <span className="text-green-400">"Dashboard"</span>
                        <span className="text-white">);</span>
                    </h1>
                </div>

                {/* Right Section: Search Bar, Notifications, User Menu, Logout */}
                <div className="flex items-center gap-1 sm:gap-3">
                    {/* Mobile Search Toggle */}
                    <button 
                        className="sm:hidden relative p-1.5 rounded-md hover:bg-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        onClick={() => setIsSearchVisible(!isSearchVisible)}
                        aria-label="Toggle search"
                    >
                        <Search className="h-5 w-5 text-amber-400" />
                    </button>

                    {/* Desktop Search */}
                    <form 
                        ref={searchRef}
                        onSubmit={handleSearchSubmit}
                        className={`hidden sm:block relative ${isSearchFocused ? 'w-72' : 'w-48 md:w-64'} transition-all duration-300`}
                    >
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isSearchFocused ? 'text-amber-400' : 'text-gray-500'} transition-colors duration-200`} />
                            <input
                                ref={searchInputRef}
                                type="search"
                                placeholder="search.query('...')"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchFocused(true)}
                                onBlur={() => setIsSearchFocused(false)}
                                className={`w-full bg-gray-900/80 border ${isSearchFocused ? 'border-amber-500' : 'border-gray-700'} rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 text-white placeholder-gray-500 transition-all duration-200 font-mono`}
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
                        <div className="absolute inset-x-0 top-0 bg-gray-950 p-3 sm:hidden z-50 animate-slideDown border-b border-amber-500/20">
                            <form
                                onSubmit={(e) => {
                                    handleSearchSubmit(e);
                                    setIsSearchVisible(false);
                                }}
                                className="relative flex items-center"
                            >
                                <Search className="absolute left-3 text-amber-400 h-4 w-4" />
                                <input
                                    autoFocus
                                    type="search"
                                    placeholder="search.query('...')"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-gray-900/80 border border-amber-500 rounded-md pl-9 pr-9 py-2 text-sm focus:outline-none text-white placeholder-gray-500 font-mono"
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
                            className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-md flex items-center justify-center hover:bg-amber-500/10 active:bg-amber-500/20 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            aria-label="Notifications"
                        >
                            <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                            {notifications.some(n => !n.read) && (
                                <span className="absolute top-1 right-1.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-sm bg-amber-500 ring-1 ring-gray-950" />
                            )}
                        </button>

                        {/* Enhanced Notification Dropdown */}
                        {isNotificationOpen && (
                            <div className="absolute right-0 mt-2 w-64 sm:w-80 bg-gray-900 text-white rounded-md shadow-xl border border-amber-500/20 z-50 animate-slideDown overflow-hidden">
                                <div className="p-3 border-b border-amber-500/20 flex justify-between items-center bg-gray-950">
                                    <h3 className="text-sm font-semibold text-amber-400 flex items-center font-mono">
                                        <Bell className="h-4 w-4 mr-2" />
                                        notifications.list()
                                    </h3>
                                    <button className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors duration-200 font-mono">
                                        .markAllRead()
                                    </button>
                                </div>
                                
                                <div className="max-h-60 sm:max-h-72 overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? (
                                        <div>
                                            {notifications.map(notification => (
                                                <div 
                                                    key={notification.id}
                                                    className={`p-3 border-b border-amber-500/10 hover:bg-amber-500/5 transition-colors duration-200 cursor-pointer ${notification.read ? '' : 'bg-amber-500/10'}`}
                                                >
                                                    <div className="flex items-start">
                                                        {!notification.read && (
                                                            <div className="h-2 w-2 mt-1.5 mr-2 rounded-sm bg-amber-500 flex-shrink-0"></div>
                                                        )}
                                                        <div className={`flex-grow ${notification.read ? '' : 'pl-1'}`}>
                                                            <p className={`text-xs sm:text-sm font-mono ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-amber-500/70 mt-1 font-mono">
                                                                {notification.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center">
                                            <p className="text-gray-400 text-sm font-mono">notifications.length === 0</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-2 border-t border-amber-500/20 bg-gray-950 text-center">
                                    <button className="text-xs text-amber-400 hover:text-amber-300 flex items-center justify-center w-full py-1.5 transition-colors duration-200 font-mono">
                                        notifications.viewAll()
                                        <ExternalLink className="h-3 w-3 ml-1.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative ml-1" ref={userMenuRef}>
                        <button
                            onClick={() => {
                                setIsUserMenuOpen(!isUserMenuOpen);
                                setIsNotificationOpen(false);
                            }}
                            className="flex items-center gap-2 pl-1.5 pr-1.5 sm:pl-2 sm:pr-3 py-1 sm:py-1.5 rounded-md hover:bg-amber-500/10 active:bg-amber-500/20 transition duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                            aria-label="User menu"
                        >
                            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-gray-800 border border-amber-500/50 rounded-md flex items-center justify-center text-amber-500 font-mono text-xs sm:text-sm flex-shrink-0">
                                {getUserInitials()}
                            </div>
                            <span className="hidden sm:inline-block text-sm text-gray-300 font-mono">{user?.username}</span>
                        </button>

                        {/* User Menu Dropdown */}
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 w-44 sm:w-56 bg-gray-900 text-white rounded-md shadow-xl border border-amber-500/20 z-50 animate-slideDown overflow-hidden">
                                <div className="p-3 border-b border-amber-500/20 bg-gray-950">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 border border-amber-500/50 rounded-md flex items-center justify-center text-amber-500 font-bold text-xs sm:text-sm font-mono">
                                            {getUserInitials()}
                                        </div>
                                        <div>
                                            <p className="text-xs sm:text-sm font-semibold truncate max-w-[120px] font-mono">{user?.username}</p>
                                            <p className="text-xs text-amber-400/70 flex items-center truncate font-mono">
                                                <Code className="h-3 w-3 mr-1 flex-shrink-0" />
                                                .developer
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
                                        className="w-full text-left px-4 py-2 text-xs sm:text-sm text-gray-300 hover:bg-amber-500/10 flex items-center font-mono"
                                    >
                                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 mr-2" />
                                        user.viewProfile()
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-400 hover:bg-red-500/10 flex items-center font-mono"
                                    >
                                        <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                                        auth.logout()
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