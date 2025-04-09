import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/Auth/authService.js";
import { ErrorAlert } from "../ui/ErrorAlert.jsx";
import { SuccessAlert } from "../ui/SuccessAlert.jsx";
import { HiTerminal, HiCode, HiOutlineCode } from 'react-icons/hi';
import { BiCodeAlt } from 'react-icons/bi';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { VscTerminalPowershell } from 'react-icons/vsc';

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
    const [successMessage, setSuccessMessage] = useState(null);
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
            
            // Store the registered email and set success state
            setRegisteredEmail(formData.email);
            setIsRegistered(true);
            setError(null);
            
            // Reset form data
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
                <div className="bg-gray-950 rounded-lg shadow-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-center mb-6">
                            <HiTerminal className="text-amber-500 w-8 h-8" />
                            <h1 className="ml-3 text-2xl font-bold text-white">
                                Code<span className="text-amber-500">Hive</span>
                            </h1>
                        </div>
                        
                        <div className="text-center mb-6">
                            <HiCode className="w-16 h-16 text-green-500 mx-auto mb-2" />
                            <h2 className="text-xl font-semibold text-green-500">
                                <span className="text-white font-mono">true</span> <span className="text-green-400 font-mono">===</span> registration.success
                            </h2>
                            <p className="text-gray-400 mt-2 border-l-2 border-green-500 pl-3 text-left text-sm font-mono">
                                // Your account was created successfully!
                            </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 rounded-md p-4 mb-6">
                            <h3 className="text-amber-500 font-mono text-sm mb-3">
                                await verifyEmail();
                            </h3>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="md:w-1/2">
                                    <p className="text-gray-300 mb-2">
                                        We've sent a verification link to:
                                    </p>
                                    <p className="bg-gray-950 p-2 rounded border border-gray-700 text-amber-500 font-mono mb-4 break-all">
                                        {registeredEmail}
                                    </p>
                                </div>
                                
                                <div className="md:w-1/2">
                                    <h3 className="font-mono text-blue-400 mb-2">function nextSteps() {`{`}</h3>
                                    <ol className="ml-4 space-y-2 text-gray-300 font-mono mb-2">
                                        <li className="flex items-start">
                                            <span className="bg-gray-800 text-amber-400 rounded px-1 mr-2 font-mono">1.</span>
                                            Check your inbox
                                        </li>
                                        <li className="flex items-start">
                                            <span className="bg-gray-800 text-amber-400 rounded px-1 mr-2 font-mono">2.</span>
                                            Click verification link
                                        </li>
                                        <li className="flex items-start">
                                            <span className="bg-gray-800 text-amber-400 rounded px-1 mr-2 font-mono">3.</span>
                                            Return to login
                                        </li>
                                    </ol>
                                    <p className="font-mono text-blue-400">{`}`}</p>
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <Link 
                                    to="/login"
                                    className="w-full h-10 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md flex items-center justify-center"
                                >
                                    <BiCodeAlt className="mr-2" size={18} />
                                    <span className="font-mono">return to login();</span>
                                </Link>
                            </div>
                        </div>
                        
                        <div className="text-center text-sm text-gray-500">
                            <p className="mb-1 font-mono">// Didn't receive the email?</p>
                            <button 
                                className="text-amber-500 hover:text-amber-400 font-mono"
                                onClick={() => setIsRegistered(false)}
                            >
                                retry(registration);
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-gray-950 rounded-lg shadow-xl border border-gray-800 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-center mb-6">
                        <HiTerminal className="text-amber-500 w-8 h-8" />
                        <h1 className="ml-3 text-2xl font-bold text-white">
                            Code<span className="text-amber-500">Hive</span>
                        </h1>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-white mb-1">
                        <span className="text-green-400 font-mono">function</span> <span className="text-blue-400">register</span><span className="text-yellow-500">()</span>
                    </h2>
                    <p className="text-gray-400 mb-6 border-l-2 border-amber-500 pl-3 font-mono text-sm">
                        // Join a network of developer collaboration
                    </p>

                    <ErrorAlert
                        message={error}
                        onClose={() => setError(null)}
                    />

                    <div className="flex gap-4 mb-6">
                        <button 
                            type="button"
                            className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-md flex items-center justify-center text-gray-200 transition-colors"
                            onClick={() => window.location.href = '/api/auth/github/login'}
                        >
                            <BsGithub className="mr-2" size={18} />
                            <span>GitHub</span>
                        </button>
                        <button 
                            type="button"
                            className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-md flex items-center justify-center text-gray-200 transition-colors"
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
                            <span className="bg-gray-950 px-2 text-gray-500 font-mono">// or continue with</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Full name and username in one row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                                    const fullName =
                                </label>
                                <input
                                    id="fullName"
                                    placeholder="'Your Full Name'"
                                    type="text"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-900 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 font-mono"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                                    const username =
                                </label>
                                <input
                                    id="username"
                                    placeholder="'dev_username'"
                                    type="text"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-900 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 font-mono"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Email in its own row */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                                const email =
                            </label>
                            <input
                                id="email"
                                placeholder="'your.email@example.com'"
                                type="email"
                                disabled={isLoading}
                                className="h-12 bg-gray-900 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 font-mono"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Password and confirm password in one row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                                    const password =
                                </label>
                                <input
                                    id="password"
                                    placeholder="'secure_password'"
                                    type="password"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-900 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 font-mono"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                                    password.confirm =
                                </label>
                                <input
                                    id="confirmPassword"
                                    placeholder="'secure_password'"
                                    type="password"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-900 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 font-mono"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 rounded-md p-3 flex items-center mb-4">
                            <HiOutlineCode className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                            <p className="text-gray-300 text-sm font-mono">
                                // You'll need to verify your email before logging in
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
                                    Executing...
                                </>
                            ) : (
                                <>
                                    <BiCodeAlt size={18} />
                                    <span>Submit()</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="p-5 bg-gray-900 border-t border-gray-800 text-center">
                    <p className="text-sm text-gray-500 font-mono">
                        <span className="text-blue-400">if</span> (<span className="text-green-400">account</span>) {" "}
                        <Link to="/login" className="text-amber-500 hover:text-amber-400 font-medium">
                            login();
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;