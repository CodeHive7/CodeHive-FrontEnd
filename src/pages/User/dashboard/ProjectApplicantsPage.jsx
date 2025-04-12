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
                title: "Exception Thrown",
                html: "<span style='font-family:monospace'>Error: projectId or applicationId is null</span>",
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
                inputLabel: "// provide reason for rejection",
                inputPlaceholder: "feedback.message = '...'",
                showCancelButton: true,
                confirmButtonText: "submit()",
                cancelButtonText: "skip()",
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
                title: "Operation Complete",
                text: `applicant.status = "${accept ? 'ACCEPTED' : 'REJECTED'}"`,
                timer: 2000,
                showConfirmButton: false,
                background: "#111827",
                color: "#ffffff"
            });

            loadApplicants();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Exception Thrown",
                html: "<span style='font-family:monospace'>Error: Failed to update application status</span>",
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
                <p className="text-gray-400 font-mono">applicants.loading()</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 px-2 sm:px-4 max-w-7xl mx-auto">
            <h2 className="text-2xl xs:text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">user</span>
                <span className="text-white">.projects</span>
                <span className="text-amber-400">.applicants()</span>
            </h2>

            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2">
                    <h3 className="text-xs xs:text-sm font-medium text-gray-400 font-mono">// people interested in your projects</h3>
                    <Users className="h-4 w-4 xs:h-5 xs:w-5 text-amber-400" />
                </div>

                <div className="p-3 xs:p-4 sm:p-6 pt-0">
                    {Object.keys(projectsWithApplicants).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 border-2 border-dashed border-amber-500/20 rounded-lg">
                            <div className="bg-amber-500/10 p-4 rounded-md mb-3">
                                <Building className="w-8 xs:w-10 h-8 xs:h-10 text-amber-500/70" />
                            </div>
                            <p className="text-gray-400 text-base xs:text-lg font-mono">applicants.length === 0</p>
                            <p className="text-gray-500 text-xs xs:text-sm mt-1 font-mono text-center px-4">// when developers apply to your projects, they will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-8 xs:space-y-10 mt-4 xs:mt-6">
                            {Object.entries(projectsWithApplicants).map(([projectName, applicants]) => (
                                <div key={projectName} className="mb-6 xs:mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-6 xs:h-8 w-1.5 bg-amber-500 rounded-sm"></div>
                                        <h3 className="text-lg xs:text-xl font-semibold text-white font-mono truncate">
                                            {projectName}
                                        </h3>
                                        <span className="ml-auto text-2xs xs:text-xs whitespace-nowrap text-gray-400 bg-amber-500/10 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded font-mono">
                                            .length = {applicants.length}
                                        </span>
                                    </div>

                                    {/* Changed grid layout to single column on mobile/tablets and 2 columns on large screens */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xs:gap-5 lg:gap-6">
                                        {applicants.map((applicant) => (
                                            <div
                                                key={applicant.applicantUsername}
                                                className="bg-gray-950 p-4 xs:p-5 sm:p-6 rounded-lg border-2 border-amber-500/30 hover:border-amber-500/50 transition-all"
                                            >
                                                <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                                                    <div className="flex items-center gap-3 xs:gap-4">
                                                        <div className="bg-amber-500/10 rounded-md p-2 xs:p-2.5">
                                                            <User className="text-amber-500 w-5 h-5 xs:w-6 xs:h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg xs:text-xl font-semibold text-white font-mono truncate max-w-[150px] xs:max-w-[240px] sm:max-w-full">{applicant.applicantName}</h4>
                                                            <p className="text-sm xs:text-base text-gray-400 font-mono truncate">@{applicant.applicantUsername}</p>
                                                        </div>
                                                    </div>

                                                    {/* Application Status - Made badges larger */}
                                                    <div className="mt-1 xs:mt-0">
                                                        {applicant.applicationStatus === "ACCEPTED" && (
                                                            <span className="flex items-center text-green-400 text-xs xs:text-sm bg-green-900/30 px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-md border border-green-600/30 font-mono">
                                                                <CheckCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5" /> ACCEPTED
                                                            </span>
                                                        )}
                                                        {applicant.applicationStatus === "PENDING" && (
                                                            <span className="flex items-center text-amber-400 text-xs xs:text-sm bg-amber-900/30 px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-md border border-amber-600/30 font-mono">
                                                                <Clock className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5" /> PENDING
                                                            </span>
                                                        )}
                                                        {applicant.applicationStatus === "REJECTED" && (
                                                            <span className="flex items-center text-red-400 text-xs xs:text-sm bg-red-900/30 px-2.5 xs:px-3 py-1 xs:py-1.5 rounded-md border border-red-600/30 font-mono">
                                                                <XCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4 mr-1.5" /> REJECTED
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Role Information - Made more spacious */}
                                                <div className="p-3 xs:p-4 bg-gray-900/70 rounded-md mb-4 xs:mb-5">
                                                    <p className="text-sm xs:text-base text-gray-300 font-mono break-words">
                                                        <span className="text-amber-400 font-medium">.appliedRole:</span> {applicant.positionName}
                                                    </p>
                                                </div>

                                                {/* Action Buttons - Increased size */}
                                                <div className="flex flex-wrap justify-between items-center mt-4 xs:mt-5 pt-3 xs:pt-4 border-t border-amber-500/20 gap-3">
                                                    <Link
                                                        to={`/user/profile/view/${applicant.applicantUsername}`}
                                                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition font-medium font-mono text-sm xs:text-base"
                                                    >
                                                        profile.view() <ArrowRight className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                                                    </Link>

                                                    {/* Accept & Reject Buttons - Made bigger */}
                                                    {applicant.applicationStatus === "PENDING" && (
                                                        <div className="flex gap-2 xs:gap-3">
                                                            <button
                                                                onClick={() => handleApplicationAction(applicant.projectId, applicant.applicationId, true)}
                                                                className="bg-amber-500 hover:bg-amber-400 text-black px-3 xs:px-4 py-1.5 xs:py-2 rounded-md text-xs xs:text-sm transition-colors flex items-center gap-1.5 font-mono"
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4" /> accept()
                                                            </button>
                                                            <button
                                                                onClick={() => handleApplicationAction(applicant.projectId, applicant.applicationId, false)}
                                                                className="bg-gray-950 border-2 border-amber-500/50 hover:border-amber-500 text-amber-400 px-3 xs:px-4 py-1.5 xs:py-2 rounded-md text-xs xs:text-sm transition-colors flex items-center gap-1.5 font-mono"
                                                            >
                                                                <XCircle className="w-3.5 h-3.5 xs:w-4 xs:h-4" /> reject()
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

            {/* Background pattern */}
            <div className="fixed inset-0 opacity-3 pointer-events-none z-[-1]"
                 style={{
                     backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                     backgroundSize: "112px 200px"
                 }}>
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