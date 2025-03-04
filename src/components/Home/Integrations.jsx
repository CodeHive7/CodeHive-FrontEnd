export default function Integrations() {
    const integrations = [
        { logo: "/images/slack.png", name: "Slack" },
        { logo: "/images/trello.png", name: "Trello" },
        { logo: "/images/google-drive.png", name: "Google Drive" },
        { logo: "/images/figma.png", name: "Figma" },
        { logo: "/images/github.png", name: "GitHub" },
        { logo: "/images/notion.png", name: "Notion" },
    ];

    return (
        <section className="px-4 py-20">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-16">
                    Works with Your <span className="text-yellow-400">Favorite Tools</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {integrations.map((item, i) => (
                        <div key={i} className="bg-[#12141F] p-6 rounded-lg aspect-square flex items-center justify-center">
                            <img src={item.logo} alt={item.name} className="w-12 h-12" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
