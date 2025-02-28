import { useState, useEffect } from "react";
import { CheckCircle, Clock, XCircle, User, ArrowRight } from "lucide-react";
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
        if(!projectId || !applicationId) {
            console.error("Error: projectId or applicationId is undefined");
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Project ID or Application ID is missing. Please try again.",
            });
            return;
        }
        let feedback = "";
        if(!accept) {
            const { value } = await Swal.fire({
                title: "Provide Rejection Feedback",
                input: "text",
                inputLabel: "Why are you rejecting this applicant ? ",
                inputPlaceholder: " Optional feedback...",
                showCancelButton: true,
                confirmButtonText: "Submit",
                cancelButtonText: "Skip",
            });
            feedback = value || "";
        }
        try {
            await updateApplicationStatus(projectId, [applicationId], accept, feedback);
            Swal.fire({
                icon: "success",
                title: `Application ${accept ? "Accepted" : "Rejected"}`,
                text: `The application has been ${accept ? "accepted" : "rejected"} successfully.`,
                timer: 2000,
                showConfirmButton: false,
            });

            // Refresh the applicants list
            loadApplicants();
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Action Failed",
                text: "An error occurred while updating the application status.",
            });
        }
    };

    if (loading) {
        return <p className="text-gray-400 text-center text-lg">Loading applicants...</p>;
    }

    return (
        <div className="max-w-5xl mx-auto bg-[#1C1F2E] p-8 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-3xl font-semibold text-white mb-6">Applicants for My Projects</h2>

            {Object.keys(projectsWithApplicants).length > 0 ? (
                <div className="space-y-8">
                    {Object.entries(projectsWithApplicants).map(([projectName, applicants]) => (
                        <div key={projectName}>
                            <h3 className="text-2xl font-semibold text-blue-400 border-b border-gray-600 pb-2 mb-4">
                                {projectName}
                            </h3>

                            <div className="space-y-6">
                                {applicants.map((applicant) => (
                                    <div key={applicant.applicantUsername} className="bg-[#222435] p-5 rounded-lg shadow-md border border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="text-xl font-semibold text-white">{applicant.applicantName}</h4>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    Applied for: <span className="text-white">{applicant.positionName}</span>
                                                </p>
                                            </div>

                                            {/* Application Status */}
                                            <div className="flex items-center gap-2">
                                                {applicant.applicationStatus === "ACCEPTED" && (
                                                    <span className="flex items-center text-green-500 text-sm">
                                                        <CheckCircle className="w-5 h-5 mr-1" /> Accepted
                                                    </span>
                                                )}
                                                {applicant.applicationStatus === "PENDING" && (
                                                    <span className="flex items-center text-yellow-500 text-sm">
                                                        <Clock className="w-5 h-5 mr-1" /> Pending
                                                    </span>
                                                )}
                                                {applicant.applicationStatus === "REJECTED" && (
                                                    <span className="flex items-center text-red-500 text-sm">
                                                        <XCircle className="w-5 h-5 mr-1" /> Rejected
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* View Profile Button */}
                                        <div className="mt-4 flex justify-between items-center">
                                            <Link to={`/user/profile/view/${applicant.applicantUsername}`} className="text-blue-500 hover:text-blue-400 flex items-center gap-1">
                                                <User className="w-5 h-5" /> View Profile <ArrowRight className="w-4 h-4" />
                                            </Link>

                                            {/* Accept & Reject Buttons */}
                                            {applicant.applicationStatus === "PENDING" && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleApplicationAction(applicant.projectId, applicant.applicationId, true)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleApplicationAction(applicant.projectId, applicant.applicationId, false)}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                                    >
                                                        Reject
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
            ) : (
                <p className="text-gray-400 text-center text-lg">No applicants for your projects yet.</p>
            )}
        </div>
    );
}
