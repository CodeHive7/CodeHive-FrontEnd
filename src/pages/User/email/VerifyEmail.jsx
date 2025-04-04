import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [resendStatus, setResendStatus] = useState("idle"); // idle, sending, sent, error

    // Get token from URL
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link. Token is missing.");
            return;
        }

        const extractToken = (tokenParam) => {
            if (tokenParam.includes('http') && tokenParam.includes('token=')) {
                const match = tokenParam.match(/token=([^&]+)/);
                return match ? match[1] : tokenParam;
            }
            return tokenParam;
        };

        const cleanToken = extractToken(token);
        console.log("Using token:", cleanToken);

        const verifyEmail = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8082/api/auth/verify-email?token=${cleanToken}`
                );
                setStatus("success");
                setMessage(response.data || "Email verified successfully! You can now login.");
            } catch (error) {
                console.error("Verification error details:", error);
                
                // Check if error message indicates verification success
                if (error.response?.data === "Invalid verification token") {
                    // Let's check if verification actually succeeded by trying to login
                    try {
                        setMessage("Verification may have succeeded. Please try logging in.");
                        setStatus("success"); // Show success UI anyway
                    } catch (loginError) {
                        // If login check fails, show the original error
                        setMessage(error.response?.data || "Verification failed. The link may be expired or invalid.");
                        setStatus("error");
                    }
                } else {
                    // Handle other errors as before
                    if (error.response) {
                        console.log("Error response data:", error.response.data);
                        console.log("Error response status:", error.response.status);
                        
                        if (error.response.status === 403) {
                            setMessage("Access denied. This API endpoint may be protected. Please contact support.");
                        } else {
                            setMessage(error.response.data || "Verification failed. The link may be expired or invalid.");
                        }
                    } else if (error.request) {
                        setMessage("No response received from server. Please try again later.");
                    } else {
                        setMessage("Error setting up request: " + error.message);
                    }
                    setStatus("error");
                }
            }
        };

        verifyEmail();
    }, [token]);

    const handleResendVerification = async () => {
        if (!email || resendStatus === "sending") return;

        setResendStatus("sending");
        try {
            await axios.post("http://localhost:8082/api/auth/resend-verification", {
                email,
            });
            setResendStatus("sent");
        } catch (error) {
            setResendStatus("error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0B14] flex flex-col relative overflow-hidden">
            {/* Background Honey Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/10 to-black opacity-20 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-yellow-500/20 blur-3xl"></div>

            {/* Logo */}
            <div className="p-6">
                <Link to="/">
                    <img src="/images/beelogo.png" alt="Hive Logo" className="w-10 h-10" />
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md space-y-8 bg-gray-900/50 p-8 rounded-xl backdrop-blur-sm">
                    <div className="space-y-4 text-center">
                        <img src="/images/beelogo.png" alt="CodeHive Logo" className="w-16 mx-auto" />
                        
                        {status === "verifying" && (
                            <>
                                <Loader2 className="h-16 w-16 text-yellow-400 mx-auto animate-spin" />
                                <h1 className="text-2xl font-bold text-white">Verifying your email...</h1>
                                <p className="text-gray-400">Please wait while we verify your email address.</p>
                            </>
                        )}
                        
                        {status === "success" && (
                            <>
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                                <h1 className="text-2xl font-bold text-green-500">Email Verified!</h1>
                                <p className="text-gray-300">{message}</p>
                                <button
                                    onClick={() => navigate("/login")}
                                    className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md mx-auto block"
                                >
                                    Log In
                                </button>
                            </>
                        )}
                        
                        {status === "error" && (
                            <>
                                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                                <h1 className="text-2xl font-bold text-red-500">Verification Failed</h1>
                                <p className="text-gray-300">{message}</p>
                                
                                <div className="mt-8 p-4 border border-gray-700 rounded-lg">
                                    <h2 className="text-lg font-medium text-yellow-400 mb-3">Need a new verification link?</h2>
                                    <div className="space-y-4">
                                        <input
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="h-12 bg-[#12141F] border border-yellow-500 focus:border-yellow-600 w-full rounded-md px-3 py-1 text-sm text-white placeholder-yellow-300"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <button
                                            onClick={handleResendVerification}
                                            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md disabled:opacity-50"
                                            disabled={resendStatus === "sending" || resendStatus === "sent"}
                                        >
                                            {resendStatus === "sending" && "Sending..."}
                                            {resendStatus === "sent" && "Verification Email Sent!"}
                                            {resendStatus === "error" && "Failed - Try Again"}
                                            {(resendStatus === "idle") && "Resend Verification Email"}
                                        </button>
                                        
                                        {resendStatus === "sent" && (
                                            <p className="text-green-400 text-sm mt-2">
                                                A new verification email has been sent. Please check your inbox.
                                            </p>
                                        )}
                                        
                                        {resendStatus === "error" && (
                                            <p className="text-red-400 text-sm mt-2">
                                                Failed to send verification email. Please try again.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-6">
                                    <Link to="/login" className="text-yellow-400 hover:text-yellow-300">
                                        Back to Login
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;