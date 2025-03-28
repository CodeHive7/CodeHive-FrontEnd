import { useState, useCallback, useRef, useEffect } from 'react';
import { getAccessToken } from "../../../../services/Auth/tokenService.js";
import {
    connectToChat,
    disconnectFromChat,
    subscribeToProject,
    subscribeToUserMessages,
    joinProjectChat,
    fetchChatHistory,
    sendChatMessage
} from "../../../../services/userService/UserService.js";

export default function useChatConnection() {
    const [connected, setConnected] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState(null);
    
    // Refs
    const stompClientRef = useRef(null);
    const projectSubscriptionRef = useRef(null);
    const userSubscriptionRef = useRef(null);
    const projectIdRef = useRef(null);
    const connectionTimeoutRef = useRef(null);
    const messageHandlerRef = useRef(null);
    const historyHandlerRef = useRef(null);
    const mountedRef = useRef(true);  // Track if component is mounted
    
    // Cleanup function to reset subscriptions
    const cleanupSubscriptions = useCallback(() => {
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
    }, []);
    
    // Connect to the chat service
    const connect = useCallback(async (projectId, onMessageReceived, onHistoryReceived) => {
        if (connecting) {
            console.log("Connection already in progress");
            return;
        }

        try {
            console.log("Force cleaning previous connection state");
            cleanupSubscriptions();
            disconnectFromChat();
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (e) {
            console.warn("Cleanup error", e);
        }
        
        if (!projectId || !onMessageReceived || !onHistoryReceived) {
            console.error("Missing required connection parameters:", 
                { hasProjectId: !!projectId, hasMessageHandler: !!onMessageReceived, hasHistoryHandler: !!onHistoryReceived });
            throw new Error("Missing required connection parameters");
        }
        
        // Store connection parameters in local variables for closure safety
        const safeProjectId = projectId;
        const safeMessageHandler = onMessageReceived;
        const safeHistoryHandler = onHistoryReceived;
        
        // Store these values in refs
        projectIdRef.current = safeProjectId;
        messageHandlerRef.current = safeMessageHandler;
        historyHandlerRef.current = message => safeHistoryHandler(message, safeProjectId);
        
        console.log("Connection parameters stored:", {
            projectId: safeProjectId,
            hasMessageHandler: !!safeMessageHandler,
            hasHistoryHandler: !!safeHistoryHandler
        });
        
        setConnecting(true);
        setError(null);
        
        console.log(`Starting connection for project ${safeProjectId}`);
        
        try {
            const token = getAccessToken();
            if (!token) throw new Error("No authentication token available");
            
            // Set connection timeout
            connectionTimeoutRef.current = setTimeout(() => {
                if (!mountedRef.current) return;
                console.error("Connection timeout after 15s");
                setConnecting(false);
                setError(new Error("Connection timeout"));
            }, 15000);
            
            // Connect to the chat service
            const client = await new Promise((resolve, reject) => {
                try {
                    const stompClient = connectToChat(
                        token,
                        (client) => {
                            if (!mountedRef.current) return;
                            resolve(client);
                        },
                        (error) => {
                            if (!mountedRef.current) return;
                            reject(error);
                        }
                    );
                    
                    if (!stompClient) reject(new Error("Failed to create STOMP client"));
                } catch (err) {
                    reject(err);
                }
            });
            
            if (!mountedRef.current) return;
            
            stompClientRef.current = client;
            setConnected(true);
            console.log("Successfully connected to WebSocket");
            
            // Add a delay to allow connection to stabilize
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (!mountedRef.current) return;
            
            // Double-check refs are still valid (in case component unmounted)
            console.log("Checking refs before subscription:", {
                projectIdAvailable: !!projectIdRef.current,
                messageHandlerAvailable: !!messageHandlerRef.current
            });
            
            // Use our closure-safe variables instead of the refs for the actual operations
            console.log(`Setting up subscription for project ${safeProjectId}`);
            const projectSub = subscribeToProject(safeProjectId, safeMessageHandler);
            if (!projectSub) {
                throw new Error("Failed to subscribe to project channel");
            }
            
            if (!mountedRef.current) return;
            projectSubscriptionRef.current = projectSub;
            
            // Subscribe to user messages channel
            const historyHandlerWrapper = messages => {
                if (!mountedRef.current) return;
                safeHistoryHandler(messages, safeProjectId);
            };
            
            const userSub = subscribeToUserMessages(historyHandlerWrapper);
            if (!userSub) {
                throw new Error("Failed to subscribe to user messages");
            }
            
            if (!mountedRef.current) return;
            userSubscriptionRef.current = userSub;
            
            // Add delay for subscriptions to establish
            await new Promise(resolve => setTimeout(resolve, 800));
            if (!mountedRef.current) return;
            
            // Join chat and request history
            joinProjectChat(safeProjectId);
            
            // Wait a bit before requesting history
            await new Promise(resolve => setTimeout(resolve, 800));
            if (!mountedRef.current) return;
            
            fetchChatHistory(safeProjectId);
            
            // Clear connection timeout
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
                connectionTimeoutRef.current = null;
            }
            
        } catch (error) {
            console.error("Connection error:", error);
            if (mountedRef.current) {
                setError(error);
                setConnected(false);
                cleanupSubscriptions();
            }
            
            if (connectionTimeoutRef.current) {
                clearTimeout(connectionTimeoutRef.current);
                connectionTimeoutRef.current = null;
            }
        } finally {
            if (mountedRef.current) {
                setConnecting(false);
            }
        }
    }, [connecting, cleanupSubscriptions]);
    
    // Disconnect from the chat service
    const disconnect = useCallback(() => {
        cleanupSubscriptions();
        disconnectFromChat();
        setConnected(false);
        setConnecting(false);
        setError(null);
        projectIdRef.current = null;
        messageHandlerRef.current = null;
        historyHandlerRef.current = null;
    }, [cleanupSubscriptions]);
    
    // Send a message
    const sendMessage = useCallback((projectId, content) => {
        if (!connected) {
            throw new Error("Not connected to chat");
        }
        
        try {
            sendChatMessage(projectId, content);
            return true;
        } catch (error) {
            console.error("Error sending message:", error);
            return false;
        }
    }, [connected]);
    
    // Track component mount state
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            cleanupSubscriptions();
            disconnectFromChat();
        };
    }, [cleanupSubscriptions]);
    
    return {
        connected,
        connecting,
        error,
        connect,
        disconnect,
        sendMessage
    };
}