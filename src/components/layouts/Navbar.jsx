import { useNavigate } from "react-router-dom"

export default function Navbar() {
    const navigate = useNavigate()

    const buttonBaseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    const buttonVariants = {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    }
    const buttonSizes = {
        default: "h-9 px-4 py-2",
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <button
                            className="flex items-center"
                            onClick={() => navigate("/")}
                        >
                            <svg className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                            </svg>
                            <span className="ml-2 text-xl font-bold">CodeHive</span>
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            className={`${buttonBaseStyles} ${buttonVariants.ghost} ${buttonSizes.default}`}
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                        <button
                            className={`${buttonBaseStyles} ${buttonVariants.default} ${buttonSizes.default}`}
                            onClick={() => navigate("/register")}
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}