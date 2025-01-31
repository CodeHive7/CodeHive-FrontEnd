import { UserPlus } from "lucide-react";

export default function UsersPage() {
    const users = [
        {
            name: "John Doe",
            email: "john@example.com",
            role: "Admin",
            status: "Active",
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            role: "User",
            status: "Active",
        },
        // Add more users as needed
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Users</h1>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                </button>
            </div>

            <div className="bg-[#12141F] border border-gray-800 rounded-lg shadow-sm">
                <div className="p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">All Users</h3>
                </div>
                <div className="p-6 pt-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="border-b border-gray-800">
                            <tr className="text-left">
                                <th className="h-12 px-4 text-gray-400 align-middle font-medium">Name</th>
                                <th className="h-12 px-4 text-gray-400 align-middle font-medium">Email</th>
                                <th className="h-12 px-4 text-gray-400 align-middle font-medium">Role</th>
                                <th className="h-12 px-4 text-gray-400 align-middle font-medium">Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, i) => (
                                <tr key={i} className="border-b border-gray-800 transition-colors hover:bg-gray-900/50">
                                    <td className="p-4">{user.name}</td>
                                    <td className="p-4">{user.email}</td>
                                    <td className="p-4">{user.role}</td>
                                    <td className="p-4">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-500/10 text-green-500">
                        {user.status}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}