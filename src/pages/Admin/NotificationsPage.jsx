import { useState } from "react";
import { Bell, User, Check, Trash2, AlertCircle, CheckCircle, Clock, Filter } from "lucide-react";

export default function NotificationsPage() {
    const [filter, setFilter] = useState("all");
    
    // Example notification data
    const notifications = [
        {
            id: 1,
            type: "info",
            message: "user.register('john_dev')",
            timestamp: "10 minutes ago",
        },
        {
            id: 2,
            type: "warning",
            message: "project.submissionFailed()",
            timestamp: "1 hour ago",
        },
        {
            id: 3,
            type: "success",
            message: "payment.confirmed(250)",
            timestamp: "3 hours ago",
        },
        {
            id: 4,
            type: "error",
            message: "system.error('Database connection failed')",
            timestamp: "1 day ago",
        }
    ];

    const filteredNotifications = filter === "all" 
        ? notifications 
        : notifications.filter(n => n.type === filter);

    const getIcon = (type) => {
        switch (type) {
            case "info": return <User className="w-5 h-5 text-blue-500" />;
            case "warning": return <AlertCircle className="w-5 h-5 text-amber-500" />;
            case "success": return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "error": return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Bell className="w-5 h-5 text-amber-500" />;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">admin</span>
                <span className="text-white">.notifications</span>
                <span className="text-amber-400">.getAll()</span>
            </h2>

            {/* Filters */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// apply filters</h3>
                    <Filter className="h-5 w-5 text-amber-400" />
                </div>
                <div className="p-6">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {[
                            { id: "all", label: "notifications.all()" },
                            { id: "info", label: "notifications.info()" },
                            { id: "warning", label: "notifications.warning()" },
                            { id: "success", label: "notifications.success()" },
                            { id: "error", label: "notifications.error()" }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setFilter(item.id)}
                                className={`px-4 py-2 rounded-md whitespace-nowrap font-mono text-sm ${
                                    filter === item.id 
                                    ? 'bg-amber-500 text-black' 
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// notification messages</h3>
                    <div className="flex items-center">
                        <Bell className="h-4 w-4 text-amber-400 mr-2" />
                        <span className="text-xs text-amber-400/70 font-mono">array.length: {filteredNotifications.length}</span>
                    </div>
                </div>
                <div className="p-6 pt-2">
                    <div className="space-y-4">
                        {filteredNotifications.map((notification) => (
                            <div key={notification.id} className="bg-gray-800 rounded-md p-4 border border-amber-500/10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center">
                                        {getIcon(notification.type)}
                                        <span className="ml-3 font-mono text-white">{notification.message}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded-md transition-colors">
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center text-xs text-gray-400 font-mono">
                                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                                    <span>// {notification.timestamp}</span>
                                </div>
                            </div>
                        ))}

                        {filteredNotifications.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-amber-500/20 rounded-lg">
                                <div className="bg-amber-500/10 p-3 rounded-full mb-3">
                                    <Bell className="w-6 h-6 text-amber-500/70" />
                                </div>
                                <p className="text-gray-400 text-center font-mono">notifications.{filter}.length === 0</p>
                                <p className="text-gray-500 text-sm mt-1 font-mono">// no notifications found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}