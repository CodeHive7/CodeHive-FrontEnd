import Footer from "../Home/Footer.jsx";

export default function MainLayout({ children }) {
    return (
        <div className="bg-[#0A0B14] text-white min-h-screen">
            {children}
            <Footer />
        </div>
    );
}
