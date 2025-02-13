import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Settings, BarChart3, Bell, FolderKanban, Menu } from "lucide-react";
import { useState } from "react";

const DashboardNav = ({ isSidebarOpen, toggleSidebar }) => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const routes = [
        { label: "Overview", icon: LayoutDashboard, href: "/admin" },
        { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
        { label: "Projects", icon: FolderKanban, href: "/admin/projects" },
        { label: "Users", icon: Users, href: "/admin/users" },
        { label: "Manage Permissions", icon: Settings, href: "/admin/permissions" },
    ];

    const resources = [
        { label: "Notifications", icon: Bell, href: "/admin/notifications" },
        { label: "Settings", icon: Settings, href: "/admin/settings" },
    ];

    return (
        <aside
            className={`fixed lg:relative top-0 left-0 h-full w-64 border-r border-gray-800 bg-[#0A0B14] text-gray-300 transform ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
            <div className="border-b border-gray-800 px-6 py-4 flex justify-between items-center lg:block">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-45"></div>
                    <span className="font-bold text-xl text-white">Admin</span>
                </Link>
                <button className="lg:hidden text-gray-300" onClick={toggleSidebar}>
                    <Menu />
                </button>
            </div>
            <nav className="p-6">
                <h3 className="text-gray-400">Menu</h3>
                <ul className="mt-3 space-y-2">
                    {routes.map((route) => (
                        <li key={route.href}>
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
                    ))}
                </ul>
                <h3 className="text-gray-400 mt-6">Resources</h3>
                <ul className="mt-3 space-y-2">
                    {resources.map((resource) => (
                        <li key={resource.href}>
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
