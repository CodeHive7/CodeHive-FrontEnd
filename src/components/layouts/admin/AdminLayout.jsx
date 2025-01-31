import DashboardNav from "../../admin/DashboardNav.jsx";
import DashboardHeader from "../../admin/DashboardHeader.jsx";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-[#0A0B14]">
            <DashboardNav />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto p-6 bg-[#12141F]">{children}</main>
            </div>
        </div>
    );
};

export default AdminLayout;
