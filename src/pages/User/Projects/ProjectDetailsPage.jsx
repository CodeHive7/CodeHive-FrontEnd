import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProjectById, applyForPosition } from "../../../services/userService/UserService.js";
import { ArrowLeft, Globe, User, Briefcase, CheckCircle, Users, Calendar, Loader2, Clock, XCircle } from "lucide-react";
import { getAccessToken } from "../../../services/Auth/tokenService.js";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

export default function ProjectDetailsPage() {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loggedInUsername, setLoggedInUsername] = useState("");

    useEffect(() => {
        loadProject();
        decodeToken();
    }, []);

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

    const decodeToken = () => {
        const accessToken = getAccessToken();
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                setLoggedInUsername(decodedToken.sub);
            } catch (error) {
                console.error("Error decoding JWT token", error);
            }
        }
    };

    const handleApply = async (positionId) => {
        const positionIndex = project.positions.findIndex(pos => pos.id === positionId);
        if (positionIndex === -1) return;

        if (project.creatorName === loggedInUsername) {
            Swal.fire({
                icon: "warning",
                title: "Application Not Allowed",
                text: "You cannot apply for your own project.",
                background: "#1C1F2E",
                color: "#ffffff",
                confirmButtonColor: "#EAB308"
            });
            return;
        }

        if (project.positions[positionIndex].quantity === 0) {
            Swal.fire({
                icon: "info",
                title: "No Spots Left",
                text: "This position is already filled.",
                background: "#1C1F2E",
                color: "#ffffff",
                confirmButtonColor: "#EAB308"
            });
            return;
        }

        const hasQuestion1 = project.question1 && project.question1.trim() !== "";
        const hasQuestion2 = project.question2 && project.question2.trim() !== "";

        const processApplication = async (answers) => {
            try {
                await applyForPosition(projectId, positionId, answers);

                setProject((prevProject) => {
                    const updatedPositions = [...prevProject.positions];
                    updatedPositions[positionIndex] = {
                        ...updatedPositions[positionIndex],
                        quantity: Math.max(0, updatedPositions[positionIndex].quantity - 1),
                    };
                    return { ...prevProject, positions: updatedPositions };
                });

                Swal.fire({
                    icon: "success",
                    title: "Application Submitted",
                    text: "You have successfully applied for this position!",
                    timer: 2000,
                    showConfirmButton: false,
                    background: "#1C1F2E",
                    color: "#ffffff",
                });
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Application Failed",
                    text: error.response?.data || "An error occurred while applying. Please try again later.",
                    background: "#1C1F2E",
                    color: "#ffffff",
                    confirmButtonColor: "#EAB308"
                });
            }
        };

        if (hasQuestion1 || hasQuestion2) {
            Swal.fire({
                title: "Answer the Questions",
                html: `
                    ${hasQuestion1 ? `<p class="text-left font-semibold">${project.question1}</p>
                    <input id="answer1" class="swal2-input" placeholder="Your answer" required>` : ''}
                    ${hasQuestion2 ? `<p class="text-left font-semibold">${project.question2}</p>
                    <input id="answer2" class="swal2-input" placeholder="Your answer" required>` : ''}
                `,
                showCancelButton: true,
                confirmButtonText: "Submit Application",
                cancelButtonText: "Cancel",
                focusConfirm: false,
                background: "#1C1F2E",
                color: "#ffffff",
                confirmButtonColor: "#EAB308",
                cancelButtonColor: "#4B5563",
                preConfirm: () => {
                    const answer1 = document.getElementById("answer1")?.value.trim() || "";
                    const answer2 = document.getElementById("answer2")?.value.trim() || "";
                    if ((hasQuestion1 && !answer1) || (hasQuestion2 && !answer2)) {
                        Swal.showValidationMessage("Please answer all required questions.");
                        return false;
                    }
                    return { answer1, answer2 };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    processApplication(result.value);
                }
            });
        } else {
            processApplication({ answer1: "", answer2: "" });
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
                <Link to="/userHome" className="flex items-center text-yellow-400 hover:text-yellow-300 transition">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Projects
                </Link>
                <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded-full">
                    Project #{project.id}
                </span>
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
                            {project.status === "ACCEPTED" && (
                                <span className="flex items-center text-green-400 bg-green-900/20 px-2 py-1 rounded-lg border border-green-600/30">
                                    <CheckCircle className="w-4 h-4 mr-1" /> Active
                                </span>
                            )}
                            {project.status === "PENDING" && (
                                <span className="flex items-center text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded-lg border border-yellow-600/30">
                                    <Clock className="w-4 h-4 mr-1" /> Pending
                                </span>
                            )}
                            {project.status === "REJECTED" && (
                                <span className="flex items-center text-red-400 bg-red-900/20 px-2 py-1 rounded-lg border border-red-600/30">
                                    <XCircle className="w-4 h-4 mr-1" /> Rejected
                                </span>
                            )}
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

                    {/* Available Positions */}
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                            <Users className="mr-2 h-5 w-5" /> Available Positions
                        </h3>

                        {project.positions.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {project.positions.map((position) => (
                                    <div
                                        key={position.id}
                                        className={`bg-[#181A28] p-5 rounded-lg border ${
                                            position.quantity > 0 
                                                ? 'border-yellow-500 hover:shadow-md transition-shadow' 
                                                : 'border-gray-700 opacity-75'
                                        }`}
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-lg font-semibold text-white">{position.roleName}</h4>
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${
                                                    position.quantity > 0 
                                                        ? 'bg-yellow-500/20 text-yellow-400' 
                                                        : 'bg-gray-800 text-gray-400'
                                                }`}
                                            >
                                                {position.quantity} {position.quantity === 1 ? 'spot' : 'spots'} left
                                            </span>
                                        </div>

                                        <div className="flex items-center mb-4 text-sm">
                                            <div className="bg-yellow-500/10 rounded-full p-1.5">
                                                <Briefcase className="w-4 h-4 text-yellow-400" />
                                            </div>
                                            <span className="ml-2 text-gray-300">
                                                {position.paid ? "Paid Position" : "Volunteer Position"}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleApply(position.id)}
                                            disabled={position.quantity === 0}
                                            className={`w-full mt-3 px-4 py-2.5 rounded-md font-medium transition-colors ${
                                                position.quantity === 0 
                                                    ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
                                                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                                            }`}
                                        >
                                            {position.quantity === 0 ? "No Spots Available" : "Apply Now"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 bg-[#181A28] rounded-lg border border-dashed border-yellow-500/30">
                                <p className="text-gray-400">No positions available for this project at this time.</p>
                            </div>
                        )}
                    </div>
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