import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchProjectById } from "../../../services/userService/UserService.js";
import { acceptProject, rejectProject } from "../../../services/adminService/adminService.js";
import { ArrowLeft, Globe, User, Briefcase, Calendar, Loader2, CheckCircle, XCircle, Users, AlertTriangle, Code } from "lucide-react";
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
            title: "Confirm Action",
            text: `project.accept() will make this project visible to all users.`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "project.accept()",
            cancelButtonText: "cancel()",
            confirmButtonColor: "#10B981",
            background: "#111827",
            color: "#FFFFFF"
        });

        if (confirm.isConfirmed) {
            try {
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
                navigate("/admin/projects");
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Exception Thrown",
                    html: "<span style='font-family:monospace'>Error: Failed to execute project.accept()</span>",
                    background: "#111827",
                    color: "#FFFFFF"
                });
            }
        }
    };

    const handleReject = async () => {
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

        try {
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
            navigate("/admin/projects");
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Exception Thrown",
                html: "<span style='font-family:monospace'>Error: Failed to execute project.reject()</span>",
                background: "#111827",
                color: "#FFFFFF"
            });
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <p className="text-gray-400 font-mono">project.loading()</p>
            </div>
        );
    }

    if (!project) {
        return <p className="text-gray-400 text-center text-lg font-mono">project.notFound()</p>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <Link to="/admin/projects" className="flex items-center text-amber-400 hover:text-amber-300 transition font-mono">
                    <ArrowLeft className="w-5 h-5 mr-2" /> admin.projects.back()
                </Link>
                <span className="text-xs bg-amber-500/10 text-amber-500 px-2 py-1 rounded-md font-mono">
                    project.id = {project.id}
                </span>
            </div>

            {/* Admin Action Banner */}
            <div className="bg-gray-950 p-4 rounded-lg border border-amber-500/30 flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
                <div>
                    <h3 className="text-lg font-medium text-white font-mono">admin.review.required()</h3>
                    <p className="text-sm text-gray-400 font-mono">// review this project before making a decision</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleApprove}
                        className="bg-green-600/80 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors font-mono"
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        project.accept()
                    </button>
                    <button
                        onClick={handleReject}
                        className="bg-red-600/80 hover:bg-red-600 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors font-mono"
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        project.reject()
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 border border-amber-500/30 rounded-lg shadow-md overflow-hidden">
                {/* Project Header */}
                <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-6 border-b border-amber-500/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2 font-mono">
                                <Code className="h-6 w-6 text-amber-500" /> {project.name}
                            </h1>
                            <p className="text-amber-400 mt-1 font-mono">{project.category || "uncategorized"}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center text-amber-400 bg-amber-900/20 px-2 py-1 rounded-md border border-amber-600/30 font-mono">
                                <AlertTriangle className="w-4 h-4 mr-1" /> status="PENDING"
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300 font-mono">
                            <User className="w-4 h-4 text-amber-400" />
                            <span>creator: <span className="font-medium text-white">{project.creatorName}</span></span>
                        </div>
                        {project.createdAt && (
                            <div className="flex items-center gap-2 text-gray-300 font-mono">
                                <Calendar className="w-4 h-4 text-amber-400" />
                                <span>created: {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Project Body */}
                <div className="p-6">
                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-amber-400 mb-3 font-mono">project.description</h3>
                        <div className="bg-gray-950 p-5 rounded-lg border border-amber-500/30">
                            <p className="text-gray-300 whitespace-pre-line font-mono">{project.description}</p>
                        </div>
                    </div>

                    {/* Problem to Fix */}
                    {project.problemToFix && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-amber-400 mb-3 font-mono">project.problemToFix</h3>
                            <div className="bg-gray-950 p-5 rounded-lg border border-amber-500/30">
                                <p className="text-gray-300 whitespace-pre-line font-mono">{project.problemToFix}</p>
                            </div>
                        </div>
                    )}

                    {/* Project Stage */}
                    {project.stage && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-amber-400 mb-3 font-mono">project.stage</h3>
                            <div className="bg-gray-950 p-5 rounded-lg border border-amber-500/30">
                                <p className="text-gray-300 font-mono">{project.stage}</p>
                            </div>
                        </div>
                    )}

                    {/* Website Link */}
                    {project.websiteUrl && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-amber-400 mb-3 font-mono">project.websiteUrl</h3>
                            <a
                                href={project.websiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center bg-gray-950 p-4 rounded-lg border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors font-mono"
                            >
                                <Globe className="w-5 h-5 mr-2" />
                                {project.websiteUrl}
                            </a>
                        </div>
                    )}

                    {/* Application Questions */}
                    {(project.question1 || project.question2) && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-amber-400 mb-3 font-mono">project.questions[]</h3>
                            <div className="bg-gray-950 p-5 rounded-lg border border-amber-500/30 space-y-3">
                                {project.question1 && (
                                    <div>
                                        <p className="text-sm text-gray-400 font-mono">questions[0]:</p>
                                        <p className="text-white font-mono">{project.question1}</p>
                                    </div>
                                )}
                                {project.question2 && (
                                    <div>
                                        <p className="text-sm text-gray-400 font-mono">questions[1]:</p>
                                        <p className="text-white font-mono">{project.question2}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Available Positions */}
                    <div>
                        <h3 className="text-lg font-semibold text-amber-400 mb-3 flex items-center font-mono">
                            <Users className="mr-2 h-5 w-5" /> project.positions[]
                        </h3>

                        {project.positions.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {project.positions.map((position, index) => (
                                    <div
                                        key={position.id}
                                        className="bg-gray-950 p-5 rounded-lg border border-amber-500/30"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-lg font-semibold text-white font-mono">positions[{index}].roleName</h4>
                                            <span className="text-xs px-2 py-1 rounded-md bg-amber-500/20 text-amber-400 font-mono">
                                                quantity: {position.quantity}
                                            </span>
                                        </div>

                                        <div className="flex items-center text-sm">
                                            <div className="bg-amber-500/10 rounded-md p-1.5">
                                                <Briefcase className="w-4 h-4 text-amber-400" />
                                            </div>
                                            <span className="ml-2 text-gray-300 font-mono">
                                                paid: {position.paid ? "true" : "false"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-gray-950 rounded-lg border border-dashed border-amber-500/30">
                                <p className="text-gray-400 font-mono">positions.length === 0</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Review and Decision Footer */}
            <div className="bg-gray-950 p-6 rounded-lg border border-amber-500/30">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 font-mono">admin.decision.make()</h3>
                <p className="text-gray-300 mb-6 font-mono">// review project details carefully before making a decision</p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleApprove}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors font-medium font-mono"
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        project.accept()
                    </button>
                    <button
                        onClick={handleReject}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-md flex items-center justify-center transition-colors font-medium font-mono"
                    >
                        <XCircle className="w-5 h-5 mr-2" />
                        project.reject()
                    </button>
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