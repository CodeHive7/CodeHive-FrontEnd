import { MessageSquare, Clock, Terminal } from "lucide-react";
import MessageSkeleton from "./MessageSkeleton";
import { useEffect } from "react";

export default function ChatMessages({ 
    messages, 
    loadingMessages, 
    currentUser, 
    messagesEndRef,
    terminalStyle = false // Add terminal style prop
}) {
    // Group messages by date function
    const groupMessagesByDate = () => {
        const grouped = {};
        messages.forEach(message => {
            if (!message.timestamp) return;
            
            const dateStr = new Date(message.timestamp).toLocaleDateString();
            if (!grouped[dateStr]) {
                grouped[dateStr] = [];
            }
            grouped[dateStr].push(message);
        });
        return grouped;
    };

    // Format timestamp to readable format
    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        
        if (terminalStyle) {
            // For terminal style, show in 24h format with seconds
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        } else {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    };

    // Get relative date display
    const getRelativeDateDisplay = (dateStr) => {
        const today = new Date().toLocaleDateString();
        const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();
        
        if (terminalStyle) {
            if (dateStr === today) return "date: new Date()";
            if (dateStr === yesterday) return "date: new Date() - 86400000";
            return `date: "${dateStr}"`;
        } else {
            if (dateStr === today) return "Today";
            if (dateStr === yesterday) return "Yesterday";
            return dateStr;
        }
    };

    // Determine if a message was sent by the current user
    const isCurrentUser = (senderUsername) => {
        return currentUser?.username === senderUsername;
    };

    // Check if message is part of a sequence from same sender
    const isSequentialMessage = (message, index, messages) => {
        if (index === 0) return false;
        const prevMessage = messages[index - 1];
        if (message.isSystem || prevMessage.isSystem) return false;
        return message.senderUsername === prevMessage.senderUsername;
    };

    // Add this at the top of your component
    useEffect(() => {
        // Add a component-level timeout to exit loading state
        const timeoutId = setTimeout(() => {
            if (loadingMessages) {
                console.log("Force exiting loading state after timeout");
                // The timeout here doesn't actually change the state, but lets users
                // know they can refresh if needed
            }
        }, 10000);
        
        return () => clearTimeout(timeoutId);
    }, [loadingMessages]);

    // Update the loading button to also handle direct state reset
    if (loadingMessages) {
        console.log("Showing message skeleton while loading");
        return (
            <div className="flex-grow flex flex-col">
                <div className="mb-4 flex items-center justify-center">
                    <div className="h-px bg-gray-800 flex-grow"></div>
                    <span className={`px-3 py-1 ${terminalStyle ? 'bg-gray-800' : 'bg-gray-800/70'} text-gray-400 text-xs ${terminalStyle ? 'rounded' : 'rounded-full'} mx-2 ${terminalStyle ? 'font-mono' : ''}`}>
                        {terminalStyle ? '// loading message history' : 'Loading messages...'}
                    </span>
                    <div className="h-px bg-gray-800 flex-grow"></div>
                </div>
                <MessageSkeleton align="left" terminalStyle={terminalStyle} />
                <MessageSkeleton align="right" terminalStyle={terminalStyle} />
                <MessageSkeleton align="left" terminalStyle={terminalStyle} />
                
                {/* Add this button to manually reset loading state */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => {
                            // Dispatch a direct event to force state update
                            const event = new CustomEvent('chat-history', {
                                detail: { messages: [], projectId: window.location.pathname.split('/').pop() }
                            });
                            window.dispatchEvent(event);
                            
                            // If that doesn't work, reload the page
                            setTimeout(() => window.location.reload(), 500);
                        }}
                        className={`px-4 py-2 ${terminalStyle ? 'bg-amber-500 border border-amber-600' : 'bg-yellow-500'} hover:${terminalStyle ? 'bg-amber-600' : 'bg-yellow-600'} text-black rounded-lg text-sm ${terminalStyle ? 'font-mono' : ''}`}
                    >
                        {terminalStyle ? 'messages.refresh()' : 'Messages taking too long? Click here'}
                    </button>
                </div>
            </div>
        );
    }

    if (!messages.length) {
        return (
            <div className={`flex-grow flex flex-col items-center justify-center text-gray-400 ${terminalStyle ? 'font-mono' : ''}`}>
                <div className={`${terminalStyle ? 'bg-gray-800' : 'bg-gray-800/50'} rounded-full p-8 mb-4 animate-pulse`}>
                    {terminalStyle ? (
                        <Terminal className="h-12 w-12 text-amber-500" />
                    ) : (
                        <MessageSquare className="h-12 w-12 text-yellow-500" />
                    )}
                </div>
                <p className="text-xl font-medium mb-2">
                    {terminalStyle ? 'messages.length === 0' : 'No messages yet'}
                </p>
                <p className="text-sm">
                    {terminalStyle ? '// initialize communication with a first message' : 'Be the first to send a message to the team!'}
                </p>
                <div className="mt-8 w-full max-w-md px-8">
                    <div className={`border border-dashed ${terminalStyle ? 'border-amber-500/30' : 'border-yellow-500/30'} rounded-lg p-4 text-center`}>
                        <p className={`text-sm ${terminalStyle ? 'text-amber-400' : 'text-yellow-400'}`}>
                            {terminalStyle ? 'chat.start()' : 'Start the conversation with your team'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {terminalStyle ? '/* share ideas, ask questions, coordinate tasks */' : 'Share ideas, ask questions, or coordinate tasks'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-grow overflow-y-auto pb-4 chat-messages">
            {Object.entries(groupMessagesByDate()).map(([dateStr, dateMessages]) => (
                <div key={dateStr} className="mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="h-px bg-gray-800 flex-grow"></div>
                        <span className={`px-3 py-1 ${terminalStyle ? 'bg-gray-800' : 'bg-gray-800/70'} text-gray-400 text-xs ${terminalStyle ? 'rounded font-mono' : 'rounded-full'} mx-2`}>
                            {getRelativeDateDisplay(dateStr)}
                        </span>
                        <div className="h-px bg-gray-800 flex-grow"></div>
                    </div>
                    
                    {dateMessages.map((message, index) => {
                        if (message.isSystem) {
                            return (
                                <div key={`system-${index}`} className="flex justify-center my-3">
                                    <div className={`${terminalStyle ? 'bg-gray-800 font-mono rounded' : 'bg-gray-800/50 rounded-full'} px-3 py-1 text-xs text-gray-400`}>
                                        {terminalStyle ? `// ${message.content}` : message.content}
                                    </div>
                                </div>
                            );
                        }
                        
                        const isSequential = isSequentialMessage(message, index, dateMessages);
                        const isCurrentUserMessage = isCurrentUser(message.senderUsername);
                        
                        return (
                            <div 
                                key={message.id || `msg-${index}`} 
                                className={`mb-2 flex ${isCurrentUserMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div 
                                    className={
                                        terminalStyle
                                          ? `max-w-[80%] border ${isCurrentUserMessage 
                                              ? 'bg-amber-500/10 border-amber-500/20 rounded-md rounded-tr-none text-white' 
                                              : 'bg-gray-900 border-gray-700 rounded-md rounded-tl-none'
                                            } px-4 py-3 font-mono`
                                          : `max-w-[80%] rounded-2xl px-4 py-3 
                                              ${isSequential ? (isCurrentUserMessage ? 'rounded-tr-md' : 'rounded-tl-md') : ''}
                                              ${isCurrentUserMessage 
                                                  ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-black' 
                                                  : 'bg-[#181A28] border border-gray-800'
                                              }
                                            `
                                    }
                                >
                                    {!isCurrentUserMessage && !isSequential && (
                                        <div className={`font-medium ${terminalStyle ? 'text-amber-400' : 'text-yellow-400'} mb-1 text-sm flex items-center`}>
                                            {terminalStyle ? (
                                                <span className="text-gray-500 mr-1">user@</span>
                                            ) : (
                                                <span className="inline-block h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                                            )}
                                            {terminalStyle ? message.senderUsername.replace(/\s+/g, '_') : message.senderUsername}
                                            {terminalStyle && <span className="text-gray-500 ml-1">:~$</span>}
                                        </div>
                                    )}
                                    
                                    {isCurrentUserMessage && terminalStyle && (
                                        <div className="font-medium text-amber-400/70 text-xs mb-1 flex items-center justify-end">
                                            <span>&gt; message.send()</span>
                                        </div>
                                    )}
                                    
                                    <p className="break-words text-sm md:text-base">{message.content}</p>
                                    
                                    <div 
                                        className={`text-xs flex items-center mt-1 justify-end ${
                                            terminalStyle
                                              ? isCurrentUserMessage ? 'text-amber-600/70' : 'text-gray-500'
                                              : isCurrentUserMessage ? 'text-yellow-900' : 'text-gray-500'
                                        }`}
                                    >
                                        {terminalStyle ? (
                                            <code className="font-mono">[{formatTime(message.timestamp)}]</code>
                                        ) : (
                                            <>
                                                <Clock className="w-3 h-3 mr-1 inline" />
                                                {formatTime(message.timestamp)}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
    );
}