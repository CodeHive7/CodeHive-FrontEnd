import { useState } from "react";
import {registerUser} from "../../services/Auth/authService.js";
import {useNavigate} from "react-router-dom";

const RegisterFrom = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const response = await registerUser({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            setSuccess(response);
            setError(null);
            navigate("/login")
            setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            setError(err.response?.data || "Something went wrong.");
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center">Create an Account</h2>

                {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                {success && <p className="text-green-500 text-center mt-2">{success}</p>}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm">Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-white-400 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterFrom;