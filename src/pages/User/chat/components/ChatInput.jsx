import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, Loader2 } from "lucide-react";

export default function ChatInput({ onSendMessage, connected, connecting = false }) {
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const inputRef = useRef(null);
    
    // Auto focus on input when component mounts or connection changes
    useEffect(() => {
        if (connected && inputRef.current) {
            setTimeout(() => {
                inputRef.current.focus();
            }, 300);
        }
    }, [connected]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!connected || !message.trim() || isSending) {
            return;
        }
        
        try {
            setIsSending(true);
            await onSendMessage(message);
            setMessage("");
        } catch (error) {
            console.error("Failed to send message:", error);
            // Could show a toast notification here
        } finally {
            setIsSending(false);
            inputRef.current?.focus();
        }
    };
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };
    
    return (
        <div className="mt-4 relative">
            <form onSubmit={handleSubmit} className="relative">
                {!connected && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                        <div className="flex items-center bg-yellow-500/10 text-yellow-500 px-3 py-2 rounded-full text-sm">
                            {connecting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Connecting to chat...
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Chat disconnected
                                </>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        <textarea
                            ref={inputRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!connected || isSending}
                            placeholder="Type your message here..."
                            className={`w-full bg-[#181A28] border border-gray-800 rounded-lg py-3 px-4 pr-12 
                                text-white resize-none transition-all focus:outline-none focus:ring-1 
                                ${connected ? 'focus:ring-yellow-500/50 hover:border-gray-700' : 'opacity-75'}`}
                            rows={1}
                            style={{ minHeight: '50px', maxHeight: '120px' }}
                        />
                        <div className="absolute right-3 bottom-2.5 text-xs text-gray-500">
                            {message.length > 0 && message.length >= 250 &&
                                `${message.length}/500`
                            }
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!connected || !message.trim() || isSending}
                        className={`p-3 rounded-full transition-colors flex-shrink-0
                            ${!connected || !message.trim() || isSending
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : 'bg-yellow-500 text-black hover:bg-yellow-400'
                            }`}
                    >
                        <Send className={`h-5 w-5 ${isSending ? 'animate-pulse' : ''}`} />
                    </button>
                </div>
            </form>
            
            <div className="mt-1.5 text-xs text-center text-gray-500">
                Press Enter to send, Shift+Enter for new line
            </div>
        </div>
    );
}