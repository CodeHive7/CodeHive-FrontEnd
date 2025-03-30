import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProjectChatPage from '../ProjectChatPage';

export default function ChatStabilizer() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [isStable, setIsStable] = useState(false);
    const [error, setError] = useState(null);
    const stableRef = useRef(false);
    
    // Use an effect to stabilize and prevent rapid mount/unmount cycles
    useEffect(() => {
        console.log("ChatStabilizer mounting for project:", projectId);
        let mounted = true;
        
        // Only start stabilization timer if we haven't already stabilized
        if (!stableRef.current) {
            // Add a longer delay before marking component as stable
            const stabilizeTimer = setTimeout(() => {
                if (mounted) {
                    console.log("Chat component stabilized");
                    stableRef.current = true;
                    setIsStable(true);
                }
            }, 800);
            
            return () => {
                mounted = false;
                clearTimeout(stabilizeTimer);
                console.log("ChatStabilizer unmounting before stabilization");
            };
        }
        
        return () => {
            mounted = false;
            console.log("ChatStabilizer unmounting after stabilization");
        };
    }, [projectId]);

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0A0B14] to-[#12141F] text-white flex flex-col items-center justify-center p-4">
                <p>Failed to load chat: {error.message}</p>
                <button 
                    onClick={() => navigate('/user/messages')}
                    className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded"
                >
                    Back to Messages
                </button>
            </div>
        );
    }

    // Show loading state until stable
    if (!isStable) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#0A0B14] to-[#12141F] text-white flex items-center justify-center">
                <div className="text-yellow-500 text-lg">
                    <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Preparing chat environment...
                    </div>
                </div>
            </div>
        );
    }

    // Once stable, render the actual chat page
    return <ProjectChatPage />;
}