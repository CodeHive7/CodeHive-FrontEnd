import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Settings, BarChart3, Bell, FolderKanban, Menu, ChevronDown, ChevronRight } from "lucide-react";
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
            className={`fixed top-0 left-0 h-full w-64 border-r border-gray-800 bg-[#0A0B14] text-gray-300 transform 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:relative lg:translate-x-0 lg:w-64 
            transition-transform duration-300 ease-in-out z-50`}
        >
            {/* Sidebar Header */}
            <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center lg:block">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-45"></div>
                    <span className="font-bold text-xl text-white">Admin</span>
                </Link>
                <button className="lg:hidden text-gray-300" onClick={toggleSidebar}>
                    <Menu />
                </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="p-6">
                <h3 className="text-gray-400">Menu</h3>
                <ul className="mt-3 space-y-2">
                    {routes.map((route) =>
                        route.subRoutes ? (
                            <li key={route.id}>
                                <button
                                    onClick={toggleProjectsMenu}
                                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md ${
                                        isProjectsOpen ? "bg-gray-800 text-white" : "hover:bg-gray-800"
                                    }`}
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
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                                        location.pathname === subroute.href ? "bg-gray-700 text-white" : "hover:bg-gray-700"
                                                    }`}
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
                                        location.pathname === route.href ? "bg-gray-800 text-white" : "hover:bg-gray-800"
                                    }`}
                                >
                                    <route.icon className="h-5 w-5" />
                                    {route.label}
                                </Link>
                            </li>
                        )
                    )}
                </ul>

                {/* Resources Section */}
                <h3 className="text-gray-400 mt-6">Resources</h3>
                <ul className="mt-3 space-y-2">
                    {resources.map((resource) => (
                        <li key={resource.id}>
                            <Link
                                to={resource.href}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                                    location.pathname === resource.href ? "bg-gray-800 text-white" : "hover:bg-gray-800"
                                }`}
                            >
                                <resource.icon className="h-5 w-5" />
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
