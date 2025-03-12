import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProjectById } from "../../../services/userService/UserService.js";
import { acceptProject, rejectProject } from "../../../services/adminService/adminService.js";
import { ArrowLeft, Globe, User, Briefcase, Calendar, Loader2, CheckCircle, XCircle, Users, AlertTriangle } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminProjectDetailsPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadProject();
    }, [projectId]);

    const loadProject = async () => {
        try {
            const data = await fetchProjectById(projectId);
            setProject(data);
        } catch (error) {
            console.error("Error fetching project details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        const confirm = await Swal.fire({
            title: "Approve Project?",
            text: "This project will be visible to all users after approval.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Approve",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#10B981",
            background: "#1C1F2E",
            color: "#FFFFFF"
        });

        if (confirm.isConfirmed) {
            try {
                await acceptProject(projectId);
                Swal.fire({
                    icon: "success",
                    title: "Project Approved!",
                    text: "The project has been accepted successfully.",
                    timer: 2000,
                    background: "#1C1F2E",
                    color: "#FFFFFF",
                    showConfirmButton: false
                });
                navigate("/admin/projects");
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Action Failed",
                    text: "Failed to approve project. Please try again.",
                    background: "#1C1F2E",
                    color: "#FFFFFF"
                });
            }
        }
    };

    const handleReject = async () => {
        const { value: feedback } = await Swal.fire({
            title: "Rejection Feedback",
            input: "textarea",
            inputLabel: "Please provide feedback for the rejection",
            inputPlaceholder: "Enter your feedback here...",
            showCancelButton: true,
            background: "#1C1F2E",
            color: "#FFFFFF",
            confirmButtonColor: "#EF4444",
            inputValidator: (value) => {
                if (!value) {
                    return "Feedback is required when rejecting a project";
                }
            }
        });

        if (!feedback) return;

        try {
            await rejectProject(projectId, feedback);
            Swal.fire({
                icon: "info",
                title: "Project Rejected",
                text: "Feedback has been sent to the project owner.",
                timer: 2000,
                background: "#1C1F2E",
                color: "#FFFFFF",
                showConfirmButton: false
            });
            navigate("/admin/projects");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Action Failed",
                text: "Failed to reject project. Please try again.",
                background: "#1C1F2E",
                color: "#FFFFFF"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                <p className="text-gray-400">Loading project details...</p>
            </div>
        );
    }

    if (!project) {
        return <p className="text-gray-400 text-center text-lg">Project not found.</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <Link to="/admin/projects" className="flex items-center text-yellow-400 hover:text-yellow-300 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Projects
                </Link>
                <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">
                    Project #{project.id}
                </span>
            </div>

            {/* Admin Action Banner */}
            <div className="bg-[#181A28] p-4 rounded-lg border border-yellow-500 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
                <div>
                    <h3 className="text-lg font-medium text-white">Admin Review Required</h3>
                    <p className="text-sm text-gray-400">Please review this project before making a decision</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleApprove}
                        className="bg-green-600/80 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Project
                    </button>
                    <button
                        onClick={handleReject}
                        className="bg-red-600/80 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Project
                    </button>
                </div>
            </div>

            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md overflow-hidden">
                {/* Project Header */}
                <div className="bg-gradient-to-r from-yellow-500/10 to-transparent p-6 border-b border-yellow-500/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                🐝 {project.name}
                            </h1>
                            <p className="text-yellow-400 mt-1">{project.category || "Uncategorized"}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-600/30">
                                <AlertTriangle className="w-4 h-4 mr-1" /> Pending Review
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                            <User className="w-4 h-4 text-yellow-400" />
                            <span>Created by <span className="font-medium text-white">{project.creatorName}</span></span>
                        </div>
                        {project.createdAt && (
                            <div className="flex items-center gap-2 text-gray-300">
                                <Calendar className="w-4 h-4 text-yellow-400" />
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Project Body */}
                <div className="p-6">
                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-3">Description</h3>
                        <div className="bg-[#181A28] p-5 rounded-lg border border-yellow-500/30">
                            <p className="text-gray-300 whitespace-pre-line">{project.description}</p>
                        </div>
                    </div>

                    {/* Problem to Fix */}
                    {project.problemToFix && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Problem Addressed</h3>
                            <div className="bg-[#181A28] p-5 rounded-lg border border-yellow-500/30">
                                <p className="text-gray-300 whitespace-pre-line">{project.problemToFix}</p>
                            </div>
                        </div>
                    )}

                    {/* Project Stage */}
                    {project.stage && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Project Stage</h3>
                            <div className="bg-[#181A28] p-5 rounded-lg border border-yellow-500/30">
                                <p className="text-gray-300">{project.stage}</p>
                            </div>
                        </div>
                    )}

                    {/* Website Link */}
                    {project.websiteUrl && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Project Link</h3>
                            <a
                                href={project.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center bg-[#181A28] p-4 rounded-lg border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                            >
                                <Globe className="w-5 h-5 mr-2" />
                                {project.websiteUrl}
                            </a>
                        </div>
                    )}

                    {/* Application Questions */}
                    {(project.question1 || project.question2) && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-yellow-400 mb-3">Application Questions</h3>
                            <div className="bg-[#181A28] p-5 rounded-lg border border-yellow-500/30 space-y-3">
                                {project.question1 && (
                                    <div>
                                        <p className="text-sm text-gray-400">Question 1:</p>
                                        <p className="text-white">{project.question1}</p>
                                    </div>
                                )}
                                {project.question2 && (
                                    <div>
                                        <p className="text-sm text-gray-400">Question 2:</p>
                                        <p className="text-white">{project.question2}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Available Positions */}
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                            <Users className="mr-2 h-5 w-5" /> Positions
                        </h3>

                        {project.positions.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {project.positions.map((position) => (
                                    <div
                                        key={position.id}
                                        className="bg-[#181A28] p-5 rounded-lg border border-yellow-500/30"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-lg font-semibold text-white">{position.roleName}</h4>
                                            <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                                                {position.quantity} {position.quantity === 1 ? 'spot' : 'spots'}
                                            </span>
                                        </div>

                                        <div className="flex items-center text-sm">
                                            <div className="bg-yellow-500/10 rounded-full p-1.5">
                                                <Briefcase className="w-4 h-4 text-yellow-400" />
                                            </div>
                                            <span className="ml-2 text-gray-300">
                                                {position.paid ? "Paid Position" : "Volunteer Position"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-[#181A28] rounded-lg border border-dashed border-yellow-500/30">
                                <p className="text-gray-400">No positions defined for this project.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review and Decision Footer */}
            <div className="bg-[#181A28] p-6 rounded-lg border border-yellow-500/30">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Make Your Decision</h3>
                <p className="text-gray-300 mb-6">Review the project details carefully before making a decision. Once approved, the project will be visible to all users.</p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleApprove}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors font-medium"
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approve Project
                    </button>
                    <button
                        onClick={handleReject}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors font-medium"
                    >
                        <XCircle className="w-5 h-5 mr-2" />
                        Reject Project
                    </button>
                </div>
            </div>

            {/* Background pattern */}
            <div className="fixed inset-0 opacity-3 pointer-events-none z-[-1]"
                 style={{
                     backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23EAB308' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                     backgroundSize: "112px 200px"
                 }}>
            </div>
        </div>
    );
}