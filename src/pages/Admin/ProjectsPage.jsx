import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    fetchPendingProjects,
    acceptProject,
    rejectProject,
} from "../../services/adminService/adminService.js";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, Globe, Clock, Loader2, AlertTriangle, Eye } from "lucide-react";

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
            title: `Confirm Action`,
            text: `project.${action}() will trigger this operation.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `project.${action}()`,
            cancelButtonText: "cancel()",
            confirmButtonColor: action === "accept" ? "#10B981" : "#EF4444",
            background: "#111827", // Changed to match gray-900
            color: "#FFFFFF"
        });

        if (confirm.isConfirmed) {
            try {
                if (action === "accept") {
                    await acceptProject(projectId);
                    Swal.fire({
                        icon: "success",
                        title: "Operation Complete",
                        text: "project.accept() executed successfully",
                        timer: 2000,
                        background: "#111827",
                        color: "#FFFFFF",
                        showConfirmButton: false
                    });
                } else {
                    const { value: feedback } = await Swal.fire({
                        title: "Rejection Feedback",
                        input: "textarea",
                        inputLabel: "// provide feedback for rejection",
                        inputPlaceholder: "feedback.message = '...'",
                        showCancelButton: true,
                        background: "#111827",
                        color: "#FFFFFF",
                        confirmButtonColor: "#EF4444",
                        inputValidator: (value) => {
                            if (!value) {
                                return "Error: feedback.message cannot be null";
                            }
                        }
                    });

                    if (!feedback) return;
                    await rejectProject(projectId, feedback);
                    Swal.fire({
                        icon: "info",
                        title: "Operation Complete",
                        text: "project.reject() executed successfully",
                        timer: 2000,
                        background: "#111827",
                        color: "#FFFFFF",
                        showConfirmButton: false
                    });
                }

                // Smoothly remove project from UI
                setProjects((prev) => prev.filter((p) => p.id !== projectId));
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Exception Thrown",
                    html: `<span style='font-family:monospace'>Error: Failed to execute project.${action}()</span>`,
                    background: "#111827",
                    color: "#FFFFFF"
                });
            }
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6 font-mono">
                <span className="text-amber-500">admin</span>
                <span className="text-white">.projects</span>
                <span className="text-amber-400">.pending()</span>
            </h2>

            {/* Projects Container */}
            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md">
                <div className="flex flex-row items-center justify-between p-6 pb-2">
                    <h3 className="text-sm font-medium text-gray-400 font-mono">// projects awaiting review</h3>
                    <Clock className="h-5 w-5 text-amber-400" />
                </div>

                <div className="p-6 pt-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16">
                            <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                            <p className="text-gray-400 font-mono">projects.loading()</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-amber-500/20 rounded-lg">
                            <div className="bg-amber-500/10 p-4 rounded-md mb-3">
                                <CheckCircle className="w-10 h-10 text-amber-500/70" />
                            </div>
                            <p className="text-gray-400 text-lg font-mono">projects.length === 0</p>
                            <p className="text-gray-500 text-sm mt-1 font-mono">// all projects have been reviewed</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-gray-950 p-6 rounded-lg shadow-md border border-amber-500/30 hover:border-amber-500/50 transition-all"
                                >
                                    {/* Project Header */}
                                    <div className="border-b border-amber-500/30 pb-3 mb-4 flex justify-between items-center">
                                        <h3 className="text-xl font-bold text-amber-400 font-mono">{project.name}</h3>
                                        <span className="text-xs font-mono bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md">
                                            project.id = {project.id}
                                        </span>
                                    </div>

                                    {/* Project Details */}
                                    <div className="space-y-2 text-sm font-mono">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">.stage</span>
                                            <span className="font-medium text-white">{project.stage}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">.category</span>
                                            <span className="font-medium text-white">{project.category}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">.status</span>
                                            <span className="font-medium text-amber-400 flex items-center">
                                                <AlertTriangle className="w-4 h-4 mr-1" />
                                                PENDING
                                            </span>
                                        </div>
                                    </div>

                                    {/* Project Description */}
                                    <div className="mt-4 p-3 bg-gray-900/50 rounded-md">
                                        <p className="text-gray-300 text-sm line-clamp-3 font-mono">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Website Link */}
                                    {project.websiteUrl && (
                                        <a
                                            href={project.websiteUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-4 inline-flex items-center text-amber-400 hover:text-amber-300 text-sm font-mono"
                                        >
                                            <Globe className="w-4 h-4 mr-1" />
                                            site.open()
                                        </a>
                                    )}

                                    {/* View Details Link */}
                                    <div className="mt-4 mb-2">
                                        <Link
                                            to={`/admin/projects/${project.id}`}
                                            className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors font-medium font-mono"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            project.details()
                                        </Link>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-5 pt-3 border-t border-amber-500/30 flex justify-between gap-3">
                                        <button
                                            onClick={() => handleAction(project.id, "accept")}
                                            className="flex-1 bg-green-600/80 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors font-mono"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            project.accept()
                                        </button>
                                        <button
                                            onClick={() => handleAction(project.id, "reject")}
                                            className="flex-1 bg-red-600/80 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors font-mono"
                                        >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            project.reject()
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
                     backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100' viewBox='0 0 56 100'%3E%3Cpath fill='%23F59E0B' opacity='0.05' d='M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100'/%3E%3C/svg%3E\")",
                     backgroundSize: "112px 200px"
                 }}>
            </div>
        </div>
    );
}