import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../../services/Auth/authService.js"

const RegisterForm = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.")
            return
        }
        setIsLoading(true)
        try {
            const response = await registerUser({
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                password: formData.password,
            })
            setSuccess(response)
            setError(null)
            navigate("/login")
            setFormData({
                username: "",
                email: "",
                fullName: "",
                password: "",
                confirmPassword: "",
            })
        } catch (err) {
            setError(err.response?.data || "Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md space-y-8">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white">Create an Account</h1>
            </div>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {success && <p className="text-green-500 text-center mt-2">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="fullName" className="text-gray-400">
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            placeholder="Enter your full name"
                            type="text"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border-gray-800 focus:border-purple-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="username" className="text-gray-400">
                            Username
                        </label>
                        <input
                            id="username"
                            placeholder="Enter your username"
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border-gray-800 focus:border-purple-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-gray-400">
                            Email
                        </label>
                        <input
                            id="email"
                            placeholder="Enter your email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border-gray-800 focus:border-purple-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-gray-400">
                            Password
                        </label>
                        <input
                            id="password"
                            placeholder="Enter your password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border-gray-800 focus:border-purple-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-gray-400">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            placeholder="Confirm your password"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            disabled={isLoading}
                            className="h-12 bg-[#12141F] border-gray-800 focus:border-purple-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-white"
                        />
                    </div>
                </div>
                <button type="submit" className="w-full h-12 bg-purple-600 hover:bg-purple-700 rounded-md" disabled={isLoading}>
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
                            Signing up...
                        </div>
                    ) : (
                        "Sign Up →"
                    )}
                </button>
            </form>

            <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/login" className="text-purple-500 hover:text-purple-400">
                    Login
                </a>
            </p>
        </div>
    )
}

export default RegisterForm