import { useState, useEffect } from "react";
import { fetchRejectedProjects } from "../../services/adminService/adminService.js";
import { Globe, XCircle, Loader2, AlertOctagon, ExternalLink } from "lucide-react";

export default function RejectedProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllProjects();
    }, []);

    const loadAllProjects = async () => {
        setLoading(true);
        try {
            const data = await fetchRejectedProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">🐝 Rejected Projects</h2>

            {/* Projects Container */}
            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400">Review Past Rejections</h3>
                    <XCircle className="h-5 w-5 text-red-400" />
                </div>

                <div className="p-6 pt-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                            <p className="text-gray-400">Loading rejected projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-yellow-500/20 rounded-lg">
                            <div className="bg-yellow-500/10 p-4 rounded-full mb-3">
                                <AlertOctagon className="w-10 h-10 text-yellow-500/70" />
                            </div>
                            <p className="text-gray-400 text-lg">No rejected projects</p>
                            <p className="text-gray-500 text-sm mt-1">All submissions have been accepted</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-[#181A28] p-6 rounded-lg shadow-md border border-yellow-500/50 hover:border-yellow-500 transition-all"
                                >
                                    {/* Project Header */}
                                    <div className="border-b border-yellow-500/30 pb-3 mb-4 flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-yellow-400">{project.name}</h3>
                                        <span className="text-xs font-mono bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                                            Project #{project.id}
                                        </span>
                                    </div>

                                    {/* Project Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Stage:</span>
                                            <span className="font-medium text-white">{project.stage}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Category:</span>
                                            <span className="font-medium text-white">{project.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Status:</span>
                                            <span className="font-medium text-red-400 flex items-center">
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Rejected
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Description */}
                                    <div className="mt-4 p-3 bg-black/30 rounded-md">
                                        <p className="text-gray-300 text-sm line-clamp-3">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Website Link */}
                                    {project.websiteUrl && (
                                        <a
                                            href={project.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-flex items-center text-yellow-400 hover:text-yellow-300 text-sm"
                                        >
                                            <Globe className="w-4 h-4 mr-1" />
                                            Visit Website
                                        </a>
                                    )}

                                    {/* Rejection Feedback */}
                                    {project.feedback && (
                                        <div className="mt-5 pt-3 border-t border-yellow-500/30">
                                            <div className="p-3 bg-red-500/10 rounded-md border border-red-500/30">
                                                <p className="text-red-400 text-sm font-medium mb-2 flex items-center">
                                                    <AlertOctagon className="w-4 h-4 mr-1.5" />
                                                    Rejection Reason
                                                </p>
                                                <p className="text-gray-300 text-sm pl-6">{project.feedback}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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