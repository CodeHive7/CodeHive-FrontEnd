import Navbar from "../components/layouts/Navbar.jsx";
import Hero from "../components/Home/Hero.jsx";
import Features from "../components/Home/Features.jsx";
import Tools from "../components/Home/Tools.jsx";
import Integrations from "../components/Home/Integrations.jsx";
import Pricing from "../components/Home/Pricing.jsx";
import FAQ from "../components/Home/FAQ.jsx";
import Footer from "../components/Home/Footer.jsx";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gray-950 text-white">
            <Navbar />
            <Hero />
            <Features />
            <Tools />
            <Integrations />
            <Pricing />
            <FAQ />
            <Footer />
        </div>
    );
}
