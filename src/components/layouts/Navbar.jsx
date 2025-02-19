import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logoutHandler } = useAuth();

    const buttonBaseStyles =
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    const buttonVariants = {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };
    const buttonSizes = {
        default: "h-9 px-4 py-2",
    };

    // Handler for the new Home icon (conditional navigation)
    const handleHomeClick = () => {
        if (!user) {
            navigate("/");
            return
        }
        if (user.roles.includes("SUPER_ADMIN")  || user.roles.includes("ADMIN")) {
            navigate("/admin");
        } else {
            navigate("/userHome");
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side (Logo) */}
                    <div className="flex-shrink-0">
                        <button
                            className="flex items-center"
                            onClick={() => navigate("/")}
                        >
                            <svg
                                className="h-8 w-8 text-purple-600"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span className="ml-2 text-xl font-bold">CodeHive</span>
                        </button>
                    </div>

                    {/* Right side (navigation buttons) */}
                    <div className="flex items-center space-x-4">

                        {/* Home icon to route to userHome or admin dashboard */}
                        <button
                            className={`
                ${buttonBaseStyles} 
                ${buttonVariants.ghost} 
                ${buttonSizes.default}
              `}
                            onClick={handleHomeClick}
                        >
                            {/* You can replace this with any icon you want */}
                            <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 9.75l7.5-6 7.5 6M4.5 9.75v9a1.5 1.5 0 001.5 1.5h3m9-10.5v10.5a1.5 1.5 0 01-1.5 1.5h-3m-9 0h9"
                                />
                            </svg>
                            <span className="ml-2">Home</span>
                        </button>

                        {/* If user is logged in, show welcome & logout */}
                        {user ? (
                            <>
                                <span className="text-white">Welcome, {user.username}!</span>
                                <button
                                    className={`
                    ${buttonBaseStyles} 
                    ${buttonVariants.ghost} 
                    ${buttonSizes.default}
                  `}
                                    onClick={logoutHandler}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            /* If no user, show Login & Get Started buttons */
                            <>
                                <button
                                    className={`
                    ${buttonBaseStyles} 
                    ${buttonVariants.ghost} 
                    ${buttonSizes.default}
                  `}
                                    onClick={() => navigate("/login")}
                                >
                                    Login
                                </button>
                                <button
                                    className={`
                    ${buttonBaseStyles} 
                    ${buttonVariants.default} 
                    ${buttonSizes.default}
                  `}
                                    onClick={() => navigate("/register")}
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
