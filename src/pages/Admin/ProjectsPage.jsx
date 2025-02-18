import { useState, useEffect } from "react";
import { fetchPendingProjects, acceptProject, rejectProject } from "../../services/adminService/adminService.js";
import Swal from "sweetalert2";
import { CheckCircle, XCircle } from "lucide-react";

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

                // Smoothly remove project from UI after 3 seconds
                setTimeout(() => {
                    setProjects((prev) => prev.filter((project) => project.id !== projectId));
                }, 3000);
            } catch (error) {
                Swal.fire("Error", `Failed to ${action} project.`, "error");
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0B14] text-white p-6">
            <h1 className="text-4xl font-bold mb-8 text-center">All User Projects</h1>

            {loading ? (
                <p className="text-gray-400 text-center text-lg">Loading projects...</p>
            ) : projects.length === 0 ? (
                <p className="text-gray-400 text-center text-lg">No projects have been created yet.</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-[#12141F] p-6 rounded-lg shadow-lg border border-gray-700">
                            {/* Project Header */}
                            <div className="border-b border-gray-600 pb-4 mb-4">
                                <h3 className="text-2xl font-bold text-blue-400">{project.name}</h3>
                                <p className="text-sm text-gray-400">Project ID: #{project.id}</p>
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
                                    <span className={`font-bold ${project.status === 'PENDING' ? 'text-yellow-500' : project.status === 'ACCEPTED' ? 'text-green-500' : 'text-red-500'}`}>
                                        {project.status}
                                    </span>
                                </p>
                                {project.websiteUrl && (
                                    <p className="text-lg mt-3">
                                        <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            🔗 Visit Website
                                        </a>
                                    </p>
                                )}
                            </div>

                            {/* Project Description */}
                            <div className="mt-4 p-3 bg-gray-900 rounded-md">
                                <p className="text-gray-300">
                                    <span className="font-semibold text-white">Description:</span> {project.description}
                                </p>
                            </div>

                            {/* Buttons for Admin Actions */}
                            {project.status === "PENDING" && (
                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => handleAction(project.id, "accept")}
                                        className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-green-700 transition"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" /> Accept
                                    </button>
                                    <button
                                        onClick={() => handleAction(project.id, "reject")}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-red-700 transition"
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
    );
}
