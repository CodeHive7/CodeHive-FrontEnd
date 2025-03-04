export default function Footer() {
    const sections = [
        {
            title: "Product",
            links: ["Features", "Pricing", "Templates", "Guides"],
        },
        {
            title: "Resources",
            links: ["Blog", "Documentation", "Help Center", "Support"],
        },
        {
            title: "Company",
            links: ["About", "Careers", "Contact", "Press"],
        },
        {
            title: "Connect",
            links: ["Twitter", "LinkedIn", "GitHub", "Discord"],
        },
    ];

    return (
        <footer className="px-4 py-20 bg-[#121212]">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12">
                    {sections.map((section, i) => (
                        <div key={i}>
                            <h3 className="font-semibold text-yellow-400 mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, j) => (
                                    <li key={j}>
                                        <a href="#" className="text-gray-400 hover:text-yellow-300">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-yellow-400 mt-16 pt-8 text-center text-gray-300">
                    <p>© 2024 CodeHive. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}