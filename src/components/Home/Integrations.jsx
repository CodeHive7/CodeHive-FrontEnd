export default function Integrations() {
    return (
        <section className="px-4 py-20 text-center">
            <h2 className="text-4xl font-bold mb-16">An ecosystem of integrations</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-primary p-6 rounded-lg">
                        <p className="text-gray-400">Integration {i + 1}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
