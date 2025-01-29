export default function Tools() {
    return (
        <section className="px-4 py-20 bg-[#0D0E17]">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold mb-16">
                    Features to help you create
                    <br />
                    your best designs
                </h2>

                <div className="flex gap-4 mb-12">
                    <span className="px-4 py-2 bg-purple-600 rounded-full text-sm">Features</span>
                    <span className="px-4 py-2 bg-[#12141F] rounded-full text-sm">Extensions</span>
                    <span className="px-4 py-2 bg-[#12141F] rounded-full text-sm">Optimization</span>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Kickstart your project with these tools</h3>
                        <p className="text-gray-400 mb-6">
                            Get started quickly with pre-built components and templates. Customize everything to match your brand and
                            style.
                        </p>
                        <button className="text-purple-400 hover:text-purple-300">Learn more →</button>
                    </div>

                    {/* 3D Illustration similar to hero section */}
                    <div className="aspect-square relative bg-[#12141F] rounded-lg p-8">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg transform rotate-45" />
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 absolute -top-12 -right-12 rounded" />
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 absolute bottom-0 -left-8" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

