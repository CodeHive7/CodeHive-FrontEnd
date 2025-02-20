import { useState } from "react";
import { User, CheckCircle, Clock, XCircle } from "lucide-react";

export default function ProjectApplicantsPage() {
    // Fake applicants data
    const [applicants] = useState([
        {
            id: 1,
            name: "John Doe",
            project: "E-Commerce App",
            role: "Backend Developer",
            status: "PENDING",
        },
        {
            id: 2,
            name: "Jane Smith",
            project: "AI Chatbot",
            role: "Frontend Developer",
            status: "ACCEPTED",
        },
        {
            id: 3,
            name: "Alex Johnson",
            project: "Crypto Wallet",
            role: "Blockchain Engineer",
            status: "REJECTED",
        },
    ]);

    return (
        <div className="max-w-5xl mx-auto bg-[#1C1F2E] p-8 rounded-lg shadow-lg border border-gray-700">
            {/* Page Header */}
            <h2 className="text-3xl font-semibold text-white mb-6">Applicants for My Projects</h2>

            {/* Applicants List */}
            {applicants.length > 0 ? (
                <div className="space-y-6">
                    {applicants.map((applicant) => (
                        <div
                            key={applicant.id}
                            className="bg-[#222435] p-5 rounded-lg shadow-md border border-gray-700"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-xl font-semibold text-white">{applicant.name}</h4>
                                    <p className="text-gray-400 text-sm mt-1">
                                        Applied for: <span className="text-white">{applicant.role}</span> in{" "}
                                        <span className="text-white">{applicant.project}</span>
                                    </p>
                                </div>

                                {/* Application Status */}
                                <div className="flex items-center gap-2">
                                    {applicant.status === "ACCEPTED" && (
                                        <span className="flex items-center text-green-500 text-sm">
                                            <CheckCircle className="w-5 h-5 mr-1" /> Accepted
                                        </span>
                                    )}
                                    {applicant.status === "PENDING" && (
                                        <span className="flex items-center text-yellow-500 text-sm">
                                            <Clock className="w-5 h-5 mr-1" /> Pending
                                        </span>
                                    )}
                                    {applicant.status === "REJECTED" && (
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
                <p className="text-gray-400 text-center text-lg">No applicants for your projects yet.</p>
            )}
        </div>
    );
}
