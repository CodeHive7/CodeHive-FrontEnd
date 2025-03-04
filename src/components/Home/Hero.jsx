export default function Hero() {
    return (
        <section className="relative px-4 pt-20 pb-32 overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto text-center relative z-10">
                {/* 🐝 Logo */}
                <div className="flex justify-center">
                    <img src="/images/beelogo.png" alt="Bee Logo" className="w-20 h-20 animate-bounce" />
                </div>

                <h1 className="text-5xl font-bold mb-6">
                    <span className="text-yellow-400">Buzz</span> Your Workflow
                    <br />
                    The Ultimate Collaboration Platform
                </h1>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    Build, collaborate, and manage tasks like never before. Our bee-inspired platform ensures maximum efficiency with seamless team coordination.
                </p>

                {/* Buttons */}
                <div className="flex gap-4 justify-center">
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-md text-lg font-semibold">
                        Get Started Free
                    </button>
                    <button className="border border-gray-400 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-700">
                        Read Docs
                    </button>
                </div>

                {/* Hero Image */}
                <div className="mt-16">
                    <img src="/images/beehero.jpg" alt="Hero Image" className="mx-auto rounded-lg shadow-lg" />
                </div>
            </div>
        </section>
    );
}
