import { useState } from "react";
import { createUser } from "../../services/adminService/adminService.js";

export default function UserModal({ isOpen, onClose, refresh }) {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");

    if (!isOpen) return null;

    const handleCreateUser = async () => {
        await createUser({ fullName,username, email, password, roles: [role] }, refresh);
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md">
            <div
                className="bg-[#1C1F2E] p-6 rounded-md shadow-md w-96 border border-gray-700 transform transition-all scale-100 opacity-100">
                <h2 className="text-xl font-semibold text-white mb-4">Add New User</h2>
                <input type="text" className="w-full p-2 mb-2 border bg-gray-800 text-white rounded"
                       placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                <input type="text" className="w-full p-2 mb-2 border bg-gray-800 text-white rounded"
                       placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
                <input type="email" className="w-full p-2 mb-2 border bg-gray-800 text-white rounded"
                       placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <input type="password" className="w-full p-2 mb-2 border bg-gray-800 text-white rounded"
                       placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                <select className="w-full p-2 mb-4 border bg-gray-800 text-white rounded" value={role}
                        onChange={(e) => setRole(e.target.value)}>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                        onClick={handleCreateUser}>Create User
                </button>
                <button className="mt-2 text-red-500 hover:text-red-700 w-full text-center" onClick={onClose}>Cancel
                </button>
            </div>
        </div>
    );
}
