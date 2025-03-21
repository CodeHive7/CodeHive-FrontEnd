import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/Auth/AuthContext";
import { 
    ArrowLeft, 
    Send, 
    Users, 
    Clock,
    Loader2,
    AlertCircle,
    Info,
    ChevronRight,
    MessageSquare,
    Wifi,
    WifiOff
} from "lucide-react";
import Swal from "sweetalert2"; 
import { fetchProjectById } from "../../../services/userService/UserService.js";
import { 
    connectToChat, 
    disconnectFromChat, 
    subscribeToProject, 
    sendChatMessage, 
    joinProjectChat,
    subscribeToUserMessages,
    fetchChatHistory
} from "../../../services/userService/UserService.js";
import { getAccessToken } from "../../../services/Auth/tokenService.js";

export default function ProjectChatPage() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState(null);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [connected, setConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [showProjectInfo, setShowProjectInfo] = useState(false);
    const [systemMessage, setSystemMessage] = useState(null);
    
    
    // References to keep track of subscriptions
    const projectSubscriptionRef = useRef(null);
    const userSubscriptionRef = useRef(null);
    const stompClientRef = useRef(null);

    // Connect to WebSocket and initialize chat
    useEffect(() => {
        const token = getAccessToken();
        let mounted = true;

        // First fetch project details
        const initializeChat = async () => {
            try {
                // Fetch project details
                const projectData = await fetchProjectById(projectId);
                if (mounted) setProject(projectData);

                // Connect to WebSocket
                const client = connectToChat(
                    token,
                    (client) => {
                        console.log("Connection callback triggered");
                        // On successful connection
                        if (!mounted) return;
                        
                        stompClientRef.current = client;
                        setConnected(true);
                        setLoading(false);
                        console.log("Set loading state fo false");
                        
                        try {
                            console.log("Setting up project subscription");
                        // Subscribe to project channel for receiving messages
                        projectSubscriptionRef.current = subscribeToProject(
                            projectId,
                            handleMessageReceived
                        );
                        
                        // Subscribe to user-specific messages
                        console.log("Setting up user messages subscription");
                        userSubscriptionRef.current = subscribeToUserMessages(
                            handleHistoryReceived
                        );
                        
                        // Join the chat room
                        console.log("Joining project chat");
                        joinProjectChat(projectId);
                        
                        // Fetch message history
                        console.log("Fetching chat history");
                        fetchChatHistory(projectId);
                        
                        setSystemMessage({
                            content: "Connected to chat server",
                            timestamp: new Date(),
                            isSystem: true
                        });
                        console.log("Chat initialization complete");
                    } catch (error) {
                        console.error("Error in connection setup:", error);
                        setLoading(false);
                        setError({
                            title: "Chat Setup Failed",
                            message: "Could not setup chat. Please try again later."
                        });
                    }
                    },
                    (error) => {
                        // On connection error
                        if (!mounted) return;
                        console.error("WebSocket connection failed:", error);
                        setConnected(false);
                        setLoading(false);
                        setError({
                            title: "Connection Failed",
                            message: "Could not connect to the chat server. Using fallback mode."
                        });
                        
                        setSystemMessage({
                            content: "Failed to connect to chat server",
                            timestamp: new Date(),
                            isSystem: true
                        });
                    }
                );
            } catch (error) {
                console.error("Error initializing chat:", error);
                if (mounted) {
                    setError({
                        title: "Failed to Load Chat",
                        message: "Could not load project details. Please try again later."
                    });
                    setLoading(false);
                }
            }
        };

        initializeChat();

        const safetyTimeout = setTimeout(() => {
            if (mounted) {
                console.log("Safety timeout triggered - forcing loading to false");
                setLoading(false);
            }
        }, 10000);

        // Cleanup function
        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            if (projectSubscriptionRef.current) {
                projectSubscriptionRef.current.unsubscribe();
            }
            if (userSubscriptionRef.current) {
                userSubscriptionRef.current.unsubscribe();
            }
            disconnectFromChat();
        };
    }, [projectId]);

    // Handle receiving a new message
    const handleMessageReceived = (message) => {
        // Skip if message is from current user (already added when sent)
        if (message.senderId === user?.id && 
            message.timestamp && 
            new Date(message.timestamp).getTime() > Date.now() - 3000) {
            return;
        }
        
        setMessages(prevMessages => {
            // Check if message already exists
            const exists = prevMessages.some(m => m.id === message.id);
            if (exists) return prevMessages;
            
            return [...prevMessages, message];
        });
    };

    // Handle receiving message history
    const handleHistoryReceived = (historyMessages) => {
        console.log("History received:", historyMessages);
        // Always set loading to false regardless of whether messages were received
        setLoading(false);

        if (Array.isArray(historyMessages) && historyMessages.length > 0) {
            setMessages(historyMessages);
            console.log("Set messages from history");
        } else {
            console.log("No messages history or invalid format");
            setMessages([]);
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Handle sending a new message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !connected) return;

        try {
            setSending(true);
            
            // Send message via WebSocket
            sendChatMessage(projectId, newMessage);
            
            // Add optimistic message (will be replaced by actual message from server)
            const optimisticMessage = {
                id: `temp-${Date.now()}`,
                content: newMessage,
                senderUsername: user.username,
                senderId: user.id,
                projectId: Number(projectId),
                timestamp: new Date().toISOString()
            };
            
            setMessages(prev => [...prev, optimisticMessage]);
            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to Send",
                text: error.message || "Your message couldn't be sent. Please try again.",
                confirmButtonColor: "#EAB308"
            });
        } finally {
            setSending(false);
        }
    };

    // Group messages by date - keep existing implementation
    const groupMessagesByDate = () => {
        const grouped = {};
        const allMessages = [...messages];
        
        // Add system message at the top if it exists
        if (systemMessage) {
            const date = systemMessage.timestamp;
            const dateStr = date.toLocaleDateString();
            
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            
            grouped[dateStr].push(systemMessage);
        }
        
        messages.forEach(message => {
            if (!message.timestamp) return;
            
            const date = new Date(message.timestamp);
            const dateStr = date.toLocaleDateString();
            
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            
            grouped[dateStr].push(message);
        });
        
        return grouped;
    };

    // Keep the rest of your utility functions

    // Format timestamp to readable format
    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Get relative date display
    const getRelativeDateDisplay = (dateStr) => {
        const today = new Date().toLocaleDateString();
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
        
        if (dateStr === today) {
            return "Today";
        } else if (dateStr === yesterday) {
            return "Yesterday";
        }
        return dateStr;
    };

    // Determine if a message was sent by the current user
    const isCurrentUser = (senderUsername) => {
        return user?.username === senderUsername;
    };

    // Check if message is part of a sequence from same sender
    const isSequentialMessage = (message, index, messages) => {
        if (index === 0) return false;
        const prevMessage = messages[index - 1];
        if (message.isSystem || prevMessage.isSystem) return false;
        return message.senderUsername === prevMessage.senderUsername;
    };

    // Main render
    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0B14] to-[#12141F] text-white flex flex-col">
            {/* Header - updated to show connection state */}
            <header className="sticky top-0 z-40 border-b border-yellow-500/30 bg-[#0A0B14]/95 backdrop-blur-sm shadow-md">
                <div className="flex h-16 items-center px-6">
                    <Link to={`/user/messages`} className="mr-4 hover:text-yellow-400 flex items-center">
                        <ArrowLeft className="h-6 w-6 mr-2" />
                        <span>Back</span>
                    </Link>
                    
                    {loading ? (
                        <div className="h-6 w-32 bg-gray-800 animate-pulse rounded"></div>
                    ) : (
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-yellow-400">
                                    {project?.name || "Project Chat"}
                                </h1>
                                <div className="ml-4 px-3 py-1 bg-gray-800/70 rounded-full flex items-center border border-gray-700">
                                    <Users className="h-4 w-4 mr-1 text-yellow-400" />
                                    <span className="text-xs text-gray-300">Team Chat</span>
                                </div>
                                
                                {/* Connection indicator */}
                                <div className={`ml-2 px-2 py-1 rounded-full flex items-center ${
                                    connected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                                }`}>
                                    {connected ? (
                                        <><Wifi className="h-3 w-3 mr-1" /> <span className="text-xs">Live</span></>
                                    ) : (
                                        <><WifiOff className="h-3 w-3 mr-1" /> <span className="text-xs">Offline</span></>
                                    )}
                                </div>
                            </div>
                            
                            <button
                                onClick={() => setShowProjectInfo(!showProjectInfo)}
                                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                                aria-label="Project information"
                            >
                                <Info className="h-5 w-5 text-gray-400" />
                            </button>
                        </div>
                    )}
                </div>
                
                {/* Project Info Panel - keep existing implementation */}
                {showProjectInfo && !loading && project && (
                    <div className="bg-[#181A28] border-t border-gray-800 px-6 py-3 animate-fadeDown">
                        <div className="flex justify-between items-center">
                            <h3 className="font-medium text-yellow-400">Project Details</h3>
                            <button 
                                onClick={() => setShowProjectInfo(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <p className="text-gray-400">Category</p>
                                <p className="text-white">{project.category || "Uncategorized"}</p>
                            </div>
                            <div>
                                <p className="text-gray-400">Stage</p>
                                <p className="text-white">{project.stage || "Not specified"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <p className="text-gray-400">Description</p>
                                <p className="text-white line-clamp-2">{project.description || "No description"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Chat container - updated to render system messages */}
            <div 
                className="flex-grow flex flex-col p-4 max-w-4xl mx-auto w-full"
                ref={chatContainerRef}
            >
                {loading ? (
                    <div className="flex-grow flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <div className="h-16 w-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <MessageSquare className="h-6 w-6 text-yellow-500" />
                                </div>
                            </div>
                            <p className="text-gray-400 mt-4">Connecting to chat...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
                        <div className="bg-gray-800/50 rounded-full p-5 mb-4">
                            <AlertCircle className="h-12 w-12 text-yellow-500" />
                        </div>
                        <p className="text-xl font-medium mb-2">{error.title}</p>
                        <p className="text-sm text-center">{error.message}</p>
                        <div className="mt-6 flex space-x-4">
                            <button 
                                onClick={() => navigate("/user/messages")}
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
                ) : !loading && (!Array.isArray(messages) || messages.length === 0) ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
                        <div className="bg-gray-800/50 rounded-full p-8 mb-4 animate-pulse">
                            <MessageSquare className="h-12 w-12 text-yellow-500" />
                        </div>
                        <p className="text-xl font-medium mb-2">No messages yet</p>
                        <p className="text-sm">Be the first to send a message to the team!</p>
                        <div className="mt-8 w-full max-w-md px-8">
                            <div className="border border-dashed border-yellow-500/30 rounded-lg p-4 text-center">
                                <p className="text-sm text-yellow-400">Start the conversation with your team</p>
                                <p className="text-xs text-gray-500 mt-1">Share ideas, ask questions, or coordinate tasks</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-grow overflow-y-auto pb-4 chat-messages">
                        {/* Messages grouped by date */}
                        {Object.entries(groupMessagesByDate()).map(([dateStr, dateMessages]) => (
                            <div key={dateStr} className="mb-6">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="h-px bg-gray-800 flex-grow"></div>
                                    <span className="px-3 py-1 bg-gray-800/70 text-gray-400 text-xs rounded-full mx-2">
                                        {getRelativeDateDisplay(dateStr)}
                                    </span>
                                    <div className="h-px bg-gray-800 flex-grow"></div>
                                </div>
                                
                                {dateMessages.map((message, index) => {
                                    // Handle system messages differently
                                    if (message.isSystem) {
                                        return (
                                            <div key={`system-${index}`} className="flex justify-center my-3">
                                                <div className="bg-gray-800/50 px-3 py-1 rounded-full text-xs text-gray-400">
                                                    {message.content}
                                                </div>
                                            </div>
                                        );
                                    }
                                    
                                    const isSequential = isSequentialMessage(message, index, dateMessages);
                                    const isCurrentUserMessage = isCurrentUser(message.senderUsername);
                                    
                                    return (
                                        <div 
                                            key={message.id || `msg-${Math.random()}`} 
                                            className={`mb-2 flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div 
                                                className={`max-w-[80%] rounded-2xl px-4 py-3 
                                                    ${isSequential ? (isCurrentUserMessage ? 'rounded-tr-md' : 'rounded-tl-md') : ''}
                                                    ${isCurrentUserMessage 
                                                        ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-black' 
                                                        : 'bg-[#181A28] border border-gray-800'
                                                    }
                                                    hover:shadow-lg transition-shadow duration-200
                                                `}
                                            >
                                                {!isCurrentUserMessage && !isSequential && (
                                                    <div className="font-medium text-yellow-400 mb-1 text-sm flex items-center">
                                                        <span className="inline-block h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                                                        {message.senderUsername}
                                                    </div>
                                                )}
                                                <p className="break-words text-sm md:text-base">{message.content}</p>
                                                <div 
                                                    className={`text-xs flex items-center mt-1 justify-end ${
                                                        isCurrentUserMessage ? 'text-yellow-900' : 'text-gray-500'
                                                    }`}
                                                >
                                                    <Clock className="w-3 h-3 mr-1 inline" />
                                                    {formatTime(message.timestamp)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                {/* Message input - updated to show connection status */}
                {!error && (
                    <form 
                        onSubmit={handleSendMessage}
                        className="border-t border-gray-800 pt-4 mt-2"
                    >
                        <div className="flex bg-[#181A28] rounded-lg overflow-hidden shadow-lg border border-gray-800 focus-within:border-yellow-500/50 transition-all">
                            <input
                                type="text"
                                placeholder={connected ? "Type your message..." : "Connecting to chat server..."}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-grow bg-transparent px-4 py-3 text-white focus:outline-none"
                                disabled={sending || !connected}
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                disabled={sending || !newMessage.trim() || !connected}
                                className={`px-5 bg-yellow-500 text-black flex items-center justify-center transition-all
                                    ${(sending || !newMessage.trim() || !connected) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-600 active:bg-yellow-700'}`}
                            >
                                {sending ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Send className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <p className="text-gray-500 text-xs mt-2 text-center">
                            {connected 
                                ? "Press Enter to send your message" 
                                : "Waiting for connection..."}
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}