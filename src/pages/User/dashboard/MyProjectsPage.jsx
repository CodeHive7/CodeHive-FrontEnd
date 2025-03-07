import { useState, useEffect } from "react";
import { FolderKanban, CheckCircle, XCircle, Clock, PlusCircle, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchMyProjects } from "../../../services/userService/UserService.js";

export default function MyProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await fetchMyProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">🐝 My Projects</h2>

            {/* My Projects Panel */}
            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400">Projects I've Created</h3>
                    <FolderKanban className="h-5 w-5 text-yellow-400" />
                </div>

                <div className="p-6 pt-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                            <p className="text-gray-400">Loading your projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-yellow-500/20 rounded-lg">
                            <div className="bg-yellow-500/10 p-4 rounded-full mb-3">
                                <PlusCircle className="w-10 h-10 text-yellow-500/70" />
                            </div>
                            <p className="text-gray-400 text-lg">You haven't created any projects yet</p>
                            <p className="text-gray-500 text-sm mt-1">Share your ideas with the community</p>
                            <Link
                                to="/user/create-project"
                                className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-md transition-colors flex items-center gap-2"
                            >
                                <PlusCircle className="w-4 h-4" /> Create New Project
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-[#181A28] p-6 rounded-lg shadow-md border border-yellow-500/50 hover:border-yellow-500 transition-all hover:shadow-lg"
                                >
                                    {/* Project Header */}
                                    <div className="border-b border-yellow-500/30 pb-3 mb-4 flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-yellow-400">{project.name}</h3>
                                        <span className="text-xs font-mono bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                                            Project #{project.id}
                                        </span>
                                    </div>

                                    {/* Project Description */}
                                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                                        {project.description}
                                    </p>

                                    {/* Project Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Category:</span>
                                            <span className="font-medium text-white">{project.category || "Uncategorized"}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Status:</span>
                                            <span className="font-medium">
                                                {project.status === "ACCEPTED" && (
                                                    <span className="flex items-center text-green-500">
                                                        <CheckCircle className="w-4 h-4 mr-1" /> Accepted
                                                    </span>
                                                )}
                                                {project.status === "PENDING" && (
                                                    <span className="flex items-center text-yellow-500">
                                                        <Clock className="w-4 h-4 mr-1" /> Pending
                                                    </span>
                                                )}
                                                {project.status === "REJECTED" && (
                                                    <span className="flex items-center text-red-500">
                                                        <XCircle className="w-4 h-4 mr-1" /> Rejected
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 flex items-center justify-end pt-3 border-t border-yellow-500/30">
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="flex items-center bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                                        >
                                            View Details <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Create Project Button (when projects exist) */}
            {!loading && projects.length > 0 && (
                <div className="flex justify-center">
                    <Link
                        to="/user/create-project"
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-medium rounded-full transition-colors flex items-center gap-2"
                    >
                        <PlusCircle className="w-5 h-5" /> Create New Project
                    </Link>
                </div>
            )}

            {/* Background pattern */}
            <div className="fixed inset-0 opacity-3 pointer-events-none z-[-1]"
                 style={{
                     backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23EAB308' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                     backgroundSize: "112px 200px"
                 }}>
            </div>
        </div>
    );
}