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
    Shield
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { HiTerminal } from 'react-icons/hi';

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
        e.stopPropagation();
        setIsProjectsOpen(prev => !prev);
    }, []);
    
    const toggleTasksMenu = useCallback((e) => {
        e.stopPropagation();
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
    const handleLinkClick = useCallback(() => {
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
            <div className="p-4 border-b border-gray-800 flex items-center">
                <Link 
                    to="/userHome" 
                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-md p-0.5"
                    aria-label="CodeHive Homepage"
                >
                    <div className="bg-gray-800 rounded-md w-8 h-8 flex items-center justify-center">
                        <HiTerminal className="h-5 w-5 text-amber-500" />
                    </div>
                    <h1 className="font-bold text-lg">
                        <span className="text-white">Code</span>
                        <span className="text-amber-500">Hive</span>
                    </h1>
                </Link>
            </div>

            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 border border-amber-500/50 rounded-md flex items-center justify-center text-amber-500">
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-medium text-white text-sm truncate">{user?.username || "User"}</p>
                        <p className="text-xs text-amber-400/70 flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            Developer
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-grow overflow-y-auto p-2 custom-scrollbar">
                <div className="space-y-1">
                    {routes.map((route) =>
                        route.subRoutes ? (
                            <div key={route.id} className="mb-1">
                                <button
                                    onClick={route.id === "projects" ? toggleProjectsMenu : toggleTasksMenu}
                                    className={`
                                        flex items-center justify-between w-full px-3 py-2 rounded-md
                                        transition-all duration-200
                                        ${(activeSection === route.id || isSubRouteActive(route.id)) 
                                            ? "bg-amber-500/20 text-amber-300" 
                                            : "text-gray-300 hover:bg-gray-800/40 hover:text-white"}
                                        focus:outline-none focus:ring-2 focus:ring-amber-500/40
                                    `}
                                    aria-expanded={route.id === "projects" ? isProjectsOpen : isTasksOpen}
                                >
                                    <div className="flex items-center">
                                        <route.icon className={`
                                            h-5 w-5 mr-2.5
                                            ${(activeSection === route.id || isSubRouteActive(route.id)) 
                                                ? "text-amber-400" 
                                                : "text-gray-400"}
                                        `} />
                                        <span className="text-sm font-medium">{route.label}</span>
                                    </div>
                                    <ChevronDown className={`
                                        h-3.5 w-3.5 transform transition-transform duration-200
                                        ${route.id === "projects" && isProjectsOpen || route.id === "tasks" && isTasksOpen 
                                            ? "rotate-180" 
                                            : ""}
                                    `} />
                                </button>

                                {/* Dropdown for Projects/Tasks */}
                                <div 
                                    className={`
                                        mt-1 overflow-hidden transition-all duration-200 ease-out
                                        ${route.id === "projects" && isProjectsOpen || route.id === "tasks" && isTasksOpen
                                            ? "max-h-72 opacity-100" 
                                            : "max-h-0 opacity-0"}
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
                                                    flex items-center pl-9 pr-3 py-2 ml-0.5 rounded-md 
                                                    text-sm font-medium
                                                    transition-all duration-200
                                                    ${isRouteActive(subroute.href)
                                                        ? "bg-amber-500/20 text-amber-300"
                                                        : "text-gray-400 hover:bg-gray-800/30 hover:text-white"}
                                                    focus:outline-none focus:ring-2 focus:ring-amber-500/40 
                                                    relative
                                                `}
                                            >
                                                {/* Simple indicator line for active subroute */}
                                                {isRouteActive(subroute.href) && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r"></div>
                                                )}
                                                
                                                {subroute.icon && (
                                                    <subroute.icon className={`h-4 w-4 mr-2 ${isRouteActive(subroute.href) ? "text-amber-400" : ""}`} />
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
                                    flex items-center px-3 py-2 rounded-md 
                                    text-sm font-medium
                                    transition-all duration-200 relative
                                    ${isRouteActive(route.href)
                                        ? "bg-amber-500/20 text-amber-300"
                                        : "text-gray-300 hover:bg-gray-800/40 hover:text-white"}
                                    focus:outline-none focus:ring-2 focus:ring-amber-500/40
                                `}
                            >
                                {/* Simple indicator line for active route */}
                                {isRouteActive(route.href) && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r"></div>
                                )}
                                
                                <route.icon className={`
                                    h-5 w-5 mr-2.5
                                    ${isRouteActive(route.href) ? "text-amber-400" : "text-gray-400"}
                                `} />
                                <span className="truncate">{route.label}</span>
                            </Link>
                        )
                    )}
                </div>
            </nav>

            {/* Footer with Logout Button */}
            <div className="p-3 border-t border-gray-800 mt-auto">
                <button 
                    onClick={logoutHandler}
                    className="flex items-center justify-center w-full gap-2 px-3 py-2
                        text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300
                        rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/40"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                </button>
            </div>

            {/* Simplified Scrollbar Styles */}
            <style>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(245, 158, 11, 0.2);
                    border-radius: 3px;
                }
            `}</style>
        </div>
    );
};

export default UserDashboardNav;