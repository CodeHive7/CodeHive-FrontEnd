import { Github } from "lucide-react";

const OAuthButton = ({ provider, onClick, isLoading }) => {
  const getIcon = (providerName) => {
    switch (providerName.toLowerCase()) {
      case 'github':
        return <Github className="h-5 w-5" />;
      // Add more cases for other providers like Google, etc.
      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className={`w-full h-12 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-md flex items-center justify-center transition-colors disabled:opacity-50`}
    >
      {getIcon(provider)}
      <span className="ml-2">
        {isLoading ? "Connecting..." : `Sign in with ${provider}`}
      </span>
    </button>
  );
};

export default OAuthButton;