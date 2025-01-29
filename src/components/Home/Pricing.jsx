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
    ]

    const buttonBaseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    const buttonVariants = {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    }
    const buttonSizes = {
        lg: "h-10 rounded-md px-8",
    }

    return (
        <section className="px-4 py-20 bg-[#0D0E17]">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-4">Let's find the right plan for your business</h2>
                <p className="text-gray-400 mb-16">
                    Whether you're just starting out or scaling up, we have a plan that's right for you
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {plans.map((plan, i) => (
                        <div key={i} className="bg-[#12141F] p-8 rounded-lg">
                            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                            <div className="text-4xl font-bold mb-6">{plan.price}</div>
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, j) => (
                                    <li key={j} className="text-gray-400">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className={`${buttonBaseStyles} ${buttonVariants[i === 1 ? "default" : "outline"]} ${buttonSizes.lg} w-full`}>
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}