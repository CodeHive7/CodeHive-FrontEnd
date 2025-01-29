export default function FAQ() {
    const faqs = [
        {
            question: "What is the Platform Package? Do I have and Plan I can cancel?",
            answer: "The Platform Package includes all our core features. Yes, you can cancel your plan at any time.",
        },
        {
            question: "Do I need coding knowledge to use this product?",
            answer: "No coding knowledge is required. Our platform is designed to be user-friendly for all skill levels.",
        },
    ]

    return (
        <section className="px-4 py-20">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-16 text-center">FAQs</h2>
                <div className="space-y-8">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-[#12141F] p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">{faq.question}</h3>
                            <p className="text-gray-400">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

