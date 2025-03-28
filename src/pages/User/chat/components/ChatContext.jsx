import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getAccessToken } from '../../../../services/Auth/tokenService';
import {
    connectToChat,
    disconnectFromChat,
    subscribeToProject,
    subscribeToUserMessages,
    joinProjectChat,
    fetchChatHistory,
    sendChatMessage
} from '../../../../services/userService/UserService';

const ChatContext = createContext();

export function ChatProvider({ children }) {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [connectionAttempts, setConnectionAttempts] = useState(0);
    
    // Refs to store connection state
    const stompClientRef = useRef(null);
    const projectSubscriptionRef = useRef(null);
    const userSubscriptionRef = useRef(null);
    const connectionTimeoutRef = useRef(null);
    const mountedRef = useRef(true);
    
    // Clean up function with better error handling
    const cleanupSubscriptions = () => {
        console.log("Cleaning up chat subscriptions");
        if (projectSubscriptionRef.current) {
            try {
                projectSubscriptionRef.current.unsubscribe();
            } catch (e) {
                console.warn("Error unsubscribing from project:", e);
            }
            projectSubscriptionRef.current = null;
        }
        
        if (userSubscriptionRef.current) {
            try {
                userSubscriptionRef.current.unsubscribe();
            } catch (e) {
                console.warn("Error unsubscribing from user messages:", e);
            }
            userSubscriptionRef.current = null;
        }
        
        if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
        }
    };
    
    // Message handling with better duplicate detection
    const handleNewMessage = (message) => {
        if (!message) return;
        
        // Skip system messages from the current user to avoid duplicates
        if (message.content && 
            message.content.includes("joined the conversation") &&
            stompClientRef.current?.connectHeaders?.username === message.senderUsername) {
            return;
        }
        
        setMessages(prevMessages => {
            // Check for duplicate messages with more robust detection
            const isDuplicate = prevMessages.some(m => 
                (m.id === message.id && message.id !== null) ||
                (m.content === message.content && 
                m.senderUsername === message.senderUsername &&
                Math.abs(new Date(m.timestamp || Date.now()) - new Date(message.timestamp || Date.now())) < 10000)
            );
            
            if (isDuplicate) {
                return prevMessages;
            }
            
            return [...prevMessages, message];
        });
    };
    
    // Handle message history with better error handling
    const handleMessageHistory = async (historyMessages, projectId) => {
        console.log(`Received message history for project ${projectId}:`, 
            Array.isArray(historyMessages) ? `${historyMessages.length} messages` : "no messages");
            
        setLoadingMessages(false);
        
        if (Array.isArray(historyMessages) && historyMessages.length > 0) {
            // Sort messages by timestamp
            const sortedMessages = [...historyMessages].sort((a, b) => 
                new Date(a.timestamp) - new Date(b.timestamp)
            );
            setMessages(sortedMessages);
            console.log("Message history loaded successfully:", sortedMessages.length, "messages");
        } else {
            console.log("No message history found for project:", projectId);
            setMessages([]);
        }
    };
    
    // Join chat and set up subscriptions
    const setupChat = async (projectId) => {
        if (!projectId || !stompClientRef.current) {
            console.error("Cannot set up chat: missing project ID or client");
            return false;
        }
        
        // Force check connection
        if (!stompClientRef.current.connected) {
            console.error("STOMP client not connected during setup");
            return false;
        }
        
        try {
            console.log(`Setting up chat for project ${projectId}`);
            
            // Subscribe to project messages
            const projectSub = subscribeToProject(projectId, handleNewMessage);
            if (!projectSub) {
                throw new Error("Failed to subscribe to project channel");
            }
            projectSubscriptionRef.current = projectSub;
            
            // Subscribe to user messages for history
            const userSub = subscribeToUserMessages(historyMessages => 
                handleMessageHistory(historyMessages, projectId)
            );
            if (!userSub) {
                throw new Error("Failed to subscribe to user messages");
            }
            userSubscriptionRef.current = userSub;
            
            // Allow subscriptions to establish
            await new Promise(resolve => setTimeout(resolve, 800));
            if (!mountedRef.current) return false;
            
            // Join chat
            const joinSuccess = joinProjectChat(projectId);
            if (!joinSuccess) {
                console.warn("Failed to join chat, will retry");
                await new Promise(resolve => setTimeout(resolve, 1000));
                joinProjectChat(projectId);
            }
            
            // Request message history after a short delay
            await new Promise(resolve => setTimeout(resolve, 800));
            if (!mountedRef.current) return false;
            
            fetchChatHistory(projectId);
            
            return true;
        } catch (error) {
            console.error("Error setting up chat:", error);
            return false;
        }
    };
    
    // Connect to chat service with retry mechanism
    const connect = async (projectId) => {
        if (!mountedRef.current) return false;
        
        // Safety check for multiple rapid connection attempts
        if (connecting) {
            console.log("Connection already in progress, ignoring duplicate request");
            return false;
        }
        
        // Check if already connected to this project
        if (connected && activeProjectId === projectId && projectSubscriptionRef.current) {
            console.log(`Already connected to project ${projectId}, reusing connection`);
            return true;
        }
        
        // Track connection attempts
        const attempts = connectionAttempts + 1;
        setConnectionAttempts(attempts);
        
        if (attempts > 3) {
            console.error("Too many connection attempts, resetting");
            setConnectionAttempts(0);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Force delay before allowing reconnect
        }
        
        // Reset state for new connection
        setConnecting(true);
        setMessages([]);
        setLoadingMessages(true);
        setActiveProjectId(projectId);
        
        // Clean up any existing subscriptions
        cleanupSubscriptions();
        
        try {
            console.log(`Starting connection to chat for project ${projectId}`);
            
            const token = getAccessToken();
            if (!token) throw new Error("No authentication token available");
            
            // Set connection timeout
            connectionTimeoutRef.current = setTimeout(() => {
                if (!mountedRef.current) return;
                console.error("Connection timeout after 15s");
                setConnecting(false);
            }, 15000);
            
            // Get fresh WebSocket connection by forcing disconnect first
            try {
                console.log("Forcing disconnect to clear existing connections");
                disconnectFromChat();
                await new Promise(r => setTimeout(r, 1000)); // Ensure disconnect completes
            } catch (e) {
                console.warn("Error during forced disconnect:", e);
            }
            
            // Connect to chat service
            const client = await new Promise((resolve, reject) => {
                try {
                    console.log("Creating fresh STOMP client");
                    const client = connectToChat(
                        token,
                        async (client) => {
                            if (!mountedRef.current) return;
                            console.log("STOMP client connected successfully");
                            resolve(client);
                        },
                        (error) => {
                            if (!mountedRef.current) return;
                            console.error("STOMP connection error:", error);
                            reject(error);
                        }
                    );
                    
                    if (!client) {
                        console.error("Failed to create STOMP client");
                        reject(new Error("Failed to create STOMP client"));
                    }
                } catch (err) {
                    reject(err);
                }
            });
            
            if (!mountedRef.current) return false;
            
            // Store reference and update state
            stompClientRef.current = client;
            setConnected(true);
            
            // Clear timeout
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
                connectionTimeoutRef.current = null;
            }
            
            // Set up chat after successful connection with a delay for stability
            console.log("Connection established, setting up subscriptions...");
            await new Promise(r => setTimeout(r, 1000));
            
            if (!mountedRef.current) return false;
            
            const success = await setupChat(projectId);
            if (!success) {
                throw new Error("Failed to set up chat subscriptions");
            }
            
            return true;
        } catch (error) {
            console.error("Connection error:", error);
            if (mountedRef.current) {
                cleanupSubscriptions();
                setConnected(false);
            }
            return false;
        } finally {
            if (mountedRef.current) {
                setConnecting(false);
            }
        }
    };
    
    // Disconnect from chat with proper cleanup
    const disconnect = () => {
        console.log("Disconnecting chat...");
        cleanupSubscriptions();
        disconnectFromChat();
        setConnectionAttempts(0); // Reset connection attempts
        setConnected(false);
        setConnecting(false);
        setActiveProjectId(null);
        setMessages([]);
        setLoadingMessages(true);
    };
    
    // Send a message with better error handling
    const sendMessage = (content) => {
        if (!connected || !activeProjectId) {
            console.error("Cannot send message: not connected or no active project");
            return false;
        }
        
        try {
            console.log(`Sending message to project ${activeProjectId}`);
            sendChatMessage(activeProjectId, content);
            return true;
        } catch (error) {
            console.error("Error sending message:", error);
            return false;
        }
    };
    
    // Add optimistic message 
    const addOptimisticMessage = (content, user) => {
        if (!activeProjectId || !user) return null;
        
        const optimisticMessage = {
            id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            content,
            senderUsername: user.username,
            senderId: user.id,
            projectId: Number(activeProjectId),
            timestamp: new Date().toISOString(),
            _isOptimistic: true
        };
        
        setMessages(prev => [...prev, optimisticMessage]);
        return optimisticMessage;
    };
    
    // Track mounted state
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            console.log("Chat context unmounting, cleaning up...");
            mountedRef.current = false;
            cleanupSubscriptions();
            disconnectFromChat();
        };
    }, []);
    
    // Set up fallback event listener for HTTP history
    useEffect(() => {
        const handleFallbackHistory = (event) => {
            const { messages, projectId } = event.detail;
            if (mountedRef.current && projectId === activeProjectId) {
                console.log("Received fallback history via HTTP");
                handleMessageHistory(messages, projectId);
            }
        };
        
        window.addEventListener('chat-history', handleFallbackHistory);
        
        return () => {
            window.removeEventListener('chat-history', handleFallbackHistory);
        };
    }, [activeProjectId]);
    
    const contextValue = {
        connected,
        connecting,
        activeProjectId,
        messages,
        loadingMessages,
        connect,
        disconnect,
        sendMessage,
        addOptimisticMessage
    };
    
    return (
        <ChatContext.Provider value={contextValue}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChat = () => useContext(ChatContext);