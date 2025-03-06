import { useState, useEffect } from "react";
import {
    fetchPendingProjects,
    acceptProject,
    rejectProject,
} from "../../services/adminService/adminService.js";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, Globe, Clock, Loader2, AlertTriangle } from "lucide-react";

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAllProjects();
    }, []);

    const loadAllProjects = async () => {
        setLoading(true);
        try {
            const data = await fetchPendingProjects();
            setProjects(data);
        } catch (error) {
            console.error("Error loading projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (projectId, action) => {
        const confirm = await Swal.fire({
            title: `Are you sure?`,
            text: `You are about to ${action} this project.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, ${action}!`,
            cancelButtonText: "Cancel",
            confirmButtonColor: action === "accept" ? "#10B981" : "#EF4444",
            background: "#1C1F2E",
            color: "#FFFFFF"
        });

        if (confirm.isConfirmed) {
            try {
                if (action === "accept") {
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
                } else {
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
                }

                // Smoothly remove project from UI
                setProjects((prev) => prev.filter((p) => p.id !== projectId));
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Action Failed",
                    text: `Failed to ${action} project. Please try again.`,
                    background: "#1C1F2E",
                    color: "#FFFFFF"
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">🐝 Pending Projects</h2>

            {/* Projects Container */}
            <div className="bg-[#1C1F2E] border border-yellow-500 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400">Projects Awaiting Review</h3>
                    <Clock className="h-5 w-5 text-yellow-400" />
                </div>

                <div className="p-6 pt-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mb-4" />
                            <p className="text-gray-400">Loading pending projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-yellow-500/20 rounded-lg">
                            <div className="bg-yellow-500/10 p-4 rounded-full mb-3">
                                <CheckCircle className="w-10 h-10 text-yellow-500/70" />
                            </div>
                            <p className="text-gray-400 text-lg">No pending projects</p>
                            <p className="text-gray-500 text-sm mt-1">All projects have been reviewed</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-[#181A28] p-6 rounded-lg shadow-md border border-yellow-500/50 hover:border-yellow-500 transition-all"
                                >
                                    {/* Project Header */}
                                    <div className="border-b border-yellow-500/30 pb-3 mb-4 flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-yellow-400">{project.name}</h3>
                                        <span className="text-xs font-mono bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">
                                            Project #{project.id}
                                        </span>
                                    </div>

                                    {/* Project Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Stage:</span>
                                            <span className="font-medium text-white">{project.stage}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Category:</span>
                                            <span className="font-medium text-white">{project.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Status:</span>
                                            <span className="font-medium text-yellow-400 flex items-center">
                                                <AlertTriangle className="w-4 h-4 mr-1" />
                                                Pending Review
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Description */}
                                    <div className="mt-4 p-3 bg-black/30 rounded-md">
                                        <p className="text-gray-300 text-sm line-clamp-3">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Website Link */}
                                    {project.websiteUrl && (
                                        <a
                                            href={project.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-flex items-center text-yellow-400 hover:text-yellow-300 text-sm"
                                        >
                                            <Globe className="w-4 h-4 mr-1" />
                                            Visit Website
                                        </a>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="mt-5 pt-3 border-t border-yellow-500/30 flex justify-between gap-3">
                                        <button
                                            onClick={() => handleAction(project.id, "accept")}
                                            className="flex-1 bg-green-600/80 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleAction(project.id, "reject")}
                                            className="flex-1 bg-red-600/80 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Reject
                                        </button>
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
                     backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23EAB308' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                     backgroundSize: "112px 200px"
                 }}>
            </div>
        </div>
    );
}