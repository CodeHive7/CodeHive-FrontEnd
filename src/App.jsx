import AppRoutes from "./routes/AppRoutes.jsx";
import { ChatProvider } from "./pages/User/chat/components/ChatContext.jsx";
import {AuthProvider} from "./context/Auth/AuthContext.jsx";
import {BrowserRouter as Router} from "react-router-dom";
import NavigationGuard from "./pages/User/chat/components/NavigationGuard.jsx";

const App = () => {
    return (
        <Router>
        <AuthProvider>
            <ChatProvider>
                <NavigationGuard />
            <AppRoutes />
            </ChatProvider>
        </AuthProvider>
        </Router>
    );
};

export default App;