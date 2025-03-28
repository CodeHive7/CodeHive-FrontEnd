import { useState, useCallback } from 'react';
import { getProjectMessages } from "../../../../services/userService/UserService.js";

export default function useChatMessages(currentUser) {
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    
    // Handle new incoming message
    const handleNewMessage = useCallback((message) => {
        // Skip system messages from current user
        if (message.content && 
            message.content.includes("joined the conversation") &&
            message.senderUsername === currentUser?.username) {
            return;
        }
        
        // Add message if not a duplicate
        setMessages(prevMessages => {
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
    }, [currentUser?.username]);
    
    // Handle receiving message history
    const handleMessageHistory = useCallback(async (historyMessages, projectId) => {
        setLoadingMessages(false);
        
        if (Array.isArray(historyMessages) && historyMessages.length > 0) {
            // Sort messages by timestamp
            const sortedMessages = [...historyMessages].sort((a, b) => 
                new Date(a.timestamp) - new Date(b.timestamp)
            );
            setMessages(sortedMessages);
        } else if (projectId) {
            // Fallback to HTTP if WebSocket history fails
            try {
                const httpMessages = await getProjectMessages(projectId);
                if (Array.isArray(httpMessages) && httpMessages.length > 0) {
                    setMessages(httpMessages);
                } else {
                    setMessages([]);
                }
            } catch (error) {
                console.error("Failed to fetch messages via HTTP:", error);
                setMessages([]);
            }
        } else {
            setMessages([]);
        }
    }, []);
    
    // Add optimistic message
    const addOptimisticMessage = useCallback((content, projectId) => {
        const optimisticMessage = {
            id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            content,
            senderUsername: currentUser.username,
            senderId: currentUser.id,
            projectId: Number(projectId),
            timestamp: new Date().toISOString(),
            _isOptimistic: true
        };
        
        setMessages(prev => [...prev, optimisticMessage]);
        return optimisticMessage;
    }, [currentUser]);
    
    return {
        messages,
        loadingMessages,
        handleNewMessage,
        handleMessageHistory,
        addOptimisticMessage
    };
}