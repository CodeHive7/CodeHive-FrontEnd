import { useState, useEffect } from "react";
import { Briefcase, CheckCircle, Clock, XCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAppliedProjects } from "../../../services/userService/UserService.js"; // Fetching applied projects

export default function AppliedProjectsPage() {
    const [appliedProjects, setAppliedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppliedProjects();
    }, []);

    const loadAppliedProjects = async () => {
        try {
            const data = await fetchAppliedProjects(); // Fetch projects user applied to
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
        <div className="max-w-5xl mx-auto bg-[#1C1F2E] p-8 rounded-lg shadow-lg border border-gray-700">
            {/* Page Header */}
            <h2 className="text-3xl font-semibold text-white mb-6">Projects I've Applied To</h2>

            {/* Applied Projects List */}
            {appliedProjects.length > 0 ? (
                <div className="space-y-6">
                    {appliedProjects.map((project) => (
                        <div key={project.id} className="bg-[#222435] p-5 rounded-lg shadow-md border border-gray-700">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl font-semibold text-white">{project.name}</h4>
                                    <p className="text-gray-400 text-sm mt-1">Role: {project.positions[0]?.roleName || "Unknown Role"}</p>
                                    {project.feedback && (
                                        <p className="text-gray-500 text-sm mt-1 italic">Feedback: {project.feedback}</p>
                                    )}
                                </div>

                                {/* Application Status */}
                                <div className="flex items-center gap-2">
                                    {project.applicationStatus === "ACCEPTED" && (
                                        <span className="flex items-center text-green-500 text-sm">
                                            <CheckCircle className="w-5 h-5 mr-1" /> Accepted
                                        </span>
                                    )}
                                    {project.applicationStatus === "PENDING" && (
                                        <span className="flex items-center text-yellow-500 text-sm">
                                            <Clock className="w-5 h-5 mr-1" /> Pending
                                        </span>
                                    )}
                                    {project.applicationStatus === "REJECTED" && (
                                        <span className="flex items-center text-red-500 text-sm">
                                            <XCircle className="w-5 h-5 mr-1" /> Rejected
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* See Details Button */}
                            <div className="mt-4">
                                <Link to={`/projects/${project.id}`} className="text-blue-500 hover:text-blue-400 flex items-center gap-1">
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
