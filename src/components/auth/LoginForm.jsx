import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {login} from "../../services/Auth/authService.js";

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    async function onSubmit(event) {
        event.preventDefault()
        setIsLoading(true)

        try {
            const {accessToken , refreshToken} = await login(formData);

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            window.dispatchEvent(new Event('storage'));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Pleas try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white">Welcome back!</h1>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p> }

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-gray-400">
                            username
                        </label>
                        <input
                            id="username"
                            placeholder="Enter your username"
                            type="text"
                            autoCapitalize="none"
                            autoComplete="username"
                            autoCorrect="off"
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border-gray-800 focus:border-purple-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-white"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="text-gray-400">
                                Password
                            </label>
                            <a href="/forgot-password" className="text-sm text-purple-500 hover:text-purple-400">
                                Forgot?
                            </a>
                        </div>
                        <input
                            id="password"
                            type="password"
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border-gray-800 focus:border-purple-600 w-full rounded-md px-3 py-1 text-sm"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-md"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            Signing in...
                        </div>
                    ) : (
                        "Sign In →"
                    )}
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-[#0A0B14] px-2 text-gray-500">Or</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full h-12 bg-white text-black border-gray-800 hover:bg-gray-100 rounded-md flex items-center justify-center"
                    disabled={isLoading}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
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
                    Continue with Google
                </button>
            </form>

            <p className="text-center text-sm text-gray-500">
                Don&apos;t you have an account?{" "}
                <a href="/register" className="text-purple-500 hover:text-purple-400">
                    Get Started
                </a>
            </p>
        </div>
    )
}

export default LoginForm