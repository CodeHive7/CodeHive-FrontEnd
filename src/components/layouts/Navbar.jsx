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
import { HiTerminal, HiCode } from 'react-icons/hi';

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
        <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg backdrop-blur-sm border-b border-amber-500/30">
            <div className="bg-gray-950/95">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side (Logo) with enhanced styling */}
                        <button
                            className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 rounded-md"
                            onClick={() => navigate("/")}
                        >
                            <div className="relative w-10 h-10 flex items-center justify-center bg-gray-900 border border-gray-800 rounded-md">
                                <HiTerminal className="h-6 w-6 text-amber-500 transition-transform duration-300 group-hover:scale-110" />
                                <div className="absolute -inset-0.5 bg-amber-500/20 rounded-md blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="ml-2">
                                <span className="text-xl font-bold text-white font-mono">Code</span>
                                <span className="text-xl font-bold text-amber-500 font-mono">Hive</span>
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
                                    focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50
                                `}
                                onClick={handleHomeClick}
                            >
                                <Home className="h-5 w-5 text-amber-500 mr-2" />
                                <span className="font-mono">home.view()</span>
                            </button>

                            {/* If user is logged in, show profile dropdown */}
                            {user ? (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        className={`
                                            inline-flex items-center justify-center rounded-md text-sm font-medium
                                            px-4 py-2 transition-all duration-200
                                            ${isProfileOpen ? 'bg-gray-800/70' : 'hover:bg-gray-800/50'}
                                            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50
                                        `}
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    >
                                        <div className="w-8 h-8 bg-gray-900 border border-amber-500/50 rounded-md flex items-center justify-center text-amber-500 font-mono mr-2">
                                            {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <span className="text-white font-mono">{user.username}</span>
                                        <ChevronDown className={`h-4 w-4 text-amber-500 ml-1 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Profile Dropdown Menu with enhanced code editor style */}
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-gray-900 border border-amber-500/20 overflow-hidden z-50 animate-slideDown">
                                            <div className="py-1">
                                                <div className="px-4 py-3 border-b border-amber-500/20 bg-gray-950">
                                                    <p className="text-xs text-amber-500/70 font-mono">// Signed in as</p>
                                                    <p className="text-sm text-white font-mono flex items-center">
                                                        <Code className="h-3 w-3 mr-1 flex-shrink-0 text-amber-500/70" />
                                                        {user.email || user.username}
                                                    </p>
                                                    <p className="text-xs text-amber-400/50 font-mono mt-1">
                                                        .developer
                                                    </p>
                                                </div>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-amber-500/10 flex items-center font-mono"
                                                    onClick={() => navigate('/user/profile')}
                                                >
                                                    <User className="h-4 w-4 text-amber-500 mr-2" />
                                                    user.profile()
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-amber-500/10 flex items-center font-mono"
                                                    onClick={() => navigate('/user/messages')}
                                                >
                                                    <MessageSquare className="h-4 w-4 text-amber-500 mr-2" />
                                                    messages.inbox()
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-amber-500/10 flex items-center font-mono"
                                                    onClick={() => navigate('/user/settings')}
                                                >
                                                    <Settings className="h-4 w-4 text-amber-500 mr-2" />
                                                    user.settings()
                                                </button>
                                                <hr className="border-amber-500/20 my-1" />
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center font-mono"
                                                    onClick={logoutHandler}
                                                >
                                                    <LogOut className="h-4 w-4 mr-2" />
                                                    auth.logout()
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
                                            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50
                                        `}
                                        onClick={() => navigate("/login")}
                                    >
                                        <UserCircle className="h-5 w-5 text-amber-500 mr-2" />
                                        <span className="font-mono">auth.login()</span>
                                    </button>
                                    <button
                                        className={`
                                            inline-flex items-center justify-center rounded-md text-sm font-medium
                                            px-4 py-2 bg-amber-600 hover:bg-amber-700
                                            text-white shadow-md hover:shadow-amber-500/20
                                            transform transition-all duration-200 hover:scale-105 active:scale-95
                                            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50
                                        `}
                                        onClick={() => navigate("/register")}
                                    >
                                        <HiCode className="h-5 w-5 mr-2" />
                                        <span className="font-mono">user.register()</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
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

            {/* Mobile Menu with code editor style */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-950 border-b border-amber-500/20`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <button
                        className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-amber-500/10"
                        onClick={handleHomeClick}
                    >
                        <Home className="h-5 w-5 text-amber-500 mr-2" />
                        <span className="font-mono">home.view()</span>
                    </button>

                    {/* Mobile menu additional options */}
                    {user ? (
                        <>
                            <div className="flex items-center px-3 py-2 text-base font-medium text-gray-300 border-t border-amber-500/10 mt-2 pt-2">
                                <div className="w-8 h-8 bg-gray-900 border border-amber-500/50 rounded-md flex items-center justify-center text-amber-500 font-mono mr-2">
                                    {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                    <span className="font-mono block">{user.username}</span>
                                    <span className="text-xs text-amber-500/70 font-mono flex items-center">
                                        <Code className="h-3 w-3 mr-1 flex-shrink-0" />
                                        .developer
                                    </span>
                                </div>
                            </div>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-amber-500/10"
                                onClick={() => navigate('/user/profile')}
                            >
                                <User className="h-5 w-5 text-amber-500 mr-2" />
                                <span className="font-mono">user.profile()</span>
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-amber-500/10"
                                onClick={() => navigate('/user/messages')}
                            >
                                <MessageSquare className="h-5 w-5 text-amber-500 mr-2" />
                                <span className="font-mono">messages.inbox()</span>
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-amber-500/10"
                                onClick={() => navigate('/user/settings')}
                            >
                                <Settings className="h-5 w-5 text-amber-500 mr-2" />
                                <span className="font-mono">user.settings()</span>
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10 border-t border-amber-500/10 mt-2 pt-2"
                                onClick={logoutHandler}
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                <span className="font-mono">auth.logout()</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:bg-amber-500/10"
                                onClick={() => navigate("/login")}
                            >
                                <UserCircle className="h-5 w-5 text-amber-500 mr-2" />
                                <span className="font-mono">auth.login()</span>
                            </button>
                            <button
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium bg-amber-600 text-white hover:bg-amber-700"
                                onClick={() => navigate("/register")}
                            >
                                <HiCode className="h-5 w-5 mr-2" />
                                <span className="font-mono">user.register()</span>
                            </button>
                        </>
                    )}
                </div>
                
                {/* Code-like decorations */}
                <div className="px-3 py-1.5 text-xs text-amber-500/50 font-mono border-t border-amber-500/20">
                    {`// CodeHive v1.0.3`}
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