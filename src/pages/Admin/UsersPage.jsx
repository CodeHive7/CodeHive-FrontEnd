import { UserPlus, Trash2, ShieldCheck, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUsers , blockUser , unblockUser} from "../../services/adminService/adminService.js";
import UserModal from "./UserModal.jsx";
import RoleModal from "./RoleModal.jsx";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser , setSelectedUser] = useState(null);
    const [isRoleModalOpen , setIsRoleModalOpen] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await fetchUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error loading users", error);
        }
    };

    const handleBanUnban = async (user) => {
        if(user.status === "Active") {
            await blockUser(user.id, loadUsers);
        } else {
            await unblockUser(user.id, loadUsers);
        }
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setIsRoleModalOpen(true);
    };

    const openUserModal = () => setIsUserModalOpen(true);
    const closeUserModal = () => setIsUserModalOpen(false);

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Users</h1>
                <button
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md inline-flex items-center"
                    onClick={openUserModal} // Open modal on click
                >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                </button>
            </div>

            <div className="mt-6 bg-[#1C1F2E] border-gray-700 rounded-lg shadow-sm">
                <div className="p-6 pb-2 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-400">All Users</h3>
                </div>
                <div className="p-6 pt-0">
                    <table className="w-full text-sm text-white">
                        <thead className="border-b border-gray-700">
                        <tr className="text-left">
                            <th className="h-12 px-4 text-gray-400 font-medium">Name</th>
                            <th className="h-12 px-4 text-gray-400 font-medium">Email</th>
                            <th className="h-12 px-4 text-gray-400 font-medium">Role</th>
                            <th className="h-12 px-4 text-gray-400 font-medium">Status</th>
                            <th className="h-12 px-4 text-gray-400 font-medium">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, i) => (
                            <tr
                                key={i}
                                className="border-b border-gray-700 hover:bg-gray-900/50 transition-colors"
                            >
                                <td className="p-4">{user.username}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.roles.length > 0 ? user.roles.join(", ") : "No Role"}</td>
                                <td className="p-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                            user.status === "Active" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center space-x-3">
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleBanUnban(user)}
                                    >
                                        {user.status === "Active" ? <Trash2 className="w-5 h-5"/> :
                                            <ShieldCheck className="w-5 h-5"/>}
                                    </button>
                                    <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => openRoleModal(user)}
                                    >
                                        <Pencil className="w-5 h-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} refresh={loadUsers}/>
            {setSelectedUser && (
                <RoleModal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} user={selectedUser} refresh={loadUsers}/>
            )}
        </div>
    );
}
