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
            <h2 className="text-2xl font-bold text-white mb-6">
                Applied Projects
            </h2>

            {/* Applied Projects Panel */}
            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
                <div className="flex flex-row items-center justify-between p-5 border-b border-gray-800">
                    <h3 className="text-lg font-medium text-white">Projects I've applied to</h3>
                    <Briefcase className="h-5 w-5 text-amber-500" />
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                            <p className="text-gray-400">Loading applications...</p>
                        </div>
                    ) : appliedProjects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-gray-800 rounded-lg">
                            <div className="bg-gray-800 p-4 rounded-full mb-3">
                                <FileText className="w-8 h-8 text-amber-500" />
                            </div>
                            <p className="text-gray-300 text-lg">No applications found</p>
                            <p className="text-gray-500 text-sm mt-1">Start exploring opportunities in the projects section</p>
                            <Link
                                to="/userHome"
                                className="mt-4 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
                            >
                                Browse Projects <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-5">
                            {appliedProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-gray-800 rounded-lg shadow-md border border-gray-700 hover:border-amber-600/30 transition-all hover:shadow-lg overflow-hidden"
                                >
                                    {/* Project Header */}
                                    <div className="p-5 border-b border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-medium text-white">{project.name}</h3>
                                            <span className="text-xs bg-gray-700 text-amber-400 px-2 py-1 rounded-md">
                                                ID: {project.id}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Details */}
                                    <div className="p-5 space-y-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Role</span>
                                            <span className="font-medium text-white">{project.positions[0]?.roleName || "Unknown Role"}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Status</span>
                                            <span className="font-medium">
                                                {project.applicationStatus === "ACCEPTED" && (
                                                    <span className="text-green-400 flex items-center">
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                        Accepted
                                                    </span>
                                                )}
                                                {project.applicationStatus === "PENDING" && (
                                                    <span className="text-amber-400 flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        Pending
                                                    </span>
                                                )}
                                                {project.applicationStatus === "REJECTED" && (
                                                    <span className="text-red-400 flex items-center">
                                                        <XCircle className="w-4 h-4 mr-1" />
                                                        Rejected
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Feedback Section */}
                                    {project.feedback && (
                                        <div className="px-5 pb-3">
                                            <div className="p-3 bg-gray-700/50 rounded-md">
                                                <p className="text-gray-300 text-sm">
                                                    <span className="text-amber-500 font-medium">Feedback:</span> "{project.feedback}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="px-5 py-3 bg-gray-700/30 flex justify-end">
                                        <Link
                                            to={`/projects/${project.id}`}
                                            className="flex items-center bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                                        >
                                            View Project <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}