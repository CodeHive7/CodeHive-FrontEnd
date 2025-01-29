export default function Features() {
    const testimonials = [
        {
            avatar: "https://v0.dev/placeholder.svg",
            name: "Sarah K.",
            role: "Product Designer",
            text: "The app helped me streamline my workflow and boost productivity.",
        },
        {
            avatar: "https://v0.dev/placeholder.svg",
            name: "Michael R.",
            role: "Developer",
            text: "Incredible tools that made our team collaboration seamless.",
        },
        {
            avatar: "https://v0.dev/placeholder.svg",
            name: "Emily T.",
            role: "Marketing Lead",
            text: "Game-changing features that transformed our creative process.",
        },
    ]

    return (
        <section className="px-4 py-20">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-16">Many tools to express your creativity</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, i) => (
                        <div key={i} className="bg-[#12141F] p-6 rounded-lg">
                            <div className="flex items-center gap-4 mb-4">
                                <img src={item.avatar || "/placeholder.svg"} alt="" className="w-12 h-12 rounded-full" />
                                <div>
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-gray-400">{item.role}</p>
                                </div>
                            </div>
                            <p className="text-gray-300">{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

