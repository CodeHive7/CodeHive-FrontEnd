export default function FAQ() {
    const faqs = [
        {
            question: "What is CodeHive? Do I have a plan I can cancel?",
            answer: "CodeHive is an advanced platform for task management and collaboration. Yes, you can cancel your plan anytime.",
        },
        {
            question: "Do I need coding knowledge to use CodeHive?",
            answer: "No coding knowledge is required. CodeHive is designed to be user-friendly for all skill levels.",
        },
    ];

    return (
        <section className="px-4 py-20">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-16 text-center text-yellow-400">FAQs</h2>
                <div className="space-y-8">
                    {faqs.map((faq, i) => (
                        <div key={i} className="bg-[#1A1A1D] p-6 rounded-lg border border-yellow-400">
                            <h3 className="text-xl font-semibold text-yellow-300 mb-4">{faq.question}</h3>
                            <p className="text-gray-300">{faq.answer}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}