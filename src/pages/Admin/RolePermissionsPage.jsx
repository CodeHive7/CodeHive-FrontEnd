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
                <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                    <span className="text-amber-500">admin</span>
                    <span className="text-white">.roles</span>
                    <span className="text-amber-400">.permissions()</span>
                </h2>

                {/* Permissions List */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400 font-mono">// available permissions</h3>
                        <Shield className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="p-6 pt-2">
                        <div className="flex flex-wrap gap-3">
                            {permissions.map((perm) => (
                                <DraggablePermission key={perm} name={perm} />
                            ))}

                            {permissions.length === 0 && (
                                <div className="py-4 text-center text-gray-400 w-full font-mono">
                                    permissions.length === 0
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Roles Section */}
                <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                    <div className="flex flex-row items-center justify-between p-6 pb-2">
                        <h3 className="text-sm font-medium text-gray-400 font-mono">// manage roles</h3>
                        <button
                            onClick={() => setIsRoleModalOpen(true)}
                            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md flex items-center transition-colors font-mono"
                        >
                            <PlusCircle className="w-5 h-5 mr-2" />
                            role.create()
                        </button>
                    </div>
                    <div className="p-6 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {roles.map((role) => (
                                <RoleCard key={role.id} role={role} refresh={loadRoles} />
                            ))}

                            {roles.length === 0 && (
                                <div className="py-4 text-center text-gray-400 col-span-3 font-mono">
                                    roles.length === 0
                                    <p className="text-sm mt-1">// create a role to get started</p>
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
            className={`cursor-pointer bg-gray-800 border border-amber-500/30 text-white px-4 py-2 rounded-md text-sm transition transform hover:scale-105 shadow-md font-mono ${
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
            title: "Confirm Deletion",
            text: `role.delete("${role.name}") will permanently remove this role.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "role.delete()",
            cancelButtonText: "cancel()",
            background: "#111827",
            color: "#FFFFFF"
        });

        if(result.isConfirmed) {
            await deleteRole(role.id, refresh);
            Swal.fire({
                icon: "success",
                title: "Operation Complete",
                text: "role.delete() executed successfully",
                timer: 2000,
                showConfirmButton: false,
                background: "#111827",
                color: "#FFFFFF"
            });
        }
    };

    return (
        <div
            ref={drop}
            className={`bg-gray-950 p-5 rounded-md shadow-md border transition-all ${
                isOver ? "border-blue-500 scale-105" : "border-amber-500/30"
            }`}
        >
            <div className="flex justify-between items-center">
                {editMode ? (
                    <input
                        type="text"
                        value={editedRoleName}
                        onChange={(e) => setEditedRoleName(e.target.value)}
                        className="bg-gray-800 text-white px-2 py-1 rounded-md focus:outline-none focus:border-amber-500 w-3/4 font-mono"
                    />
                ) : (
                    <h2 className="text-lg font-bold text-white font-mono">{role.name}</h2>
                )}
                <div className="flex space-x-2">
                    {editMode ? (
                        <>
                            <button 
                                onClick={handleUpdateRole} 
                                className="p-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md"
                                title="Save Changes"
                            >
                                <Check className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => setEditMode(false)} 
                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                title="Cancel"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => setEditMode(true)} 
                                className="p-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-md"
                                title="Edit Role"
                            >
                                <Pencil className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={handleDeleteRole} 
                                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md"
                                title="Delete Role"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                {visiblePermissions.map((perm) => (
                    <div key={perm} className="bg-amber-500/10 text-amber-400 px-3 py-1 rounded-md text-sm flex items-center space-x-2 font-mono">
                        <span>{perm}</span>
                        <button onClick={() => handleRemovePermission(perm)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {role.permissions.length === 0 && (
                    <p className="text-gray-400 text-sm font-mono">// drag permissions here to assign</p>
                )}
            </div>

            {role.permissions.length > 5 && (
                <button
                    className="mt-3 text-amber-400 hover:text-amber-300 flex items-center space-x-1 transition font-mono"
                    onClick={() => setExpanded(!expanded)}
                >
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>{expanded ? "permissions.collapse()" : `permissions.expand(${role.permissions.length - 5})`}</span>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
            <div className="bg-gray-900 rounded-lg shadow-2xl border border-amber-500/30 w-full max-w-sm overflow-hidden">
                {/* Header */}
                <div className="relative bg-amber-500 p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Shield className="h-5 w-5 mr-2 text-black" />
                            <h2 className="text-lg font-bold text-black font-mono">role.create()</h2>
                        </div>
                        <button onClick={onClose} className="p-1 rounded-md bg-black/20 hover:bg-black/40 transition-colors">
                            <X className="w-4 h-4 text-black" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <input
                        type="text"
                        className="w-full p-3 mb-4 border bg-gray-800 text-white rounded-md border-gray-700 focus:border-amber-500 focus:outline-none font-mono"
                        placeholder="role.name"
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                    <div className="flex justify-end mt-6 space-x-3">
                        <button
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-mono"
                            onClick={onClose}
                        >
                            cancel()
                        </button>
                        <button
                            className="bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-md transition-colors font-mono"
                            onClick={handleCreateRole}
                        >
                            create()
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};