import { useState } from "react";
import PropTypes from "prop-types";
import DashboardNav from "../../admin/DashboardNav.jsx";
import DashboardHeader from "../../admin/DashboardHeader.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-gray-950">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-50
                ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"} 
                lg:relative lg:translate-x-0 lg:w-64 bg-gray-950 border-r border-amber-500/30`}
            >
                <DashboardNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <DashboardHeader toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-900">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            {/* Sidebar Toggle Button - Fixed position adjusted */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-20 bg-amber-600 text-white p-2 rounded-full shadow-md 
                transition-all duration-300 hover:bg-amber-700 lg:hidden z-50
                ${isSidebarOpen ? 'left-60' : 'left-4'}`}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
                {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
        </div>
    );
};

// Add prop validation
AdminLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default AdminLayout;