import LoginForm from "../../components/auth/LoginForm.jsx";
import { Link } from "react-router-dom";

const Login = () => {
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
                <LoginForm />
            </div>
        </div>
    );
};

export default Login;