import React, { useState, useEffect } from "react";
import {
    BarChart, PieChart, LineChart, Users, Award, XCircle,
    CheckCircle, Calendar, Layers, TrendingUp, Eye, Loader2
} from "lucide-react";
import { fetchDashboardStats, fetchPendingProjects, fetchAcceptedProjects, fetchRejectedProjects } from "../../services/adminService/adminService.js";

export default function AnalyticsPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeProjects: 0,
        totalProjects: 0,
        pendingProjects: 0,
        acceptedProjects: 0,
        rejectedProjects: 0
    });
    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState([]);

    // Static data for charts that doesn't change
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const projectTrend = [15, 25, 18, 30, 28, 42];

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                // Fetch dashboard stats
                const dashboardStats = await fetchDashboardStats();

                // Fetch project counts
                const pendingProjects = await fetchPendingProjects();
                const acceptedProjects = await fetchAcceptedProjects();
                const rejectedProjects = await fetchRejectedProjects();

                // Calculate total projects and distribution
                const totalProjects = pendingProjects.length + acceptedProjects.length + rejectedProjects.length;

                // Update state with all data
                setStats({
                    totalUsers: dashboardStats.totalUsers || 0,
                    activeProjects: dashboardStats.activeProjects || 0,
                    totalApplicants: dashboardStats.totalApplicants || 0,
                    pendingApplications: dashboardStats.pendingApplications || 0,
                    totalProjects,
                    pendingProjects: pendingProjects.length,
                    acceptedProjects: acceptedProjects.length,
                    rejectedProjects: rejectedProjects.length
                });

                // Process category data from projects
                const categories = {};
                [...pendingProjects, ...acceptedProjects, ...rejectedProjects].forEach(project => {
                    if (project.category) {
                        categories[project.category] = (categories[project.category] || 0) + 1;
                    }
                });

                // Convert to array and calculate percentages
                const categoryArray = Object.entries(categories).map(([name, count]) => ({
                    name,
                    percent: Math.round((count / totalProjects) * 100) || 0
                }));

                setCategoryData(categoryArray.slice(0, 5).sort((a, b) => b.percent - a.percent));
            } catch (error) {
                console.error("Error loading analytics data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-gray-400 font-mono">analytics.loading()</p>
            </div>
        );
    }

    // Calculate percentages for pie chart
    const totalProjects = stats.totalProjects || 1; // Prevent division by zero
    const acceptedPercent = Math.round((stats.acceptedProjects / totalProjects) * 100);
    const pendingPercent = Math.round((stats.pendingProjects / totalProjects) * 100);
    const rejectedPercent = Math.round((stats.rejectedProjects / totalProjects) * 100);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">admin</span>
                <span className="text-white">.analytics</span>
                <span className="text-amber-400">.dashboard()</span>
            </h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "projects.total", value: stats.totalProjects, icon: <Layers className="w-5 h-5" />, color: "bg-blue-500" },
                    { title: "projects.approved", value: stats.acceptedProjects, icon: <CheckCircle className="w-5 h-5" />, color: "bg-green-500" },
                    { title: "projects.rejected", value: stats.rejectedProjects, icon: <XCircle className="w-5 h-5" />, color: "bg-red-500" },
                    { title: "users.total", value: stats.totalUsers, icon: <Users className="w-5 h-5" />, color: "bg-purple-500" }
                ].map((kpi, index) => (
                    <div key={index} className="bg-gray-900 border border-amber-500/30 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-400 text-sm font-mono">{kpi.title}</span>
                            <div className={`${kpi.color} p-2 rounded-md bg-opacity-20`}>
                                {kpi.icon}
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-white font-mono">{kpi.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Submissions Chart */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-medium text-gray-400 font-mono">// project submissions</h3>
                        <TrendingUp className="h-5 w-5 text-amber-400" />
                    </div>

                    <div className="h-64 flex items-end justify-between mt-2">
                        {projectTrend.map((value, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div
                                    className="w-10 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-md mx-1 relative"
                                    style={{ height: `${value * 2}px` }}
                                >
                                    <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white font-mono">
                                        {value}
                                    </span>
                                </div>
                                <span className="text-gray-400 text-xs mt-2 font-mono">{months[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Status Distribution */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-medium text-gray-400 font-mono">// project status distribution</h3>
                        <PieChart className="h-5 w-5 text-amber-400" />
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="relative h-48 w-48">
                            {/* Dynamic pie chart using SVG */}
                            <svg viewBox="0 0 100 100" className="h-full w-full">
                                {stats.acceptedProjects > 0 && (
                                    <circle
                                        cx="50" cy="50" r="40"
                                        fill="transparent"
                                        stroke="#10B981"
                                        strokeWidth="20"
                                        strokeDasharray={`${acceptedPercent * 2.51} 251.3`}
                                    />
                                )}
                                {stats.pendingProjects > 0 && (
                                    <circle
                                        cx="50" cy="50" r="40"
                                        fill="transparent"
                                        stroke="#F59E0B"
                                        strokeWidth="20"
                                        strokeDasharray={`${pendingPercent * 2.51} 251.3`}
                                        strokeDashoffset={`-${acceptedPercent * 2.51}`}
                                    />
                                )}
                                {stats.rejectedProjects > 0 && (
                                    <circle
                                        cx="50" cy="50" r="40"
                                        fill="transparent"
                                        stroke="#EF4444"
                                        strokeWidth="20"
                                        strokeDasharray={`${rejectedPercent * 2.51} 251.3`}
                                        strokeDashoffset={`-${(acceptedPercent + pendingPercent) * 2.51}`}
                                    />
                                )}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white font-mono">{stats.totalProjects}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-6">
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-sm bg-green-500 mr-2"></div>
                            <span className="text-xs text-gray-400 font-mono">.approved ({acceptedPercent}%)</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-sm bg-amber-500 mr-2"></div>
                            <span className="text-xs text-gray-400 font-mono">.pending ({pendingPercent}%)</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 rounded-sm bg-red-500 mr-2"></div>
                            <span className="text-xs text-gray-400 font-mono">.rejected ({rejectedPercent}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// popular categories</h3>
                    <BarChart className="h-5 w-5 text-amber-400" />
                </div>

                <div className="space-y-4">
                    {categoryData.length > 0 ?
                        categoryData.map((category, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-white font-mono">{category.name}</span>
                                    <span className="text-gray-400 font-mono">{category.percent}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-700 rounded-full">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                                        style={{ width: `${category.percent}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))
                        :
                        <p className="text-center text-gray-400 py-4 font-mono">// no category data available</p>
                    }
                </div>
            </div>

            {/* Background pattern */}
            <div className="fixed inset-0 opacity-3 pointer-events-none z-[-1]"
                 style={{
                     backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                     backgroundSize: "112px 200px"
                 }}>
            </div>
        </div>
    );
}