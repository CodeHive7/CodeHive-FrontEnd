import { useState } from "react";
import DashboardNav from "../../admin/DashboardNav.jsx";
import DashboardHeader from "../../admin/DashboardHeader.jsx";

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-[#0A0B14]">
            <DashboardNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 bg-[#12141F]">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
