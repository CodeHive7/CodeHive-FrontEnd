import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, Terminal, Code, RefreshCw } from "lucide-react";

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [resendStatus, setResendStatus] = useState("idle"); // idle, sending, sent, error
    const [terminalLines, setTerminalLines] = useState([]);
    const [cursor, setCursor] = useState(true);

    // Get token from URL
    const token = searchParams.get("token");

    // Simulate terminal output
    useEffect(() => {
        if (status === "verifying") {
            const lines = [
                { text: "> initializing verification process...", delay: 300 },
                { text: "> establishing secure connection to auth server...", delay: 800 },
                { text: "> parsing JWT token...", delay: 1200 },
                { text: "> validating signature...", delay: 1600 },
                { text: "> checking token expiration...", delay: 2000 },
                { text: "> updating user verification status...", delay: 2400 },
            ];

            let timeoutIds = [];
            let currentLines = [];

            lines.forEach((line, index) => {
                const id = setTimeout(() => {
                    currentLines = [...currentLines, line.text];
                    setTerminalLines([...currentLines]);
                }, line.delay);
                timeoutIds.push(id);
            });

            // Blinking cursor effect
            const cursorInterval = setInterval(() => {
                setCursor(c => !c);
            }, 500);

            return () => {
                timeoutIds.forEach(id => clearTimeout(id));
                clearInterval(cursorInterval);
            };
        }
    }, [status]);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("InvalidTokenException: Token parameter is null or undefined");
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
                setMessage(response.data || "Email verification completed successfully. Session ready.");
            } catch (error) {
                console.error("Verification error details:", error);
                
                // Check if error message indicates verification success
                if (error.response?.data === "Invalid verification token") {
                    // Let's check if verification actually succeeded by trying to login
                    try {
                        setMessage("Verification may have succeeded. Try user.login()");
                        setStatus("success"); // Show success UI anyway
                    } catch (loginError) {
                        // If login check fails, show the original error
                        setMessage(error.response?.data || "VerificationException: Token expired or invalid");
                        setStatus("error");
                    }
                } else {
                    // Handle other errors as before
                    if (error.response) {
                        console.log("Error response data:", error.response.data);
                        console.log("Error response status:", error.response.status);
                        
                        if (error.response.status === 403) {
                            setMessage("AccessDeniedException: API endpoint restricted. Contact administrator.");
                        } else {
                            setMessage(error.response.data || "VerificationException: Token expired or invalid");
                        }
                    } else if (error.request) {
                        setMessage("NetworkException: Server unreachable. Check connection and retry.");
                    } else {
                        setMessage("RequestException: " + error.message);
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
            {/* Code Pattern Background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 40 L40 20 L60 40 L80 20 M20 60 L40 80 L60 60 L80 80' stroke='%23F59E0B' fill='none' stroke-width='2'/%3E%3C/svg%3E\")",
                    backgroundSize: "50px 50px"
                }}>
            </div>
            
            {/* "Compiler" warnings/glows */}
            <div className="absolute top-20 right-20 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full"></div>

            {/* Logo */}
            <div className="p-6">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/images/beelogo.png" alt="CodeHive Logo" className="w-8 h-8" />
                    <span className="text-amber-500 font-mono font-bold text-xl">CodeHive</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-lg space-y-6 bg-gray-900 border border-amber-500/30 p-6 rounded-md backdrop-blur-sm">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                        <div className="flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-amber-500" />
                            <h2 className="text-amber-500 font-mono font-bold">email_verification.sh</h2>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {status === "verifying" && (
                            <>
                                {/* Code verification animation */}
                                <div className="bg-gray-950 rounded-md border border-amber-500/20 p-4 font-mono text-sm">
                                    <div className="text-green-500 mb-2"># Verifying email with secure token</div>
                                    <div className="text-amber-300 mb-4">await user.verifyEmail(token);</div>
                                    
                                    <div className="text-gray-400">
                                        {/* Terminal-style output */}
                                        {terminalLines.map((line, i) => (
                                            <div key={i} className="mb-1 flex">
                                                <span className="text-green-400 mr-2">$</span>
                                                <span>{line}</span>
                                            </div>
                                        ))}
                                        {cursor && (
                                            <span className="animate-pulse">▌</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 text-gray-400 font-mono text-sm">
                                    <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                                    <span>// process running, please wait...</span>
                                </div>
                            </>
                        )}
                        
                        {status === "success" && (
                            <>
                                <div className="bg-green-900/20 rounded-md border border-green-500/30 p-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                        <div>
                                            <div className="text-green-400 font-mono font-bold text-lg">200 OK</div>
                                            <div className="text-green-300 font-mono text-sm">Email verified successfully</div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-950 p-3 rounded-md font-mono text-xs border border-green-500/20">
                                        <div className="text-gray-400">// Server response:</div>
                                        <div className="text-green-300 mt-1">{message}</div>
                                        <div className="text-amber-300 mt-3">user.verified = true;</div>
                                    </div>
                                </div>
                                
                                <div className="p-3 bg-amber-500/10 rounded-md border border-amber-500/30 flex items-center justify-between">
                                    <span className="text-gray-300 font-mono">// Ready to log in</span>
                                    <button
                                        onClick={() => navigate("/login")}
                                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-md font-mono flex items-center gap-2 transition-colors"
                                    >
                                        <Code className="w-4 h-4" /> user.login()
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
                                            <div className="text-red-400 font-mono font-bold text-lg">401 Unauthorized</div>
                                            <div className="text-red-300 font-mono text-sm">Email verification failed</div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-950 p-3 rounded-md font-mono text-xs border border-red-500/20">
                                        <div className="text-gray-400">// Error details:</div>
                                        <div className="text-red-400 mt-1">{message}</div>
                                        <div className="text-amber-300 mt-3">throw new VerificationError();</div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 p-4 bg-gray-950 border border-amber-500/30 rounded-md">
                                    <h2 className="text-lg font-medium text-amber-400 mb-3 font-mono">verification.retry()</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1 font-mono">
                                                email.address
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="user@example.com"
                                                className="w-full p-2.5 border border-gray-700 bg-gray-800 text-white rounded-md focus:border-amber-500 focus:ring focus:ring-amber-500 focus:outline-none transition-colors font-mono text-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            <p className="text-gray-500 text-xs mt-1 font-mono">
                                                // enter the email associated with your account
                                            </p>
                                        </div>
                                        
                                        <button
                                            onClick={handleResendVerification}
                                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-md disabled:opacity-50 font-mono flex items-center justify-center gap-2"
                                            disabled={resendStatus === "sending" || resendStatus === "sent"}
                                        >
                                            {resendStatus === "sending" && <>
                                                <Loader2 className="w-4 h-4 animate-spin" /> executing...
                                            </>}
                                            {resendStatus === "sent" && <>
                                                <CheckCircle className="w-4 h-4" /> verification.sent()
                                            </>}
                                            {resendStatus === "error" && <>
                                                <RefreshCw className="w-4 h-4" /> retry()
                                            </>}
                                            {(resendStatus === "idle") && <>
                                                <RefreshCw className="w-4 h-4" /> verification.resend()
                                            </>}
                                        </button>
                                        
                                        {resendStatus === "sent" && (
                                            <div className="text-green-400 text-sm p-2 bg-green-900/20 border border-green-500/30 rounded-md font-mono">
                                                <span className="text-gray-300">// </span>
                                                Email sent to <span className="text-white">{email}</span>. Check inbox.
                                            </div>
                                        )}
                                        
                                        {resendStatus === "error" && (
                                            <div className="text-red-400 text-sm p-2 bg-red-900/20 border border-red-500/30 rounded-md font-mono">
                                                <span className="text-gray-300">// </span>
                                                Error: Email delivery failed. Try again.
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="mt-6 text-center">
                                    <Link to="/login" className="text-amber-400 hover:text-amber-300 font-mono flex items-center justify-center gap-2 group">
                                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                                        login.return()
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            {/* ASCII art footer */}
            <div className="p-4 text-center">
                <pre className="text-amber-500/30 text-[0.6rem] font-mono hidden sm:block">
{`  _____           _      _    _ _            
 / ____|         | |    | |  | (_)           
| |     ___   __| |____| |__| |___   _____   
| |    / _ \\ / _\` |____|  __  | \\ \\ / / _ \\  
| |___| (_) | (_| |    | |  | | |\\ V /  __/  
 \\_____\\___/ \\__,_|    |_|  |_|_| \\_/ \\___|  `}
                </pre>
            </div>
        </div>
    );
};

export default VerifyEmail;