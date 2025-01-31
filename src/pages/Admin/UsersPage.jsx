const UsersPage = () => {
    const users = [
        { name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
        { name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
    ];

    return (
        <div className="text-white">
            <h2 className="text-2xl font-bold">Manage Users</h2>
            <div className="mt-6 overflow-auto">
                <table className="w-full text-sm border-collapse border border-gray-800">
                    <thead className="bg-gray-900">
                    <tr>
                        <th className="p-3 border border-gray-700">Name</th>
                        <th className="p-3 border border-gray-700">Email</th>
                        <th className="p-3 border border-gray-700">Role</th>
                        <th className="p-3 border border-gray-700">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, i) => (
                        <tr key={i} className="hover:bg-gray-800">
                            <td className="p-3 border border-gray-700">{user.name}</td>
                            <td className="p-3 border border-gray-700">{user.email}</td>
                            <td className="p-3 border border-gray-700">{user.role}</td>
                            <td className="p-3 border border-gray-700">{user.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;
