import { Link, useLocation } from "react-router-dom";
import { User, FolderKanban, ChevronDown, ChevronRight, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const UserDashboardNav = ({ isSidebarOpen, toggleSidebar }) => {
    const location = useLocation();
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const sidebarRef = useRef(null); // Reference to the sidebar

    const toggleProjectsMenu = () => setIsProjectsOpen(!isProjectsOpen);

    const routes = [
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
        { id: "settings", label: "Settings", icon: Settings, href: "/user/settings" },
    ];

    // Handle click outside of the sidebar to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                toggleSidebar(); // Close sidebar
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSidebarOpen]);

    return (
        <aside
            ref={sidebarRef} // Attach ref to the sidebar
            className={`fixed top-0 left-0 h-full w-64 border-r border-gray-800 bg-[#0A0B14] text-gray-300 transform 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0 lg:w-64 
            transition-transform duration-300 ease-in-out z-50`}
        >
            <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center lg:block">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-45"></div>
                    <span className="font-bold text-xl text-white">User</span>
                </Link>
            </div>

            <nav className="p-6">
                <ul className="mt-3 space-y-2">
                    {routes.map((route) =>
                        route.subRoutes ? (
                            <li key={route.id}>
                                <button
                                    onClick={toggleProjectsMenu}
                                    className="flex items-center justify-between w-full px-3 py-2 rounded-md hover:bg-gray-800"
                                >
                                    <div className="flex items-center gap-2">
                                        <route.icon className="h-5 w-5" />
                                        {route.label}
                                    </div>
                                    {isProjectsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                </button>

                                {isProjectsOpen && (
                                    <ul className="ml-6 mt-2 space-y-2">
                                        {route.subRoutes.map((subroute) => (
                                            <li key={subroute.id}>
                                                <Link
                                                    to={subroute.href}
                                                    onClick={toggleSidebar} // Close sidebar when a link is clicked
                                                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700"
                                                >
                                                    {subroute.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ) : (
                            <li key={route.id}>
                                <Link
                                    to={route.href}
                                    onClick={toggleSidebar} // Close sidebar when a link is clicked
                                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800"
                                >
                                    <route.icon className="h-5 w-5" />
                                    {route.label}
                                </Link>
                            </li>
                        )
                    )}
                </ul>
            </nav>
        </aside>
    );
};

export default UserDashboardNav;
