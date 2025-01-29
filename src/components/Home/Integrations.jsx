export default function Integrations() {
    const integrations = [
        { logo: "https://v0.dev/placeholder.svg", name: "Integration 1" },
        { logo: "https://v0.dev/placeholder.svg", name: "Integration 2" },
        { logo: "https://v0.dev/placeholder.svg", name: "Integration 3" },
        { logo: "https://v0.dev/placeholder.svg", name: "Integration 4" },
        { logo: "https://v0.dev/placeholder.svg", name: "Integration 5" },
        { logo: "https://v0.dev/placeholder.svg", name: "Integration 6" },
    ]

    return (
        <section className="px-4 py-20">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-16">An ecosystem of integrations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {integrations.map((item, i) => (
                        <div key={i} className="bg-[#12141F] p-6 rounded-lg aspect-square flex items-center justify-center">
                            <img src={item.logo || "/placeholder.svg"} alt={item.name} className="w-12 h-12" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

