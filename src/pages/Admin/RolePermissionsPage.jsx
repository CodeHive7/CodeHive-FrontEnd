import { useState, useEffect } from "react";
import {
    fetchRoles,
    fetchPermissions,
    assignPermissions,
    removePermissions,
    createRole,
    updateRole,
    deleteRole
} from "../../services/adminService/adminService.js";
import { useDrop } from "react-dnd";
import { Trash2, PlusCircle, ChevronDown, ChevronUp, Check, X, Pencil, Shield } from "lucide-react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Swal from "sweetalert2";

export default function RolePermissionsPage() {
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

    useEffect(() => {
        loadRoles();
        loadPermissions();
    }, []);

    const loadRoles = async () => {
        try {
            const data = await fetchRoles();
            setRoles(data);
        } catch (error) {
            console.error("Error loading roles", error);
        }
    };

    const loadPermissions = async () => {
        try {
            const data = await fetchPermissions();
            setPermissions(data);
        } catch (error) {
            console.error("Error loading permissions", error);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white mb-6">🐝 Role Permissions</h2>

                {/* Permissions List */}
                <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Available Permissions</h3>
                        <Shield className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="p-6 pt-2">
                        <div className="flex flex-wrap gap-3">
                            {permissions.map((perm) => (
                                <DraggablePermission key={perm} name={perm} />
                            ))}

                            {permissions.length === 0 && (
                                <div className="py-4 text-center text-gray-400 w-full">
                                    No permissions available
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Roles Section */}
                <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400">Manage Roles</h3>
                        <button
                            onClick={() => setIsRoleModalOpen(true)}
                            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md flex items-center transition-colors"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Create Role
                        </button>
                    </div>
                    <div className="p-6 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {roles.map((role) => (
                                <RoleCard key={role.id} role={role} refresh={loadRoles} />
                            ))}

                            {roles.length === 0 && (
                                <div className="py-4 text-center text-gray-400 col-span-3">
                                    No roles found. Create a role to get started.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Role Creation Modal */}
            {isRoleModalOpen && <CreateRoleModal onClose={() => setIsRoleModalOpen(false)} refresh={loadRoles} />}
        </DndProvider>
    );
}

// Draggable Permission Component
const DraggablePermission = ({ name }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "PERMISSION",
        item: { name },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            className={`cursor-pointer bg-gray-800 border border-yellow-500 text-white px-4 py-2 rounded-md text-sm transition transform hover:scale-105 shadow-md ${
                isDragging ? "opacity-50" : "opacity-100"
            }`}
        >
            {name}
        </div>
    );
};

// Role Card Component (Drop Target)
const RoleCard = ({ role, refresh }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "PERMISSION",
        drop: (item) => handleAssignPermission(item.name),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    const [expanded, setExpanded] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedRoleName, setEditedRoleName] = useState(role.name);
    const visiblePermissions = expanded ? role.permissions : role.permissions.slice(0, 5);

    const handleAssignPermission = async (permission) => {
        if (!role.permissions.includes(permission)) {
            await assignPermissions(role.id, [permission], refresh);
        }
    };

    const handleRemovePermission = async (permission) => {
        await removePermissions(role.id, [permission], refresh);
    };

    const handleUpdateRole = async () => {
        if (!editedRoleName.trim() || editedRoleName === role.name) {
            setEditMode(false);
            return;
        }
        await updateRole(role.id, editedRoleName, refresh);
        setEditMode(false);
    };

    const handleDeleteRole = async () => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: `Do you want to delete the role "${role.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
        });

        if(result.isConfirmed) {
            await deleteRole(role.id, refresh);
            Swal.fire({
                icon: "success",
                title: "Role Deleted",
                text: "The role has been deleted successfully.",
                timer: 2000,
                showConfirmButton: false,
            });
        }
    };

    return (
        <div
            ref={drop}
            className={`bg-[#222435] p-5 rounded-md shadow-md border transition-all ${
                isOver ? "border-blue-500 scale-105" : "border-yellow-500"
            }`}
        >
            <div className="flex justify-between items-center">
                {editMode ? (
                    <input
                        type="text"
                        value={editedRoleName}
                        onChange={(e) => setEditedRoleName(e.target.value)}
                        className="bg-gray-800 text-white px-2 py-1 rounded-md focus:outline-none focus:border-yellow-500 w-3/4"
                    />
                ) : (
                    <h2 className="text-lg font-bold text-white">{role.name}</h2>
                )}
                <div className="flex space-x-2">
                    {editMode ? (
                        <>
                            <button onClick={handleUpdateRole} className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full">
                                <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditMode(false)} className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full">
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditMode(true)} className="p-1.5 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full">
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={handleDeleteRole} className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                {visiblePermissions.map((perm) => (
                    <div key={perm} className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-md text-sm flex items-center space-x-2">
                        <span>{perm}</span>
                        <button onClick={() => handleRemovePermission(perm)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {role.permissions.length === 0 && (
                    <p className="text-gray-400 text-sm">Drag permissions here to assign them to this role</p>
                )}
            </div>

            {role.permissions.length > 5 && (
                <button
                    className="mt-3 text-yellow-400 hover:text-yellow-300 flex items-center space-x-1 transition"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>{expanded ? "Show less" : `Show ${role.permissions.length - 5} more`}</span>
                </button>
            )}
        </div>
    );
};

// Create Role Modal Component
const CreateRoleModal = ({ onClose, refresh }) => {
    const [roleName, setRoleName] = useState("");

    const handleCreateRole = async () => {
        if (!roleName.trim()) return;
        await createRole(roleName, refresh);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50">
            <div className="bg-[#1C1F2E] p-6 rounded-lg shadow-lg w-96 border border-yellow-500 transform transition-all scale-100 opacity-100">
                <h2 className="text-xl font-semibold text-white mb-4">Create New Role</h2>
                <input
                    type="text"
                    className="w-full p-3 mb-4 border bg-gray-800 text-white rounded-md border-gray-700 focus:border-yellow-500 focus:outline-none"
                    placeholder="Role Name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                />
                <button
                    className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-md w-full transition font-semibold"
                    onClick={handleCreateRole}
                >
                    Create Role
                </button>
                <button
                    className="mt-3 text-gray-400 hover:text-white w-full text-center transition"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};