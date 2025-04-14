import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/Auth/authService.js";
import { ErrorAlert } from "../ui/ErrorAlert.jsx";
import { HiTerminal } from 'react-icons/hi';
import { BiCodeAlt } from 'react-icons/bi';
import { BsGithub, BsGoogle, BsCheckCircleFill } from 'react-icons/bs';
import { IoMailOutline } from 'react-icons/io5';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        password: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");

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
            
            setRegisteredEmail(formData.email);
            setIsRegistered(true);
            setError(null);
            
            setFormData({
                username: "",
                email: "",
                fullName: "",
                password: "",
                confirmPassword: "",
            });
        } catch (err) {
            setError(err.response?.data || "An error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    // If registration was successful, show the verification instructions
    if (isRegistered) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center justify-center mb-8">
                            <HiTerminal className="text-amber-500 w-8 h-8" />
                            <h1 className="ml-3 text-2xl font-bold text-white">
                                Code<span className="text-amber-500">Hive</span>
                            </h1>
                        </div>
                        
                        <div className="text-center mb-8">
                            <div className="bg-amber-500/10 p-4 rounded-full inline-block mb-4">
                                <BsCheckCircleFill className="w-12 h-12 text-amber-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Registration Successful
                            </h2>
                            <p className="text-gray-400">
                                Your account was created successfully!
                            </p>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                                <IoMailOutline className="mr-2 text-amber-500" />
                                Verify your email address
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-gray-300 mb-2">
                                        We've sent a verification link to:
                                    </p>
                                    <p className="bg-gray-900 p-3 rounded-md border border-gray-700 text-amber-400 break-all">
                                        {registeredEmail}
                                    </p>
                                </div>
                                
                                <div className="border-l-4 border-amber-500 pl-4 py-2">
                                    <h4 className="text-white mb-2">Next steps:</h4>
                                    <ol className="space-y-2 text-gray-300">
                                        <li className="flex items-center">
                                            <span className="bg-amber-500/20 text-amber-400 rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
                                            Check your inbox
                                        </li>
                                        <li className="flex items-center">
                                            <span className="bg-amber-500/20 text-amber-400 rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
                                            Click the verification link
                                        </li>
                                        <li className="flex items-center">
                                            <span className="bg-amber-500/20 text-amber-400 rounded-full w-6 h-6 flex items-center justify-center mr-2">3</span>
                                            Return to login
                                        </li>
                                    </ol>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <Link 
                                    to="/login"
                                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md flex items-center justify-center"
                                >
                                    Return to Login
                                </Link>
                            </div>
                        </div>
                        
                        <div className="text-center text-sm text-gray-500">
                            <p className="mb-2">Didn't receive the email?</p>
                            <button 
                                className="text-amber-500 hover:text-amber-400"
                                onClick={() => setIsRegistered(false)}
                            >
                                Try registering again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 overflow-hidden">
                <div className="p-8">
                    <div className="flex items-center justify-center mb-8">
                        <HiTerminal className="text-amber-500 w-8 h-8" />
                        <h1 className="ml-3 text-2xl font-bold text-white">
                            Code<span className="text-amber-500">Hive</span>
                        </h1>
                    </div>
                    
                    <h2 className="text-2xl font-semibold text-white mb-2">
                        Create an Account
                    </h2>
                    <p className="text-gray-400 mb-6">
                        Join a network of developer collaboration
                    </p>

                    <ErrorAlert
                        message={error}
                        onClose={() => setError(null)}
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

                    <form onSubmit={handleSubmit}>
                        {/* Full name and username in one row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    id="fullName"
                                    placeholder="Enter your full name"
                                    type="text"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-white placeholder-gray-500"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    placeholder="Choose a username"
                                    type="text"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-white placeholder-gray-500"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email in its own row */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                placeholder="your.email@example.com"
                                type="email"
                                disabled={isLoading}
                                className="h-12 bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-white placeholder-gray-500"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Password and confirm password in one row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    placeholder="Create a password"
                                    type="password"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-white placeholder-gray-500"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    type="password"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-white placeholder-gray-500"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="bg-gray-800 border border-gray-700 rounded-md p-4 flex items-center mb-6">
                            <IoMailOutline className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0" />
                            <p className="text-gray-300 text-sm">
                                You'll need to verify your email before logging in
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-12 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
                                "Create Account"
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="p-5 bg-gray-800 border-t border-gray-700 text-center">
                    <p className="text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-amber-500 hover:text-amber-400 font-medium">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;