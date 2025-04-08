import { useEffect, useState } from "react";
import { Users, Activity, ClipboardCheck, Hourglass, ArrowUpRight, ArrowDownRight, Terminal } from "lucide-react";
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
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">admin</span>
                <span className="text-white">.dashboard</span>
                <span className="text-amber-400">.main()</span>
            </h2>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Users */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400 font-mono">users.total</h3>
                        <Users className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white font-mono">{stats.totalUsers}</div>
                            <div className="flex items-center gap-1 text-green-500 text-sm font-mono">
                                <ArrowUpRight className="h-4 w-4" />
                                +5.2%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-mono">// +50 this week</p>
                    </div>
                </div>

                {/* Active Projects */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400 font-mono">projects.active</h3>
                        <Activity className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white font-mono">{stats.activeProjects}</div>
                            <div className="flex items-center gap-1 text-red-500 text-sm font-mono">
                                <ArrowDownRight className="h-4 w-4" />
                                -3.8%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-mono">// -4 this week</p>
                    </div>
                </div>

                {/* Total Applicants */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400 font-mono">applicants.total</h3>
                        <ClipboardCheck className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white font-mono">{stats.totalApplicants}</div>
                            <div className="flex items-center gap-1 text-green-500 text-sm font-mono">
                                <ArrowUpRight className="h-4 w-4" />
                                +8.9%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-mono">// +23 this week</p>
                    </div>
                </div>

                {/* Pending Applications */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400 font-mono">applications.pending</h3>
                        <Hourglass className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white font-mono">{stats.pendingApplications}</div>
                            <div className="flex items-center gap-1 text-red-500 text-sm font-mono">
                                <ArrowDownRight className="h-4 w-4" />
                                -2.1%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 font-mono">// -5 this week</p>
                    </div>
                </div>
            </div>

            {/* Performance Overview & Recent Activities */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Performance Overview */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md lg:col-span-4">
                    <div className="p-6">
                        <h3 className="text-white font-mono flex items-center">
                            <Terminal className="h-4 w-4 text-amber-400 mr-2" />
                            hive.activity.overview()
                        </h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="h-[350px] flex items-center justify-center text-gray-400 font-mono border border-dashed border-amber-500/20 rounded-md">
                            // chart.render()
                        </div>
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md lg:col-span-3">
                    <div className="p-6">
                        <h3 className="text-white font-mono flex items-center">
                            <Terminal className="h-4 w-4 text-amber-400 mr-2" />
                            activity.recent()
                        </h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-2 h-2 rounded-sm bg-amber-400 mr-4" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm text-white font-mono">user.applyToProject()</p>
                                        <p className="text-xs text-amber-500/70 font-mono">// 5 minutes ago</p>
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