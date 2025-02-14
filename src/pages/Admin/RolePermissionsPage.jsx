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
import { Trash2, PlusCircle, ChevronDown, ChevronUp, Check, X, Pencil } from "lucide-react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
            <div className="p-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Role Permissions</h1>
                    <button
                        onClick={() => setIsRoleModalOpen(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md flex items-center transition"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Create Role
                    </button>
                </div>

                {/* Permissions List */}
                <div className="flex flex-wrap gap-3 bg-[#1C1F2E] p-4 rounded-md border border-gray-700 mb-6">
                    {permissions.map((perm) => (
                        <DraggablePermission key={perm} name={perm} />
                    ))}
                </div>

                {/* Role Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                        <RoleCard key={role.id} role={role} refresh={loadRoles} />
                    ))}
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
            className={`cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition transform hover:scale-105 shadow-md ${
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
        if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            await deleteRole(role.id, refresh);
        }
    };

    return (
        <div ref={drop} className={`bg-[#1C1F2E] p-5 rounded-md shadow-md border transition-all ${isOver ? "border-blue-500 scale-105" : "border-gray-700"}`}>
            <div className="flex justify-between items-center">
                {editMode ? (
                    <input
                        type="text"
                        value={editedRoleName}
                        onChange={(e) => setEditedRoleName(e.target.value)}
                        className="bg-gray-800 text-white px-2 py-1 rounded-md focus:outline-none w-3/4"
                    />
                ) : (
                    <h2 className="text-lg font-bold text-white">{role.name}</h2>
                )}
                <div className="flex space-x-2">
                    {editMode ? (
                        <>
                            <button onClick={handleUpdateRole} className="text-green-500 hover:text-green-700">
                                <Check className="w-5 h-5" />
                            </button>
                            <button onClick={() => setEditMode(false)} className="text-red-500 hover:text-red-700">
                                <X className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setEditMode(true)} className="text-blue-500 hover:text-blue-700">
                                <Pencil className="w-5 h-5" />
                            </button>
                            <button onClick={handleDeleteRole} className="text-red-500 hover:text-red-700">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                {visiblePermissions.map((perm) => (
                    <div key={perm} className="bg-green-500/10 text-green-500 px-3 py-1 rounded-md text-sm flex items-center space-x-2">
                        <span>{perm}</span>
                        <button onClick={() => handleRemovePermission(perm)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {role.permissions.length > 5 && (
                <button className="mt-3 text-blue-500 hover:text-blue-400 flex items-center space-x-1 transition" onClick={() => setExpanded(!expanded)}>
                    {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <div className="bg-[#1C1F2E] p-6 rounded-md shadow-md w-96 border border-gray-700 transform transition-all scale-100 opacity-100">
                <h2 className="text-xl font-semibold text-white mb-4">Create New Role</h2>
                <input
                    type="text"
                    className="w-full p-2 mb-4 border bg-gray-800 text-white rounded"
                    placeholder="Role Name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition" onClick={handleCreateRole}>
                    Create Role
                </button>
                <button className="mt-2 text-red-500 hover:text-red-700 w-full text-center transition" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};
