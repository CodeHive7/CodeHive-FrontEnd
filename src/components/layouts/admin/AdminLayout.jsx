import { useState } from "react";
import DashboardNav from "../../admin/DashboardNav.jsx";
import DashboardHeader from "../../admin/DashboardHeader.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open by default

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-[#0A0B14]">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-50
                ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"} 
                lg:relative lg:translate-x-0 lg:w-64 bg-[#181A28] border-r border-yellow-500`}
            >
                <DashboardNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <DashboardHeader toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-[#12141F]">
                    {children}
                </main>
            </div>

            {/* Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-1/2 transform -translate-y-1/2 left-64 bg-yellow-500 text-black p-2 rounded-full shadow-md transition-all duration-300
                hover:bg-yellow-400 lg:hidden"
            >
                {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
        </div>
    );
};

export default AdminLayout;
