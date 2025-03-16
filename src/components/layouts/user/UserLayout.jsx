import { useState } from "react";
import PropTypes from "prop-types";
import UserDashboardNav from "../../user/UserDashboardNav.jsx";
import UserDashboardHeader from "../../user/UserDashboardHeader.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

const UserLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-[#0A0B14]">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out z-50
                ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"} 
                lg:relative lg:translate-x-0 lg:w-64 bg-[#181A28] border-r border-yellow-500`}
            >
                <UserDashboardNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <UserDashboardHeader toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-[#12141F]">
                    {children}
                </main>
            </div>

            {/* Sidebar Toggle Button - Fixed position adjusted */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-20 bg-yellow-500 text-black p-2 rounded-full shadow-md 
                transition-all duration-300 hover:bg-yellow-400 lg:hidden z-50
                ${isSidebarOpen ? 'left-60' : 'left-4'}`}
            >
                {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
        </div>
    );
};

// Add prop validation
UserLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default UserLayout;