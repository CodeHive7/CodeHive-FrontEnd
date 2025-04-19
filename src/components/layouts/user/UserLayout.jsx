import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserDashboardNav from "../../user/UserDashboardNav.jsx";
import UserDashboardHeader from "../../user/UserDashboardHeader.jsx";
import { Menu, X } from "lucide-react";

const UserLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size on mount and when resized
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
            // Auto-close sidebar on mobile
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Initial check
        checkScreenSize();
        
        // Add event listener
        window.addEventListener('resize', checkScreenSize);
        
        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex min-h-screen bg-gray-950">
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && isMobile && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
            
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 transform transition-all duration-200 ease-in-out z-50
                ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"} 
                lg:relative lg:translate-x-0 lg:w-64 bg-gray-900
                border-r border-gray-800`}
            >
                {/* Simple accent line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 to-amber-500"></div>
                
                {/* Passing isSidebarOpen and toggleSidebar to Navigation component */}
                <UserDashboardNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                
                {/* Simple accent element at the bottom */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800"></div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col transition-all duration-200 ease-in-out"
                 style={{
                     marginLeft: isMobile ? 0 : isSidebarOpen ? '0' : '-16rem',
                 }}>
                {/* Header */}
                <UserDashboardHeader toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-950 relative">
                    {/* Content wrapper with subtle grid background */}
                    <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
                        {/* Simple accent element */}
                        <div className="h-1 w-16 bg-amber-600 mb-6 rounded-full"></div>
                        
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Toggle Button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    className="fixed bottom-6 right-6 bg-amber-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            )}
        </div>
    );
};

// Add prop validation
UserLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default UserLayout;