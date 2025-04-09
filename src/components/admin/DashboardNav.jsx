import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard, Users, Settings, Bell, FolderKanban, BarChart3, Menu, ChevronDown, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { HiTerminal, HiCode } from 'react-icons/hi';

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
            className={`fixed top-0 left-0 min-h-screen w-64 border-r border-amber-500/30 bg-gray-950 text-gray-300 transform 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0 lg:w-64 
            transition-transform duration-300 ease-in-out z-50 shadow-lg`}
        >
            {/* Sidebar Header */}
            <div className="border-b border-amber-500/30 px-6 py-4 flex justify-between items-center lg:block">
                <Link to="/" className="flex items-center gap-2">
                    {/* Terminal Logo */}
                    <div className="w-10 h-10 bg-gray-900 border border-gray-700 rounded-md flex items-center justify-center shadow-md">
                        <HiTerminal className="text-amber-500 w-6 h-6" />
                    </div>
                    <div>
                        <span className="font-mono text-sm text-gray-400">sudo</span>
                        <span className="font-bold text-xl text-amber-500 block -mt-1">Admin</span>
                    </div>
                </Link>
                <button className="lg:hidden text-amber-500" onClick={toggleSidebar}>
                    <Menu />
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-6">
                <h3 className="text-amber-500 font-mono text-xs mb-1">// Main Navigation</h3>
                <ul className="mt-3 space-y-2">
                    {routes.map((route) =>
                        route.subRoutes ? (
                            <li key={route.id}>
                                <button
                                    onClick={toggleProjectsMenu}
                                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md ${
                                        isProjectsOpen ? "bg-amber-500/20 text-amber-500" : "hover:bg-amber-500/10"
                                    } transition`}
                                >
                                    <div className="flex items-center gap-2">
                                        <route.icon className="h-5 w-5 text-amber-500" />
                                        <span className="font-mono">{route.label}</span>
                                    </div>
                                    {isProjectsOpen ? <ChevronDown className="h-4 w-4 text-amber-500" /> : <ChevronRight className="h-4 w-4 text-amber-500" />}
                                </button>

                                {isProjectsOpen && (
                                    <ul className="ml-6 mt-2 space-y-2">
                                        {route.subRoutes.map((subroute) => (
                                            <li key={subroute.id}>
                                                <Link
                                                    to={subroute.href}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                                        location.pathname === subroute.href 
                                                            ? "bg-amber-600 text-white" 
                                                            : "hover:bg-amber-500/20 text-gray-300 hover:text-amber-500"
                                                    } transition`}
                                                >
                                                    <span className="font-mono text-xs text-gray-500">{'>>'}</span>
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
                                        location.pathname === route.href 
                                            ? "bg-amber-600 text-white" 
                                            : "hover:bg-amber-500/10 hover:text-amber-500"
                                    } transition`}
                                >
                                    <route.icon className="h-5 w-5 text-amber-500" />
                                    <span className="font-mono">{route.label}</span>
                                </Link>
                            </li>
                        )
                    )}
                </ul>

                {/* Resources Section */}
                <h3 className="text-amber-500 mt-8 font-mono text-xs mb-1">// System Tools</h3>
                <ul className="mt-3 space-y-2">
                    {resources.map((resource) => (
                        <li key={resource.id}>
                            <Link
                                to={resource.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                    location.pathname === resource.href 
                                        ? "bg-amber-600 text-white" 
                                        : "hover:bg-amber-500/10 hover:text-amber-500"
                                } transition`}
                            >
                                <resource.icon className="h-5 w-5 text-amber-500" />
                                <span className="font-mono">{resource.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                
                {/* Environment Info */}
                <div className="mt-8 bg-gray-900 rounded-md p-3 border border-gray-800">
                    <p className="text-xs font-mono text-gray-400">// Environment</p>
                    <div className="flex items-center mt-1">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-xs font-mono text-green-500">production</span>
                    </div>
                    <p className="text-xs font-mono text-gray-500 mt-2 border-t border-gray-800 pt-2">
                        v1.2.4-stable
                    </p>
                </div>
            </nav>
        </aside>
    );
};

export default DashboardNav;