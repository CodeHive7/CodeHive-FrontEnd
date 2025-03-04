import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { loginHandler } = useAuth();

    async function onSubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        try {
            await loginHandler(formData);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-4 text-center">
                <img src="/images/beelogo.png" alt="CodeHive Logo" className="w-16 mx-auto" />
                <h1 className="text-4xl font-bold tracking-tight text-yellow-400">
                    Welcome to the Hive! 🐝
                </h1>
                <p className="text-gray-400">Sign in to access the hive and collaborate with your swarm.</p>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-yellow-400">
                            Username
                        </label>
                        <input
                            id="username"
                            placeholder="Enter your hive name"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="username"
                            autoCorrect="off"
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border border-yellow-500 focus:border-yellow-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-yellow-300"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-yellow-400">Password</label>
                            <a href="/forgot-password" className="text-sm text-yellow-500 hover:text-yellow-400">
                                Forgot?
                            </a>
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your hive key"
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border border-yellow-500 focus:border-yellow-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-yellow-300"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md transition-transform transform hover:scale-105"
                    disabled={isLoading}
                >
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
                            Connecting to the Hive...
                        </div>
                    ) : (
                        "Enter the Hive →"
                    )}
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-2 text-yellow-400">Or</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full h-12 bg-black text-yellow-400 border border-yellow-500 hover:bg-yellow-500 hover:text-black rounded-md flex items-center justify-center transition-transform transform hover:scale-105"
                    disabled={isLoading}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#FFD700"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Connect with Google
                </button>
            </form>

            <p className="text-center text-sm text-gray-500">
                New to the hive?{" "}
                <a href="/register" className="text-yellow-500 hover:text-yellow-400 font-semibold">
                    Join Now
                </a>
            </p>
        </div>
    );
};

export default LoginForm;
