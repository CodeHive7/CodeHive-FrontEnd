import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/Auth/authService.js";

const RegisterForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        try {
            const response = await registerUser({
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                password: formData.password,
            });
            setSuccess(response);
            setError(null);
            navigate("/login");
            setFormData({
                username: "",
                email: "",
                fullName: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            setError(err.response?.data || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-4 text-center">
                <img src="/images/beelogo.png" alt="CodeHive Logo" className="w-16 mx-auto" />
                <h1 className="text-4xl font-bold tracking-tight text-yellow-400">
                    Join the Hive! 🐝
                </h1>
                <p className="text-gray-400">Sign up and become part of the buzzing community.</p>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="fullName" className="text-yellow-400">Full Name</label>
                        <input
                            id="fullName"
                            placeholder="Enter your full name"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border border-yellow-500 focus:border-yellow-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-yellow-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-yellow-400">Username</label>
                        <input
                            id="username"
                            placeholder="Choose a hive name"
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border border-yellow-500 focus:border-yellow-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-yellow-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-yellow-400">Email</label>
                        <input
                            id="email"
                            placeholder="Enter your email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border border-yellow-500 focus:border-yellow-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-yellow-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-yellow-400">Password</label>
                        <input
                            id="password"
                            placeholder="Create your hive key"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border border-yellow-500 focus:border-yellow-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-yellow-300"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-yellow-400">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            placeholder="Confirm your hive key"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border border-yellow-500 focus:border-yellow-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-yellow-300"
                        />
                    </div>
                </div>
                <button type="submit" className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md transition-transform transform hover:scale-105" disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Joining the Hive...
                        </div>
                    ) : (
                        "Join the Hive →"
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500">
                Already part of the hive?{" "}
                <a href="/login" className="text-yellow-500 hover:text-yellow-400 font-semibold">
                    Sign In
                </a>
            </p>
        </div>
    );
};

export default RegisterForm;
