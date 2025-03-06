import { useState, useEffect } from "react";
import {
    fetchPendingProjects,
    acceptProject,
    rejectProject,
} from "../../services/adminService/adminService.js";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, Globe } from "lucide-react";

/**
 * Utility function to chunk an array into subarrays of specified size.
 */
function chunkProjects(projects, size = 2) {
    const chunks = [];
    for (let i = 0; i < projects.length; i += size) {
        chunks.push(projects.slice(i, i + size));
    }
    return chunks;
}

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
        });

        if (confirm.isConfirmed) {
            try {
                if (action === "accept") {
                    await acceptProject(projectId);
                    Swal.fire("Accepted!", "The project has been accepted.", "success");
                } else {
                    const { value: feedback } = await Swal.fire({
                        title: "Reject Project",
                        input: "textarea",
                        inputPlaceholder: "Enter feedback for rejection...",
                        showCancelButton: true,
                        confirmButtonText: "Reject",
                        cancelButtonText: "Cancel",
                    });

                    if (!feedback) return;
                    await rejectProject(projectId, feedback);
                    Swal.fire("Rejected!", "The project has been rejected.", "success");
                }

                // Smoothly remove project from UI
                setTimeout(() => {
                    setProjects((prev) => prev.filter((p) => p.id !== projectId));
                }, 1000);
            } catch (error) {
                Swal.fire("Error", `Failed to ${action} project.`, "error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0A0B14] to-[#12141F] text-white py-8">
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold mb-8 text-center text-yellow-400">Pending Projects</h1>

                {loading ? (
                    <p className="text-gray-400 text-center text-lg">Loading projects...</p>
                ) : projects.length === 0 ? (
                    <p className="text-gray-400 text-center text-lg">No projects available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-[#181A28] p-6 rounded-lg shadow-lg border border-yellow-500 transition hover:shadow-2xl transform hover:scale-105"
                            >
                                {/* Project Header */}
                                <div className="border-b border-yellow-500 pb-4 mb-4 flex justify-between">
                                    <h3 className="text-2xl font-bold text-yellow-400">{project.name}</h3>
                                    <p className="text-sm text-gray-400">#{project.id}</p>
                                </div>

                                {/* Project Details */}
                                <div className="space-y-2">
                                    <p className="text-gray-300 text-lg">
                                        <span className="font-semibold text-white">Stage:</span> {project.stage}
                                    </p>
                                    <p className="text-gray-300 text-lg">
                                        <span className="font-semibold text-white">Category:</span> {project.category}
                                    </p>
                                    <p className="text-gray-300 text-lg">
                                        <span className="font-semibold text-white">Status:</span>{" "}
                                        <span
                                            className={`font-bold ${
                                                project.status === "PENDING"
                                                    ? "text-yellow-500"
                                                    : project.status === "ACCEPTED"
                                                        ? "text-green-500"
                                                        : "text-red-500"
                                            }`}
                                        >
                                            {project.status}
                                        </span>
                                    </p>
                                    {project.websiteUrl && (
                                        <p className="text-lg mt-3">
                                            <a
                                                href={project.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-yellow-400 hover:underline"
                                            >
                                                <Globe className="w-5 h-5 mr-2" /> Visit Website
                                            </a>
                                        </p>
                                    )}
                                </div>

                                {/* Project Description */}
                                <div className="mt-4 p-3 bg-gray-900 rounded-md shadow-sm">
                                    <p className="text-gray-300">
                                        <span className="font-semibold text-white">Description:</span> {project.description}
                                    </p>
                                </div>

                                {/* Buttons for Admin Actions */}
                                {project.status === "PENDING" && (
                                    <div className="mt-6 flex justify-between">
                                        <button
                                            onClick={() => handleAction(project.id, "accept")}
                                            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-green-700 transition transform hover:scale-105"
                                        >
                                            <CheckCircle className="w-5 h-5 mr-2" /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleAction(project.id, "reject")}
                                            className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-red-700 transition transform hover:scale-105"
                                        >
                                            <XCircle className="w-5 h-5 mr-2" /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
