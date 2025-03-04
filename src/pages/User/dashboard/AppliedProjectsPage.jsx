import { useState, useEffect } from "react";
import { Briefcase, CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";
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

    if (loading) {
        return <p className="text-gray-400 text-center text-lg">Loading applied projects...</p>;
    }

    return (
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-[#0A0B14] to-[#12141F] p-8 rounded-xl shadow-lg border border-yellow-500 mt-10">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-7 h-7 text-yellow-500" /> Projects I've Applied To
                </h2>
            </div>

            {/* Applied Projects List */}
            {appliedProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                    {appliedProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-[#222435] p-6 rounded-lg shadow-md border border-gray-700 hover:scale-105 transition duration-300"
                        >
                            {/* Project Title */}
                            <h4 className="text-2xl font-semibold text-white">{project.name}</h4>

                            {/* Role Applied For */}
                            <p className="text-gray-400 text-sm mt-1 flex items-center">
                                <Briefcase className="w-4 h-4 mr-1 text-gray-500" />
                                Role: <span className="ml-1 text-yellow-400">{project.positions[0]?.roleName || "Unknown Role"}</span>
                            </p>

                            {/* Feedback Section */}
                            {project.feedback && (
                                <p className="text-gray-500 text-sm mt-2 italic bg-gray-800 p-2 rounded-md">
                                    {project.feedback}
                                </p>
                            )}

                            {/* Application Status */}
                            <div className="flex items-center gap-2 mt-3">
                                {project.applicationStatus === "ACCEPTED" && (
                                    <span className="flex items-center text-green-500 text-sm bg-green-800/30 px-2 py-1 rounded-lg">
                                        <CheckCircle className="w-5 h-5 mr-1" /> Accepted
                                    </span>
                                )}
                                {project.applicationStatus === "PENDING" && (
                                    <span className="flex items-center text-yellow-500 text-sm bg-yellow-800/30 px-2 py-1 rounded-lg">
                                        <Clock className="w-5 h-5 mr-1" /> Pending
                                    </span>
                                )}
                                {project.applicationStatus === "REJECTED" && (
                                    <span className="flex items-center text-red-500 text-sm bg-red-800/30 px-2 py-1 rounded-lg">
                                        <XCircle className="w-5 h-5 mr-1" /> Rejected
                                    </span>
                                )}
                            </div>

                            {/* See Details Button */}
                            <div className="mt-4">
                                <Link
                                    to={`/projects/${project.id}`}
                                    className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition"
                                >
                                    See Details <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 text-center text-lg">You haven’t applied to any projects yet.</p>
            )}
        </div>
    );
}
