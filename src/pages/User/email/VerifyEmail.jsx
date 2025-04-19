import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, Terminal, RefreshCw } from "lucide-react";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [resendStatus, setResendStatus] = useState("idle"); // idle, sending, sent, error
    const [verificationSteps, setVerificationSteps] = useState([]);

    // Get token from URL
    const token = searchParams.get("token");

    // Simulate verification steps
    useEffect(() => {
        if (status === "verifying") {
            const steps = [
                { text: "Starting verification process...", delay: 300 },
                { text: "Connecting to verification server...", delay: 800 },
                { text: "Processing verification token...", delay: 1200 },
                { text: "Validating your information...", delay: 1600 },
                { text: "Checking verification status...", delay: 2000 },
                { text: "Finalizing account setup...", delay: 2400 },
            ];

            let timeoutIds = [];
            let currentSteps = [];

            steps.forEach((step, index) => {
                const id = setTimeout(() => {
                    currentSteps = [...currentSteps, step.text];
                    setVerificationSteps([...currentSteps]);
                }, step.delay);
                timeoutIds.push(id);
            });

            return () => {
                timeoutIds.forEach(id => clearTimeout(id));
            };
        }
    }, [status]);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("We couldn't find your verification token. Please try again or request a new verification email.");
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
                setMessage(response.data || "Your email has been verified successfully. You can now log in to your account.");
            } catch (error) {
                console.error("Verification error details:", error);
                
                if (error.response?.data === "Invalid verification token") {
                    try {
                        setMessage("Your verification may have been successful. Please try logging in.");
                        setStatus("success"); 
                    } catch (loginError) {
                        setMessage("The verification link is invalid or has expired. Please request a new verification email.");
                        setStatus("error");
                    }
                } else {
                    if (error.response) {
                        console.log("Error response data:", error.response.data);
                        console.log("Error response status:", error.response.status);
                        
                        if (error.response.status === 403) {
                            setMessage("Access denied. Please contact support for assistance.");
                        } else {
                            setMessage(error.response.data || "The verification link is invalid or has expired.");
                        }
                    } else if (error.request) {
                        setMessage("Unable to connect to our servers. Please check your internet connection and try again.");
                    } else {
                        setMessage("Something went wrong: " + error.message);
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
        <div className="min-h-screen bg-gray-950 flex flex-col relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full"></div>

            {/* Logo */}
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/images/beelogo.png" alt="CodeHive Logo" className="w-8 h-8" />
                    <span className="text-amber-500 font-bold text-xl">CodeHive</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-lg space-y-6 bg-gray-900 border border-amber-500/30 p-6 rounded-md backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                        <div className="flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-amber-500" />
                            <h2 className="text-amber-500 font-bold">Email Verification</h2>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {status === "verifying" && (
                            <>
                                {/* Verification animation */}
                                <div className="bg-gray-950 rounded-md border border-amber-500/20 p-4 text-sm">
                                    <div className="text-green-500 mb-2">Verifying your email address</div>
                                    
                                    <div className="text-gray-400 mt-4">
                                        {/* Progress steps */}
                                        {verificationSteps.map((step, i) => (
                                            <div key={i} className="mb-1 flex items-center">
                                                <span className="text-green-400 mr-2">✓</span>
                                                <span>{step}</span>
                                            </div>
                                        ))}
                                        {verificationSteps.length < 6 && (
                                            <div className="flex items-center mt-1 animate-pulse">
                                                <Loader2 className="h-4 w-4 text-amber-500 animate-spin mr-2" />
                                                <span>Processing...</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                                    <span>Please wait while we verify your email...</span>
                                </div>
                            </>
                        )}
                        
                        {status === "success" && (
                            <>
                                <div className="bg-green-900/20 rounded-md border border-green-500/30 p-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                        <div>
                                            <div className="text-green-400 font-bold text-lg">Success!</div>
                                            <div className="text-green-300 text-sm">Your email has been verified</div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-950 p-4 rounded-md text-sm border border-green-500/20">
                                        <div className="text-gray-400">Confirmation:</div>
                                        <div className="text-green-300 mt-1">{message}</div>
                                        <div className="text-white mt-3">Your account is now active and ready to use!</div>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-amber-500/10 rounded-md border border-amber-500/30 flex items-center justify-between">
                                    <span className="text-gray-300">Ready to start coding?</span>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-md flex items-center gap-2 transition-colors"
                                    >
                                        Log In Now
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {status === "error" && (
                            <>
                                <div className="bg-red-900/20 rounded-md border border-red-500/30 p-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <XCircle className="h-8 w-8 text-red-500" />
                                        <div>
                                            <div className="text-red-400 font-bold text-lg">Verification Failed</div>
                                            <div className="text-red-300 text-sm">We couldn't verify your email</div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-950 p-4 rounded-md text-sm border border-red-500/20">
                                        <div className="text-gray-400">Error details:</div>
                                        <div className="text-red-400 mt-1">{message}</div>
                                        <div className="text-white mt-3">Please try using the form below to request a new verification email.</div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 p-4 bg-gray-950 border border-amber-500/30 rounded-md">
                                    <h2 className="text-lg font-medium text-amber-400 mb-3">Resend Verification Email</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="Enter your email address"
                                                className="w-full p-2.5 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors text-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <p className="text-gray-500 text-xs mt-1">
                                                Enter the email address associated with your account
                                            </p>
                                        </div>
                                        
                                        <button
                                            onClick={handleResendVerification}
                                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-md disabled:opacity-50 flex items-center justify-center gap-2"
                                            disabled={resendStatus === "sending" || resendStatus === "sent"}
                                        >
                                            {resendStatus === "sending" && <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                                            </>}
                                            {resendStatus === "sent" && <>
                                                <CheckCircle className="w-4 h-4" /> Verification Email Sent
                                            </>}
                                            {resendStatus === "error" && <>
                                                <RefreshCw className="w-4 h-4" /> Try Again
                                            </>}
                                            {(resendStatus === "idle") && <>
                                                <RefreshCw className="w-4 h-4" /> Send Verification Email
                                            </>}
                                        </button>
                                        
                                        {resendStatus === "sent" && (
                                            <div className="text-green-400 text-sm p-2 bg-green-900/20 border border-green-500/30 rounded-md">
                                                A new verification email has been sent to <span className="text-white">{email}</span>. Please check your inbox.
                                            </div>
                                        )}
                                        
                                        {resendStatus === "error" && (
                                            <div className="text-red-400 text-sm p-2 bg-red-900/20 border border-red-500/30 rounded-md">
                                                We couldn't send a verification email. Please try again.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-6 text-center">
                                    <Link to="/login" className="text-amber-400 hover:text-amber-300 flex items-center justify-center gap-2 group">
                                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                                        Return to Login
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 text-center">
                <p className="text-amber-500/30 text-sm">© CodeHive</p>
            </div>
        </div>
    );
};

export default VerifyEmail;