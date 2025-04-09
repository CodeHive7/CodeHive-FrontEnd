import { useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);
    
    const faqs = [
        {
            question: "What is CodeHive and how does it help developers?",
            answer: "CodeHive is an integrated development platform designed for software teams. It combines code collaboration, CI/CD pipelines, project management, and deployment tools in one cohesive ecosystem, optimizing your entire development workflow."
        },
        {
            question: "Can I use CodeHive with my existing repositories?",
            answer: "Yes, CodeHive seamlessly integrates with GitHub, GitLab, and Bitbucket. You can import existing repositories and immediately leverage our advanced collaboration features without disrupting your workflow."
        },
        {
            question: "How does CodeHive's pricing structure work?",
            answer: "CodeHive offers tiered pricing based on team size and feature needs. Our Developer plan is perfect for individuals, while Team and Enterprise plans offer additional capabilities for larger organizations. All plans include core development tools, with advanced features available in higher tiers."
        },
        {
            question: "Is there a free trial available?",
            answer: "Yes, CodeHive offers a 14-day free trial on all plans with no credit card required. You can explore all features and determine which plan best suits your development needs before committing."
        },
    ];

    return (
        <section className="px-4 py-20 bg-gray-950">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center">
                    <span className="text-amber-500 font-mono">faq</span>.<span className="text-green-400">getAnswers</span><span className="text-white">()</span>
                </h2>
                <p className="text-gray-400 mb-16 max-w-lg mx-auto text-center border-l-2 border-amber-500 pl-3 text-left font-mono text-sm">
                    // Common questions about our platform
                </p>
                
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div 
                            key={i} 
                            className={`bg-gray-900 rounded-lg border ${
                                openIndex === i ? "border-amber-500" : "border-gray-700"
                            }`}
                        >
                            <button 
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="flex justify-between items-center w-full p-6 text-left"
                            >
                                <h3 className="text-lg font-semibold">
                                    <span className="text-amber-500 font-mono mr-2">Q:</span>
                                    {faq.question}
                                </h3>
                                {openIndex === i ? (
                                    <HiChevronUp className="text-amber-500 flex-shrink-0" />
                                ) : (
                                    <HiChevronDown className="text-amber-500 flex-shrink-0" />
                                )}
                            </button>
                            {openIndex === i && (
                                <div className="p-6 pt-0 border-t border-gray-800">
                                    <p className="text-gray-400">
                                        <span className="text-green-400 font-mono mr-2">A:</span>
                                        {faq.answer}
                                    </p>
                                    <div className="mt-4 bg-gray-950 p-3 rounded-md border border-gray-800">
                                        <code className="text-xs font-mono text-amber-500">
                                            // Example use case<br/>
                                            const solution = await codehive.{i === 0 ? "getStarted()" : i === 1 ? "importRepo('github/your-repo')" : i === 2 ? "getPricing('team')" : "startTrial(14)"};
                                        </code>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 text-center">
                    <p className="text-gray-400 mb-4">Have more questions?</p>
                    <a href="/docs" className="inline-block px-6 py-3 bg-gray-900 border border-amber-500 text-amber-500 rounded-md hover:bg-amber-600 hover:text-white transition-colors font-mono">
                        docs.openDeveloperGuide()
                    </a>
                </div>
            </div>
        </section>
    );
}