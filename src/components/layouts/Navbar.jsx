import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import { 
  Home, 
  LogOut, 
  UserCircle, 
  UserPlus, 
  Menu, 
  X, 
  ChevronDown,
  Settings,
  Bell,
  MessageSquare,
  User
} from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logoutHandler } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Close profile dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Handler for Home navigation
    const handleHomeClick = () => {
        if (!user) {
            navigate("/");
            return;
        }
        if (user.roles.includes("SUPER_ADMIN") || user.roles.includes("ADMIN")) {
            navigate("/admin");
        } else {
            navigate("/userHome");
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg backdrop-blur-sm border-b border-yellow-500/30">
            <div className="bg-gradient-to-r from-[#0A0B14]/95 to-[#121524]/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side (Logo) with enhanced styling */}
                        <button
                            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50 rounded-md"
                            onClick={() => navigate("/")}
                        >
                            <div className="relative">
                                <img 
                                    src="/images/beelogo.png" 
                                    alt="CodeHive Logo" 
                                    className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute -inset-0.5 bg-yellow-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="ml-2">
                                <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Code</span>
                                <span className="text-xl font-bold text-white">Hive</span>
                            </div>
                        </button>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-4">
                            {/* Home Icon */}
                            <button
                                className={`
                                    inline-flex items-center justify-center rounded-md text-sm font-medium
                                    px-4 py-2 transition-all duration-200
                                    text-white hover:bg-gray-800/50
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50
                                `}
                                onClick={handleHomeClick}
                            >
                                <Home className="h-5 w-5 text-yellow-400 mr-2" />
                                <span>Home</span>
                            </button>

                            {/* If user is logged in, show profile dropdown */}
                            {user ? (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        className={`
                                            inline-flex items-center justify-center rounded-md text-sm font-medium
                                            px-4 py-2 transition-all duration-200
                                            ${isProfileOpen ? 'bg-gray-800/70' : 'hover:bg-gray-800/50'}
                                            focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50
                                        `}
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-2">
                                            {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <span className="text-white">{user.username}</span>
                                        <ChevronDown className={`h-4 w-4 text-gray-400 ml-1 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#181A28] border border-gray-800 overflow-hidden z-50 animate-slideDown">
                                            <div className="py-1">
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                                                    onClick={() => navigate('/user/profile')}
                                                >
                                                    <User className="h-4 w-4 text-yellow-400 mr-2" />
                                                    My Profile
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                                                    onClick={() => navigate('/user/messages')}
                                                >
                                                    <MessageSquare className="h-4 w-4 text-yellow-400 mr-2" />
                                                    Messages
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                                                    onClick={() => navigate('/user/settings')}
                                                >
                                                    <Settings className="h-4 w-4 text-yellow-400 mr-2" />
                                                    Settings
                                                </button>
                                                <hr className="border-gray-800 my-1" />
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center"
                                                    onClick={logoutHandler}
                                                >
                                                    <LogOut className="h-4 w-4 mr-2" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* If no user, show Login & Register buttons */
                                <div className="flex items-center space-x-4">
                                    <button
                                        className={`
                                            inline-flex items-center justify-center rounded-md text-sm font-medium
                                            px-4 py-2 transition-all duration-200
                                            text-white hover:bg-gray-800/50
                                            focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50
                                        `}
                                        onClick={() => navigate("/login")}
                                    >
                                        <UserCircle className="h-5 w-5 text-blue-400 mr-2" />
                                        <span>Login</span>
                                    </button>
                                    <button
                                        className={`
                                            inline-flex items-center justify-center rounded-md text-sm font-medium
                                            px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-600 hover:to-yellow-500
                                            text-black shadow-md hover:shadow-yellow-500/20
                                            transform transition-all duration-200 hover:scale-105 active:scale-95
                                            focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500/50
                                        `}
                                        onClick={() => navigate("/register")}
                                    >
                                        <UserPlus className="h-5 w-5 mr-2" />
                                        <span>Get Started</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                                {isMenuOpen ? (
                                    <X className="block h-6 w-6" aria-hidden="true" />
                                ) : (
                                    <Menu className="block h-6 w-6" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-[#0A0B14] border-b border-gray-800`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <button
                        className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                        onClick={handleHomeClick}
                    >
                        <Home className="h-5 w-5 text-yellow-400 mr-2" />
                        Home
                    </button>

                    {/* Mobile menu additional options */}
                    {user ? (
                        <>
                            <div className="flex items-center px-3 py-2 text-base font-medium text-gray-300">
                                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold mr-2">
                                    {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                </div>
                                <span>{user.username}</span>
                            </div>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                                onClick={() => navigate('/user/profile')}
                            >
                                <User className="h-5 w-5 text-yellow-400 mr-2" />
                                My Profile
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                                onClick={() => navigate('/user/messages')}
                            >
                                <MessageSquare className="h-5 w-5 text-yellow-400 mr-2" />
                                Messages
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                                onClick={() => navigate('/user/settings')}
                            >
                                <Settings className="h-5 w-5 text-yellow-400 mr-2" />
                                Settings
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-gray-800"
                                onClick={logoutHandler}
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800"
                                onClick={() => navigate("/login")}
                            >
                                <UserCircle className="h-5 w-5 text-blue-400 mr-2" />
                                Login
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium bg-yellow-500 text-black hover:bg-yellow-600"
                                onClick={() => navigate("/register")}
                            >
                                <UserPlus className="h-5 w-5 mr-2" />
                                Get Started
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Animation styles */}
            <style>{`
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
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out forwards;
                }
            `}</style>
        </nav>
    );
}