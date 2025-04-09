import { ArrowLeft, Users, Info, X, MessageCircleMore, Circle, Loader2, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChatHeader({ 
    loading, 
    project, 
    connected, 
    showProjectInfo, 
    setShowProjectInfo,
    terminalStyle = false
}) {
    return (
        <div className={`${terminalStyle ? 'bg-gray-950' : 'bg-[#0F111A]'} border-b border-gray-800/50 shadow-lg sticky top-0 z-10`}>
            <div className="max-w-4xl mx-auto">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/user/messages" className={`mr-4 ${terminalStyle ? 'text-amber-400 hover:text-amber-300' : 'text-yellow-400 hover:text-yellow-300'}`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        
                        {loading ? (
                            <div className="h-8 w-32 bg-gray-800/50 animate-pulse rounded"></div>
                        ) : (
                            <div className={terminalStyle ? 'font-mono' : ''}>
                                <h1 className="text-lg font-medium text-white truncate max-w-xs">
                                    {terminalStyle ? (
                                        <>
                                            <span className="text-amber-400">chat</span>.
                                            <span className="text-white">{project?.name || "project"}</span>
                                            <span className="text-amber-400">()</span>
                                        </>
                                    ) : (
                                        project?.name || "Project Chat"
                                    )}
                                </h1>
                                <div className="flex items-center text-xs text-gray-400">
                                    <div className="flex items-center mr-2">
                                        {connected ? (
                                            <>
                                                <Circle className={`h-2 w-2 ${terminalStyle ? 'text-green-500' : 'text-green-500'} fill-green-500 mr-1`} />
                                                {terminalStyle ? (
                                                    <span>status: <span className="text-green-500">"connected"</span></span>
                                                ) : (
                                                    <span>Connected</span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Loader2 className={`h-2 w-2 ${terminalStyle ? 'text-amber-500' : 'text-yellow-500'} animate-spin mr-1`} />
                                                {terminalStyle ? (
                                                    <span>status: <span className="text-amber-500">"connecting"</span></span>
                                                ) : (
                                                    <span>Connecting...</span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {project?.members && (
                                        <div className="flex items-center">
                                            <Users className="h-3 w-3 mr-1" />
                                            {terminalStyle ? (
                                                <span>members: {project.members.length}</span>
                                            ) : (
                                                <span>{project.members.length} members</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => setShowProjectInfo(!showProjectInfo)}
                        className={`${terminalStyle ? 'text-gray-400 hover:text-amber-400' : 'text-gray-400 hover:text-yellow-400'}`}
                        title={terminalStyle ? "project.info()" : "Project information"}
                    >
                        {showProjectInfo ? <X className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                    </button>
                </div>
                
                {showProjectInfo && project && (
                    <div className={`border-t border-gray-800/50 px-4 py-3 ${terminalStyle ? 'bg-gray-900' : 'bg-[#141621]'}`}>
                        <div className="flex items-start gap-4">
                            <div className={`flex-shrink-0 ${terminalStyle ? 'bg-amber-500/20' : 'bg-yellow-500/20'} p-3 rounded-md`}>
                                {terminalStyle ? (
                                    <Terminal className="h-6 w-6 text-amber-500" />
                                ) : (
                                    <MessageCircleMore className="h-6 w-6 text-yellow-500" />
                                )}
                            </div>
                            <div className={`flex-1 ${terminalStyle ? 'font-mono' : ''}`}>
                                {terminalStyle ? (
                                    <h3 className="text-sm font-medium text-amber-400">project.getMetadata()</h3>
                                ) : (
                                    <h3 className="text-sm font-medium text-yellow-400">About this project</h3>
                                )}
                                
                                <p className="text-xs text-gray-400 mt-1 max-w-lg">
                                    {terminalStyle ? (
                                        <>// {project.description || "No description provided for this project."}</>
                                    ) : (
                                        project.description || "No description provided for this project."
                                    )}
                                </p>
                                
                                {project.members && project.members.length > 0 && (
                                    <div className="mt-3">
                                        {terminalStyle ? (
                                            <div className="text-xs text-gray-500">project.team = [</div>
                                        ) : (
                                            <div className="text-xs text-gray-500">Project members:</div>
                                        )}
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {project.members.map((member, index) => (
                                                <div key={member.id} className={`text-xs ${terminalStyle ? 'bg-gray-800' : 'bg-gray-800/70'} px-2 py-1 ${terminalStyle ? 'rounded' : 'rounded-full'} text-gray-300`}>
                                                    {terminalStyle ? (
                                                        <>{`{username: "${member.username}"}`}{index < project.members.length - 1 ? ',' : ''}</>
                                                    ) : (
                                                        member.username
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        {terminalStyle && <div className="text-xs text-gray-500 mt-1">]</div>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}