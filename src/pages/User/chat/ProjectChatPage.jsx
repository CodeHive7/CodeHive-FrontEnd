import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth/AuthContext";
import { useChat } from "./components/ChatContext.jsx";
import { fetchProjectById } from "../../../services/userService/UserService.js";
import { AlertCircle } from "lucide-react";

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
    
    // Initialize chat when component mounts
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
                    message: "The chat is taking too long to connect. Please try again."
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
                    title: "Failed to Connect",
                    message: error.message || "Unable to connect to the chat. Please try again later."
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
    
    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    
    // Add a safety timeout to clear loading state
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
    
    // Add this effect to force reset the loading state:
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
            <div className="min-h-screen bg-gradient-to-b from-[#0A0B14] to-[#12141F] text-white flex flex-col items-center justify-center p-4">
                <div className="bg-gray-800/50 rounded-full p-5 mb-4">
                    <AlertCircle className="h-12 w-12 text-yellow-500" />
                </div>
                <p className="text-xl font-medium mb-2">{error.title}</p>
                <p className="text-sm text-center max-w-md">{error.message}</p>
                <div className="mt-6 flex space-x-4">
                    <button 
                        onClick={() => {
                            disconnect(); // Ensure clean disconnect before navigating
                            navigate("/user/messages");
                        }}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
                    >
                        Back to Messages
                    </button>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg text-black transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0B14] to-[#12141F] text-white flex flex-col">
            <ChatHeader 
                loading={loading}
                project={project}
                connected={connected}
                showProjectInfo={showProjectInfo}
                setShowProjectInfo={setShowProjectInfo}
            />
            
            <div className="flex-grow flex flex-col p-4 max-w-4xl mx-auto w-full">
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
        </div>
    );
}