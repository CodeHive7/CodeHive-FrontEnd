import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import UserDashboardNav from "../../user/UserDashboardNav.jsx";
import UserDashboardHeader from "../../user/UserDashboardHeader.jsx";
import { ChevronLeft, ChevronRight, Code } from "lucide-react";

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
                {/* Code pattern background - updated for more code-like appearance */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJjb2RlIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik01IDEwIEwxNSA1IEwzMCAxNSBMMjAgMjUgTDEwIDE1IFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNDUsMTU4LDExLDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjY29kZSkiLz48L3N2Zz4=')] opacity-15"></div>
                
                {/* Passing isSidebarOpen and toggleSidebar to Navigation component */}
                <UserDashboardNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                
                {/* Decorative terminal cursor with blinking animation */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-500/20"></div>
                <div className="absolute bottom-4 left-6 h-4 w-2 bg-amber-500/40 animate-blink"></div>
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
                    {/* Code editor-like background pattern - updated for better grid appearance */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDIwIEwyMCAyMCBNMjAgMCBMMjAgMjAgTTAgMCBMMCAyMCBNMCAwIEwyMCAwIiBzdHJva2U9InJnYmEoMjQ1LDE1OCwxMSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>
                    
                    {/* Content wrapper */}
                    <div className="relative z-10 p-6 md:p-8 max-w-7xl mx-auto">
                        {/* Code brackets to visually enclose the content */}
                        <div className="absolute left-14 top-8 text-amber-500/20 text-2xl font-mono hidden lg:block select-none">{`{`}</div>
                        <div className="absolute right-8 bottom-8 text-amber-500/20 text-2xl font-mono hidden lg:block select-none">{`}`}</div>
                        
                        {children}
                    </div>
                    
                    {/* Code-like glows and accents */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/4 w-36 h-36 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute top-1/3 left-1/3 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>
                </main>
            </div>

            {/* Improved Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className={`fixed top-20 bg-gray-800 text-amber-500 p-2.5 rounded-md shadow-lg border border-amber-500/30
                transition-all duration-300 hover:bg-gray-900 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500/50 
                lg:hidden z-50 ${isSidebarOpen ? 'left-[calc(16rem-1.25rem)]' : 'left-4'}`}
                aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
                {isSidebarOpen ? 
                    <ChevronLeft className="w-5 h-5" /> : 
                    <Code className="w-5 h-5" />
                }
                <span className="sr-only">{isSidebarOpen ? "Close sidebar" : "Open sidebar"}</span>
            </button>
            
            {/* Animation styles - added blinking cursor animation */}
            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                
                @keyframes blink {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
                .animate-blink {
                    animation: blink 1.2s infinite ease-in-out;
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