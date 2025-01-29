import { Link } from "react-router-dom";

export default function Hero() {
    return (
        <section className="relative px-4 pt-20 pb-32 text-center">
            <h1 className="text-5xl font-bold mb-6">
                A powerful suite of <br /> user-centric products
            </h1>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                The strong programming begins now. Let us help you take it to the next level.
            </p>
            <div className="flex gap-4 justify-center">
                <Link to="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg">
                    Get Started Free
                </Link>
                <Link to="/" className="px-6 py-3 border border-white rounded-lg">
                    Read Docs
                </Link>
            </div>
        </section>
    );
}
