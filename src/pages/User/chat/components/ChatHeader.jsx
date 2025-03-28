import { ArrowLeft, Users, Info, X, MessageCircleMore, Circle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChatHeader({ 
    loading, 
    project, 
    connected, 
    showProjectInfo, 
    setShowProjectInfo 
}) {
    return (
        <div className="bg-[#0F111A] border-b border-gray-800/50 shadow-lg sticky top-0 z-10">
            <div className="max-w-4xl mx-auto">
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/user/projects" className="mr-4 text-yellow-400 hover:text-yellow-300">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        
                        {loading ? (
                            <div className="h-8 w-32 bg-gray-800/50 animate-pulse rounded"></div>
                        ) : (
                            <div>
                                <h1 className="text-lg font-medium text-white truncate max-w-xs">
                                    {project?.name || "Project Chat"}
                                </h1>
                                <div className="flex items-center text-xs text-gray-400">
                                    <div className="flex items-center mr-2">
                                        {connected ? (
                                            <Circle className="h-2 w-2 text-green-500 fill-green-500 mr-1" />
                                        ) : (
                                            <Loader2 className="h-2 w-2 text-yellow-500 animate-spin mr-1" />
                                        )}
                                        <span>{connected ? "Connected" : "Connecting..."}</span>
                                    </div>
                                    {project?.members && (
                                        <div className="flex items-center">
                                            <Users className="h-3 w-3 mr-1" />
                                            <span>{project.members.length} members</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <button 
                        onClick={() => setShowProjectInfo(!showProjectInfo)}
                        className="text-gray-400 hover:text-yellow-400"
                        title="Project information"
                    >
                        {showProjectInfo ? <X className="h-5 w-5" /> : <Info className="h-5 w-5" />}
                    </button>
                </div>
                
                {showProjectInfo && project && (
                    <div className="border-t border-gray-800/50 px-4 py-3 bg-[#141621]">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 bg-yellow-500/20 p-3 rounded-md">
                                <MessageCircleMore className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-yellow-400">About this project</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-lg">
                                    {project.description || "No description provided for this project."}
                                </p>
                                
                                {project.members && project.members.length > 0 && (
                                    <div className="mt-3">
                                        <div className="text-xs text-gray-500">Project members:</div>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {project.members.map(member => (
                                                <div key={member.id} className="text-xs bg-gray-800/70 px-2 py-1 rounded-full text-gray-300">
                                                    {member.username}
                                                </div>
                                            ))}
                                        </div>
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