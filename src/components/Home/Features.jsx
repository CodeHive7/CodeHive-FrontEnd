import { HiCode, HiUserGroup, HiClock } from 'react-icons/hi';

export default function Features() {
    const features = [
        {
            icon: <HiCode className="w-8 h-8 text-amber-500" />,
            title: "Git-Based Workflow",
            description: "Manage code repositories, track changes, and collaborate with built-in version control.",
            code: "git.commit('feat: add collaborative feature')"
        },
        {
            icon: <HiUserGroup className="w-8 h-8 text-amber-500" />,
            title: "Team Synchronization",
            description: "Collaborate in real-time with team members through shared environments and live coding.",
            code: "team.sync({liveEditing: true})"
        },
        {
            icon: <HiClock className="w-8 h-8 text-amber-500" />,
            title: "CI/CD Pipeline",
            description: "Automate testing, builds, and deployments with integrated continuous integration tools.",
            code: "pipeline.deploy({environment: 'production'})"
        },
    ];

    return (
        <section className="px-4 py-20">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold text-center mb-6">
                    <span className="text-green-400 font-mono">function</span> <span className="text-blue-400">features</span><span className="text-amber-500">()</span>
                </h2>
                <p className="text-gray-400 mb-16 max-w-xl mx-auto border-l-2 border-amber-500 pl-3 text-left font-mono text-sm">
                    // Optimize your development cycle with tools designed for modern software teams
                </p>
                
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, i) => (
                        <div key={i} className="bg-gray-900 border border-gray-800 p-6 rounded-lg text-left shadow-lg hover:border-amber-600 transition-colors">
                            <div className="mb-4 flex items-center">
                                {feature.icon}
                                <h3 className="text-xl font-semibold ml-2">{feature.title}</h3>
                            </div>
                            <p className="text-gray-400 mb-4">{feature.description}</p>
                            <div className="bg-gray-950 p-3 rounded border border-gray-800">
                                <code className="text-sm text-amber-500 font-mono">{feature.code}</code>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}