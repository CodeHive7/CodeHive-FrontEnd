import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Terminal, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
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
            }, 1500);
            
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
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4 font-mono">
                <div className="max-w-md w-full bg-gray-900 border border-red-500/30 rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center">
                        <Terminal className="h-4 w-4 text-red-400 mr-2" />
                        <span className="text-red-400 font-semibold">fatal_error.log</span>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-amber-500 font-bold">ChatInitializationError</p>
                                <p className="text-gray-300 mt-1">Error: {error.message || "Failed to initialize chat environment."}</p>
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-800 text-sm">
                            <div className="text-gray-500">
                                <span className="text-green-400">➜</span> <span className="text-blue-400">debug</span> Try one of the following:
                            </div>
                            <div className="flex mt-4 space-x-3">
                                <button 
                                    onClick={() => navigate('/user/messages')}
                                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-white text-sm transition-colors flex items-center"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                                    chat.navigate('/messages')
                                </button>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-sm transition-colors flex items-center"
                                >
                                    <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                                    connection.retry()
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Subtle code pattern background */}
                <div className="fixed inset-0 opacity-5 pointer-events-none z-[-1]"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.1' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                        backgroundSize: "112px 200px"
                    }}>
                </div>
            </div>
        );
    }

    // Show loading state until stable
    if (!isStable) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center font-mono">
                <div className="text-center">
                    <div className="relative mb-4">
                        <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Terminal className="h-6 w-6 text-amber-500" />
                        </div>
                    </div>
                    <div className="flex items-center justify-center text-amber-400">
                        <span className="mr-2">chat.initialize()</span>
                        <span className="animate-pulse font-mono">|</span>
                    </div>
                    <p className="text-gray-400 mt-2 text-sm">// preparing secure connection</p>
                </div>

                {/* Subtle code pattern background */}
                <div className="fixed inset-0 opacity-5 pointer-events-none z-[-1]"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.1' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                        backgroundSize: "112px 200px"
                    }}>
                </div>
            </div>
        );
    }

    // Once stable, render the actual chat page
    return <ProjectChatPage />;
}