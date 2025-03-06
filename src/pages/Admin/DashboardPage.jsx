import { useEffect, useState } from "react";
import { Users, Activity, ClipboardCheck, Hourglass, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { fetchDashboardStats } from "../../services/adminService/adminService.js";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeProjects: 0,
        totalApplicants: 0,
        pendingApplications: 0,
    });

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            const data = await fetchDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Error loading dashboard stats", error);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">🐝 Hive Dashboard</h2>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                        <Users className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                            <div className="flex items-center gap-1 text-green-500 text-sm">
                                <ArrowUpRight className="h-4 w-4" />
                                +5.2%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">+50 this week</p>
                    </div>
                </div>

                {/* Active Projects */}
                <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Active Projects</h3>
                        <Activity className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">{stats.activeProjects}</div>
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                                <ArrowDownRight className="h-4 w-4" />
                                -3.8%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">-4 this week</p>
                    </div>
                </div>

                {/* Total Applicants */}
                <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Total Applicants</h3>
                        <ClipboardCheck className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">{stats.totalApplicants}</div>
                            <div className="flex items-center gap-1 text-green-500 text-sm">
                                <ArrowUpRight className="h-4 w-4" />
                                +8.9%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">+23 this week</p>
                    </div>
                </div>

                {/* Pending Applications */}
                <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Pending Applications</h3>
                        <Hourglass className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">{stats.pendingApplications}</div>
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                                <ArrowDownRight className="h-4 w-4" />
                                -2.1%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">-5 this week</p>
                    </div>
                </div>
            </div>

            {/* Performance Overview & Recent Activities */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Performance Overview */}
                <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md lg:col-span-4">
                    <div className="p-6">
                        <h3 className="text-white">Hive Activity Overview</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="h-[350px] flex items-center justify-center text-gray-400">
                            Chart will be rendered here
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md lg:col-span-3">
                    <div className="p-6">
                        <h3 className="text-white">Recent Activities</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-4" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm text-white">User applied to a project</p>
                                        <p className="text-xs text-gray-400">5 minutes ago</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
