import { useState } from "react";
import { Briefcase, CheckCircle, Clock, XCircle } from "lucide-react";

export default function AppliedProjectsPage() {
    // Fake applied projects data
    const [appliedProjects] = useState([
        {
            id: 1,
            name: "Blockchain Voting System",
            role: "Frontend Developer",
            status: "PENDING",
        },
        {
            id: 2,
            name: "AI-Powered Stock Prediction",
            role: "Data Scientist",
            status: "ACCEPTED",
        },
        {
            id: 3,
            name: "VR Fitness App",
            role: "Backend Developer",
            status: "REJECTED",
        },
    ]);

    return (
        <div className="max-w-5xl mx-auto bg-[#1C1F2E] p-8 rounded-lg shadow-lg border border-gray-700">
            {/* Page Header */}
            <h2 className="text-3xl font-semibold text-white mb-6">Projects I've Applied To</h2>

            {/* Applied Projects List */}
            {appliedProjects.length > 0 ? (
                <div className="space-y-6">
                    {appliedProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-[#222435] p-5 rounded-lg shadow-md border border-gray-700"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl font-semibold text-white">{project.name}</h4>
                                    <p className="text-gray-400 text-sm mt-1">Role: {project.role}</p>
                                </div>

                                {/* Application Status */}
                                <div className="flex items-center gap-2">
                                    {project.status === "ACCEPTED" && (
                                        <span className="flex items-center text-green-500 text-sm">
                                            <CheckCircle className="w-5 h-5 mr-1" /> Accepted
                                        </span>
                                    )}
                                    {project.status === "PENDING" && (
                                        <span className="flex items-center text-yellow-500 text-sm">
                                            <Clock className="w-5 h-5 mr-1" /> Pending
                                        </span>
                                    )}
                                    {project.status === "REJECTED" && (
                                        <span className="flex items-center text-red-500 text-sm">
                                            <XCircle className="w-5 h-5 mr-1" /> Rejected
                                        </span>
                                    )}
                                </div>
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
