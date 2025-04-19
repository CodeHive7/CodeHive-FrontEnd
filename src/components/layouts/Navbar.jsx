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
  MessageSquare,
  User,
  Code
} from "lucide-react";
import { HiTerminal } from 'react-icons/hi';

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
        <nav className="fixed top-0 left-0 right-0 z-50 shadow-md bg-gray-950 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <button
                        className="flex items-center focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md"
                        onClick={() => navigate("/")}
                    >
                        <div className="bg-gray-900 rounded-md w-8 h-8 flex items-center justify-center border border-gray-800">
                            <HiTerminal className="h-5 w-5 text-amber-500" />
                        </div>
                        <div className="ml-2">
                            <span className="text-xl font-bold text-white">Code</span>
                            <span className="text-xl font-bold text-amber-500">Hive</span>
                        </div>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {/* Home Button */}
                        <button
                            className="px-4 py-2 rounded-md text-white hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            onClick={handleHomeClick}
                        >
                            <Home className="h-5 w-5 text-amber-500 mr-2 inline-block" />
                            <span>Home</span>
                        </button>

                        {/* If user is logged in, show profile dropdown */}
                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    className={`
                                        flex items-center px-4 py-2 rounded-md transition-colors duration-200
                                        ${isProfileOpen ? 'bg-gray-800' : 'hover:bg-gray-800'}
                                        focus:outline-none focus:ring-2 focus:ring-amber-500
                                    `}
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                >
                                    <div className="w-7 h-7 bg-gray-800 border border-amber-500/50 rounded-md flex items-center justify-center text-amber-500 mr-2">
                                        {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <span className="text-white">{user.username}</span>
                                    <ChevronDown className={`h-4 w-4 text-amber-500 ml-2 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-900 border border-gray-800 overflow-hidden z-50 animate-slideDown">
                                        <div className="py-1">
                                            <div className="px-4 py-3 border-b border-gray-800 bg-gray-950">
                                                <p className="text-xs text-gray-500">Signed in as</p>
                                                <p className="text-sm text-white">
                                                    {user.email || user.username}
                                                </p>
                                                <p className="text-xs text-amber-500 mt-1">
                                                    Developer
                                                </p>
                                            </div>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                                                onClick={() => navigate('/user/profile')}
                                            >
                                                <User className="h-4 w-4 text-amber-500 mr-2" />
                                                Profile
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                                                onClick={() => navigate('/user/messages')}
                                            >
                                                <MessageSquare className="h-4 w-4 text-amber-500 mr-2" />
                                                Messages
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 flex items-center"
                                                onClick={() => navigate('/user/settings')}
                                            >
                                                <Settings className="h-4 w-4 text-amber-500 mr-2" />
                                                Settings
                                            </button>
                                            <hr className="border-gray-800 my-1" />
                                            <button
                                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center"
                                                onClick={logoutHandler}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* If no user, show Login & Register buttons */
                            <div className="flex items-center space-x-3">
                                <button
                                    className="px-4 py-2 rounded-md text-white hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    onClick={() => navigate("/login")}
                                >
                                    <UserCircle className="h-5 w-5 text-amber-500 mr-2 inline-block" />
                                    <span>Login</span>
                                </button>
                                <button
                                    className="px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    onClick={() => navigate("/register")}
                                >
                                    <UserPlus className="h-5 w-5 mr-2 inline-block" />
                                    <span>Register</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                            {isMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-900 border-b border-gray-800`}>
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <button
                        className="w-full flex items-center px-3 py-2 rounded-md text-white hover:bg-gray-800"
                        onClick={handleHomeClick}
                    >
                        <Home className="h-5 w-5 text-amber-500 mr-2" />
                        <span>Home</span>
                    </button>

                    {/* Mobile menu additional options */}
                    {user ? (
                        <>
                            <div className="flex items-center px-3 py-2 text-gray-300 border-t border-gray-800 mt-2 pt-2">
                                <div className="w-8 h-8 bg-gray-800 border border-amber-500/50 rounded-md flex items-center justify-center text-amber-500 mr-2">
                                    {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                    <span className="block">{user.username}</span>
                                    <span className="text-xs text-amber-500">
                                        Developer
                                    </span>
                                </div>
                            </div>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-white hover:bg-gray-800"
                                onClick={() => navigate('/user/profile')}
                            >
                                <User className="h-5 w-5 text-amber-500 mr-2" />
                                <span>Profile</span>
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-white hover:bg-gray-800"
                                onClick={() => navigate('/user/messages')}
                            >
                                <MessageSquare className="h-5 w-5 text-amber-500 mr-2" />
                                <span>Messages</span>
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-white hover:bg-gray-800"
                                onClick={() => navigate('/user/settings')}
                            >
                                <Settings className="h-5 w-5 text-amber-500 mr-2" />
                                <span>Settings</span>
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-red-400 hover:bg-gray-800 border-t border-gray-800 mt-2 pt-2"
                                onClick={logoutHandler}
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                <span>Log out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-white hover:bg-gray-800"
                                onClick={() => navigate("/login")}
                            >
                                <UserCircle className="h-5 w-5 text-amber-500 mr-2" />
                                <span>Login</span>
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md bg-amber-600 text-white hover:bg-amber-700"
                                onClick={() => navigate("/register")}
                            >
                                <UserPlus className="h-5 w-5 mr-2" />
                                <span>Register</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Simple animation style */}
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