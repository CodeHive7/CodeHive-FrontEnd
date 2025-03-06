import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import { Home, LogOut, UserCircle, UserPlus } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logoutHandler } = useAuth();

    const buttonBaseStyles =
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400 disabled:pointer-events-none disabled:opacity-50";
    const buttonVariants = {
        default: "bg-yellow-500 text-black hover:bg-yellow-600 shadow-md",
        ghost: "text-white hover:bg-gray-800",
    };
    const buttonSizes = {
        default: "h-10 px-4 py-2",
    };

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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0B14] shadow-lg border-b border-yellow-500">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side (Logo) */}
                    <button
                        className="flex items-center"
                        onClick={() => navigate("/")}
                    >
                        <img src="/images/beelogo.png" alt="BeeHive Logo" className="h-8 w-8" />
                        <span className="ml-2 text-xl font-bold text-yellow-400">CodeHive</span>
                    </button>

                    {/* Right side (Navigation buttons) */}
                    <div className="flex items-center space-x-4">
                        {/* Home Icon */}
                        <button
                            className={`${buttonBaseStyles} ${buttonVariants.ghost} ${buttonSizes.default}`}
                            onClick={handleHomeClick}
                        >
                            <Home className="h-5 w-5 text-yellow-400" />
                            <span className="ml-2">Home</span>
                        </button>

                        {/* If user is logged in, show profile & logout */}
                        {user ? (
                            <>
                                <span className="text-white">Welcome, {user.username}!</span>
                                <button
                                    className={`${buttonBaseStyles} ${buttonVariants.ghost} ${buttonSizes.default}`}
                                    onClick={logoutHandler}
                                >
                                    <LogOut className="h-5 w-5 text-red-400" />
                                    <span className="ml-2">Logout</span>
                                </button>
                            </>
                        ) : (
                            /* If no user, show Login & Register buttons */
                            <>
                                <button
                                    className={`${buttonBaseStyles} ${buttonVariants.ghost} ${buttonSizes.default}`}
                                    onClick={() => navigate("/login")}
                                >
                                    <UserCircle className="h-5 w-5 text-blue-400" />
                                    <span className="ml-2">Login</span>
                                </button>
                                <button
                                    className={`${buttonBaseStyles} ${buttonVariants.default} ${buttonSizes.default}`}
                                    onClick={() => navigate("/register")}
                                >
                                    <UserPlus className="h-5 w-5" />
                                    <span className="ml-2">Get Started</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
