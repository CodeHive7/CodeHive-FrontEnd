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
    ]

    return (
        <footer className="px-4 py-20 bg-[#0D0E17]">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-12">
                    {sections.map((section, i) => (
                        <div key={i}>
                            <h3 className="font-semibold mb-4">{section.title}</h3>
                            <ul className="space-y-2">
                                {section.links.map((link, j) => (
                                    <li key={j}>
                                        <a href="#" className="text-gray-400 hover:text-white">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-800 mt-16 pt-8 text-center text-gray-400">
                    <p>© 2024 Your Company. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

