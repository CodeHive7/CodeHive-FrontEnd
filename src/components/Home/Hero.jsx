

export default function Hero() {
    const buttonBaseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
    const buttonVariants = {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    }
    const buttonSizes = {
        lg: "h-10 rounded-md px-8",
    }

    return (
        <section className="relative px-4 pt-20 pb-32 overflow-hidden">
            {/* Background gradient effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto text-center relative z-10">
                <h1 className="text-5xl font-bold mb-6">
                    A powerful suite of
                    <br />
                    user-centric products
                </h1>
                <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                    The strong programming begins now. Let us help you take it to the next level. We are here to help you succeed.
                </p>
                <div className="flex gap-4 justify-center">
                    <button className={`${buttonBaseStyles} ${buttonVariants.default} ${buttonSizes.lg}`}>
                        Get Started Free
                    </button>
                    <button className={`${buttonBaseStyles} ${buttonVariants.outline} ${buttonSizes.lg}`}>
                        Read Docs
                    </button>
                </div>

                {/* 3D Illustration */}
                <div className="mt-16 bg-[#12141F] rounded-lg p-8 max-w-4xl mx-auto">
                    <div className="aspect-[16/9] relative">
                        {/* Geometric shapes */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg transform rotate-45" />
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 absolute -top-12 -right-12 rounded" />
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 absolute bottom-0 -left-8" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}