import { useState, useEffect } from "react";
import { assignRoles, removeRoles } from "../../services/adminService/adminService.js";
import { Shield, X, Check, UserCheck } from "lucide-react";
import Swal from "sweetalert2";

export default function RoleModal({ isOpen, onClose, user, refresh }) {
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [availableRoles, setAvailableRoles] = useState(["USER", "ADMIN", "SUPER_ADMIN"]);

    useEffect(() => {
        if (user) {
            setSelectedRoles(user.roles || []);
        }
    }, [user]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen || !user) return null;

    const toggleRole = (role) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    const handleSaveRoles = async () => {
        try {
            // Find roles to add (in selectedRoles but not in user.roles)
            const rolesToAdd = selectedRoles.filter(role => !user.roles.includes(role));
            // Find roles to remove (in user.roles but not in selectedRoles)
            const rolesToRemove = user.roles.filter(role => !selectedRoles.includes(role));

            if (rolesToAdd.length > 0) {
                await assignRoles(user.id, rolesToAdd, refresh);
            }

            if (rolesToRemove.length > 0) {
                await removeRoles(user.id, rolesToRemove, refresh);
            }

            Swal.fire({
                icon: "success",
                title: "Roles Updated",
                text: "User roles have been updated successfully!",
                timer: 2000,
                showConfirmButton: false
            });
            onClose();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: "Failed to update user roles."
            });
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1C1F2E] rounded-xl shadow-2xl border-2 border-yellow-500 w-full max-w-sm overflow-hidden transform transition-all duration-300 scale-100">
                {/* Honeycomb pattern background */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                     style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23EAB308' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")"}}></div>

                {/* Header */}
                <div className="relative bg-gradient-to-r from-yellow-500 to-amber-500 p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-black" />
                            <h2 className="text-lg font-bold text-black">User Roles</h2>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                            <X className="w-4 h-4 text-black" />
                        </button>
                    </div>
                </div>

                {/* User info */}
                <div className="p-4 bg-yellow-500/10 border-b border-yellow-500/20">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                            <UserCheck className="h-5 w-5 text-black" />
                        </div>
                        <div className="ml-3">
                            <p className="font-medium text-white">{user.username}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Role selection */}
                <div className="p-6">
                    <label className="block text-sm font-medium text-gray-400 mb-3">Select Roles</label>
                    <div className="space-y-2">
                        {availableRoles.map((role) => (
                            <div
                                key={role}
                                onClick={() => toggleRole(role)}
                                className={`cursor-pointer rounded-md border p-3 flex items-center transition-all ${
                                    selectedRoles.includes(role)
                                        ? "border-yellow-500 bg-yellow-500/10"
                                        : "border-gray-700 hover:border-gray-500"
                                }`}
                            >
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mr-3 ${
                                    selectedRoles.includes(role) ? "border-yellow-500 bg-yellow-500" : "border-gray-400"
                                }`}>
                                    {selectedRoles.includes(role) && (
                                        <Check className="w-3 h-3 text-black" />
                                    )}
                                </div>
                                <span className="text-white">{role}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-900/40 p-4 flex justify-between">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveRoles}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-md flex items-center text-sm"
                    >
                        <Check className="w-4 h-4 mr-1" />
                        Save Roles
                    </button>
                </div>
            </div>
        </div>
    );
}