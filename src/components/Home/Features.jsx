export default function Features() {
    const features = [
        {
            icon: "/images/managetasks.jpg",
            title: "Smart Task Management",
            description: "Organize your workflow with intuitive task boards, Kanban views, and advanced automation tools.",
        },
        {
            icon: "/images/teamhive.jpg",
            title: "Seamless Collaboration",
            description: "Connect with your team, share files, and communicate effortlessly in one unified workspace.",
        },
        {
            icon: "/images/automatisationhive.jpg",
            title: "Powerful Automation",
            description: "Automate repetitive tasks and workflows to boost productivity without extra effort.",
        },
    ];

    return (
        <section className="px-4 py-20">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-center mb-16">
                    Smart Tools to <span className="text-yellow-400">Supercharge</span> Your Work
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-[#12141F] p-6 rounded-lg text-center shadow-lg">
                            <img src={feature.icon} alt={feature.title} className="w-12 h-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
