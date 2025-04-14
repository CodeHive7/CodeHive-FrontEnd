import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import axios from "axios";
import { ErrorAlert } from "../ui/ErrorAlert.jsx";
import { SuccessAlert } from "../ui/SuccessAlert.jsx";
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { IoMailOutline } from 'react-icons/io5';
import { HiTerminal } from 'react-icons/hi';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const navigate = useNavigate();
    const { loginHandler } = useAuth();

    async function onSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        
        try {
            await loginHandler(formData);
            navigate("/dashboard");
        } catch (err) {
            if (err.response?.status === 400 && 
                err.response?.data?.includes("verify")) {
                setNeedsVerification(true);
                setUserEmail(formData.username);
            } else {
                setError(err.response?.data || "Authentication failed");
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function handleResendVerification() {
        if (!userEmail) return;
        
        try {
            setIsLoading(true);
            await axios.post("http://localhost:8082/api/auth/resend-verification", { 
                email: userEmail 
            });
            setSuccessMessage("Verification email sent successfully!");
            setTimeout(() => setNeedsVerification(false), 3000);
        } catch (err) {
            setError(err.response?.data || "Failed to send verification email");
        } finally {
            setIsLoading(false);
        }
    }

    // If user needs to verify email
    if (needsVerification) {
        return (
            <div className="w-full max-w-xl mx-auto">
                <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-center mb-8">
                            <HiTerminal className="text-amber-500 w-8 h-8" />
                            <h1 className="ml-3 text-2xl font-bold text-white">
                                Code<span className="text-amber-500">Hive</span>
                            </h1>
                        </div>
                        
                        <h2 className="text-2xl font-semibold text-white mb-2">
                            Email Verification Required
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Verify your email to access your account
                        </p>

                        <ErrorAlert
                            message={error}
                            onClose={() => setError(null)}
                        />

                        <SuccessAlert
                            message={successMessage}
                            duration={5000}
                            onClose={() => setSuccessMessage(null)}
                        />

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        className="h-12 bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-white placeholder-gray-500"
                                    />
                                </div>
                                
                                <div className="bg-gray-800 border border-gray-700 p-4 rounded-md flex items-start">
                                    <IoMailOutline className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-300 text-sm">
                                        Check your inbox and spam folder for the verification email
                                    </p>
                                </div>
                            </div>
                            
                            <button
                                onClick={handleResendVerification}
                                disabled={isLoading || !userEmail}
                                className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        Send Verification Email
                                    </span>
                                )}
                            </button>
                            
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => setNeedsVerification(false)}
                                    className="text-amber-500 hover:text-amber-400 text-sm"
                                >
                                    Return to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-center mb-8">
                        <HiTerminal className="text-amber-500 w-8 h-8" />
                        <h1 className="ml-3 text-2xl font-bold text-white">
                            Code<span className="text-amber-500">Hive</span>
                        </h1>
                    </div>
                    
                    <h2 className="text-2xl font-semibold text-white mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Sign in to access your account
                    </p>

                    <ErrorAlert
                        message={error}
                        onClose={() => setError(null)}
                    />

                    <SuccessAlert
                        message={successMessage}
                        duration={5000}
                        onClose={() => setSuccessMessage(null)}
                    />
                    
                    <div className="flex gap-4 mb-6">
                        <button 
                            type="button"
                            className="flex-1 h-11 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md flex items-center justify-center text-white transition-colors"
                            onClick={() => window.location.href = '/api/auth/github/login'}
                        >
                            <BsGithub className="mr-2" size={18} />
                            <span>GitHub</span>
                        </button>
                        <button 
                            type="button"
                            className="flex-1 h-11 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md flex items-center justify-center text-white transition-colors"
                        >
                            <BsGoogle className="mr-2" size={16} />
                            <span>Google</span>
                        </button>
                    </div>
                    
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-gray-900 px-2 text-gray-500">or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                                Username or Email
                            </label>
                            <input
                                id="username"
                                placeholder="Enter your username"
                                type="text"
                                autoCapitalize="none"
                                autoComplete="username"
                                autoCorrect="off"
                                disabled={isLoading}
                                className="h-12 bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-white placeholder-gray-500"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-xs text-amber-500 hover:text-amber-400">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                disabled={isLoading}
                                className="h-12 bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-white placeholder-gray-500"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-md p-4 flex items-center mt-2">
                            <IoMailOutline className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">
                                Join the network of developers collaborating on real projects
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 mt-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5"
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
                                    Processing...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="p-5 bg-gray-800 border-t border-gray-700 text-center">
                    <p className="text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-amber-500 hover:text-amber-400 font-medium">
                            Create account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;