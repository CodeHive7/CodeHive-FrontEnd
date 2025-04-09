import { useState } from "react";
import { Settings, Moon, Sun, Bell, Shield, Database, Save, Terminal, Code } from "lucide-react";

export default function SettingsPage() {
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">admin</span>
                <span className="text-white">.settings</span>
                <span className="text-amber-400">.config()</span>
            </h2>

            {/* General Settings */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// general settings</h3>
                    <Settings className="h-5 w-5 text-amber-400" />
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Terminal className="w-5 h-5 text-amber-500 mr-3" />
                                <div>
                                    <p className="font-mono text-white">theme.mode</p>
                                    <p className="text-xs text-gray-400 font-mono">// toggle between dark and light</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`px-4 py-2 rounded-md flex items-center font-mono ${
                                    darkMode ? 'bg-amber-500 text-black' : 'bg-gray-700 text-gray-300'
                                }`}
                            >
                                {darkMode ? (
                                    <>
                                        <Moon className="w-4 h-4 mr-2" /> "dark"
                                    </>
                                ) : (
                                    <>
                                        <Sun className="w-4 h-4 mr-2" /> "light"
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Notifications Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Bell className="w-5 h-5 text-amber-500 mr-3" />
                                <div>
                                    <p className="font-mono text-white">notifications.enabled</p>
                                    <p className="text-xs text-gray-400 font-mono">// receive system notifications</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`px-4 py-2 rounded-md font-mono ${
                                    notifications ? 'bg-amber-500 text-black' : 'bg-gray-700 text-gray-300'
                                }`}
                            >
                                {notifications ? 'true' : 'false'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Settings */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// system settings</h3>
                    <Database className="h-5 w-5 text-amber-400" />
                </div>
                <div className="p-6">
                    <div className="space-y-6">
                        {/* Maintenance Mode */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Shield className="w-5 h-5 text-amber-500 mr-3" />
                                <div>
                                    <p className="font-mono text-white">system.maintenanceMode</p>
                                    <p className="text-xs text-gray-400 font-mono">// disable public access</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setMaintenanceMode(!maintenanceMode)}
                                className={`px-4 py-2 rounded-md font-mono ${
                                    maintenanceMode ? 'bg-amber-500 text-black' : 'bg-gray-700 text-gray-300'
                                }`}
                            >
                                {maintenanceMode ? 'true' : 'false'}
                            </button>
                        </div>

                        {/* API Key */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Code className="w-5 h-5 text-amber-500 mr-3" />
                                <div>
                                    <p className="font-mono text-white">api.key</p>
                                    <p className="text-xs text-gray-400 font-mono">// secure authentication token</p>
                                </div>
                            </div>
                            <div className="bg-gray-800 px-4 py-2 rounded-md font-mono text-gray-400 max-w-sm overflow-x-auto text-xs">
                                "that's not available yet"
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end mt-8">
                            <button className="flex items-center bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md transition-colors font-mono">
                                <Save className="w-4 h-4 mr-2" /> settings.save()
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}