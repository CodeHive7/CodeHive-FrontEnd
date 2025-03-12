import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Users, Settings, Bell, FolderKanban, BarChart3, Menu, ChevronDown, ChevronRight
} from "lucide-react";
import { useState } from "react";

const DashboardNav = ({ isSidebarOpen, toggleSidebar }) => {
    const location = useLocation();
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);

    const toggleProjectsMenu = () => setIsProjectsOpen(!isProjectsOpen);

    const routes = [
        { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/admin" },
        { id: "analytics", label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
        {
            id: "projects",
            label: "Projects",
            icon: FolderKanban,
            subRoutes: [
                { id: "pending", label: "Pending Projects", href: "/admin/projects" },
                { id: "accepted", label: "Accepted Projects", href: "/admin/projects/accepted" },
                { id: "rejected", label: "Rejected Projects", href: "/admin/projects/rejected" },
            ],
        },
        { id: "users", label: "Users", icon: Users, href: "/admin/users" },
        { id: "permissions", label: "Manage Permissions", icon: Settings, href: "/admin/permissions" },
        { id: "categories", label: "Category Management", icon: Settings, href: "/admin/categories" },
    ];

    const resources = [
        { id: "notifications", label: "Notifications", icon: Bell, href: "/admin/notifications" },
        { id: "settings", label: "Settings", icon: Settings, href: "/admin/settings" },
    ];

    return (
        <aside
            className={`fixed top-0 left-0 min-h-screen w-64 border-r border-yellow-500 bg-[#0A0B14] text-gray-300 transform 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0 lg:w-64 
            transition-transform duration-300 ease-in-out z-50 shadow-lg`}
        >
            {/* Sidebar Header */}
            <div className="border-b border-yellow-500 px-6 py-4 flex justify-between items-center lg:block">
                <Link to="/" className="flex items-center gap-2">
                    {/* Bee Logo */}
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-md">
                        🐝
                    </div>
                    <span className="font-bold text-xl text-yellow-400">Admin</span>
                </Link>
                <button className="lg:hidden text-yellow-400" onClick={toggleSidebar}>
                    <Menu />
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-6">
                <h3 className="text-yellow-400 uppercase text-sm">Menu</h3>
                <ul className="mt-3 space-y-2">
                    {routes.map((route) =>
                        route.subRoutes ? (
                            <li key={route.id}>
                                <button
                                    onClick={toggleProjectsMenu}
                                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md ${
                                        isProjectsOpen ? "bg-yellow-500/20 text-yellow-400" : "hover:bg-yellow-500/10"
                                    } transition`}
                                >
                                    <div className="flex items-center gap-2">
                                        <route.icon className="h-5 w-5 text-yellow-400" />
                                        {route.label}
                                    </div>
                                    {isProjectsOpen ? <ChevronDown className="h-4 w-4 text-yellow-400" /> : <ChevronRight className="h-4 w-4 text-yellow-400" />}
                                </button>

                                {isProjectsOpen && (
                                    <ul className="ml-6 mt-2 space-y-2">
                                        {route.subRoutes.map((subroute) => (
                                            <li key={subroute.id}>
                                                <Link
                                                    to={subroute.href}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                                        location.pathname === subroute.href ? "bg-yellow-500 text-black" : "hover:bg-yellow-500/20"
                                                    } transition`}
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
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                        location.pathname === route.href ? "bg-yellow-500 text-black" : "hover:bg-yellow-500/10"
                                    } transition`}
                                >
                                    <route.icon className="h-5 w-5 text-yellow-400" />
                                    {route.label}
                                </Link>
                            </li>
                        )
                    )}
                </ul>

                {/* Resources Section */}
                <h3 className="text-yellow-400 mt-6 uppercase text-sm">Resources</h3>
                <ul className="mt-3 space-y-2">
                    {resources.map((resource) => (
                        <li key={resource.id}>
                            <Link
                                to={resource.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                    location.pathname === resource.href ? "bg-yellow-500 text-black" : "hover:bg-yellow-500/10"
                                } transition`}
                            >
                                <resource.icon className="h-5 w-5 text-yellow-400" />
                                {resource.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default DashboardNav;
