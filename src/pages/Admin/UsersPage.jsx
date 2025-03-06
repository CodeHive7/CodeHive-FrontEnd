import { UserPlus, Trash2, ShieldCheck, Pencil, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchUsers, blockUser, unblockUser } from "../../services/adminService/adminService.js";
import UserModal from "./UserModal.jsx";
import RoleModal from "./RoleModal.jsx";
import Swal from "sweetalert2";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

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
        const action = user.status === "Active" ? "block" : "unblock";

        const result = await Swal.fire({
            title: `${action === "block" ? "Block" : "Unblock"} User?`,
            text: `Are you sure you want to ${action} ${user.username}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: action === "block" ? "#d33" : "#3085d6",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Yes, ${action} user!`
        });

        if (result.isConfirmed) {
            try {
                if (action === "block") {
                    await blockUser(user.id, loadUsers);
                } else {
                    await unblockUser(user.id, loadUsers);
                }

                Swal.fire({
                    icon: "success",
                    title: `User ${action === "block" ? "Blocked" : "Unblocked"}`,
                    text: `${user.username} has been ${action === "block" ? "blocked" : "unblocked"} successfully.`,
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Operation Failed",
                    text: error.response?.data || `Failed to ${action} user. Please try again.`,
                });
            }
        }
    };

    const openRoleModal = (user) => {
        setSelectedUser(user);
        setIsRoleModalOpen(true);
    };

    const openUserModal = () => setIsUserModalOpen(true);
    const closeUserModal = () => setIsUserModalOpen(false);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">🐝 User Management</h2>

            {/* User Management Actions */}
            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400">Manage Users</h3>
                    <button
                        className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md flex items-center transition-colors"
                        onClick={openUserModal}
                    >
                        <UserPlus className="w-5 h-5 mr-2" /> Add User
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400">All Users</h3>
                    <Users className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="p-6 pt-0">
                    <div className="overflow-x-auto">
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
                                            className={`p-1.5 rounded-full ${
                                                user.status === "Active"
                                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                                    : "bg-green-600 hover:bg-green-700 text-white"
                                            }`}
                                            onClick={() => handleBanUnban(user)}
                                        >
                                            {user.status === "Active" ?
                                                <Trash2 className="w-4 h-4"/> :
                                                <ShieldCheck className="w-4 h-4"/>
                                            }
                                        </button>
                                        <button
                                            className="p-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full"
                                            onClick={() => openRoleModal(user)}
                                        >
                                            <Pencil className="w-4 h-4"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-4 text-center text-gray-400">
                                        No users found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <UserModal isOpen={isUserModalOpen} onClose={closeUserModal} refresh={loadUsers}/>
            {selectedUser && (
                <RoleModal
                    isOpen={isRoleModalOpen}
                    onClose={() => setIsRoleModalOpen(false)}
                    user={selectedUser}
                    refresh={loadUsers}
                />
            )}
        </div>
    );
}