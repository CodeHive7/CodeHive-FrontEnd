import { useState, useEffect } from "react";
import { assignRoles, removeRoles } from "../../services/adminService/adminService.js";

export default function RoleModal({ isOpen, onClose, user, refresh }) {
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [availableRoles, setAvailableRoles] = useState(["USER", "ADMIN", "SUPER_ADMIN"]);

    useEffect(() => {
        if (user) {
            setSelectedRoles(user.roles || []);
        }
    }, [user]);

    if (!isOpen || !user) return null;

    const handleAssignRole = async () => {
        await assignRoles(user.id, selectedRoles, refresh);
        onClose();
    };

    const handleRemoveRole = async () => {
        await removeRoles(user.id, selectedRoles, refresh);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md">
            <div className="bg-[#1C1F2E] p-6 rounded-md shadow-md w-96 border border-gray-700 transform transition-all scale-100 opacity-100">
                <h2 className="text-xl font-semibold text-white mb-4">Manage Roles for {user.username}</h2>

                <select
                    className="w-full p-2 mb-4 border bg-gray-800 text-white rounded"
                    multiple
                    value={selectedRoles}
                    onChange={(e) => setSelectedRoles(Array.from(e.target.selectedOptions, (option) => option.value))}
                >
                    {availableRoles.map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>

                <div className="flex justify-between">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full mr-2" onClick={handleAssignRole}>
                        Assign Role
                    </button>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full" onClick={handleRemoveRole}>
                        Remove Role
                    </button>
                </div>

                <button className="mt-4 text-gray-400 hover:text-white w-full text-center" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}
