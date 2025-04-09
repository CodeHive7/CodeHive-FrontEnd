import { useState, useRef, useEffect } from "react";
import { Send, AlertCircle, Loader2, Terminal } from "lucide-react";

export default function ChatInput({ onSendMessage, connected, connecting = false, terminalStyle = false }) {
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
    
    // Terminal-style prompt
    const renderPrompt = () => {
        if (!terminalStyle) return null;
        
        return (
            <div className="absolute left-3 top-3 flex items-center font-mono text-sm">
                <span className="text-amber-500 mr-1.5">&gt;</span>
            </div>
        );
    };
    
    return (
        <div className="mt-4 relative">
            <form onSubmit={handleSubmit} className="relative">
                {!connected && (
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
                        <div className={`flex items-center ${terminalStyle ? 'bg-amber-500/10 text-amber-500' : 'bg-yellow-500/10 text-yellow-500'} px-3 py-2 rounded-full text-sm font-mono`}>
                            {connecting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {terminalStyle ? 'connection.pending()' : 'Connecting to chat...'}
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    {terminalStyle ? 'connection.status = "offline"' : 'Chat disconnected'}
                                </>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                        {renderPrompt()}
                        <textarea
                            ref={inputRef}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!connected || isSending}
                            placeholder={terminalStyle ? "message.send('your text here')" : "Type your message here..."}
                            className={`w-full ${terminalStyle ? 'bg-gray-900 border-gray-700 pl-8 font-mono' : 'bg-[#181A28] border-gray-800'} border rounded-lg py-3 px-4 pr-12 
                                text-white resize-none transition-all focus:outline-none focus:ring-1 
                                ${connected ? `focus:ring-${terminalStyle ? 'amber' : 'yellow'}-500/50 hover:border-gray-700` : 'opacity-75'}`}
                            rows={1}
                            style={{ minHeight: '50px', maxHeight: '120px' }}
                        />
                        <div className="absolute right-3 bottom-2.5 text-xs text-gray-500 font-mono">
                            {message.length > 0 && message.length >= 250 &&
                                (terminalStyle ? `len: ${message.length}/500` : `${message.length}/500`)
                            }
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!connected || !message.trim() || isSending}
                        className={`p-3 rounded-full transition-colors flex-shrink-0
                            ${!connected || !message.trim() || isSending
                                ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                                : terminalStyle 
                                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                                  : 'bg-yellow-500 text-black hover:bg-yellow-400'
                            }`}
                    >
                        {terminalStyle ? (
                            <Terminal className={`h-5 w-5 ${isSending ? 'animate-pulse' : ''}`} />
                        ) : (
                            <Send className={`h-5 w-5 ${isSending ? 'animate-pulse' : ''}`} />
                        )}
                    </button>
                </div>
            </form>
            
            <div className="mt-1.5 text-xs text-center text-gray-500 font-mono">
                {terminalStyle 
                    ? "// ENTER to execute, SHIFT+ENTER for newline" 
                    : "Press Enter to send, Shift+Enter for new line"
                }
            </div>
        </div>
    );
}