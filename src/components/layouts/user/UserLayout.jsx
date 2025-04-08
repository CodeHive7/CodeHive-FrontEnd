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
        <div className="flex min-h-screen bg-gray-950 relative overflow-hidden">
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && isMobile && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden animate-fadeIn"
                    onClick={toggleSidebar}
                    aria-hidden="true"
                />
            )}
            
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out z-50
                ${isSidebarOpen ? "translate-x-0 w-64 shadow-xl" : "-translate-x-full w-0"} 
                lg:relative lg:translate-x-0 lg:w-64 bg-gray-950
                border-r border-amber-500/20`}
            >
                {/* Code pattern background */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJjb2RlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMCAxMCBMMjAgMTAgTDIwIDIwIEwxNSAyNSBMNSAyMCBMNSAxNSBaIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNjb2RlKSIvPjwvc3ZnPg==')] opacity-15"></div>
                
                {/* Passing isSidebarOpen and toggleSidebar to Navigation component */}
                <UserDashboardNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                
                {/* Decorative terminal cursor */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500/20"></div>
                <div className="absolute bottom-4 left-6 h-4 w-2 bg-amber-500/40 animate-pulse"></div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out"
                 style={{
                     marginLeft: isMobile ? 0 : isSidebarOpen ? '0' : '-16rem',
                 }}>
                {/* Header */}
                <UserDashboardHeader toggleSidebar={toggleSidebar} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-gray-900 relative">
                    {/* Code editor-like background pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDAgTDQwIDQwIE0wIDQwIEw0MCAwIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMikiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-10"></div>
                    
                    {/* Content wrapper */}
                    <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
                        {/* Terminal-like line number indicator */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 hidden lg:flex flex-col items-end pr-2 pt-8 text-gray-600 font-mono text-xs">
                            {Array.from({ length: 30 }, (_, i) => (
                                <div key={i} className="h-6">{i + 1}</div>
                            ))}
                        </div>
                        
                        {children}
                    </div>
                    
                    {/* Subtle code editor highlights */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
                </main>
            </div>

            {/* Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-20 bg-amber-600 text-white p-2.5 rounded-full shadow-lg 
                transition-all duration-300 hover:bg-amber-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                lg:hidden z-50 ${isSidebarOpen ? 'left-[calc(16rem-1.25rem)]' : 'left-4'}`}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
                {isSidebarOpen ? 
                    <ChevronLeft className="w-5 h-5" /> : 
                    <ChevronRight className="w-5 h-5" />
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