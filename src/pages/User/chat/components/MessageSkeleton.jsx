export default function MessageSkeleton({ count = 1, align = "left" }) {
    const renderSkeleton = (index) => {
        const isRight = align === "right" || (count > 1 && index % 2 === 0);
        return (
            <div 
                key={index}
                className={`flex ${isRight ? 'justify-end' : 'justify-start'} mb-4`}
            >
                <div 
                    className={`animate-pulse rounded-xl p-4 max-w-[70%] 
                      ${isRight 
                        ? 'bg-yellow-500/20 rounded-tr-sm' 
                        : 'bg-gray-800/70 rounded-tl-sm'}`}
                >
                    {!isRight && (
                        <div className="h-4 w-16 bg-gray-700 rounded mb-2"></div>
                    )}
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-700 rounded w-full"></div>
                        <div className="h-3 bg-gray-700 rounded w-5/6"></div>
                        {index % 3 === 0 && (
                            <div className="h-3 bg-gray-700 rounded w-4/6"></div>
                        )}
                    </div>
                    <div className="flex justify-end mt-2">
                        <div className="h-2 w-10 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        );
    };
    
    if (count === 1) {
        return renderSkeleton(0);
    }
    
    return (
        <div className="space-y-3 w-full">
            {[...Array(count)].map((_, index) => renderSkeleton(index))}
        </div>
    );
}