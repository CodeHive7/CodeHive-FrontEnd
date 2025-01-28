import { useState } from "react";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields.");
            return;
        }
        setError(null);
        console.log("Logged in:", formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            {/* Card Container */}
            <div className="w-full max-w-md bg-gray-800 text-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center">Login to Your Account</h2>

                {error && <p className="text-red-500 text-center mt-2">{error}</p>}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label className="block text-sm">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
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
                            className="w-full mt-1 p-2 rounded-md bg-gray-700 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Do not have an account?{" "}
                    <a href="/register" className="text-green-400 hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
