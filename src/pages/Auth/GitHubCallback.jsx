import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { handleGitHubCallback } from "../../services/Auth/authService";
import { useAuth } from "../../context/Auth/AuthContext";
import { jwtDecode } from "jwt-decode";

const GitHubCallback = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { loginHandler } = useAuth();

  useEffect(() => {
    const processGitHubCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");

      if (!code) {
        setError("Authentication failed: No code provided");
        setLoading(false);
        return;
      }

      try {
        // Exchange the code for tokens via your backend
        const tokens = await handleGitHubCallback(code);
        // Store tokens using your auth context
        loginHandler(tokens);
        // Remove the code from the URL so the user doesn’t re-trigger on refresh
        window.history.replaceState({}, document.title, location.pathname);
        // Decode token to get user info and decide where to redirect
        const decodedToken = jwtDecode(tokens.accessToken);
        const roles = decodedToken.roles || [];
        if (roles.includes("SUPER_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/userHome");
        }
      } catch (err) {
        console.error("GitHub authentication error:", err);
        setError("Authentication failed. Please try again.");
        setLoading(false);
      }
    };

    processGitHubCallback();
  }, [location, navigate, loginHandler]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B14] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-500"></div>
        <p className="mt-4 text-yellow-500">Authenticating with GitHub, please wait...</p>
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
};

export default GitHubCallback;
