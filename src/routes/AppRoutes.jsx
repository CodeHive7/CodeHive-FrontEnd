import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Register from "../pages/Auth/Register.jsx";
import Login from "../pages/Auth/Login.jsx";
import AdminRoutes from "./adminRoutes/AdminRoutes.jsx";
import UserHomePage from "../pages/User/UserHomePage.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/admin/*" element={<AdminRoutes/>}/>
            <Route path="/userHome" element={<UserHomePage/>}/>
        </Routes>
    );
};

export default AppRoutes;
