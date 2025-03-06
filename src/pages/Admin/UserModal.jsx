import { useState, useEffect } from "react";
import { createUser } from "../../services/adminService/adminService.js";
import { UserPlus, X, Check, AlertCircle, User, Mail, Lock, Shield } from "lucide-react";
import Swal from "sweetalert2";

export default function UserModal({ isOpen, onClose, refresh }) {
    const [formData, setFormData] = useState({
        fullName: "", username: "", email: "", password: "", role: "USER"
    });
    const [errors, setErrors] = useState({});
    const [step, setStep] = useState(1);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setStep(1); // Reset step when opening modal
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => document.body.style.overflow = 'unset';
    }, [isOpen]);

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = "Required";
        if (!formData.username.trim()) newErrors.username = "Required";
        if (!formData.email.trim()) newErrors.email = "Required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.password) newErrors.password = "Required";
        else if (formData.password.length < 6) newErrors.password = "Min 6 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                await createUser({
                    fullName: formData.fullName,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    roles: [formData.role]
                }, refresh);
                Swal.fire({
                    icon: "success",
                    title: "User Created!",
                    text: "New user added to the hive",
                    timer: 2000,
                    showConfirmButton: false,
                });
                onClose();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Creation Failed",
                    text: error.response?.data || "Failed to create user",
                });
            }
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (formData.fullName && formData.username) setStep(2);
            else validateForm();
        } else {
            handleSubmit();
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
                        <h2 className="text-lg font-bold text-black">New Hive Member</h2>
                        <button onClick={onClose} className="p-1 rounded-full bg-black/20 hover:bg-black/40 transition-colors">
                            <X className="w-4 h-4 text-black" />
                        </button>
                    </div>
                    <div className="flex justify-between mt-3 pb-1">
                        <div className={`h-1 rounded-full bg-black/60 flex-1 ${step === 1 ? "opacity-100" : "opacity-40"}`}></div>
                        <div className="w-2"></div>
                        <div className={`h-1 rounded-full bg-black/60 flex-1 ${step === 2 ? "opacity-100" : "opacity-40"}`}></div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {step === 1 ? (
                        <>
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-yellow-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                        className={`w-full pl-10 p-2.5 rounded-md border bg-gray-900 text-white focus:border-yellow-500 focus:ring-0 ${errors.fullName ? 'border-red-500' : 'border-gray-700'}`}
                                        placeholder="Full Name"
                                    />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-yellow-500" />
                                    </div>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        className={`w-full pl-10 p-2.5 rounded-md border bg-gray-900 text-white focus:border-yellow-500 focus:ring-0 ${errors.username ? 'border-red-500' : 'border-gray-700'}`}
                                        placeholder="Username"
                                    />
                                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-yellow-500" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className={`w-full pl-10 p-2.5 rounded-md border bg-gray-900 text-white focus:border-yellow-500 focus:ring-0 ${errors.email ? 'border-red-500' : 'border-gray-700'}`}
                                        placeholder="Email Address"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-yellow-500" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        className={`w-full pl-10 p-2.5 rounded-md border bg-gray-900 text-white focus:border-yellow-500 focus:ring-0 ${errors.password ? 'border-red-500' : 'border-gray-700'}`}
                                        placeholder="Password"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="flex items-center mb-2">
                                        <Shield className="h-4 w-4 text-yellow-500 mr-2" />
                                        <span className="text-sm text-gray-400">Select Role</span>
                                    </label>
                                    <div className="flex space-x-3">
                                        <div
                                            className={`flex-1 cursor-pointer rounded-md border p-2 flex items-center justify-center transition-colors ${
                                                formData.role === "USER" ? "border-yellow-500 bg-yellow-500/10" : "border-gray-700"
                                            }`}
                                            onClick={() => setFormData({...formData, role: "USER"})}
                                        >
                                            <span className="text-sm text-white">User</span>
                                        </div>
                                        <div
                                            className={`flex-1 cursor-pointer rounded-md border p-2 flex items-center justify-center transition-colors ${
                                                formData.role === "ADMIN" ? "border-yellow-500 bg-yellow-500/10" : "border-gray-700"
                                            }`}
                                            onClick={() => setFormData({...formData, role: "ADMIN"})}
                                        >
                                            <span className="text-sm text-white">Admin</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-900/40 p-4 flex justify-between">
                    <button
                        onClick={step === 1 ? onClose : () => setStep(1)}
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors text-sm"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    <button
                        onClick={nextStep}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-md flex items-center text-sm"
                    >
                        {step === 2 ? (
                            <>
                                <Check className="w-4 h-4 mr-1" />
                                Add User
                            </>
                        ) : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}