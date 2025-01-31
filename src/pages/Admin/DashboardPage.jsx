import { Users, ArrowUpRight, ArrowDownRight, Activity, DollarSign } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Overview</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="bg-[#1C1F2E] border-gray-700 rounded-lg shadow-sm">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Total Users</h3>
                        <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">2,853</div>
                            <div className="flex items-center gap-1 text-green-500 text-sm">
                                <ArrowUpRight className="h-4 w-4" />
                                12.5%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">+180 this week</p>
                    </div>
                </div>

                <div className="bg-[#1C1F2E] border-gray-700 rounded-lg shadow-sm">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Active Projects</h3>
                        <Activity className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">148</div>
                            <div className="flex items-center gap-1 text-red-500 text-sm">
                                <ArrowDownRight className="h-4 w-4" />
                                8.2%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">-12 this week</p>
                    </div>
                </div>

                <div className="bg-[#1C1F2E] border-gray-700 rounded-lg shadow-sm">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Total Revenue</h3>
                        <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">$45,231</div>
                            <div className="flex items-center gap-1 text-green-500 text-sm">
                                <ArrowUpRight className="h-4 w-4" />
                                23.1%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">+$5,000 this month</p>
                    </div>
                </div>

                <div className="bg-[#1C1F2E] border-gray-700 rounded-lg shadow-sm">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Active Users</h3>
                        <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="p-6 pt-0">
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-white">892</div>
                            <div className="flex items-center gap-1 text-green-500 text-sm">
                                <ArrowUpRight className="h-4 w-4" />
                                9.3%
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">+48 this hour</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="bg-[#1C1F2E] border-gray-700 rounded-lg shadow-sm lg:col-span-4">
                    <div className="p-6">
                        <h3 className="text-white">Performance Overview</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="h-[350px] flex items-center justify-center text-gray-400">Chart will be rendered here</div>
                    </div>
                </div>

                <div className="bg-[#1C1F2E] border-gray-700 rounded-lg shadow-sm lg:col-span-3">
                    <div className="p-6">
                        <h3 className="text-white">Recent Activities</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <div className="space-y-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-purple-600 mr-4" />
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm text-white">New user registered</p>
                                        <p className="text-xs text-gray-400">2 minutes ago</p>
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