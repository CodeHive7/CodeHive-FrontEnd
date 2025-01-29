export default function Features() {
    const features = [
        { title: "Experience", desc: "Enhance your workflow with better tools." },
        { title: "Animation", desc: "Create stunning animations effortlessly." },
        { title: "Modeling", desc: "Build powerful 3D models quickly." },
    ];

    return (
        <section className="px-4 py-20 text-center">
            <h2 className="text-4xl font-bold mb-16">Many tools to express your creativity</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div key={index} className="bg-primary p-6 rounded-lg">
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p className="text-gray-400">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
