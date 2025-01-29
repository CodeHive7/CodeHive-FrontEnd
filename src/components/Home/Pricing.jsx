export default function Pricing() {
    const plans = [
        { name: "Starter", price: "$29", features: ["10GB Storage", "Basic Support"] },
        { name: "Pro", price: "$49", features: ["50GB Storage", "Priority Support"] },
        { name: "Enterprise", price: "$79", features: ["Unlimited Storage", "24/7 Support"] },
    ];

    return (
        <section className="px-4 py-20 bg-secondary text-center">
            <h2 className="text-4xl font-bold">Find the right plan for your business</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <div key={i} className="bg-primary p-6 rounded-lg">
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <p className="text-4xl">{plan.price}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
