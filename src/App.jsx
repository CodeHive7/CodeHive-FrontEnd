import AppRoutes from "./routes/AppRoutes.jsx";
import {AuthProvider} from "./context/Auth/AuthContext.jsx";
import {BrowserRouter as Router} from "react-router-dom";

const App = () => {
    return (
        <Router>
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
        </Router>
    );
};

export default App;