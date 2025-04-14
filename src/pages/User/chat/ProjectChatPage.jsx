import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth/AuthContext";
import { useChat } from "./components/ChatContext.jsx";
import { fetchProjectById } from "../../../services/userService/UserService.js";
import { AlertCircle, Terminal, RefreshCw, ArrowLeft } from "lucide-react";

import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import MessageSkeleton from "./components/MessageSkeleton";

export default function ProjectChatPage() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const initializationRef = useRef(false);
    const safetyTimeoutRef = useRef(null);
    
    // Get chat context
    const { 
        connected,
        connecting,
        messages,
        loadingMessages,
        connect,
        disconnect,
        sendMessage,
        addOptimisticMessage
    } = useChat();
    
    const [project, setProject] = useState(null);
    const [showProjectInfo, setShowProjectInfo] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Initialization logic remains unchanged...
    useEffect(() => {
        let mounted = true;
        let connectionTimeoutId = null;
        
        const initializeChat = async () => {
            if (!mounted || initializationRef.current) return;
            
            // Set initialization flag
            initializationRef.current = true;
            
            // Set safety timeout with a longer delay
            safetyTimeoutRef.current = setTimeout(() => {
                if (!mounted) return;
                console.warn("Chat initialization safety timeout triggered");
                setLoading(false);
                setError({
                    title: "Connection Timeout",
                    message: "Unable to connect to the chat. Please check your connection and try again."
                });
            }, 25000); // Increased timeout to 25s
            
            try {
                console.log(`Initializing chat for project ${projectId}`);
                
                // Fetch project details first
                const projectData = await fetchProjectById(projectId);
                if (!mounted) return;
                setProject(projectData);
                
                // Add longer delay before connecting to ensure component is fully mounted
                await new Promise(resolve => setTimeout(resolve, 1000));
                if (!mounted) return;
                
                // Force disconnect any existing connections first
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Attempt to connect with retry logic
                let attempts = 0;
                let success = false;
                
                while (attempts < 2 && !success && mounted) {
                    try {
                        console.log(`Connection attempt ${attempts + 1} for project ${projectId}`);
                        success = await connect(projectId);
                        
                        if (success) {
                            console.log("Chat connection successful");
                            break;
                        }
                        
                        attempts++;
                        if (attempts < 2 && mounted) {
                            console.log("Waiting before retry...");
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    } catch (err) {
                        console.error("Connection attempt failed:", err);
                        attempts++;
                        if (attempts < 2 && mounted) {
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                }
                
                if (!mounted) return;
                
                if (!success) {
                    throw new Error("Failed to establish chat connection after multiple attempts");
                }
                
                console.log("Chat initialization complete");
                setLoading(false);
                
                // Clear safety timeout
                if (safetyTimeoutRef.current) {
                    clearTimeout(safetyTimeoutRef.current);
                    safetyTimeoutRef.current = null;
                }
            } catch (error) {
                console.error("Chat initialization error:", error);
                if (!mounted) return;
                
                setError({
                    title: "Connection Failed",
                    message: "Unable to connect to the chat service. Please check your network connection."
                });
                setLoading(false);
                
                // Clear safety timeout
                if (safetyTimeoutRef.current) {
                    clearTimeout(safetyTimeoutRef.current);
                    safetyTimeoutRef.current = null;
                }
            }
        };
        
        // Set a delay before starting initialization to let the component fully mount
        connectionTimeoutId = setTimeout(() => {
            initializeChat();
        }, 1000);
        
        // Cleanup function
        return () => {
            console.log("ProjectChatPage unmounting, cleaning up");
            mounted = false;
            
            if (connectionTimeoutId) {
                clearTimeout(connectionTimeoutId);
            }
            
            // Clear any pending timeouts
            if (safetyTimeoutRef.current) {
                clearTimeout(safetyTimeoutRef.current);
                safetyTimeoutRef.current = null;
            }
            
            // Don't call disconnect here - the context will handle it
            initializationRef.current = false;
        };
    }, [projectId, connect]);
    
    // Other effect hooks remain unchanged...
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    
    useEffect(() => {
        let loadingTimeoutId = null;
        
        if (loadingMessages && connected) {
            console.log("Setting safety timeout for message loading state");
            loadingTimeoutId = setTimeout(() => {
                console.log("Force-resetting message loading state after timeout");
                // Force the context to update via a direct call
                disconnect();
                setTimeout(() => connect(projectId), 500);
            }, 10000); // 10 second timeout
        }
        
        return () => {
            if (loadingTimeoutId) clearTimeout(loadingTimeoutId);
        };
    }, [loadingMessages, connected, projectId, disconnect, connect]);
    
    useEffect(() => {
        let forceResetTimerId = null;
        
        if (connected && loadingMessages) {
            forceResetTimerId = setTimeout(() => {
                // Create a new synthetic message history event to force state update
                const event = new CustomEvent('chat-history', { 
                    detail: { 
                        messages: [], 
                        projectId 
                    } 
                });
                window.dispatchEvent(event);
            }, 8000);
        }
        
        return () => {
            if (forceResetTimerId) clearTimeout(forceResetTimerId);
        };
    }, [connected, loadingMessages, projectId]);
    
    // Handle sending a new message
    const handleSendMessage = async (content) => {
        if (!content.trim() || !connected) return;
        
        // Add optimistic message
        const optimisticMsg = addOptimisticMessage(content, user);
        
        // Send actual message
        sendMessage(content);
        
        return optimisticMsg;
    };
    
    // Show error state if needed
    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
                <div className="max-w-md w-full bg-gray-900 border border-red-500/30 rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                        <span className="text-red-400 font-semibold">Connection Problem</span>
                    </div>
                    
                    <div className="p-6 space-y-4">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-amber-500 font-bold">{error.title}</p>
                                <p className="text-gray-300 mt-1">{error.message}</p>
                            </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-800 text-sm">
                            <div className="text-gray-300">
                                What would you like to do?
                            </div>
                            <div className="flex mt-4 space-x-3">
                                <button 
                                    onClick={() => {
                                        disconnect();
                                        navigate("/user/messages");
                                    }}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded text-white text-sm transition-colors flex items-center"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Messages
                                </button>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-sm transition-colors flex items-center"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Subtle background pattern */}
                <div className="fixed inset-0 opacity-5 pointer-events-none z-[-1]"
                    style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.1' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                        backgroundSize: "112px 200px"
                    }}>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col">
            <ChatHeader 
                loading={loading}
                project={project}
                connected={connected}
                showProjectInfo={showProjectInfo}
                setShowProjectInfo={setShowProjectInfo}
            />
            
            <div className="flex-grow flex flex-col p-4 max-w-4xl mx-auto w-full relative">
                
                {loading ? (
                    <div className="flex-grow flex items-center justify-center">
                        <MessageSkeleton count={4} />
                    </div>
                ) : (
                    <ChatMessages 
                        messages={messages}
                        loadingMessages={loadingMessages}
                        currentUser={user}
                        messagesEndRef={messagesEndRef}
                    />
                )}
                
                {!loading && (
                    <ChatInput 
                        onSendMessage={handleSendMessage}
                        connected={connected}
                        connecting={connecting}
                    />
                )}
            </div>
            
            {/* Subtle background pattern */}
            <div className="fixed inset-0 opacity-5 pointer-events-none z-[-1]"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.1' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                    backgroundSize: "112px 200px"
                }}>
            </div>
        </div>
    );
}