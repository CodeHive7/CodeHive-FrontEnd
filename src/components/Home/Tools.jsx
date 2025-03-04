export default function Tools() {
    return (
        <section className="px-4 py-20 bg-black text-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-16 text-center">
                    <span className="text-yellow-400">Empower</span> Your Workflow with Smart Tools
                </h2>

                <div className="flex gap-4 mb-12 justify-center">
                    <span className="px-4 py-2 bg-yellow-500 text-black font-semibold rounded-full text-sm">
                        Features
                    </span>
                    <span className="px-4 py-2 bg-[#12141F] border border-yellow-400 rounded-full text-sm text-yellow-400">
                        Extensions
                    </span>
                    <span className="px-4 py-2 bg-[#12141F] border border-yellow-400 rounded-full text-sm text-yellow-400">
                        Optimization
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Boost Productivity with AI-Powered Tools</h3>
                        <p className="text-gray-400 mb-6">
                            Automate tasks, collaborate seamlessly, and keep your workflow efficient. Unlock the power of intelligent
                            project management.
                        </p>
                        <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                            Learn more →
                        </button>
                    </div>

                    {/* 3D Illustration Similar to Hero Section */}
                    <div className="aspect-square relative bg-[#12141F] rounded-lg p-8 border border-yellow-400">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg transform rotate-45" />
                            <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-yellow-700 absolute -top-12 -right-12 rounded" />
                            <div className="w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-500 absolute bottom-0 -left-8" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
