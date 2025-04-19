import { useState, useEffect } from "react";
import { CheckCircle, Clock, XCircle, User, ArrowRight, Loader2, Users, Building } from "lucide-react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchApplicantsForProjects, updateApplicationStatus } from "../../../services/userService/UserService.js";

export default function ProjectApplicantsPage() {
    const [projectsWithApplicants, setProjectsWithApplicants] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplicants();
    }, []);

    const loadApplicants = async () => {
        try {
            const data = await fetchApplicantsForProjects();
            const groupedProjects = {};

            data.forEach((applicant) => {
                if (!groupedProjects[applicant.projectName]) {
                    groupedProjects[applicant.projectName] = [];
                }
                groupedProjects[applicant.projectName].push(applicant);
            });

            setProjectsWithApplicants(groupedProjects);
        } catch (error) {
            console.error("Error loading applicants", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApplicationAction = async (projectId, applicationId, accept) => {
        if (!projectId || !applicationId) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Missing project or application ID",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B",
            });
            return;
        }
        
        let feedback = "";
        if (!accept) {
            const { value } = await Swal.fire({
                title: "Rejection Feedback",
                input: "text",
                inputLabel: "Provide feedback for the applicant (optional)",
                inputPlaceholder: "Explain why you're rejecting this application...",
                showCancelButton: true,
                confirmButtonText: "Submit",
                cancelButtonText: "Skip",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B",
                cancelButtonColor: "#4B5563"
            });
            feedback = value || "";
        }
        
        try {
            await updateApplicationStatus(projectId, [applicationId], accept, feedback);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: `Applicant ${accept ? 'accepted' : 'rejected'} successfully`,
                timer: 2000,
                showConfirmButton: false,
                background: "#111827",
                color: "#ffffff"
            });

            loadApplicants();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to update application status",
                background: "#111827",
                color: "#ffffff",
                confirmButtonColor: "#F59E0B",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-gray-400">Loading applicants...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-2 sm:px-4 max-w-7xl mx-auto">
            <h2 className="text-2xl xs:text-3xl font-bold text-white mb-6">
                Project Applicants
            </h2>

            <div className="bg-gray-900 rounded-lg shadow-md border border-gray-800">
                <div className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
                    <h3 className="text-xs xs:text-sm font-medium text-gray-400">People interested in your projects</h3>
                    <Users className="h-4 w-4 xs:h-5 xs:w-5 text-amber-400" />
                </div>

                <div className="p-3 xs:p-4 sm:p-6 pt-0">
                    {Object.keys(projectsWithApplicants).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 border-2 border-dashed border-gray-700 rounded-lg">
                            <div className="bg-gray-800 p-4 rounded-md mb-3">
                                <Building className="w-8 xs:w-10 h-8 xs:h-10 text-amber-500" />
                            </div>
                            <p className="text-gray-300 text-base xs:text-lg">No applicants yet</p>
                            <p className="text-gray-500 text-xs xs:text-sm mt-1 text-center px-4">
                                When developers apply to your projects, they will appear here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-8 xs:space-y-10 mt-4 xs:mt-6">
                            {Object.entries(projectsWithApplicants).map(([projectName, applicants]) => (
                                <div key={projectName} className="mb-6 xs:mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-6 xs:h-8 w-1.5 bg-amber-500 rounded-sm"></div>
                                        <h3 className="text-lg xs:text-xl font-semibold text-white truncate">
                                            {projectName}
                                        </h3>
                                        <span className="ml-auto text-2xs xs:text-xs whitespace-nowrap text-gray-400 bg-gray-800 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded">
                                            {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    {/* Changed grid layout to single column on mobile/tablets and 2 columns on large screens */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 lg:gap-6">
                                        {applicants.map((applicant) => (
                                            <div
                                                key={applicant.applicantUsername}
                                                className="bg-gray-950 p-4 xs:p-5 sm:p-6 rounded-lg border border-gray-800 hover:border-amber-500/30 transition-all"
                                            >
                                                <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                                                    <div className="flex items-center gap-3 xs:gap-4">
                                                        <div className="bg-gray-800 rounded-md p-2 xs:p-2.5">
                                                            <User className="text-amber-500 w-5 h-5 xs:w-6 xs:h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg xs:text-xl font-semibold text-white truncate max-w-[150px] xs:max-w-[240px] sm:max-w-full">{applicant.applicantName}</h4>
                                                            <p className="text-sm xs:text-base text-gray-400">@{applicant.applicantUsername}</p>
                                                        </div>
                                                    </div>

                                                    {/* Application Status - Made badges larger */}
                                                    <div className="mt-1 xs:mt-0">
                                                        {applicant.applicationStatus === "ACCEPTED" && (
                                                            <span className="flex items-center text-green-400 text-xs xs:text-sm bg-green-900/30 px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-md border border-green-600/30">
                                                                <CheckCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5" /> Accepted
                                                            </span>
                                                        )}
                                                        {applicant.applicationStatus === "PENDING" && (
                                                            <span className="flex items-center text-amber-400 text-xs xs:text-sm bg-amber-900/30 px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-md border border-amber-600/30">
                                                                <Clock className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5" /> Pending
                                                            </span>
                                                        )}
                                                        {applicant.applicationStatus === "REJECTED" && (
                                                            <span className="flex items-center text-red-400 text-xs xs:text-sm bg-red-900/30 px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-md border border-red-600/30">
                                                                <XCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5" /> Rejected
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Role Information - Made more spacious */}
                                                <div className="p-3 xs:p-4 bg-gray-900/70 rounded-md mb-4 xs:mb-5">
                                                    <p className="text-sm xs:text-base text-gray-300 break-words">
                                                        <span className="text-amber-400 font-medium">Applied role:</span> {applicant.positionName}
                                                    </p>
                                                </div>

                                                {/* Action Buttons - Increased size */}
                                                <div className="flex flex-wrap justify-between items-center mt-4 xs:mt-5 pt-3 xs:pt-4 border-t border-gray-800 gap-3">
                                                    <Link
                                                        to={`/user/profile/view/${applicant.applicantUsername}`}
                                                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition font-medium text-sm xs:text-base"
                                                    >
                                                        View Profile <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                                                    </Link>

                                                    {/* Accept & Reject Buttons - Made bigger */}
                                                    {applicant.applicationStatus === "PENDING" && (
                                                        <div className="flex gap-2 xs:gap-3">
                                                            <button
                                                                onClick={() => handleApplicationAction(applicant.projectId, applicant.applicationId, true)}
                                                                className="bg-amber-500 hover:bg-amber-400 text-black px-3 xs:px-4 py-1.5 xs:py-2 rounded-md text-xs xs:text-sm transition-colors flex items-center gap-1.5"
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4" /> Accept
                                                            </button>
                                                            <button
                                                                onClick={() => handleApplicationAction(applicant.projectId, applicant.applicationId, false)}
                                                                className="bg-gray-800 hover:bg-gray-700 text-white px-3 xs:px-4 py-1.5 xs:py-2 rounded-md text-xs xs:text-sm transition-colors flex items-center gap-1.5"
                                                            >
                                                                <XCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4" /> Reject
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Utility classes for extra small screens */}
            <style jsx>{`
                @layer utilities {
                    .text-2xs {
                        font-size: 0.65rem;
                        line-height: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}