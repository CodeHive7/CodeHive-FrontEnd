import { Link, useLocation } from "react-router-dom";
import { 
    User, 
    FolderKanban, 
    ChevronDown, 
    Settings, 
    ListChecks, 
    PlusCircle, 
    Home,
    LogOut,
    Shield,
    Hexagon
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const UserDashboardNav = ({ isSidebarOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logoutHandler, user } = useAuth();
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [isTasksOpen, setIsTasksOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const sidebarRef = useRef(null);
    const touchStartRef = useRef(null);

    // Define routes for navigation
    const routes = useMemo(() => [
        { id: "dashboard", label: "Dashboard", icon: Home, href: "/user" },
        { id: "profile", label: "Profile", icon: User, href: "/user/profile" },
        {
            id: "projects",
            label: "Projects",
            icon: FolderKanban,
            subRoutes: [
                { id: "my-projects", label: "My Projects", href: "/user/my-projects" },
                { id: "applied-projects", label: "Applied Projects", href: "/user/applied-projects" },
                { id: "project-applicants", label: "Project Applicants", href: "/user/project-applicants" },
            ],
        },
        {
            id: "tasks",
            label: "Tasks",
            icon: ListChecks,
            subRoutes: [
                { id: "create-task", label: "Create Task", icon: PlusCircle, href: "/user/create-task" },
                { id: "assigned-tasks", label: "Tasks Assigned to Me", href: "/user/assigned-tasks" },
            ],
        },
        { id: "settings", label: "Settings", icon: Settings, href: "/user/settings" },
    ], []);

    // Check if a route is active
    const isRouteActive = useCallback((routePath) => {
        return location.pathname === routePath;
    }, [location.pathname]);

    // Check if any subroute is active for a given section
    const isSubRouteActive = useCallback((routeId) => {
        const route = routes.find(r => r.id === routeId);
        if (!route || !route.subRoutes) return false;
        
        return route.subRoutes.some(subroute => location.pathname === subroute.href);
    }, [routes, location.pathname]);

    // Toggle menus for projects and tasks - with stopPropagation
    const toggleProjectsMenu = useCallback((e) => {
        e.stopPropagation(); // Prevent event bubbling
        setIsProjectsOpen(prev => !prev);
    }, []);
    
    const toggleTasksMenu = useCallback((e) => {
        e.stopPropagation(); // Prevent event bubbling
        setIsTasksOpen(prev => !prev);
    }, []);

    // Add touch handlers for mobile swipe gestures
    const handleTouchStart = useCallback((e) => {
        touchStartRef.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback((e) => {
        if (!touchStartRef.current) return;
        
        const touchEnd = e.changedTouches[0].clientX;
        const diff = touchStartRef.current - touchEnd;
        
        // Swipe left to close sidebar
        if (diff > 50 && isSidebarOpen && window.innerWidth < 1024) {
            toggleSidebar();
        }
        // Swipe right to open sidebar
        else if (diff < -50 && !isSidebarOpen && window.innerWidth < 1024) {
            toggleSidebar();
        }
        
        touchStartRef.current = null;
    }, [isSidebarOpen, toggleSidebar]);

    // Update active section based on current location
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('/user/my-projects') || path.includes('/user/applied-projects') || path.includes('/user/project-applicants')) {
            setIsProjectsOpen(true);
            setActiveSection("projects");
        } else if (path.includes('/user/create-task') || path.includes('/user/assigned-tasks')) {
            setIsTasksOpen(true);
            setActiveSection("tasks");
        } else {
            setActiveSection(path.split('/')[2] || "dashboard");
        }
    }, [location.pathname]);

    // Handle clicks outside sidebar on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth < 1024 && isSidebarOpen && 
                sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                toggleSidebar();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSidebarOpen, toggleSidebar]);

    // Handle link navigation on mobile
    const handleLinkClick = useCallback((e) => {
        // Only close sidebar on mobile
        if (window.innerWidth < 1024) {
            toggleSidebar();
        }
    }, [toggleSidebar]);

    return (
        <div 
            ref={sidebarRef}
            className="h-full flex flex-col w-full overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Sidebar Header with Logo */}
            <div className="relative p-2 xs:p-3 sm:p-4 border-b border-yellow-500/20 flex-shrink-0">
                <Link 
                    to="/userHome" 
                    className="flex items-center gap-1.5 xs:gap-2 group focus:outline-none focus:ring-2 focus:ring-yellow-500/60 rounded-md p-0.5"
                    aria-label="CodeHive Homepage"
                >
                    <div className="relative flex-shrink-0">
                        <Hexagon className="h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 text-yellow-500 transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 flex items-center justify-center text-black font-bold text-[8px] xs:text-[10px] sm:text-xs">
                            CH
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <h1 className="font-bold text-sm xs:text-base sm:text-lg whitespace-nowrap">
                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">Code</span>
                            <span className="text-white">Hive</span>
                        </h1>
                    </div>
                </Link>
            </div>

            {/* User Info Section */}
            <div className="relative px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 sm:py-3 border-b border-yellow-500/20 flex-shrink-0">
                <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 overflow-hidden">
                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-black font-bold text-[10px] xs:text-xs sm:text-sm">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                    </div>
                    <div className="flex flex-col min-w-0 overflow-hidden">
                        <span className="font-medium text-white text-[10px] xs:text-xs sm:text-sm md:text-base truncate">{user?.username || "User"}</span>
                        <span className="text-[8px] xs:text-[10px] sm:text-xs text-yellow-400/70 flex items-center truncate">
                            <Shield className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3 mr-0.5 xs:mr-1 flex-shrink-0" />
                            Developer
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Menu with improved text sizes */}
            <nav className="flex-grow overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-yellow-500/20 scrollbar-track-transparent p-1.5 xs:p-2 sm:p-3 flex-shrink">
                <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5">
                    {routes.map((route) =>
                        route.subRoutes ? (
                            <div key={route.id} className="mb-0.5 xs:mb-1 sm:mb-1.5">
                                <button
                                    onClick={route.id === "projects" ? toggleProjectsMenu : toggleTasksMenu}
                                    className={`
                                        flex items-center justify-between w-full px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-lg
                                        transition-all duration-200 group
                                        ${(activeSection === route.id || isSubRouteActive(route.id)) 
                                            ? "bg-yellow-500/20 text-yellow-300" 
                                            : "text-gray-300 hover:bg-gray-800/40 hover:text-white"}
                                        focus:outline-none focus:ring-2 focus:ring-yellow-500/40
                                    `}
                                    aria-expanded={route.id === "projects" ? isProjectsOpen : isTasksOpen}
                                >
                                    <div className="flex items-center min-w-0">
                                        <div className={`
                                            mr-1.5 xs:mr-2 sm:mr-2.5 flex items-center justify-center h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 flex-shrink-0
                                            ${(activeSection === route.id || isSubRouteActive(route.id)) 
                                                ? "text-yellow-400" 
                                                : "text-gray-400 group-hover:text-yellow-400"}
                                            transition-colors duration-200
                                        `}>
                                            <route.icon className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <span className="text-xs sm:text-sm md:text-base font-medium truncate">{route.label}</span>
                                    </div>
                                    <div className={`
                                        transform transition-transform duration-200 flex-shrink-0
                                        ${route.id === "projects" && isProjectsOpen || route.id === "tasks" && isTasksOpen 
                                            ? "rotate-180" 
                                            : ""}
                                    `}>
                                        <ChevronDown className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-3.5 sm:w-3.5" />
                                    </div>
                                </button>

                                {/* Dropdown for Projects/Tasks */}
                                <div 
                                    className={`
                                        mt-0.5 xs:mt-1 overflow-hidden transition-all duration-200 ease-out
                                        ${route.id === "projects" && isProjectsOpen || route.id === "tasks" && isTasksOpen
                                            ? "max-h-96 opacity-100" 
                                            : "max-h-0 opacity-0 invisible"}
                                    `}
                                    aria-hidden={!(route.id === "projects" && isProjectsOpen || route.id === "tasks" && isTasksOpen)}
                                >
                                    {/* Only render subroutes when expanded for performance */}
                                    {(route.id === "projects" && isProjectsOpen || route.id === "tasks" && isTasksOpen) && 
                                        route.subRoutes.map((subroute) => (
                                            <Link
                                                key={subroute.id}
                                                to={subroute.href}
                                                onClick={handleLinkClick}
                                                className={`
                                                    flex items-center pl-6 xs:pl-7 sm:pl-9 pr-1.5 xs:pr-2 sm:pr-3 py-1 xs:py-1.5 sm:py-2 ml-0.5 rounded-lg 
                                                    text-xs sm:text-sm md:text-base
                                                    transition-all duration-200
                                                    ${isRouteActive(subroute.href)
                                                        ? "bg-yellow-500/20 text-yellow-300"
                                                        : "text-gray-400 hover:bg-gray-800/30 hover:text-white"}
                                                    focus:outline-none focus:ring-2 focus:ring-yellow-500/40 
                                                    relative group
                                                `}
                                            >
                                                {/* Animated indicator line for active subroute */}
                                                {isRouteActive(subroute.href) && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 xs:w-1 sm:w-1.5 bg-yellow-500 rounded-r animate-fadeIn"></div>
                                                )}
                                                
                                                {subroute.icon && (
                                                    <subroute.icon className={`h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 mr-1 xs:mr-1.5 sm:mr-2 flex-shrink-0 ${isRouteActive(subroute.href) ? "text-yellow-400" : ""}`} />
                                                )}
                                                <span className="truncate">{subroute.label}</span>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={route.id}
                                to={route.href}
                                onClick={handleLinkClick}
                                className={`
                                    flex items-center px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2 rounded-lg 
                                    text-xs sm:text-sm md:text-base
                                    transition-all duration-200 group relative
                                    ${isRouteActive(route.href)
                                        ? "bg-yellow-500/20 text-yellow-300"
                                        : "text-gray-300 hover:bg-gray-800/40 hover:text-white"}
                                    focus:outline-none focus:ring-2 focus:ring-yellow-500/40
                                `}
                            >
                                {/* Animated indicator line for active route */}
                                {isRouteActive(route.href) && (
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 xs:w-1 sm:w-1.5 bg-yellow-500 rounded-r animate-pulse"></div>
                                )}
                                
                                <div className={`
                                    mr-1.5 xs:mr-2 sm:mr-2.5 flex items-center justify-center h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5 flex-shrink-0
                                    ${isRouteActive(route.href) 
                                        ? "text-yellow-400" 
                                        : "text-gray-400 group-hover:text-yellow-400"}
                                    transition-colors duration-200
                                `}>
                                    <route.icon className="h-3.5 w-3.5 xs:h-4 xs:w-4 sm:h-5 sm:w-5" />
                                </div>
                                <span className="truncate">{route.label}</span>
                            </Link>
                        )
                    )}
                </div>
            </nav>

            {/* Footer with Logout Button */}
            <div className="p-1.5 xs:p-2 sm:p-3 border-t border-yellow-500/20 mt-auto flex-shrink-0">
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        logoutHandler();
                    }}
                    className="flex items-center justify-center w-full gap-1 xs:gap-1.5 sm:gap-2 px-1.5 xs:px-2 sm:px-3 py-1 xs:py-1.5 sm:py-2
                        text-xs sm:text-sm md:text-base text-red-400 hover:bg-red-500/10 hover:text-red-300
                        rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                    <LogOut className="h-2.5 w-2.5 xs:h-3 xs:w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">Logout</span>
                </button>
            </div>

            {/* Optimized Animation Styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                /* Custom Scrollbar */
                .scrollbar-thin {
                    scrollbar-width: thin;
                }
                .scrollbar-thumb-yellow-500\\/20::-webkit-scrollbar-thumb {
                    background-color: rgba(234, 179, 8, 0.2);
                    border-radius: 3px;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 3px;
                }
                .scrollbar-track-transparent::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                /* Prevent scroll chaining */
                .overscroll-contain {
                    overscroll-behavior: contain;
                }
            `}</style>
        </div>
    );
};

export default UserDashboardNav;