import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import axios from "axios";
import { ErrorAlert } from "../ui/ErrorAlert.jsx";
import { SuccessAlert } from "../ui/SuccessAlert.jsx";
// Fix the imports - use specific imports to avoid issues
import { BiCodeAlt, BiLogIn } from 'react-icons/bi';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { VscTerminalPowershell } from 'react-icons/vsc';
import { HiCode, HiOutlineCode, HiTerminal } from 'react-icons/hi';

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
                <div className="bg-gray-950 rounded-lg shadow-xl border border-gray-800 overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center justify-center mb-8">
                            <HiTerminal className="text-amber-500 w-8 h-8" />
                            <h1 className="ml-3 text-2xl font-bold text-white">
                                Code<span className="text-amber-500">Hive</span>
                            </h1>
                        </div>
                        
                        <h2 className="text-xl font-semibold text-white mb-2">
                            <HiOutlineCode className="inline mr-2" />
                            Email Verification Required
                        </h2>
                        <p className="text-gray-400 mb-6 border-l-2 border-amber-500 pl-3">
                            // Verify your email to access the developer network
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-gray-300 font-mono mb-1">
                                        const emailAddress = 
                                    </label>
                                    <input
                                        type="email"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        placeholder="your.email@example.com"
                                        className="h-12 bg-gray-900 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 font-mono"
                                    />
                                </div>
                                
                                <div className="bg-gray-900 border border-gray-700 p-3 rounded-md flex items-start">
                                    <BiCodeAlt className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-1" />
                                    <p className="text-gray-300 text-sm">
                                        <span className="font-mono text-green-400">// Note:</span><br />
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
                                        <BiCodeAlt className="mr-2" size={18} />
                                        Send Verification Email
                                    </span>
                                )}
                            </button>
                            
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => setNeedsVerification(false)}
                                    className="text-amber-500 hover:text-amber-400 text-sm font-mono"
                                >
                                    return <span className="text-green-500">login</span>;
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
            <div className="bg-gray-950 rounded-lg shadow-xl border border-gray-800 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-center mb-6">
                        <HiTerminal className="text-amber-500 w-8 h-8" />
                        <h1 className="ml-3 text-2xl font-bold text-white">
                            Code<span className="text-amber-500">Hive</span>
                        </h1>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-white mb-1">
                        <span className="text-green-400 font-mono">function</span> <span className="text-blue-400">login</span><span className="text-yellow-500">()</span>
                    </h2>
                    <p className="text-gray-400 mb-6 border-l-2 border-amber-500 pl-3 font-mono text-sm">
                        // Access the collaborative development network
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
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button 
                            type="button"
                            className="h-11 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-md flex items-center justify-center text-gray-200 transition-colors"
                            onClick={() => window.location.href = '/api/auth/github/login'}
                        >
                            <BsGithub className="mr-2" size={18} />
                            <span>GitHub</span>
                        </button>
                        <button 
                            type="button"
                            className="h-11 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-md flex items-center justify-center text-gray-200 transition-colors"
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

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1 font-mono">
                                    const username =
                                </label>
                                <input
                                    id="username"
                                    placeholder="your_username"
                                    type="text"
                                    autoCapitalize="none"
                                    autoComplete="username"
                                    autoCorrect="off"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-900 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 font-mono"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 font-mono">
                                        const password =
                                    </label>
                                    <a href="/forgot-password" className="text-xs text-amber-500 hover:text-amber-400 font-mono">
                                        .reset()
                                    </a>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    disabled={isLoading}
                                    className="h-12 bg-gray-900 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 w-full rounded-md px-4 py-2 text-sm text-white placeholder-gray-500 font-mono"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 rounded-md p-3 flex items-center">
                            <HiOutlineCode className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                            <p className="text-gray-300 text-sm font-mono">
                                // Join the network of developers collaborating on real projects
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
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    <BiLogIn size={18} />
                                    <span>Connect to Hive</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="p-5 bg-gray-900 border-t border-gray-800 text-center">
                    <p className="text-sm text-gray-500 font-mono">
                        <span className="text-blue-400">if</span> (<span className="text-green-400">!</span>user) {" "}
                        <a href="/register" className="text-amber-500 hover:text-amber-400 font-medium">
                            register();
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;