import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleGitHubCallback } from "../../services/Auth/authService.js";
import { useAuth } from "../../context/Auth/AuthContext.jsx";
import { jwtDecode } from "jwt-decode";

const GitHubCallback = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { loginHandler } = useAuth();

    useEffect(() => {
        const processGitHubCallback = async () => {
            // Extract code from URL
            const searchParams = new URLSearchParams(location.search);
            const code = searchParams.get("code");
            
            if (!code) {
                setError("Authentication failed: No code provided");
                setLoading(false);
                return;
            }
            
            try {
                // Exchange code for token through our backend
                const tokens = await handleGitHubCallback(code);
                
                // Use existing auth flow by using token data
                const decodedToken = jwtDecode(tokens.accessToken);
                const userData = {
                    username: decodedToken.username || decodedToken.sub,
                    roles: decodedToken.roles || [],
                };
                
                // Redirect based on role
                setTimeout(() => {
                    if (userData.roles.includes("SUPER_ADMIN")) {
                        navigate("/admin");
                    } else {
                        navigate("/userHome");
                    }
                }, 100);
                
            } catch (err) {
                console.error("GitHub authentication error:", err);
                setError(`Authentication failed: ${err.response?.data || err.message}`);
                setLoading(false);
            }
        };
        
        processGitHubCallback();
    }, [location, navigate]);
    
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0B14] flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
                <p className="mt-4 text-yellow-500">Authenticating with GitHub...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0B14] flex flex-col items-center justify-center text-white p-4">
                <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md">
                    <h1 className="text-xl font-bold mb-4">Authentication Error</h1>
                    <p className="text-red-300">{error}</p>
                    <button 
                        onClick={() => navigate("/login")} 
                        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }
    
    return null;
}

export default GitHubCallback;