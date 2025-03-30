import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserDashboardNav from "../../user/UserDashboardNav.jsx";
import UserDashboardHeader from "../../user/UserDashboardHeader.jsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        <div className="flex min-h-screen bg-[#0A0B14] relative overflow-hidden">
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && isMobile && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden animate-fadeIn"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
            
            {/* Sidebar with improved design */}
            <aside
                className={`fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out z-50
                ${isSidebarOpen ? "translate-x-0 w-64 shadow-xl" : "-translate-x-full w-0"} 
                lg:relative lg:translate-x-0 lg:w-64 bg-gradient-to-b from-[#181A28] to-[#1F2235] 
                border-r border-yellow-500/20 backdrop-blur-sm`}
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJoZXhhZ29ucyIgd2lkdGg9IjI4IiBoZWlnaHQ9IjQ5IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBwYXR0ZXJuVHJhbnNmb3JtPSJzY2FsZSgxKSI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0icmdiYSgwLDAsMCwwKSIvPjxwYXRoIGQ9Ik0xNCAwIEwyOCAxMCBMMjggMzUgTDE0IDQ1IEwwIDM1IEwwIDEwIFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2hleGFnb25zKSIvPjwvc3ZnPg==')] opacity-25"></div>
                
                {/* Passing isSidebarOpen and toggleSidebar to Navigation component */}
                <UserDashboardNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                
                {/* Decorative elements */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-yellow-500/5 to-transparent pointer-events-none"></div>
                <div className="absolute top-1/4 right-0 w-20 h-20 rounded-full bg-yellow-500/5 blur-xl pointer-events-none"></div>
            </aside>

            {/* Main Content Area with enhanced styling */}
            <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
                 style={{
                     marginLeft: isMobile ? 0 : isSidebarOpen ? '0' : '-16rem',
                 }}>
                {/* Header with enhanced styling */}
                <UserDashboardHeader toggleSidebar={toggleSidebar} />

                {/* Page Content with enhanced background */}
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#12141F] to-[#0D0F1A] relative">
                    {/* Background pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAgTDQwIDQwIE0wIDQwIEw0MCAwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
                    
                    {/* Content wrapper with enhanced padding */}
                    <div className="relative z-10 p-6 md:p-8">
                        {children}
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                </main>
            </div>

            {/* Enhanced Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-20 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black p-2.5 rounded-full shadow-lg 
                transition-all duration-300 hover:shadow-yellow-500/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:ring-offset-2 focus:ring-offset-[#12141F] 
                lg:hidden z-50 ${isSidebarOpen ? 'left-[calc(16rem-1.25rem)]' : 'left-4'}`}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
                {isSidebarOpen ? 
                    <ChevronLeft className="w-5 h-5 drop-shadow-sm" /> : 
                    <ChevronRight className="w-5 h-5 drop-shadow-sm" />
                }
                <span className="sr-only">{isSidebarOpen ? "Close sidebar" : "Open sidebar"}</span>
            </button>
            
            {/* Animation styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

// Add prop validation
UserLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default UserLayout;