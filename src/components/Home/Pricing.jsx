import { HiCheck, HiCode } from 'react-icons/hi';

export default function Pricing() {
    const plans = [
        {
            name: "Developer",
            price: "$29",
            features: [
                "10GB Storage",
                "Basic CI/CD Pipeline",
                "2 Team Members",
                "Core IDE Features",
                "Community Support"
            ],
            highlighted: false
        },
        {
            name: "Team",
            price: "$49",
            features: [
                "50GB Storage",
                "Advanced CI/CD Pipeline",
                "5 Team Members",
                "Advanced IDE Features",
                "Priority Support",
                "Code Review Automation"
            ],
            highlighted: true
        },
        {
            name: "Enterprise",
            price: "$79",
            features: [
                "Unlimited Storage",
                "Custom CI/CD Pipeline",
                "Unlimited Team Members",
                "Full IDE Suite",
                "24/7 Dedicated Support",
                "Custom Integrations",
                "On-Premise Option"
            ],
            highlighted: false
        },
    ];

    return (
        <section className="px-4 py-20 bg-gray-900 text-white">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">
                    <span className="text-amber-500 font-mono">pricing</span>.<span className="text-green-400">subscribe</span><span className="text-white">()</span>
                </h2>
                <p className="text-gray-400 mb-16 max-w-lg mx-auto border-l-2 border-amber-500 pl-3 text-left font-mono text-sm">
                    // Choose a plan that scales with your development needs
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div 
                            key={i} 
                            className={`bg-gray-950 p-8 rounded-lg border ${
                                plan.highlighted 
                                    ? "border-amber-500 shadow-lg shadow-amber-500/10" 
                                    : "border-gray-700"
                            } relative`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    POPULAR
                                </div>
                            )}
                            <div className="bg-gray-900 inline-block px-4 py-2 rounded-md border border-gray-700 mb-3">
                                <h3 className="text-xl font-mono">{plan.name}</h3>
                            </div>
                            <div className="flex items-center justify-center mb-6">
                                <div className="text-4xl font-bold text-white">{plan.price}</div>
                                <div className="text-gray-400 ml-1">/month</div>
                            </div>
                            <div className="bg-gray-900 p-2 rounded-md border border-gray-700 font-mono text-xs mb-6 text-amber-500">
                                <code>npm install @codehive/{plan.name.toLowerCase()}</code>
                            </div>
                            <ul className="space-y-3 mb-8 text-left">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="flex items-start">
                                        <HiCheck className="text-amber-500 mt-1 mr-2 flex-shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                className={`w-full px-6 py-3 rounded-md text-lg font-semibold transition-transform transform hover:scale-105 flex items-center justify-center ${
                                    plan.highlighted
                                        ? "bg-amber-600 text-white hover:bg-amber-700"
                                        : "border border-amber-500 text-amber-500 hover:bg-amber-600 hover:text-white"
                                }`}
                            >
                                <HiCode className="mr-2" />
                                <span>Select Plan</span>
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 bg-gray-950 border border-gray-700 p-4 rounded-md inline-block">
                    <p className="text-gray-400 font-mono">Need a custom solution?</p>
                    <a href="/contact" className="text-amber-500 hover:text-amber-400 font-mono">
                        contact.sales('enterprise')
                    </a>
                </div>
            </div>
        </section>
    );
}