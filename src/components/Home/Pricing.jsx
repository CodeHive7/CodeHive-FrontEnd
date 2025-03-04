export default function Pricing() {
    const plans = [
        {
            name: "Basic",
            price: "$29",
            features: ["10GB Storage", "Basic Support", "2 Team Members"],
        },
        {
            name: "Pro",
            price: "$49",
            features: ["50GB Storage", "Priority Support", "5 Team Members"],
        },
        {
            name: "Enterprise",
            price: "$79",
            features: ["Unlimited Storage", "24/7 Support", "Unlimited Team Members"],
        },
    ];

    return (
        <section className="px-4 py-20 bg-black text-white">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4">
                    Choose the <span className="text-yellow-400">Perfect Plan</span> for Your Business
                </h2>
                <p className="text-gray-400 mb-16">
                    Scale effortlessly with plans that fit your needs and team size.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={i} className="bg-[#12141F] p-8 rounded-lg border border-yellow-400 shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                            <div className="text-4xl font-bold text-yellow-400 mb-6">{plan.price}</div>
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="text-gray-400">{feature}</li>
                                ))}
                            </ul>
                            <button
                                className={`w-full px-6 py-3 rounded-md text-lg font-semibold transition-transform transform hover:scale-105 ${
                                    i === 1
                                        ? "bg-yellow-400 text-black shadow-lg hover:bg-yellow-500"
                                        : "border border-yellow-400 text-yellow-400 hover:bg-yellow-500 hover:text-black"
                                }`}
                            >
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
