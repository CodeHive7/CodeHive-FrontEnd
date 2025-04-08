import { useState, useEffect } from "react";
import { fetchAcceptedProjects } from "../../services/adminService/adminService.js";
import { Globe, CheckCircle, Award, Loader2, Code } from "lucide-react";

export default function AcceptedProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllProjects();
    }, []);

    const loadAllProjects = async () => {
        setLoading(true);
        try {
            const data = await fetchAcceptedProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">admin</span>
                <span className="text-white">.projects</span>
                <span className="text-amber-400">.getAccepted()</span>
            </h2>

            {/* Accepted Projects Cards */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md mb-6">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// projects showcase</h3>
                    <Award className="h-5 w-5 text-amber-400" />
                </div>

                <div className="p-6 pt-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                            <p className="text-gray-400 font-mono">loading.projects()</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-amber-500/20 rounded-lg">
                            <div className="bg-amber-500/10 p-4 rounded-md mb-3">
                                <Award className="w-10 h-10 text-amber-500/70" />
                            </div>
                            <p className="text-gray-400 text-lg font-mono">projects.length === 0</p>
                            <p className="text-gray-500 text-sm mt-1 font-mono">// accepted projects will appear here</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-gray-950 p-6 rounded-lg shadow-md border border-amber-500/30 hover:border-amber-500/50 transition-all hover:shadow-lg"
                                >
                                    {/* Project Header */}
                                    <div className="border-b border-amber-500/30 pb-3 mb-4 flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-amber-400 font-mono">{project.name}</h3>
                                        <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md">
                                            project.id = {project.id}
                                        </span>
                                    </div>

                                    {/* Project Details */}
                                    <div className="space-y-2 text-sm font-mono">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">.stage</span>
                                            <span className="font-medium text-white">{project.stage}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">.category</span>
                                            <span className="font-medium text-white">{project.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">.status</span>
                                            <span className="font-medium text-amber-400 flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                ACCEPTED
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Description */}
                                    <div className="mt-4 p-3 bg-gray-900/50 rounded-md">
                                        <p className="text-gray-300 text-sm line-clamp-3 font-mono">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-5 flex items-center justify-between pt-3 border-t border-amber-500/30">
                                        <div className="flex items-center text-amber-400">
                                            <Code className="w-4 h-4" />
                                            <span className="ml-2 text-sm font-medium font-mono">.approved</span>
                                        </div>
                                        {project.websiteUrl && (
                                            <a
                                                href={project.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-md text-sm font-medium transition-colors font-mono"
                                            >
                                                <Globe className="w-4 h-4 mr-1" />
                                                open.site()
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Background pattern */}
            <div className="fixed inset-0 opacity-3 pointer-events-none z-[-1]"
                 style={{
                     backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                     backgroundSize: "112px 200px"
                 }}>
            </div>
        </div>
    );
}