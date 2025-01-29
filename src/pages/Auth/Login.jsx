import LoginForm from "../../components/auth/LoginForm.jsx";
import { Link } from "react-router-dom"

const Login = () => {
    return (
        <div className="min-h-screen bg-[#0A0B14] flex flex-col">
            {/* Background gradient */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-600/20 to-blue-600/20 blur-3xl" />

            {/* Logo */}
            <div className="p-6">
                <Link to="/">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-45">
                        <div className="w-full h-full bg-[#0A0B14] transform rotate-45 translate-x-1 translate-y-1" />
                    </div>
                </Link>
            </div>

            {/* Main content */}
            <div className="flex-1 flex items-center justify-center px-4">
                <LoginForm />
            </div>
        </div>
    )
}

export default Login