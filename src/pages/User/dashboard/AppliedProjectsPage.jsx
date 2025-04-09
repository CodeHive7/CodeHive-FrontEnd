import { useState, useEffect } from "react";
import { Briefcase, CheckCircle, Clock, XCircle, ArrowRight, Loader2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAppliedProjects } from "../../../services/userService/UserService.js";

export default function AppliedProjectsPage() {
    const [appliedProjects, setAppliedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppliedProjects();
    }, []);

    const loadAppliedProjects = async () => {
        try {
            const data = await fetchAppliedProjects();
            setAppliedProjects(data);
        } catch (error) {
            console.error("Error loading applied projects", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">user</span>
                <span className="text-white">.applications</span>
                <span className="text-amber-400">.getAll()</span>
            </h2>

            {/* Applied Projects Panel */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// projects I've applied to</h3>
                    <Briefcase className="h-5 w-5 text-amber-400" />
                </div>

                <div className="p-6 pt-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                            <p className="text-gray-400 font-mono">applications.loading()</p>
                        </div>
                    ) : appliedProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-amber-500/20 rounded-lg">
                            <div className="bg-amber-500/10 p-4 rounded-md mb-3">
                                <FileText className="w-10 h-10 text-amber-500/70" />
                            </div>
                            <p className="text-gray-400 text-lg font-mono">applications.length === 0</p>
                            <p className="text-gray-500 text-sm mt-1 font-mono">// start exploring opportunities in the projects section</p>
                            <Link
                                to="/userHome"
                                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-medium rounded-md transition-colors flex items-center gap-2 font-mono"
                            >
                                projects.browse() <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {appliedProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-gray-950 p-6 rounded-lg shadow-md border border-amber-500/30 hover:border-amber-500/50 transition-all hover:shadow-lg"
                                >
                                    {/* Project Header */}
                                    <div className="border-b border-amber-500/30 pb-3 mb-4 flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-amber-400 font-mono">{project.name}</h3>
                                        <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md">
                                            application.id = {project.id}
                                        </span>
                                    </div>

                                    {/* Project Details */}
                                    <div className="space-y-2 text-sm font-mono">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">.role</span>
                                            <span className="font-medium text-white">{project.positions[0]?.roleName || "Unknown Role"}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">.status</span>
                                            <span className="font-medium">
                                                {project.applicationStatus === "ACCEPTED" && (
                                                    <span className="text-green-400 flex items-center">
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        ACCEPTED
                                                    </span>
                                                )}
                                                {project.applicationStatus === "PENDING" && (
                                                    <span className="text-amber-400 flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        PENDING
                                                    </span>
                                                )}
                                                {project.applicationStatus === "REJECTED" && (
                                                    <span className="text-red-400 flex items-center">
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        REJECTED
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Feedback Section */}
                                    {project.feedback && (
                                        <div className="mt-4 p-3 bg-gray-900/50 rounded-md">
                                            <p className="text-gray-300 text-sm font-mono">
                                                <span className="text-amber-400 font-medium">.feedback:</span> "{project.feedback}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-5 flex items-center justify-end pt-3 border-t border-amber-500/30">
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="flex items-center bg-amber-500 hover:bg-amber-400 text-black px-3 py-1.5 rounded-md text-sm font-medium transition-colors font-mono"
                                        >
                                            project.view() <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
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