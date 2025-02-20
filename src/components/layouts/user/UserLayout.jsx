import { useState } from "react";
import UserDashboardNav from "../../user/UserDashboardNav.jsx";
import UserDashboardHeader from "../../user/UserDashboardHeader.jsx";

const UserLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-[#0A0B14]">
            <UserDashboardNav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <UserDashboardHeader toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 bg-[#12141F]">{children}</main>
            </div>
        </div>
    );
};

export default UserLayout;
