import Hero from "../components/Home/Hero.jsx";
import Features from "../components/Home/Features.jsx";
import Tools from "../components/Home/Tools.jsx";
import Integrations from "../components/Home/Integrations.jsx";
import Pricing from "../components/Home/Pricing.jsx";
import FAQ from "../components/Home/FAQ.jsx";

export default function HomePage() {
    return (
        <div className="bg-gray-900 text-white min-h-screen">
            <Hero />
            <Features />
            <Tools />
            <Integrations />
            <Pricing />
            <FAQ />
        </div>
    );
}
