import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/Auth/AuthContext";
import { jwtDecode } from "jwt-decode";

const OAuthCallback = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user, setUser } = useAuth(); // You'll need to expose setUser in your context
  
  useEffect(() => {
    const processOAuthLogin = async () => {
      try {
        console.log("OAuth callback initiated");
        
        // Get tokens from OAuth success endpoint
        const response = await axios.get("http://localhost:8082/api/auth/oauth2/success", {
          withCredentials: true
        });
        
        console.log("OAuth response:", response);
        
        if (response.data && response.data.accessToken) {
          // Store tokens
          localStorage.setItem("access_token", response.data.accessToken);
          localStorage.setItem("refresh_token", response.data.refreshToken);
          
          // Decode and set user
          try {
            const decoded = jwtDecode(response.data.accessToken);
            const userData = {
              username: decoded.username || decoded.sub,
              roles: decoded.roles || [],
              permissions: decoded.permissions || [],
            };
            
            // You'll need to modify your AuthContext to expose setUser
            setUser(userData);
            
            // Navigate based on role
            if (userData.roles.includes("SUPER_ADMIN")) {
              navigate("/admin");
            } else {
              navigate("/userHome");
            }
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
            setError("Authentication completed but there was an error processing your session.");
          }
        } else {
          throw new Error("Invalid response from authentication server");
        }
      } catch (err) {
        console.error("OAuth authentication error:", err);
        setError("Authentication failed. Please try again later.");
      }
    };
    
    processOAuthLogin();
  }, [navigate]);
  
  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0B14] flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-gray-800/50 rounded-xl text-center">
          <h1 className="text-2xl font-bold text-red-500">Authentication Failed</h1>
          <p className="text-gray-300 mt-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-6 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-md"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0A0B14] flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-gray-800/50 rounded-xl text-center">
        <Loader2 className="h-16 w-16 text-yellow-400 mx-auto animate-spin" />
        <h1 className="text-2xl font-bold text-white mt-6">Completing Authentication...</h1>
        <p className="text-gray-400 mt-2">Please wait while we set up your account.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;